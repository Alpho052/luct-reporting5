const { Report, Class, Course, User, Feedback } = require('../models');

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        {
          model: Class,
          include: [Course]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Feedback,
          include: [User]
        }
      ],
      order: [['dateOfLecture', 'DESC']]
    });
    res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      where: { UserId: req.user.id },
      include: [
        {
          model: Class,
          include: [Course]
        },
        {
          model: Feedback,
          include: [User]
        }
      ],
      order: [['dateOfLecture', 'DESC']]
    });
    res.json(reports);
  } catch (error) {
    console.error('Get my reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createReport = async (req, res) => {
  try {
    const {
      weekOfReporting,
      dateOfLecture,
      actualStudentsPresent,
      topicTaught,
      learningOutcomes,
      recommendations,
      classId
    } = req.body;

    const report = await Report.create({
      weekOfReporting,
      dateOfLecture,
      actualStudentsPresent,
      topicTaught,
      learningOutcomes,
      recommendations,
      ClassId: classId,
      UserId: req.user.id
    });

    const reportWithDetails = await Report.findByPk(report.id, {
      include: [
        {
          model: Class,
          include: [Course]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      message: 'Report submitted successfully',
      report: reportWithDetails
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getReportsByStream = async (req, res) => {
  try {
    const { stream } = req.params;
    const reports = await Report.findAll({
      include: [
        {
          model: Class,
          include: [{
            model: Course,
            where: { stream: stream }
          }]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Feedback,
          include: [User]
        }
      ],
      order: [['dateOfLecture', 'DESC']]
    });
    res.json(reports);
  } catch (error) {
    console.error('Get reports by stream error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addFeedback = async (req, res) => {
  try {
    const { reportId, feedback } = req.body;

    const report = await Report.findByPk(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const feedbackRecord = await Feedback.create({
      feedback,
      ReportId: reportId,
      UserId: req.user.id
    });

    const feedbackWithUser = await Feedback.findByPk(feedbackRecord.id, {
      include: [User]
    });

    res.status(201).json({
      message: 'Feedback added successfully',
      feedback: feedbackWithUser
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPRLFeedbackReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        {
          model: Class,
          include: [Course]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Feedback,
          include: [{
            model: User,
            attributes: ['id', 'name', 'email']
          }]
        }
      ],
      order: [['dateOfLecture', 'DESC']]
    });
    
    // Filter reports that have feedback from PRLs
    const reportsWithPRLFeedback = reports.filter(report => 
      report.Feedbacks && report.Feedbacks.length > 0
    );
    
    res.json(reportsWithPRLFeedback);
  } catch (error) {
    console.error('Get PRL feedback reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const generateExcelReport = async (req, res) => {
  try {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reports');

    // Add headers
    worksheet.columns = [
      { header: 'Course Code', key: 'courseCode', width: 15 },
      { header: 'Course Name', key: 'courseName', width: 30 },
      { header: 'Lecturer', key: 'lecturer', width: 20 },
      { header: 'Week', key: 'week', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Students Present', key: 'studentsPresent', width: 15 },
      { header: 'Total Students', key: 'totalStudents', width: 15 },
      { header: 'Attendance %', key: 'attendancePercent', width: 15 },
      { header: 'Topic', key: 'topic', width: 30 },
      { header: 'Learning Outcomes', key: 'learningOutcomes', width: 40 },
      { header: 'Recommendations', key: 'recommendations', width: 40 },
      { header: 'PRL Feedback', key: 'feedback', width: 40 },
      { header: 'Feedback By', key: 'feedbackBy', width: 20 }
    ];

    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };

    const reports = await Report.findAll({
      include: [
        {
          model: Class,
          include: [Course]
        },
        {
          model: User,
          attributes: ['name']
        },
        {
          model: Feedback,
          include: [{
            model: User,
            attributes: ['name']
          }]
        }
      ],
      order: [['dateOfLecture', 'DESC']]
    });

    // Add data rows
    reports.forEach(report => {
      const feedback = report.Feedbacks && report.Feedbacks.length > 0 ? report.Feedbacks[0] : null;
      const attendancePercent = report.Class && report.Class.totalStudents ? 
        ((report.actualStudentsPresent / report.Class.totalStudents) * 100).toFixed(1) + '%' : 'N/A';

      worksheet.addRow({
        courseCode: report.Class?.Course?.courseCode || 'N/A',
        courseName: report.Class?.Course?.courseName || 'N/A',
        lecturer: report.User?.name || 'N/A',
        week: report.weekOfReporting,
        date: report.dateOfLecture.toISOString().split('T')[0],
        studentsPresent: report.actualStudentsPresent,
        totalStudents: report.Class?.totalStudents || 'N/A',
        attendancePercent: attendancePercent,
        topic: report.topicTaught,
        learningOutcomes: report.learningOutcomes,
        recommendations: report.recommendations,
        feedback: feedback?.feedback || 'No feedback',
        feedbackBy: feedback?.User?.name || 'N/A'
      });
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=luct-reports.xlsx');

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Generate Excel error:', error);
    res.status(500).json({ 
      message: 'Server error generating Excel report',
      error: error.message 
    });
  }
};

module.exports = {
  getAllReports,
  getMyReports,
  createReport,
  getReportsByStream,
  addFeedback,
  getPRLFeedbackReports,
  generateExcelReport
};
/*const { Report, Class, Course, User, Feedback } = require('../models');

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        {
          model: Class,
          include: [Course]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Feedback
        }
      ],
      order: [['dateOfLecture', 'DESC']]
    });
    res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      where: { UserId: req.user.id },
      include: [
        {
          model: Class,
          include: [Course]
        },
        {
          model: Feedback
        }
      ],
      order: [['dateOfLecture', 'DESC']]
    });
    res.json(reports);
  } catch (error) {
    console.error('Get my reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createReport = async (req, res) => {
  try {
    const {
      weekOfReporting,
      dateOfLecture,
      actualStudentsPresent,
      topicTaught,
      learningOutcomes,
      recommendations,
      classId
    } = req.body;

    const report = await Report.create({
      weekOfReporting,
      dateOfLecture,
      actualStudentsPresent,
      topicTaught,
      learningOutcomes,
      recommendations,
      ClassId: classId,
      UserId: req.user.id
    });

    const reportWithDetails = await Report.findByPk(report.id, {
      include: [
        {
          model: Class,
          include: [Course]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      message: 'Report submitted successfully',
      report: reportWithDetails
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getReportsByStream = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        {
          model: Class,
          include: [{
            model: Course,
            where: { stream: req.user.role === 'prl' ? req.user.stream : req.params.stream }
          }]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Feedback
        }
      ],
      order: [['dateOfLecture', 'DESC']]
    });
    res.json(reports);
  } catch (error) {
    console.error('Get reports by stream error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addFeedback = async (req, res) => {
  try {
    const { reportId, feedback } = req.body;

    const report = await Report.findByPk(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const feedbackRecord = await Feedback.create({
      feedback,
      ReportId: reportId,
      UserId: req.user.id
    });

    res.status(201).json({
      message: 'Feedback added successfully',
      feedback: feedbackRecord
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPRLFeedbackReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        {
          model: Class,
          include: [Course]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Feedback,
          where: { UserId: req.user.id },
          required: false
        }
      ],
      order: [['dateOfLecture', 'DESC']]
    });
    res.json(reports);
  } catch (error) {
    console.error('Get PRL feedback reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const generateExcelReport = async (req, res) => {
  try {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reports');

    // Add headers
    worksheet.columns = [
      { header: 'Course Code', key: 'courseCode', width: 15 },
      { header: 'Course Name', key: 'courseName', width: 30 },
      { header: 'Lecturer', key: 'lecturer', width: 20 },
      { header: 'Week', key: 'week', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Students Present', key: 'studentsPresent', width: 15 },
      { header: 'Topic', key: 'topic', width: 30 },
      { header: 'Feedback', key: 'feedback', width: 40 }
    ];

    const reports = await Report.findAll({
      include: [
        {
          model: Class,
          include: [Course]
        },
        {
          model: User,
          attributes: ['name']
        },
        {
          model: Feedback
        }
      ]
    });

    reports.forEach(report => {
      worksheet.addRow({
        courseCode: report.Class.Course.courseCode,
        courseName: report.Class.Course.courseName,
        lecturer: report.User.name,
        week: report.weekOfReporting,
        date: report.dateOfLecture.toISOString().split('T')[0],
        studentsPresent: report.actualStudentsPresent,
        topic: report.topicTaught,
        feedback: report.Feedbacks?.[0]?.feedback || 'No feedback'
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=reports.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Generate Excel error:', error);
    res.status(500).json({ message: 'Server error generating Excel report' });
  }
};

module.exports = {
  getAllReports,
  getMyReports,
  createReport,
  getReportsByStream,
  addFeedback,
  getPRLFeedbackReports,
  generateExcelReport
};*/