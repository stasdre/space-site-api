// Core
import express from 'express';
import { ServicesCategories } from '../controllers';

export const router = express.Router();

router.get('/:lang*?', ServicesCategories.getAll);

export { router as categories };
