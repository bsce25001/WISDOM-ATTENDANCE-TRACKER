const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  status: { type: String, enum: ['present', 'absent'], required: true },
  markedAt: { type: Date, default: Date.now },
});

attendanceSchema.index({ student: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
