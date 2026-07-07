import express from 'express';
import { init } from '../controllers/auth_controller';

export const router = express.Router();

router.get('/init', init);
