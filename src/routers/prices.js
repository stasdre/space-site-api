// Core
import express from 'express';
import { Prices } from '../controllers';
import { validator, authorization } from '../middleware';
// Instruments
//import { limiter, authenticate } from '../../utils';

export const router = express.Router();

router.put('/mass-update', authorization, Prices.massUpdate);
router.put('/:id', authorization, Prices.update);

export { router as prices };
