const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  next();
};

// Auth validations
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'lecturer', 'prl', 'pl']).withMessage('Valid role is required'),
  handleValidationErrors
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// Course validations
const courseValidation = [
  body('courseCode').notEmpty().withMessage('Course code is required'),
  body('courseName').notEmpty().withMessage('Course name is required'),
  body('stream').notEmpty().withMessage('Stream is required'),
  handleValidationErrors
];

// Report validations
const reportValidation = [
  body('weekOfReporting').notEmpty().withMessage('Week of reporting is required'),
  body('dateOfLecture').isDate().withMessage('Valid date is required'),
  body('actualStudentsPresent').isInt({ min: 0 }).withMessage('Valid student count is required'),
  body('topicTaught').notEmpty().withMessage('Topic taught is required'),
  body('learningOutcomes').notEmpty().withMessage('Learning outcomes are required'),
  body('classId').isInt().withMessage('Valid class ID is required'),
  handleValidationErrors
];

// Rating validations
const ratingValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('classId').isInt().withMessage('Valid class ID is required'),
  handleValidationErrors
];

// Feedback validations
const feedbackValidation = [
  body('feedback').notEmpty().withMessage('Feedback is required'),
  body('reportId').isInt().withMessage('Valid report ID is required'),
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  courseValidation,
  reportValidation,
  ratingValidation,
  feedbackValidation
};