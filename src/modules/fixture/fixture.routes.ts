import express from 'express';
import { authenticateToken, authorizeAdmin } from '../../middlewares/auth';
import { fixtureController } from './fixture.controllers';

const router = express.Router();
router.post('/', authenticateToken, authorizeAdmin, fixtureController.createFixture);
router.patch('/:id', authenticateToken, authorizeAdmin, fixtureController.editFixture);
router.delete('/:id', authenticateToken, authorizeAdmin, fixtureController.removeFixture);
router.get('/search', authenticateToken, fixtureController.searchFixture);
router.get('/:id', authenticateToken, fixtureController.viewFixture);


export default router;
