const express = require('express');
const { Rating, Class, User } = require('../models');
const { auth, authorize } = require('../middleware/auth');
const { ratingValidation } = require('../middleware/validation');

const router = express.Router();

// Submit rating (Student only)
router.post('/', auth, authorize('student'), ratingValidation, async (req, res) => {
  try {
    const { rating, comment, classId } = req.body;

    const ratingRecord = await Rating.create({
      rating,
      comment,
      ClassId: classId,
      UserId: req.user.id
    });

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: ratingRecord
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ratings for a class
router.get('/class/:classId', auth, async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { ClassId: req.params.classId },
      include: [User],
      order: [['createdAt', 'DESC']]
    });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;