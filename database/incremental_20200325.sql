CREATE TABLE `notification_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) DEFAULT NULL,
  `campaign_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `timestamp` varchar(255) DEFAULT NULL,
  `event` varchar(255) DEFAULT NULL,
  `sg_event_id` varchar(255) DEFAULT NULL,
  `sg_message_id` varchar(255) DEFAULT NULL,
  `event_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;