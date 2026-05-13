import express from 'express';
const router = express.Router();
import { getRoomSchedule, addPermanent, clearRoomSchedule } from '../controller/Allocation.js';

router.get('/:roomId', getRoomSchedule); // קבלת מערכת לחדר
router.post('/permanent', addPermanent);          // הוספת שיבוץ קבועrouter.post('/temporary', addTemporary);          // הוספת שיבוץ זמני
router.delete('/:roomId', clearRoomSchedule); // מחיקת כל השיבוצים לחדר

export default router;

