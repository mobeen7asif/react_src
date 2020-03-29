<?php
return [
    "default_mapping" => ["custom_doc_type" => [
        "type" => "keyword"
    ],
        'campaign_id' => [
            'type' => 'integer',
        ],
        'patron_id' => [
            'type' => 'long',
        ],
        'redeemed_datetime' => [
            'type' => 'date',
            'format' => 'yyyy-MM-dd HH:mm:ss',
        ],
        'venue_id' => [
            'type' => 'integer',
        ],
        'amount' => [
            'type' => 'double',
        ],
        'system' => [
            'type' => 'keyword',
        ],
        'ticket_number' => [
            'type' => 'long',
        ],
        'transaction_datetime' => [
            'type' => 'date',
            'format' => 'yyyy-MM-dd HH:mm:ss',
        ],
        'transaction_type' => [
            'type' => 'keyword',
        ],
        'description' => [
            'type' => 'keyword',
        ],
        'level' => [
            'type' => 'keyword',
        ],
        'category' => [
            'type' => 'keyword',
        ],
        'currency' => [
            'type' => 'keyword',
        ],
        'data_source' => [
            'type' => 'keyword',
        ],
        'date_added' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'discount' =>
            [
                'type' => 'double',
            ],
        'payment_by' =>
            [
                'type' => 'keyword',
            ],
        'points' =>
            [
                'type' => 'long',
            ],
        'product_color' =>
            [
                'type' => 'keyword',
            ],
        'product_des' =>
            [
                'type' => 'keyword',
            ],
        'product_name' =>
            [
                'type' => 'keyword',
            ],
        'product_qty' =>
            [
                'type' => 'long',
            ],
        'product_type' =>
            [
                'type' => 'keyword',
            ],
        'product_unit_price' =>
            [
                'type' => 'double',
            ],
        'product_weight' =>
            [
                'type' => 'double',
            ],
        'sub_product_name' =>
            [
                'type' => 'keyword',
            ],
        'tax_type' =>
            [
                'type' => 'keyword',
            ],
        'tax_value' =>
            [
                'type' => 'double',
            ],
        'tran_date' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'venue' =>
            [
                'type' => 'keyword',
            ],
        'voucher' =>
            [
                'type' => 'keyword',
            ],
        'voucher_value' =>
            [
                'type' => 'double',
            ],
        'balance' =>
            [
                'type' => 'integer',
            ],
        'latest_transaction_date_time' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'rewards_notification' =>
            [
                'properties' =>
                    [
                        'Sms' =>
                            [
                                'type' => 'keyword',
                            ],
                        'Email' =>
                            [
                                'type' => 'keyword',
                            ],
                        'Push' =>
                            [
                                'type' => 'keyword',
                            ],
                    ],
            ],
        'marketing_notification' =>
            [
                'properties' =>
                    [
                        'Sms' =>
                            [
                                'type' => 'keyword',
                            ],
                        'Email' =>
                            [
                                'type' => 'keyword',
                            ],
                        'Push' =>
                            [
                                'type' => 'keyword',
                            ],
                    ],
            ],
        'app_notification' =>
            [
                'properties' =>
                    [
                        'Sms' =>
                            [
                                'type' => 'keyword',
                            ],
                        'Email' =>
                            [
                                'type' => 'keyword',
                            ],
                        'Push' =>
                            [
                                'type' => 'keyword',
                            ],
                    ],
            ],
        'status' =>
            [
                'type' => 'keyword'
            ],
        'creation_datetime' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],

        'date_of_birth' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd',
            ],
        'disabilities' =>
            [
                'type' => 'keyword',
            ],
        'driving_licence_no' =>
            [
                'type' => 'keyword',
            ],
        'emails' =>
            [
                'properties' =>
                    [
                        'personal_emails' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'work_emails' =>
                            [
                                'type' => 'keyword',
                            ],
                    ],
            ],
        'employer_name' =>
            [
                'type' => 'keyword',
            ],
        'excluded' =>
            [
                'type' => 'boolean',
            ],
        'expiry_datetime' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'gender' =>
            [
                'type' => 'keyword'
            ],
        'languages' =>
            [
                'type' => 'keyword',
            ],
        'last_modified_datetime' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],

        'name_title' =>
            [
                'type' => 'keyword'
            ],
        'nationality' =>
            [
                'type' => 'keyword',
            ],
        'no_of_children' =>
            [
                'type' => 'integer',
            ],
        'persona_fname' => [
            'type' => 'text',
            "fielddata" => true,
            "fields" => [
                "normalize" => [
                    "type" => "keyword",
                    "normalizer" => "my_normalizer"
                ]
            ]
        ],

        'persona_lname' => [
            'type' => 'text',
            "fielddata" => true,
            "fields" => [
                "normalize" => [
                    "type" => "keyword",
                    "normalizer" => "my_normalizer"
                ]
            ]
        ],
        'postal_code' =>
            [
                'type' => 'keyword'
            ],
        'activity' =>
            [
                'type' => 'keyword'
            ],
        'devices' =>
            [
                'properties' =>
                    [
                        'home_phone' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'mobile' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'work_phone' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                    ],
            ],
        'postal_address' =>
            [
                'properties' =>
                    [
                        'address_1' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'address_2' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'country' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'postal_address_1' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'postal_address_2' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'postal_code' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'residential_locality' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'state' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'street_name' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'street_no' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'suburb' =>
                            [
                                'type' => 'keyword',
                            ],
                        'unit_no' =>
                            [
                                'type' => 'keyword',
                            ],
                    ],
            ],
        'profession' =>
            [
                'type' => 'keyword',
            ],
        'qualification' =>
            [
                'type' => 'keyword',
            ],

        'residential_address' =>
            [
                'properties' =>
                    [
                        'address_1' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'address_2' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'country' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'postal_code' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'residential_address_1' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'residential_address_2' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'residential_locality' =>
                            [
                                'type' => 'text',
                                'fielddata' => true,
                            ],
                        'state' =>
                            [
                                'type' => 'text',
                                "fielddata" => true,
                                "fields" => [
                                    "normalize" => [
                                        "type" => "keyword",
                                        "normalizer" => "my_normalizer"
                                    ]
                                ]
                            ],
                        'street_name' =>
                            [
                                'type' => 'keyword',
                            ],
                        'street_no' =>
                            [
                                'type' => 'text',
                            ],
                        'suburb' =>
                            [
                                'type' => 'keyword',
                            ],
                        'unit_no' =>
                            [
                                'type' => 'text',
                            ],
                    ],
            ],
        'shipping_address' =>
            [
                'properties' =>
                    [
                        'address_1' =>
                            [
                                'type' => 'text',
                                'fielddata' => true,
                            ],
                        'address_2' =>
                            [
                                'type' => 'text',
                                'fielddata' => true,
                            ],
                        'country' =>
                            [
                                'type' => 'keyword',
                            ],
                        'postal_code' =>
                            [
                                'type' => 'keyword',
                            ],
                        'residential_locality' =>
                            [
                                'type' => 'text',
                                'fielddata' => true,
                            ],
                        'state' =>
                            [
                                'type' => 'keyword',
                            ],
                        'street_name' =>
                            [
                                'type' => 'keyword',
                            ],
                        'street_no' =>
                            [
                                'type' => 'text',
                            ],
                        'suburb' =>
                            [
                                'type' => 'keyword',
                            ],
                        'unit_no' =>
                            [
                                'type' => 'text',
                            ],
                    ],
            ],
        'source' =>
            [
                'type' => 'text'
            ],

        'work_address' =>
            [
                'properties' =>
                    [
                        'address_1' =>
                            [
                                'type' => 'text',
                                'fielddata' => true,
                            ],
                        'address_2' =>
                            [
                                'type' => 'text',
                                'fielddata' => true,
                            ],
                        'country' =>
                            [
                                'type' => 'keyword',
                            ],
                        'postal_code' =>
                            [
                                'type' => 'keyword',
                            ],
                        'residential_locality' =>
                            [
                                'type' => 'text',
                                'fielddata' => true,
                            ],
                        'state' =>
                            [
                                'type' => 'keyword',
                            ],
                        'street_name' =>
                            [
                                'type' => 'keyword',
                            ],
                        'street_no' =>
                            [
                                'type' => 'text',
                            ],
                        'suburb' =>
                            [
                                'type' => 'keyword',
                            ],
                        'unit_no' =>
                            [
                                'type' => 'text',
                            ],

                    ],
            ],
        'company_id' =>
            [
                'type' => 'keyword',
            ],




        'email_subscribed_flag' =>
            [
                'type' => 'boolean',
            ],
        'is_gamer' =>
            [
                'type' => 'boolean',
            ],
        'is_mycash_user' =>
            [
                'type' => 'boolean',
            ],
        'is_pointme_links' =>
            [
                'type' => 'boolean',
            ],
        'is_pointme_notifications' =>
            [
                'type' => 'boolean',
            ],
        'is_pointme_user' =>
            [
                'type' => 'boolean',
            ],
        'is_pointme_user_club' =>
            [
                'type' => 'boolean',
            ],
        'last_pointme_used' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'last_pointme_voucher_used' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'mail_subscribed_flag' =>
            [
                'type' => 'boolean',
            ],
        'mycash_balance' =>
            [
                'type' => 'double',
            ],
        'persona_email' =>
            [
                'type' => 'text',
                "analyzer" => "my_analyzer"
            ],
        'persona_id' =>
            [
                'type' => 'keyword',
            ],
        'persona_status' =>
            [
                'type' => 'keyword',
            ],
        'sms_subscribed_flag' =>
            [
                'type' => 'boolean',
            ],

        'added_by' =>
            [
                'type' => 'long',
            ],
        'beacon_major' =>
            [
                'type' => 'keyword',
            ],
        'beacon_minor' =>
            [
                'type' => 'keyword',
            ],
        'beacon_name' =>
            [
                'type' => 'keyword',
            ],
        'beacon_uuid' =>
            [
                'type' => 'keyword',
            ],
        'brand_name' =>
            [
                'type' => 'keyword',
            ],
        'number' =>
            [
                'type' => 'long',
            ],
        'beliefs' =>
            [
                'type' => 'text',
            ],

        'interest' =>
            [
                'type' => 'text',
            ],
        'opinion' =>
            [
                'type' => 'text',
            ],
        'social_class' =>
            [
                'type' => 'text',
            ],
        'value' =>
            [
                'type' => 'text',
            ],
        'application_key' =>
            [
                'type' => 'text',
            ],
        'debug_mod' =>
            [
                'type' => 'text',
            ],
        'device_name' =>
            [
                'type' => 'text',
            ],
        'ip_address' =>
            [
                'type' => 'text',
            ],
        'model' =>
            [
                'type' => 'text',
            ],
        'os' =>
            [
                'type' => 'text',
            ],
        'persona_device_token' =>
            [
                'type' => 'text',
            ],
        'persona_device_type' =>
            [
                'type' => 'text',
            ],
        'is_subscribed_flag' =>
            [
                'type' => 'boolean',
            ],
        'notification_type' =>
            [
                'type' => 'text'
            ],

        'sub_modified_date' =>
            [
                'type' => 'date',
                'format' => 'yyyy-mm-dd HH:mm:ss',
            ],

        'badge' =>
            [
                'type' => 'keyword',
            ],

        'point_type_id' =>
            [
                'type' => 'integer',
            ],

        'expiry_date' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'id' =>
            [
                'type' => 'text',
            ],

        'beacon_major_loc' =>
            [
                'type' => 'keyword',
            ],
        'beacon_minor_loc' =>
            [
                'type' => 'keyword',
            ],
        'beacon_name_loc' =>
            [
                'type' => 'keyword',
            ],
        'beacon_uuid_loc' =>
            [
                'type' => 'keyword',
            ],
        'date_added_loc' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'enter_time_loc' =>
            [
                'type' => 'date',
                'ignore_malformed' => true,
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'event_name_loc' =>
            [
                'type' => 'keyword',
            ],
        'exit_time_loc' =>
            [
                'type' => 'date',
                'ignore_malformed' => true,
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'stay_time_loc' =>
            [
                'type' => 'long',
            ],
        'zone_event' =>
            [
                'type' => 'text',
            ],
        'zone_name_loc' =>
            [
                'type' => 'keyword',
            ],
        'site_id' =>
            [
                'type' => 'keyword',
            ],
        'beacon_id' =>
            [
                'type' => 'integer',
            ],
        'dwell' =>
            [
                'type' => 'double',
            ],
        'floor_id' =>
            [
                'type' => 'keyword',
            ],
        'floor_name' =>
            [
                'type' => 'keyword',
            ],
        'floor_number' =>
            [
                'type' => 'keyword',
            ],
        'major' =>
            [
                'type' => 'keyword',
            ],
        'minor' =>
            [
                'type' => 'keyword',
            ],
        'trigger' =>
            [
                'type' => 'keyword',
            ],
        'uuid' =>
            [
                'type' => 'keyword',
            ],
        'venue_name' =>
            [
                'type' => 'keyword',
            ],
        'visit_datetime' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'egm_location' =>
            [
                'type' => 'text'
            ],
        'egm_spend_amount' =>
            [
                'type' => 'double',
            ],
        'egm_spend_date' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'period' =>
            [
                'type' => 'integer',
            ],
        'period_start_datetime' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],

        'barrel_draw_id' =>
            [
                'type' => 'integer',
            ],
        'claimed' =>
            [
                'type' => 'keyword',
            ],
        'drawn_datetime' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'location' =>
            [
                'type' => 'text'
            ],
        'sector_name' =>
            [
                'type' => 'text',
            ],
        'maximum_level' =>
            [
                'type' => 'double',
            ],
        'minimum_level' =>
            [
                'type' => 'double',
            ],
        'item_code' =>
            [
                'type' => 'keyword',
            ],
        'item_description' =>
            [
                'type' => 'keyword',
            ],
        'sale_id' =>
            [
                'type' => 'keyword',
            ],
        'score' =>
            [
                'type' => 'long',
            ],
        'score_type' =>
            [
                'type' => 'text',
            ],
        'created_datetime' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],

        'unsub_datetime' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'location_id' =>
            [
                'type' => 'keyword',
            ],
        'location_name' =>
            [
                'type' => 'text'
            ],
        'sale_datetime' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'sale_total' =>
            [
                'type' => 'integer',
            ],
        'kiosk_location' =>
            [
                'type' => 'text'
            ],
        'kiosk_spend_amount' =>
            [
                'type' => 'double',
            ],
        'kiosk_spend_date' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'start_date_time' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'transaction_type_id' =>
            [
                'type' => 'integer',
            ],
        'last_updated_datetime' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'ticket_count' =>
            [
                'type' => 'integer',
            ],
        'start_time' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'state_flag' =>
            [
                'type' => 'keyword',
            ],
        'stop_time' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'membership_number' =>
            [
                'type' => 'integer',
            ],
        'membership_status' =>
            [
                'type' => 'keyword',
            ],
        'membership_title' =>
            [
                'type' => 'keyword',
            ],
        'point_balance' =>
            [
                'type' => 'double',
            ],
        'entry_datetime' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'jackpot_wins' =>
            [
                'type' => 'integer',
            ],
        'spend' =>
            [
                'type' => 'double',
            ],
        'start_date' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'turnover' =>
            [
                'type' => 'double',
            ],
        'wins' =>
            [
                'type' => 'integer',
            ],
        'patron_preference_group_id' =>
            [
                'type' => 'integer',
            ],
        'aging_periods' =>
            [
                'type' => 'integer',
            ],

        'first_period' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'one_monetary_unit' =>
            [
                'type' => 'integer',
            ],
        'period_type' =>
            [
                'type' => 'integer',
            ],
        'member_id' =>
            [
                'type' => 'text'
            ],
        'pos_location' =>
            [
                'type' => 'text'
            ],
        'pos_spend_amount' =>
            [
                'type' => 'double',
            ],
        'pos_spend_date' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'sale_item' =>
            [
                'type' => 'keyword',
            ],
        'cancel_credit_amount' =>
            [
                'type' => 'double',
            ],
        'edraw_winner' =>
            [
                'type' => 'boolean',
            ],
        'gaming_player' =>
            [
                'type' => 'boolean',
            ],
        'jackpot_winner' =>
            [
                'type' => 'boolean',
            ],
        'last_game_play_date' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],

        'ticket' =>
            [
                'type' => 'integer',
            ],
        'transaction_date' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'visit' =>
            [
                'type' => 'integer',
            ],
        'zone_name' =>
            [
                'type' => 'text',
            ],
        'snapshot_datetime' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],


        'camp_action_type' =>
            [
                'type' => 'keyword',
            ],
        'camp_channel' =>
            [
                'type' => 'keyword',
            ],
        'detail' =>
            [
                'type' => 'nested',
            ],
        'camp_id' =>
            [
                'type' => 'integer',
            ],
        'camp_type' =>
            [
                'type' => 'keyword',
            ],

        'is_send' =>
            [
                'type' => 'integer',
            ],

        'opened' =>
            [
                'type' => 'integer'
            ],
        'is_redeemed' =>
            [
                'type' => 'integer'
            ],
        'redemption_date' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        'unsub_date' =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        "uses_remaining" => [
            "type" => "integer"
        ],
        "voucher_edate" => [
            "type" => "long"
        ],
        "dateadded" => [
            "type" => "long"
        ],
        "from_punch_card" => [
            "type" => "text"
        ],
        "punch_card_rule" => [
            "properties" => [
                "business_id" => [
                    "type" => "long"
                ],
                "card_color" => [
                    "type" => "text",
                    "fields" => [
                        "keyword" => [
                            "type" => "keyword",
                            "ignore_above" => 256
                        ]
                    ]
                ],
                "category_id" => [
                    "type" => "long"
                ],
                "category_name" => [
                    "type" => "text",
                    "fields" => [
                        "keyword" => [
                            "type" => "keyword",
                            "ignore_above" => 256
                        ]
                    ]
                ],
                "created_at" => [
                    'type' => 'date',
                    'format' => 'yyyy-MM-dd HH:mm:ss',
                ],
                "description" => [
                    "type" => "text",
                    "fields" => [
                        "keyword" => [
                            "type" => "keyword",
                            "ignore_above" => 256
                        ]
                    ]
                ],
                "id" => [
                    "type" => "long"
                ],
                "image" => [
                    "type" => "text",
                    "fields" => [
                        "keyword" => [
                            "type" => "keyword",
                            "ignore_above" => 256
                        ]
                    ]
                ],
                "name" => [
                    "type" => "keyword",
                    "fields" => [
                        "keyword" => [
                            "type" => "keyword",
                            "ignore_above" => 256
                        ]
                    ]
                ],
                "no_of_use" => [
                    "type" => "text",
                    "fields" => [
                        "keyword" => [
                            "type" => "keyword",
                            "ignore_above" => 256
                        ]
                    ]
                ],
                "no_of_voucher" => [
                    "type" => "text",
                    "fields" => [
                        "keyword" => [
                            "type" => "keyword",
                            "ignore_above" => 256
                        ]
                    ]
                ],
                "product_id" => [
                    "type" => "long"
                ],
                "product_image" => [
                    "type" => "text",
                    "fields" => [
                        "keyword" => [
                            "type" => "keyword",
                            "ignore_above" => 256
                        ]
                    ]
                ],
                "product_name" => [
                    "type" => "text",
                    "fields" => [
                        "keyword" => [
                            "type" => "keyword",
                            "ignore_above" => 256
                        ]
                    ]
                ],
                "rule_on" => [
                    "type" => "text",
                    "fields" => [
                        "keyword" => [
                            "type" => "keyword",
                            "ignore_above" => 256
                        ]
                    ]
                ],
                "updated_at" => [
                    'type' => 'date',
                    'format' => 'yyyy-MM-dd HH:mm:ss',
                ],
                "deleted_at" => [
                    'type' => 'date',
                    'format' => 'yyyy-MM-dd HH:mm:ss',
                ],
                "voucher_amount" => [
                    "type" => "double"
                ]
            ]
        ],
        "voucher_sdate" => [
            'type' => 'date',
            'format' => 'yyyy-MM-dd HH:mm:ss',
        ],
        "voucher_start_date" => [
            'type' => 'date',
            'format' => 'dd-MM-yyyy HH:mm',
        ],
        "voucher_end_date" => [
            'type' => 'date',
            'format' => 'dd-MM-yyyy HH:mm',
        ],
        'is_merchant' =>
            [
                'type' => 'integer',
            ],
        'merchants_ids' =>
            [
                'type' => 'text',
            ],
        'business_name' =>
            [
                'type' => 'keyword',
            ],
        'promotion_text' =>
            [
                'type' => 'text',
                "fielddata" => true,
                "fields" => [
                    "normalize" => [
                        "type" => "keyword",
                        "normalizer" => "my_normalizer"
                    ]
                ]
            ],
        'badge_title' =>
            [
                'type' => 'keyword',
            ],
        'badge_description' =>
            [
                'type' => 'text',
            ],
        "voucher_code" =>
            [
                'type' => 'text',
                "fielddata" => true,
                "fields" => [
                    "normalize" => [
                        "type" => "keyword",
                        "normalizer" => "my_normalizer"
                    ]
                ]
            ],
        "pos_ibs" =>
            [
                'type' => 'text',
                "fielddata" => true,
                "fields" => [
                    "normalize" => [
                        "type" => "keyword",
                        "normalizer" => "my_normalizer"
                    ]
                ]
            ],
        "referred_user" =>
            [
                "type" => 'integer'
            ],
        "referral_by" =>
            [
                'type' => 'text',
                "fielddata" => true,
                "fields" => [
                    "normalize" => [
                        "type" => "keyword",
                        "normalizer" => "my_normalizer"
                    ]
                ]
            ],
        "referral_code" =>
            [
                'type' => 'text',
                "fielddata" => true,
                "fields" => [
                    "normalize" => [
                        "type" => "keyword",
                        "normalizer" => "my_normalizer"
                    ]
                ]
            ],
        "venues" =>
            [
                "type" => "nested",
                "properties" =>[
                        "date" => [
                            "type" => "date",
                            'format' => 'yyyy-MM-dd HH:mm:ss',
                        ],
                    "venue_id"=>[
                        "type" => "long"
                    ]
                ]
            ],
        "default_venue" =>
            [
                "type" => "integer"
            ],
        "groups" =>
            [
                "type" => "keyword"
            ],
        "soldi_id" =>
            [
                "type" => "integer"
            ],
        "last_transactions" =>
            [
                'type' => 'date',
                'format' => 'yyyy-MM-dd HH:mm:ss',
            ],
        "total_spending" =>
            [
                'type' => 'double'
            ],
        "average_spending" =>
            [
                'type' => 'double'
            ],
        "basket_value" =>
            [
                'type' => 'double'
            ],
        "basket_size" =>
            [
                'type' => 'double'
            ],
        "avg_basket_size" =>
            [
                'type' => 'double'
            ],
        "avg_basket_value" =>
            [
                'type' => 'double'
            ],
        "surveys" =>
            [
                'type' => 'keyword'
            ],
        "seen_video" =>
            [
                'type' => 'keyword'
            ],
        "last_login"=>[
            'type' => 'date',
            'format' => 'yyyy-MM-dd HH:mm:ss',
        ],
        "user_location" => [
            'type' => 'geo_point'
        ],
        'region_type' => [
            'type' => 'text',
            "fielddata" => true,
            "fields" => [
                "normalize" => [
                    "type" => "keyword",
                    "normalizer" => "my_normalizer"
                ]
            ]
        ],
        'old_user' =>
            [
                'type' => 'boolean',
            ],
        'client_customer_id' => [
            'type' => 'keyword'
        ],
        "voucher_amount" => [
            "type" => "double"
        ],

        "custom_fields"=> [
            "type"=> "nested",
            "properties"=> [
                "normalize"=> [
                    "type"=> "keyword",
                    "normalizer"=> "my_normalizer"
                ],
                "keyword"=> [
                    "type"=> "keyword"
                ]
            ]
        ],
        "user_forms"=> [
            "type"=> "nested",
            "properties"=> [
                "normalize"=> [
                    "type"=> "keyword",
                    "normalizer"=> "my_normalizer"
                ],
                "keyword"=> [
                    "type"=> "keyword"
                ]
            ]
        ]

    ]
];



