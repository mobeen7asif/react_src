
-- ALTER TABLE `email_builder` ADD COLUMN `type` VARCHAR(220) DEFAULT 'amplify' NULL AFTER `created_at`;


insert  into `groups`(`group_id`,`company_id`,`group_name`,`group_description`,`user_id`,`created_at`,`updated_at`) values
(1,1,'Member','Member',0,0,0),
(2,2,'Staff','Staff',0,0,0),
(3,3,'Student','Student',0,0,0);
