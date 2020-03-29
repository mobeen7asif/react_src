ALTER TABLE `punch_cards`
  ADD COLUMN `basket_level` BOOLEAN NULL AFTER `company_id`;

  ALTER TABLE `punch_cards`
  CHANGE `basket_level` `basket_level` TINYINT(1) DEFAULT 0 NULL;

