ALTER TABLE `campaigns`
	CHANGE `action_value` `action_value` LONGTEXT NULL;
	ALTER TABLE `missions`
	CHANGE `outcomes` `outcomes` LONGTEXT NULL;

	ALTER TABLE `games`
	CHANGE `outcomes` `outcomes` LONGTEXT NULL;