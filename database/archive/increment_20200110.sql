ALTER TABLE `member_transactions`
	ADD COLUMN `order_detail` LONGTEXT NULL AFTER `refunded_items`;
