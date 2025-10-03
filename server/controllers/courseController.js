const { Course, User, Class } = require('../models');

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{
        model: User,
        as: 'Lecturer',
        attributes: ['id', 'name', 'email']
      }]
    });
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'Lecturer',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCourse = async (req, res) => {
  try {
    const { courseCode, courseName, stream } = req.body;

    const course = await Course.create({
      courseCode,
      courseName,
      stream
    });

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { courseCode, courseName, stream } = req.body;
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.update({
      courseCode,
      courseName,
      stream
    });

    res.json({
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const assignLecturer = async (req, res) => {
  try {
    const { courseId, lecturerId } = req.body;

    const course = await Course.findByPk(courseId);
    const lecturer = await User.findByPk(lecturerId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!lecturer || lecturer.role !== 'lecturer') {
      return res.status(404).json({ message: 'Lecturer not found' });
    }

    // Update the course with the lecturer ID
    await course.update({ LecturerId: lecturerId });

    // Fetch the updated course with lecturer details
    const updatedCourse = await Course.findByPk(courseId, {
      include: [{
        model: User,
        as: 'Lecturer',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({ 
      message: 'Lecturer assigned successfully',
      course: updatedCourse 
    });
  } catch (error) {
    console.error('Assign lecturer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCoursesByStream = async (req, res) => {
  try {
    const { stream } = req.params;
    const courses = await Course.findAll({
      where: { stream },
      include: [{
        model: User,
        as: 'Lecturer',
        attributes: ['id', 'name', 'email']
      }]
    });
    res.json(courses);
  } catch (error) {
    console.error('Get courses by stream error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  assignLecturer,
  getCoursesByStream
};
/*const { Course, User, Class } = require('../models');

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{
        model: User,
        as: 'Lecturer',
        attributes: ['id', 'name', 'email']
      }]
    });
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'Lecturer',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCourse = async (req, res) => {
  try {
    const { courseCode, courseName, stream } = req.body;

    const course = await Course.create({
      courseCode,
      courseName,
      stream
    });

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { courseCode, courseName, stream } = req.body;
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.update({
      courseCode,
      courseName,
      stream
    });

    res.json({
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const assignLecturer = async (req, res) => {
  try {
    const { courseId, lecturerId } = req.body;

    const course = await Course.findByPk(courseId);
    const lecturer = await User.findByPk(lecturerId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!lecturer || lecturer.role !== 'lecturer') {
      return res.status(404).json({ message: 'Lecturer not found' });
    }

    await course.setLecturer(lecturer);

    res.json({ message: 'Lecturer assigned successfully' });
  } catch (error) {
    console.error('Assign lecturer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCoursesByStream = async (req, res) => {
  try {
    const { stream } = req.params;
    const courses = await Course.findAll({
      where: { stream },
      include: [{
        model: User,
        as: 'Lecturer',
        attributes: ['id', 'name', 'email']
      }]
    });
    res.json(courses);
  } catch (error) {
    console.error('Get courses by stream error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  assignLecturer,
  getCoursesByStream
};*/