import express from 'express';
import { teamController } from './team.controllers';
import { authenticateToken, authorizeAdmin } from '../../middlewares/auth';

const router = express.Router();
router.post('/', authenticateToken, authorizeAdmin, teamController.addTeam);
router.patch('/:id', authenticateToken, authorizeAdmin, teamController.editTeam);
router.delete('/:id', authenticateToken, authorizeAdmin, teamController.removeTeam);
router.get('/search', authenticateToken, teamController.searchTeam);
router.get('/:id', authenticateToken, authorizeAdmin, teamController.viewTeam);

export default router;
