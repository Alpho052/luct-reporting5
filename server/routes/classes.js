const express = require('express');
const { Class, Course, User } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all classes
router.get('/', auth, async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [Course, User]
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create class (PL only)
router.post('/', auth, authorize('pl'), async (req, res) => {
  try {
    const { className, venue, scheduledTime, totalStudents, courseId, lecturerId } = req.body;
    
    const classRecord = await Class.create({
      className,
      venue,
      scheduledTime,
      totalStudents,
      CourseId: courseId,
      UserId: lecturerId
    });

    const classWithDetails = await Class.findByPk(classRecord.id, {
      include: [Course, User]
    });

    res.status(201).json(classWithDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;