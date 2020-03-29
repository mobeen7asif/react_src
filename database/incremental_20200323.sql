

DROP TABLE IF EXISTS `user_custom_field`;

CREATE TABLE `user_custom_field` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `company_id` INT(11) NOT NULL,
  `venue_id` INT(11) NOT NULL,
  `field_name` VARCHAR(255) NOT NULL,
  `field_label` VARCHAR(255) NOT NULL,
  `field_type` VARCHAR(255) NOT NULL,
  `segment_name` VARCHAR(255) NOT NULL,
  `search_name` VARCHAR(255) NOT NULL,
  `field_unique_id` VARCHAR(255) NOT NULL,
  `drop_down_values` LONGTEXT,
  `is_multi_select` VARCHAR(10) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  `parent_id` INT(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;



DROP TABLE IF EXISTS `user_custom_field_data`;

CREATE TABLE `user_custom_field_data` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `custom_field_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `value` LONGTEXT,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  `form_id` INT(11) NOT NULL DEFAULT '0',
  `form_index` INT(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `custom_field_id` (`custom_field_id`),
  KEY `user_id` (`user_id`)
) ENGINE=INNODB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

ALTER TABLE `user_stamps`
	ADD COLUMN `assign_through` VARCHAR(255) DEFAULT 'Manual' NULL AFTER `updated_at`;


