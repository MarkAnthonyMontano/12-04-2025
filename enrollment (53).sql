-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2025 at 01:45 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `enrollment`
--

-- --------------------------------------------------------

--
-- Table structure for table `active_school_year_table`
--

CREATE TABLE `active_school_year_table` (
  `id` int(11) NOT NULL,
  `year_id` int(11) DEFAULT NULL,
  `semester_id` int(11) DEFAULT NULL,
  `astatus` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `active_school_year_table`
--

INSERT INTO `active_school_year_table` (`id`, `year_id`, `semester_id`, `astatus`, `active`) VALUES
(1, 4, 1, 0, 0),
(2, 9, 2, 0, 0),
(3, 9, 1, 0, 0),
(4, 10, 2, 0, 0),
(6, 4, 2, 0, 0),
(8, 12, 2, 0, 0),
(9, 3, 2, 0, 0),
(10, 13, 2, 0, 0),
(11, 13, 1, 0, 0),
(12, 5, 1, 0, 0),
(13, 5, 2, 0, 0),
(14, 5, 3, 0, 0),
(15, 3, 1, 0, 0),
(16, 10, 1, 1, 0),
(17, 12, 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `course_table`
--

CREATE TABLE `course_table` (
  `course_id` int(11) NOT NULL,
  `course_code` varchar(100) DEFAULT NULL,
  `course_description` varchar(255) DEFAULT NULL,
  `course_unit` int(11) DEFAULT NULL,
  `lab_unit` int(11) DEFAULT NULL,
  `lec_value` varchar(255) DEFAULT '0',
  `lab_value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_table`
--

INSERT INTO `course_table` (`course_id`, `course_code`, `course_description`, `course_unit`, `lab_unit`, `lec_value`, `lab_value`) VALUES
(1, 'GEREADPH', 'Readings in Philippine History', 3, 0, '100', '0'),
(2, 'GEUNDETS', 'Understanding the Self', 3, 0, '100', '0'),
(3, 'GEARTAPP', 'Art Appreciation', 3, 0, '100', '0'),
(4, 'GEPURPCO', 'Purposive Communication', 3, 0, '100', '0'),
(5, 'GEKOMFIL', 'Kontekstwalisadong Komunikasyon sa Filipino', 3, 0, '100', '0'),
(6, 'INTCOMLC', 'Introduction to Computing (Lecture)', 2, 0, '100', '0'),
(7, 'INTCOMLB', 'Introduction to Computing (Laboratory)', 0, 1, '0', '100'),
(8, 'FPROGLEC', 'Computer Programming 1 (Lecture)', 2, 0, '100', '0'),
(9, 'FPROGLAB', 'Computer Programming 1 (Laboratory)', 0, 1, '0', '100'),
(10, 'GEPEMOVE', 'Movement Enhancement', 2, 0, '100', '0'),
(11, 'NSTPCTS1', 'National Service Training Program 1', 3, 0, '300', '0'),
(12, 'GEMATHMW', 'Mathematics in the Modern World', 3, 0, '0', '0'),
(13, 'GESCIETS', 'Science, Technology and Society', 3, 0, '0', '0'),
(14, 'GEFILDIS', 'Filipino sa Iba’t-Ibang Disiplina', 3, 0, '0', '0'),
(15, 'GEPANIPI', 'Panitikan sa Pilipinas', 3, 0, '0', '0'),
(16, 'IPROGLEC', 'Computer Programming 2 (Lecture)', 2, 0, '0', '0'),
(17, 'IPROGLAB', 'Computer Programming 2 (Laboratory)', 0, 1, '0', '0'),
(18, 'DISCMATH', 'Discrete Mathematics', 3, 0, '0', '0'),
(19, 'DBMSLEC1', 'Database Management System 1 (Lecture)', 2, 0, '0', '0'),
(20, 'DBMSLAB1', 'Database Management System 1 (Laboratory)', 0, 1, '0', '0'),
(21, 'GEPEFITE', 'Fitness Exercise', 2, 0, '0', '0'),
(22, 'NSTPCTS2', 'National Service Training Program 2', 3, 0, '0', '0'),
(23, 'GEETHICS', 'Ethics', 3, 0, '0', '0'),
(24, 'DSALGLEC', 'Data Structures and Algorithm 1 (Lecture)', 2, 0, '0', '0'),
(25, 'DSALGLAB', 'Data Structures and Algorithm 1 (Laboratory)', 0, 1, '0', '0'),
(26, 'INFMGTLC', 'Information Management (Lecture)', 2, 0, '0', '0'),
(27, 'INFMGTLB', 'Information Management (Laboratory)', 0, 1, '0', '0'),
(28, 'PTECHLEC', 'Platform Technologies (Lecture)', 2, 0, '0', '0'),
(29, 'PTECHLAB', 'Platform Technologies (Laboratory)', 0, 1, '0', '0'),
(30, 'WEBDVLC1', 'Web Development 1 (Lecture)', 2, 0, '0', '0'),
(31, 'WEBDVLB1', 'Web Development 1 (Laboratory)', 0, 1, '0', '0'),
(32, 'BUSANALY', 'Business Analytics', 3, 0, '0', '0'),
(33, 'GEPEHEF1', 'Physical Activity Towards Health and Fitness 1', 2, 0, '0', '0'),
(34, 'GEELECCP', 'Communicative Proficiency in Business Writing', 3, 0, '0', '0'),
(35, 'DBMSLEC2', 'Database Management System 2 (Lecture)', 2, 0, '0', '0'),
(36, 'DBMSLAB2', 'Database Management System 2 (Laboratory)', 0, 1, '0', '0'),
(37, 'INTHCILC', 'Introduction to Human-Computer Interaction (Lecture)', 2, 0, '0', '0'),
(38, 'INTHCILB', 'Introduction to Human-Computer Interaction (Laboratory)', 0, 1, '0', '0'),
(39, 'NETWKLC1', 'Networking 1 (Lecture)', 2, 0, '0', '0'),
(40, 'NETWKLB1', 'Networking 1 (Laboratory)', 0, 1, '0', '0'),
(41, 'WEBDVLC2', 'Web Development 2 (Lecture)', 2, 0, '0', '0'),
(42, 'WEBDVLB2', 'Web Development 2 (Laboratory)', 0, 1, '0', '0'),
(43, 'IPATLEC1', 'Integrative Programming and Technologies 1 (Lecture)', 2, 0, '0', '0'),
(44, 'IPATLAB1', 'Integrative Programming and Technologies 1 (Laboratory)', 0, 1, '0', '0'),
(45, 'GEPEHEF2', 'Physical Activity Towards Health and Fitness 2', 2, 0, '0', '0'),
(46, 'GEELECDS', 'Practical Data Science', 3, 0, '0', '0'),
(47, 'WEBDVLC3', 'Web Development 3 (Lecture)', 2, 0, '0', '0'),
(48, 'WEBDVLB3', 'Web Development 3 (Laboratory)', 0, 1, '0', '0'),
(49, 'MMDIALEC', 'Multimedia (Lecture)', 2, 0, '0', '0'),
(50, 'MMDIALAB', 'Multimedia (Laboratory)', 0, 1, '0', '0'),
(51, 'SYSARCH1', 'Systems Integration and Architecture 1 (Lecture)', 2, 0, '0', '0'),
(52, 'SYSARLB1', 'Systems Integration and Architecture 1 (Laboratory)', 0, 1, '0', '0'),
(53, 'APDEVLEC', 'Application Development and Emerging Tech (Lecture)', 2, 0, '0', '0'),
(54, 'APDEVLAB', 'Application Development and Emerging Tech (Lab)', 0, 1, '0', '0'),
(55, 'NETWKLC2', 'Networking 2 (Lecture)', 2, 0, '0', '0'),
(56, 'NETWKLB2', 'Networking 2 (Laboratory)', 0, 1, '0', '0'),
(57, 'GELIFEWR', 'Life and Works of Rizal', 3, 0, '0', '0'),
(58, 'GEELECES', 'Environmental Science', 3, 0, '0', '0'),
(59, 'QUANMETH', 'Quantitative Methods', 3, 0, '0', '0'),
(60, 'ITTHESI1', 'Research 1', 3, 0, '0', '0'),
(61, 'MOBAPLEC', 'Mobile App Development (Lecture)', 2, 0, '0', '0'),
(62, 'MOBAPLAB', 'Mobile App Development (Laboratory)', 0, 1, '0', '0'),
(63, 'OOPRGLEC', 'Object-Oriented Programming (Lecture)', 2, 0, '0', '0'),
(64, 'OOPRGLAB', 'Object-Oriented Programming (Laboratory)', 0, 1, '0', '0'),
(65, 'IAASLEC1', 'Information Assurance and Security 1 (Lecture)', 2, 0, '0', '0'),
(66, 'IAASLAB1', 'Information Assurance and Security 1 (Laboratory)', 0, 1, '0', '0'),
(67, 'GECONTWO', 'Contemporary World', 3, 0, '0', '0'),
(68, 'SYSARCH2', 'Systems Integration and Architecture 2 (Lecture)', 2, 0, '0', '0'),
(69, 'SYSARLB2', 'Systems Integration and Architecture 2 (Laboratory)', 0, 1, '0', '0'),
(70, 'ITTHESI2', 'Research 2 (Lecture)', 2, 0, '0', '0'),
(71, 'ITTHESL2', 'Research 2 (Laboratory)', 0, 1, '0', '0'),
(72, 'IAASLEC2', 'Information Assurance and Security 2 (Lecture)', 2, 0, '0', '0'),
(73, 'IAASLAB2', 'Information Assurance and Security 2 (Laboratory)', 0, 1, '0', '0'),
(74, 'SYSADMLC', 'Systems Administration and Maintenance (Lecture)', 2, 0, '0', '0'),
(75, 'SYSADMLB', 'Systems Administration and Maintenance (Laboratory)', 0, 1, '0', '0'),
(76, 'SPISSUES', 'Social and Professional Issues', 3, 0, '0', '0'),
(77, 'ITINTERN', 'Practicum / Internship', 10, 0, '0', '0'),
(78, 'GELIFEWR', 'Life And Work of Rizal', 2, 0, '0', '0');

-- --------------------------------------------------------

--
-- Table structure for table `curriculum_table`
--

CREATE TABLE `curriculum_table` (
  `curriculum_id` int(11) NOT NULL,
  `year_id` int(11) DEFAULT NULL,
  `program_id` int(11) DEFAULT NULL,
  `lock_status` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `curriculum_table`
--

INSERT INTO `curriculum_table` (`curriculum_id`, `year_id`, `program_id`, `lock_status`) VALUES
(1, 1, 1, 1),
(2, 2, 2, 1),
(3, 3, 3, 1),
(4, 4, 4, 1),
(5, 5, 5, 0),
(6, 6, 6, 1),
(7, 7, 7, 0),
(8, 8, 8, 0),
(9, 9, 9, 0),
(10, 10, 10, 0),
(11, 11, 11, 0),
(12, 12, 12, 0),
(13, 13, 13, 0),
(14, 14, 14, 0),
(15, 3, 15, 0),
(16, 16, 16, 0),
(17, 17, 17, 0),
(18, 18, 18, 0),
(19, 19, 19, 0),
(20, 20, 20, 0),
(21, 21, 21, 0),
(22, 22, 22, 0),
(23, 23, 23, 0),
(24, 24, 24, 0),
(25, 25, 25, 0),
(26, 26, 26, 0),
(27, 27, 27, 0),
(28, 28, 28, 0),
(29, 29, 29, 0),
(30, 30, 30, 0),
(31, 31, 31, 0),
(32, 32, 32, 0),
(33, 33, 33, 0),
(34, 34, 34, 0),
(35, 35, 35, 0),
(36, 36, 36, 0),
(37, 37, 37, 0),
(38, 38, 38, 0),
(39, 39, 39, 0),
(40, 40, 40, 0),
(41, 41, 41, 0),
(42, 42, 42, 0),
(43, 43, 43, 0),
(44, 44, 44, 0),
(45, 45, 45, 0),
(46, 46, 46, 0),
(47, 47, 47, 0),
(48, 48, 48, 0),
(49, 49, 49, 0),
(50, 50, 50, 0),
(51, 51, 51, 0),
(52, 52, 52, 0),
(53, 53, 53, 0),
(54, 54, 54, 0),
(55, 55, 55, 0),
(56, 5, 58, 0),
(57, 4, 15, 0),
(58, 12, 4, 0);

-- --------------------------------------------------------

--
-- Table structure for table `dprtmnt_curriculum_table`
--

CREATE TABLE `dprtmnt_curriculum_table` (
  `dprtmnt_curriculum_id` int(11) NOT NULL,
  `dprtmnt_id` int(11) DEFAULT NULL,
  `curriculum_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dprtmnt_curriculum_table`
--

INSERT INTO `dprtmnt_curriculum_table` (`dprtmnt_curriculum_id`, `dprtmnt_id`, `curriculum_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 2, 5),
(6, 2, 6),
(7, 2, 7),
(8, 3, 8),
(9, 3, 9),
(10, 3, 10),
(11, 3, 11),
(12, 4, 12),
(13, 4, 13),
(14, 5, 14),
(15, 5, 15),
(16, 6, 16),
(17, 6, 17),
(18, 6, 18),
(19, 6, 19),
(20, 6, 20),
(21, 6, 21),
(22, 6, 22),
(23, 6, 23),
(24, 7, 24),
(25, 7, 25),
(26, 7, 26),
(27, 7, 27),
(28, 7, 28),
(29, 7, 29),
(30, 8, 30),
(31, 8, 31),
(32, 9, 32),
(33, 9, 33),
(34, 9, 34),
(35, 9, 35),
(36, 9, 36),
(37, 9, 37),
(38, 9, 38),
(39, 9, 39),
(40, 9, 40),
(41, 10, 41),
(42, 10, 42),
(43, 10, 43),
(44, 10, 44),
(45, 11, 45),
(46, 11, 46),
(47, 11, 47),
(48, 11, 48),
(49, 11, 49),
(50, 11, 50),
(51, 11, 51),
(52, 11, 52),
(53, 11, 53),
(54, 11, 54),
(55, 11, 55);

-- --------------------------------------------------------

--
-- Table structure for table `dprtmnt_profs_table`
--

CREATE TABLE `dprtmnt_profs_table` (
  `dprtmnt_profs_id` int(11) NOT NULL,
  `dprtmnt_id` int(11) DEFAULT NULL,
  `prof_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dprtmnt_profs_table`
--

INSERT INTO `dprtmnt_profs_table` (`dprtmnt_profs_id`, `dprtmnt_id`, `prof_id`) VALUES
(1, 4, 1),
(2, 2, 2),
(3, 2, 3),
(4, 5, 4),
(5, 5, 5),
(6, 5, 6),
(7, 2, 7),
(8, 2, 8),
(9, 5, 9),
(10, 2, 10),
(11, 2, 11),
(12, 2, 12),
(13, 5, 13),
(14, 5, 14),
(15, 2, 15),
(16, 2, 16),
(17, 2, 17),
(18, 2, 18),
(19, 5, 19),
(20, 2, 20),
(21, 2, 21),
(22, 2, 22),
(23, 2, 23),
(24, 2, 24),
(25, 2, 25),
(26, 2, 17),
(27, 2, 18),
(28, 2, 20),
(29, 2, 21),
(30, 2, 22),
(31, 2, 23),
(32, 2, 24),
(33, 2, 25),
(34, 2, 26),
(35, 2, 27),
(36, 2, 29),
(37, 2, 30),
(38, 11, 59),
(39, 5, 60),
(40, 5, 28),
(41, 5, 37),
(42, 5, 34),
(43, 5, 31),
(44, 5, 36),
(45, 5, 32),
(46, 5, 33),
(47, 5, 35),
(48, 5, 61),
(49, 1, 62),
(50, 1, 38),
(51, 1, 63),
(52, 5, 65),
(53, 5, 66),
(54, 5, 67),
(55, 5, 68),
(56, 5, 69);

-- --------------------------------------------------------

--
-- Table structure for table `dprtmnt_room_table`
--

CREATE TABLE `dprtmnt_room_table` (
  `dprtmnt_room_id` int(11) NOT NULL,
  `dprtmnt_id` int(11) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `lock_status` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dprtmnt_room_table`
--

INSERT INTO `dprtmnt_room_table` (`dprtmnt_room_id`, `dprtmnt_id`, `room_id`, `lock_status`) VALUES
(3, 5, 3, 0),
(5, 5, 5, 0),
(13, 2, 13, 0),
(14, 2, 14, 0),
(15, 2, 15, 0),
(16, 2, 16, 0),
(17, 2, 17, 0),
(18, 2, 18, 0),
(19, 2, 19, 0),
(20, 2, 20, 0),
(21, 1, 21, 0),
(22, 5, 24, 0),
(23, 5, 4, 0),
(24, 1, 26, 0),
(25, 1, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `dprtmnt_section_table`
--

CREATE TABLE `dprtmnt_section_table` (
  `id` int(11) NOT NULL,
  `curriculum_id` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `dsstat` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dprtmnt_section_table`
--

INSERT INTO `dprtmnt_section_table` (`id`, `curriculum_id`, `section_id`, `dsstat`) VALUES
(1, 1, 1, 0),
(2, 1, 2, 0),
(3, 1, 3, 0),
(4, 1, 4, 0),
(5, 1, 5, 0),
(6, 1, 6, 0),
(7, 1, 7, 0),
(8, 1, 8, 0),
(9, 1, 9, 0),
(10, 1, 10, 0),
(11, 1, 11, 0),
(12, 1, 12, 0),
(13, 2, 1, 0),
(14, 2, 2, 0),
(15, 2, 3, 0),
(16, 2, 4, 0),
(17, 2, 5, 0),
(18, 2, 6, 0),
(19, 2, 7, 0),
(20, 2, 8, 0),
(21, 2, 9, 0),
(22, 2, 10, 0),
(23, 2, 11, 0),
(24, 2, 12, 0),
(25, 3, 1, 0),
(26, 3, 2, 0),
(27, 3, 3, 0),
(28, 3, 4, 0),
(29, 3, 5, 0),
(30, 3, 6, 0),
(31, 3, 7, 0),
(32, 3, 8, 0),
(33, 3, 9, 0),
(34, 3, 10, 0),
(35, 3, 11, 0),
(36, 3, 12, 0),
(37, 4, 1, 0),
(38, 4, 2, 0),
(39, 4, 3, 0),
(40, 4, 4, 0),
(41, 4, 5, 0),
(42, 4, 6, 0),
(43, 4, 7, 0),
(44, 4, 8, 0),
(45, 4, 9, 0),
(46, 4, 10, 0),
(47, 4, 11, 0),
(48, 4, 12, 0),
(49, 5, 1, 0),
(50, 5, 2, 0),
(51, 5, 3, 0),
(52, 5, 4, 0),
(53, 5, 5, 0),
(54, 5, 6, 0),
(55, 5, 7, 0),
(56, 5, 8, 0),
(57, 5, 9, 0),
(58, 5, 10, 0),
(59, 5, 11, 0),
(60, 5, 12, 0),
(61, 6, 1, 0),
(62, 6, 2, 0),
(63, 6, 3, 0),
(64, 6, 4, 0),
(65, 6, 5, 0),
(66, 6, 6, 0),
(67, 6, 7, 0),
(68, 6, 8, 0),
(69, 6, 9, 0),
(70, 6, 10, 0),
(71, 6, 11, 0),
(72, 6, 12, 0),
(73, 7, 1, 0),
(74, 7, 2, 0),
(75, 7, 3, 0),
(76, 7, 4, 0),
(77, 7, 5, 0),
(78, 7, 6, 0),
(79, 7, 7, 0),
(80, 7, 8, 0),
(81, 7, 9, 0),
(82, 7, 10, 0),
(83, 7, 11, 0),
(84, 7, 12, 0),
(85, 8, 1, 0),
(86, 8, 2, 0),
(87, 8, 3, 0),
(88, 8, 4, 0),
(89, 8, 5, 0),
(90, 8, 6, 0),
(91, 8, 7, 0),
(92, 8, 8, 0),
(93, 8, 9, 0),
(94, 8, 10, 0),
(95, 8, 11, 0),
(96, 8, 12, 0),
(97, 9, 1, 0),
(98, 9, 2, 0),
(99, 9, 3, 0),
(100, 9, 4, 0),
(101, 9, 5, 0),
(102, 9, 6, 0),
(103, 9, 7, 0),
(104, 9, 8, 0),
(105, 9, 9, 0),
(106, 9, 10, 0),
(107, 9, 11, 0),
(108, 9, 12, 0),
(109, 10, 1, 0),
(110, 10, 2, 0),
(111, 10, 3, 0),
(112, 10, 4, 0),
(113, 10, 5, 0),
(114, 10, 6, 0),
(115, 10, 7, 0),
(116, 10, 8, 0),
(117, 10, 9, 0),
(118, 10, 10, 0),
(119, 10, 11, 0),
(120, 10, 12, 0),
(121, 11, 1, 0),
(122, 11, 2, 0),
(123, 11, 3, 0),
(124, 11, 4, 0),
(125, 11, 5, 0),
(126, 11, 6, 0),
(127, 11, 7, 0),
(128, 11, 8, 0),
(129, 11, 9, 0),
(130, 11, 10, 0),
(131, 11, 11, 0),
(132, 11, 12, 0),
(133, 12, 1, 0),
(134, 12, 2, 0),
(135, 12, 3, 0),
(136, 12, 4, 0),
(137, 12, 5, 0),
(138, 12, 6, 0),
(139, 12, 7, 0),
(140, 12, 8, 0),
(141, 12, 9, 0),
(142, 12, 10, 0),
(143, 12, 11, 0),
(144, 12, 12, 0),
(145, 13, 1, 0),
(146, 13, 2, 0),
(147, 13, 3, 0),
(148, 13, 4, 0),
(149, 13, 5, 0),
(150, 13, 6, 0),
(151, 13, 7, 0),
(152, 13, 8, 0),
(153, 13, 9, 0),
(154, 13, 10, 0),
(155, 13, 11, 0),
(156, 13, 12, 0),
(157, 14, 1, 0),
(158, 14, 2, 0),
(159, 14, 3, 0),
(160, 14, 4, 0),
(161, 14, 5, 0),
(162, 14, 6, 0),
(163, 14, 7, 0),
(164, 14, 8, 0),
(165, 14, 9, 0),
(166, 14, 10, 0),
(167, 14, 11, 0),
(168, 14, 12, 0),
(169, 15, 1, 0),
(170, 15, 2, 0),
(171, 15, 3, 0),
(172, 15, 4, 0),
(173, 15, 5, 0),
(174, 15, 6, 0),
(175, 15, 7, 0),
(176, 15, 8, 0),
(177, 15, 9, 0),
(178, 15, 10, 0),
(179, 15, 11, 0),
(180, 15, 12, 0),
(181, 16, 1, 0),
(182, 16, 2, 0),
(183, 16, 3, 0),
(184, 16, 4, 0),
(185, 16, 5, 0),
(186, 16, 6, 0),
(187, 16, 7, 0),
(188, 16, 8, 0),
(189, 16, 9, 0),
(190, 16, 10, 0),
(191, 16, 11, 0),
(192, 16, 12, 0),
(193, 17, 1, 0),
(194, 17, 2, 0),
(195, 17, 3, 0),
(196, 17, 4, 0),
(197, 17, 5, 0),
(198, 17, 6, 0),
(199, 17, 7, 0),
(200, 17, 8, 0),
(201, 17, 9, 0),
(202, 17, 10, 0),
(203, 17, 11, 0),
(204, 17, 12, 0),
(205, 18, 1, 0),
(206, 18, 2, 0),
(207, 18, 3, 0),
(208, 18, 4, 0),
(209, 18, 5, 0),
(210, 18, 6, 0),
(211, 18, 7, 0),
(212, 18, 8, 0),
(213, 18, 9, 0),
(214, 18, 10, 0),
(215, 18, 11, 0),
(216, 18, 12, 0),
(217, 19, 1, 0),
(218, 19, 2, 0),
(219, 19, 3, 0),
(220, 19, 4, 0),
(221, 19, 5, 0),
(222, 19, 6, 0),
(223, 19, 7, 0),
(224, 19, 8, 0),
(225, 19, 9, 0),
(226, 19, 10, 0),
(227, 19, 11, 0),
(228, 19, 12, 0),
(229, 20, 1, 0),
(230, 20, 2, 0),
(231, 20, 3, 0),
(232, 20, 4, 0),
(233, 20, 5, 0),
(234, 20, 6, 0),
(235, 20, 7, 0),
(236, 20, 8, 0),
(237, 20, 9, 0),
(238, 20, 10, 0),
(239, 20, 11, 0),
(240, 20, 12, 0),
(241, 21, 1, 0),
(242, 21, 2, 0),
(243, 21, 3, 0),
(244, 21, 4, 0),
(245, 21, 5, 0),
(246, 21, 6, 0),
(247, 21, 7, 0),
(248, 21, 8, 0),
(249, 21, 9, 0),
(250, 21, 10, 0),
(251, 21, 11, 0),
(252, 21, 12, 0),
(253, 22, 1, 0),
(254, 22, 2, 0),
(255, 22, 3, 0),
(256, 22, 4, 0),
(257, 22, 5, 0),
(258, 22, 6, 0),
(259, 22, 7, 0),
(260, 22, 8, 0),
(261, 22, 9, 0),
(262, 22, 10, 0),
(263, 22, 11, 0),
(264, 22, 12, 0),
(265, 23, 1, 0),
(266, 23, 2, 0),
(267, 23, 3, 0),
(268, 23, 4, 0),
(269, 23, 5, 0),
(270, 23, 6, 0),
(271, 23, 7, 0),
(272, 23, 8, 0),
(273, 23, 9, 0),
(274, 23, 10, 0),
(275, 23, 11, 0),
(276, 23, 12, 0),
(277, 24, 1, 0),
(278, 24, 2, 0),
(279, 24, 3, 0),
(280, 24, 4, 0),
(281, 24, 5, 0),
(282, 24, 6, 0),
(283, 24, 7, 0),
(284, 24, 8, 0),
(285, 24, 9, 0),
(286, 24, 10, 0),
(287, 24, 11, 0),
(288, 24, 12, 0),
(289, 25, 1, 0),
(290, 25, 2, 0),
(291, 25, 3, 0),
(292, 25, 4, 0),
(293, 25, 5, 0),
(294, 25, 6, 0),
(295, 25, 7, 0),
(296, 25, 8, 0),
(297, 25, 9, 0),
(298, 25, 10, 0),
(299, 25, 11, 0),
(300, 25, 12, 0),
(301, 26, 1, 0),
(302, 26, 2, 0),
(303, 26, 3, 0),
(304, 26, 4, 0),
(305, 26, 5, 0),
(306, 26, 6, 0),
(307, 26, 7, 0),
(308, 26, 8, 0),
(309, 26, 9, 0),
(310, 26, 10, 0),
(311, 26, 11, 0),
(312, 26, 12, 0),
(313, 27, 1, 0),
(314, 27, 2, 0),
(315, 27, 3, 0),
(316, 27, 4, 0),
(317, 27, 5, 0),
(318, 27, 6, 0),
(319, 27, 7, 0),
(320, 27, 8, 0),
(321, 27, 9, 0),
(322, 27, 10, 0),
(323, 27, 11, 0),
(324, 27, 12, 0),
(325, 28, 1, 0),
(326, 28, 2, 0),
(327, 28, 3, 0),
(328, 28, 4, 0),
(329, 28, 5, 0),
(330, 28, 6, 0),
(331, 28, 7, 0),
(332, 28, 8, 0),
(333, 28, 9, 0),
(334, 28, 10, 0),
(335, 28, 11, 0),
(336, 28, 12, 0),
(337, 29, 1, 0),
(338, 29, 2, 0),
(339, 29, 3, 0),
(340, 29, 4, 0),
(341, 29, 5, 0),
(342, 29, 6, 0),
(343, 29, 7, 0),
(344, 29, 8, 0),
(345, 29, 9, 0),
(346, 29, 10, 0),
(347, 29, 11, 0),
(348, 29, 12, 0),
(349, 30, 1, 0),
(350, 30, 2, 0),
(351, 30, 3, 0),
(352, 30, 4, 0),
(353, 30, 5, 0),
(354, 30, 6, 0),
(355, 30, 7, 0),
(356, 30, 8, 0),
(357, 30, 9, 0),
(358, 30, 10, 0),
(359, 30, 11, 0),
(360, 30, 12, 0),
(361, 31, 1, 0),
(362, 31, 2, 0),
(363, 31, 3, 0),
(364, 31, 4, 0),
(365, 31, 5, 0),
(366, 31, 6, 0),
(367, 31, 7, 0),
(368, 31, 8, 0),
(369, 31, 9, 0),
(370, 31, 10, 0),
(371, 31, 11, 0),
(372, 31, 12, 0),
(373, 32, 1, 0),
(374, 32, 2, 0),
(375, 32, 3, 0),
(376, 32, 4, 0),
(377, 32, 5, 0),
(378, 32, 6, 0),
(379, 32, 7, 0),
(380, 32, 8, 0),
(381, 32, 9, 0),
(382, 32, 10, 0),
(383, 32, 11, 0),
(384, 32, 12, 0),
(385, 33, 1, 0),
(386, 33, 2, 0),
(387, 33, 3, 0),
(388, 33, 4, 0),
(389, 33, 5, 0),
(390, 33, 6, 0),
(391, 33, 7, 0),
(392, 33, 8, 0),
(393, 33, 9, 0),
(394, 33, 10, 0),
(395, 33, 11, 0),
(396, 33, 12, 0),
(397, 34, 1, 0),
(398, 34, 2, 0),
(399, 34, 3, 0),
(400, 34, 4, 0),
(401, 34, 5, 0),
(402, 34, 6, 0),
(403, 34, 7, 0),
(404, 34, 8, 0),
(405, 34, 9, 0),
(406, 34, 10, 0),
(407, 34, 11, 0),
(408, 34, 12, 0),
(409, 35, 1, 0),
(410, 35, 2, 0),
(411, 35, 3, 0),
(412, 35, 4, 0),
(413, 35, 5, 0),
(414, 35, 6, 0),
(415, 35, 7, 0),
(416, 35, 8, 0),
(417, 35, 9, 0),
(418, 35, 10, 0),
(419, 35, 11, 0),
(420, 35, 12, 0),
(421, 36, 1, 0),
(422, 36, 2, 0),
(423, 36, 3, 0),
(424, 36, 4, 0),
(425, 36, 5, 0),
(426, 36, 6, 0),
(427, 36, 7, 0),
(428, 36, 8, 0),
(429, 36, 9, 0),
(430, 36, 10, 0),
(431, 36, 11, 0),
(432, 36, 12, 0),
(433, 37, 1, 0),
(434, 37, 2, 0),
(435, 37, 3, 0),
(436, 37, 4, 0),
(437, 37, 5, 0),
(438, 37, 6, 0),
(439, 37, 7, 0),
(440, 37, 8, 0),
(441, 37, 9, 0),
(442, 37, 10, 0),
(443, 37, 11, 0),
(444, 37, 12, 0),
(445, 38, 1, 0),
(446, 38, 2, 0),
(447, 38, 3, 0),
(448, 38, 4, 0),
(449, 38, 5, 0),
(450, 38, 6, 0),
(451, 38, 7, 0),
(452, 38, 8, 0),
(453, 38, 9, 0),
(454, 38, 10, 0),
(455, 38, 11, 0),
(456, 38, 12, 0),
(457, 39, 1, 0),
(458, 39, 2, 0),
(459, 39, 3, 0),
(460, 39, 4, 0),
(461, 39, 5, 0),
(462, 39, 6, 0),
(463, 39, 7, 0),
(464, 39, 8, 0),
(465, 39, 9, 0),
(466, 39, 10, 0),
(467, 39, 11, 0),
(468, 39, 12, 0),
(469, 40, 1, 0),
(470, 40, 2, 0),
(471, 40, 3, 0),
(472, 40, 4, 0),
(473, 40, 5, 0),
(474, 40, 6, 0),
(475, 40, 7, 0),
(476, 40, 8, 0),
(477, 40, 9, 0),
(478, 40, 10, 0),
(479, 40, 11, 0),
(480, 40, 12, 0),
(481, 41, 1, 0),
(482, 42, 1, 0),
(483, 43, 1, 0),
(484, 44, 1, 0),
(485, 45, 1, 0),
(486, 46, 1, 0),
(487, 47, 1, 0),
(488, 48, 1, 0),
(489, 49, 1, 0),
(490, 50, 1, 0),
(491, 51, 1, 0),
(492, 52, 1, 0),
(493, 53, 1, 0),
(494, 54, 1, 0),
(495, 55, 1, 0),
(496, 56, 1, 0),
(517, 1, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `dprtmnt_table`
--

CREATE TABLE `dprtmnt_table` (
  `dprtmnt_id` int(11) NOT NULL,
  `dprtmnt_name` varchar(255) DEFAULT NULL,
  `dprtmnt_code` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dprtmnt_table`
--

INSERT INTO `dprtmnt_table` (`dprtmnt_id`, `dprtmnt_name`, `dprtmnt_code`) VALUES
(1, 'College of Architecture and Fine Arts', 'CAFA'),
(2, 'College of Arts and Sciences', 'CAS'),
(3, 'College of Business and Public Administration', 'CBPA'),
(4, 'College of Criminal Justice Education', 'CCJE'),
(5, 'College of Computing Studies', 'CCS'),
(6, 'College of Education', 'CED'),
(7, 'College of Engineering', 'CEN'),
(8, 'College of Hospitality and Tourism Management', 'CHTM'),
(9, 'College of Industrial Technology', 'CIT'),
(10, 'Graduate School Doctoral Program', 'GSDP'),
(11, 'Graduate School Master Program', 'GSMP');

-- --------------------------------------------------------

--
-- Table structure for table `enrolled_subject`
--

CREATE TABLE `enrolled_subject` (
  `id` int(11) NOT NULL,
  `student_number` varchar(255) NOT NULL,
  `curriculum_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `active_school_year_id` int(11) DEFAULT NULL,
  `midterm` varchar(60) NOT NULL DEFAULT '0.00',
  `finals` varchar(60) NOT NULL DEFAULT '0.00',
  `final_grade` varchar(255) NOT NULL DEFAULT '0.00',
  `grades_status` varchar(60) DEFAULT NULL,
  `en_remarks` int(11) NOT NULL DEFAULT 0,
  `department_section_id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `fe_status` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrolled_subject`
--

INSERT INTO `enrolled_subject` (`id`, `student_number`, `curriculum_id`, `course_id`, `active_school_year_id`, `midterm`, `finals`, `final_grade`, `grades_status`, `en_remarks`, `department_section_id`, `status`, `fe_status`, `created_at`) VALUES
(1053, '224-06342M', 15, 54, 3, '0', '0', '1.25', NULL, 1, 0, 0, 0, '2025-11-19 03:42:08'),
(1054, '224-06342M', 15, 53, 3, '0', '0', '2', NULL, 1, 0, 0, 0, '2025-11-19 03:42:08'),
(1055, '224-06342M', 15, 46, 3, '0', '0', '1.5', NULL, 1, 0, 0, 0, '2025-11-19 03:42:08'),
(1056, '224-06342M', 15, 50, 3, '0', '0', '1', NULL, 1, 0, 0, 0, '2025-11-19 03:42:08'),
(1057, '224-06342M', 15, 49, 3, '0', '0', '1', NULL, 1, 0, 0, 0, '2025-11-19 03:42:08'),
(1058, '224-06342M', 15, 56, 3, '0', '0', '1.25', NULL, 1, 0, 0, 0, '2025-11-19 03:42:08'),
(1059, '224-06342M', 15, 55, 3, '0', '0', '1.25', NULL, 1, 0, 0, 0, '2025-11-19 03:42:08'),
(1060, '224-06342M', 15, 51, 3, '0', '0', '1', NULL, 1, 0, 0, 0, '2025-11-19 03:42:08'),
(1061, '224-06342M', 15, 52, 3, '0', '0', '1', NULL, 1, 0, 0, 0, '2025-11-19 03:42:08'),
(1062, '224-06342M', 15, 48, 3, '0', '0', '1', NULL, 1, 0, 0, 0, '2025-11-19 03:42:08'),
(1063, '224-06342M', 15, 47, 3, '0', '0', '1', NULL, 1, 0, 0, 0, '2025-11-19 03:42:09'),
(1064, '224-06342M', 15, 58, 2, '0', '0', '1.5', NULL, 1, 0, 0, 0, '2025-11-19 03:42:09'),
(1065, '224-06342M', 15, 57, 2, '0', '0', '1.75', NULL, 1, 0, 0, 0, '2025-11-19 03:42:09'),
(1066, '224-06342M', 15, 66, 2, '0', '0', '1', NULL, 1, 0, 0, 0, '2025-11-19 03:42:09'),
(1067, '224-06342M', 15, 65, 2, '0', '0', '1', NULL, 1, 0, 0, 0, '2025-11-19 03:42:09'),
(1068, '224-06342M', 15, 60, 2, '0', '0', '1.25', NULL, 1, 0, 0, 0, '2025-11-19 03:42:09'),
(1069, '224-06342M', 15, 62, 2, '0', '0', '1', NULL, 1, 0, 0, 0, '2025-11-19 03:42:09'),
(1070, '224-06342M', 15, 61, 2, '0', '0', '1', NULL, 1, 0, 0, 0, '2025-11-19 03:42:09'),
(1071, '224-06342M', 15, 64, 2, '0', '0', '1', NULL, 1, 0, 0, 0, '2025-11-19 03:42:09'),
(1072, '224-06342M', 15, 63, 2, '0', '0', '1', NULL, 1, 0, 0, 0, '2025-11-19 03:42:09'),
(1073, '224-06342M', 15, 59, 2, '0', '0', '1.75', NULL, 1, 0, 0, 0, '2025-11-19 03:42:09'),
(1074, '224-06342M', 15, 67, 16, '0', '0', '0', NULL, 0, 0, 0, 0, '2025-11-19 03:42:09'),
(1075, '224-06342M', 15, 73, 16, '0', '0', '0', NULL, 0, 0, 0, 0, '2025-11-19 03:42:09'),
(1076, '224-06342M', 15, 72, 16, '0', '0', '0', NULL, 0, 0, 0, 0, '2025-11-19 03:42:09'),
(1077, '224-06342M', 15, 70, 16, '0', '0', '0', NULL, 0, 0, 0, 0, '2025-11-19 03:42:09'),
(1078, '224-06342M', 15, 71, 16, '0', '0', '0', NULL, 0, 0, 0, 0, '2025-11-19 03:42:09'),
(1079, '224-06342M', 15, 76, 16, '0', '0', '0', NULL, 0, 0, 0, 0, '2025-11-19 03:42:09'),
(1080, '224-06342M', 15, 75, 16, '0', '0', '0', NULL, 0, 0, 0, 0, '2025-11-19 03:42:09'),
(1081, '224-06342M', 15, 74, 16, '0', '0', '0', NULL, 0, 0, 0, 0, '2025-11-19 03:42:09'),
(1082, '224-06342M', 15, 68, 16, '0', '0', '0', NULL, 0, 0, 0, 0, '2025-11-19 03:42:09'),
(1083, '224-06342M', 15, 69, 16, '0', '0', '0', NULL, 0, 0, 0, 0, '2025-11-19 03:42:09'),
(1084, '202500001', 1, 3, 16, '0.00', '0.00', '0.00', NULL, 0, 1, 1, 1, '2025-11-21 08:39:27'),
(1085, '202500001', 1, 4, 16, '0.00', '0.00', '0.00', NULL, 0, 1, 1, 1, '2025-11-21 08:39:27'),
(1086, '202500001', 1, 5, 16, '0.00', '0.00', '0.00', NULL, 0, 1, 1, 1, '2025-11-21 08:39:27'),
(1087, '202500001', 1, 7, 16, '0.00', '0.00', '0.00', NULL, 0, 1, 1, 1, '2025-11-21 08:39:27'),
(1088, '202500001', 1, 8, 16, '0.00', '0.00', '0.00', NULL, 0, 1, 1, 1, '2025-11-21 08:39:27'),
(1089, '202500001', 1, 6, 16, '0.00', '0.00', '0.00', NULL, 0, 1, 1, 1, '2025-11-21 08:39:27'),
(1090, '202500001', 1, 9, 16, '0.00', '0.00', '0.00', NULL, 0, 1, 1, 1, '2025-11-21 08:39:27'),
(1091, '202500001', 1, 10, 16, '0.00', '0.00', '0.00', NULL, 0, 1, 1, 1, '2025-11-21 08:39:27'),
(1092, '202500001', 1, 11, 16, '0.00', '0.00', '0.00', NULL, 0, 1, 1, 1, '2025-11-21 08:39:27');

-- --------------------------------------------------------

--
-- Table structure for table `evaluation_table`
--

CREATE TABLE `evaluation_table` (
  `id` int(11) NOT NULL,
  `school_year_id` int(11) NOT NULL DEFAULT 0,
  `question_id` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `evaluation_table`
--

INSERT INTO `evaluation_table` (`id`, `school_year_id`, `question_id`, `created_at`) VALUES
(1, 16, 7, '2025-10-12 08:27:08'),
(2, 16, 8, '2025-10-12 08:37:44'),
(3, 16, 9, '2025-10-12 11:25:59'),
(4, 3, 10, '2025-11-14 04:53:47'),
(5, 3, 11, '2025-11-14 05:29:34'),
(6, 3, 12, '2025-11-14 05:30:24'),
(7, 3, 13, '2025-11-14 05:30:38'),
(8, 3, 14, '2025-11-14 05:30:52');

-- --------------------------------------------------------

--
-- Table structure for table `matriculation`
--

CREATE TABLE `matriculation` (
  `id` int(11) NOT NULL,
  `campus_name` varchar(60) NOT NULL,
  `student_number` varchar(255) NOT NULL,
  `learner_reference_number` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `given_name` varchar(255) NOT NULL,
  `middle_initial` varchar(60) NOT NULL,
  `degree_program` varchar(255) NOT NULL,
  `year_level` varchar(255) NOT NULL,
  `sex` varchar(60) NOT NULL,
  `email_address` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `laboratory_units` varchar(255) NOT NULL,
  `computer_units` varchar(255) NOT NULL,
  `academic_units_enrolled` varchar(255) NOT NULL,
  `academic_units_nstp_enrolled` varchar(255) NOT NULL,
  `tuition_fees` varchar(255) NOT NULL,
  `nstp_fees` varchar(255) NOT NULL,
  `athletic_fees` varchar(255) NOT NULL,
  `computer_fees` varchar(255) NOT NULL,
  `cultural_fees` varchar(255) NOT NULL,
  `development_fees` varchar(255) NOT NULL,
  `guidance_fees` varchar(255) NOT NULL,
  `laboratory_fees` varchar(255) NOT NULL,
  `library_fees` varchar(255) NOT NULL,
  `medical_and_dental_fees` varchar(255) NOT NULL,
  `registration_fees` varchar(255) NOT NULL,
  `school_id_fees` varchar(255) NOT NULL,
  `total_tosf` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL,
  `active_school_year_id` int(11) NOT NULL,
  `payment` varchar(255) NOT NULL DEFAULT '0',
  `balance` varchar(255) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `matriculation`
--

INSERT INTO `matriculation` (`id`, `campus_name`, `student_number`, `learner_reference_number`, `last_name`, `given_name`, `middle_initial`, `degree_program`, `year_level`, `sex`, `email_address`, `phone_number`, `laboratory_units`, `computer_units`, `academic_units_enrolled`, `academic_units_nstp_enrolled`, `tuition_fees`, `nstp_fees`, `athletic_fees`, `computer_fees`, `cultural_fees`, `development_fees`, `guidance_fees`, `laboratory_fees`, `library_fees`, `medical_and_dental_fees`, `registration_fees`, `school_id_fees`, `total_tosf`, `remark`, `active_school_year_id`, `payment`, `balance`) VALUES
(1, 'Manila', '202500001', '123456789012', 'Montaño', 'Mark Anthony', 'P', 'Bachelor of Science in Architecture', 'Fourth Year', 'Male', 'markmontano999@gmail.com', '09171234567999999', '2', '3', '20', '3', '2600', '1000', '50', '500', '50', '80', '30', '200', '100', '130', '2000', '100', '3590', '', 3, '0', '0');

-- --------------------------------------------------------

--
-- Table structure for table `medical_requirements`
--

CREATE TABLE `medical_requirements` (
  `id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `student_number` varchar(50) DEFAULT NULL,
  `age_onset` varchar(50) DEFAULT NULL,
  `genital_enlargement` varchar(50) DEFAULT NULL,
  `pubic_hair` varchar(50) DEFAULT NULL,
  `height` varchar(50) DEFAULT NULL,
  `weight` varchar(50) DEFAULT NULL,
  `bmi` varchar(50) DEFAULT NULL,
  `interpretation` varchar(100) DEFAULT NULL,
  `heart_rate` varchar(50) DEFAULT NULL,
  `respiratory_rate` varchar(50) DEFAULT NULL,
  `o2_saturation` varchar(50) DEFAULT NULL,
  `blood_pressure` varchar(50) DEFAULT NULL,
  `vision_acuity` varchar(100) DEFAULT NULL,
  `general_survey` varchar(255) DEFAULT NULL,
  `skin` varchar(255) DEFAULT NULL,
  `eyes` varchar(255) DEFAULT NULL,
  `ent` varchar(255) DEFAULT NULL,
  `neck` varchar(255) DEFAULT NULL,
  `heart` varchar(255) DEFAULT NULL,
  `chest_lungs` varchar(255) DEFAULT NULL,
  `abdomen` varchar(255) DEFAULT NULL,
  `musculoskeletal` varchar(255) DEFAULT NULL,
  `breast_exam` varchar(255) DEFAULT NULL,
  `genitalia_smr` varchar(255) DEFAULT NULL,
  `penis` varchar(255) DEFAULT NULL,
  `dental_general_condition` varchar(100) DEFAULT NULL,
  `dental_good_hygiene` tinyint(1) DEFAULT 0,
  `dental_presence_of_calculus_plaque` tinyint(1) DEFAULT 0,
  `dental_gingivitis` tinyint(1) DEFAULT 0,
  `dental_denture_wearer_up` tinyint(1) DEFAULT 0,
  `dental_denture_wearer_down` tinyint(1) DEFAULT 0,
  `dental_with_braces_up` tinyint(1) DEFAULT 0,
  `dental_with_braces_down` tinyint(1) DEFAULT 0,
  `dental_with_oral_hygiene_reliner` tinyint(1) DEFAULT 0,
  `dental_diabetes` tinyint(1) DEFAULT 0,
  `dental_hypertension` tinyint(1) DEFAULT 0,
  `dental_allergies` tinyint(1) DEFAULT 0,
  `dental_heart_disease` tinyint(1) DEFAULT 0,
  `dental_epilepsy` tinyint(1) DEFAULT 0,
  `dental_mental_illness` tinyint(1) DEFAULT 0,
  `dental_clotting_disorder` tinyint(1) DEFAULT 0,
  `dental_upper_right` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dental_upper_right`)),
  `dental_upper_left` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dental_upper_left`)),
  `dental_lower_right` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dental_lower_right`)),
  `dental_lower_left` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dental_lower_left`)),
  `pne_mental_status_check` tinyint(1) DEFAULT 0,
  `pne_mental_status_text` varchar(255) DEFAULT NULL,
  `pne_sensory_check` tinyint(1) DEFAULT 0,
  `pne_sensory_text` varchar(255) DEFAULT NULL,
  `pne_cranial_nerve_check` tinyint(1) DEFAULT 0,
  `pne_cranial_nerve_text` varchar(255) DEFAULT NULL,
  `pne_cerebellar_check` tinyint(1) DEFAULT 0,
  `pne_cerebellar_text` varchar(255) DEFAULT NULL,
  `pne_motor_check` tinyint(1) DEFAULT 0,
  `pne_motor_text` varchar(255) DEFAULT NULL,
  `pne_reflexes_check` tinyint(1) DEFAULT 0,
  `pne_reflexes_text` varchar(255) DEFAULT NULL,
  `pne_findings_psychological` text DEFAULT NULL,
  `pne_recommendations` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medical_requirements`
--

INSERT INTO `medical_requirements` (`id`, `person_id`, `student_number`, `age_onset`, `genital_enlargement`, `pubic_hair`, `height`, `weight`, `bmi`, `interpretation`, `heart_rate`, `respiratory_rate`, `o2_saturation`, `blood_pressure`, `vision_acuity`, `general_survey`, `skin`, `eyes`, `ent`, `neck`, `heart`, `chest_lungs`, `abdomen`, `musculoskeletal`, `breast_exam`, `genitalia_smr`, `penis`, `dental_general_condition`, `dental_good_hygiene`, `dental_presence_of_calculus_plaque`, `dental_gingivitis`, `dental_denture_wearer_up`, `dental_denture_wearer_down`, `dental_with_braces_up`, `dental_with_braces_down`, `dental_with_oral_hygiene_reliner`, `dental_diabetes`, `dental_hypertension`, `dental_allergies`, `dental_heart_disease`, `dental_epilepsy`, `dental_mental_illness`, `dental_clotting_disorder`, `dental_upper_right`, `dental_upper_left`, `dental_lower_right`, `dental_lower_left`, `pne_mental_status_check`, `pne_mental_status_text`, `pne_sensory_check`, `pne_sensory_text`, `pne_cranial_nerve_check`, `pne_cranial_nerve_text`, `pne_cerebellar_check`, `pne_cerebellar_text`, `pne_motor_check`, `pne_motor_text`, `pne_reflexes_check`, `pne_reflexes_text`, `pne_findings_psychological`, `pne_recommendations`, `created_at`, `updated_at`) VALUES
(3, 1, '202500001', '22', '25', '56', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', NULL, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '[\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]', '[\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]', '[\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]', '[\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]', 1, 'bad eyesight', 1, NULL, 1, NULL, 1, NULL, 1, NULL, 1, NULL, 'Ongoing', NULL, '2025-10-09 21:51:30', '2025-10-20 16:31:54'),
(5, 0, '202500002', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, 0, NULL, 0, NULL, 0, NULL, 0, NULL, NULL, NULL, '2025-10-15 09:34:07', '2025-10-15 09:34:07'),
(6, 0, '202500003', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, 0, NULL, 0, NULL, 0, NULL, 0, NULL, NULL, NULL, '2025-10-15 09:34:12', '2025-10-15 09:34:12'),
(7, 0, '202500004', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, 0, NULL, 0, NULL, 0, NULL, 0, NULL, NULL, NULL, '2025-10-15 09:34:16', '2025-10-15 09:34:16'),
(8, 0, '2025000001', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, 0, NULL, 0, NULL, 0, NULL, 0, NULL, NULL, NULL, '2025-10-21 09:07:37', '2025-10-21 09:07:37'),
(9, 0, ' PHYSICAL AND NEUROLOGICAL EXAMINATION', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, 0, NULL, 0, NULL, 0, NULL, 0, NULL, 0, NULL, 0, NULL, NULL, NULL, '2025-10-21 09:08:10', '2025-10-21 09:08:10');

-- --------------------------------------------------------

--
-- Table structure for table `page_access`
--

CREATE TABLE `page_access` (
  `id` int(11) NOT NULL,
  `page_privilege` tinyint(1) NOT NULL,
  `page_id` int(11) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `page_access`
--

INSERT INTO `page_access` (`id`, `page_privilege`, `page_id`, `user_id`) VALUES
(40, 1, 10, '224-06342M'),
(42, 1, 12, '224-06342M'),
(43, 1, 13, '224-06342M'),
(45, 1, 15, '224-06342M'),
(46, 1, 16, '224-06342M'),
(47, 1, 17, '224-06342M'),
(48, 1, 18, '224-06342M'),
(49, 1, 19, '224-06342M'),
(50, 1, 20, '224-06342M'),
(51, 1, 21, '224-06342M'),
(52, 1, 22, '224-06342M'),
(53, 1, 23, '224-06342M'),
(54, 1, 24, '224-06342M'),
(55, 1, 25, '224-06342M'),
(56, 1, 26, '224-06342M'),
(57, 1, 27, '224-06342M'),
(58, 1, 29, '224-06342M'),
(59, 1, 28, '224-06342M'),
(60, 1, 30, '224-06342M'),
(61, 1, 31, '224-06342M'),
(62, 1, 32, '224-06342M'),
(63, 1, 33, '224-06342M'),
(64, 1, 34, '224-06342M'),
(65, 1, 35, '224-06342M'),
(66, 1, 36, '224-06342M'),
(68, 1, 72, '224-06342M'),
(69, 1, 73, '224-06342M'),
(70, 1, 70, '224-06342M'),
(72, 1, 68, '224-06342M'),
(73, 1, 69, '224-06342M'),
(74, 1, 66, '224-06342M'),
(75, 1, 67, '224-06342M'),
(78, 1, 62, '224-06342M'),
(79, 1, 63, '224-06342M'),
(80, 1, 60, '224-06342M'),
(81, 1, 61, '224-06342M'),
(82, 1, 58, '224-06342M'),
(83, 1, 59, '224-06342M'),
(85, 1, 57, '224-06342M'),
(86, 1, 54, '224-06342M'),
(89, 1, 53, '224-06342M'),
(90, 1, 50, '224-06342M'),
(92, 1, 48, '224-06342M'),
(93, 1, 49, '224-06342M'),
(94, 1, 46, '224-06342M'),
(95, 1, 47, '224-06342M'),
(97, 1, 44, '224-06342M'),
(98, 1, 45, '224-06342M'),
(99, 1, 42, '224-06342M'),
(100, 1, 43, '224-06342M'),
(101, 1, 41, '224-06342M'),
(103, 1, 96, '224-06342M'),
(106, 1, 99, '224-06342M'),
(107, 1, 100, '224-06342M'),
(108, 1, 101, '224-06342M'),
(109, 1, 86, '224-06342M'),
(110, 1, 87, '224-06342M'),
(111, 1, 88, '224-06342M'),
(112, 1, 89, '224-06342M'),
(114, 1, 90, '224-06342M'),
(115, 1, 91, '224-06342M'),
(118, 1, 94, '224-06342M'),
(119, 1, 85, '224-06342M'),
(120, 1, 82, '224-06342M'),
(121, 1, 83, '224-06342M'),
(122, 1, 84, '224-06342M'),
(123, 1, 95, '224-06342M'),
(124, 1, 80, '224-06342M'),
(125, 1, 78, '224-06342M'),
(126, 1, 79, '224-06342M'),
(129, 1, 74, '224-06342M'),
(130, 1, 75, '224-06342M'),
(131, 1, 81, '224-06342M'),
(133, 1, 40, '224-06342M'),
(146, 1, 93, '224-06342M'),
(158, 1, 52, '224-06342M'),
(160, 1, 65, '224-06342M'),
(161, 1, 93, '224-06342M'),
(162, 1, 9, '224-06342M'),
(170, 1, 11, '224-06342M'),
(171, 1, 64, '224-06342m'),
(172, 1, 51, '224-06342m'),
(173, 1, 37, '224-06342m'),
(175, 1, 76, '224-06342m'),
(177, 1, 77, '224-06342M'),
(178, 1, 77, '224-06342M'),
(179, 1, 71, '224-06342M'),
(180, 1, 55, '224-06342M'),
(181, 1, 56, '224-06342M'),
(182, 1, 38, '224-06342M'),
(183, 1, 39, '224-06342M'),
(185, 1, 14, '224-06342M'),
(186, 1, 98, '224-06342m'),
(202, 1, 6, '224-06342m'),
(205, 1, 2, '224-06342M'),
(206, 1, 1, '224-06342M'),
(207, 1, 3, '224-06342M'),
(208, 1, 4, '224-06342M'),
(209, 1, 5, '224-06342M'),
(211, 1, 8, '224-06342M'),
(212, 1, 7, '224-06342M'),
(216, 1, 97, '224-06342M'),
(217, 1, 92, '224-06342M'),
(218, 1, 92, '123456'),
(219, 1, 6, '123456'),
(220, 1, 44, '123456'),
(221, 1, 43, '123456'),
(222, 1, 46, '123456'),
(223, 1, 45, '123456'),
(224, 1, 47, '123456'),
(225, 1, 49, '123456'),
(226, 1, 37, '123456'),
(227, 1, 36, '123456'),
(228, 1, 60, '123456'),
(229, 1, 17, '123456'),
(230, 1, 10, '123456'),
(231, 1, 12, '123456'),
(232, 1, 43, '22222'),
(233, 1, 44, '22222'),
(234, 1, 45, '22222'),
(235, 1, 46, '22222'),
(236, 1, 47, '22222'),
(237, 1, 49, '22222'),
(238, 1, 36, '22222'),
(239, 1, 37, '22222'),
(240, 1, 17, '22222'),
(241, 1, 10, '22222'),
(242, 1, 12, '22222'),
(243, 1, 60, '22222'),
(244, 1, 92, '222'),
(245, 1, 93, '222'),
(246, 1, 94, '222'),
(247, 1, 95, '222'),
(248, 1, 96, '222'),
(249, 1, 97, '222'),
(250, 1, 98, '222'),
(251, 1, 6, '222'),
(252, 1, 7, '222'),
(253, 1, 8, '222'),
(254, 1, 9, '222'),
(255, 1, 10, '222'),
(256, 1, 11, '222'),
(257, 1, 12, '222'),
(258, 1, 92, '7809'),
(259, 1, 1, '7809'),
(260, 1, 2, '7809'),
(261, 1, 3, '7809'),
(262, 1, 4, '7809'),
(263, 1, 5, '7809'),
(264, 1, 6, '7809'),
(265, 1, 7, '7809'),
(266, 1, 8, '7809'),
(267, 1, 9, '7809'),
(268, 1, 11, '7809'),
(269, 1, 33, '7809'),
(270, 1, 48, '7809'),
(271, 1, 52, '7809'),
(272, 1, 61, '7809'),
(273, 1, 66, '7809'),
(274, 1, 71, '7809'),
(275, 1, 1, '666'),
(276, 1, 2, '666'),
(277, 1, 3, '666'),
(278, 1, 4, '666'),
(279, 1, 5, '666'),
(280, 1, 6, '666'),
(281, 1, 7, '666'),
(282, 1, 8, '666'),
(283, 1, 9, '666'),
(284, 1, 10, '666'),
(285, 1, 11, '666'),
(286, 1, 12, '666'),
(287, 1, 13, '666'),
(288, 1, 14, '666'),
(289, 1, 15, '666'),
(290, 1, 16, '666'),
(291, 1, 17, '666'),
(292, 1, 18, '666'),
(293, 1, 19, '666'),
(294, 1, 20, '666'),
(295, 1, 21, '666'),
(296, 1, 22, '666'),
(297, 1, 23, '666'),
(298, 1, 24, '666'),
(299, 1, 25, '666'),
(300, 1, 26, '666'),
(301, 1, 27, '666'),
(302, 1, 28, '666'),
(303, 1, 29, '666'),
(304, 1, 30, '666'),
(305, 1, 31, '666'),
(306, 1, 32, '666'),
(307, 1, 33, '666'),
(308, 1, 34, '666'),
(309, 1, 35, '666'),
(310, 1, 36, '666'),
(311, 1, 37, '666'),
(312, 1, 38, '666'),
(313, 1, 39, '666'),
(314, 1, 40, '666'),
(315, 1, 41, '666'),
(316, 1, 42, '666'),
(317, 1, 43, '666'),
(318, 1, 44, '666'),
(319, 1, 45, '666'),
(320, 1, 46, '666'),
(321, 1, 47, '666'),
(322, 1, 48, '666'),
(323, 1, 49, '666'),
(324, 1, 50, '666'),
(325, 1, 51, '666'),
(326, 1, 52, '666'),
(327, 1, 53, '666'),
(328, 1, 54, '666'),
(329, 1, 55, '666'),
(330, 1, 56, '666'),
(331, 1, 57, '666'),
(332, 1, 58, '666'),
(333, 1, 59, '666'),
(334, 1, 60, '666'),
(335, 1, 61, '666'),
(336, 1, 62, '666'),
(337, 1, 63, '666'),
(338, 1, 64, '666'),
(339, 1, 65, '666'),
(340, 1, 66, '666'),
(341, 1, 67, '666'),
(342, 1, 68, '666'),
(343, 1, 69, '666'),
(344, 1, 70, '666'),
(345, 1, 71, '666'),
(346, 1, 72, '666'),
(347, 1, 73, '666'),
(348, 1, 74, '666'),
(349, 1, 75, '666'),
(350, 1, 76, '666'),
(351, 1, 77, '666'),
(352, 1, 78, '666'),
(353, 1, 79, '666'),
(354, 1, 80, '666'),
(355, 1, 81, '666'),
(356, 1, 82, '666'),
(357, 1, 83, '666'),
(358, 1, 84, '666'),
(359, 1, 85, '666'),
(360, 1, 86, '666'),
(361, 1, 87, '666'),
(362, 1, 88, '666'),
(363, 1, 89, '666'),
(364, 1, 90, '666'),
(365, 1, 91, '666'),
(366, 1, 92, '666'),
(367, 1, 93, '666'),
(368, 1, 94, '666'),
(369, 1, 95, '666'),
(370, 1, 96, '666'),
(371, 1, 97, '666'),
(372, 1, 98, '666'),
(373, 1, 99, '666'),
(374, 1, 100, '666'),
(512, 1, 92, '555'),
(513, 1, 96, '555'),
(514, 1, 73, '555'),
(515, 1, 6, '555'),
(516, 1, 10, '555'),
(517, 1, 12, '555'),
(518, 1, 17, '555'),
(519, 1, 36, '555'),
(520, 1, 37, '555'),
(521, 1, 43, '555'),
(522, 1, 44, '555'),
(523, 1, 45, '555'),
(524, 1, 46, '555'),
(525, 1, 47, '555'),
(526, 1, 49, '555'),
(527, 1, 60, '555'),
(575, 1, 1, '7890456789'),
(576, 1, 2, '7890456789'),
(577, 1, 3, '7890456789'),
(578, 1, 4, '7890456789'),
(579, 1, 5, '7890456789'),
(580, 1, 6, '7890456789'),
(581, 1, 7, '7890456789'),
(582, 1, 8, '7890456789'),
(583, 1, 9, '7890456789'),
(584, 1, 10, '7890456789'),
(585, 1, 11, '7890456789'),
(586, 1, 12, '7890456789'),
(587, 1, 13, '7890456789'),
(588, 1, 14, '7890456789'),
(589, 1, 15, '7890456789'),
(590, 1, 16, '7890456789'),
(591, 1, 17, '7890456789'),
(592, 1, 18, '7890456789'),
(593, 1, 19, '7890456789'),
(594, 1, 20, '7890456789'),
(595, 1, 21, '7890456789'),
(596, 1, 22, '7890456789'),
(597, 1, 23, '7890456789'),
(598, 1, 24, '7890456789'),
(599, 1, 25, '7890456789'),
(600, 1, 26, '7890456789'),
(601, 1, 27, '7890456789'),
(602, 1, 28, '7890456789'),
(603, 1, 29, '7890456789'),
(604, 1, 30, '7890456789'),
(605, 1, 31, '7890456789'),
(606, 1, 32, '7890456789'),
(607, 1, 33, '7890456789'),
(608, 1, 34, '7890456789'),
(609, 1, 35, '7890456789'),
(610, 1, 36, '7890456789'),
(611, 1, 37, '7890456789'),
(612, 1, 38, '7890456789'),
(613, 1, 39, '7890456789'),
(614, 1, 40, '7890456789'),
(615, 1, 41, '7890456789'),
(616, 1, 42, '7890456789'),
(617, 1, 43, '7890456789'),
(618, 1, 44, '7890456789'),
(619, 1, 45, '7890456789'),
(620, 1, 46, '7890456789'),
(621, 1, 47, '7890456789'),
(622, 1, 48, '7890456789'),
(623, 1, 49, '7890456789'),
(624, 1, 50, '7890456789'),
(625, 1, 51, '7890456789'),
(626, 1, 52, '7890456789'),
(627, 1, 53, '7890456789'),
(628, 1, 54, '7890456789'),
(629, 1, 55, '7890456789'),
(630, 1, 56, '7890456789'),
(631, 1, 57, '7890456789'),
(632, 1, 58, '7890456789'),
(633, 1, 59, '7890456789'),
(634, 1, 60, '7890456789'),
(635, 1, 61, '7890456789'),
(636, 1, 62, '7890456789'),
(637, 1, 63, '7890456789'),
(638, 1, 64, '7890456789'),
(639, 1, 65, '7890456789'),
(640, 1, 66, '7890456789'),
(641, 1, 67, '7890456789'),
(642, 1, 68, '7890456789'),
(643, 1, 69, '7890456789'),
(644, 1, 70, '7890456789'),
(645, 1, 71, '7890456789'),
(646, 1, 72, '7890456789'),
(647, 1, 73, '7890456789'),
(648, 1, 74, '7890456789'),
(649, 1, 75, '7890456789'),
(650, 1, 76, '7890456789'),
(651, 1, 77, '7890456789'),
(652, 1, 78, '7890456789'),
(653, 1, 79, '7890456789'),
(654, 1, 80, '7890456789'),
(655, 1, 81, '7890456789'),
(656, 1, 82, '7890456789'),
(657, 1, 83, '7890456789'),
(658, 1, 84, '7890456789'),
(659, 1, 85, '7890456789'),
(660, 1, 86, '7890456789'),
(661, 1, 87, '7890456789'),
(662, 1, 88, '7890456789'),
(663, 1, 89, '7890456789'),
(664, 1, 90, '7890456789'),
(665, 1, 91, '7890456789'),
(666, 1, 92, '7890456789'),
(667, 1, 93, '7890456789'),
(668, 1, 94, '7890456789'),
(669, 1, 95, '7890456789'),
(670, 1, 96, '7890456789'),
(671, 1, 97, '7890456789'),
(672, 1, 98, '7890456789'),
(673, 1, 99, '7890456789'),
(674, 1, 100, '7890456789');

-- --------------------------------------------------------

--
-- Table structure for table `page_table`
--

CREATE TABLE `page_table` (
  `id` int(11) NOT NULL,
  `page_description` varchar(255) NOT NULL,
  `page_group` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `page_table`
--

INSERT INTO `page_table` (`id`, `page_description`, `page_group`, `created_at`) VALUES
(1, 'Admin Dashboard - Personal Information', 'registrar', '2025-10-23 06:27:49'),
(2, 'Admin Dashboard - Family Background', 'registrar', '2025-10-23 06:26:47'),
(3, 'Admin Dashboard - Educational Attainment', 'registrar', '2025-10-23 06:31:17'),
(4, 'Admin Dashboard - Health Medical ', 'registrar', '2025-10-23 06:36:22'),
(5, 'Admin Dashboard - Other Information', 'registrar', '2025-10-23 06:38:11'),
(6, 'Applicant List', 'registrar', '2025-10-23 06:40:12'),
(7, 'Applicant List Admin', 'registrar', '2025-10-23 06:40:24'),
(8, 'Applicant Scoring', 'registrar', '2025-10-23 06:40:47'),
(9, 'Assign Entrance Exam', 'registrar', '2025-10-23 06:40:59'),
(10, 'Assign Qualifying / Interview Exam', 'registrar', '2025-10-23 06:41:15'),
(11, 'Assign Schedule to Applicants', 'registrar', '2025-10-23 06:41:27'),
(12, 'Assign Schedule to Applicants Qualifying / Interviewer', 'registrar', '2025-10-23 06:41:56'),
(13, 'COR for registrar', 'registrar', '2025-10-23 06:42:09'),
(14, 'Change Year Grad Period', 'registrar', '2025-10-23 06:42:26'),
(15, 'Class Roster', 'registrar', '2025-10-23 06:42:40'),
(16, 'Course Panel', 'registrar', '2025-10-23 06:42:50'),
(17, 'Course Tagging', 'registrar', '2025-10-23 06:42:59'),
(18, 'Curriculum Panel', 'registrar', '2025-10-23 06:43:10'),
(19, 'Dental Assessment', 'registrar', '2025-10-23 06:43:23'),
(20, 'Department Section', 'registrar', '2025-10-23 06:43:40'),
(21, 'Department Registration', 'registrar', '2025-10-23 06:44:12'),
(22, 'Department Room', 'registrar', '2025-10-23 06:44:20'),
(23, 'Evaluation CRUD', 'registrar', '2025-10-23 06:44:34'),
(24, 'Medical Applicant List', 'registrar', '2025-10-23 06:45:07'),
(25, 'Medical Dashboard - Personal Information', 'registrar', '2025-10-23 06:45:19'),
(26, 'Medical Dashboard - Family Background', 'registrar', '2025-10-23 06:45:52'),
(27, 'Medical Dashboard - Educational Attainment', 'registrar', '2025-10-30 01:02:49'),
(28, 'Medical Dashboard - Health Medical Records', 'registrar', '2025-10-30 01:02:49'),
(29, 'Medical Dashboard - Other Information', 'registrar', '2025-10-30 01:03:31'),
(30, 'Medical Requirements', 'registrar\r\n', '2025-10-30 01:03:31'),
(31, 'Medical Requirements Form', 'registrar', '2025-10-30 01:06:17'),
(32, 'Physical Neuro Exam', 'registrar', '2025-10-30 01:06:17'),
(33, 'Proctor Applicant List', 'registrar', '2025-10-30 01:07:04'),
(34, 'Program Panel', 'registrar', '2025-10-30 01:07:52'),
(35, 'Program Tagging', 'registrar', '2025-10-30 10:41:57'),
(36, 'Qualifying / Interviewer Applicant List', 'registrar', '2025-10-30 10:41:57'),
(37, 'Qualifying / Interview Exam Score', 'registrar', '2025-10-30 10:45:06'),
(38, 'Readmission - Personal Information', 'registrar', '2025-10-30 10:45:06'),
(39, 'Readmission - Family Background', 'registrar', '2025-10-30 10:47:15'),
(40, 'Readmission - Educational Attainment', 'registrar', '2025-10-30 10:47:15'),
(41, 'Readmission - Health Medical Records', 'registrar', '2025-10-30 10:50:27'),
(42, 'Readmission - Other Information', 'registrar', '2025-10-30 10:50:27'),
(43, 'Registrar Dashboard - Personal Information', 'registrar', '2025-10-30 11:01:02'),
(44, 'Registrar Dashboard - Family Background', 'registrar', '2025-10-30 11:01:02'),
(45, 'Registrar Dashboard - Educational Attainment', 'registrar', '2025-10-30 11:04:20'),
(46, 'Registrar Dashboard - Health Medical Records', 'registrar', '2025-10-30 11:04:20'),
(47, 'Registrar Dashboard - Other Information', 'registrar', '2025-10-30 11:05:29'),
(48, 'Registrar Examination Profile', 'registrar', '2025-10-30 11:05:29'),
(49, 'Registrar Requirements', 'registrar', '2025-10-30 11:08:03'),
(50, 'Report of Grades', 'registrar', '2025-10-30 11:08:37'),
(51, 'Requirements Form', 'registrar', '2025-10-30 11:08:37'),
(52, 'Room Registration', 'registrar', '2025-10-30 11:09:37'),
(53, 'Schedule Checker', 'registrar', '2025-10-30 11:09:37'),
(54, 'School Year Activator Panel', 'registrar', '2025-10-30 11:11:09'),
(55, 'School Year Panel', 'registrar', '2025-10-30 11:11:09'),
(56, 'Search Certificate of Registration', 'registrar', '2025-10-30 11:12:02'),
(57, 'Section Panel', 'registrar', '2025-10-30 11:12:02'),
(58, 'Semester Panel', 'registrar', '2025-10-30 11:15:35'),
(59, 'Student Numbering', 'registrar', '2025-10-30 11:15:35'),
(60, 'Student Numbering For College', 'registrar', '2025-10-30 11:16:37'),
(61, 'Student Requirements', 'registrar', '2025-10-30 11:16:37'),
(62, 'Transcript of Records', 'registrar', '2025-10-30 11:17:11'),
(63, 'Year Level Panel', 'registrar', '2025-10-30 11:17:11'),
(64, 'Year Panel', 'registrar', '2025-10-30 11:17:59'),
(65, 'Year Update Panel', 'registrar', '2025-10-30 11:17:59'),
(66, 'Announcement', 'registrar', '2025-10-30 14:14:02'),
(67, 'Email Template Manager', 'registrar', '2025-10-30 14:14:02'),
(68, 'Notifications', 'registrar', '2025-10-30 14:18:19'),
(69, 'User Page Access / Page CRUD ', 'registrar', '2025-10-30 14:18:19'),
(70, 'Register Professor', 'registrar', '2025-10-30 14:29:24'),
(71, 'Register Registrar', 'registrar', '2025-10-30 14:29:24'),
(72, 'Register Student', 'registrar', '2025-10-30 14:49:59'),
(73, 'Registrar Reset Password', 'registrar', '2025-10-30 14:50:05'),
(74, 'Settings', 'registrar', '2025-10-30 14:50:08'),
(75, 'Super Admin Applicant - Personal Information', 'registrar', '2025-10-30 14:50:08'),
(76, 'Super Admin Applicant - Family Background', 'registrar', '2025-10-30 14:51:24'),
(77, 'Super Admin Applicant - Educational Attainment', 'registrar', '2025-10-30 14:51:24'),
(78, 'Super Admin Applicant - Health Medical Records', 'registrar', '2025-10-30 15:01:08'),
(79, 'Super Admin Applicant - Other Information', 'registrar', '2025-10-30 15:01:08'),
(80, 'Super Admin Applicant List', 'registrar', '2025-10-30 15:21:27'),
(81, 'Super Admin Applicant Reset Password', 'registrar', '2025-10-30 15:21:27'),
(82, 'Super Admin Faculty Reset Password', 'registrar', '2025-10-30 15:21:27'),
(83, 'Super Admin Registrar Reset Password', 'registrar', '2025-10-30 15:21:27'),
(84, 'Super Admin Requirements Uploader', 'registrar', '2025-11-12 13:46:53'),
(85, 'Super Admin Room Registration', 'registrar', '2025-11-12 14:23:52'),
(86, 'Super Admin Student - Personal Information', 'registrar', '2025-10-30 15:21:27'),
(87, 'Super Admin Student - Family Background', 'registrar', '2025-10-30 15:21:27'),
(88, 'Super Admin Student - Educational Attainment', 'registrar', '2025-10-30 15:21:27'),
(89, 'Super Admin Student - Health Medical Records', 'registrar', '2025-10-30 15:21:27'),
(90, 'Super Admin Student - Other Information', 'registrar', '2025-10-30 15:21:27'),
(91, 'Super Admin Student Reset Password', 'registrar', '2025-10-30 15:21:27'),
(92, 'Admission Management', 'registrar', '2025-10-30 15:28:46'),
(93, 'Course Management', 'registrar', '2025-10-30 15:28:46'),
(94, 'Department Management', 'registrar', '2025-10-30 15:28:46'),
(95, 'System Management', 'registrar', '2025-10-30 15:28:46'),
(96, 'Account Dashboard', 'registrar', '2025-10-30 15:28:46'),
(97, 'History Logs', 'registrar', '2025-10-30 16:01:18'),
(98, 'Announcement For Admission', 'registrar', '2025-11-14 02:47:26'),
(99, 'TOSF CRUD', 'registrar', '2025-11-16 13:14:07'),
(100, 'Program Evaluation', 'registrar', '2025-11-17 23:37:48');

-- --------------------------------------------------------

--
-- Table structure for table `period_status`
--

CREATE TABLE `period_status` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `period_status`
--

INSERT INTO `period_status` (`id`, `description`, `status`) VALUES
(1, 'Midterm', 0),
(2, 'Finals', 0),
(3, 'Final Grading Period', 1);

-- --------------------------------------------------------

--
-- Table structure for table `person_prof_table`
--

CREATE TABLE `person_prof_table` (
  `person_id` int(11) NOT NULL,
  `bachelor` varchar(255) DEFAULT NULL,
  `master` varchar(255) DEFAULT NULL,
  `doctor` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `person_prof_table`
--

INSERT INTO `person_prof_table` (`person_id`, `bachelor`, `master`, `doctor`) VALUES
(1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `person_status_table`
--

CREATE TABLE `person_status_table` (
  `id` int(11) NOT NULL,
  `person_id` int(11) DEFAULT NULL,
  `exam_status` int(11) DEFAULT NULL,
  `requirements` int(11) DEFAULT NULL,
  `residency` int(11) DEFAULT NULL,
  `student_registration_status` int(11) DEFAULT NULL,
  `exam_result` int(11) DEFAULT NULL,
  `hs_ave` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `person_status_table`
--

INSERT INTO `person_status_table` (`id`, `person_id`, `exam_status`, `requirements`, `residency`, `student_registration_status`, `exam_result`, `hs_ave`) VALUES
(4, 1, 0, 0, 0, 1, 0, 0),
(5, 2, 0, 0, 0, 1, 0, 0),
(6, 3, 0, 0, 0, 1, 0, 0),
(7, 4, 0, 0, 0, 1, 0, 0),
(8, 5, 0, 0, 0, 1, 0, 0),
(9, 306, 0, 0, 0, 1, 0, 0),
(10, 307, 0, 0, 0, 1, 0, 0),
(11, 309, 0, 0, 0, 1, 0, 0),
(12, 323, 0, 0, 0, 1, 0, 0),
(13, 341, 0, 0, 0, 1, 0, 0),
(14, 343, 0, 0, 0, 1, 0, 0),
(15, 352, 0, 0, 0, 1, 0, 0),
(16, 347, 0, 0, 0, 1, 0, 0),
(17, 345, 0, 0, 0, 1, 0, 0),
(18, 313, 0, 0, 0, 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `person_table`
--

CREATE TABLE `person_table` (
  `person_id` int(11) NOT NULL,
  `student_number` varchar(255) DEFAULT NULL,
  `profile_img` varchar(255) DEFAULT NULL,
  `campus` int(11) DEFAULT NULL,
  `academicProgram` varchar(100) DEFAULT NULL,
  `classifiedAs` varchar(50) DEFAULT NULL,
  `applyingAs` varchar(100) DEFAULT NULL,
  `program` varchar(100) DEFAULT NULL,
  `program2` varchar(100) DEFAULT NULL,
  `program3` varchar(100) DEFAULT NULL,
  `yearLevel` varchar(30) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `extension` varchar(10) DEFAULT NULL,
  `nickname` varchar(50) DEFAULT NULL,
  `height` varchar(10) DEFAULT NULL,
  `weight` varchar(10) DEFAULT NULL,
  `lrnNumber` varchar(20) DEFAULT NULL,
  `nolrnNumber` int(5) DEFAULT NULL,
  `gender` int(11) DEFAULT NULL,
  `pwdMember` int(5) DEFAULT NULL,
  `pwdType` varchar(50) DEFAULT NULL,
  `pwdId` varchar(50) DEFAULT NULL,
  `birthOfDate` varchar(50) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `birthPlace` varchar(255) DEFAULT NULL,
  `languageDialectSpoken` varchar(255) DEFAULT NULL,
  `citizenship` varchar(50) DEFAULT NULL,
  `religion` varchar(50) DEFAULT NULL,
  `civilStatus` varchar(50) DEFAULT NULL,
  `tribeEthnicGroup` varchar(50) DEFAULT NULL,
  `cellphoneNumber` varchar(20) DEFAULT NULL,
  `emailAddress` varchar(100) DEFAULT NULL,
  `presentStreet` varchar(255) DEFAULT NULL,
  `presentBarangay` varchar(100) DEFAULT NULL,
  `presentZipCode` varchar(10) DEFAULT NULL,
  `presentRegion` varchar(100) DEFAULT NULL,
  `presentProvince` varchar(100) DEFAULT NULL,
  `presentMunicipality` varchar(100) DEFAULT NULL,
  `presentDswdHouseholdNumber` varchar(50) DEFAULT NULL,
  `sameAsPresentAddress` int(5) DEFAULT NULL,
  `permanentStreet` varchar(255) DEFAULT NULL,
  `permanentBarangay` varchar(100) DEFAULT NULL,
  `permanentZipCode` varchar(10) DEFAULT NULL,
  `permanentRegion` varchar(75) DEFAULT NULL,
  `permanentProvince` varchar(75) DEFAULT NULL,
  `permanentMunicipality` varchar(75) DEFAULT NULL,
  `permanentDswdHouseholdNumber` varchar(50) DEFAULT NULL,
  `solo_parent` int(5) DEFAULT NULL,
  `father_deceased` int(5) DEFAULT NULL,
  `father_family_name` varchar(100) DEFAULT NULL,
  `father_given_name` varchar(100) DEFAULT NULL,
  `father_middle_name` varchar(100) DEFAULT NULL,
  `father_ext` varchar(10) DEFAULT NULL,
  `father_nickname` varchar(50) DEFAULT NULL,
  `father_education` int(5) NOT NULL,
  `father_education_level` varchar(100) DEFAULT NULL,
  `father_last_school` varchar(100) DEFAULT NULL,
  `father_course` varchar(100) DEFAULT NULL,
  `father_year_graduated` varchar(10) DEFAULT NULL,
  `father_school_address` varchar(255) DEFAULT NULL,
  `father_contact` varchar(20) DEFAULT NULL,
  `father_occupation` varchar(100) DEFAULT NULL,
  `father_employer` varchar(100) DEFAULT NULL,
  `father_income` varchar(20) DEFAULT NULL,
  `father_email` varchar(100) DEFAULT NULL,
  `mother_deceased` int(5) DEFAULT NULL,
  `mother_family_name` varchar(100) DEFAULT NULL,
  `mother_given_name` varchar(100) DEFAULT NULL,
  `mother_middle_name` varchar(100) DEFAULT NULL,
  `mother_ext` varchar(10) DEFAULT NULL,
  `mother_nickname` varchar(50) DEFAULT NULL,
  `mother_education` int(5) NOT NULL,
  `mother_education_level` varchar(100) DEFAULT NULL,
  `mother_last_school` varchar(100) DEFAULT NULL,
  `mother_course` varchar(100) DEFAULT NULL,
  `mother_year_graduated` varchar(10) DEFAULT NULL,
  `mother_school_address` varchar(255) DEFAULT NULL,
  `mother_contact` varchar(20) DEFAULT NULL,
  `mother_occupation` varchar(100) DEFAULT NULL,
  `mother_employer` varchar(100) DEFAULT NULL,
  `mother_income` varchar(20) DEFAULT NULL,
  `mother_email` varchar(100) DEFAULT NULL,
  `guardian` varchar(100) DEFAULT NULL,
  `guardian_family_name` varchar(100) DEFAULT NULL,
  `guardian_given_name` varchar(100) DEFAULT NULL,
  `guardian_middle_name` varchar(100) DEFAULT NULL,
  `guardian_ext` varchar(20) DEFAULT NULL,
  `guardian_nickname` varchar(50) DEFAULT NULL,
  `guardian_address` varchar(255) DEFAULT NULL,
  `guardian_contact` varchar(20) DEFAULT NULL,
  `guardian_email` varchar(100) DEFAULT NULL,
  `annual_income` varchar(50) DEFAULT NULL,
  `schoolLevel` varchar(50) DEFAULT NULL,
  `schoolLastAttended` varchar(100) DEFAULT NULL,
  `schoolAddress` varchar(255) DEFAULT NULL,
  `courseProgram` varchar(100) DEFAULT NULL,
  `honor` varchar(100) DEFAULT NULL,
  `generalAverage` decimal(5,2) DEFAULT NULL,
  `yearGraduated` int(11) DEFAULT NULL,
  `schoolLevel1` varchar(50) DEFAULT NULL,
  `schoolLastAttended1` varchar(100) DEFAULT NULL,
  `schoolAddress1` varchar(255) DEFAULT NULL,
  `courseProgram1` varchar(100) DEFAULT NULL,
  `honor1` varchar(100) DEFAULT NULL,
  `generalAverage1` decimal(5,2) DEFAULT NULL,
  `yearGraduated1` int(11) DEFAULT NULL,
  `strand` varchar(100) DEFAULT NULL,
  `cough` int(11) DEFAULT NULL,
  `colds` int(11) DEFAULT NULL,
  `fever` int(11) DEFAULT NULL,
  `asthma` int(11) DEFAULT NULL,
  `faintingSpells` int(11) DEFAULT NULL,
  `heartDisease` int(11) DEFAULT NULL,
  `tuberculosis` int(11) DEFAULT NULL,
  `frequentHeadaches` int(11) DEFAULT NULL,
  `hernia` int(11) DEFAULT NULL,
  `chronicCough` int(11) DEFAULT NULL,
  `headNeckInjury` int(11) DEFAULT NULL,
  `hiv` int(11) DEFAULT NULL,
  `highBloodPressure` int(11) DEFAULT NULL,
  `diabetesMellitus` int(11) DEFAULT NULL,
  `allergies` int(11) DEFAULT NULL,
  `cancer` int(11) DEFAULT NULL,
  `smokingCigarette` int(11) DEFAULT NULL,
  `alcoholDrinking` int(11) DEFAULT NULL,
  `hospitalized` int(11) DEFAULT NULL,
  `hospitalizationDetails` varchar(255) DEFAULT NULL,
  `medications` varchar(255) DEFAULT NULL,
  `hadCovid` int(11) DEFAULT NULL,
  `covidDate` varchar(50) DEFAULT NULL,
  `vaccine1Brand` varchar(50) DEFAULT NULL,
  `vaccine1Date` varchar(50) DEFAULT NULL,
  `vaccine2Brand` varchar(50) DEFAULT NULL,
  `vaccine2Date` varchar(50) DEFAULT NULL,
  `booster1Brand` varchar(50) DEFAULT NULL,
  `booster1Date` varchar(50) DEFAULT NULL,
  `booster2Brand` varchar(50) DEFAULT NULL,
  `booster2Date` varchar(50) DEFAULT NULL,
  `chestXray` varchar(100) DEFAULT NULL,
  `cbc` varchar(100) DEFAULT NULL,
  `urinalysis` varchar(100) DEFAULT NULL,
  `otherworkups` varchar(255) DEFAULT NULL,
  `symptomsToday` int(11) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `termsOfAgreement` int(10) DEFAULT NULL,
  `created_at` varchar(100) DEFAULT NULL,
  `current_step` int(11) DEFAULT 1
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=COMPRESSED;

--
-- Dumping data for table `person_table`
--

INSERT INTO `person_table` (`person_id`, `student_number`, `profile_img`, `campus`, `academicProgram`, `classifiedAs`, `applyingAs`, `program`, `program2`, `program3`, `yearLevel`, `last_name`, `first_name`, `middle_name`, `extension`, `nickname`, `height`, `weight`, `lrnNumber`, `nolrnNumber`, `gender`, `pwdMember`, `pwdType`, `pwdId`, `birthOfDate`, `age`, `birthPlace`, `languageDialectSpoken`, `citizenship`, `religion`, `civilStatus`, `tribeEthnicGroup`, `cellphoneNumber`, `emailAddress`, `presentStreet`, `presentBarangay`, `presentZipCode`, `presentRegion`, `presentProvince`, `presentMunicipality`, `presentDswdHouseholdNumber`, `sameAsPresentAddress`, `permanentStreet`, `permanentBarangay`, `permanentZipCode`, `permanentRegion`, `permanentProvince`, `permanentMunicipality`, `permanentDswdHouseholdNumber`, `solo_parent`, `father_deceased`, `father_family_name`, `father_given_name`, `father_middle_name`, `father_ext`, `father_nickname`, `father_education`, `father_education_level`, `father_last_school`, `father_course`, `father_year_graduated`, `father_school_address`, `father_contact`, `father_occupation`, `father_employer`, `father_income`, `father_email`, `mother_deceased`, `mother_family_name`, `mother_given_name`, `mother_middle_name`, `mother_ext`, `mother_nickname`, `mother_education`, `mother_education_level`, `mother_last_school`, `mother_course`, `mother_year_graduated`, `mother_school_address`, `mother_contact`, `mother_occupation`, `mother_employer`, `mother_income`, `mother_email`, `guardian`, `guardian_family_name`, `guardian_given_name`, `guardian_middle_name`, `guardian_ext`, `guardian_nickname`, `guardian_address`, `guardian_contact`, `guardian_email`, `annual_income`, `schoolLevel`, `schoolLastAttended`, `schoolAddress`, `courseProgram`, `honor`, `generalAverage`, `yearGraduated`, `schoolLevel1`, `schoolLastAttended1`, `schoolAddress1`, `courseProgram1`, `honor1`, `generalAverage1`, `yearGraduated1`, `strand`, `cough`, `colds`, `fever`, `asthma`, `faintingSpells`, `heartDisease`, `tuberculosis`, `frequentHeadaches`, `hernia`, `chronicCough`, `headNeckInjury`, `hiv`, `highBloodPressure`, `diabetesMellitus`, `allergies`, `cancer`, `smokingCigarette`, `alcoholDrinking`, `hospitalized`, `hospitalizationDetails`, `medications`, `hadCovid`, `covidDate`, `vaccine1Brand`, `vaccine1Date`, `vaccine2Brand`, `vaccine2Date`, `booster1Brand`, `booster1Date`, `booster2Brand`, `booster2Date`, `chestXray`, `cbc`, `urinalysis`, `otherworkups`, `symptomsToday`, `remarks`, `termsOfAgreement`, `created_at`, `current_step`) VALUES
(1, '202500001', '2025100001_1by1_2025.jpg', 1, 'Undergraduate', 'Freshman (First Year)', 'Master Degree Graduate', '6', '11', '14', 'First Year', 'Montaño', 'Mark Anthony', 'Placido', NULL, 'Johnny', '5\'11', '65kg', '123456789012', 0, 0, 0, NULL, NULL, '2005-10-23', 20, 'Manila, Philippines', 'Tagalog, English', 'FILIPINO', 'Born Again', 'Single', 'Agta', '09171234567999999', 'markmontano999@gmail.com', '19 G Dona Yayang Street ', 'Libis', '1000', 'National Capital Region (NCR)', 'Metro Manila, Second District', 'Quezon City', 'DSWD123456', 0, '19 G Dona Yayang Street ', 'Libis', '1000', 'National Capital Region (NCR)', 'Metro Manila, Second District', 'Quezon City', 'DSWD123456', 0, 0, 'Doe S', 'Jonathan', 'Smiths', 'III', 'Jon', 1, NULL, NULL, NULL, NULL, NULL, '0918123456', 'Engineer', 'ABC Corp', '50000', 'jon.doe@abc.com', 0, 'Jan', 'Mary', 'Anne', NULL, 'Janey', 1, NULL, NULL, NULL, NULL, NULL, '09221234567', 'Accountant', 'XYZ Corp', '100000', 'jane.doe@xyz.com', 'StepFather', 'Parker', 'Ben', 'Jose', 'IV', 'Benny', '789 Recto Av', '09192233445', NULL, '135,000 to 250,000', 'Senior High School', 'CGEAHS', 'Pasig Citys', 'STEM', 'With Honors', 92.50, 2022, 'Senior High School', 'CGEAHS', 'Rizal High School', 'Rizal High School', '0', 66.00, 0, 'Information and Communications Technology (ICT)', 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 'Wala ngani', 'Vitamins C', 1, '2022-02-11', 'Pfizer', '2022-03-14', 'Pfizer', '2022-04-13', 'Moderna', '2022-07-14', 'Pfizer', '2023-01-14', 'Normal', 'Normal', 'Normal', 'Normal', 1, 'Fit to enroll', 1, '2025-11-08', 1),
(2, '202500002', '3_1by1_2025.jpg', 1, 'Techvoc', 'Freshman (First Year)', 'Senior High School Graduate', '38', '4', '3', 'Second  Year', 'Emily', 'Johnson', 'Grace', '', 'MARK', '5\'11', '65', '123456789012', 0, 0, 0, '', '', '2003-06-26', 21, 'Manila, Philippines', 'Tagalog, English', 'ALGERIAN', 'Iglesia Ni Cristo', 'Single', 'Cebuano', '09953242510', 'emily.johnson2@example.com', '19 G Dona yayang Street Libis', 'Pag-asa', '4100', 'National Capital Region (NCR)', 'Metro Manila, Second District', 'City Of Mandaluyong', 'DSWD123456', 0, '19 G Dona yayang Street Libis', 'Malipayon', '4100', 'Region X (Northern Mindanao)', 'Bukidnon', 'Pangantucan', 'DSWD123456', 0, 0, '', '', '', '', '', 0, '', '', '', '', '', '', '', '', '', '', 0, '', '', '', '', '', 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'fgdsgfasftrasf', '', '', '', 0.00, 0, '', '', '', '', '', 83.00, 0, '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', 0, '', '', '', '', '', '', '', '', '', '', '', '', '', 0, '', 0, '2024-12-10', 1),
(60, NULL, NULL, 0, NULL, NULL, NULL, '31', NULL, NULL, NULL, 'Bell', 'Evelyn', 'Faith', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'evelyn.bell60@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 63.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-08-09', 1),
(59, NULL, NULL, 0, NULL, NULL, NULL, '5', NULL, NULL, NULL, 'Morgan', 'Levi', 'Anne', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'levi.morgan59@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 99.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-04-12', 1),
(58, NULL, NULL, 1, NULL, NULL, NULL, '22', NULL, NULL, NULL, 'Cook', 'Zoey', 'Mae', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'zoey.cook58@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 28.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-03-01', 1),
(57, NULL, NULL, 0, NULL, NULL, NULL, '32', NULL, NULL, NULL, 'Reed', 'Nathan', 'John', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'nathan.reed57@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 29.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-01-08', 1),
(56, NULL, NULL, 0, NULL, NULL, NULL, '53', NULL, NULL, NULL, 'Rogers', 'Layla', 'Joy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'layla.rogers56@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 20.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-04-23', 1),
(55, NULL, NULL, 0, NULL, NULL, NULL, '28', NULL, NULL, NULL, 'Morris', 'Dylan', 'Faith', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'dylan.morris55@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 61.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-30', 1),
(54, NULL, NULL, 1, NULL, NULL, NULL, '20', NULL, NULL, NULL, 'Stewart', 'Penelope', 'Pearl', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'penelope.stewart54@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 40.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-10', 1),
(53, NULL, NULL, 1, NULL, NULL, NULL, '54', NULL, NULL, NULL, 'Collins', 'Isaac', 'Anne', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'isaac.collins53@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-22', 1),
(52, NULL, NULL, 1, NULL, NULL, NULL, '19', NULL, NULL, NULL, 'Edwards', 'Victoria', 'Jean', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'victoria.edwards52@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 75.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-09-01', 1),
(51, NULL, NULL, 0, NULL, NULL, NULL, '30', NULL, NULL, NULL, 'Parker', 'Carter', 'Ruth', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'carter.parker51@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 32.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-09-02', 1),
(50, NULL, NULL, 1, NULL, NULL, NULL, '2', NULL, NULL, NULL, 'Campbell', 'Ella', 'Ruth', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ella.campbell50@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 20.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-01-25', 1),
(49, NULL, NULL, 0, NULL, NULL, NULL, '19', NULL, NULL, NULL, 'Phillips', 'Gabriel', 'Mae', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'gabriel.phillips49@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 79.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-10-08', 1),
(48, NULL, NULL, 0, NULL, NULL, NULL, '19', NULL, NULL, NULL, 'Turner', 'Sofia', 'Joy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sofia.turner48@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 38.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-10-19', 1),
(47, NULL, NULL, 0, NULL, NULL, NULL, '38', NULL, NULL, NULL, 'Evans', 'Jayden', 'Ivy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'jayden.evans47@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 48.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-01-19', 1),
(46, NULL, NULL, 1, NULL, NULL, NULL, '4', NULL, NULL, NULL, 'Roberts', 'Madison', 'Dawn', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'madison.roberts46@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'jgjhgjgkhk', NULL, NULL, NULL, 43.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-04', 1),
(45, NULL, NULL, 0, NULL, NULL, NULL, '2', NULL, NULL, NULL, 'Perez', 'Luke', 'James', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'luke.perez45@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 79.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-06-22', 1),
(44, NULL, NULL, 1, NULL, NULL, NULL, '9', NULL, NULL, NULL, 'Mitchell', 'Abigail', 'Faith', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'abigail.mitchell44@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 46.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-12-05', 1),
(43, NULL, NULL, 1, NULL, NULL, NULL, '49', NULL, NULL, NULL, 'Carter', 'Wyatt', 'Dean', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'wyatt.carter43@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 8.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-03-17', 1),
(42, NULL, NULL, 1, NULL, NULL, NULL, '43', NULL, NULL, NULL, 'Nelson', 'Hannah', 'George', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'hannah.nelson42@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 7.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-02', 1),
(41, NULL, NULL, 1, NULL, NULL, NULL, '6', NULL, NULL, NULL, 'Gonzalez', 'Owen', 'Louise', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'owen.gonzalez41@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 90.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-29', 1),
(40, NULL, NULL, 1, NULL, NULL, NULL, '2', NULL, NULL, NULL, 'Baker', 'Scarlett', 'James', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'scarlett.baker40@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 74.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-26', 1),
(39, NULL, NULL, 0, NULL, NULL, NULL, '41', NULL, NULL, NULL, 'Adams', 'Jack', 'Scott', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'jack.adams39@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 95.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-10-22', 1),
(38, NULL, NULL, 1, NULL, NULL, NULL, '4', NULL, NULL, NULL, 'Green', 'Avery', 'Neil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'avery.green38@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 82.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-07-30', 1),
(37, NULL, NULL, 0, NULL, NULL, NULL, '5', NULL, NULL, NULL, 'Hill', 'Sebastian', 'Mark', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sebastian.hill37@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 87.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-05-28', 1),
(36, NULL, NULL, 1, NULL, NULL, NULL, '39', NULL, NULL, NULL, 'Nguyen', 'Aria', 'Belle', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aria.nguyen36@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 48.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-12-19', 1),
(35, NULL, NULL, 1, NULL, NULL, NULL, '52', NULL, NULL, NULL, 'Torres', 'Samuel', 'Scott', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'samuel.torres35@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 77.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-08-14', 1),
(34, NULL, NULL, 0, NULL, NULL, NULL, '1', NULL, NULL, NULL, 'Scott', 'Zoe', 'Ray', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'zoe.scott34@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 69.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-01-18', 1),
(33, NULL, NULL, 1, NULL, NULL, NULL, '1', NULL, NULL, NULL, 'Wright', 'Joseph', 'Claire', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'joseph.wright33@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 81.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-10-30', 1),
(32, NULL, NULL, 0, NULL, NULL, NULL, '15', NULL, NULL, NULL, 'King', 'Lily', 'Lee', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'lily.king32@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 67.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-11-20', 1),
(31, NULL, NULL, 1, NULL, NULL, NULL, '38', NULL, NULL, NULL, 'Allen', 'Aiden', 'Dawn', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'aiden.allen31@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 97.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-09-09', 1),
(30, NULL, NULL, 0, NULL, NULL, NULL, '24', NULL, NULL, NULL, 'Young', 'Chloe', 'Neil', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'chloe.young30@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 14.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-10-13', 1),
(29, NULL, NULL, 0, NULL, NULL, NULL, '13', NULL, NULL, NULL, 'Walker', 'Elijah', 'Dawn', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'elijah.walker29@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 24.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-08-15', 1),
(28, NULL, NULL, 0, NULL, NULL, NULL, '26', NULL, NULL, NULL, 'Robinson', 'Grace', 'Ruth', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'grace.robinson28@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 49.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-01-06', 1),
(27, NULL, NULL, 1, NULL, NULL, NULL, '49', NULL, NULL, NULL, 'Lewis', 'Logan', 'John', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'logan.lewis27@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 80.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-02-24', 1),
(26, NULL, NULL, 0, NULL, NULL, NULL, '42', NULL, NULL, NULL, 'Ramirez', 'Ella', 'George', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ella.ramirez26@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-01-12', 1),
(25, NULL, NULL, 1, NULL, NULL, NULL, '5', NULL, NULL, NULL, 'Clark', 'Mason', 'Anne', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'mason.clark25@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-06-22', 1),
(24, NULL, NULL, 1, NULL, NULL, NULL, '47', NULL, NULL, NULL, 'Sanchez', 'Harper', 'Grace', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'harper.sanchez24@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 90.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-06', 1),
(23, NULL, NULL, 1, NULL, NULL, NULL, '24', NULL, NULL, NULL, 'Harris', 'Lucas', 'Joy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'lucas.harris23@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 89.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-01-10', 1),
(22, NULL, NULL, 1, NULL, NULL, NULL, '48', NULL, NULL, NULL, 'White', 'Amelia', 'Lynn', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'amelia.white22@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 88.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-08-26', 1),
(21, NULL, NULL, 1, NULL, NULL, NULL, '32', NULL, NULL, NULL, 'Thompson', 'Henry', 'Kate', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'henry.thompson21@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 38.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-10-22', 1),
(20, NULL, NULL, 1, NULL, NULL, NULL, '37', NULL, NULL, NULL, 'Perez', 'Charlotte', 'Ely', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'charlotte.perez20@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-05-01', 1),
(19, NULL, NULL, 1, NULL, NULL, NULL, '6', NULL, NULL, NULL, 'Lee', 'William', 'Lynn', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'william.lee19@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 61.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-09-26', 1),
(18, NULL, NULL, 0, NULL, NULL, NULL, '9', NULL, NULL, NULL, 'Martin', 'Mia', 'Ruth', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'mia.martin18@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 60.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-08-02', 1),
(17, NULL, NULL, 1, NULL, NULL, NULL, '27', NULL, NULL, NULL, 'Jackson', 'Alexander', 'Lynn', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'alexander.jackson17@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 46.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10', 1),
(16, NULL, NULL, 1, NULL, NULL, NULL, '7', NULL, NULL, NULL, 'Moore', 'Isabella', 'Marie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'isabella.moore16@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-02-09', 1),
(15, NULL, NULL, 1, NULL, NULL, NULL, '26', NULL, NULL, NULL, 'Taylor', 'Ethan', 'Mark', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ethan.taylor15@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 83.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-07-27', 1),
(14, NULL, NULL, 1, NULL, NULL, NULL, '2', NULL, NULL, NULL, 'Thomas', 'Ava', 'Scott', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ava.thomas14@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 70.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-01-29', 1),
(13, NULL, NULL, 0, NULL, NULL, NULL, '11', NULL, NULL, NULL, 'Anderson', 'Benjamin', 'Mark', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'benjamin.anderson13@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-09-12', 1);
INSERT INTO `person_table` (`person_id`, `student_number`, `profile_img`, `campus`, `academicProgram`, `classifiedAs`, `applyingAs`, `program`, `program2`, `program3`, `yearLevel`, `last_name`, `first_name`, `middle_name`, `extension`, `nickname`, `height`, `weight`, `lrnNumber`, `nolrnNumber`, `gender`, `pwdMember`, `pwdType`, `pwdId`, `birthOfDate`, `age`, `birthPlace`, `languageDialectSpoken`, `citizenship`, `religion`, `civilStatus`, `tribeEthnicGroup`, `cellphoneNumber`, `emailAddress`, `presentStreet`, `presentBarangay`, `presentZipCode`, `presentRegion`, `presentProvince`, `presentMunicipality`, `presentDswdHouseholdNumber`, `sameAsPresentAddress`, `permanentStreet`, `permanentBarangay`, `permanentZipCode`, `permanentRegion`, `permanentProvince`, `permanentMunicipality`, `permanentDswdHouseholdNumber`, `solo_parent`, `father_deceased`, `father_family_name`, `father_given_name`, `father_middle_name`, `father_ext`, `father_nickname`, `father_education`, `father_education_level`, `father_last_school`, `father_course`, `father_year_graduated`, `father_school_address`, `father_contact`, `father_occupation`, `father_employer`, `father_income`, `father_email`, `mother_deceased`, `mother_family_name`, `mother_given_name`, `mother_middle_name`, `mother_ext`, `mother_nickname`, `mother_education`, `mother_education_level`, `mother_last_school`, `mother_course`, `mother_year_graduated`, `mother_school_address`, `mother_contact`, `mother_occupation`, `mother_employer`, `mother_income`, `mother_email`, `guardian`, `guardian_family_name`, `guardian_given_name`, `guardian_middle_name`, `guardian_ext`, `guardian_nickname`, `guardian_address`, `guardian_contact`, `guardian_email`, `annual_income`, `schoolLevel`, `schoolLastAttended`, `schoolAddress`, `courseProgram`, `honor`, `generalAverage`, `yearGraduated`, `schoolLevel1`, `schoolLastAttended1`, `schoolAddress1`, `courseProgram1`, `honor1`, `generalAverage1`, `yearGraduated1`, `strand`, `cough`, `colds`, `fever`, `asthma`, `faintingSpells`, `heartDisease`, `tuberculosis`, `frequentHeadaches`, `hernia`, `chronicCough`, `headNeckInjury`, `hiv`, `highBloodPressure`, `diabetesMellitus`, `allergies`, `cancer`, `smokingCigarette`, `alcoholDrinking`, `hospitalized`, `hospitalizationDetails`, `medications`, `hadCovid`, `covidDate`, `vaccine1Brand`, `vaccine1Date`, `vaccine2Brand`, `vaccine2Date`, `booster1Brand`, `booster1Date`, `booster2Brand`, `booster2Date`, `chestXray`, `cbc`, `urinalysis`, `otherworkups`, `symptomsToday`, `remarks`, `termsOfAgreement`, `created_at`, `current_step`) VALUES
(12, NULL, NULL, 0, NULL, NULL, NULL, '18', NULL, NULL, NULL, 'Wilson', 'Sophia', 'Jane', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sophia.wilson12@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 81.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-05-05', 1),
(11, NULL, NULL, 1, NULL, NULL, NULL, '23', NULL, NULL, NULL, 'Gonzalez', 'James', 'John', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'james.gonzalez11@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 75.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-05-13', 1),
(10, NULL, NULL, 1, NULL, NULL, NULL, '22', NULL, NULL, NULL, 'Lopez', 'Olivia', 'Marie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'olivia.lopez10@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 49.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-25', 1),
(7, NULL, NULL, 0, NULL, NULL, NULL, '44', NULL, NULL, NULL, 'Miller', 'Daniel', 'Jane', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'daniel.miller7@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 65.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-08-24', 1),
(8, NULL, NULL, 1, NULL, NULL, NULL, '15', NULL, NULL, NULL, 'Davis', 'Ashley', 'Ely', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ashley.davis8@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 14.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-05-19', 1),
(9, NULL, NULL, 0, NULL, NULL, NULL, '36', NULL, NULL, NULL, 'Martinez', 'Matthew', 'Dawn', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'matthew.martinez9@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 84.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-03-14', 1),
(3, NULL, NULL, 1, NULL, NULL, NULL, '19', NULL, NULL, NULL, 'Williams', 'Michael', 'Lee', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'michael.williams3@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 91.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021-04-18', 1),
(4, NULL, NULL, 1, '', NULL, NULL, '36', NULL, NULL, NULL, 'Brown', 'Sarah', 'Kate', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sarah.brown4@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-13', 1),
(5, NULL, NULL, 1, NULL, NULL, NULL, '51', NULL, NULL, NULL, 'Jones', 'David', 'James', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'david.jones5@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 39.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-27', 1),
(6, NULL, NULL, 1, NULL, NULL, NULL, '38', NULL, NULL, NULL, 'Garcia', 'Jessica', 'Belle', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'jessica.garcia6@example.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-09-29', 1),
(306, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'De La Cruz', 'Lloyd Cedrick', 'Pacheco', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'delacruz.lc.bsinfotech@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-09', 1),
(307, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Montano', 'Mark Anthony', 'Placido', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'montano.ma.bsinfotech@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16', 1),
(308, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Ciruela', 'Genny', 'D.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'montano.ma.bsinfotech@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16', 1),
(1382, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Montano', 'Mark Anthony', 'Placido', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'markmontano888@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(1347, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Montano', 'Mark Anthony', 'Placido', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'montano.ma.bsinfotech@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-01', 1),
(341, NULL, '2025100232_1by1_2025.png', 0, 'Techvoc', 'Returnee', 'Senior High School Graduate', '15', '12', '13', 'First Year', 'Kulit mo', 'Tamad', 'J', NULL, 'Johnny', '5\'5', '53', '123456789012', NULL, 0, NULL, NULL, NULL, '2000-10-09', 25, 'Manila, Philippines', 'Tagalog, English', 'SPANISH', 'Free Methodist', 'Single', 'Bantoanon', '+639953242510', 'montano.ma.bsinfotech@gmail.com', '19 G Dona yayang Street Libis', 'Ihubok I (Kaychanarianan)', '4100', 'Region II (Cagayan Valley)', 'Batanes', 'Basco (Capital)', 'DSWD1234567', 1, '19 G Dona yayang Street Libis', 'Ihubok I (Kaychanarianan)', '4100', 'Region II (Cagayan Valley)', 'Batanes', 'Basco (Capital)', 'DSWD1234567', 0, 1, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Mother', 'Montano', 'Mark Anthony', 'Placido', NULL, 'Benny', '19 G Dona yayang Street Libis', '09953242510', 'montano.ma.bsinfotech@gmail.com', '80,000 and below', 'High School/Junior High School', 'Rizal High School', 'Pasig City', 'STEM', 'With Honors', 92.59, 2022, 'Senior High School', 'NTC', 'Mendiola', 'BSIT', 'With high honor', 66.00, 2022, 'Information and Communications Technology (ICT)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-11-10', 1),
(1383, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Montano', 'Mark Anthony', 'Placido', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'markmontano222@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(1384, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(1385, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(1386, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(1387, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(1388, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'gagsagsa', 'Mark Anthonyfas', 'Placidohfg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'montano.ma.bsinfotechs@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(1389, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Montano', 'Mark Anthony', 'Placido', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'markmontano5221@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(343, NULL, '2025100234_1by1_2025.jpg', 1, 'Undergraduate', 'Transferee', 'Transferee', '2', '10', '16', 'First Year', 'Morales', 'Trix', 'Garcia', 'Jr.', 'Xei', '167', '55', '10948709021', NULL, 0, 0, NULL, NULL, '2002-10-05', 23, 'Manila, Philippines', 'Tagalog, English', 'FILIPINO', 'Catholic', 'Single', 'None', '09876543211', 'morales.ta.bsinfotech@gmail.com', 'Sampaloc', 'Alupay', '1008', 'National Capital Region (NCR)', 'Metro Manila, First District', 'Sampaloc', 'DSWD1234567', 1, 'Sampaloc', 'Alupay', '1008', 'National Capital Region (NCR)', 'Metro Manila, First District', 'Sampaloc', 'DSWD1234567', 1, 1, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Others', 'Montano', 'Mark Anthony', 'Placido', NULL, 'Benny', '19 G Dona yayang Street Libis', '09953242510', 'montano.ma.bsinfotech@gmail.com', '80,000 and below', 'High School/Junior High School', 'CGEAHS', 'Pasig City', 'STEM', 'With Honors', 92.59, 2022, 'Vocational/Trade Course', 'NTC', 'Mendiola', 'BSIT', 'With high honor', 66.00, 2022, 'Information and Communications Technology (ICT)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-11-12', 1),
(352, NULL, '2025100243_1by1_2025.jpg', 1, 'Undergraduate', 'Freshman (First Year)', 'Senior High School Graduate', '14', '15', '15', 'First Year', 'allen', 'allen', 'F', NULL, 'Mark', '5\'11', '65kg', '204-0218', NULL, 0, 0, NULL, NULL, '2005-06-10', 20, 'MN', 'Tagalog, English', 'BOTSWANIAN', 'Islam', 'Married', 'Badjao', '+639953242510', 'montano.ma.bsinfotech@gmail.com', '19 G Dona yayang Street Libis', 'Buswang Old', '4100', 'Region VI (Western Visayas)', 'Aklan', 'Kalibo (Capital)', 'DSWD1234567', 1, '19 G Dona yayang Street Libis', 'Buswang Old', '4100', 'Region VI (Western Visayas)', 'Aklan', 'Kalibo (Capital)', 'DSWD123456', 1, 1, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Mother', 'Montano', 'Mark Anthony', 'Placido', NULL, 'Benny', '19 G Dona yayang Street Libis', '09953242510', 'montano.ma.bsinfotech@gmail.com', '135,000 to 250,000', 'High School/Junior High School', 'CGEAHS', 'Pasig City', 'STEM', 'With Honors', 92.59, 2022, 'Senior High School', 'NTC', 'Mendiola', 'BSIT', 'With high honor', 43.00, 2022, 'Information and Communications Technology (ICT)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-11-19', 1),
(1390, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(347, NULL, '2025100238_1by1_2025.jpg', 1, 'Undergraduate', 'Freshman (First Year)', 'Senior High School Graduating Student', '17', '18', '12', 'First Year', 'Alvarez', 'Mary Anne ', 'S', NULL, 'Anne', '165', '45', '123445764', NULL, 1, NULL, NULL, NULL, '2006-09-04', 19, 'Manila, Philippines', 'Tagalog, English', 'FILIPINO', 'Aglipay', 'Single', 'Balangingi', '+639953242510', 'montano.ma.bsinfotech@gmail.com', '19 G Dona yayang Street Libis', 'Catioan', '4100', 'Region V (Bicol Region)', 'Camarines Norte', 'Capalonga', 'w232', 1, '19 G Dona yayang Street Libis', 'Catioan', '4100', 'Region V (Bicol Region)', 'Camarines Norte', 'Capalonga', 'w232', 1, 1, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Mama', ',mama', 'mam', 'I', 'Linda', 0, 'College Graduate', 'earist', 'bscs', '1992', '19 G Dona yayang Street Libis', '32443546', 'fasfas', 'XYZ Corp', '30000', 'montano.ma.bsinfotech@gmail.com', 'Mother', 'Montano', 'Mark Anthony', 'Placido', NULL, 'Benny', '19 G Dona yayang Street Libis', '09953242510', 'montano.ma.bsinfotech@gmail.com', '80,000 and below', 'High School/Junior High School', 'CGEAHS', 'Pasig City', 'STEM', 'With Honors', 95.00, 2016, 'Senior High School', 'CGEAHS', 'fsdg', 'BSIT', 'With high honor', 100.00, 2022, 'Information and Communications Technology (ICT)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2025-11-19', 1),
(345, NULL, '2025100236_1by1_2025.jpg', 1, 'Undergraduate', 'Freshman (First Year)', 'Senior High School Graduating Student', '14', '16', '19', 'First Year', 'Ciruela', 'Genny', 'Dedal', 'III', 'Gen', '150', '50', '136601120127', NULL, 1, NULL, NULL, NULL, '2003-11-21', 21, 'Manila, Philippines', 'Tagalog, English', 'COLOMBIAN', 'PMCC', 'Single', 'Agta', '09944869505', 'genny.ciruela@gmail.com', 'Yakal', 'Blue Ridge A', '1300', 'National Capital Region (NCR)', 'Metro Manila, Second District', 'Quezon City', 'n/A', 1, 'Yakal', 'Blue Ridge A', '1300', 'National Capital Region (NCR)', 'Metro Manila, Second District', 'Quezon City', 'n/A', 1, 1, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'StepFather', 'Ciruela', 'Grace', 'Dedal', 'II', 'Grasya', '19 G Dona yayang Street Libis', '09953242510', 'montano.ma.bsinfotech@gmail.com', '80,000 to 135,000', 'Vocational/Trade Course', 'Pasay East ', 'Libertad', 'STEM', 'Good', 99.90, 2022, 'Senior High School', 'Arellano', 'Gil puyat', 'TECHVOC', 'Good', 0.00, 2022, 'Information and Communications Technology (ICT)', NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'N/A', 'bIOGESIC ARAW ARAW', 0, '11111-11-11', 'Pfizer', '111111-11-11', 'Pfizer', '111111-11-11', 'Moderna', '111111-11-11', 'Pfizer', '111111-11-11', 'Normal', 'Normal', 'Normal', 'Normal', 0, 'gOODS', 1, '2025-11-12', 1),
(1391, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(1392, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(1393, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(1394, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(1395, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(1396, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(313, NULL, '2025100206_1by1_2025.png', 1, 'Undergraduate', 'Freshman (First Year)', 'Senior High School Graduate', '15', '14', '22', 'First Year', 'Mecasio', 'Arden', 'M.', '', 'gsdghs', '165', '54', '12345678', 0, 0, 0, '', '', '2025-01-01', 22, 'Manila', 'Tagalog', 'DOMINICAN', 'Free Methodist', 'Single', 'Dasen', '+639953242510', 'montano.ma.bsinfotech@gmail.com', '19 G Dona yayang Street Libis', 'Baay', '4100', 'Region I (Ilocos Region)', 'La Union', 'Bagulin', 'tr15', 0, '19 G Dona yayang Street Libis', 'Baay', '4100', 'Region I (Ilocos Region)', 'La Union', 'Bagulin', 'tr15', 0, 1, '', '', '', '', '', 0, '', '', '', '', '', '', '', '', '', '', 1, '', '', '', '', '', 0, '', '', '', '', '', '', '', '', '', '', 'Father', 'fsaf', 'fasf', 'fsdf', '', 'fsdfa', '19 G Dona yayang Street Libis', '09953242510', 'montano.ma.bsinfotech@gmail.com', '80,000 and below', 'Senior High School', 'fasf', 'fdh', 'fdhd', 'fsaf', 90.00, 2022, 'High School/Junior High School', 'fsaf', 'CGEAHS', 'Bsit', 'sgasg', 90.00, 2025, 'Information and Communications Technology (ICT)', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', 0, '', '', '', '', '', '', '', '', '', '', '', '', '', 0, '', 1, '2025-09-16', 1);

-- --------------------------------------------------------

--
-- Table structure for table `prof_table`
--

CREATE TABLE `prof_table` (
  `prof_id` int(11) NOT NULL,
  `person_id` int(11) DEFAULT NULL,
  `employee_id` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) NOT NULL,
  `fname` varchar(100) DEFAULT NULL,
  `mname` varchar(100) DEFAULT NULL,
  `lname` varchar(100) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 0 CHECK (`status` in (0,1)),
  `role` enum('applicant','faculty','registrar') NOT NULL DEFAULT 'faculty'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prof_table`
--

INSERT INTO `prof_table` (`prof_id`, `person_id`, `employee_id`, `profile_image`, `fname`, `mname`, `lname`, `email`, `password`, `status`, `role`) VALUES
(1, 1, NULL, '', 'Hazel', 'Fogata', 'Anuncio', 'hazel.anuncio@earist.edu.ph', 'ANUNCIO', 1, 'faculty'),
(2, 2, NULL, '', 'Eleazar', 'B.', 'Bernales', 'eleazar.bernales@earist.edu.ph', 'BERNALES', 0, 'faculty'),
(3, 3, NULL, '', 'Lester', 'Dela Cruz', 'Bernardino', 'lester.bernardino@earist.edu.ph', 'BERNARDINO', 0, 'faculty'),
(4, 4, NULL, '', 'Carlito', '', 'Biares', 'carlito.biares@earist.edu.ph', 'BIARES', 0, 'faculty'),
(5, 5, NULL, '', 'James Darryl', 'Dela Cruz', 'Bungay', 'james.bungay@earist.edu.ph', 'BUNGAY', 0, 'faculty'),
(6, 6, NULL, '', 'Renz Angelo', 'De Vera', 'Cadaoas', 'renz.cadaoas@earist.edu.ph', 'CADAOAS', 0, 'faculty'),
(7, 7, NULL, '', 'Nerissa', 'Bugarin', 'Capili', 'nerissa.capili@earist.edu.ph', 'CAPILI', 0, 'faculty'),
(8, 8, NULL, '', 'Romeo', 'B.', 'Capucao', 'romeo.capucao@earist.edu.ph', 'CAPUCAO', 0, 'faculty'),
(9, 9, NULL, '', 'Ernanie', 'Molina', 'Carlos', 'ernanie.carlos@earist.edu.ph', 'CARLOS', 0, 'faculty'),
(10, 10, NULL, '', 'Harold', 'Aspa', 'Casimira', 'harold.casimira@earist.edu.ph', 'CASIMIRA', 0, 'faculty'),
(11, 11, NULL, '', 'Rosel', 'Ortiz', 'Cipriano', 'rosel.cipriano@earist.edu.ph', 'CIPRIANO', 0, 'faculty'),
(12, 12, NULL, '', 'Janchloe', 'M', 'Duyan', 'janchloe.duyan@earist.edu.ph', 'DUYAN', 0, 'faculty'),
(13, 13, NULL, '', 'Arlene', 'Peña', 'Evangelista', 'arlene.evangelista@earist.edu.ph', 'EVANGELISTA', 0, 'faculty'),
(14, 14, NULL, '', 'Joevelyn', 'Waje', 'Fajardo', 'joevelyn.fajardo@earist.edu.ph', 'FAJARDO', 0, 'faculty'),
(15, 15, NULL, '', 'Dennis', 'Berboso', 'Gonzales', 'dennis.gonzales@earist.edu.ph', 'GONZALES', 0, 'faculty'),
(16, 16, NULL, '', 'Merlita', 'Cruz', 'Latip', 'merlita.latip@earist.edu.ph', 'LATIP', 0, 'faculty'),
(17, 17, NULL, '', 'Reeneir', 'Ramos', 'Ledesma', 'reeneir.ledesma@earist.edu.ph', 'LEDESMA', 0, 'faculty'),
(18, 18, NULL, '', 'Dennis', 'Dela Peña', 'Mangubat', 'dennis.mangubat@earist.edu.ph', 'MANGUBAT', 0, 'faculty'),
(19, 19, NULL, '', 'Sheila Marie', 'Mobo', 'Matias', 'sheila.matias@earist.edu.ph', 'MATIAS', 0, 'faculty'),
(20, 20, NULL, '', 'Joseph', 'Tarrayo', 'Moraca', 'joseph.moraca@earist.edu.ph', 'MORACA', 0, 'faculty'),
(21, 21, NULL, '', 'Ruth Lareza', 'Aguilar', 'Morales', 'ruth.morales@earist.edu.ph', 'MORALES', 0, 'faculty'),
(22, 22, NULL, '', 'Mark Kenneth', 'Barnobal', 'Nicart', 'mark.nicart@earist.edu.ph', 'NICART', 0, 'faculty'),
(23, 23, NULL, '', 'Rodora', 'Tanglao', 'Oliveros', 'rodora.oliveros@earist.edu.ph', 'OLIVEROS', 0, 'faculty'),
(24, 24, NULL, '', 'Abigail', 'J.', 'Purificacion', 'abigail.purificacion@earist.edu.ph', 'PURIFICACION', 0, 'faculty'),
(25, 25, NULL, '', 'Raynald', 'C', 'Redondo', 'raynald.redondo@earist.edu.ph', 'REDONDO', 0, 'faculty'),
(26, 26, NULL, '', 'Hiromi', '', 'Rivas', 'hiromi.rivas@earist.edu.ph', 'RIVAS', 0, 'faculty'),
(27, 27, NULL, '', 'Eula Luz Jasmine Dioneo', '', 'Sandoval', 'eula.sandoval@earist.edu.ph', 'SANDOVAL', 0, 'faculty'),
(28, 28, NULL, '', 'Al', 'Ferrer', 'Santiago', 'al.santiago@earist.edu.ph', 'SANTIAGO', 0, 'faculty'),
(29, 29, NULL, '', 'Larex', 'Bartolome', 'Tagalog', 'larex.tagalog@earist.edu.ph', 'TAGALOG', 0, 'faculty'),
(30, 30, NULL, '', 'Jayson', 'D.', 'Tolentino', 'jayson.tolentino@earist.edu.ph', 'TOLENTINO', 0, 'faculty'),
(31, 31, NULL, '', 'Edmund Sinagub', NULL, 'Almazan', 'edmund.almazan@earist.edu.ph', 'ALMAZAN', 0, 'faculty'),
(32, 32, NULL, '', 'Jesus', 'de los Santos', 'Paguigan', 'jesus.paguigan@earist.edu.ph', 'PAGUIGAN', 0, 'faculty'),
(33, 33, NULL, '', 'Kathleen', NULL, 'Dimaano', 'kathleen.dimaano@earist.edu.ph', 'DIMAANO', 0, 'faculty'),
(34, 34, NULL, '', 'Charlene', NULL, 'Ronda', 'charlene.ronda@earist.edu.ph', 'RONDA', 0, 'faculty'),
(35, 35, NULL, '', 'Maria Jasmine', NULL, 'Macasil', 'jasmine.macasil@earist.edu.ph', 'MACASIL', 0, 'faculty'),
(36, 36, NULL, '', 'Jefferson', NULL, 'Costales', 'jefferson.costales@earist.edu.ph', 'COSTALES', 0, 'faculty'),
(37, 37, NULL, '', 'Arjo', NULL, 'Ladia', 'arjo.ladia@earist.edu.ph', 'LADIA', 0, 'faculty'),
(38, 38, NULL, '23838_profile_image_2025.webp', 'Mark Anthony', 'Placido', 'Montano', 'markmontano999@gmail.com', '$2b$10$1z0TPyKFo6qtCrVAaA1D4e3qANATLI.pyTLqZinmmT8sF2zMALkDu', 1, 'faculty'),
(63, 98, NULL, '98_ProfessorProfile_2025.png', 'Dhani', 'San', 'Jose', 'disanjose@earist.edu.ph', '$2b$10$/XhdvzV/4rugRbZH5gWafenpXBkbuJT2pjsopS85Mj27vDI2ZjFxm', 1, 'faculty'),
(69, 39, NULL, '39_ProfessorProfile_2025.jpg', 'Jona', 'Descuatan', 'Arcaño', 'jonalane@gmail.com', '$2b$10$XvcQqYNh52ENCzxAtCTI1e6QsCexyw7VsT0ine2LNlGPLp/xTH1oS', 1, 'faculty');

-- --------------------------------------------------------

--
-- Table structure for table `program_table`
--

CREATE TABLE `program_table` (
  `program_id` int(11) NOT NULL,
  `program_description` varchar(255) DEFAULT NULL,
  `program_code` varchar(100) DEFAULT NULL,
  `major` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_table`
--

INSERT INTO `program_table` (`program_id`, `program_description`, `program_code`, `major`) VALUES
(1, 'Bachelor of Science in Architecture', 'BS ARCHI', NULL),
(2, 'Bachelor of Science in Interior Design', 'BSID', NULL),
(3, 'Bachelor in Fine Arts', 'BFA-PAINT', 'Major in Paintings'),
(4, 'Bachelor in Fine Arts ', 'BFA-VISCOM', 'Major in Visual Communication'),
(5, 'Bachelor of Science in Applied Physics with Computer Science Emphasis', 'BSAP', NULL),
(6, 'Bachelor of Science in Psychology', 'BSPSYCH', NULL),
(7, 'Bachelor of Science in Mathematics', 'BSMATH', NULL),
(8, 'Bachelor of Science in Business Administration ', 'BSBA-MM', 'Major in Marketing Management'),
(9, 'Bachelor of Science in Business Administration', 'BSBA-HRDM', 'Major in HR Development Management'),
(10, 'Bachelor of Science in Entrepreneurship', 'BSEM', NULL),
(11, 'Bachelor of Science in Office Administration', 'BSOA', NULL),
(12, 'Bachelor of Science in Criminology', 'BSCRIM', NULL),
(13, 'Bachelor in Public Administration', 'BPA', NULL),
(14, 'Bachelor of Science in Computer Science', 'BSCS', NULL),
(15, 'Bachelor of Science in Information Technology', 'BSINFOTECH', NULL),
(16, 'Bachelor in Secondary Education ', 'BSE-SCI', 'Major in Science'),
(17, 'Bachelor in Secondary Education', 'BSE-MATH', 'Major in Mathematics'),
(18, 'Bachelor in Secondary Education', 'BSE-FIL', 'Major in Filipino'),
(19, 'Bachelor in Special Needs Education', 'BSNED', NULL),
(20, 'Bachelor in Technology and Livelihood Education', 'BTLE-HE', 'Major in Home Economics'),
(21, 'Bachelor in Technology and Livelihood Education ', 'BTLE-IA', 'Major in Industrial Arts'),
(22, 'Professional Education Subjects (TCP)', 'TCP', NULL),
(24, 'Bachelor of Science in Chemical Engineering', 'BSCHE', NULL),
(25, 'Bachelor of Science in Civil Engineering', 'BSCE', NULL),
(26, 'Bachelor of Science in Electrical Engineering', 'BSEE', NULL),
(27, 'Bachelor of Science in Electronics and Communication Engineering', 'BSECE', NULL),
(28, 'Bachelor of Science in Mechanical Engineering', 'BSME', NULL),
(29, 'Bachelor of Science in Computer Engineering', 'BSCOE', NULL),
(30, 'Bachelor of Science in Tourism Management', 'BST', NULL),
(31, 'Bachelor of Science in Hospitality Management', 'BSHM', NULL),
(32, 'Bachelor of Science in Industrial Technology', 'BSIT-AUTO', 'Major in Automotive Technology'),
(33, 'Bachelor of Science in Industrial Technology ', 'BSIT-ELEC', 'Major in Electrical Technology'),
(34, 'Bachelor of Science in Industrial Technology ', 'BSIT-ET', 'Major in Electronics Technology'),
(35, 'Bachelor of Science in Industrial Technology', 'BSIT-FOOD', 'Major in Food Technology'),
(36, 'Bachelor of Science in Industrial Technology ', 'BSIT-FASHION', 'Major in Fashion and Apparel Technology'),
(37, 'Bachelor of Science in Industrial Technology ', 'BSIT-CHEM', 'Major in Industrial Chemistry'),
(38, 'Bachelor of Science in Industrial Technology ', 'BSIT-DRAFT', 'Major in Drafting Technology'),
(39, 'Bachelor of Science in Industrial Technology ', 'BSIT-MECH', 'Major in Machine Shop Technology'),
(40, 'Bachelor of Science in Industrial Technology ', 'BSIT-RAC', 'Major in Refrigeration and Air Conditioning'),
(41, 'Doctor of Philosophy ', 'DPIP', 'Major in Industrial Psychology'),
(42, 'Doctor of Education ', 'DEEM', 'Major in Educational Management'),
(43, 'Doctor in Business Administration', 'DBA', NULL),
(44, 'Doctor in Public Administration', 'DPA', NULL),
(45, 'Master of Science in Mathematics', 'MSA', NULL),
(46, 'Master of Arts in Industrial Psychology', 'MAIP', NULL),
(47, 'Master in Business Administration', 'MBA', NULL),
(48, 'Master in Public Administration', 'MPA', NULL),
(49, 'Master of Arts in Industrial Education ', 'MAIEHM', 'Major in Hotel Management'),
(50, 'Master of Arts in Education', 'MAEAS', 'Major in Administration and Supervision'),
(51, 'Master of Arts in Education', 'MAEGC', 'Major in Guidance and Counseling'),
(52, 'Master of Arts in Education', 'MAESE', 'Major in Special Education'),
(53, 'Master of Arts in Teaching', 'MATET', 'Major in Electronics Technology'),
(54, 'Master of Arts in Teaching', 'MATM', 'Major in Mathematics'),
(55, 'Master of Arts in Teaching', 'MATS', 'Major in Science');

-- --------------------------------------------------------

--
-- Table structure for table `program_tagging_table`
--

CREATE TABLE `program_tagging_table` (
  `program_tagging_id` int(11) NOT NULL,
  `curriculum_id` int(11) DEFAULT NULL,
  `year_level_id` int(11) DEFAULT NULL,
  `semester_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `program_tagging_table`
--

INSERT INTO `program_tagging_table` (`program_tagging_id`, `curriculum_id`, `year_level_id`, `semester_id`, `course_id`) VALUES
(1, 1, 2, 1, 1),
(2, 1, 1, 2, 2),
(3, 1, 1, 1, 3),
(4, 1, 1, 1, 4),
(5, 1, 1, 1, 5),
(6, 1, 1, 1, 6),
(7, 1, 1, 1, 7),
(8, 1, 1, 1, 8),
(9, 1, 1, 1, 9),
(10, 1, 1, 1, 10),
(11, 1, 1, 1, 11),
(12, 1, 1, 2, 12),
(13, 1, 1, 2, 13),
(14, 1, 1, 2, 14),
(15, 1, 1, 2, 15),
(16, 1, 1, 2, 16),
(17, 1, 1, 2, 17),
(18, 1, 1, 2, 18),
(19, 1, 1, 2, 19),
(20, 1, 1, 2, 20),
(21, 1, 1, 2, 21),
(22, 1, 1, 2, 22),
(23, 1, 2, 1, 23),
(24, 1, 2, 1, 24),
(25, 1, 2, 1, 25),
(26, 1, 2, 1, 26),
(27, 1, 2, 1, 27),
(28, 1, 2, 1, 28),
(29, 1, 2, 1, 29),
(30, 1, 2, 1, 30),
(31, 1, 2, 1, 31),
(32, 1, 2, 1, 32),
(33, 1, 2, 1, 33),
(34, 1, 2, 2, 34),
(35, 1, 2, 2, 35),
(36, 1, 2, 2, 36),
(37, 1, 2, 2, 37),
(38, 1, 2, 2, 38),
(39, 1, 2, 2, 39),
(40, 1, 2, 2, 40),
(41, 1, 2, 2, 41),
(42, 1, 2, 2, 42),
(43, 1, 2, 2, 43),
(44, 1, 2, 2, 44),
(45, 1, 2, 2, 45),
(46, 1, 3, 1, 46),
(47, 1, 3, 1, 47),
(48, 1, 3, 1, 48),
(49, 1, 3, 1, 49),
(50, 1, 3, 1, 50),
(51, 1, 3, 1, 51),
(52, 1, 3, 1, 52),
(53, 1, 3, 1, 53),
(54, 1, 3, 1, 54),
(55, 1, 3, 1, 55),
(56, 1, 3, 1, 56),
(57, 1, 3, 2, 57),
(58, 1, 3, 2, 58),
(59, 1, 3, 2, 59),
(60, 1, 3, 2, 60),
(61, 1, 3, 2, 61),
(62, 1, 3, 2, 62),
(63, 1, 3, 2, 63),
(64, 1, 3, 2, 64),
(65, 1, 3, 2, 65),
(66, 1, 3, 2, 66),
(67, 1, 4, 1, 67),
(68, 1, 4, 1, 68),
(69, 1, 4, 1, 69),
(70, 1, 4, 1, 70),
(71, 1, 4, 1, 71),
(72, 1, 4, 1, 72),
(73, 1, 4, 1, 73),
(74, 1, 4, 1, 74),
(75, 1, 4, 1, 75),
(76, 1, 4, 1, 76),
(77, 1, 4, 2, 77),
(78, 2, 3, 2, 71),
(81, 58, 1, 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `question_table`
--

CREATE TABLE `question_table` (
  `id` int(11) NOT NULL,
  `question_description` varchar(255) NOT NULL,
  `first_choice` varchar(255) NOT NULL,
  `second_choice` varchar(255) NOT NULL,
  `third_choice` varchar(255) NOT NULL,
  `fourth_choice` varchar(255) NOT NULL,
  `fifth_choice` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `question_table`
--

INSERT INTO `question_table` (`id`, `question_description`, `first_choice`, `second_choice`, `third_choice`, `fourth_choice`, `fifth_choice`) VALUES
(7, 'Is prof good?', '1', '2', '3', '4', '5'),
(8, 'Is prof alright?', '1', '2', '3', '4', '5'),
(9, 'Is prof nice?', '1', '2', '3', '4', '5'),
(10, 'The instructor uses examples or demonstrations that help me learn.', '1', '2', '3', '4', '5'),
(11, 'The instructor explains concepts clearly and in an understandable manne', '1', '2', '3', '4', '5'),
(12, 'The instructor is knowledgeable about the course content.', '1', '2', '3', '4', '5'),
(13, 'The instructor provides feedback that helps me improve.', '1', '2', '3', '4', '5'),
(14, 'The instructor encourages students to ask questions and participate.', '1', '2', '3', '4', '5');

-- --------------------------------------------------------

--
-- Table structure for table `requirements_table`
--

CREATE TABLE `requirements_table` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `short_label` varchar(255) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `category` varchar(50) DEFAULT 'Regular',
  `is_verifiable` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requirements_table`
--

INSERT INTO `requirements_table` (`id`, `description`, `short_label`, `label`, `category`, `is_verifiable`) VALUES
(1, 'PSA Birth Certificate', 'PSA', NULL, 'Regular', 1),
(2, 'Form 138 (4th Quarter / No failing Grades)', 'F138', NULL, 'Regular', 1),
(3, 'Certificate of Good Moral Character', 'CGMC', NULL, 'Regular', 1),
(4, 'Certificate belonging to Graduating Class', 'CBGC', NULL, 'Regular', 1),
(5, 'Copy of Vaccine Card (1st and 2nd Dose)', 'CVC', NULL, 'Medical', 1),
(32, 'THESIS PURPOSES', 'TP', NULL, 'Regular', 1),
(35, 'INFORMATION TECHNOLOGY', 'TH', NULL, 'Others', 1);

-- --------------------------------------------------------

--
-- Table structure for table `requirement_uploads`
--

CREATE TABLE `requirement_uploads` (
  `upload_id` int(11) NOT NULL,
  `requirements_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `submitted_documents` int(11) DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `original_name` varchar(100) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `document_status` varchar(255) DEFAULT NULL,
  `missing_documents` varchar(255) DEFAULT NULL,
  `registrar_status` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `last_updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `requirement_uploads`
--

INSERT INTO `requirement_uploads` (`upload_id`, `requirements_id`, `person_id`, `submitted_documents`, `file_path`, `original_name`, `remarks`, `status`, `document_status`, `missing_documents`, `registrar_status`, `created_at`, `last_updated_by`) VALUES
(178, 1, 1, NULL, '2025100214_BirthCertificate_2025.pdf', 'personaldataformprint.pdf', '75% OF ATTENDANCE IS NEEDED FOR TRANSFEREE', 1, 'Documents Verified & ECAT', NULL, NULL, '2025-10-01 16:05:17', NULL),
(179, 2, 1, NULL, '2025100214_Form138_2025.pdf', 'examinationpermit.pdf', 'GWA did not meet the Requirements', 1, 'Documents Verified & ECAT', NULL, NULL, '2025-10-01 16:05:20', NULL),
(180, 3, 1, NULL, '2025100214_GoodMoralCharacter_2025.pdf', 'officeoftheregistrar.pdf', 'FORM 138 IS NOT COMPLETE', 1, 'Documents Verified & ECAT', NULL, NULL, '2025-10-01 16:05:23', NULL),
(181, 4, 1, NULL, '2025100214_CertificateOfGraduatingClass_2025.pdf', 'IAAS2_Midterm Activity No 2.pdf', 'Have failed and incomplete grades', 1, 'Documents Verified & ECAT', NULL, NULL, '2025-10-01 16:05:28', NULL),
(182, 5, 1, NULL, '2025100214_VaccineCard_2025.pdf', 'examinationpermit.pdf', NULL, 1, 'Disapproved', NULL, NULL, '2025-10-01 16:05:32', NULL),
(183, 1, 341, NULL, '2025100232_PSA_2025.png', 'admin.png', NULL, 1, 'Documents Verified & ECAT', NULL, NULL, '2025-11-10 18:24:11', NULL),
(184, 2, 341, NULL, '2025100232_F138_2025.jpg', 'solo.jpg', NULL, 1, 'Documents Verified & ECAT', NULL, NULL, '2025-11-10 18:24:15', NULL),
(185, 3, 341, NULL, '2025100232_CGMC_2025.jpg', 'thumbmark.jpg', NULL, 1, 'Documents Verified & ECAT', NULL, NULL, '2025-11-10 18:24:20', NULL),
(186, 4, 341, NULL, '2025100232_CBGC_2025.jpg', 'sung jin woo.jpg', NULL, 1, 'Documents Verified & ECAT', NULL, NULL, '2025-11-10 18:24:23', NULL),
(187, 5, 341, NULL, '2025100232_CVC_2025.png', 'admin.png', NULL, 1, 'Documents Verified & ECAT', NULL, NULL, '2025-11-10 18:24:27', NULL),
(188, 1, 343, NULL, '2025100234_PSA_2025.jpg', 'earist manila.jpg', NULL, 1, 'Documents Verified & ECAT', NULL, NULL, '2025-11-12 15:00:37', NULL),
(189, 2, 343, NULL, '2025100234_F138_2025.jpg', 'earist manila.jpg', NULL, 1, 'Documents Verified & ECAT', NULL, NULL, '2025-11-12 15:00:47', NULL),
(190, 3, 343, NULL, '2025100234_CGMC_2025.jpg', 'earist manila.jpg', NULL, 1, 'Documents Verified & ECAT', NULL, NULL, '2025-11-12 15:01:00', NULL),
(191, 4, 343, NULL, '2025100234_CBGC_2025.jpg', 'earist manila.jpg', NULL, 1, 'Documents Verified & ECAT', NULL, NULL, '2025-11-12 15:01:07', NULL),
(192, 5, 343, NULL, '2025100234_CVC_2025.jpg', 'earist manila.jpg', NULL, 2, 'Documents Verified & ECAT', NULL, NULL, '2025-11-12 15:01:11', NULL),
(193, 2, 352, NULL, '2025100243_F138_2025.jpg', 'solo.jpg', NULL, 0, NULL, NULL, NULL, '2025-11-19 14:27:51', NULL),
(194, 3, 352, NULL, '2025100243_CGMC_2025.jpg', 'solo.jpg', NULL, 0, NULL, NULL, NULL, '2025-11-19 14:27:55', NULL),
(195, 4, 352, NULL, '2025100243_CBGC_2025.jpg', 'solo.jpg', NULL, 0, NULL, NULL, NULL, '2025-11-19 14:27:59', NULL),
(196, 5, 352, NULL, '2025100243_CVC_2025.jpg', 'solo.jpg', NULL, 0, NULL, NULL, NULL, '2025-11-19 14:28:08', NULL),
(197, 1, 352, NULL, '2025100243_PSA_2025.jpg', 'solo.jpg', NULL, 0, NULL, NULL, NULL, '2025-11-19 14:28:29', NULL),
(198, 1, 347, NULL, '2025100238_PSA_2025.jpg', 'solo.jpg', NULL, 0, NULL, NULL, NULL, '2025-11-19 13:54:44', NULL),
(199, 2, 347, NULL, '2025100238_F138_2025.pdf', 'Print.pdf', NULL, 0, NULL, NULL, NULL, '2025-11-19 13:54:51', NULL),
(200, 3, 347, NULL, '2025100238_CGMC_2025.jpg', 'Announcement.jpg', NULL, 0, NULL, NULL, NULL, '2025-11-19 13:55:17', NULL),
(201, 4, 347, NULL, '2025100238_CBGC_2025.png', 'admin.png', NULL, 0, NULL, NULL, NULL, '2025-11-19 13:55:22', NULL),
(202, 5, 347, NULL, '2025100238_CVC_2025.jpg', 'e7fcc5625a0585cf77c65abf2b1a6766.jpg', NULL, 0, NULL, NULL, NULL, '2025-11-19 13:55:27', NULL),
(203, 3, 345, NULL, '2025100236_CGMC_2025.jpg', 'e7fcc5625a0585cf77c65abf2b1a6766.jpg', NULL, 1, 'Documents Verified & ECAT', NULL, NULL, '2025-11-12 17:35:23', NULL),
(204, 4, 345, NULL, '2025100236_CBGC_2025.jpg', 'solo.jpg', NULL, 1, 'Documents Verified & ECAT', NULL, NULL, '2025-11-12 17:35:26', NULL),
(205, 5, 345, NULL, '2025100236_CVC_2025.jpg', 'solo.jpg', NULL, 1, 'Documents Verified & ECAT', NULL, NULL, '2025-11-12 17:35:30', NULL),
(206, 1, 345, NULL, '2025100236_PSA_2025.jpg', 'earist manila.jpg', NULL, 1, NULL, NULL, NULL, '2025-11-12 18:04:12', NULL),
(207, 2, 345, NULL, '2025100236_F138_2025.pdf', 'Print.pdf', NULL, 1, NULL, NULL, NULL, '2025-11-12 18:04:16', NULL),
(208, 1, 313, 0, '2025100206_BirthCertificate_2025.png', 'dhani PDS ID.png', '0', 1, NULL, NULL, 0, '2025-09-16 15:20:25', NULL),
(209, 2, 313, 0, '2025100206_Form138_2025.jpg', 'DHANI I. SAN JOSE (1)_page-0001.jpg', '0', 1, NULL, NULL, 0, '2025-09-16 15:20:30', NULL),
(210, 3, 313, 0, '2025100206_GoodMoralCharacter_2025.png', '1752055171951_3dy7qp_b0ba1e6dfe7a4703a2d1401b97f1390a_1_1752055169_9995_watermarked.png', '0', 1, NULL, NULL, 0, '2025-09-16 15:20:33', NULL),
(211, 4, 313, 0, '2025100206_CertificateOfGraduatingClass_2025.jpg', 'maxresdefault.jpg', '0', 1, NULL, NULL, 0, '2025-09-16 15:20:38', NULL),
(212, 5, 313, 0, '2025100206_VaccineCard_2025.png', 'hero.png', '0', NULL, NULL, NULL, 0, '2025-09-16 15:20:42', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `room_day_table`
--

CREATE TABLE `room_day_table` (
  `id` int(11) NOT NULL,
  `description` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_day_table`
--

INSERT INTO `room_day_table` (`id`, `description`) VALUES
(1, 'SUN'),
(2, 'MON'),
(3, 'TUE'),
(4, 'WED'),
(5, 'THU'),
(6, 'FRI'),
(7, 'SAT');

-- --------------------------------------------------------

--
-- Table structure for table `room_table`
--

CREATE TABLE `room_table` (
  `room_id` int(11) NOT NULL,
  `room_description` varchar(255) DEFAULT NULL,
  `building_description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `room_table`
--

INSERT INTO `room_table` (`room_id`, `room_description`, `building_description`) VALUES
(1, 'CCS Room 201', NULL),
(2, 'CCS Room 202', NULL),
(3, 'CCS Room 301', NULL),
(4, 'CCS Room 302', NULL),
(5, 'CCS Room 303', NULL),
(11, 'CSS Room 203', NULL),
(12, 'CAS Room 204', NULL),
(13, 'CAS Room 401', NULL),
(14, 'CAS Room 402', NULL),
(15, 'CAS Room 403', NULL),
(16, 'CAS Room 404', NULL),
(17, 'CAS Room 405', NULL),
(18, 'CAS Room 406', NULL),
(19, 'CAS Room 409', NULL),
(20, 'CAS Room 411', NULL),
(21, 'CAFA', 'NUDAS HALL'),
(22, 'MIS', NULL),
(23, 'MIS101', NULL),
(24, '123 Mabini St.', 'Pureza'),
(25, 'CCS Room 202', 'NUDAS HALL'),
(26, 'Cas Room 203', 'NUDAS HALL Building'),
(27, 'CSS 202', 'MIS Building'),
(28, 'CCS 203', 'MIS Building'),
(29, 'Rm 4', 'nudas hall');

-- --------------------------------------------------------

--
-- Table structure for table `school_time_table`
--

CREATE TABLE `school_time_table` (
  `id` int(11) NOT NULL,
  `description` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `school_time_table`
--

INSERT INTO `school_time_table` (`id`, `description`) VALUES
(1, '07:00 AM'),
(2, '07:30 AM'),
(3, '08:00 AM'),
(4, '08:30 AM'),
(5, '09:00 AM'),
(6, '09:30 AM'),
(7, '10:00 AM'),
(8, '10:30 AM'),
(9, '11:00 AM'),
(10, '11:30 AM'),
(11, '12:00 PM'),
(12, '12:30 PM'),
(13, '01:00 PM'),
(14, '01:30 PM'),
(15, '02:00 PM'),
(16, '02:30 PM'),
(17, '03:00 PM'),
(18, '03:30 PM'),
(19, '04:00 PM'),
(20, '04:30 PM'),
(21, '05:00 PM'),
(22, '05:30 PM'),
(23, '06:00 PM'),
(24, '06:30 PM'),
(25, '07:00 PM'),
(26, '07:30 PM'),
(27, '08:00 PM'),
(28, '08:30 PM'),
(29, '09:00 PM');

-- --------------------------------------------------------

--
-- Table structure for table `section_table`
--

CREATE TABLE `section_table` (
  `id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section_table`
--

INSERT INTO `section_table` (`id`, `description`) VALUES
(1, '1A'),
(2, '1B'),
(3, '1C'),
(4, '2A'),
(5, '2B'),
(6, '2C'),
(7, '3A'),
(8, '3B'),
(9, '3C'),
(10, '4A'),
(11, '4B'),
(12, '4C');

-- --------------------------------------------------------

--
-- Table structure for table `semester_table`
--

CREATE TABLE `semester_table` (
  `semester_id` int(11) NOT NULL,
  `semester_description` varchar(255) DEFAULT NULL,
  `semester_code` varchar(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `semester_table`
--

INSERT INTO `semester_table` (`semester_id`, `semester_description`, `semester_code`) VALUES
(1, 'First Semester', '1'),
(2, 'Second Semester', '2'),
(3, 'Summer', '3');

-- --------------------------------------------------------

--
-- Table structure for table `student_counter`
--

CREATE TABLE `student_counter` (
  `id` int(11) NOT NULL,
  `que_number` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_counter`
--

INSERT INTO `student_counter` (`id`, `que_number`) VALUES
(1, 0),
(2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `student_curriculum_table`
--

CREATE TABLE `student_curriculum_table` (
  `id` int(11) NOT NULL,
  `student_numbering_id` int(11) DEFAULT NULL,
  `curriculum_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_curriculum_table`
--

INSERT INTO `student_curriculum_table` (`id`, `student_numbering_id`, `curriculum_id`) VALUES
(1, 123, 14),
(2, 1, 25),
(3, 124, 1),
(4, 124, 1),
(5, 124, 1),
(6, 124, 1),
(7, 124, 1),
(8, 124, 1),
(9, 125, 25),
(10, 126, 14),
(11, 127, 14),
(12, 128, 1),
(13, 128, 1),
(14, 128, 1),
(15, 128, 1),
(16, 128, 1),
(17, 128, 1),
(18, 1, 1),
(19, 1, 1),
(20, 1, 1),
(21, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `student_evaluation_table`
--

CREATE TABLE `student_evaluation_table` (
  `id` int(11) NOT NULL,
  `student_number` varchar(255) NOT NULL,
  `school_year_id` int(11) NOT NULL DEFAULT 0,
  `prof_id` int(11) DEFAULT NULL,
  `course_id` int(11) NOT NULL DEFAULT 0,
  `question_id` int(11) NOT NULL DEFAULT 0,
  `question_answer` int(11) NOT NULL DEFAULT 0,
  `answered_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_evaluation_table`
--

INSERT INTO `student_evaluation_table` (`id`, `student_number`, `school_year_id`, `prof_id`, `course_id`, `question_id`, `question_answer`, `answered_at`) VALUES
(37, '202500001', 3, 38, 3, 10, 1, '2025-11-14 06:04:14'),
(38, '202500001', 3, 38, 3, 11, 1, '2025-11-14 06:04:14'),
(39, '202500001', 3, 38, 3, 12, 1, '2025-11-14 06:04:14'),
(40, '202500001', 3, 38, 3, 13, 1, '2025-11-14 06:04:15'),
(41, '202500001', 3, 38, 3, 14, 1, '2025-11-14 06:04:15'),
(42, '202500001', 3, 63, 4, 10, 1, '2025-11-14 06:16:49'),
(43, '202500001', 3, 63, 4, 11, 1, '2025-11-14 06:16:49'),
(44, '202500001', 3, 63, 4, 12, 1, '2025-11-14 06:16:49'),
(45, '202500001', 3, 63, 4, 13, 1, '2025-11-14 06:16:49'),
(46, '202500001', 3, 63, 4, 14, 1, '2025-11-14 06:16:49'),
(47, '202500001', 3, 38, 10, 10, 1, '2025-11-14 06:17:11'),
(48, '202500001', 3, 38, 10, 11, 1, '2025-11-14 06:17:11'),
(49, '202500001', 3, 38, 10, 12, 1, '2025-11-14 06:17:11'),
(50, '202500001', 3, 38, 10, 13, 1, '2025-11-14 06:17:11'),
(51, '202500001', 3, 38, 10, 14, 1, '2025-11-14 06:17:11'),
(52, '202500001', 3, 38, 5, 10, 1, '2025-11-14 06:17:27'),
(53, '202500001', 3, 38, 5, 11, 1, '2025-11-14 06:17:27'),
(54, '202500001', 3, 38, 5, 12, 1, '2025-11-14 06:17:27'),
(55, '202500001', 3, 38, 5, 13, 1, '2025-11-14 06:17:27'),
(56, '202500001', 3, 38, 5, 14, 1, '2025-11-14 06:17:27'),
(57, '202500001', 3, 38, 6, 10, 5, '2025-11-14 06:17:39'),
(58, '202500001', 3, 38, 6, 11, 5, '2025-11-14 06:17:39'),
(59, '202500001', 3, 38, 6, 12, 5, '2025-11-14 06:17:39'),
(60, '202500001', 3, 38, 6, 13, 5, '2025-11-14 06:17:39'),
(61, '202500001', 3, 38, 6, 14, 5, '2025-11-14 06:17:39'),
(62, '202500001', 3, 38, 7, 10, 5, '2025-11-14 06:17:49'),
(63, '202500001', 3, 38, 7, 11, 5, '2025-11-14 06:17:49'),
(64, '202500001', 3, 38, 7, 12, 5, '2025-11-14 06:17:49'),
(65, '202500001', 3, 38, 7, 13, 5, '2025-11-14 06:17:49'),
(66, '202500001', 3, 38, 7, 14, 5, '2025-11-14 06:17:49'),
(67, '202500001', 3, 38, 8, 10, 5, '2025-11-14 06:18:00'),
(68, '202500001', 3, 38, 8, 11, 5, '2025-11-14 06:18:00'),
(69, '202500001', 3, 38, 8, 12, 5, '2025-11-14 06:18:00'),
(70, '202500001', 3, 38, 8, 13, 5, '2025-11-14 06:18:00'),
(71, '202500001', 3, 38, 8, 14, 5, '2025-11-14 06:18:00'),
(72, '202500001', 3, 38, 9, 10, 5, '2025-11-14 06:18:11'),
(73, '202500001', 3, 38, 9, 11, 5, '2025-11-14 06:18:11'),
(74, '202500001', 3, 38, 9, 12, 5, '2025-11-14 06:18:11'),
(75, '202500001', 3, 38, 9, 13, 5, '2025-11-14 06:18:11'),
(76, '202500001', 3, 38, 9, 14, 5, '2025-11-14 06:18:11'),
(77, '202500001', 3, 38, 11, 10, 5, '2025-11-14 06:18:23'),
(78, '202500001', 3, 38, 11, 11, 5, '2025-11-14 06:18:24'),
(79, '202500001', 3, 38, 11, 12, 5, '2025-11-14 06:18:24'),
(80, '202500001', 3, 38, 11, 13, 5, '2025-11-14 06:18:24'),
(81, '202500001', 3, 38, 11, 14, 5, '2025-11-14 06:18:24'),
(82, '202500001', 3, 38, 11, 10, 5, '2025-11-14 06:18:35'),
(83, '202500001', 3, 38, 11, 11, 5, '2025-11-14 06:18:35'),
(84, '202500001', 3, 38, 11, 12, 5, '2025-11-14 06:18:35'),
(85, '202500001', 3, 38, 11, 13, 5, '2025-11-14 06:18:35'),
(86, '202500001', 3, 38, 11, 14, 5, '2025-11-14 06:18:35'),
(87, '202500001', 3, 63, 4, 10, 5, '2025-11-14 06:38:38'),
(88, '202500001', 3, 63, 4, 11, 5, '2025-11-14 06:38:38'),
(89, '202500001', 3, 63, 4, 12, 5, '2025-11-14 06:38:38'),
(90, '202500001', 3, 63, 4, 13, 5, '2025-11-14 06:38:38'),
(91, '202500001', 3, 63, 4, 14, 5, '2025-11-14 06:38:38'),
(92, '202500001', 3, 38, 3, 10, 5, '2025-11-14 06:39:07'),
(93, '202500001', 3, 38, 3, 11, 5, '2025-11-14 06:39:07'),
(94, '202500001', 3, 38, 3, 12, 5, '2025-11-14 06:39:07'),
(95, '202500001', 3, 38, 3, 13, 5, '2025-11-14 06:39:07'),
(96, '202500001', 3, 38, 3, 14, 5, '2025-11-14 06:39:07'),
(97, '202500001', 3, 63, 4, 10, 5, '2025-11-14 06:52:03'),
(98, '202500001', 3, 63, 4, 11, 5, '2025-11-14 06:52:03'),
(99, '202500001', 3, 63, 4, 12, 5, '2025-11-14 06:52:03'),
(100, '202500001', 3, 63, 4, 13, 5, '2025-11-14 06:52:03'),
(101, '202500001', 3, 63, 4, 14, 5, '2025-11-14 06:52:03'),
(102, '202500001', 3, 38, 10, 10, 5, '2025-11-14 06:52:35'),
(103, '202500001', 3, 38, 10, 11, 5, '2025-11-14 06:52:35'),
(104, '202500001', 3, 38, 10, 12, 5, '2025-11-14 06:52:35'),
(105, '202500001', 3, 38, 10, 13, 5, '2025-11-14 06:52:35'),
(106, '202500001', 3, 38, 10, 14, 5, '2025-11-14 06:52:35'),
(107, '202500001', 3, 38, 3, 10, 5, '2025-11-14 06:52:44'),
(108, '202500001', 3, 38, 3, 11, 5, '2025-11-14 06:52:44'),
(109, '202500001', 3, 38, 3, 12, 5, '2025-11-14 06:52:44'),
(110, '202500001', 3, 38, 3, 13, 5, '2025-11-14 06:52:44'),
(111, '202500001', 3, 38, 3, 14, 5, '2025-11-14 06:52:44'),
(112, '202500001', 3, 38, 5, 10, 5, '2025-11-14 06:52:52'),
(113, '202500001', 3, 38, 5, 11, 5, '2025-11-14 06:52:52'),
(114, '202500001', 3, 38, 5, 12, 5, '2025-11-14 06:52:52'),
(115, '202500001', 3, 38, 5, 13, 5, '2025-11-14 06:52:52'),
(116, '202500001', 3, 38, 5, 14, 5, '2025-11-14 06:52:52'),
(117, '202500001', 3, 38, 6, 10, 5, '2025-11-14 06:53:01'),
(118, '202500001', 3, 38, 6, 11, 5, '2025-11-14 06:53:01'),
(119, '202500001', 3, 38, 6, 12, 5, '2025-11-14 06:53:01'),
(120, '202500001', 3, 38, 6, 13, 5, '2025-11-14 06:53:01'),
(121, '202500001', 3, 38, 6, 14, 5, '2025-11-14 06:53:01'),
(122, '202500001', 3, 38, 7, 10, 5, '2025-11-14 06:53:11'),
(123, '202500001', 3, 38, 7, 11, 5, '2025-11-14 06:53:11'),
(124, '202500001', 3, 38, 7, 12, 5, '2025-11-14 06:53:11'),
(125, '202500001', 3, 38, 7, 13, 5, '2025-11-14 06:53:11'),
(126, '202500001', 3, 38, 7, 14, 5, '2025-11-14 06:53:12'),
(127, '202500001', 3, 38, 8, 10, 5, '2025-11-14 06:53:25'),
(128, '202500001', 3, 38, 8, 11, 5, '2025-11-14 06:53:25'),
(129, '202500001', 3, 38, 8, 12, 5, '2025-11-14 06:53:25'),
(130, '202500001', 3, 38, 8, 13, 5, '2025-11-14 06:53:25'),
(131, '202500001', 3, 38, 8, 14, 5, '2025-11-14 06:53:25'),
(132, '202500001', 3, 38, 9, 10, 5, '2025-11-14 06:53:34'),
(133, '202500001', 3, 38, 9, 11, 5, '2025-11-14 06:53:34'),
(134, '202500001', 3, 38, 9, 12, 5, '2025-11-14 06:53:34'),
(135, '202500001', 3, 38, 9, 13, 5, '2025-11-14 06:53:34'),
(136, '202500001', 3, 38, 9, 14, 5, '2025-11-14 06:53:34'),
(137, '202500001', 3, 38, 11, 10, 5, '2025-11-14 06:53:44'),
(138, '202500001', 3, 38, 11, 11, 5, '2025-11-14 06:53:44'),
(139, '202500001', 3, 38, 11, 12, 5, '2025-11-14 06:53:44'),
(140, '202500001', 3, 38, 11, 13, 5, '2025-11-14 06:53:44'),
(141, '202500001', 3, 38, 11, 14, 5, '2025-11-14 06:53:44'),
(142, '202500001', 3, 63, 4, 10, 5, '2025-11-14 07:25:22'),
(143, '202500001', 3, 63, 4, 11, 5, '2025-11-14 07:25:22'),
(144, '202500001', 3, 63, 4, 12, 5, '2025-11-14 07:25:22'),
(145, '202500001', 3, 63, 4, 13, 5, '2025-11-14 07:25:22'),
(146, '202500001', 3, 63, 4, 14, 5, '2025-11-14 07:25:22'),
(147, '202500001', 3, 38, 10, 10, 5, '2025-11-14 07:25:35'),
(148, '202500001', 3, 38, 10, 11, 5, '2025-11-14 07:25:35'),
(149, '202500001', 3, 38, 10, 12, 5, '2025-11-14 07:25:35'),
(150, '202500001', 3, 38, 10, 13, 5, '2025-11-14 07:25:35'),
(151, '202500001', 3, 38, 10, 14, 5, '2025-11-14 07:25:35'),
(152, '202500001', 3, 38, 3, 10, 5, '2025-11-14 07:25:52'),
(153, '202500001', 3, 38, 3, 11, 5, '2025-11-14 07:25:52'),
(154, '202500001', 3, 38, 3, 12, 5, '2025-11-14 07:25:52'),
(155, '202500001', 3, 38, 3, 13, 5, '2025-11-14 07:25:52'),
(156, '202500001', 3, 38, 3, 14, 5, '2025-11-14 07:25:52'),
(157, '202500001', 3, 38, 5, 10, 5, '2025-11-14 07:26:02'),
(158, '202500001', 3, 38, 5, 11, 5, '2025-11-14 07:26:03'),
(159, '202500001', 3, 38, 5, 12, 5, '2025-11-14 07:26:03'),
(160, '202500001', 3, 38, 5, 13, 5, '2025-11-14 07:26:03'),
(161, '202500001', 3, 38, 5, 14, 5, '2025-11-14 07:26:03'),
(162, '202500001', 3, 38, 6, 10, 5, '2025-11-14 07:26:14'),
(163, '202500001', 3, 38, 6, 11, 5, '2025-11-14 07:26:14'),
(164, '202500001', 3, 38, 6, 12, 5, '2025-11-14 07:26:14'),
(165, '202500001', 3, 38, 6, 13, 5, '2025-11-14 07:26:14'),
(166, '202500001', 3, 38, 6, 14, 5, '2025-11-14 07:26:14'),
(167, '202500001', 3, 38, 7, 10, 5, '2025-11-14 07:26:23'),
(168, '202500001', 3, 38, 7, 11, 5, '2025-11-14 07:26:23'),
(169, '202500001', 3, 38, 7, 12, 5, '2025-11-14 07:26:23'),
(170, '202500001', 3, 38, 7, 13, 5, '2025-11-14 07:26:23'),
(171, '202500001', 3, 38, 7, 14, 5, '2025-11-14 07:26:23'),
(172, '202500001', 3, 38, 8, 10, 5, '2025-11-14 07:26:33'),
(173, '202500001', 3, 38, 8, 11, 5, '2025-11-14 07:26:33'),
(174, '202500001', 3, 38, 8, 12, 5, '2025-11-14 07:26:33'),
(175, '202500001', 3, 38, 8, 13, 5, '2025-11-14 07:26:33'),
(176, '202500001', 3, 38, 8, 14, 5, '2025-11-14 07:26:33'),
(177, '202500001', 3, 38, 9, 10, 5, '2025-11-14 07:26:43'),
(178, '202500001', 3, 38, 9, 11, 5, '2025-11-14 07:26:43'),
(179, '202500001', 3, 38, 9, 12, 5, '2025-11-14 07:26:43'),
(180, '202500001', 3, 38, 9, 13, 5, '2025-11-14 07:26:43'),
(181, '202500001', 3, 38, 9, 14, 5, '2025-11-14 07:26:43'),
(182, '202500001', 3, 38, 11, 10, 5, '2025-11-14 07:26:53'),
(183, '202500001', 3, 38, 11, 11, 5, '2025-11-14 07:26:53'),
(184, '202500001', 3, 38, 11, 12, 5, '2025-11-14 07:26:53'),
(185, '202500001', 3, 38, 11, 13, 5, '2025-11-14 07:26:53'),
(186, '202500001', 3, 38, 11, 14, 5, '2025-11-14 07:26:53'),
(187, '202500001', 3, 38, 3, 10, 5, '2025-11-14 07:42:03'),
(188, '202500001', 3, 38, 3, 11, 5, '2025-11-14 07:42:03'),
(189, '202500001', 3, 38, 3, 12, 5, '2025-11-14 07:42:03'),
(190, '202500001', 3, 38, 3, 13, 5, '2025-11-14 07:42:03'),
(191, '202500001', 3, 38, 3, 14, 5, '2025-11-14 07:42:03'),
(192, '202500001', 3, 63, 4, 10, 5, '2025-11-14 09:29:10'),
(193, '202500001', 3, 63, 4, 11, 5, '2025-11-14 09:29:10'),
(194, '202500001', 3, 63, 4, 12, 5, '2025-11-14 09:29:10'),
(195, '202500001', 3, 63, 4, 13, 5, '2025-11-14 09:29:10'),
(196, '202500001', 3, 63, 4, 14, 5, '2025-11-14 09:29:10'),
(197, '202500001', 3, 38, 10, 10, 5, '2025-11-14 09:29:38'),
(198, '202500001', 3, 38, 10, 11, 5, '2025-11-14 09:29:38'),
(199, '202500001', 3, 38, 10, 12, 5, '2025-11-14 09:29:38'),
(200, '202500001', 3, 38, 10, 13, 5, '2025-11-14 09:29:38'),
(201, '202500001', 3, 38, 10, 14, 5, '2025-11-14 09:29:38'),
(202, '202500001', 3, 38, 3, 10, 5, '2025-11-14 09:30:17'),
(203, '202500001', 3, 38, 3, 11, 5, '2025-11-14 09:30:17'),
(204, '202500001', 3, 38, 3, 12, 5, '2025-11-14 09:30:17'),
(205, '202500001', 3, 38, 3, 13, 5, '2025-11-14 09:30:17'),
(206, '202500001', 3, 38, 3, 14, 5, '2025-11-14 09:30:17'),
(207, '202500001', 3, 38, 5, 10, 5, '2025-11-14 09:30:27'),
(208, '202500001', 3, 38, 5, 11, 5, '2025-11-14 09:30:27'),
(209, '202500001', 3, 38, 5, 12, 5, '2025-11-14 09:30:27'),
(210, '202500001', 3, 38, 5, 13, 5, '2025-11-14 09:30:27'),
(211, '202500001', 3, 38, 5, 14, 5, '2025-11-14 09:30:27'),
(212, '202500001', 3, 38, 6, 10, 5, '2025-11-14 09:30:37'),
(213, '202500001', 3, 38, 6, 11, 5, '2025-11-14 09:30:37'),
(214, '202500001', 3, 38, 6, 12, 5, '2025-11-14 09:30:37'),
(215, '202500001', 3, 38, 6, 13, 5, '2025-11-14 09:30:37'),
(216, '202500001', 3, 38, 6, 14, 5, '2025-11-14 09:30:37'),
(217, '202500001', 3, 38, 7, 10, 5, '2025-11-14 09:30:49'),
(218, '202500001', 3, 38, 7, 11, 5, '2025-11-14 09:30:49'),
(219, '202500001', 3, 38, 7, 12, 5, '2025-11-14 09:30:49'),
(220, '202500001', 3, 38, 7, 13, 5, '2025-11-14 09:30:49'),
(221, '202500001', 3, 38, 7, 14, 5, '2025-11-14 09:30:49'),
(222, '202500001', 3, 38, 8, 10, 5, '2025-11-14 09:30:59'),
(223, '202500001', 3, 38, 8, 11, 5, '2025-11-14 09:30:59'),
(224, '202500001', 3, 38, 8, 12, 5, '2025-11-14 09:30:59'),
(225, '202500001', 3, 38, 8, 13, 5, '2025-11-14 09:30:59'),
(226, '202500001', 3, 38, 8, 14, 5, '2025-11-14 09:30:59'),
(227, '202500001', 3, 38, 9, 10, 5, '2025-11-14 09:31:07'),
(228, '202500001', 3, 38, 9, 11, 5, '2025-11-14 09:31:07'),
(229, '202500001', 3, 38, 9, 12, 5, '2025-11-14 09:31:07'),
(230, '202500001', 3, 38, 9, 13, 5, '2025-11-14 09:31:07'),
(231, '202500001', 3, 38, 9, 14, 5, '2025-11-14 09:31:07'),
(232, '202500001', 3, 38, 11, 10, 5, '2025-11-14 09:31:15'),
(233, '202500001', 3, 38, 11, 11, 5, '2025-11-14 09:31:15'),
(234, '202500001', 3, 38, 11, 12, 5, '2025-11-14 09:31:15'),
(235, '202500001', 3, 38, 11, 13, 5, '2025-11-14 09:31:15'),
(236, '202500001', 3, 38, 11, 14, 5, '2025-11-14 09:31:15'),
(237, '202500001', 16, 38, 5, 7, 1, '2025-11-21 10:07:42'),
(238, '202500001', 16, 38, 5, 8, 1, '2025-11-21 10:07:42'),
(239, '202500001', 16, 38, 5, 9, 1, '2025-11-21 10:07:42'),
(240, '202500001', 16, 63, 4, 7, 1, '2025-11-21 10:09:11'),
(241, '202500001', 16, 63, 4, 8, 1, '2025-11-21 10:09:11'),
(242, '202500001', 16, 63, 4, 9, 1, '2025-11-21 10:09:11'),
(243, '202500001', 16, 38, 3, 7, 1, '2025-11-21 10:09:27'),
(244, '202500001', 16, 38, 3, 8, 1, '2025-11-21 10:09:27'),
(245, '202500001', 16, 38, 3, 9, 1, '2025-11-21 10:09:27'),
(246, '202500001', 16, 38, 10, 7, 1, '2025-11-21 10:09:36'),
(247, '202500001', 16, 38, 10, 8, 1, '2025-11-21 10:09:36'),
(248, '202500001', 16, 38, 10, 9, 1, '2025-11-21 10:09:36'),
(249, '202500001', 16, 38, 6, 7, 1, '2025-11-21 10:09:47'),
(250, '202500001', 16, 38, 6, 8, 1, '2025-11-21 10:09:47'),
(251, '202500001', 16, 38, 6, 9, 1, '2025-11-21 10:09:47'),
(252, '202500001', 16, 38, 7, 7, 1, '2025-11-21 10:10:00'),
(253, '202500001', 16, 38, 7, 8, 1, '2025-11-21 10:10:00'),
(254, '202500001', 16, 38, 7, 9, 1, '2025-11-21 10:10:00'),
(255, '202500001', 16, 38, 8, 7, 1, '2025-11-21 10:10:15'),
(256, '202500001', 16, 38, 8, 8, 1, '2025-11-21 10:10:15'),
(257, '202500001', 16, 38, 8, 9, 1, '2025-11-21 10:10:15'),
(258, '202500001', 16, 38, 9, 7, 1, '2025-11-21 10:10:25'),
(259, '202500001', 16, 38, 9, 8, 1, '2025-11-21 10:10:25'),
(260, '202500001', 16, 38, 9, 9, 1, '2025-11-21 10:10:25'),
(261, '202500001', 16, 38, 11, 7, 1, '2025-11-21 10:10:35'),
(262, '202500001', 16, 38, 11, 8, 1, '2025-11-21 10:10:36'),
(263, '202500001', 16, 38, 11, 9, 1, '2025-11-21 10:10:36'),
(264, '202500001', 16, 38, 11, 7, 1, '2025-11-21 10:10:47'),
(265, '202500001', 16, 38, 11, 8, 1, '2025-11-21 10:10:47'),
(266, '202500001', 16, 38, 11, 9, 1, '2025-11-21 10:10:47');

-- --------------------------------------------------------

--
-- Table structure for table `student_grade_overall_table`
--

CREATE TABLE `student_grade_overall_table` (
  `id` int(11) NOT NULL,
  `student_number` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `final_grade` decimal(2,2) NOT NULL,
  `active_school_year_id` int(11) NOT NULL,
  `remarks` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_grade_overall_table`
--

INSERT INTO `student_grade_overall_table` (`id`, `student_number`, `course_id`, `final_grade`, `active_school_year_id`, `remarks`) VALUES
(1, 224095240, 1, 0.99, 2, 1),
(2, 224091140, 2, 0.99, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `student_numbering_table`
--

CREATE TABLE `student_numbering_table` (
  `id` int(11) NOT NULL,
  `student_number` varchar(255) NOT NULL,
  `person_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_numbering_table`
--

INSERT INTO `student_numbering_table` (`id`, `student_number`, `person_id`) VALUES
(1, '202500001', 1),
(2, '202500002', 2),
(3, '202500003', 3),
(4, '202500004', 4),
(5, '202500005', 5),
(6, '202500006', 6),
(7, '202500007', 7),
(8, '202500008', 8),
(9, '202500009', 9),
(10, '202500010', 10),
(11, '202500011', 11),
(12, '202500012', 12),
(13, '202500013', 13),
(14, '202500014', 14),
(15, '202500015', 15),
(16, '202500016', 16),
(17, '202500017', 17),
(18, '202500018', 18),
(19, '202500019', 19),
(20, '202500020', 20),
(21, '202500021', 21),
(22, '202500022', 22),
(23, '202500023', 23),
(24, '202500024', 24),
(25, '202500025', 25),
(26, '202500026', 26),
(27, '202500027', 27),
(28, '202500028', 28),
(29, '202500029', 29),
(30, '202500030', 30),
(31, '202500031', 31),
(32, '202500032', 32),
(33, '202500033', 33),
(34, '202500034', 34),
(35, '202500035', 35),
(36, '202500036', 36),
(37, '202500037', 37),
(38, '202500038', 38),
(39, '202500039', 39),
(40, '202500040', 40),
(41, '202500041', 41),
(42, '202500042', 42),
(43, '202500043', 43),
(44, '202500044', 44),
(45, '202500045', 45),
(46, '202500046', 46),
(47, '202500047', 47),
(48, '202500048', 48),
(49, '202500049', 49),
(50, '202500050', 50),
(51, '202500051', 51),
(52, '202500052', 52),
(53, '202500053', 53),
(54, '202500054', 54),
(55, '202500055', 55),
(56, '202500056', 56),
(57, '202500057', 57),
(58, '202500058', 58),
(59, '202500059', 59),
(60, '202500060', 60),
(61, '202500306', 306),
(62, '202500307', 307),
(63, '202500309', 309),
(80, '224-09114M', 1337),
(81, '234-14491M', 1338),
(82, '234-14491M', 1339),
(83, '234-14491M', 1340),
(84, '234-14491M', 1341),
(85, '202500001', 1342),
(86, '202500002', 1343),
(87, '202500003', 1344),
(88, '202500004', 1345),
(89, '202500005', 1346),
(90, '202500323', 323),
(91, '202500001', 1348),
(92, '202500002', 1349),
(93, '202500003', 1350),
(94, '202500004', 1351),
(95, '202500005', 1352),
(96, '202500001', 1353),
(97, '202500002', 1354),
(98, '202500003', 1355),
(99, '202500004', 1356),
(100, '202500005', 1357),
(101, '210-05278M', 1359),
(102, '210-04890M', 1360),
(103, '210-04171M', 1361),
(104, '210-04153M', 1362),
(105, '210-04151M', 1363),
(106, '210-04147M', 1364),
(107, '210-03312M', 1365),
(108, '210-01616M', 1366),
(109, '210-01605M', 1367),
(110, '210-01603M', 1368),
(111, '210-01601M', 1369),
(112, '206-0554', 1370),
(113, '200-0204', 1371),
(114, '200-0196', 1372),
(115, '200-0184', 1373),
(116, '200-0163', 1374),
(117, '200-0158', 1375),
(118, '200-0157', 1376),
(119, '200-0154', 1377),
(120, '200-0153', 1378),
(121, '200-0152', 1379),
(122, '200-0145', 1380),
(123, '224-06342M', 1382),
(124, '202500341', 341),
(125, '254373', 1383),
(126, '532151', 1388),
(127, '254373', 1389),
(128, '202500343', 343),
(129, '202500352', 352),
(130, '202500347', 347),
(131, '202500345', 345),
(132, '202500313', 313);

-- --------------------------------------------------------

--
-- Table structure for table `student_status_table`
--

CREATE TABLE `student_status_table` (
  `id` int(11) NOT NULL,
  `student_number` varchar(255) DEFAULT NULL,
  `active_curriculum` int(11) DEFAULT NULL,
  `enrolled_status` varchar(11) DEFAULT NULL,
  `year_level_id` int(11) DEFAULT NULL,
  `active_school_year_id` int(11) DEFAULT NULL,
  `control_status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_status_table`
--

INSERT INTO `student_status_table` (`id`, `student_number`, `active_curriculum`, `enrolled_status`, `year_level_id`, `active_school_year_id`, `control_status`) VALUES
(36, '202500001', 1, '1', 1, 1, 0),
(37, '202500002', 1, '1', 1, 0, 0),
(38, '202500012', 0, '1', 0, 0, 0),
(39, '202500009', 0, '1', 0, 0, 0),
(40, '202500003', 0, '1', 0, 0, 0),
(41, '202500004', 0, '1', 0, 0, 0),
(42, '202500005', 0, '1', 0, 0, 0),
(43, '202500006', 0, '1', 0, 0, 0),
(44, '202500007', 0, '1', 0, 0, 0),
(45, '202500008', 0, '1', 0, 0, 0),
(46, '202500010', 0, '1', 0, 0, 0),
(47, '202500011', 0, '1', 0, 0, 0),
(48, '202500013', 0, '1', 0, 0, 0),
(49, '202500014', 0, '1', 0, 0, 0),
(50, '202500015', 0, '1', 0, 0, 0),
(51, '202500017', 0, '1', 0, 0, 0),
(52, '202500016', 0, '1', 0, 0, 0),
(53, '202500019', 0, '1', 0, 0, 0),
(54, '202500018', 0, '1', 0, 0, 0),
(55, '202500020', 0, '1', 0, 0, 0),
(56, '202500021', 0, '1', 0, 0, 0),
(57, '202500022', 0, '1', 0, 0, 0),
(58, '202500023', 0, '1', 0, 0, 0),
(59, '202500025', 0, '1', 0, 0, 0),
(60, '202500024', 0, '1', 0, 0, 0),
(61, '202500028', 0, '1', 0, 0, 0),
(62, '202500029', 0, '1', 0, 0, 0),
(63, '202500030', 0, '1', 0, 0, 0),
(64, '202500027', 0, '1', 0, 0, 0),
(65, '202500026', 0, '1', 0, 0, 0),
(66, '202500032', 0, '1', 0, 0, 0),
(67, '202500031', 0, '1', 0, 0, 0),
(68, '202500034', 0, '1', 0, 0, 0),
(69, '202500033', 0, '1', 0, 0, 0),
(70, '202500036', 0, '1', 0, 0, 0),
(71, '202500037', 0, '1', 0, 0, 0),
(72, '202500035', 0, '1', 0, 0, 0),
(73, '202500038', 0, '1', 0, 0, 0),
(74, '202500040', 0, '1', 0, 0, 0),
(75, '202500039', 0, '1', 0, 0, 0),
(76, '202500041', 0, '1', 0, 0, 0),
(77, '202500042', 0, '1', 0, 0, 0),
(78, '202500043', 0, '1', 0, 0, 0),
(79, '202500044', 0, '1', 0, 0, 0),
(80, '202500045', 0, '1', 0, 0, 0),
(81, '202500047', 0, '1', 0, 0, 0),
(82, '202500048', 0, '1', 0, 0, 0),
(83, '202500046', 0, '1', 0, 0, 0),
(84, '202500049', 0, '1', 0, 0, 0),
(85, '202500051', 0, '1', 0, 0, 0),
(86, '202500050', 0, '1', 0, 0, 0),
(87, '202500052', 0, '1', 0, 0, 0),
(88, '202500054', 0, '1', 0, 0, 0),
(89, '202500053', 0, '1', 0, 0, 0),
(90, '202500055', 0, '1', 0, 0, 0),
(91, '202500056', 0, '1', 0, 0, 0),
(92, '202500058', 0, '1', 0, 0, 0),
(93, '202500057', 0, '1', 0, 0, 0),
(94, '202500059', 0, '1', 0, 0, 0),
(95, '202500060', 1, '1', 1, 0, 0),
(96, '202500306', 1, '1', 1, 0, 0),
(97, '202500307', 0, '1', 0, 0, 0),
(98, '202500309', 0, '1', 0, 0, 0),
(99, '202500323', 0, '1', 0, 0, 0),
(100, '202500341', 1, '1', 1, 0, 0),
(101, '202500343', 1, '1', 1, 0, 0),
(102, '202500352', 0, '1', 0, 0, 0),
(103, '202500347', 0, '1', 0, 0, 0),
(104, '202500345', 14, '1', 0, 0, 0),
(105, '202500313', 0, '1', 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `time_table`
--

CREATE TABLE `time_table` (
  `id` int(11) NOT NULL,
  `room_day` int(11) DEFAULT NULL,
  `school_time_start` varchar(11) DEFAULT NULL,
  `school_time_end` varchar(11) DEFAULT NULL,
  `department_section_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `professor_id` int(11) DEFAULT NULL,
  `department_room_id` int(11) DEFAULT NULL,
  `school_year_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `time_table`
--

INSERT INTO `time_table` (`id`, `room_day`, `school_time_start`, `school_time_end`, `department_section_id`, `course_id`, `professor_id`, `department_room_id`, `school_year_id`) VALUES
(24, 2, '10:00 AM', '12:00 PM', 1, 13, 38, 21, 12),
(25, 2, '12:00 AM', '1:00 AM', 1, 4, 63, 21, 12),
(26, 3, '7:00 AM', '10:00 AM', 5, 4, 63, 21, 12),
(27, 2, '7:00 AM', '10:00 AM', 4, 4, 38, 21, 12),
(28, 1, '10:00 AM', '12:00 PM', 2, 5, 38, 21, 12),
(29, 1, '7:00 AM', '10:00 AM', 1, 1, 38, 21, 12),
(30, 4, '7:00 AM', '10:00 AM', 7, 4, 38, 21, 12),
(31, 4, '10:00 AM', '12:00 PM', 7, 2, 38, 21, 12),
(32, 3, '12:00 PM', '3:00 PM', 2, 15, 63, 21, 12),
(33, 6, '8:00 AM', '10:00 AM', 4, 11, 63, 21, 12),
(41, 1, '10:00 AM', '12:00 PM', 1, 10, 38, 21, 16),
(42, 2, '7:00 AM', '9:00 AM', 1, 3, 38, 21, 3),
(43, 3, '7:00 AM', '10:00 AM', 1, 4, 38, 2, 3),
(44, 2, '10:00 AM', '12:00 PM', 1, 5, 38, 26, 3),
(45, 4, '7:00 AM', '9:00 AM', 1, 6, 38, 21, 3),
(46, 3, '5:00 PM', '7:00 PM', 1, 7, 38, 26, 3),
(47, 5, '9:00 AM', '12:00 PM', 1, 8, 38, 26, 3),
(48, 6, '7:00 AM', '12:00 PM', 1, 9, 38, 26, 3),
(49, 6, '5:00 PM', '9:00 PM', 1, 10, 38, 21, 3),
(50, 1, '10:00 AM', '1:00 PM', 1, 11, 38, 2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `tosf`
--

CREATE TABLE `tosf` (
  `tosf_id` int(11) NOT NULL,
  `athletic_fee` varchar(255) NOT NULL DEFAULT '0',
  `cultural_fee` varchar(255) NOT NULL DEFAULT '0',
  `developmental_fee` varchar(255) NOT NULL DEFAULT '0',
  `guidance_fee` varchar(255) NOT NULL DEFAULT '0',
  `library_fee` varchar(255) NOT NULL DEFAULT '0',
  `medical_and_dental_fee` varchar(255) NOT NULL DEFAULT '0',
  `registration_fee` varchar(255) NOT NULL DEFAULT '0',
  `computer_fee` varchar(255) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tosf`
--

INSERT INTO `tosf` (`tosf_id`, `athletic_fee`, `cultural_fee`, `developmental_fee`, `guidance_fee`, `library_fee`, `medical_and_dental_fee`, `registration_fee`, `computer_fee`) VALUES
(2, '50', '50', '80', '30', '100', '130', '50', '500');

-- --------------------------------------------------------

--
-- Table structure for table `unifast`
--

CREATE TABLE `unifast` (
  `id` int(11) NOT NULL,
  `campus_name` varchar(60) NOT NULL,
  `student_number` varchar(255) NOT NULL,
  `learner_reference_number` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `given_name` varchar(255) NOT NULL,
  `middle_initial` varchar(60) NOT NULL,
  `degree_program` varchar(255) NOT NULL,
  `year_level` varchar(255) NOT NULL,
  `sex` varchar(60) NOT NULL,
  `email_address` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `laboratory_units` varchar(255) NOT NULL,
  `computer_units` varchar(255) NOT NULL,
  `academic_units_enrolled` varchar(255) NOT NULL,
  `academic_units_nstp_enrolled` varchar(255) NOT NULL,
  `tuition_fees` varchar(255) NOT NULL,
  `nstp_fees` varchar(255) NOT NULL,
  `athletic_fees` varchar(255) NOT NULL,
  `computer_fees` varchar(255) NOT NULL,
  `cultural_fees` varchar(255) NOT NULL,
  `development_fees` varchar(255) NOT NULL,
  `guidance_fees` varchar(255) NOT NULL,
  `laboratory_fees` varchar(255) NOT NULL,
  `library_fees` varchar(255) NOT NULL,
  `medical_and_dental_fees` varchar(255) NOT NULL,
  `registration_fees` varchar(255) NOT NULL,
  `school_id_fees` varchar(255) NOT NULL,
  `total_tosf` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL,
  `active_school_year_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `unifast`
--

INSERT INTO `unifast` (`id`, `campus_name`, `student_number`, `learner_reference_number`, `last_name`, `given_name`, `middle_initial`, `degree_program`, `year_level`, `sex`, `email_address`, `phone_number`, `laboratory_units`, `computer_units`, `academic_units_enrolled`, `academic_units_nstp_enrolled`, `tuition_fees`, `nstp_fees`, `athletic_fees`, `computer_fees`, `cultural_fees`, `development_fees`, `guidance_fees`, `laboratory_fees`, `library_fees`, `medical_and_dental_fees`, `registration_fees`, `school_id_fees`, `total_tosf`, `remark`, `active_school_year_id`) VALUES
(9, 'Manila', '202500001', '123456789012', 'Montaño', 'Mark Anthony', 'P', 'Bachelor of Science in Architecture', 'First Year', 'Male', 'markmontano999@gmail.com', '09171234567999999', '0', '3', '0', '3', '0', '1000', '50', '500', '50', '80', '30', '0', '100', '130', '2000', '100', '990', '', 1),
(10, 'Manila', '202500001', '123456789012', 'Montaño', 'Mark Anthony', 'P', 'Bachelor of Science in Architecture', 'First Year', 'Male', 'markmontano999@gmail.com', '09171234567999999', '2', '3', '20', '3', '2600', '1000', '50', '500', '50', '80', '30', '200', '100', '130', '2000', '100', '3590', '', 1),
(11, 'Manila', '202500001', '123456789012', 'Montaño', 'Mark Anthony', 'P', 'Bachelor of Science in Architecture', 'First Year', 'Male', 'markmontano999@gmail.com', '09171234567999999', '2', '3', '20', '3', '2600', '1000', '50', '500', '50', '80', '30', '200', '100', '130', '2000', '100', '3590', '', 16),
(12, 'Manila', '202500001', '123456789012', 'Montaño', 'Mark Anthony', 'P', 'Bachelor of Science in Architecture', 'Fourth Year', 'Male', 'markmontano999@gmail.com', '09171234567999999', '2', '3', '20', '3', '2600', '1000', '50', '500', '50', '80', '30', '200', '100', '130', '2000', '100', '3590', '', 3),
(13, 'Manila', '202500001', '123456789012', 'Montaño', 'Mark Anthony', 'P', 'Bachelor of Science in Architecture', 'Fourth Year', 'Male', 'markmontano999@gmail.com', '09171234567999999', '2', '3', '20', '3', '2600', '1000', '50', '500', '50', '80', '30', '200', '100', '130', '2000', '100', '3590', '', 3);

-- --------------------------------------------------------

--
-- Table structure for table `user_accounts`
--

CREATE TABLE `user_accounts` (
  `id` int(11) NOT NULL,
  `person_id` int(11) DEFAULT NULL,
  `employee_id` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` int(11) DEFAULT NULL,
  `dprtmnt_id` int(11) DEFAULT NULL,
  `require_otp` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_accounts`
--

INSERT INTO `user_accounts` (`id`, `person_id`, `employee_id`, `profile_picture`, `role`, `last_name`, `middle_name`, `first_name`, `email`, `password`, `status`, `dprtmnt_id`, `require_otp`) VALUES
(1, 1, NULL, NULL, 'student', NULL, NULL, NULL, 'markmontao2671@gmail.com', '$2b$10$1z0TPyKFo6qtCrVAaA1D4e3qANATLI.pyTLqZinmmT8sF2zMALkDu', 1, 1, 1),
(12, 13, NULL, NULL, 'student', NULL, NULL, NULL, 'benjamin.anderson13@example.com', '$2b$10$QEsrP1R1oVa.eZiqlZRgoeFaaIJSX2ZuR9DhZvArwINLs3mR2a/cm', 0, NULL, 1),
(13, 14, NULL, NULL, 'student', NULL, NULL, NULL, 'ava.thomas14@example.com', '$2b$10$Bqh2HDkbbs0PabLc1ycQpOYj4RBqeb4rR7b/Iu8B5b3mM7cAFPY8W', 0, NULL, 1),
(14, 15, NULL, NULL, 'student', NULL, NULL, NULL, 'ethan.taylor15@example.com', '$2b$10$FkyAfmKmxgsun/3/sf7hUuEPIz6p2Ci5CnlmbbsyImc.ZfwKfJP.W', 0, NULL, 1),
(15, 18, NULL, NULL, 'student', NULL, NULL, NULL, 'mia.martin18@example.com', '$2b$10$pwsagB1vg4PKuXilyZ/hFeLfh7w6yi2b.Ak3j9S2nGDYzKX9gwECO', 0, NULL, 1),
(17, 92, NULL, NULL, 'student', NULL, NULL, NULL, 'mecasio@gmail.com', '$2b$10$CHRiC06CY6QQS4ZpiBlJYePp1TjQti.BlwIXJkc83ojxPM3H11vG.', 1, NULL, 1),
(19, 2, NULL, NULL, 'student', NULL, NULL, NULL, 'emily.johnson2@example.com', '$2b$10$b3WCXkUNAo8MmvwsK14kP.OhNIlAp4BqBIyXgF0cYPI.12IwBV1cy', 0, NULL, 1),
(20, 204, NULL, NULL, 'student', NULL, NULL, NULL, 'lala@example.com', '$2b$10$lDL/0s7dOdohXxChj2EegOXYTKi2FV1IAIKqso4xT7ymlP52Dm5om', 0, NULL, 1),
(21, 3, NULL, NULL, 'student', NULL, NULL, NULL, 'michael.williams3@example.com', '$2b$10$c.5WHhR7zzeOhfj/u6yZKetNbToSGy2SSfK0DyiR0Gra4py/QODz.', 0, NULL, 1),
(22, 12, NULL, NULL, 'student', NULL, NULL, NULL, 'sophia.wilson12@example.com', '$2b$10$x8sYA4mz7RZUtOM6NyAE5uGu/n6bLSWSuWf6UdsZD99/LGpMAiohG', 0, NULL, 1),
(23, 9, NULL, NULL, 'student', NULL, NULL, NULL, 'matthew.martinez9@example.com', '$2b$10$GIjnErBrPJz9CWHKyJDvmeN0juDU9EIHOA7hJ/XvKv4Cwynx13xgK', 0, NULL, 1),
(24, 5, NULL, NULL, 'student', NULL, NULL, NULL, 'david.jones5@example.com', '$2b$10$xB1JZHYUhmOZ2TA/FTk/PuZMypmUS2xdu4qrkUSCR5YuXW28nu7/e', 0, NULL, 1),
(25, 6, NULL, NULL, 'student', NULL, NULL, NULL, 'jessica.garcia6@example.com', '$2b$10$uCB2mBA6gCotNySKK9U8tuzdh/BhRxJDCZcUWxFhhnr3SfxrSV/Mm', 0, NULL, 1),
(26, 7, NULL, NULL, 'student', NULL, NULL, NULL, 'daniel.miller7@example.com', '$2b$10$yUPnF32Lib8xD0WlW4RkpOwE1DTKNoXsNn1PQm/UrWwUpf98ElKvC', 0, NULL, 1),
(27, 8, NULL, NULL, 'student', NULL, NULL, NULL, 'ashley.davis8@example.com', '$2b$10$SLUGkj1rObDjB3uUTJPKP.H.wqWn8o7Y/pNxe2rRvuMNWBYS0E07i', 0, NULL, 1),
(28, 10, NULL, NULL, 'student', NULL, NULL, NULL, 'olivia.lopez10@example.com', '$2b$10$SYtyZ.7gsXN5jA/s2vLvGe31rwESAnY2XoqNgPhs5Jdm/WDrF3gLe', 0, NULL, 1),
(29, 11, NULL, NULL, 'student', NULL, NULL, NULL, 'james.gonzalez11@example.com', '$2b$10$77J/1bIFl856sWJeVhS05OCloZj4CDDdY/VeetnVhbLjpcN/x516i', 0, NULL, 1),
(30, 17, NULL, NULL, 'student', NULL, NULL, NULL, 'alexander.jackson17@example.com', '$2b$10$lrKq4IEVEjl3nEXzmfROtutFeJlmtM3pHG/c532Eo25tEmb8yDnqS', 0, NULL, 1),
(31, 16, NULL, NULL, 'student', NULL, NULL, NULL, 'isabella.moore16@example.com', '$2b$10$yDqQB42dUW1kch4C6ek7QOFmXzEIXq4ufZPPAHtnq8/xShL9XopsC', 0, NULL, 1),
(32, 19, NULL, NULL, 'student', NULL, NULL, NULL, 'william.lee19@example.com', '$2b$10$b3FWglvmXDJd5sJHSjIu/.Xm1pfD6oFd8O7PPZMIPYFEQK5xko722', 0, NULL, 1),
(33, 21, NULL, NULL, 'student', NULL, NULL, NULL, 'henry.thompson21@example.com', '$2b$10$L948ZL4YER9ajIybEdnwxOIy1dRXkXyJgA2S84HXjzv0BtPkDKtta', 0, NULL, 1),
(34, 22, NULL, NULL, 'student', NULL, NULL, NULL, 'amelia.white22@example.com', '$2b$10$Kw3/vOhjQ40JYmW1Pib.ZesDmWlatEuGmbYKImwIFoZiS1wJWwdmW', 0, NULL, 1),
(35, 23, NULL, NULL, 'student', NULL, NULL, NULL, 'lucas.harris23@example.com', '$2b$10$BtklOyJxSxY6xA0DeEJVB.YLrI1KklMZPrcOcpcEw.1K5G6Itut/G', 0, NULL, 1),
(36, 25, NULL, NULL, 'student', NULL, NULL, NULL, 'mason.clark25@example.com', '$2b$10$Cx.IbPfNEnJRUPNXwy3Cce3cvrDFSE529oO9Whxn3IXNJQXpwfmvK', 0, NULL, 1),
(37, 24, NULL, NULL, 'student', NULL, NULL, NULL, 'harper.sanchez24@example.com', '$2b$10$aYc9guxBB3btzPRYMKp2zOj1e9TYqOnGUdPSUHeZExtdEXKcFIiNm', 0, NULL, 1),
(38, 28, NULL, NULL, 'student', NULL, NULL, NULL, 'grace.robinson28@example.com', '$2b$10$WgTq.Hzr/LyluvsdMNQeD.wdWurcXWr42ZqpMYN1HJuMXNel.kOFa', 0, NULL, 1),
(39, 29, NULL, NULL, 'student', NULL, NULL, NULL, 'elijah.walker29@example.com', '$2b$10$xCNZujvCh7y7SHWPv2rCw.7ohpNT8DsGgqaiW7AAnZ3tMcNwK5yz6', 0, NULL, 1),
(40, 30, NULL, NULL, 'student', NULL, NULL, NULL, 'chloe.young30@example.com', '$2b$10$YNaFSyQkD7YK8LDDFIzrOuMVagG4gs15cAXWtq7tSTDfCP575GZjC', 0, NULL, 1),
(41, 27, NULL, NULL, 'student', NULL, NULL, NULL, 'logan.lewis27@example.com', '$2b$10$TRyLbr7cG9msP8gNiwvZe.XzW7ngEZC8XtImHNqSHjWD/1mktKE9.', 0, NULL, 1),
(42, 26, NULL, NULL, 'student', NULL, NULL, NULL, 'ella.ramirez26@example.com', '$2b$10$jOESzkksdee6I4bXDuFzVejbGrGO5SYTpEmSwbEGOGLpJxhSa./ZS', 0, NULL, 1),
(43, 32, NULL, NULL, 'student', NULL, NULL, NULL, 'lily.king32@example.com', '$2b$10$kdio48ZmdPSrfGe38ijDT.ZIru99Nc5HlyCpnTTOrscASzUf6EpLu', 0, NULL, 1),
(44, 31, NULL, NULL, 'student', NULL, NULL, NULL, 'aiden.allen31@example.com', '$2b$10$G3iW.HVT4FwI1OE0k6Z6fu7y3/Ytjgo1AKTIRb.hbh2.UhZJJtAV6', 0, NULL, 1),
(45, 34, NULL, NULL, 'student', NULL, NULL, NULL, 'zoe.scott34@example.com', '$2b$10$w3JLGR5raLYF72GZF7Cg5OMYknrl10yNk6R1xHUR7J3pO8LLjOMhC', 0, NULL, 1),
(46, 33, NULL, NULL, 'student', NULL, NULL, NULL, 'joseph.wright33@example.com', '$2b$10$Hd3H6DNraCr71M2lR28jieJ2OMm76cbVsxI2VGIcUkF3Nu8mOfLGe', 0, NULL, 1),
(47, 36, NULL, NULL, 'student', NULL, NULL, NULL, 'aria.nguyen36@example.com', '$2b$10$elMQt7tcF0CPAkDPDn29ven00mfq/uufhlYdK28m9IrY6gWf7tvRu', 0, NULL, 1),
(48, 37, NULL, NULL, 'student', NULL, NULL, NULL, 'sebastian.hill37@example.com', '$2b$10$ub.IGUTH1Lw.UNpkHN9J6.IvXfGpgrZrbgG9lzKzqOWTTLQcyZ7RG', 0, NULL, 1),
(49, 35, NULL, NULL, 'student', NULL, NULL, NULL, 'samuel.torres35@example.com', '$2b$10$ocYU7Jw3jnPh8mOE14RLf.l30kgOosdn3Q9xYixfdk7lfd1KFn5Lm', 0, NULL, 1),
(50, 38, NULL, NULL, 'student', NULL, NULL, NULL, 'avery.green38@example.com', '$2b$10$r/q7Xf2JdRBxRi6fwobCV.B2yv2NmLQm81au69TLH59qavqQysk3W', 0, NULL, 1),
(51, 40, NULL, NULL, 'student', NULL, NULL, NULL, 'scarlett.baker40@example.com', '$2b$10$DYB6vWwb2thF/BjqpGS2uu44IdzbyVjC01Ql/wTgf7PNs.1x2G3Fe', 0, NULL, 1),
(52, 39, NULL, NULL, 'student', NULL, NULL, NULL, 'jack.adams39@example.com', '$2b$10$L9TruFyFdfq6L2O25uMS6egOVldkvz/IiG02mP.fe0mmBxyqDfZRW', 0, NULL, 1),
(53, 41, NULL, NULL, 'student', NULL, NULL, NULL, 'owen.gonzalez41@example.com', '$2b$10$O48lr2ngBTmMZNbw9cv//emrL5oQcqzWKSlmJxBboaucFRf8/YcHi', 0, NULL, 1),
(54, 42, NULL, NULL, 'student', NULL, NULL, NULL, 'hannah.nelson42@example.com', '$2b$10$YLi61NOZZGz30lWVLdXTJ.4jFNAaDyYgo6yhB0g3T1KCPPOWdOMNu', 0, NULL, 1),
(55, 43, NULL, NULL, 'student', NULL, NULL, NULL, 'wyatt.carter43@example.com', '$2b$10$nJFc/y70LWlHLZT5gB7hCukqrH5.1o6BtiI28mK79YtCeSgHvBfXm', 0, NULL, 1),
(56, 44, NULL, NULL, 'student', NULL, NULL, NULL, 'abigail.mitchell44@example.com', '$2b$10$adSDdayCqHCIMNvfdSyAieBy6NGHyQbqwb8.bE8N8CLkw0LTCDh0G', 0, NULL, 1),
(57, 45, NULL, NULL, 'student', NULL, NULL, NULL, 'luke.perez45@example.com', '$2b$10$y5KC0f7Y3UlessSEkMg6iebSpBpXTEcy9p5oImWVzcODTdH5moZEO', 0, NULL, 1),
(58, 47, NULL, NULL, 'student', NULL, NULL, NULL, 'jayden.evans47@example.com', '$2b$10$ehjUz6.Cfvw/wu2kOiM6NetpIhku5cg/Xuh3oX/bL0/W3dPjsu/sC', 0, NULL, 1),
(59, 48, NULL, NULL, 'student', NULL, NULL, NULL, 'sofia.turner48@example.com', '$2b$10$Ntcgs0uNXl.SR2W9S22Ra.A2nWW2Lp.7/vPJdGvWs1mrTk1wu6Md6', 0, NULL, 1),
(60, 46, NULL, NULL, 'student', NULL, NULL, NULL, 'madison.roberts46@example.com', '$2b$10$viL15McT3qLBvUByRrK22O0qPY8uUTZowF73DilXCJCdJLqBQ13qa', 0, NULL, 1),
(61, 49, NULL, NULL, 'student', NULL, NULL, NULL, 'gabriel.phillips49@example.com', '$2b$10$x3YrgGDIuE6bwBuPUJpvA.6xpc7jjk8Zsx8gGsoGMLKu6qPyIRVEO', 0, NULL, 1),
(62, 51, NULL, NULL, 'student', NULL, NULL, NULL, 'carter.parker51@example.com', '$2b$10$EnaIi5IjdlIkvPDC2UsKouy8NG.J8VOTBdCuO3dl7jILhrbhL47/C', 0, NULL, 1),
(63, 50, NULL, NULL, 'student', NULL, NULL, NULL, 'ella.campbell50@example.com', '$2b$10$69TfBE9F/Sh1knRGKozZE.5o8gu/gkNM0wjiVTMRNW79Thj8b/3tq', 0, NULL, 1),
(64, 52, NULL, NULL, 'student', NULL, NULL, NULL, 'victoria.edwards52@example.com', '$2b$10$x/9Keo8.oEvzG2Oa3rlZIe8RcRohGAX4Sq56nemgcz0Ii6fYnu/6m', 0, NULL, 1),
(65, 54, NULL, NULL, 'student', NULL, NULL, NULL, 'penelope.stewart54@example.com', '$2b$10$m3WVl7feor74lpAw6AQ2aeP.wyT2X7jFX4NrS3tItNWV.Jj7UiLV.', 0, NULL, 1),
(66, 53, NULL, NULL, 'student', NULL, NULL, NULL, 'isaac.collins53@example.com', '$2b$10$KUUqikh3gV4HJvs3gmwp4uZwFl56akR/IJF95BuvmqJ2cRyVJnaCi', 0, NULL, 1),
(67, 55, NULL, NULL, 'student', NULL, NULL, NULL, 'dylan.morris55@example.com', '$2b$10$W17qvkhVoWk/TfkWzV98f.xHpMhbk5SBUi7/NN7m6er0OV7Sg33i2', 0, NULL, 1),
(68, 56, NULL, NULL, 'student', NULL, NULL, NULL, 'layla.rogers56@example.com', '$2b$10$Cu435uLyMCip4vOTXM5XSu4As3NLF7w0OwDT0SdiAjGlVOI3Tjk36', 0, NULL, 1),
(69, 58, NULL, NULL, 'student', NULL, NULL, NULL, 'zoey.cook58@example.com', '$2b$10$UQIvAkxQbphM.HAVsPA2lOyugk4Acdg32CVIIijEXoUAN2ZcBSVYW', 0, NULL, 1),
(70, 57, NULL, NULL, 'student', NULL, NULL, NULL, 'nathan.reed57@example.com', '$2b$10$jnUt93mOT7dY3lOJ7GAkMutqEzQIg3FR42FBIs.CRiYbZyrD0NCly', 0, NULL, 1),
(71, 59, NULL, NULL, 'student', NULL, NULL, NULL, 'levi.morgan59@example.com', '$2b$10$b9kBNyc6ZfQLV1TIB2Jm5.NSQhp8YsQMItIxnJTA6otBZWuoYd6lS', 0, NULL, 1),
(72, 60, NULL, NULL, 'student', NULL, NULL, NULL, 'mecasio.a.bsinfotech@gmail.com', '$2b$10$mgM73SADDUd.J5AZmNh38.0t9LQaQLbpQC/fCNYGH/1dB.KRy567q', 1, NULL, 1),
(73, 61, '224-06342M', '224-06342M_profile_image_2025.jpg', 'registrar', 'Montano', 'Placido', 'Mark Anthony', 'markmontano522@gmail.com', '$2b$10$1z0TPyKFo6qtCrVAaA1D4e3qANATLI.pyTLqZinmmT8sF2zMALkDu', 1, 5, 0),
(74, 306, NULL, NULL, 'student', NULL, NULL, NULL, 'delacruz.lc.bsinfotech@gmail.com', '$2b$10$0euJr9pUR.su/PpmOIENd..YKBEZCP/aBsKhjyfnmWsE1kJyRb56a', NULL, NULL, 1),
(78, 1358, '51235256789', NULL, 'registrar', 'Pedro', 'Juan', 'Penduco', 'markmontano111@gmail.com', '$2b$10$uk40j.VZLXGZClaAd3Upr.I7dDtu2y05KNO7H9y18Wf41vzT5Y8T6', 1, 2, 1),
(79, 1381, '111111', NULL, 'registrar', 'Dhani', 'D. ', 'San Jose', 'disanjose@gmail.com', '$2b$10$gT9D98Juy/tht8U.ZIUwyecnp4BPpOECKwzVuR6CvYw6UkxQmnHdO', 1, 3, 1),
(80, 1382, NULL, 'undefined_profile.png', 'student', 'Montano', 'Placido', 'Mark Anthony', 'markmontano888@gmail.com', '$2b$10$8HCsU/TuwWOZAN5/HqYRL.Dyhwg5vK6trjvaNStVLdLF7hdc87N1S', 1, 5, 1),
(89, 343, NULL, NULL, 'student', NULL, NULL, NULL, 'morales.ta.bsinfotech@gmail.com', '$2b$10$8o/rEwI.5rU/koEz/HpIvO3GFjHCr2jEpH91VokYigNbwYGzJ1wYa', NULL, 1, 1),
(91, 1390, '123456', '123456_1763607261285.png', 'registrar', 'Carlos', '', 'Ernanie Jr.', 'montano.ma.bsinfotech@gmail.com', '$2b$10$1z0TPyKFo6qtCrVAaA1D4e3qANATLI.pyTLqZinmmT8sF2zMALkDu', 1, 5, 1),
(93, 345, NULL, NULL, 'student', NULL, NULL, NULL, 'genny.ciruela@gmail.com', '$2b$10$haeTZgAFB.A7tD2K8NdyweNPkHDZXIZclSv3lv4pBxRzWYkxJ5Hta', NULL, NULL, 1),
(98, 1395, '555', '555_1763792170575.jpg', 'registrar', 'Ciruela', 'D.', 'Genny', 'markmontano113@gmail.com', '$2b$10$77NQt818hxCzeyXzKqccw.bkyve0n/PgIGtkBmOPCdzNJWR7SfvFO', 1, NULL, 0),
(99, 1396, '7890456789', '7890456789_1763889293094.jpg', 'registrar', 'De la Cruz', 'D.', 'Cedrick', 'markmontano0626@gmail.com', '$2b$10$mPbclliJnazvOKY1i4EPRuxnAnyQ8o4Q2VKoNlFDvNeWPoaRG3LuS', 1, 5, 0),
(100, 313, NULL, NULL, 'student', NULL, NULL, NULL, 'montano.ma.bsinfotech@gmail.com', '$2b$10$RKZ6fIAMQxkmQkOcka65UuM3OMa7unlNPUfZeYYH96hgPrtRBUNMy', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `year_level_table`
--

CREATE TABLE `year_level_table` (
  `year_level_id` int(11) NOT NULL,
  `year_level_description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `year_level_table`
--

INSERT INTO `year_level_table` (`year_level_id`, `year_level_description`) VALUES
(1, 'First Year'),
(2, 'Second Year'),
(3, 'Third Year'),
(4, 'Fourth Year'),
(5, 'Fifth Year');

-- --------------------------------------------------------

--
-- Table structure for table `year_table`
--

CREATE TABLE `year_table` (
  `year_id` int(11) NOT NULL,
  `year_description` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `year_table`
--

INSERT INTO `year_table` (`year_id`, `year_description`, `status`) VALUES
(1, 2016, 0),
(2, 2017, 0),
(3, 2018, 0),
(4, 2019, 0),
(5, 2020, 0),
(6, 2021, 0),
(7, 2022, 0),
(8, 2023, 0),
(9, 2024, 0),
(10, 2025, 1),
(11, 2026, 0),
(12, 2027, 0),
(13, 2028, 0),
(14, 2029, 0),
(15, 2030, 0),
(16, 2031, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `active_school_year_table`
--
ALTER TABLE `active_school_year_table`
  ADD PRIMARY KEY (`id`),
  ADD KEY `year_id` (`year_id`),
  ADD KEY `semester_id` (`semester_id`);

--
-- Indexes for table `course_table`
--
ALTER TABLE `course_table`
  ADD PRIMARY KEY (`course_id`);

--
-- Indexes for table `curriculum_table`
--
ALTER TABLE `curriculum_table`
  ADD PRIMARY KEY (`curriculum_id`);

--
-- Indexes for table `dprtmnt_curriculum_table`
--
ALTER TABLE `dprtmnt_curriculum_table`
  ADD PRIMARY KEY (`dprtmnt_curriculum_id`),
  ADD KEY `dprtmnt_id` (`dprtmnt_id`),
  ADD KEY `curriculum_id` (`curriculum_id`);

--
-- Indexes for table `dprtmnt_profs_table`
--
ALTER TABLE `dprtmnt_profs_table`
  ADD PRIMARY KEY (`dprtmnt_profs_id`),
  ADD KEY `dprtmnt_id` (`dprtmnt_id`),
  ADD KEY `prof_id` (`prof_id`);

--
-- Indexes for table `dprtmnt_room_table`
--
ALTER TABLE `dprtmnt_room_table`
  ADD PRIMARY KEY (`dprtmnt_room_id`),
  ADD KEY `dprtmnt_id` (`dprtmnt_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `dprtmnt_section_table`
--
ALTER TABLE `dprtmnt_section_table`
  ADD PRIMARY KEY (`id`),
  ADD KEY `curriculum_id` (`curriculum_id`),
  ADD KEY `section_id` (`section_id`);

--
-- Indexes for table `dprtmnt_table`
--
ALTER TABLE `dprtmnt_table`
  ADD PRIMARY KEY (`dprtmnt_id`);

--
-- Indexes for table `enrolled_subject`
--
ALTER TABLE `enrolled_subject`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `evaluation_table`
--
ALTER TABLE `evaluation_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `matriculation`
--
ALTER TABLE `matriculation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `medical_requirements`
--
ALTER TABLE `medical_requirements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `page_access`
--
ALTER TABLE `page_access`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `page_table`
--
ALTER TABLE `page_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `period_status`
--
ALTER TABLE `period_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `person_prof_table`
--
ALTER TABLE `person_prof_table`
  ADD PRIMARY KEY (`person_id`);

--
-- Indexes for table `person_status_table`
--
ALTER TABLE `person_status_table`
  ADD PRIMARY KEY (`id`),
  ADD KEY `person_id` (`person_id`);

--
-- Indexes for table `person_table`
--
ALTER TABLE `person_table`
  ADD PRIMARY KEY (`person_id`);

--
-- Indexes for table `prof_table`
--
ALTER TABLE `prof_table`
  ADD PRIMARY KEY (`prof_id`);

--
-- Indexes for table `program_table`
--
ALTER TABLE `program_table`
  ADD PRIMARY KEY (`program_id`);

--
-- Indexes for table `program_tagging_table`
--
ALTER TABLE `program_tagging_table`
  ADD PRIMARY KEY (`program_tagging_id`);

--
-- Indexes for table `question_table`
--
ALTER TABLE `question_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `requirements_table`
--
ALTER TABLE `requirements_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `requirement_uploads`
--
ALTER TABLE `requirement_uploads`
  ADD PRIMARY KEY (`upload_id`);

--
-- Indexes for table `room_day_table`
--
ALTER TABLE `room_day_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_table`
--
ALTER TABLE `room_table`
  ADD PRIMARY KEY (`room_id`);

--
-- Indexes for table `school_time_table`
--
ALTER TABLE `school_time_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `section_table`
--
ALTER TABLE `section_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `semester_table`
--
ALTER TABLE `semester_table`
  ADD PRIMARY KEY (`semester_id`);

--
-- Indexes for table `student_counter`
--
ALTER TABLE `student_counter`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_curriculum_table`
--
ALTER TABLE `student_curriculum_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_evaluation_table`
--
ALTER TABLE `student_evaluation_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_grade_overall_table`
--
ALTER TABLE `student_grade_overall_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_numbering_table`
--
ALTER TABLE `student_numbering_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_status_table`
--
ALTER TABLE `student_status_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `time_table`
--
ALTER TABLE `time_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tosf`
--
ALTER TABLE `tosf`
  ADD PRIMARY KEY (`tosf_id`);

--
-- Indexes for table `unifast`
--
ALTER TABLE `unifast`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_accounts`
--
ALTER TABLE `user_accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `year_level_table`
--
ALTER TABLE `year_level_table`
  ADD PRIMARY KEY (`year_level_id`);

--
-- Indexes for table `year_table`
--
ALTER TABLE `year_table`
  ADD PRIMARY KEY (`year_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `active_school_year_table`
--
ALTER TABLE `active_school_year_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `course_table`
--
ALTER TABLE `course_table`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `curriculum_table`
--
ALTER TABLE `curriculum_table`
  MODIFY `curriculum_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `dprtmnt_curriculum_table`
--
ALTER TABLE `dprtmnt_curriculum_table`
  MODIFY `dprtmnt_curriculum_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `dprtmnt_profs_table`
--
ALTER TABLE `dprtmnt_profs_table`
  MODIFY `dprtmnt_profs_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `dprtmnt_room_table`
--
ALTER TABLE `dprtmnt_room_table`
  MODIFY `dprtmnt_room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `dprtmnt_section_table`
--
ALTER TABLE `dprtmnt_section_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=518;

--
-- AUTO_INCREMENT for table `dprtmnt_table`
--
ALTER TABLE `dprtmnt_table`
  MODIFY `dprtmnt_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `enrolled_subject`
--
ALTER TABLE `enrolled_subject`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1093;

--
-- AUTO_INCREMENT for table `evaluation_table`
--
ALTER TABLE `evaluation_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `matriculation`
--
ALTER TABLE `matriculation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `medical_requirements`
--
ALTER TABLE `medical_requirements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `page_access`
--
ALTER TABLE `page_access`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=675;

--
-- AUTO_INCREMENT for table `period_status`
--
ALTER TABLE `period_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `person_prof_table`
--
ALTER TABLE `person_prof_table`
  MODIFY `person_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `person_status_table`
--
ALTER TABLE `person_status_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `person_table`
--
ALTER TABLE `person_table`
  MODIFY `person_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1397;

--
-- AUTO_INCREMENT for table `prof_table`
--
ALTER TABLE `prof_table`
  MODIFY `prof_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `program_table`
--
ALTER TABLE `program_table`
  MODIFY `program_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `program_tagging_table`
--
ALTER TABLE `program_tagging_table`
  MODIFY `program_tagging_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `question_table`
--
ALTER TABLE `question_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `requirements_table`
--
ALTER TABLE `requirements_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `requirement_uploads`
--
ALTER TABLE `requirement_uploads`
  MODIFY `upload_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=213;

--
-- AUTO_INCREMENT for table `room_day_table`
--
ALTER TABLE `room_day_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `room_table`
--
ALTER TABLE `room_table`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `school_time_table`
--
ALTER TABLE `school_time_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `section_table`
--
ALTER TABLE `section_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `semester_table`
--
ALTER TABLE `semester_table`
  MODIFY `semester_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `student_counter`
--
ALTER TABLE `student_counter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `student_curriculum_table`
--
ALTER TABLE `student_curriculum_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `student_evaluation_table`
--
ALTER TABLE `student_evaluation_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=267;

--
-- AUTO_INCREMENT for table `student_grade_overall_table`
--
ALTER TABLE `student_grade_overall_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `student_numbering_table`
--
ALTER TABLE `student_numbering_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `student_status_table`
--
ALTER TABLE `student_status_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT for table `time_table`
--
ALTER TABLE `time_table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `tosf`
--
ALTER TABLE `tosf`
  MODIFY `tosf_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `unifast`
--
ALTER TABLE `unifast`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `user_accounts`
--
ALTER TABLE `user_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `year_level_table`
--
ALTER TABLE `year_level_table`
  MODIFY `year_level_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `year_table`
--
ALTER TABLE `year_table`
  MODIFY `year_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
