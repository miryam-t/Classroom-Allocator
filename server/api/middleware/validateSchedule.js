import { validDays, isValidTime } from '../utils/timeHelpers.js';

// בדיקת תקינות יום, פורמט זמן וטווח שעות הגיוני
export const validateScheduleParams = (req, res, next) => {
    const { day, startTime, endTime } = req.query;

    if (day && !validDays.includes(day))
        return res.status(400).json({ message: 'Invalid day' });

    if ((startTime && !isValidTime(startTime)) || (endTime && !isValidTime(endTime)))
        return res.status(400).json({ message: 'Invalid time format (HH:MM)' });

     if ((startTime || endTime) && (!startTime || !endTime || (!day && !date)))
        return res.status(400).json({ 
            message: 'startTime and endTime require either day or date' 
        });

    if (startTime && endTime && startTime >= endTime)
        return res.status(400).json({ message: 'startTime must be before endTime' });

    next();
};