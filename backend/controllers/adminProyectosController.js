import { uploadCover, deleteCover } from '../services/cloudinaryService.js'

import modelProyectos from '../models/modelProyectos.js'
import { invalidateProjectsCache } from '../services/projectsCache.js'


const slugify = (text) =>
    text
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')

//crear proyectos

export const getProyectosWithDrafts = async (req, res) => {

    try {


        const proyectos = await modelProyectos.findAll({ includeDrafts: true });

        return res.status(200).json({
            message: 'Proyectos obtenidos correctamente',
            data: proyectos,
            success: true,
        });

    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: 'Error al obtener los proyectos',
            success: false

        });

    }


}

export const createProyecto = async (req, res) => {

    //const result = createProjectSchema.safeParse(req.body);


    const data = req.validated.body

    try {
        const project = { ...data, slug: slugify(data.title) };

        const id = await modelProyectos.create(project);
        invalidateProjectsCache();

        return res.status(201).json({
            success: true,
            message: 'Proyecto creado correctamente',
            data: { id, ...project },
        })

    } catch (err) {
        if (err.message?.includes('UNIQUE')) {
            return res.status(409).json({
                message: 'El proyecto ya existe',
                success: false,
            })
        }

        console.error(err)
        return res.status(500).json({
            message: 'Error al crear el proyecto',
            success: false,
        })
    }
}


export const deleteProyecto = async (req, res) => {
    try {
        const { id } = req.validated.params

        // Primero la portada actual: después de borrar el proyecto ya no la podríamos buscar
        const cover = await modelProyectos.getCover(id)
        if (!cover) {
            return res.status(404).json({ message: 'No se ha encontrado el proyecto', success: false })
        }

        const deleted = await modelProyectos.deleteProject(id)
        if (!deleted) {
            return res.status(404).json({ message: 'No se ha encontrado el proyecto', success: false })
        }

        invalidateProjectsCache()
        await deleteCover(cover.publicId)

        return res.status(204).send()
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Error al borrar el proyecto', success: false })
    }
}

export const patchProyecto = async (req, res) => {

    try {
        const { id } = req.validated.params;

        const changes = req.validated.body;


        if (changes.title) {
            changes.slug = slugify(changes.title)
        }

        const updated = await modelProyectos.patchProject(id, changes);


        if (!updated) {
            return res.status(404).json({
                message: 'No se ha encontrado el proyecto',
                success: false,
            })
        }

        invalidateProjectsCache()
        const project = await modelProyectos.getById(id)
        return res.status(200).json({
            message: 'Proyecto actualizado correctamente',
            data: project,
            success: true,
        })
    } catch (err) {
        if (err.message?.includes('UNIQUE')) {
            return res.status(409).json({
                message: 'Ya existe un proyecto con ese título',
                success: false,
            })
        }
        console.error(err)
        return res.status(500).json({
            message: 'Error al actualizar el proyecto',
            success: false,
        })
    }
}


// POST /api/admin/projects/:id/cover  (campo "cover" en multipart/form-data)
export const uploadProyectoCover = async (req, res) => {
    try {
        const { id } = req.validated.params

        const current = await modelProyectos.getCover(id)
        if (!current) {
            return res.status(404).json({ message: 'No se ha encontrado el proyecto', success: false })
        }

        const { url, publicId } = await uploadCover(req.file.buffer)
        await modelProyectos.setCover(id, url, publicId)
        invalidateProjectsCache()

        // La portada anterior ya no se usa: se borra de Cloudinary
        await deleteCover(current.publicId)

        const project = await modelProyectos.getById(id)
        return res.status(200).json({ message: 'Portada actualizada', data: project, success: true })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Error al subir la portada', success: false })
    }
}

// DELETE /api/admin/projects/:id/cover
export const deleteProyectoCover = async (req, res) => {
    try {
        const { id } = req.validated.params

        const current = await modelProyectos.getCover(id)
        if (!current) {
            return res.status(404).json({ message: 'No se ha encontrado el proyecto', success: false })
        }

        await modelProyectos.setCover(id, null, null)
        invalidateProjectsCache()
        await deleteCover(current.publicId)

        const project = await modelProyectos.getById(id)
        return res.status(200).json({ message: 'Portada quitada', data: project, success: true })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Error al quitar la portada', success: false })
    }
}
