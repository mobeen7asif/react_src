CREATE TABLE `voucher_users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `campaign_id` INT(11),
  `user_id` INT(11),
  `company_id` INT(11),
  `voucher_code` VARCHAR(255),
  `voucher_start_date` DATETIME,
  `voucher_end_date` DATETIME,
  `created_at` DATETIME,
  `updated_at` DATETIME,
  `deleted_at` DATETIME,
  PRIMARY KEY (`id`)
);



