import express from 'express';
const router = express.Router();
// ייבוא הפונקציות מהקונטרולר - חובה לציין סיומת .js
import { getById, createClassroom, updateClassroom, deleteClassroom } from '../controller/Classroom.js';

router.get('/classroom/:id', getById);
router.post('/classroom', createClassroom); 
router.put('/classroom/:id', updateClassroom);
router.delete('/classroom/:id', deleteClassroom);

export default router;