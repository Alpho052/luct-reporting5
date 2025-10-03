const express = require('express');
const { getAllLecturers, getMyClasses, getAllUsers, searchUsers } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');
const { User } = require('../models');

const router = express.Router();

router.get('/lecturers', auth, getAllLecturers);
router.get('/my-classes', auth, authorize('lecturer'), getMyClasses);
router.get('/', auth, authorize('pl'), getAllUsers);
router.get('/search', auth, searchUsers);

// Add this new route for updating users (stream assignment)
router.put('/:id', auth, authorize('pl'), async (req, res) => {
  try {
    const { id } = req.params;
    const { stream } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ stream });

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        stream: user.stream
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
/*const express = require('express');
const { getAllLecturers, getMyClasses, getAllUsers, searchUsers } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');
const { User } = require('../models');

const router = express.Router();

router.get('/lecturers', auth, getAllLecturers);
router.get('/my-classes', auth, authorize('lecturer'), getMyClasses);
router.get('/', auth, authorize('pl'), getAllUsers);
router.get('/search', auth, searchUsers);

// Add this new route for updating users
router.put('/:id', auth, authorize('pl'), async (req, res) => {
  try {
    const { id } = req.params;
    const { stream } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ stream });

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        stream: user.stream
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
/*const express = require('express');
const { getAllLecturers, getMyClasses, getAllUsers, searchUsers } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/lecturers', auth, getAllLecturers);
router.get('/my-classes', auth, authorize('lecturer'), getMyClasses);
router.get('/', auth, authorize('pl'), getAllUsers);
router.get('/search', auth, searchUsers);

module.exports = router;*/