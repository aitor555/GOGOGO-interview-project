//Games routes go here
import express from 'express';
const router 		= express.Router();

import { createGame } from '../controllers/GameController.js';

router.post('/games', createGame);

export default router;