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

router.post('/create', authorization, validator(createWork), Works.create);
router.get('/all', Works.getAll);
router.post('/upload', authorization, upload.single('file'), Works.upload);

export { router as works };
