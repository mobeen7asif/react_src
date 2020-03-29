<?php

if(isset($data->user)) {
    $string = $data->html;
    $string = str_replace("|FirstName|",$data->user->user_first_name,$string);
    $string = str_replace("|LastName|",$data->user->user_family_name,$string);
    $string = str_replace("|Email|",$data->user->email,$string);
    $string = str_replace("|HomeTelephone|",$data->user->user_mobile,$string);
    $string = str_replace("|Mobile|",$data->user->user_mobile,$string);
    $string = str_replace("|VenueName|",$data->venue->venue_name,$string);
    $string = str_replace("|VenueAddress|",$data->venue->address,$string);
    $string = str_replace("|VenuePhoneNo|",$data->venue->telephone,$string);
    $string = str_replace("|twitter|",$data->venue->twitter_id,$string);
    $string = str_replace("|facebook|",$data->venue->facebook_id,$string);
    $string = str_replace("|instagram|",$data->venue->instagram_id,$string);
}
else {
    $string = $data->html;
    $string = str_replace("|FirstName|","Chantal",$string);
    $string = str_replace("|LastName|","Williams",$string);
    $string = str_replace("|email|","chantal@gmail.com",$string);
    $string = str_replace("|HomeTelephone|","995458545212",$string);
    $string = str_replace("|Mobile|","8525456545",$string);
    $string = str_replace("|VenueName|",'Test Venue',$string);
    $string = str_replace("|VenueAddress|",'Lake City',$string);
    $string = str_replace("|VenuePhoneNo|",'99999999',$string);
    $string = str_replace("|twitter|",'88888888888',$string);
    $string = str_replace("|facebook|",'88888888888',$string);
    $string = str_replace("|instagram|",'88888888888',$string);
}


?>

{!!html_entity_decode($string)!!}