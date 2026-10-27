
import modelProyectos from '../models/modelProyectos.js'
import { getOrLoad } from '../services/projectsCache.js'

// El navegador puede reutilizar la lista 60 s sin preguntar, y hasta 5 min la muestra
// mientras pide la versión nueva en segundo plano.
const PUBLIC_CACHE_HEADER = 'public, max-age=60, stale-while-revalidate=300'

// obtenemos todos los proyectos
export const getProyectos = async (req, res) => {

    try {


        const proyectos = await getOrLoad('all', () => modelProyectos.findAll());

        res.set('Cache-Control', PUBLIC_CACHE_HEADER);

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

// obtenemos un proyecto por id 

export const getProyectoById = async (req, res) => {

    try {

         const { id } = req.validated.params

        if (!id) {
            return res.status(400).json({
                message: 'El id no es válido',
                success: false,
            })
        }

        const proyecto = await getOrLoad(`id:${id}`, () => modelProyectos.getById(id))

        if (!proyecto) {
            return res.status(404).json({
                message: 'No se ha encontrado el proyecto',
                success: false,
            });
        }

        return res.status(200).json({
            message: 'Proyecto obtenido correctamente',
            data: proyecto,
            success: true,
        });

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al obtener el proyecto', success:false });
    }
}



