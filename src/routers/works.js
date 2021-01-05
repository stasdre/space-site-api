// Core
import express from 'express';
import multer from 'multer';
import { Works } from '../controllers';
import { validator, authorization } from '../middleware';
import { createWork, auth } from '../schemas';
// Instruments
//import { limiter, authenticate } from '../../utils';

const upload = multer({ dest: 'uploads/' });

export const router = express.Router();

router.get('/', Works.getAll);
router.get('/:id', Works.getById);

router.post('/create', authorization, validator(createWork), Works.create);
router.post('/upload', authorization, upload.single('file'), Works.upload);

router.put('/:id', authorization, validator(createWork), Works.update);

router.delete('/:id', authorization, Works.deleteWork);

export { router as works };
