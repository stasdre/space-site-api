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

router.get('/', Service.getAll);
router.get('/:id', Service.getById);
router.get('/lang/:lang', Service.getByLang);

router.post('/create', authorization, validator(createService), Service.create);

router.put('/:id', authorization, validator(createService), Service.update);

router.delete('/:id', authorization, Service.deleteService);

export { router as services };
