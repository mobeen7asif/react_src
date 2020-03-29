/*
SQLyog Community v13.1.5  (64 bit)
MySQL - 5.7.26-log : Database - wimpy_engage_darkwing_io
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `survey_answers` */

DROP TABLE IF EXISTS `survey_answers`;

CREATE TABLE `survey_answers` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `question_id` bigint(11) DEFAULT NULL,
  `answer` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `survey_question_answers` */

DROP TABLE IF EXISTS `survey_question_answers`;

CREATE TABLE `survey_question_answers` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) DEFAULT '0',
  `edit_id` bigint(11) NOT NULL,
  `json` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=200 DEFAULT CHARSET=latin1;

/*Table structure for table `surveys` */

DROP TABLE IF EXISTS `surveys`;

CREATE TABLE `surveys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `venue_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `surveys_front` */

DROP TABLE IF EXISTS `surveys_front`;

CREATE TABLE `surveys_front` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(220) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `json` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

/*Table structure for table `user_survey_answers` */

DROP TABLE IF EXISTS `user_survey_answers`;

CREATE TABLE `user_survey_answers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `survey_id` bigint(20) DEFAULT NULL,
  `question_id` bigint(20) DEFAULT NULL,
  `answer_id` bigint(4) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

insert  into `settings`(`id`,`company_id`,`type`,`field1`,`field2`,`field3`,`field4`,`remarks`,`created_at`,`updated_at`) values
(3,NULL,'venue_settings',NULL,'{\"from_pos\":true}',NULL,NULL,NULL,NULL,NULL),
(4,NULL,'configure_numbers','0',NULL,NULL,NULL,NULL,'2020-02-11 15:49:35','2020-02-17 11:20:35'),
(6,NULL,'voucher_code_length','9',NULL,NULL,NULL,NULL,NULL,'2020-02-18 05:45:38'),
(8,NULL,'billing_on_off','0','[]',NULL,NULL,NULL,'2020-02-18 10:28:21','2020-03-04 09:58:19'),
(9,NULL,'Demographic Criteria','segment','[{\"name\":\"allUsers\",\"show\":true,\"fieldName\":\"All Users\"},{\"name\":\"gender\",\"show\":true,\"fieldName\":\"Gender\"},{\"name\":\"date_of_birth\",\"show\":true,\"fieldName\":\"Age\"},{\"name\":\"birth_day\",\"show\":true,\"fieldName\":\"Birthday\"},{\"name\":\"postal_code\",\"show\":true,\"fieldName\":\"Postcode\"}]',NULL,NULL,NULL,NULL,'2020-03-10 10:41:57'),
(10,NULL,'Membership Criteria','segment','[{\"name\":\"creation_datetime\",\"show\":true,\"fieldName\":\"Membership Join Date\"},{\"name\":\"membership_number\",\"show\":true,\"fieldName\":\"Membership Number\"},{\"name\":\"last_login\",\"show\":true,\"fieldName\":\"Last Login\"},{\"name\":\"reffering_users\",\"show\":true,\"fieldName\":\"Referring user\"},{\"name\":\"reffered_user\",\"show\":true,\"fieldName\":\"Referred User\"},{\"name\":\"member_group\",\"show\":true,\"fieldName\":\"Member Group\"},{\"name\":\"user_source\",\"show\":true,\"fieldName\":\"Source\"},{\"name\":\"last_transaction\",\"show\":true,\"fieldName\":\"Last Transaction\"},{\"name\":\"total_spending\",\"show\":true,\"fieldName\":\"Total Spending\"},{\"name\":\"average_basket_value\",\"show\":true,\"fieldName\":\"Average Basket Value\"},{\"name\":\"spender_percentage\",\"show\":true,\"fieldName\":\"Spender (%)\"},{\"name\":\"user_activity\",\"show\":true,\"fieldName\":\"Activity\"},{\"name\":\"gap_map_users\",\"show\":true,\"fieldName\":\"Gap Map\"},{\"name\":\"enter_venue\",\"show\":true,\"fieldName\":\"Enter Site\"},{\"name\":\"default_venue\",\"show\":true,\"fieldName\":\"Default Site\"},{\"name\":\"member_group\",\"show\":true,\"fieldName\":\"Member Group\"},{\"name\":\"target_users\",\"show\":true,\"fieldName\":\"Target Users\"},{\"name\":\"user_region\",\"show\":true,\"fieldName\":\"User Region\"}]',NULL,NULL,NULL,NULL,'2020-03-10 05:53:27'),
(11,NULL,'Promotion Criteria','segment','[{\"name\":\"voucher_expiry\",\"show\":true,\"fieldName\":\"Voucher Expiry\"},{\"name\":\"voucher_status\",\"show\":true,\"fieldName\":\"Voucher Status\"},{\"name\":\"punch_card_status\",\"show\":true,\"fieldName\":\"Punch Card Status\"},{\"name\":\"token_not_used\",\"show\":true,\"fieldName\":\"Token Not Used\"},{\"name\":\"token_used_in_charity\",\"show\":true,\"fieldName\":\"Token Used in Charity\"},{\"name\":\"token_used\",\"show\":true,\"fieldName\":\"Token Used\"},{\"name\":\"completed_survey\",\"show\":true,\"fieldName\":\"Completed Survey\"},{\"name\":\"seen_videos\",\"show\":true,\"fieldName\":\"Seen Videos\"},{\"name\":\"campaign_triggers\",\"show\":true,\"fieldName\":\"Campaign Triggers\"}]',NULL,NULL,NULL,NULL,NULL),
(13,NULL,'Mission Criteria','segment','[{\"name\":\"scan_qr_code\",\"show\":true,\"fieldName\":\"Scan QR Code\"},{\"name\":\"user_sign_up\",\"show\":true,\"fieldName\":\"Sign Up\"},{\"name\":\"user_gps_detect\",\"show\":true,\"fieldName\":\"GPS\"},{\"name\":\"user_optional_field\",\"show\":true,\"fieldName\":\"Optional Fields Filling\"},{\"name\":\"transaction_amount\",\"show\":true,\"fieldName\":\"Transaction Amount\"},{\"name\":\"referral_user\",\"show\":true,\"fieldName\":\"Referred User\"}]',NULL,NULL,NULL,NULL,NULL);


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
