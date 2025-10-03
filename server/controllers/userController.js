const { User, Class, Course } = require('../models');

const getAllLecturers = async (req, res) => {
  try {
    const lecturers = await User.findAll({
      where: { role: 'lecturer' },
      attributes: ['id', 'name', 'email', 'faculty']
    });
    res.json(lecturers);
  } catch (error) {
    console.error('Get lecturers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({
      where: { UserId: req.user.id },
      include: [Course]
    });
    res.json(classes);
  } catch (error) {
    console.error('Get my classes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
          { role: { [Op.like]: `%${query}%` } }
        ]
      },
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllLecturers,
  getMyClasses,
  getAllUsers,
  searchUsers
};