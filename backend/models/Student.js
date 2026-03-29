const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    bloodGroup: { type: String, trim: true },
    status: { type: String, default: 'Student', trim: true },
    college: { type: String, trim: true },
    degree: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
