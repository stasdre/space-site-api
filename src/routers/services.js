// Core
import express from 'express';
import { Service } from '../controllers';
import { validator, authorization } from '../middleware';
import { createService, auth } from '../schemas';
// Instruments
//import { limiter, authenticate } from '../../utils';

export const router = express.Router();

router.post('/create', validator(createService), Service.create);

export { router as services };
