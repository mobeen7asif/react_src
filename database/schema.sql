/*
SQLyog Enterprise v12.4.1 (64 bit)
MySQL - 5.7.26-log : Database - gbk_engage_darkwing_io
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `acl_repositories` */

DROP TABLE IF EXISTS `acl_repositories`;

CREATE TABLE `acl_repositories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `repository_id` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `role_name` varchar(200) NOT NULL,
  `resource_name` varchar(200) NOT NULL,
  `type` varchar(200) NOT NULL,
  `role_type` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `all_images` */

DROP TABLE IF EXISTS `all_images`;

CREATE TABLE `all_images` (
  `image_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pos_code` int(11) DEFAULT NULL,
  `image_path` text COLLATE utf8mb4_unicode_ci,
  `image_type_id` int(11) DEFAULT NULL,
  `image_display_type` enum('front','bg') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_source_type` enum('category','store') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`image_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `app_settings` */

DROP TABLE IF EXISTS `app_settings`;

CREATE TABLE `app_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) DEFAULT NULL,
  `key` varchar(220) DEFAULT NULL,
  `value` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

/*Table structure for table `app_skinning` */

DROP TABLE IF EXISTS `app_skinning`;

CREATE TABLE `app_skinning` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `venue_id` int(11) NOT NULL,
  `skin_title` varchar(200) NOT NULL,
  `json` text NOT NULL,
  `status` varchar(8) NOT NULL,
  `skin_image` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `auto_checkout` */

DROP TABLE IF EXISTS `auto_checkout`;

CREATE TABLE `auto_checkout` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `business_id` int(11) DEFAULT NULL,
  `cart_discount` varchar(255) DEFAULT NULL,
  `cart_sku` varchar(255) DEFAULT NULL,
  `cate_id` int(11) DEFAULT NULL,
  `columns` varchar(255) DEFAULT NULL,
  `cstHospitalityCourseid` int(11) DEFAULT NULL,
  `custom_price_id` int(11) DEFAULT NULL,
  `dateadded` varchar(255) DEFAULT NULL,
  `discount_type` varchar(255) DEFAULT NULL,
  `discount_value` varchar(255) DEFAULT NULL,
  `discountable` varchar(255) DEFAULT NULL,
  `is_done_order` int(11) DEFAULT NULL,
  `live_order_id` int(11) DEFAULT NULL,
  `max_discount_amount` varchar(255) DEFAULT NULL,
  `max_discount_percentage` varchar(255) DEFAULT NULL,
  `modifier_ids` varchar(255) DEFAULT NULL,
  `modifiers_name` varchar(255) DEFAULT NULL,
  `prd_color` varchar(255) DEFAULT NULL,
  `prd_cost` varchar(255) DEFAULT NULL,
  `prd_description` text,
  `prd_id` int(11) DEFAULT NULL,
  `prd_image` varchar(255) DEFAULT NULL,
  `prd_modifier_cost` varchar(255) DEFAULT NULL,
  `prd_modifier_price` varchar(255) DEFAULT NULL,
  `prd_name` varchar(255) DEFAULT NULL,
  `prd_parent_id` int(11) DEFAULT NULL,
  `prd_parent_name` varchar(255) DEFAULT NULL,
  `prd_qty` int(11) DEFAULT NULL,
  `prd_trigger` int(11) DEFAULT NULL,
  `prd_type` varchar(255) DEFAULT NULL,
  `prd_unit_price` varchar(255) DEFAULT NULL,
  `product_array` text,
  `qty_onhand` varchar(255) DEFAULT NULL,
  `recom_order` int(11) DEFAULT NULL,
  `table_id` varchar(255) DEFAULT NULL,
  `taxable` varchar(255) DEFAULT NULL,
  `total_items_discount` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `variants` varchar(255) DEFAULT NULL,
  `vat_amount` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `productType` varchar(255) DEFAULT NULL,
  `bundleProductGroupId` varchar(255) DEFAULT NULL,
  `bundleProductIds` varchar(255) DEFAULT NULL,
  `bundleProductName` varchar(255) DEFAULT NULL,
  `bundleProductQty` varchar(255) DEFAULT NULL,
  `group_id` varchar(255) DEFAULT NULL,
  `group_id_single` varchar(255) DEFAULT NULL,
  `group_prd_discount` varchar(255) DEFAULT NULL,
  `group_disc_type` varchar(255) DEFAULT NULL,
  `group_name` varchar(255) DEFAULT NULL,
  `is_group_discount` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `auto_order_placement` */

DROP TABLE IF EXISTS `auto_order_placement`;

CREATE TABLE `auto_order_placement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `order_detail` text,
  `venue_id` int(11) DEFAULT NULL,
  `business_id` int(11) DEFAULT NULL,
  `operation_performed` enum('default','checkout','cancel','pos','auto_payment_done','auto_payment_failed','is_deleted','order_inprocess') DEFAULT 'default',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `beacon_configurations` */

DROP TABLE IF EXISTS `beacon_configurations`;

CREATE TABLE `beacon_configurations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venue_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `beacon_name` varchar(255) NOT NULL,
  `beacon_type` varchar(255) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `major` varchar(11) NOT NULL,
  `minor` varchar(11) NOT NULL,
  `x_coordinate` varchar(255) NOT NULL,
  `y_coordinate` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `campaign_logs` */

DROP TABLE IF EXISTS `campaign_logs`;

CREATE TABLE `campaign_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) DEFAULT NULL,
  `sent_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_CAMPAIGN_ID` (`campaign_id`),
  CONSTRAINT `FK_CAMPAIGN_ID` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `campaign_tags` */

DROP TABLE IF EXISTS `campaign_tags`;

CREATE TABLE `campaign_tags` (
  `tag_id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) NOT NULL,
  KEY `tag_id` (`tag_id`),
  KEY `FK_CAMPAIGN_TAG` (`campaign_id`),
  CONSTRAINT `FK_CAMPAIGN_TAG` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `campaigns` */

DROP TABLE IF EXISTS `campaigns`;

CREATE TABLE `campaigns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venue_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `type` int(5) DEFAULT NULL COMMENT '1: send_forget, 2: proximity, 3: standard',
  `name` varchar(200) DEFAULT NULL,
  `description` text,
  `target_segments` varchar(200) DEFAULT NULL,
  `target_type` varchar(155) DEFAULT NULL,
  `target_value` text,
  `action_type` varchar(100) DEFAULT NULL,
  `action_value` longtext,
  `send_cost` varchar(255) DEFAULT NULL,
  `reward_cost` varchar(255) DEFAULT NULL,
  `schedule_type` varchar(150) DEFAULT NULL,
  `schedule_value` text,
  `status` varchar(50) NOT NULL DEFAULT 'Draft' COMMENT '&#039;Active&#039;,&#039;Scheduled&#039;,&#039;Draft&#039;,&#039;Paused&#039;,&#039;Completed&#039;',
  `sent_date` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `tree_stucture` longtext,
  `is_queued` int(1) DEFAULT '0',
  `trigger_amount` varchar(220) DEFAULT NULL,
  `target_user` varchar(220) DEFAULT NULL,
  `send_email` varchar(220) DEFAULT NULL,
  `is_play` int(11) DEFAULT '1',
   `created_by` int(11) DEFAULT 0,
    `activated_by` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;

/*Table structure for table `category` */

DROP TABLE IF EXISTS `category`;

CREATE TABLE `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pos_code` int(11) DEFAULT NULL,
  `pos_category_id` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `store_id` bigint(20) DEFAULT NULL,
  `category_title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_description` text COLLATE utf8mb4_unicode_ci,
  `category_parent_id` int(11) DEFAULT '0',
  `author` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `category_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_priority` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `characters` */

DROP TABLE IF EXISTS `characters`;

CREATE TABLE `characters` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `unique_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `characters_user_scanned` */

DROP TABLE IF EXISTS `characters_user_scanned`;

CREATE TABLE `characters_user_scanned` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `game_id` int(11) DEFAULT NULL,
  `mission_id` int(10) unsigned NOT NULL,
  `character_id` int(10) unsigned NOT NULL,
  `unique_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `venue_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_USER_SCANNED` (`user_id`),
  KEY `FK_GAME_SCANNED` (`game_id`),
  KEY `FK_MISSION_SCANNED` (`mission_id`),
  KEY `FK_VENUE_SCANNED` (`venue_id`),
  KEY `FK_CHARATER_SCANNED` (`character_id`),
  CONSTRAINT `FK_CHARATER_SCANNED` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_GAME_SCANNED` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_MISSION_SCANNED` FOREIGN KEY (`mission_id`) REFERENCES `missions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_USER_SCANNED` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_VENUE_SCANNED` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `charity` */

