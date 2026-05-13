import express from 'express';
const router = express.Router();
import { 
    getRoomSchedule, 
    addPermanent, 
    updatePermanent, 
    deleteAllocation 
} from '../controller/Allocation.js';

router.get('/:roomId', getRoomSchedule); // מציג את המערכת של חדר מסוים
router.post('/', addPermanent);          // יוצר שיבוץ חדש
router.put('/:id', updatePermanent);    // מעדכן שיבוץ קיים לפי ה-ID שלו
router.delete('/:id', deleteAllocation); // מוחק שיבוץ לפי ה-ID שלו

export default router;

