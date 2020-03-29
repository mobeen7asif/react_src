<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>GBK</title>
    <link rel="stylesheet" type="text/css" href="{{asset('assets/unsubscribe/css/style.css')}}">
    <script src="https://unpkg.com/jquery"></script>
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
                    <div class="g_unsubscribe_content">
                        <div class="g_unsubscribe_text">
                            <strong><i>WE’RE</i> Sorry <span>TO SEE YOU LEAVING</span></strong>
                            <p>We will welcome you back again any time. Click on "Unsubscribe" to stop receiving emails from this sender on this email address:</p>
                            <a href="javascript:void(0);">{{$user['email']}}</a>
                        </div>
                    </div>
                    <div class="g_unsubscribe_footer">
                        <div class="g_unsubscribe_button">
                            <a href="javascript:void(0);" onclick="unsubscribe({{$user['user_id']}},{{$user['campaign_id']}},{{$user['campaign_company_id']}})">Unsubscribe</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    function unsubscribe(id,campaign,company_id) {
        $.ajax({
        url: "{{url('api/user-unsubscribe-system')}}",
            type: 'POST',
            data: { id: id,campaign_id:campaign,company_id:company_id},
            dataType: 'JSON',
            success:function (res) {
            if(res.status){
                $(".g_unsubscribe_text").text('');
                $(".g_unsubscribe_text").html('<a>'+res.message+'</a>');
                $('.g_unsubscribe_footer').hide();
            }
        }
    })
    }
</script>
</body>
</html>