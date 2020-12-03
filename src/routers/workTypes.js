// Core
import express from 'express';
import { WorkTypes } from '../controllers';
import { validator, authorization } from '../middleware';
import { createUser, auth } from '../schemas';
// Instruments
//import { limiter, authenticate } from '../../utils';

export const router = express.Router();

router.get('/all', WorkTypes.getAll);

export { router as workTypes };
