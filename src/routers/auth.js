// Core
import express from 'express';
import { Auth } from '../controllers';
import { validator, authorization } from '../middleware';
import { createUser, auth } from '../schemas';
// Instruments
//import { limiter, authenticate } from '../../utils';

export const router = express.Router();

router.post('/signup', validator(createUser), Auth.signup);
router.post('/signin', validator(auth), Auth.signin);
router.post('/refresh-token', Auth.refresh);

export { router as auth };
