const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// User Model
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('student', 'lecturer', 'prl', 'pl'), allowNull: false },
  faculty: { type: DataTypes.STRING, defaultValue: 'FICT' },
  stream: { type: DataTypes.STRING } // For PRL role
});

// Course Model
const Course = sequelize.define('Course', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  courseCode: { type: DataTypes.STRING, allowNull: false, unique: true },
  courseName: { type: DataTypes.STRING, allowNull: false },
  stream: { type: DataTypes.STRING, allowNull: false }
});

// Class Model
const Class = sequelize.define('Class', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  className: { type: DataTypes.STRING, allowNull: false },
  venue: { type: DataTypes.STRING, allowNull: false },
  scheduledTime: { type: DataTypes.STRING, allowNull: false },
  totalStudents: { type: DataTypes.INTEGER, allowNull: false }
});

// Report Model
const Report = sequelize.define('Report', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  weekOfReporting: { type: DataTypes.STRING, allowNull: false },
  dateOfLecture: { type: DataTypes.DATE, allowNull: false },
  actualStudentsPresent: { type: DataTypes.INTEGER, allowNull: false },
  topicTaught: { type: DataTypes.TEXT, allowNull: false },
  learningOutcomes: { type: DataTypes.TEXT, allowNull: false },
  recommendations: { type: DataTypes.TEXT, allowNull: false }
});

// Rating Model
const Rating = sequelize.define('Rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT }
});

// Feedback Model
const Feedback = sequelize.define('Feedback', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  feedback: { type: DataTypes.TEXT, allowNull: false }
});

// Define Relationships
User.hasMany(Report);
Report.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

User.hasMany(Feedback);
Feedback.belongsTo(User);

Report.hasMany(Feedback);
Feedback.belongsTo(Report);

Course.hasMany(Class);
Class.belongsTo(Course);

// Lecturer assigned to Class
User.hasMany(Class);
Class.belongsTo(User);

// Lecturer assigned to Course (for PL to assign)
Course.belongsTo(User, { as: 'Lecturer' });

Report.belongsTo(Class);
Class.hasMany(Report);

Rating.belongsTo(Class);
Class.hasMany(Rating);

module.exports = {
  User,
  Course,
  Class,
  Report,
  Rating,
  Feedback,
  sequelize
};