import express from 'express';
import { authController } from './auth.controllers';



const router = express.Router();
router.post('/sign-up', authController.register)
router.post('/login', authController.login);

export default router;
