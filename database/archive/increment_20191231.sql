ALTER TABLE member_transactions add COLUMN `currency` varchar(200) NULL;
ALTER TABLE member_transactions CHANGE `date` `date` DATETIME NULL;

