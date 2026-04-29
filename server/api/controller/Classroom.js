import Classroom from '../models/Classroom.js';

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