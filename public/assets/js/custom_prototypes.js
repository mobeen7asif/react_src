import React from 'react';
Array.prototype.recipeHeaderList = [
    {"id": "1", "name": 'Title',            'filterName': 'title'},
    {"id": "1", "name": 'Chef Name',         'filterName': 'chef_name'},
    {"id": "2", "name": 'Description',      'filterName': 'description'},
    {"id": "3", "name": 'Preparation Time', 'filterName': 'prep_time'},
    {"id": "4", "name": 'Cooking Time',     'filterName': 'cook_time'},
    {"id": "5", "name": 'Serving',          'filterName': 'serving'},
    {"id": "5", "name": 'Is Featured',      'filterName': 'is_featured'},
];

String.prototype.recipeListHeader = (orderBy, orderType, limit, offset, search,venue_id) => ({orderBy, orderType, limit, offset, search,venue_id});