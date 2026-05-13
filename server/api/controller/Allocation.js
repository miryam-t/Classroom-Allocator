import Permanent from '../models/permanentAllocation.js';
import Temporary from '../models/temporaryAllocation.js';

// 1. קבלת מערכת (קבוע + זמני) לחדר
export const getRoomSchedule = async (req, res) => {
    try {
        const { roomId } = req.params;
        const permanent = await Permanent.find({ classroom: roomId });
        const temporary = await Temporary.find({ classroom: roomId });
        res.json({ permanent, temporary });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. הוספת שיבוץ קבוע
export const addPermanent = async (req, res) => {
    try {
        const newAlloc = new Permanent(req.body);
        await newAlloc.save();
        res.status(201).json(newAlloc);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// 3. עדכון שיבוץ קבוע
export const updatePermanent = async (req, res) => {
    try {
        const updated = await Permanent.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// 4. מחיקת שיבוץ בודד או כל המערכת
export const deleteAllocation = async (req, res) => {
    try {
        const { id } = req.params;
        // אם ה-ID שנשלח הוא של חדר - נמחק הכל. אם זה ID של שיבוץ - נמחק רק אותו.
        // לבינתיים, בשביל ה-CRUD הפשוט:
        await Permanent.findByIdAndDelete(id);
        await Temporary.findByIdAndDelete(id); 
        res.json({ message: "הפעולה בוצעה בהצלחה" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};