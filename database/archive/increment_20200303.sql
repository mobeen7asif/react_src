ALTER TABLE `email_builder` ADD `tag_values` TEXT NOT NULL AFTER `parent_id`;
ALTER TABLE `venues` ADD `custom_fields` TEXT NULL DEFAULT NULL AFTER `is_integrated`;
ALTER TABLE `users` ADD `custom_fields` TEXT NULL DEFAULT NULL AFTER `is_merchant`;

DROP TABLE IF EXISTS `stamps_completed`;
CREATE TABLE `stamps_completed` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) DEFAULT NULL,
  `punch_id` INT(11) DEFAULT NULL,
  `completed` DOUBLE DEFAULT '0',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

/*Table structure for table `user_stamps` */

DROP TABLE IF EXISTS `user_stamps`;
CREATE TABLE `user_stamps` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `punch_id` BIGINT(20) DEFAULT NULL,
  `user_id` BIGINT(20) DEFAULT NULL,
  `company_id` INT(11) DEFAULT '0',
  `venue_id` INT(11) DEFAULT '0',
  `credit` DOUBLE DEFAULT '0',
  `debit` DOUBLE DEFAULT '0',
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

/*Table structure for table `voucher_logs` */

DROP TABLE IF EXISTS `voucher_logs`;

CREATE TABLE `voucher_logs` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `voucher_id` INT(11) DEFAULT NULL,
  `user_id` INT(11) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  `voucher_code` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

/*Table structure for table `voucher_users` */

DROP TABLE IF EXISTS `voucher_users`;
CREATE TABLE `voucher_users` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `campaign_id` INT(11) DEFAULT NULL,
  `user_id` INT(11) DEFAULT NULL,
  `company_id` INT(11) DEFAULT NULL,
  `voucher_code` VARCHAR(255) DEFAULT NULL,
  `voucher_start_date` DATETIME DEFAULT NULL,
  `voucher_end_date` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  `voucher_id` INT(11) DEFAULT NULL,
  `uses_remaining` DOUBLE DEFAULT '0',
  `no_of_uses` DOUBLE DEFAULT '0',
  `punch_id` INT(11) DEFAULT NULL,
  `group_id` INT(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `voucher_code_2` (`voucher_code`),
  FULLTEXT KEY `voucher_code` (`voucher_code`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

/*Table structure for table `vouchers` */

DROP TABLE IF EXISTS `vouchers`;
CREATE TABLE `vouchers` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) DEFAULT NULL,
  `discount_type` VARCHAR(255) DEFAULT NULL,
  `basket_level` TINYINT(1) DEFAULT '0',
  `isNumberOfDays` VARCHAR(255) DEFAULT NULL,
  `promotion_text` TEXT,
  `no_of_uses` VARCHAR(255) DEFAULT NULL,
  `business` LONGTEXT,
  `voucher_avial_data` LONGTEXT,
  `tree_structure` LONGTEXT,
  `image` LONGTEXT,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  `pos_ibs` VARCHAR(55) DEFAULT NULL,
  `start_date` DATETIME DEFAULT NULL,
  `end_date` DATETIME DEFAULT NULL,
  `amount` DOUBLE DEFAULT NULL,
  `voucher_type` VARCHAR(55) DEFAULT 'integrated',
  `company_id` INT(11) DEFAULT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `target_user` VARCHAR(55) DEFAULT 'new',
  `quantity` DOUBLE DEFAULT '0',
  `category` VARCHAR(100) DEFAULT 'Group Voucher',
  `group_id` INT(11) DEFAULT '0',
  `billingStatus` INT(11) DEFAULT '0',
  `billingType` VARCHAR(255) DEFAULT NULL,
  `billingFields` LONGTEXT,
  `voucherFactor` VARCHAR(255) DEFAULT NULL,
  `redemption_rule` VARCHAR(55) DEFAULT 'Standard',
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `user_venue_relation`;
CREATE TABLE `user_venue_relation` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT(20) DEFAULT NULL,
  `venue_id` BIGINT(20) DEFAULT NULL,
  `date` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `notification_events`;
CREATE TABLE `notification_events` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `company_id` INT(11) DEFAULT NULL,
  `campaign_id` INT(11) DEFAULT NULL,
  `user_id` INT(11) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `timestamp` VARCHAR(255) DEFAULT NULL,
  `event` VARCHAR(255) DEFAULT NULL,
  `sg_event_id` VARCHAR(255) DEFAULT NULL,
  `sg_message_id` VARCHAR(255) DEFAULT NULL,
  `event_type` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

ALTER TABLE `punch_cards` ADD COLUMN `voucher_id` BIGINT NULL AFTER `company_id`;
ALTER TABLE `users`   
	ADD COLUMN `custom_fields` TEXT NULL AFTER `kilbill_ire_id`;

ALTER TABLE `users` ADD `address2` VARCHAR(255) NULL DEFAULT NULL AFTER `address`;
ALTER TABLE `users` ADD `groups` TEXT NOT NULL AFTER `custom_fields`;
ALTER TABLE `users` ADD `contact_no` TEXT NOT NULL AFTER `custom_fields`;

ALTER TABLE `users` ADD `user_notifications` VARCHAR(500) NOT NULL DEFAULT '{\"is_pointme_user\":true,\"email_subscribed_flag\":true,\"sms_subscribed_flag\":true,\"is_pointme_notifications\":true,\"mail_subscribed_flag\":true}' AFTER `contact_no`;


ALTER TABLE `vouchers`
	ADD COLUMN `max_redemption` DOUBLE DEFAULT 0 NULL AFTER `target_user`;

ALTER TABLE `voucher_users`
  DROP INDEX `voucher_code`,
  ADD FULLTEXT INDEX (`voucher_code`),
  ADD UNIQUE INDEX (`voucher_code`);
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  



