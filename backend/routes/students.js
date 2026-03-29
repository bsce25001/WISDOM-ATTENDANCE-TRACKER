const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const { protect, isAdmin } = require('../middleware/auth');

// GET /api/students
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const students = await Student.find().sort({ name: 1 });
    res.json(students);
  })
);

// GET /api/students/:id
router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }
    res.json(student);
  })
);

// POST /api/students
router.post(
  '/',
  protect,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { name, address, phone, email, bloodGroup, status, college, degree } = req.body;
    if (!name || !email) {
      res.status(400);
      throw new Error('Name and email are required');
    }
    const student = await Student.create({ name, address, phone, email, bloodGroup, status, college, degree });
    res.status(201).json(student);
  })
);

// PUT /api/students/:id
router.put(
  '/:id',
  protect,
  isAdmin,
  asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }
    const { name, address, phone, email, bloodGroup, status, college, degree } = req.body;
    Object.assign(student, { name, address, phone, email, bloodGroup, status, college, degree });
    const updated = await student.save();
    res.json(updated);
  })
);

// DELETE /api/students/:id
router.delete(
  '/:id',
  protect,
  isAdmin,
  asyncHandler(async (req, res) => {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }
    res.json({ message: 'Student deleted' });
  })
);

module.exports = router;
