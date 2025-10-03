-- Create Database
CREATE DATABASE IF NOT EXISTS `luct_reporting` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `luct_reporting`;

-- Users Table
CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','lecturer','prl','pl') NOT NULL,
  `faculty` varchar(255) DEFAULT 'FICT',
  `stream` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Courses Table
CREATE TABLE `Courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseCode` varchar(50) NOT NULL,
  `courseName` varchar(255) NOT NULL,
  `stream` varchar(255) NOT NULL,
  `LecturerId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `courseCode` (`courseCode`),
  KEY `LecturerId` (`LecturerId`),
  CONSTRAINT `Courses_ibfk_1` FOREIGN KEY (`LecturerId`) REFERENCES `Users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Classes Table
CREATE TABLE `Classes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `className` varchar(255) NOT NULL,
  `venue` varchar(255) NOT NULL,
  `scheduledTime` varchar(255) NOT NULL,
  `totalStudents` int(11) NOT NULL,
  `CourseId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `CourseId` (`CourseId`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `Classes_ibfk_1` FOREIGN KEY (`CourseId`) REFERENCES `Courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Classes_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reports Table
CREATE TABLE `Reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `weekOfReporting` varchar(50) NOT NULL,
  `dateOfLecture` date NOT NULL,
  `actualStudentsPresent` int(11) NOT NULL,
  `topicTaught` text NOT NULL,
  `learningOutcomes` text NOT NULL,
  `recommendations` text NOT NULL,
  `ClassId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `ClassId` (`ClassId`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `Reports_ibfk_1` FOREIGN KEY (`ClassId`) REFERENCES `Classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Reports_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ratings Table
CREATE TABLE `Ratings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `ClassId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `ClassId` (`ClassId`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `Ratings_ibfk_1` FOREIGN KEY (`ClassId`) REFERENCES `Classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Ratings_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Feedback Table
CREATE TABLE `Feedbacks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `feedback` text NOT NULL,
  `ReportId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `ReportId` (`ReportId`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `Feedbacks_ibfk_1` FOREIGN KEY (`ReportId`) REFERENCES `Reports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Feedbacks_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Users (password for all is: password123)
INSERT INTO `Users` (`name`, `email`, `password`, `role`, `faculty`, `stream`) VALUES
('Admin PL', 'pl@luct.ac.ls', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pl', 'FICT', NULL),
('John Lecturer', 'lecturer@luct.ac.ls', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'lecturer', 'FICT', NULL),
('Jane PRL', 'prl@luct.ac.ls', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'prl', 'FICT', 'Software Development'),
('Student One', 'student@luct.ac.ls', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'FICT', NULL),
('Dr. Smith', 'smith@luct.ac.ls', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'lecturer', 'FICT', NULL);

-- Insert Sample Courses
INSERT INTO `Courses` (`courseCode`, `courseName`, `stream`, `LecturerId`) VALUES
('DIWA2110', 'Web Application Development', 'Software Development', 2),
('DIPR2110', 'Programming Fundamentals', 'Software Development', 2),
('DIDS2110', 'Database Systems', 'Data Science', 5),
('DINT2110', 'Network Fundamentals', 'Networking', 5);

-- Insert Sample Classes
INSERT INTO `Classes` (`className`, `venue`, `scheduledTime`, `totalStudents`, `CourseId`, `UserId`) VALUES
('IT Year 1 Group A', 'Lab 101', 'Mon 10:00-12:00', 25, 1, 2),
('IT Year 1 Group B', 'Lab 102', 'Tue 14:00-16:00', 30, 1, 2),
('CS Year 1 Group A', 'Lab 201', 'Wed 09:00-11:00', 28, 2, 2),
('DS Year 1 Group A', 'Lab 301', 'Thu 13:00-15:00', 22, 3, 5);

-- Insert Sample Reports
INSERT INTO `Reports` (`weekOfReporting`, `dateOfLecture`, `actualStudentsPresent`, `topicTaught`, `learningOutcomes`, `recommendations`, `ClassId`, `UserId`) VALUES
('Week 6', '2024-02-15', 22, 'React Components and Props', 'Students learned how to create reusable React components and pass data using props', 'More practical exercises needed for state management', 1, 2),
('Week 7', '2024-02-22', 24, 'React Hooks and State Management', 'Understanding of useState and useEffect hooks for state management', 'Group projects to reinforce concepts', 1, 2),
('Week 6', '2024-02-16', 26, 'Java Programming Basics', 'Students learned basic Java syntax and object-oriented programming concepts', 'More coding exercises for better understanding', 3, 2),
('Week 7', '2024-02-23', 20, 'SQL Queries and Database Design', 'Understanding of basic SQL queries and database normalization', 'Hands-on database design project needed', 4, 5);

-- Insert Sample Feedback
INSERT INTO `Feedbacks` (`feedback`, `ReportId`, `UserId`) VALUES
('Good coverage of React concepts. Consider adding more real-world examples.', 1, 3),
('Excellent progress with Java basics. Continue with more practical examples.', 3, 3);

-- Insert Sample Ratings
INSERT INTO `Ratings` (`rating`, `comment`, `ClassId`, `UserId`) VALUES
(5, 'Excellent teaching methodology and engaging content', 1, 4),
(4, 'Good class, but could use more interactive examples', 2, 4),
(5, 'Very knowledgeable lecturer with great practical examples', 4, 4);