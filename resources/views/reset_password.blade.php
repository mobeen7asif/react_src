<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>GBK</title>
    <link rel="stylesheet" type="text/css" href="{{asset('assets/unsubscribe/css/style.css')}}">
    <link href="{{asset('assets/css/font-awesome.css')}}" rel="stylesheet" type="text/css">
    <script src="https://unpkg.com/jquery"></script>
    <style>
        .form_field{ position:relative; padding-bottom:10px; }
        .form_field input, .form_field textarea{ width:100%; line-height:20px; padding:15px; background-color:#fff; border:1px solid #dddddd; border-radius:4px; transition:all 0.175s ease-in-out; -webkit-appearance:none; box-shadow:0px 1px 4px rgba(0,0,0,0.09);  color:#0a0a0a; font-size:15px; font-family: 'Open Sans', sans-serif;  }

        .form_field textarea{ width:100%; height:160px;  }

        .form_field textarea:focus { border-color:#4b9ddc!important; box-shadow:0 0 3px #11969f; }
        label{
            font-size: 16px;
            padding-bottom: 10px;
            display: block;
        }
        .iconImage{
            position: absolute;
            top: 46px;
            right: 8px;
        }
        .info-msg,
        .success-msg,
        .warning-msg,
        .error-msg {
            margin: 10px 0;
            padding: 10px;
            border-radius: 3px 3px 3px 3px;
        }
        .info-msg {
            color: #059;
            background-color: #BEF;
        }
        .success-msg {
            color: #270;
            background-color: #DFF2BF;
        }
        .warning-msg {
            color: #9F6000;
            background-color: #FEEFB3;
        }
        .error-msg {
            color: #D8000C;
            background-color: #FFBABA;
        }
        .displayNone{
            display: none;
        }

    </style>
</head>

<body>
<div class="wrapper">
    <div class="g_unsubscribe_main">
        <div class="g_unsubscribe_inner">
            <div class="g_unsubscribe_detail">
                <div class="g_unsubscribe_box">
                    <div class="g_unsubscribe_header">
                        <div class="g_unsubscribe_headerLogo">
                            <a href="javascript:void(0)"><img src="{{asset('assets/unsubscribe/images/gourmet_logo.png')}}" alt="#"></a>
                        </div>
                    </div>
                    <div class="g_unsubscribe_content" style="padding: 150px">

                        <div class="g_unsubscribe_text">
                            @if($error == true)
                            <div id="errorMessages" class="{{($error==true)?'error-msg':"success-msg displayNone"}}">
                               {{$message}}
                            </div>
                            @endif
                                <div id="defaultError" class="displayNone">

                                </div>
                                @if($error != true)
                            <div id="form-data">
                                <div class="form_field">
                                    <label for="">New Password</label>
                                    <input type="password" id="password">
                                    <span class="iconImage"><i class="fa fa-eye" onclick="showHide(this,'password')"></i></span>
                                </div>
                                <div class="form_field">
                                    <label for="">Confirm Password</label>
                                    <input type="password" id="confirm_password">
                                    <span class="iconImage"><i class="fa fa-eye " onclick="showHide(this,'confirm_password')"></i></span>
                                </div>
                            </div>
                                    @endif
                        </div>
                    </div>
                    @if($error != true)
                    <div class="g_unsubscribe_footer">
                        <div class="g_unsubscribe_button">
                            <a href="javascript:void(0);" onclick="resetUserPassword({{$user_id}})">Reset</a>
                        </div>
                    </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    function showHide(e,type) {
        if($(e).hasClass('fa-eye')){
            $(e).removeClass('fa-eye');
            $(e).addClass('fa-eye-slash');
            $("#"+type).attr({type:"text"});
        }else{
            $(e).removeClass('fa-eye-slash');
            $(e).addClass('fa-eye');
            $("#"+type).attr({type:"password"});
        }
    }
    function resetUserPassword(id) {
        if($("#password").val() ==''){
            $("#defaultError").text('Please Enter Password');
            $("#defaultError").removeClass('displayNone');
            $("#defaultError").addClass('error-msg');
            $("#defaultError").show();
            return false;
        }else if($("#confirm_password").val() ==''){
            $("#defaultError").text('Please Enter Confirm Password');
            $("#defaultError").removeClass('displayNone');
            $("#defaultError").addClass('error-msg');
            $("#defaultError").show();
            return false;
        }else if($("#confirm_password").val() != $("#password").val()){
            $("#defaultError").text('Confirm password not match with password');
            $("#defaultError").removeClass('displayNone');
            $("#defaultError").addClass('error-msg');
            $("#defaultError").show();
            return false;
        }else{
            $("#defaultError").removeClass('error-msg');
            $("#defaultError").addClass('displayNone');
            $("#errorMessages").hide();

        }
        $.ajax({
            url: "{{url('api/update-user-password')}}",
            type: 'POST',
            data: { user_id: id,password:$("#password").val()},
            dataType: 'JSON',
            success:function (res) {
                if(res.status){
                    $("#defaultError").text(res.message);
                    $("#defaultError").removeClass('displayNone');
                    $("#defaultError").addClass('success-msg');
                    $("#defaultError").show();
                    $("#form-data").text('');
                    $('.g_unsubscribe_footer').text('');
                }
            }
        })
    }
</script>
</body>
</html>