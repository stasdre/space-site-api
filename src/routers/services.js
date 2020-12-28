// Core
import express from 'express';
import multer from 'multer';
import { Service } from '../controllers';
import { validator, authorization } from '../middleware';
import { createService, auth } from '../schemas';
// Instruments
//import { limiter, authenticate } from '../../utils';
const upload = multer({ dest: 'uploads/' });

export const router = express.Router();

router.get('/:id', Service.getById);
router.put('/:id', authorization, validator(createService), Service.update);
router.delete('/:id', authorization, Service.deleteService);
router.get('/all/:lang', Service.getAll);
router.post('/create', authorization, validator(createService), Service.create);

export { router as services };
