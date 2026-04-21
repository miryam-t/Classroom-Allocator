const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    floor: { type: Number, required: true },
    building: { type: String, default: 'Main' },
    capacity: { type: Number, required: true },
    hasProjector: { type: Boolean, default: false },
    
    // המערכים החדשים לפי הדרישה:
    allocations: [{ 
        day: String, 
        startTime: String, 
        endTime: String, 
        courseName: String 
    }], // מערך של שיבוצים
    
    cancellations: [{ 
        date: Date, 
        reason: String 
    }] // מערך של ביטולים
});

module.exports = mongoose.model('Classroom', classroomSchema);