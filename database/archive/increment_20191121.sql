ALTER TABLE `pages` ADD `order_id` INT(11) NOT NULL DEFAULT '0' AFTER `faq_category_id`;
ALTER TABLE `pages` ADD `tags` VARCHAR(255) NULL DEFAULT NULL AFTER `faq_category_id`;
ALTER TABLE `punch_cards` ADD `pos_ibs` INT(11) NULL DEFAULT NULL AFTER `tree_structure`;
ALTER TABLE `punch_cards` ADD `company_id` INT(11) NOT NULL DEFAULT '1' AFTER `id`;
