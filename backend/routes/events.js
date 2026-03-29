const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const { protect, isAdmin } = require('../middleware/auth');

// GET /api/events
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  })
);

// GET /api/events/:id
router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }
    res.json(event);
  })
);

// POST /api/events
router.post(
  '/',
  protect,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { title, description, date } = req.body;
    if (!title || !date) {
      res.status(400);
      throw new Error('Title and date are required');
    }
    const event = await Event.create({ title, description, date });
    res.status(201).json(event);
  })
);

// PUT /api/events/:id
router.put(
  '/:id',
  protect,
  isAdmin,
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }
    const { title, description, date } = req.body;
    Object.assign(event, { title, description, date });
    const updated = await event.save();
    res.json(updated);
  })
);

// DELETE /api/events/:id
router.delete(
  '/:id',
  protect,
  isAdmin,
  asyncHandler(async (req, res) => {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      res.status(404);
      throw new Error('Event not found');
    }
    res.json({ message: 'Event deleted' });
  })
);

module.exports = router;
