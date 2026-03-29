const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const PDFDocument = require('pdfkit');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/auth');

// GET /api/reports/student/:studentId
router.get(
  '/student/:studentId',
  protect,
  asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }

    const attendanceRecords = await Attendance.find({ student: student._id })
      .populate('event', 'title date')
      .sort({ 'event.date': 1 });

    const present = attendanceRecords.filter((r) => r.status === 'present').length;
    const absent = attendanceRecords.filter((r) => r.status === 'absent').length;
    const total = attendanceRecords.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="attendance-report-${student._id}.pdf"`
    );

    doc.pipe(res);

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('WISDOM ATTENDANCE TRACKER', { align: 'center' });
    doc.fontSize(14).font('Helvetica').text('Student Attendance Report', { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(560, doc.y).stroke();
    doc.moveDown();

    // Student details
    doc.fontSize(12).font('Helvetica-Bold').text('Student Details');
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Name:    ${student.name}`);
    doc.text(`Email:   ${student.email}`);
    doc.text(`Phone:   ${student.phone || 'N/A'}`);
    doc.text(`College: ${student.college || 'N/A'}`);
    doc.text(`Degree:  ${student.degree || 'N/A'}`);
    doc.text(`Status:  ${student.status || 'N/A'}`);
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(560, doc.y).stroke();
    doc.moveDown();

    // Attendance table
    doc.fontSize(12).font('Helvetica-Bold').text('Attendance Record');
    doc.moveDown(0.5);

    const colX = { event: 50, date: 310, status: 460 };
    const rowHeight = 20;

    // Table header
    doc.fontSize(10).font('Helvetica-Bold');
    doc.rect(50, doc.y, 510, rowHeight).fill('#CCCCCC').stroke();
    const headerY = doc.y + 5;
    doc.fillColor('black');
    doc.text('Event', colX.event + 5, headerY, { width: 250 });
    doc.text('Date', colX.date + 5, headerY, { width: 140 });
    doc.text('Status', colX.status + 5, headerY, { width: 90 });
    doc.moveDown(1.2);

    // Table rows
    doc.font('Helvetica').fontSize(10);
    attendanceRecords.forEach((record, index) => {
      const rowY = doc.y;
      const bg = index % 2 === 0 ? '#FFFFFF' : '#F5F5F5';
      doc.rect(50, rowY, 510, rowHeight).fill(bg).stroke();
      doc.fillColor('black');
      const eventTitle = record.event ? record.event.title : 'Unknown';
      const eventDate = record.event
        ? new Date(record.event.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'N/A';
      const statusText = record.status.charAt(0).toUpperCase() + record.status.slice(1);
      doc.text(eventTitle, colX.event + 5, rowY + 5, { width: 250 });
      doc.text(eventDate, colX.date + 5, rowY + 5, { width: 140 });
      doc.fillColor(record.status === 'present' ? 'green' : 'red');
      doc.text(statusText, colX.status + 5, rowY + 5, { width: 90 });
      doc.fillColor('black');
      doc.moveDown(1.2);
    });

    if (attendanceRecords.length === 0) {
      doc.text('No attendance records found.', colX.event + 5);
      doc.moveDown();
    }

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(560, doc.y).stroke();
    doc.moveDown();

    // Summary
    doc.fontSize(12).font('Helvetica-Bold').text('Summary');
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Total Events Recorded: ${total}`);
    doc.text(`Present: ${present}`);
    doc.text(`Absent:  ${absent}`);
    doc.text(`Attendance Percentage: ${percentage}%`);
    doc.moveDown();

    // Footer
    doc.fontSize(9).fillColor('grey').text(`Generated on ${new Date().toLocaleString()}`, { align: 'right' });

    doc.end();
  })
);

module.exports = router;
