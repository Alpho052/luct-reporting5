const express = require('express');
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  assignLecturer,
  getCoursesByStream
} = require('../controllers/courseController');
const { auth, authorize } = require('../middleware/auth');
const { courseValidation } = require('../middleware/validation');

const router = express.Router();

router.get('/', auth, getAllCourses);
router.get('/stream/:stream', auth, getCoursesByStream);
router.get('/:id', auth, getCourseById);
router.post('/', auth, authorize('pl'), courseValidation, createCourse);
router.put('/:id', auth, authorize('pl'), courseValidation, updateCourse);
router.delete('/:id', auth, authorize('pl'), deleteCourse);
router.post('/assign-lecturer', auth, authorize('pl'), assignLecturer);

module.exports = router;