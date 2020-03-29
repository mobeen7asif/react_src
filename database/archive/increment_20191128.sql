ALTER TABLE `punch_cards`
CHANGE `description` `description` LONGTEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
CHANGE `punch_card_data` `punch_card_data` LONGTEXT NULL,
	CHANGE `tree_structure` `tree_structure` LONGTEXT NULL;

ALTER TABLE `campaigns` CHANGE `tree_stucture` `tree_stucture` LONGTEXT NULL;

