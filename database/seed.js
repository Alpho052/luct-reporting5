/*const { sequelize, User, Course, Class, Report, Rating, Feedback } = require('../server/models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced!');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.bulkCreate([
      {
        name: 'Admin PL',
        email: 'pl@luct.ac.ls',
        password: hashedPassword,
        role: 'pl',
        faculty: 'FICT'
      },
      {
        name: 'John Lecturer',
        email: 'lecturer@luct.ac.ls',
        password: hashedPassword,
        role: 'lecturer',
        faculty: 'FICT'
      },
      {
        name: 'Jane PRL',
        email: 'prl@luct.ac.ls',
        password: hashedPassword,
        role: 'prl',
        faculty: 'FICT',
        stream: 'Software Development'
      },
      {
        name: 'Student One',
        email: 'student@luct.ac.ls',
        password: hashedPassword,
        role: 'student',
        faculty: 'FICT'
      },
      {
        name: 'Dr. Smith',
        email: 'smith@luct.ac.ls',
        password: hashedPassword,
        role: 'lecturer',
        faculty: 'FICT'
      }
    ]);

    // Create courses
    const courses = await Course.bulkCreate([
      {
        courseCode: 'DIWA2110',
        courseName: 'Web Application Development',
        stream: 'Software Development',
        LecturerId: users[1].id
      },
      {
        courseCode: 'DIPR2110',
        courseName: 'Programming Fundamentals',
        stream: 'Software Development',
        LecturerId: users[1].id
      },
      {
        courseCode: 'DIDS2110',
        courseName: 'Database Systems',
        stream: 'Data Science',
        LecturerId: users[4].id
      },
      {
        courseCode: 'DINT2110',
        courseName: 'Network Fundamentals',
        stream: 'Networking',
        LecturerId: users[4].id
      }
    ]);

    // Create classes
    const classes = await Class.bulkCreate([
      {
        className: 'IT Year 1 Group A',
        venue: 'Lab 101',
        scheduledTime: 'Mon 10:00-12:00',
        totalStudents: 25,
        CourseId: courses[0].id,
        UserId: users[1].id
      },
      {
        className: 'IT Year 1 Group B',
        venue: 'Lab 102',
        scheduledTime: 'Tue 14:00-16:00',
        totalStudents: 30,
        CourseId: courses[0].id,
        UserId: users[1].id
      },
      {
        className: 'CS Year 1 Group A',
        venue: 'Lab 201',
        scheduledTime: 'Wed 09:00-11:00',
        totalStudents: 28,
        CourseId: courses[1].id,
        UserId: users[1].id
      }
    ]);

    // Create sample reports
    const reports = await Report.bulkCreate([
      {
        weekOfReporting: 'Week 6',
        dateOfLecture: new Date('2024-02-15'),
        actualStudentsPresent: 22,
        topicTaught: 'React Components and Props',
        learningOutcomes: 'Students learned how to create reusable React components and pass data using props',
        recommendations: 'More practical exercises needed for state management',
        ClassId: classes[0].id,
        UserId: users[1].id
      },
      {
        weekOfReporting: 'Week 7',
        dateOfLecture: new Date('2024-02-22'),
        actualStudentsPresent: 24,
        topicTaught: 'React Hooks and State Management',
        learningOutcomes: 'Understanding of useState and useEffect hooks for state management',
        recommendations: 'Group projects to reinforce concepts',
        ClassId: classes[0].id,
        UserId: users[1].id
      }
    ]);

    // Create sample feedback
    await Feedback.bulkCreate([
      {
        feedback: 'Good coverage of React concepts. Consider adding more real-world examples.',
        ReportId: reports[0].id,
        UserId: users[2].id
      }
    ]);

    // Create sample ratings
    await Rating.bulkCreate([
      {
        rating: 5,
        comment: 'Excellent teaching methodology and engaging content',
        ClassId: classes[0].id,
        UserId: users[3].id
      },
      {
        rating: 4,
        comment: 'Good class, but could use more interactive examples',
        ClassId: classes[1].id,
        UserId: users[3].id
      }
    ]);

    console.log('Sample data inserted successfully!');
    console.log('\nDefault login credentials:');
    console.log('PL: pl@luct.ac.ls / password123');
    console.log('Lecturer: lecturer@luct.ac.ls / password123');
    console.log('PRL: prl@luct.ac.ls / password123');
    console.log('Student: student@luct.ac.ls / password123');
    console.log('Additional Lecturer: smith@luct.ac.ls / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();*/