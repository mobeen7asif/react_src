ALTER TABLE `campaigns` ADD COLUMN `created_by` INT(11) DEFAULT 0 AFTER `is_play`;
ALTER TABLE `campaigns` ADD COLUMN `activated_by` INT(11) DEFAULT 0 AFTER `is_play`;
