const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    floor: { type: Number, required: true },
    building: { type: String, default: 'Main' }, // הוספנו בניין
    capacity: { type: Number, required: true },
    hasProjector: { type: Boolean, default: false }, // הוספנו מקרן
    status: { type: String, default: 'available' }   // הוספנו סטטוס
});

module.exports = mongoose.model('Classroom', classroomSchema);