DROP TABLE IF EXISTS `charity`;

CREATE TABLE `charity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venue_id` int(11) NOT NULL DEFAULT '0',
  `charity_name` varchar(255) NOT NULL,
  `charity_intro` text NOT NULL,
  `charity_desc` text NOT NULL,
  `contact_number` varchar(255) NOT NULL,
  `charity_email` varchar(255) NOT NULL,
  `charity_address` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `charity_tiers` */

DROP TABLE IF EXISTS `charity_tiers`;

CREATE TABLE `charity_tiers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tier_name` varchar(100) DEFAULT NULL,
  `tier_coins` int(11) NOT NULL DEFAULT '0',
  `venue_id` int(11) DEFAULT NULL,
  `budget` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `chefs` */

DROP TABLE IF EXISTS `chefs`;

CREATE TABLE `chefs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `descriptions` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `cms_levels` */

DROP TABLE IF EXISTS `cms_levels`;

CREATE TABLE `cms_levels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `company_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `cms_settings` */

DROP TABLE IF EXISTS `cms_settings`;

CREATE TABLE `cms_settings` (
  `setting_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  PRIMARY KEY (`setting_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `competition_user_entries` */

DROP TABLE IF EXISTS `competition_user_entries`;

CREATE TABLE `competition_user_entries` (
  `id` int(11) NOT NULL,
  `competition_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `in_draw` tinyint(4) DEFAULT NULL,
  `game_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `competitions` */

DROP TABLE IF EXISTS `competitions`;

CREATE TABLE `competitions` (
  `id` int(11) NOT NULL,
  `venue_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `prize` int(11) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_unique_entry` tinyint(4) NOT NULL,
  `is_executed` tinyint(4) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `credit_cards` */

DROP TABLE IF EXISTS `credit_cards`;

CREATE TABLE `credit_cards` (
  `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `card_type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `card_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `card_number` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `card_cvv` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `card_exp_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`card_id`),
  KEY `FK_USER_CARD` (`user_id`),
  CONSTRAINT `FK_USER_CARD` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `customers` */

DROP TABLE IF EXISTS `customers`;

CREATE TABLE `customers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line1` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line2` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `town` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postcode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `email_builder` */

DROP TABLE IF EXISTS `email_builder`;

CREATE TABLE `email_builder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `design` text,
  `html` text,
  `subject` varchar(45) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` int(11) NOT NULL DEFAULT '0',
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `tag_values` longtext NOT NULL,
  `created_at` varchar(45) DEFAULT NULL,
  `type` varchar(55) DEFAULT 'amplify',
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

/*Table structure for table `emails_templates` */

DROP TABLE IF EXISTS `emails_templates`;

CREATE TABLE `emails_templates` (
  `email_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email_subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email_from` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email_content` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `events` */

DROP TABLE IF EXISTS `events`;

CREATE TABLE `events` (
  `event_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text,
  `cost` varchar(100) DEFAULT NULL,
  `stall` varchar(100) DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `store_name` varchar(100) DEFAULT NULL,
  `store_logo` varchar(200) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `start_time` varchar(100) DEFAULT NULL,
  `end_time` varchar(100) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `image` varchar(200) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `faq_categories` */

DROP TABLE IF EXISTS `faq_categories`;

CREATE TABLE `faq_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `is_permanent` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

/*Table structure for table `favorite_products` */

DROP TABLE IF EXISTS `favorite_products`;

CREATE TABLE `favorite_products` (
  `favorite_product_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_at` int(11) NOT NULL,
  `updated_at` int(11) NOT NULL,
  PRIMARY KEY (`favorite_product_id`),
  KEY `FK_USER_FPRODUCTS` (`user_id`),
  CONSTRAINT `FK_USER_FPRODUCTS` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `favourite_news` */

DROP TABLE IF EXISTS `favourite_news`;

CREATE TABLE `favourite_news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `news_id` int(11) NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `company_id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `FK_USER_FAV_NEWS` (`user_id`),
  CONSTRAINT `FK_USER_FAV_NEWS` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `feedbacks` */

DROP TABLE IF EXISTS `feedbacks`;

CREATE TABLE `feedbacks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `notes` text,
  `user_id` int(11) DEFAULT NULL,
  `venue_id` int(11) DEFAULT NULL,
  `type` enum('app','shopping_mall','contact_us','feedback') DEFAULT 'feedback',
  `ratings` varchar(10) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `resturant` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `feedbacks` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=263 DEFAULT CHARSET=latin1;

/*Table structure for table `file_repositories` */

DROP TABLE IF EXISTS `file_repositories`;

CREATE TABLE `file_repositories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL DEFAULT '0',
  `venue_id` int(11) DEFAULT NULL,
  `company_id` int(11) NOT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `description` text,
  `path` varchar(250) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `repository_id` (`venue_id`),
  KEY `FK_USER_FILE_R` (`user_id`),
  CONSTRAINT `FK_USER_FILE_R` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `file_uploads` */

DROP TABLE IF EXISTS `file_uploads`;

CREATE TABLE `file_uploads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template_name` varchar(255) NOT NULL,
  `template_desc` text NOT NULL,
  `venue_id` int(11) NOT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `path` longtext,
  `content` longblob NOT NULL,
  `created_at` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Table structure for table `fuel_stations` */

DROP TABLE IF EXISTS `fuel_stations`;

CREATE TABLE `fuel_stations` (
  `fuel_station_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `venue_id` int(11) NOT NULL,
  `fuel_station_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fuel_station_image` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fuel_start_time` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fuel_end_time` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `contact_number` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `contact_person` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `external_static_ip` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fuel_station_desc` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fuel_station_address` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `fuel_station_lat_long` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pre_pay` tinyint(1) NOT NULL DEFAULT '0',
  `post_pay` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`fuel_station_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `game_user_entries` */

DROP TABLE IF EXISTS `game_user_entries`;

CREATE TABLE `game_user_entries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

/*Table structure for table `games` */

DROP TABLE IF EXISTS `games`;

CREATE TABLE `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `outcomes` longtext,
  `is_competition` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*Table structure for table `group_members` */

DROP TABLE IF EXISTS `group_members`;

CREATE TABLE `group_members` (
  `group_member_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updted_at` datetime NOT NULL,
  PRIMARY KEY (`group_member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `groups` */

DROP TABLE IF EXISTS `groups`;

CREATE TABLE `groups` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `group_name` varchar(255) NOT NULL,
  `group_description` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` int(11) NOT NULL DEFAULT '0',
  `updated_at` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*Table structure for table `gym_excluded_business` */

DROP TABLE IF EXISTS `gym_excluded_business`;

CREATE TABLE `gym_excluded_business` (
  `gym_id` int(11) DEFAULT NULL,
  `business_id` int(11) DEFAULT NULL,
  `business_name` varchar(255) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `gyms` */

DROP TABLE IF EXISTS `gyms`;

CREATE TABLE `gyms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `image_category` */

DROP TABLE IF EXISTS `image_category`;

CREATE TABLE `image_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `keys` */

DROP TABLE IF EXISTS `keys`;

CREATE TABLE `keys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(40) NOT NULL,
  `level` int(2) NOT NULL,
  `ignore_limits` tinyint(1) NOT NULL DEFAULT '0',
  `date_created` int(11) NOT NULL,
  `application_id` bigint(20) DEFAULT NULL,
  `platform` varchar(200) NOT NULL,
  `company_id` int(11) NOT NULL DEFAULT '18',
  `secret` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `knox_users` */

DROP TABLE IF EXISTS `knox_users`;

CREATE TABLE `knox_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `level_configurations` */

DROP TABLE IF EXISTS `level_configurations`;

CREATE TABLE `level_configurations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venue_id` int(11) NOT NULL,
  `venue_level` int(11) NOT NULL,
  `floor_number` varchar(255) NOT NULL,
  `floor_name` varchar(255) NOT NULL,
  `floor_plan` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `levels_venues` */

DROP TABLE IF EXISTS `levels_venues`;

CREATE TABLE `levels_venues` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level_id` varchar(200) NOT NULL,
  `venue_id` varchar(200) NOT NULL,
  `company_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

/*Table structure for table `loyalty_configurations` */

DROP TABLE IF EXISTS `loyalty_configurations`;

CREATE TABLE `loyalty_configurations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venue_id` int(11) DEFAULT NULL,
  `rate_grade_1` varchar(255) DEFAULT NULL,
  `rate_grade_2` varchar(255) DEFAULT NULL,
  `rate_grade_3` varchar(255) DEFAULT NULL,
  `rate_grade_4` varchar(255) DEFAULT NULL,
  `rate_grade_5` varchar(255) DEFAULT NULL,
  `rate_grade_6` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `lt_earn_velues` */

DROP TABLE IF EXISTS `lt_earn_velues`;

CREATE TABLE `lt_earn_velues` (
  `lt_earn_velue_id` int(11) NOT NULL AUTO_INCREMENT,
  `lt_point_id` int(11) NOT NULL,
  `price_value` varchar(255) NOT NULL,
  `points_velue` varchar(255) NOT NULL,
  PRIMARY KEY (`lt_earn_velue_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `lt_exp_points` */

DROP TABLE IF EXISTS `lt_exp_points`;

CREATE TABLE `lt_exp_points` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lt_point_id` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  `time_span` varchar(50) NOT NULL COMMENT 'Days,Weeks,Months,Years',
  `no_of_days` int(11) NOT NULL,
  `exp_percent` varchar(100) NOT NULL,
  `created_at` int(11) NOT NULL,
  `updated_at` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `lt_expiry_logs` */

DROP TABLE IF EXISTS `lt_expiry_logs`;

CREATE TABLE `lt_expiry_logs` (
  `lt_expiry_log_id` int(11) NOT NULL AUTO_INCREMENT,
  `lt_transation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lt_point_id` int(11) NOT NULL,
  `point_exp_id` int(11) NOT NULL,
  `total_points` int(11) NOT NULL,
  `expir_percent` int(11) NOT NULL,
  `wasted_points` int(11) NOT NULL,
  `remaining_points` int(11) NOT NULL,
  `redeemed_points` int(11) NOT NULL,
  `created_at` int(11) NOT NULL,
  `updated_at` int(11) NOT NULL,
  PRIMARY KEY (`lt_expiry_log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `lt_points` */

DROP TABLE IF EXISTS `lt_points`;

CREATE TABLE `lt_points` (
  `lt_point_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `venue_id` int(11) NOT NULL,
  `lt_point_title` varchar(255) NOT NULL,
  `lt_point_description` text NOT NULL,
  `lt_point_type` varchar(255) NOT NULL,
  `redeemable` int(11) NOT NULL DEFAULT '0',
  `transfarable` int(11) NOT NULL DEFAULT '0',
  `expairable` int(11) NOT NULL DEFAULT '0',
  `number` int(11) NOT NULL,
  `time_span` varchar(255) NOT NULL,
  `assigned_message` text,
  `redeemable_message` text,
  `expairable_message` text,
  `created_at` int(11) NOT NULL,
  `updated_at` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`lt_point_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `lt_redeem_values` */

DROP TABLE IF EXISTS `lt_redeem_values`;

CREATE TABLE `lt_redeem_values` (
  `lt_redeem_value_id` int(11) NOT NULL AUTO_INCREMENT,
  `lt_point_id` int(11) NOT NULL,
  `red_price_velue` varchar(255) NOT NULL,
  `red_point_velue` varchar(255) NOT NULL,
  PRIMARY KEY (`lt_redeem_value_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `lt_role` */

DROP TABLE IF EXISTS `lt_role`;

CREATE TABLE `lt_role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  `role_date_added` varchar(255) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*Table structure for table `lt_role_assign` */

DROP TABLE IF EXISTS `lt_role_assign`;

CREATE TABLE `lt_role_assign` (
  `role_asg_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `store_name` varchar(255) NOT NULL,
  PRIMARY KEY (`role_asg_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*Table structure for table `lt_rule_options` */

DROP TABLE IF EXISTS `lt_rule_options`;

CREATE TABLE `lt_rule_options` (
  `rule_option_id` int(11) NOT NULL AUTO_INCREMENT,
  `rule_id` int(11) NOT NULL,
  `opt_type` int(11) NOT NULL,
  `opt_tier` int(11) NOT NULL,
  `opt_qty_con` varchar(255) NOT NULL,
  `opt_qty` int(11) NOT NULL,
  `opt_tran_amt_con` varchar(255) NOT NULL,
  `opt_tran_amt` int(11) NOT NULL,
  `opt_tran_tot_con` varchar(255) NOT NULL,
  `opt_tran_tot` int(11) NOT NULL,
  PRIMARY KEY (`rule_option_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*Table structure for table `lt_rule_rewards` */

DROP TABLE IF EXISTS `lt_rule_rewards`;

CREATE TABLE `lt_rule_rewards` (
  `rule_reward_id` int(11) NOT NULL AUTO_INCREMENT,
  `rule_id` int(11) NOT NULL,
  `reward_type` int(11) NOT NULL COMMENT '1 for points 2 for tiers',
  `rule_point_id` int(11) NOT NULL,
  `rule_point_qty` int(11) NOT NULL,
  `rule_tier_id` int(11) NOT NULL,
  PRIMARY KEY (`rule_reward_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*Table structure for table `lt_rules` */

DROP TABLE IF EXISTS `lt_rules`;

CREATE TABLE `lt_rules` (
  `rule_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `rule_venue_id` int(11) NOT NULL,
  `store_id` varchar(255) NOT NULL,
  `category_id` varchar(255) NOT NULL,
  `rule_for` int(11) NOT NULL COMMENT '1 for category 2 for product 3 for store 4 for action',
  `rule_title` varchar(255) NOT NULL,
  `rule_description` text NOT NULL,
  `rule_tier_id` varchar(255) NOT NULL,
  `rule_product_id` varchar(255) NOT NULL,
  `rule_product_qty` int(11) NOT NULL,
  `rule_point_id` int(11) NOT NULL,
  `rule_point_qty` int(11) NOT NULL,
  `rule_start_date` varchar(255) NOT NULL,
  `rule_end_date` varchar(255) NOT NULL,
  `rule_type` int(11) NOT NULL COMMENT '1 for unlimited and 2 for limited',
  `rule_max_limit` int(11) NOT NULL,
  `transaction_type` int(11) NOT NULL COMMENT '1 for any amount 2 for greater then specific amount',
  `transaction_amount` decimal(10,0) NOT NULL,
  `rule_action` varchar(255) NOT NULL,
  `rule_status` int(11) NOT NULL DEFAULT '1',
  `rule_preference` int(11) NOT NULL,
  `rule_is_exclusive` int(11) NOT NULL,
  `rule_date_added` varchar(255) NOT NULL,
  PRIMARY KEY (`rule_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*Table structure for table `lt_store_earn_velues` */

DROP TABLE IF EXISTS `lt_store_earn_velues`;

CREATE TABLE `lt_store_earn_velues` (
  `lt_st_earn_velue_id` int(11) NOT NULL AUTO_INCREMENT,
  `lt_point_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `price_value` varchar(255) NOT NULL,
  `points_velue` varchar(255) NOT NULL,
  PRIMARY KEY (`lt_st_earn_velue_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `lt_store_managers` */

DROP TABLE IF EXISTS `lt_store_managers`;

CREATE TABLE `lt_store_managers` (
  `lt_store_manager_id` int(11) NOT NULL AUTO_INCREMENT,
  `venue_man_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `store_name` varchar(255) NOT NULL,
  `created_at` int(11) NOT NULL,
  `updated_at` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`lt_store_manager_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `lt_tier_rules` */

DROP TABLE IF EXISTS `lt_tier_rules`;

CREATE TABLE `lt_tier_rules` (
  `lt_tier_rule_id` int(11) NOT NULL AUTO_INCREMENT,
  `lt_tier_id` int(11) NOT NULL,
  `lt_point_id` int(11) NOT NULL,
  `min_value_points` int(11) NOT NULL,
  `lt_tier_relation` varchar(11) NOT NULL DEFAULT '0',
  `tier_status` int(11) NOT NULL DEFAULT '1',
  `fuel_discount` decimal(10,0) NOT NULL,
  PRIMARY KEY (`lt_tier_rule_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `lt_tiers` */

DROP TABLE IF EXISTS `lt_tiers`;

CREATE TABLE `lt_tiers` (
  `lt_tier_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `lt_tier_title` varchar(255) NOT NULL,
  `lt_tier_description` text NOT NULL,
  `is_demoteable` int(11) NOT NULL DEFAULT '0',
  `predecessor` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`lt_tier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `lt_transations` */

DROP TABLE IF EXISTS `lt_transations`;

CREATE TABLE `lt_transations` (
  `lt_transation_id` int(11) NOT NULL AUTO_INCREMENT,
  `soldi_id` int(11) DEFAULT NULL,
  `soldi_transaction_id` varchar(255) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `venue_id` int(11) DEFAULT NULL,
  `lt_rule_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `order_amount` decimal(10,2) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `point_id` int(11) DEFAULT NULL,
  `value_points` decimal(10,2) DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `product_id` varchar(255) DEFAULT NULL,
  `product_price` decimal(10,0) DEFAULT NULL,
  `product_qty` int(11) DEFAULT NULL,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  `rule_for` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  `type` varchar(255) DEFAULT NULL,
  `expired_points` double DEFAULT NULL,
  `redeemed_points` double DEFAULT NULL,
  `wasted_points` double DEFAULT NULL,
  `wi_code` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`lt_transation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `lt_user_tier` */

DROP TABLE IF EXISTS `lt_user_tier`;

CREATE TABLE `lt_user_tier` (
  `lt_user_tier_id` int(11) NOT NULL AUTO_INCREMENT,
  `tier_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `venue_id` int(11) NOT NULL,
  `user_points` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  PRIMARY KEY (`lt_user_tier_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*Table structure for table `member_transactions` */

DROP TABLE IF EXISTS `member_transactions`;

CREATE TABLE `member_transactions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `soldi_id` int(11) DEFAULT NULL,
  `transaction_id` varchar(1980) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `type` varchar(1980) DEFAULT NULL,
  `status` varchar(1980) DEFAULT NULL,
  `staff_member` varchar(1980) DEFAULT NULL,
  `tax` double DEFAULT NULL,
  `discount` varchar(1980) DEFAULT NULL,
  `number_of_items` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `business_name` varchar(1980) DEFAULT NULL,
  `refunded_items` text,
  `order_detail` longtext,
  `business_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `currency` varchar(220) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=749 DEFAULT CHARSET=latin1;

/*Table structure for table `merchant_stores` */

DROP TABLE IF EXISTS `merchant_stores`;

CREATE TABLE `merchant_stores` (
  `user_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `business_id` int(11) DEFAULT NULL,
  `business_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `migrations` */

DROP TABLE IF EXISTS `migrations`;

CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `mission_characters` */

DROP TABLE IF EXISTS `mission_characters`;

CREATE TABLE `mission_characters` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mission_id` int(10) unsigned NOT NULL,
  `character_id` int(10) unsigned NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `is_executed` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `mission_users_entries` */

DROP TABLE IF EXISTS `mission_users_entries`;

CREATE TABLE `mission_users_entries` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `mission_id` int(10) unsigned DEFAULT NULL,
  `game_id` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=543 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `mission_winners` */

DROP TABLE IF EXISTS `mission_winners`;

CREATE TABLE `mission_winners` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mission_id` int(10) unsigned DEFAULT NULL,
  `mission_character_id` int(10) unsigned DEFAULT NULL,
  `character_id` int(10) DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `draw_type` enum('small','big') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'small',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `missions` */

DROP TABLE IF EXISTS `missions`;

CREATE TABLE `missions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `game_id` int(11) DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `target_segments` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `outcomes` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `ne_application_apns_gcm` */

DROP TABLE IF EXISTS `ne_application_apns_gcm`;

CREATE TABLE `ne_application_apns_gcm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` varchar(255) DEFAULT NULL,
  `company_email` varchar(255) DEFAULT NULL,
  `application_name` text,
  `sns_app_name` text,
  `gcm_server_api_key` text,
  `apns_production_certificate_key` text,
  `apns_production_privateKey_key` text,
  `apns_sandbox_certificate_key` text,
  `apns_sandbox_privateKey_key` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Table structure for table `news` */

DROP TABLE IF EXISTS `news`;

CREATE TABLE `news` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT '1',
  `news_category_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `venue_id` int(11) DEFAULT NULL,
  `level_id` int(11) DEFAULT '1',
  `company_id` int(11) DEFAULT '0',
  `news_subject` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `news_desc` text COLLATE utf8_unicode_ci,
  `news_tag` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `news_image` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `news_image_gif` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `news_url` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `news_is_featured` int(11) DEFAULT NULL,
  `is_public` int(11) DEFAULT '0',
  `news_web_detail` text COLLATE utf8_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `news_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT '0',
  `video_link` text COLLATE utf8_unicode_ci,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `is_featured` int(11) DEFAULT '0',
  `is_global` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `news_news_category_id_foreign` (`news_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `news_categories` */

DROP TABLE IF EXISTS `news_categories`;

CREATE TABLE `news_categories` (
  `news_category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `news_category_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `news_category_image` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`news_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `notification_events` */

DROP TABLE IF EXISTS `notification_events`;

CREATE TABLE `notification_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) DEFAULT NULL,
  `campaign_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `timestamp` varchar(255) DEFAULT NULL,
  `event` varchar(255) DEFAULT NULL,
  `sg_event_id` varchar(255) DEFAULT NULL,
  `sg_message_id` varchar(255) DEFAULT NULL,
  `event_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;

/*Table structure for table `oauth_access_tokens` */

DROP TABLE IF EXISTS `oauth_access_tokens`;

CREATE TABLE `oauth_access_tokens` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `client_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_access_tokens_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `oauth_auth_codes` */

DROP TABLE IF EXISTS `oauth_auth_codes`;

CREATE TABLE `oauth_auth_codes` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `oauth_clients` */

DROP TABLE IF EXISTS `oauth_clients`;

CREATE TABLE `oauth_clients` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `secret` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `redirect` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `personal_access_client` tinyint(1) NOT NULL,
  `password_client` tinyint(1) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_clients_user_id_index` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `oauth_personal_access_clients` */

DROP TABLE IF EXISTS `oauth_personal_access_clients`;

CREATE TABLE `oauth_personal_access_clients` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_personal_access_clients_client_id_index` (`client_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `oauth_refresh_tokens` */

DROP TABLE IF EXISTS `oauth_refresh_tokens`;

CREATE TABLE `oauth_refresh_tokens` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `offer_categories` */

DROP TABLE IF EXISTS `offer_categories`;

CREATE TABLE `offer_categories` (
  `offer_category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `logo` varchar(200) NOT NULL,
  `created_by` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`offer_category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Table structure for table `offer_stats` */

DROP TABLE IF EXISTS `offer_stats`;

CREATE TABLE `offer_stats` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `offer_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `video_seen` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `offers` */

DROP TABLE IF EXISTS `offers`;

CREATE TABLE `offers` (
  `offer_id` int(11) NOT NULL AUTO_INCREMENT,
  `store_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text,
  `extended_description` text,
  `image` varchar(200) DEFAULT NULL,
  `barcode` varchar(100) DEFAULT NULL,
  `barcode_value` varchar(100) DEFAULT NULL,
  `is_redeemed` int(1) NOT NULL DEFAULT '0',
  `expire_date` date DEFAULT NULL,
  `voucher_id` varchar(100) DEFAULT NULL,
  `price` varchar(100) NOT NULL,
  `is_special` int(1) NOT NULL DEFAULT '0',
  `created_by` varchar(100) DEFAULT NULL,
  `third_party` int(1) NOT NULL DEFAULT '0',
  `third_party_url` varchar(200) DEFAULT NULL,
  `redeem_type` int(1) DEFAULT '0',
  `redeem_limit` varchar(100) DEFAULT NULL,
  `is_active` int(11) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`offer_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Table structure for table `option_sets` */

DROP TABLE IF EXISTS `option_sets`;

CREATE TABLE `option_sets` (
  `option_set_id` bigint(20) unsigned NOT NULL,
  `store_id` int(11) DEFAULT NULL,
  `pos_code` int(11) DEFAULT NULL,
  `pos_option_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `option_set_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `min_selection` int(11) DEFAULT '0',
  `max_selection` int(11) DEFAULT '0',
  `option_set_status` tinyint(4) DEFAULT NULL,
  `choose_opt_label` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`option_set_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `options` */

DROP TABLE IF EXISTS `options`;

CREATE TABLE `options` (
  `option_id` bigint(20) unsigned NOT NULL,
  `option_set_id` bigint(20) DEFAULT NULL,
  `pos_code` int(11) DEFAULT NULL,
  `option_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `option_price` decimal(10,2) DEFAULT NULL,
  `option_cost` decimal(10,2) DEFAULT '0.00',
  `option_sku` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`option_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `order_detail` */

DROP TABLE IF EXISTS `order_detail`;

CREATE TABLE `order_detail` (
  `order_detail_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `transaction_id` bigint(20) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT '0.00',
  `quantity` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`order_detail_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `orders` */

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `order_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) DEFAULT NULL,
  `payment_method_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_status` int(11) DEFAULT '0',
  `order_note` text COLLATE utf8mb4_unicode_ci,
  `order_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_amount` decimal(10,2) DEFAULT '0.00',
  `order_pin_location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_acknowledge` int(11) DEFAULT NULL,
  `ord_table` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `waiter_id` int(11) DEFAULT NULL,
  `device_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_model` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_points` int(11) DEFAULT NULL,
  `business_id` bigint(20) DEFAULT NULL,
  `currency` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `surcharges` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tax_label` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vat_amount` decimal(10,2) DEFAULT NULL,
  `items_discount` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_name` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `country_id` bigint(20) DEFAULT NULL,
  `is_soldi` tinyint(1) DEFAULT NULL,
  `change_due` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tip_amount` decimal(10,2) DEFAULT NULL,
  `invoice_no` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `points_amount` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `venue_id` int(11) DEFAULT NULL,
  `pos_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `pages` */

DROP TABLE IF EXISTS `pages`;

CREATE TABLE `pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `link` varchar(255) NOT NULL,
  `type` varchar(100) NOT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `faq_category_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT '1',
  `tags` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;

/*Table structure for table `password_resets` */

DROP TABLE IF EXISTS `password_resets`;

CREATE TABLE `password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `payment_method` */

DROP TABLE IF EXISTS `payment_method`;

CREATE TABLE `payment_method` (
  `pm_id` int(10) unsigned NOT NULL,
  `pm_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pm_ledger_code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`pm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `point_type` */

DROP TABLE IF EXISTS `point_type`;

CREATE TABLE `point_type` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `venue_id` int(11) DEFAULT NULL,
  `pt_id` int(11) DEFAULT NULL,
  `tracking_type_id` int(11) DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `period_type` int(11) DEFAULT NULL,
  `aging_periods` int(11) DEFAULT NULL,
  `first_period` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `one_monetary_unit` double DEFAULT NULL,
  `system` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `pos` */

DROP TABLE IF EXISTS `pos`;

CREATE TABLE `pos` (
  `id` int(10) unsigned NOT NULL,
  `pos_title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pos_description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `pos_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `pos_mapper` */

DROP TABLE IF EXISTS `pos_mapper`;

CREATE TABLE `pos_mapper` (
  `id` int(10) unsigned NOT NULL,
  `pos_id` int(11) NOT NULL,
  `service_code` int(11) NOT NULL,
  `service_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `table_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fields` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `product` */

DROP TABLE IF EXISTS `product`;

CREATE TABLE `product` (
  `product_id` bigint(20) unsigned NOT NULL,
  `pos_code` int(11) DEFAULT NULL,
  `pos_product_id` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT '0',
  `product_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_description` text COLLATE utf8mb4_unicode_ci,
  `short_description` text COLLATE utf8mb4_unicode_ci,
  `product_price` double(10,2) DEFAULT '0.00',
  `product_stock` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `product_code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `board_cate_id` int(11) DEFAULT '0',
  `product_cost` decimal(10,2) DEFAULT '0.00',
  `taxable` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `max_discount_percentage` decimal(10,2) DEFAULT '0.00',
  `max_discount_amount` decimal(10,2) DEFAULT '0.00',
  `discountable` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recom_order` int(11) DEFAULT '0',
  `product_trigger` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_sku` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_variants` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_columns` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_priority` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `point_type_id` int(11) NOT NULL,
  `point_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `point_value` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `product_category` */

DROP TABLE IF EXISTS `product_category`;

CREATE TABLE `product_category` (
  `prod_cat_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`prod_cat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `product_images` */

DROP TABLE IF EXISTS `product_images`;

CREATE TABLE `product_images` (
  `product_image_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `pos_code` int(11) DEFAULT NULL,
  `image_path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`product_image_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `product_option_set` */

DROP TABLE IF EXISTS `product_option_set`;

CREATE TABLE `product_option_set` (
  `product_option_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `option_set_id` bigint(20) DEFAULT NULL,
  `pos_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`product_option_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `product_promotion` */

DROP TABLE IF EXISTS `product_promotion`;

CREATE TABLE `product_promotion` (
  `pp_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `promotion_id` bigint(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`pp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `product_variant` */

DROP TABLE IF EXISTS `product_variant`;

CREATE TABLE `product_variant` (
  `pv_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `variant_id` bigint(20) DEFAULT NULL,
  `pos_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`pv_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `promotion` */

DROP TABLE IF EXISTS `promotion`;

CREATE TABLE `promotion` (
  `promotion_id` bigint(20) unsigned NOT NULL,
  `promotion_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `promotion_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `promotion_amount` decimal(10,2) DEFAULT '0.00',
  `promotion_value` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`promotion_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `punch_cards` */

DROP TABLE IF EXISTS `punch_cards`;

CREATE TABLE `punch_cards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `card_color` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT '0',
  `business_id` int(11) unsigned DEFAULT NULL,
  `business_name` varchar(255) DEFAULT NULL,
  `business_images` text,
  `venue_id` int(11) DEFAULT NULL,
  `category_name` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `rule_on` enum('product','category') DEFAULT 'product',
  `product_image` varchar(255) DEFAULT NULL,
  `redemption_type` varchar(120) DEFAULT NULL,
  `frequency` varchar(50) DEFAULT NULL,
  `condition` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `transaction_threshold` varchar(20) DEFAULT NULL,
  `group_name` varchar(255) DEFAULT NULL,
  `businesses` text,
  `company_id` int(11) DEFAULT NULL,
  `voucher_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`,`updated_at`),
  FULLTEXT KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Table structure for table `quick_board_level` */

DROP TABLE IF EXISTS `quick_board_level`;

CREATE TABLE `quick_board_level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level_name` varchar(255) NOT NULL,
  `level_order` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `quick_board_news` */

DROP TABLE IF EXISTS `quick_board_news`;

CREATE TABLE `quick_board_news` (
  `board_id` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL,
  `type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `quick_boards` */

DROP TABLE IF EXISTS `quick_boards`;

CREATE TABLE `quick_boards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `board_title` varchar(255) NOT NULL,
  `background_image` varchar(255) DEFAULT NULL,
  `icon_image` varchar(255) DEFAULT NULL,
  `color1` varchar(255) DEFAULT '#003A5D',
  `color2` varchar(255) DEFAULT '#0A62A3',
  `color3` varchar(255) DEFAULT '#00C1DE',
  `display_order` int(11) NOT NULL DEFAULT '1',
  `board_level` int(11) DEFAULT NULL,
  `qb_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `quickboard_venue_shop` */

DROP TABLE IF EXISTS `quickboard_venue_shop`;

CREATE TABLE `quickboard_venue_shop` (
  `qb_id` int(11) NOT NULL,
  `venue_id` int(11) DEFAULT NULL,
  `shop_id` int(11) DEFAULT NULL,
  `shop_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `ratings` */

DROP TABLE IF EXISTS `ratings`;

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `venue_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `rate_value` decimal(10,1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `receipts` */

DROP TABLE IF EXISTS `receipts`;

CREATE TABLE `receipts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `business_id` int(11) DEFAULT NULL,
  `venue_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `business_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `receipt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receipt_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `recipe_category` */

DROP TABLE IF EXISTS `recipe_category`;

CREATE TABLE `recipe_category` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `recipe_ingredients` */

DROP TABLE IF EXISTS `recipe_ingredients`;

CREATE TABLE `recipe_ingredients` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `recipe_id` int(11) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `recipe_offers` */

DROP TABLE IF EXISTS `recipe_offers`;

CREATE TABLE `recipe_offers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `recipe_id` int(10) DEFAULT NULL,
  `location` text COLLATE utf8mb4_unicode_ci,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('recipe','global') COLLATE utf8mb4_unicode_ci DEFAULT 'global',
  `priority` int(11) DEFAULT '3',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `display_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'global',
  `video_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `recipe_preparation` */

DROP TABLE IF EXISTS `recipe_preparation`;

CREATE TABLE `recipe_preparation` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `recipe_id` int(11) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `recipe_reviews` */

DROP TABLE IF EXISTS `recipe_reviews`;

CREATE TABLE `recipe_reviews` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `rating` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `recipe_tags` */

DROP TABLE IF EXISTS `recipe_tags`;

CREATE TABLE `recipe_tags` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `recipe_id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `recipes` */

DROP TABLE IF EXISTS `recipes`;

CREATE TABLE `recipes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `chef_id` int(11) DEFAULT '0',
  `recipe_category_id` int(11) DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `prep_time` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cook_time` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serving` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_featured` int(11) NOT NULL DEFAULT '0',
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `repositories` */

DROP TABLE IF EXISTS `repositories`;

CREATE TABLE `repositories` (
  `repository_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `repository_title` varchar(200) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `size` varchar(255) DEFAULT NULL,
  `owner` varchar(200) NOT NULL,
  `is_public` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`repository_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `role_assigns` */

DROP TABLE IF EXISTS `role_assigns`;

CREATE TABLE `role_assigns` (
  `role_assign_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`role_assign_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `role_level_users` */

DROP TABLE IF EXISTS `role_level_users`;

CREATE TABLE `role_level_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `roles` */

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `level` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `roles_acls` */

DROP TABLE IF EXISTS `roles_acls`;

CREATE TABLE `roles_acls` (
  `id` int(11) NOT NULL,
  `news_id` int(11) DEFAULT '0',
  `user_id` int(11) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `role_name` varchar(200) NOT NULL,
  `resource_name` varchar(200) DEFAULT NULL,
  `owner_name` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `role_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `segment` */

DROP TABLE IF EXISTS `segment`;

CREATE TABLE `segment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `venue_id` int(11) NOT NULL,
  `type` varchar(50) DEFAULT 'Venue' COMMENT '1: Venue, 2: Global, 3: Segment Template',
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `query` text,
  `query_parameters` text,
  `excluded_user` text,
  `included_user` text,
  `persona` int(11) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL COMMENT '0: for not part of campaign 1: for part of any campaign',
  `is_hidden` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=210 DEFAULT CHARSET=utf8;

/*Table structure for table `services` */

DROP TABLE IF EXISTS `services`;

CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `settings` */

DROP TABLE IF EXISTS `settings`;

CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `field1` varchar(255) DEFAULT NULL,
  `field2` text,
  `field3` text,
  `field4` varchar(255) DEFAULT NULL,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

/*Table structure for table `sp_transations` */

DROP TABLE IF EXISTS `sp_transations`;

CREATE TABLE `sp_transations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `ord_id` int(11) NOT NULL,
  `venue_id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `ord_date` date NOT NULL,
  `ord_amount` decimal(10,0) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `stamps_completed` */

DROP TABLE IF EXISTS `stamps_completed`;

CREATE TABLE `stamps_completed` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `punch_id` int(11) DEFAULT NULL,
  `completed` double DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;

/*Table structure for table `storages` */

DROP TABLE IF EXISTS `storages`;

CREATE TABLE `storages` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `size` varchar(200) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `store` */

DROP TABLE IF EXISTS `store`;

CREATE TABLE `store` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pos_store_id` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pos_code` int(11) DEFAULT NULL,
  `venue_id` int(11) DEFAULT '0',
  `store_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `store_phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `store_email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `store_website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `store_contact` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `store_address` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `store_owner` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `store_account_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `store_detail` text COLLATE utf8mb4_unicode_ci,
  `store_detail_info` text COLLATE utf8mb4_unicode_ci,
  `store_api_key` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `store_api_secret` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pos_user_id` bigint(20) DEFAULT '0',
  `soldi_api_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `soldi_secret` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=211 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `store_images` */

DROP TABLE IF EXISTS `store_images`;

CREATE TABLE `store_images` (
  `id` int(11) NOT NULL,
  `store_image` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `store_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `store_information` */

DROP TABLE IF EXISTS `store_information`;

CREATE TABLE `store_information` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `coords1` text NOT NULL,
  `store_id` int(11) NOT NULL,
  `store_name` varchar(255) NOT NULL,
  `venue_id` int(11) NOT NULL,
  `stall_no` varchar(255) NOT NULL,
  `store_map` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `store_products` */

DROP TABLE IF EXISTS `store_products`;

CREATE TABLE `store_products` (
  `id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `store_settings` */

DROP TABLE IF EXISTS `store_settings`;

CREATE TABLE `store_settings` (
  `store_setting_id` int(10) unsigned NOT NULL,
  `store_id` int(11) DEFAULT NULL,
  `pos_code` int(11) DEFAULT NULL,
  `licence_fee` decimal(10,2) DEFAULT NULL,
  `card_price` decimal(10,2) DEFAULT NULL,
  `language` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `currency` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_format` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `number_format` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tax_type` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_type` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tip_enable` tinyint(4) DEFAULT NULL,
  `tax_value` decimal(10,2) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `currency_multiple` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ticket_time` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `near_ticket_time` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `surcharge_value` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `surcharge_type` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `minimum_spend` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_ewallet` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`store_setting_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `swift_country` */

DROP TABLE IF EXISTS `swift_country`;

CREATE TABLE `swift_country` (
  `id` int(11) NOT NULL,
  `pos_country_id` int(11) DEFAULT NULL,
  `pos_code` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(100) DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `swift_family` */

DROP TABLE IF EXISTS `swift_family`;

CREATE TABLE `swift_family` (
  `id` int(11) NOT NULL,
  `pos_family_id` int(11) DEFAULT NULL,
  `pos_code` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `swift_group` */

DROP TABLE IF EXISTS `swift_group`;

CREATE TABLE `swift_group` (
  `id` int(11) NOT NULL,
  `pos_group_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `pos_code` int(11) DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `swift_media` */

DROP TABLE IF EXISTS `swift_media`;

CREATE TABLE `swift_media` (
  `id` int(11) NOT NULL,
  `pos_media_id` int(11) DEFAULT NULL,
  `pos_code` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `tags` */

DROP TABLE IF EXISTS `tags`;

CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `transaction` */

DROP TABLE IF EXISTS `transaction`;

CREATE TABLE `transaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `pump_id` int(11) NOT NULL,
  `card_number` varchar(100) NOT NULL,
  `price` varchar(100) NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `refund_price` varchar(100) NOT NULL DEFAULT '0',
  `cents_per_litre` decimal(10,2) NOT NULL COMMENT 'This is per liter discount',
  `quantity` varchar(100) NOT NULL,
  `product_type` varchar(100) NOT NULL DEFAULT '0',
  `grade_number` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `eway_transaction_id` varchar(100) NOT NULL,
  `loyalty_transaction_id` int(11) NOT NULL,
  `tran_log_id` int(11) NOT NULL,
  `first_visit_discount_status` int(11) NOT NULL,
  `first_visit_discount_amount` int(11) NOT NULL,
  `user_rating` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Table structure for table `user_account_details` */

DROP TABLE IF EXISTS `user_account_details`;

CREATE TABLE `user_account_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `coins` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` enum('user','organisation','redeemed') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `user_cards` */

DROP TABLE IF EXISTS `user_cards`;

CREATE TABLE `user_cards` (
  `card_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `card_no` text CHARACTER SET latin1 NOT NULL,
  `last_digit` varchar(255) CHARACTER SET latin1 NOT NULL,
  `card_name` varchar(255) NOT NULL,
  `expiry_month` varchar(20) DEFAULT NULL,
  `expiry_year` int(11) DEFAULT NULL,
  `cvv` text CHARACTER SET latin1 NOT NULL,
  `is_default` int(11) NOT NULL DEFAULT '0',
  `card_type` varchar(255) CHARACTER SET latin1 NOT NULL,
  `transactionid` text,
  `is_test_card` int(11) NOT NULL DEFAULT '0',
  `expiry` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `card_number` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`card_id`)
) ENGINE=InnoDB AUTO_INCREMENT=869 DEFAULT CHARSET=utf8;

/*Table structure for table `user_charity_coins` */

DROP TABLE IF EXISTS `user_charity_coins`;

CREATE TABLE `user_charity_coins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `store_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `charity_id` int(11) DEFAULT NULL,
  `venue_id` int(11) DEFAULT NULL,
  `coins` int(1) DEFAULT NULL,
  `status` enum('user','redeemed','organization') NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `user_dependents` */

DROP TABLE IF EXISTS `user_dependents`;

CREATE TABLE `user_dependents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `user_entered_venue_logs` */

DROP TABLE IF EXISTS `user_entered_venue_logs`;

CREATE TABLE `user_entered_venue_logs` (
  `id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `venue_id` int(11) DEFAULT NULL,
  `enter_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `user_loyalty_points` */

DROP TABLE IF EXISTS `user_loyalty_points`;

CREATE TABLE `user_loyalty_points` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `point_amount` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `voucher_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `user_redeemed_offers` */

DROP TABLE IF EXISTS `user_redeemed_offers`;

CREATE TABLE `user_redeemed_offers` (
  `user_redeemed_offer_id` int(11) NOT NULL AUTO_INCREMENT,
  `offer_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `unique_id` varchar(100) DEFAULT NULL,
  `user_email` varchar(100) NOT NULL,
  `store_id` int(11) DEFAULT NULL,
  `store_name` varchar(200) DEFAULT NULL,
  `email_sent` int(1) DEFAULT '0',
  `is_redeemed` int(1) DEFAULT '0',
  `no_of_clicks` varchar(100) DEFAULT '0',
  `no_time_voucher_redeem` varchar(100) DEFAULT '0',
  `remaining_redemptions` varchar(100) DEFAULT NULL,
  `remaining_redemptions_user` varchar(100) DEFAULT NULL,
  `third_party` int(1) DEFAULT '0',
  `barcode` varchar(200) DEFAULT NULL,
  `barcode_value` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_redeemed_offer_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Table structure for table `user_stamps` */

DROP TABLE IF EXISTS `user_stamps`;

CREATE TABLE `user_stamps` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `punch_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `company_id` int(11) DEFAULT '0',
  `venue_id` int(11) DEFAULT '0',
  `credit` double DEFAULT '0',
  `debit` double DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=latin1;

/*Table structure for table `user_temp_payments` */

DROP TABLE IF EXISTS `user_temp_payments`;

CREATE TABLE `user_temp_payments` (
  `invoice_id` varchar(500) NOT NULL,
  `user_id` varchar(500) DEFAULT NULL,
  `finale_payment` longtext,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `payment_id` varchar(500) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `user_venue_relation` */

DROP TABLE IF EXISTS `user_venue_relation`;

CREATE TABLE `user_venue_relation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `venue_id` bigint(20) DEFAULT NULL,
  `date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

/*Table structure for table `user_vouchers` */

DROP TABLE IF EXISTS `user_vouchers`;

CREATE TABLE `user_vouchers` (
  `id` int(11) NOT NULL,
  `voucher_id` varchar(255) NOT NULL,
  `voucher_type` varchar(255) NOT NULL,
  `campaign_id` varchar(255) NOT NULL,
  `patron_id` varchar(255) NOT NULL,
  `campaign_batch_number` varchar(255) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `venue_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `barcode_image` varchar(100) NOT NULL,
  `expiry_date` datetime NOT NULL,
  `redemption_date` datetime NOT NULL,
  `pos` varchar(100) NOT NULL,
  `payment_method` varchar(100) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `amp_user_id` int(11) DEFAULT 0,
  `company_id` int(11) DEFAULT NULL,
  `soldi_id` int(11) DEFAULT NULL,
  `user_first_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_family_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_mobile` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `gender` varchar(55) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `postal_code` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_is_active` int(11) DEFAULT NULL,
  `user_indentity_code` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_avatar` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `qr_code` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_loyalty_number` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_active` int(11) DEFAULT 0,
  `activation_token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `swift_pos_id` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `expiry_time` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_type` enum('web','app') COLLATE utf8_unicode_ci DEFAULT 'app',
  `knox_user_id` int(11) DEFAULT NULL,
  `company_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `address2` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `street_number` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `street_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `suburb` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `default_venue` int(11) DEFAULT NULL,
  `city` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `referral_code` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `referal_by` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `state` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `debug_mod` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `device_token` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `device_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_loggedin` tinyint(1) DEFAULT NULL,
  `subscribed_venues` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_merchant` tinyint(1) DEFAULT 0,
  `is_completed` tinyint(1) DEFAULT 0,
  `user_favourites` longtext COLLATE utf8_unicode_ci DEFAULT NULL,
  `waitron_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `referred_waitron` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_waitron` tinyint(1) DEFAULT 0,
  `is_email` tinyint(1) DEFAULT NULL,
  `store_data` tinyint(1) DEFAULT 0,
  `food_preference` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `currency` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `region_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `company_info` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_lat` double DEFAULT 0,
  `user_long` double DEFAULT 0,
  `basket_value` double DEFAULT 0,
  `basket_size` double DEFAULT 0,
  `avg_basket_value` double DEFAULT 0,
  `avg_basket_size` double DEFAULT 0,
  `number_of_transactions` int(11) DEFAULT 0,
  `kill_bill_id` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `client_customer_id` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `client_employee_no` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `old_user` tinyint(1) DEFAULT 0,
  `kilbill_ire_id` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `groups` text COLLATE utf8_unicode_ci DEFAULT '["Member"]',
  `custom_fields` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_notifications` varchar(500) COLLATE utf8_unicode_ci DEFAULT '{"is_pointme_user":true,"email_subscribed_flag":true,"sms_subscribed_flag":true,"is_pointme_notifications":true,"mail_subscribed_flag":true}',
  `store_name` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `users_email_is_active` (`email`,`is_active`),
  KEY `users_user_mobile_is_active` (`user_mobile`,`is_active`),
  KEY `users_email` (`email`),
  KEY `users_user_mobile` (`user_mobile`),
  KEY `users_is_active` (`is_active`),
  KEY `users_postal_code` (`postal_code`),
  KEY `users_store_name` (`store_name`)
) ENGINE=InnoDB AUTO_INCREMENT=368 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci

/*Table structure for table `variant` */

DROP TABLE IF EXISTS `variant`;

CREATE TABLE `variant` (
  `variant_id` bigint(20) unsigned NOT NULL,
  `pos_variant_id` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pos_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` int(11) DEFAULT '0',
  `variant_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variant_description` text COLLATE utf8mb4_unicode_ci,
  `variant_price` double(10,2) DEFAULT '0.00',
  `display_priority` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variant_sku` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variant_trigger` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recom_order` int(11) DEFAULT '0',
  `discountable` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `max_discount_amount` decimal(10,2) DEFAULT '0.00',
  `max_discount_percentage` decimal(10,2) DEFAULT '0.00',
  `taxable` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variant_cost` decimal(10,2) DEFAULT '0.00',
  `board_cate_id` int(11) DEFAULT '0',
  `variant_columns` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variant_variants` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variant_color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qty_onhand` int(11) DEFAULT '0',
  `variant_img` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variant_code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`variant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Table structure for table `venue_app_skin` */

DROP TABLE IF EXISTS `venue_app_skin`;

CREATE TABLE `venue_app_skin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `venue_id` int(11) NOT NULL,
  `skin_title` varchar(200) NOT NULL,
  `json` text NOT NULL,
  `status` varchar(8) NOT NULL,
  `skin_image` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `venue_campaign_saturation` */

DROP TABLE IF EXISTS `venue_campaign_saturation`;

CREATE TABLE `venue_campaign_saturation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venue_id` int(11) NOT NULL,
  `saturation_alerts` varchar(255) NOT NULL,
  `saturation_block` varchar(255) NOT NULL,
  `contact_perioud_start_sms` varchar(255) NOT NULL,
  `contact_perioud_end_sms` varchar(255) NOT NULL,
  `contact_perioud_start_point_me` varchar(255) NOT NULL,
  `contact_perioud_end_point_me` varchar(255) NOT NULL,
  `compaing_satu_alerts` varchar(255) NOT NULL,
  `compaing_satu_block` varchar(255) NOT NULL,
  `rewards` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

/*Table structure for table `venue_cat_details` */

DROP TABLE IF EXISTS `venue_cat_details`;

CREATE TABLE `venue_cat_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `venue_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `venue_categories` */

DROP TABLE IF EXISTS `venue_categories`;

CREATE TABLE `venue_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `category_shops` longtext,
  `image` text,
  `company_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

/*Table structure for table `venue_category` */

DROP TABLE IF EXISTS `venue_category`;

CREATE TABLE `venue_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venue_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

/*Table structure for table `venue_category_shops` */

DROP TABLE IF EXISTS `venue_category_shops`;

CREATE TABLE `venue_category_shops` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `shop_id` int(11) NOT NULL,
  `shop_name` varchar(255) NOT NULL,
  `api_key` varchar(255) DEFAULT NULL,
  `api_secret` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=211 DEFAULT CHARSET=latin1;

/*Table structure for table `venue_configurations_test_alerts` */

DROP TABLE IF EXISTS `venue_configurations_test_alerts`;

CREATE TABLE `venue_configurations_test_alerts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venue_id` int(11) DEFAULT NULL,
  `reporting_email` varchar(255) DEFAULT NULL,
  `recipient_email` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `application_recipient` varchar(255) DEFAULT NULL,
  `mimimum_recipient_warning` varchar(255) DEFAULT NULL,
  `maximum_recipient_warning` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Table structure for table `venue_details_flag` */

DROP TABLE IF EXISTS `venue_details_flag`;

CREATE TABLE `venue_details_flag` (
  `id` int(11) NOT NULL,
  `venue_image_flag` int(11) NOT NULL,
  `venue_address_flag` int(11) NOT NULL,
  `venue_map_flag` int(11) NOT NULL,
  `venue_trading_hours_falg` int(11) NOT NULL,
  `venue_phone_flag` int(11) NOT NULL,
  `venue_website_flag` int(11) NOT NULL,
  `venue_information_flag` int(11) NOT NULL,
  `venue_id` int(11) NOT NULL,
  `created_at` date NOT NULL,
  `updatred_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `venue_image` */

DROP TABLE IF EXISTS `venue_image`;

CREATE TABLE `venue_image` (
  `venue_image_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `venue_id` int(11) NOT NULL,
  `image` varchar(500) NOT NULL,
  `color` varchar(255) NOT NULL,
  `pay_with_points` int(11) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`venue_image_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `venue_operating_hours` */

DROP TABLE IF EXISTS `venue_operating_hours`;

CREATE TABLE `venue_operating_hours` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venue_id` int(11) NOT NULL,
  `is_open` int(11) NOT NULL,
  `days` varchar(255) NOT NULL,
  `start_time` varchar(255) NOT NULL,
  `end_time` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=latin1;

/*Table structure for table `venue_resources` */

DROP TABLE IF EXISTS `venue_resources`;

CREATE TABLE `venue_resources` (
  `venue_id` varchar(255) NOT NULL,
  `resource_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `venue_shops` */

DROP TABLE IF EXISTS `venue_shops`;

CREATE TABLE `venue_shops` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venue_id` int(11) NOT NULL,
  `shop_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `venue_storages` */

DROP TABLE IF EXISTS `venue_storages`;

CREATE TABLE `venue_storages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `venue_repo_size` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `venue_subscriptions` */

DROP TABLE IF EXISTS `venue_subscriptions`;

CREATE TABLE `venue_subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `membership_id` varchar(255) NOT NULL,
  `persona_id` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `venue_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `venues` */

DROP TABLE IF EXISTS `venues`;

CREATE TABLE `venues` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) DEFAULT NULL,
  `venue_id` int(11) DEFAULT NULL,
  `venue_shops` longtext COLLATE utf8_unicode_ci,
  `store_news_id` int(11) DEFAULT '518',
  `user_id` bigint(20) DEFAULT NULL,
  `store_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `venue_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `licenceNumber` int(11) DEFAULT NULL,
  `premises` int(11) DEFAULT NULL,
  `address` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `locality` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `stateProvince` varchar(255) COLLATE utf8_unicode_ci DEFAULT 'Unknown',
  `country` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `postalCode` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contactName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `telephone` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `facsimile` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `additional_information` text COLLATE utf8_unicode_ci,
  `pager` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `mobile` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `system` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `facebook_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `twitter_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `instagram_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `snapchat_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sms_sender_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pointme_sender_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email_sender_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `venue_description` text COLLATE utf8_unicode_ci,
  `venue_latitude` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `venue_longitude` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `venue_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `is_onBoard` int(11) DEFAULT '0',
  `app_color` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '#fff',
  `auto_checkout` tinyint(1) NOT NULL DEFAULT '0',
  `beacon_condition` tinyint(1) NOT NULL DEFAULT '0',
  `minutes_condition` tinyint(1) NOT NULL DEFAULT '0',
  `beacon_area` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `beacon_listining` tinyint(1) NOT NULL DEFAULT '0',
  `beacon_minutes` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `image` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ibs` tinyint(1) DEFAULT '0',
  `is_integrated` tinyint(1) DEFAULT '0',
  `custom_fields` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `voucher_logs` */

DROP TABLE IF EXISTS `voucher_logs`;

CREATE TABLE `voucher_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `voucher_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `voucher_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=latin1;

/*Table structure for table `voucher_users` */

DROP TABLE IF EXISTS `voucher_users`;

CREATE TABLE `voucher_users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `voucher_code` varchar(255) DEFAULT NULL,
  `voucher_start_date` datetime DEFAULT NULL,
  `voucher_end_date` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `voucher_id` int(11) DEFAULT NULL,
  `uses_remaining` double DEFAULT '0',
  `no_of_uses` double DEFAULT '0',
  `punch_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `voucher_code_2` (`voucher_code`),
  FULLTEXT KEY `voucher_code` (`voucher_code`)
) ENGINE=InnoDB AUTO_INCREMENT=216588 DEFAULT CHARSET=latin1;

/*Table structure for table `vouchers` */

DROP TABLE IF EXISTS `vouchers`;

CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `discount_type` varchar(255) DEFAULT NULL,
  `basket_level` tinyint(1) DEFAULT '0',
  `isNumberOfDays` varchar(255) DEFAULT NULL,
  `promotion_text` text,
  `no_of_uses` varchar(255) DEFAULT NULL,
  `business` longtext,
  `voucher_avial_data` longtext,
  `tree_structure` longtext,
  `image` longtext,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `pos_ibs` varchar(55) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `voucher_type` varchar(55) DEFAULT 'integrated',
  `company_id` int(11) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `target_user` varchar(55) DEFAULT 'new',
  `quantity` double DEFAULT '0',
  `category` varchar(100) DEFAULT 'Goroup Voucher',
  `group_id` int(11) DEFAULT '0',
  `billingStatus` int(11) DEFAULT '0',
  `billingType` varchar(255) DEFAULT NULL,
  `billingFields` longtext,
  `voucherFactor` varchar(255) DEFAULT NULL,
  `redemption_rule` varchar(55) DEFAULT 'Standard',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=latin1;

/*Table structure for table `youtube_videos` */

DROP TABLE IF EXISTS `youtube_videos`;

CREATE TABLE `youtube_videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venue_id` int(11) NOT NULL DEFAULT '0',
  `title` varchar(255) NOT NULL,
  `descriptions` varchar(255) NOT NULL,
  `video_link` text NOT NULL,
  `display_order` int(11) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


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

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;


/* Trigger structure for table `users` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `ensure_users_uniqueness_on_insert` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'gbk_engage_darkwing_io_dev'@'10.3.1.5' */ /*!50003 TRIGGER `ensure_users_uniqueness_on_insert` BEFORE INSERT ON `users` FOR EACH ROW begin
    if NEW.is_active = 1 then
        call ensure_unique_user(NEW.user_id, NEW.user_mobile, NEW.email);
    end if;
end */$$


DELIMITER ;

/* Trigger structure for table `users` */

DELIMITER $$

/*!50003 DROP TRIGGER*//*!50032 IF EXISTS */ /*!50003 `ensure_users_uniqueness_on_update` */$$

/*!50003 CREATE */ /*!50017 DEFINER = 'gbk_engage_darkwing_io_dev'@'10.3.1.5' */ /*!50003 TRIGGER `ensure_users_uniqueness_on_update` BEFORE UPDATE ON `users` FOR EACH ROW begin
    if NEW.is_active = 1 then
        call ensure_unique_user(NEW.user_id, NEW.user_mobile, NEW.email);
    end if;
end */$$


DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
