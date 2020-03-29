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
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB AUTO_INCREMENT=216388 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=latin1;