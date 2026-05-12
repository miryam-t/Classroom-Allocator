import Classroom from '../models/Classroom.js';
import permanentAllocation from '../models/permanentAllocation.js';
import temporaryAllocation from '../models/temporaryAllocation.js';
import { timeToMinutes, validDays } from '../utils/timeHelpers.js';

export const getAll = async (req, res) => {
    try {
        const classrooms = await Classroom.find();
        res.json(classrooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const clearAllAllocations = async (req, res) => {
    try {
        await Classroom.updateMany({}, { $set: { allocations: [] } });
        res.json({ message: "כל השיבוצים נוקו בהצלחה" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getById = async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id);
        if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
        res.json(classroom);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createClassroom = async (req, res) => {
    const { number, name, floor, building, capacity, hasProjector } = req.body;

    // וולידציה: בדיקה אם החדר רגיל (לא מחשבים)
    if (!name.includes('מחשבים') && !name.includes('computers')) {
        const firstDigit = number.toString().charAt(0); 
        
        if (firstDigit !== floor.toString()) {
            return res.status(400).json({ 
                message: `הספרה הראשונה (${firstDigit}) חייבת להתאים לקומה (${floor})` 
            });
        }
    }

    try {
        const newClassroom = new Classroom(req.body);
        await newClassroom.save();
        res.status(201).json(newClassroom);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateClassroom = async (req, res) => {
    try {
        const updatedClassroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedClassroom) return res.status(404).json({ message: 'Classroom not found' });
        res.json(updatedClassroom);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteClassroom = async (req, res) => {
    try {
        const deletedClassroom = await Classroom.findByIdAndDelete(req.params.id);
        if (!deletedClassroom) return res.status(404).json({ message: 'Classroom not found' });
        res.json({ message: 'Classroom deleted', deletedClassroom });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const clearAllAllocationsFromAllClassrooms = async (req, res) => {
    try {
        // במקום למחוק, אנחנו רק סופרים כמה כאלו יש
        const classroomsToUpdate = await Classroom.countDocuments({
            $or: [{ "allocations.0": { $exists: true } }, { "cancellations.0": { $exists: true } }]
        });
        
        const permanentCount = await permanentAllocation.countDocuments({});
        const temporaryCount = await temporaryAllocation.countDocuments({});

        console.log(`TEST MODE: I would have cleared ${classroomsToUpdate} classrooms.`);
        console.log(`TEST MODE: I would have deleted ${permanentCount} permanent and ${temporaryCount} temporary allocations.`);

        res.json({ 
            message: "Test successful - no data was deleted", 
            wouldDelete: { classroomsToUpdate, permanentCount, temporaryCount } 
        });
    } catch (error) {
        console.error("BOOM! Error in reset function:", error);
        res.status(500).json({ error: error.message });
    }
};
