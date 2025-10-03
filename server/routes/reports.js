const express = require('express');
const {
  getAllReports,
  getMyReports,
  createReport,
  getReportsByStream,
  addFeedback,
  getPRLFeedbackReports,
  generateExcelReport
} = require('../controllers/reportController');
const { auth, authorize } = require('../middleware/auth');
const { reportValidation, feedbackValidation } = require('../middleware/validation');

const router = express.Router();

router.get('/', auth, authorize('pl', 'prl'), getAllReports);
router.get('/my-reports', auth, authorize('lecturer'), getMyReports);
router.get('/stream-reports', auth, authorize('prl'), getReportsByStream);
router.get('/prl-feedback', auth, authorize('pl'), getPRLFeedbackReports);
router.get('/export-excel', auth, generateExcelReport);
router.post('/', auth, authorize('lecturer'), reportValidation, createReport);
router.post('/feedback', auth, authorize('prl'), feedbackValidation, addFeedback);

module.exports = router;