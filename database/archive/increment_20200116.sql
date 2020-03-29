ALTER TABLE `email_builder` ADD `tag_values` TEXT NOT NULL AFTER `parent_id`;
ALTER TABLE `venues` ADD `custom_fields` TEXT NULL DEFAULT NULL AFTER `is_integrated`;
ALTER TABLE `users` ADD `custom_fields` TEXT NULL DEFAULT NULL AFTER `is_merchant`;