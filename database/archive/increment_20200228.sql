ALTER TABLE `users` ADD `address2` VARCHAR(255) NULL DEFAULT NULL AFTER `address`;
ALTER TABLE `users` ADD `groups` TEXT NOT NULL AFTER `custom_fields`;
ALTER TABLE `groups` CHANGE `id` `group_id` INT(11) NOT NULL AUTO_INCREMENT;