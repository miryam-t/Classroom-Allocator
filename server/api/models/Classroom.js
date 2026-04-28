import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    floor: { type: Number, required: true },
    capacity: { type: Number, required: true },
    building: { type: String, default: 'Main' },
    hasProjector: { type: Boolean, default: false },

    // מערך השיבוצים שמכיל הפניות (IDs) לשיבוצים קבועים או זמניים
    allocations: [{
        allocationId: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true,
            refPath: 'allocations.onModel' 
        },
        onModel: { 
            type: String, 
            required: true, 
            enum: ['Permanent', 'Temporary'] 
        }
    }],

    // מערך הביטולים - כולל שדות לחיפוש מהיר ללא צורך ב-Populate
    cancellations: [{
        date: { type: Date, required: true },
        startTime: String, 
        endTime: String,
        permanentAllocationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Permanent' },
        reason: String
    }]
});

export default mongoose.model('Classroom', classroomSchema);