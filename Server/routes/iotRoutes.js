import express from 'express';
import { submit_user_info,sendAlert } from '../controllers/IotController.js';



const router = express.Router();

router.get('/submit_user_info', submit_user_info);
router.get('/sendalert', sendAlert);

export default router;