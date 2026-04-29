import express from 'express';
const router = express.Router();
// ייבוא הפונקציות מהקונטרולר - חובה לציין סיומת .js
// שינוי: הוספתי את addCancellation לרשימת הייבוא כדי שהראוטר יכיר את הפונקציה שלך
import { getById, createClassroom, updateClassroom, deleteClassroom, addCancellation } from '../controller/Classroom.js';

router.get('/classroom/:id', getById);
router.post('/classroom', createClassroom); 
router.put('/classroom/:id', updateClassroom);
router.delete('/classroom/:id', deleteClassroom);

// ---  הוספת נתיב לביטול חדר (SERVER) ---
// שינוי על פי הוראות התיכון החדשות: "בקשת עדכון במקום מחיקה"
// הכתובת הזו מאפשרת למזכירה לשלוח בקשת ביטול לחדר ספציפי לפי ה-ID שלו
router.patch('/classroom/:id/cancel', addCancellation); 

export default router;