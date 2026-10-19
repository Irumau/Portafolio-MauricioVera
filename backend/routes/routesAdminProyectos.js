import { Router } from 'express';
import { getProyectos, getProyectoById } from '../controllers/proyectosController.js';
import { createProyecto, deleteProyecto, getProyectosWithDrafts, patchProyecto, uploadProyectoCover, deleteProyectoCover } from '../controllers/adminProyectosController.js';
import { uploadCoverFile } from '../middleware/uploadImage.js';
import { validate } from '../middleware/validate.js';
import { createProjectSchema, idParamSchema, updateProjectSchema } from '../schemas/projectSchema.js';
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router();



router.use(requireAuth); // Middleware para proteger todas las rutas de este router


router.get('/', getProyectosWithDrafts);

router.get('/:id',validate({params: idParamSchema}), getProyectoById);

router.post('/',validate({body: createProjectSchema}), createProyecto);

router.patch('/:id',validate({params: idParamSchema ,body: updateProjectSchema}), patchProyecto);

router.delete('/:id', validate({params:idParamSchema}), deleteProyecto);

// Portada: el archivo va en multipart/form-data, campo "cover"
router.post('/:id/cover', validate({ params: idParamSchema }), uploadCoverFile, uploadProyectoCover);

router.delete('/:id/cover', validate({ params: idParamSchema }), deleteProyectoCover);

export default router;