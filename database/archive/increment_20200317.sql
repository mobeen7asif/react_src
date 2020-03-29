ALTER TABLE `punch_cards`
	DROP COLUMN `no_of_use`,
	ADD COLUMN `no_of_use` VARCHAR(55) DEFAULT '5' NULL AFTER `voucher_id`;