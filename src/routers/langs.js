// Core
import express from 'express';
import { Langs } from '../controllers';

export const router = express.Router();

router.get('/all', Langs.getAll);

export { router as langs };
