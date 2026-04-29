import express from 'express';
const router = express.Router();
// ייבוא הפונקציות מהקונטרולר - חובה לציין סיומת .js
import { getById, createClassroom, updateClassroom, deleteClassroom } from '../controller/Classroom.js';
import {searchAvailableClassrooms} from '../controller/searchClassroom.js'
//ייבוא המידלוואר
import { validateRoomParams } from '../middleware/validateRoom.js';
import { validateScheduleParams } from '../middleware/validateSchedule.js';
import { validateBookingParams } from '../middleware/validateBooking.js';

/**
 * @route   GET /api/search
 * @desc    חיפוש כיתות פנויות לפי פרמטרים (קומה, קיבולת וזמנים)
 * @access  Public
 * עובר דרך סדרת מידלווארים שמוודאים שהזמנים והנתונים תקינים לפני השאילתה
 */
router.get('/search', 
    validateRoomParams, 
    validateScheduleParams, 
    validateBookingParams, 
    searchAvailableClassrooms
);
import { getAll, clearAllAllocations, getById, createClassroom, updateClassroom, deleteClassroom } from '../controller/Classroom.js';
router.get('/classroom', getAll);
router.post('/classroom/clear-all-allocations', clearAllAllocations);
router.get('/classroom/:id', getById);
router.post('/classroom', createClassroom); 
router.put('/classroom/:id', updateClassroom);
router.delete('/classroom/:id', deleteClassroom);

export default router;