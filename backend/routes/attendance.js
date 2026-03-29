const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

// GET /api/attendance/stats
router.get(
  '/stats',
  protect,
  asyncHandler(async (req, res) => {
    const [totalStudents, totalEvents, presentCount, absentCount] = await Promise.all([
      Student.countDocuments(),
      Event.countDocuments(),
      Attendance.countDocuments({ status: 'present' }),
      Attendance.countDocuments({ status: 'absent' }),
    ]);
    res.json({
      totalStudents,
      totalEvents,
      overallPresent: presentCount,
      overallAbsent: absentCount,
    });
  })
);

// GET /api/attendance/student-stats/:studentId
router.get(
  '/student-stats/:studentId',
  protect,
  asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    const [totalEvents, present, absent] = await Promise.all([
      Event.countDocuments(),
      Attendance.countDocuments({ student: studentId, status: 'present' }),
      Attendance.countDocuments({ student: studentId, status: 'absent' }),
    ]);
    const attended = present + absent;
    const percentage = attended > 0 ? Math.round((present / attended) * 100) : 0;
    res.json({ totalEvents, present, absent, percentage });
  })
);

// GET /api/attendance/event/:eventId
router.get(
  '/event/:eventId',
  protect,
  asyncHandler(async (req, res) => {
    const records = await Attendance.find({ event: req.params.eventId }).populate(
      'student',
      'name email phone college degree status'
    );
    res.json(records);
  })
);

// GET /api/attendance/student/:studentId
router.get(
  '/student/:studentId',
  protect,
  asyncHandler(async (req, res) => {
    const records = await Attendance.find({ student: req.params.studentId }).populate(
      'event',
      'title description date'
    );
    res.json(records);
  })
);

// POST /api/attendance/mark
router.post(
  '/mark',
  protect,
  asyncHandler(async (req, res) => {
    const { eventId, studentId, status } = req.body;
    if (!eventId || !studentId || !status) {
      res.status(400);
      throw new Error('eventId, studentId, and status are required');
    }
    if (!['present', 'absent'].includes(status)) {
      res.status(400);
      throw new Error('status must be "present" or "absent"');
    }
    const record = await Attendance.findOneAndUpdate(
      { event: eventId, student: studentId },
      { status, markedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(record);
  })
);

// POST /api/attendance/mark-bulk
router.post(
  '/mark-bulk',
  protect,
  asyncHandler(async (req, res) => {
    const { eventId, records } = req.body;
    if (!eventId || !Array.isArray(records) || records.length === 0) {
      res.status(400);
      throw new Error('eventId and a non-empty records array are required');
    }

    const ops = records.map(({ studentId, status }) => ({
      updateOne: {
        filter: { event: eventId, student: studentId },
        update: { $set: { status, markedAt: new Date() } },
        upsert: true,
      },
    }));

    const result = await Attendance.bulkWrite(ops);
    res.json({ message: 'Bulk attendance marked', result });
  })
);

module.exports = router;
