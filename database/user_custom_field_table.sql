-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 20, 2020 at 10:50 AM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `engage-gbk`
--

-- --------------------------------------------------------

--
-- Table structure for table `user_custom_field`
--

CREATE TABLE `user_custom_field` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `venue_id` int(11) NOT NULL,
  `field_name` varchar(255) NOT NULL,
  `field_label` varchar(255) NOT NULL,
  `field_type` varchar(255) NOT NULL,
  `segment_name` varchar(255) NOT NULL,
  `search_name` varchar(255) NOT NULL,
  `field_unique_id` varchar(255) NOT NULL,
  `drop_down_values` longtext DEFAULT NULL,
  `is_multi_select` varchar(10) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `parent_id` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user_custom_field`
--
ALTER TABLE `user_custom_field`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user_custom_field`
--
ALTER TABLE `user_custom_field`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
