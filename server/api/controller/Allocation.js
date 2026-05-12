import Permanent from '../models/permanentAllocation.js';
import Temporary from '../models/temporaryAllocation.js';

// שליפת כל השיבוצים הקבועים לחדר ספציפי
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

// הוספת שיבוץ קבוע
export const addPermanent = async (req, res) => {
    try {
        const newAlloc = new Permanent(req.body);
        await newAlloc.save();
        res.status(201).json(newAlloc);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// מחיקת כל השיבוצים לחדר מסוים
export const clearRoomSchedule = async (req, res) => {
    try {
        const { roomId } = req.params;
        await Permanent.deleteMany({ classroom: roomId });
        await Temporary.deleteMany({ classroom: roomId });
        res.json({ message: "המערכת לחדר זה נוקתה בהצלחה" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};