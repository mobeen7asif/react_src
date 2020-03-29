DROP TABLE IF EXISTS `feedbacks`;

CREATE TABLE `feedbacks` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `notes` TEXT DEFAULT NULL,
  `user_id` INT(11) DEFAULT NULL,
  `venue_id` INT(11) DEFAULT NULL,
  `type` ENUM('app','shopping_mall','contact_us','feedback') DEFAULT 'feedback',
  `ratings` VARCHAR(10) DEFAULT NULL,
  `category` VARCHAR(255) DEFAULT NULL,
  `resturant` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT NULL,
  `feedbacks` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=226 DEFAULT CHARSET=latin1;