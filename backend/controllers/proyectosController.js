
import modelProyectos from '../models/modelProyectos.js'

// obtenemos todos los proyectos
export const getProyectos = async (req, res) => {

    try {


        const proyectos = await modelProyectos.findAll();

        return res.status(200).json({
            message: 'Proyectos obtenidos correctamente',
            data: proyectos,
            success: true,
        });

    } catch (err) {
        console.log(err)
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

        const proyecto = await modelProyectos.getById(id)

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
        res.status(500).json({ message: 'Error al obtener el proyecto', success:false });
    }
}



