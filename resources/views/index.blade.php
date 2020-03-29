<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
    <title>Engage</title>


    {{--need to include for survey form--}}
  {{--  <link rel="stylesheet" href="https://unpkg.com/bootstrap@3.3.7/dist/css/bootstrap.min.css">--}}

    <link href="{{asset('css/app.css')}}" rel="stylesheet" type="text/css">
    <link href="{{asset('assets/css/custom_fonts.css')}}" rel="stylesheet" type="text/css">
    <link href="{{asset('assets/css/slick.css')}}" rel="stylesheet" type="text/css">
    <link href="{{asset('assets/css/font-awesome.css')}}" rel="stylesheet" type="text/css">

    <script>
        /*if (window.location.protocol !== 'https:') {
            window.location = 'https://' + window.location.hostname + window.location.pathname + window.location.hash;
        }*/
        const BaseUrl = '{{ url('/') }}';
        let VenueID     = 0;
        let CompanyID   = 0;
        let VenueName   = '';
        let PerPage     = 100;
        let VenueEmail   = '';
        let Currency  = "€";

        let IBS         = 0;
        let INTEGRATED  = 0;
        let venueSettings    = false;
        let UserRole = "";
        let UserId = 0;
        let UserPostCode = "0";
        let BillingStatus = false;
        let StoreName = "";
        let INDEX_NAME = '{{ config('constant.ES_INDEX_BASENAME') }}';


        function firstLetterCapital(s)
        {
            return s && s[0].toUpperCase() + s.slice(1);
        }

        function show_loader(hide = false) {
            if (hide) {
                $("#app_loader").removeClass("enabled_loader");
                $("#app_loader").addClass("disabled_loader");
                $("#modal-overlay").hide();
                return;
            }//..... end if() .....//

            if($("#app_loader").hasClass("disabled_loader")){
                $("#app_loader").removeClass("disabled_loader");
                $("#app_loader").addClass("enabled_loader");
                $("#modal-overlay").show();
            }else{
                $("#app_loader").removeClass("enabled_loader");
                $("#app_loader").addClass("disabled_loader");
                $("#modal-overlay").hide();
            }
        }
        
        function showLeftBar(hide = false) {
            if(hide){
                $('.editPro_leftBar_outer').addClass('openLeft_menu');
            }

        }

        function appPermission(pageName,type) {
            if(localStorage.getItem("userData") !== null){
                var userData = JSON.parse(localStorage.getItem('userData'));

                var acl = userData.hasOwnProperty("Acl") ? userData.Acl : [];
                if(pageName != "" && type !=""){
                    var res = acl.filter(function(value){
                        return value.resource.toLocaleLowerCase() == pageName.toLowerCase();
                    });

                    if(res.length > 0){
                        if(res[0].resource.toLowerCase() == pageName.toLowerCase() && res[0][type] == "1"){
                            return true; // if permission is assign
                        }else{
                            return false; // if permission is not assign
                        }
                    }else{
                        return true; //----- if menu is not added on server
                    }
                }else{
                    return true;
                }

            }
        }


        function getAclRoles(role) {
            if(localStorage.getItem("userData") !== null){
                var userData = JSON.parse(localStorage.getItem('userData'));
                var acl_roles = userData.hasOwnProperty("acl_roles") ? userData.acl_roles : [];
                //var acl_roles = userData.acl_roles;
                var role_users = [];
                var emails = [];
                acl_roles.forEach(function(value){
                    if(value.hasOwnProperty(role)){
                        role_users =  value[role];
                    }
                });


                if(role_users.length > 0){
                    role_users.forEach(function (value,key) {
                        emails.push({id:value.user_id,"email":value.user_email,"name":value.user_name});
                    });
                }
                return emails;
            }
        }


    </script>
        <style>
        .holders{
            width: 400px;
            height:300px;
            position:relative;
        }
        iframe{
            width: 100%;
            height:100%;
            background blue;
        }
        .bar{
            position:absolute;
            top:1291px;

            width:1310px;
            margin: 0px auto;
            height:40px;
            float: right;
            background: #f7f8f8;
        }

    </style>

    <style>
        table, td, th {
            border: 1px solid #ddd;
            text-align: left;

        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        th, td {
            padding: 15px;

        }
    </style>

    <style>
        .selcls {
            padding: 3px;
            border: solid 1px #517B97;
            outline: 0;
            background: -webkit-gradient(linear, left top, left 25, from(#FFFFFF), color-stop(4%, #CAD9E3), to(#FFFFFF));
            background: -moz-linear-gradient(top, #FFFFFF, #CAD9E3 1px, #FFFFFF 25px);
            box-shadow: rgba(0,0,0, 0.1) 0px 0px 8px;
            -moz-box-shadow: rgba(0,0,0, 0.1) 0px 0px 8px;
            -webkit-box-shadow: rgba(0,0,0, 0.1) 0px 0px 8px;
            width:150px;
        }
        .seldemo {
            background: #A0CFCF;
            height: 75px;
            width:250px;
            border-radius: 15px;
            padding:20px;
            font-size:22px;
            color:#fff;
        }

    </style>
     
    <script src="{{asset('js/prototypes.js')}}" ></script>
</head>
<body>
<div id="modal-overlay" style="display: none;"></div>
<div id='app_loader' class='loader_background disabled_loader' >
    <img alt="image" style='max-width: 28% !important; '  src='{{asset("/images/image_1209308.gif")}}'>
</div>
<div class="wrapper" id="root"></div>
<script src="{{asset('js/app.js')}}" ></script>
<script src="{{asset('js/vendor.js')}}" ></script>
<script src="{{ asset('/') }}assets/js/ion.rangeSlider.js"></script>
<script src="{{asset('assets/js/slick.js')}}" ></script>
<script>
    $(".container, .compaign_landing_banerOuter, .headerMenu_outer, .header_nave_out").click(function(e) {
        $(".editPro_leftBar_outer").removeClass("openLeft_menu");
    });
</script>
</body>
</html>