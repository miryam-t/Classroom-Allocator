import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    floor: { type: Number, required: true },
    building: { type: String, default: 'Main' },
    capacity: { type: Number, required: true },
    hasProjector: { type: Boolean, default: false },
    
    allocations: [{ 
        day: String, 
        startTime: String, 
        endTime: String, 
        courseName: String 
    }],
    
    cancellations: [{ 
        date: Date, 
        reason: String 
    }]
});

export default mongoose.model('Classroom', classroomSchema);