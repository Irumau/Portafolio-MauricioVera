import { Router } from 'express';

import { getProyectos, getProyectoById } from '../controllers/proyectosController.js';
import { validate } from '../middleware/validate.js';
import { idParamSchema } from '../schemas/projectSchema.js';



const router = Router();



router.get('/', getProyectos);


router.get('/:id',validate({params: idParamSchema}), getProyectoById);


export default router;