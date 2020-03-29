<!DOCTYPE html>
<html><head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Engage | Privacy Policy</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">

    <style type="text/css">
        @font-face {
            font-family: 'Museo Sans 500';
            src: url('{{asset("assets/css")}}/fonts/MuseoSans-500.woff2') format('woff2'),
            url('{{asset("assets/css")}}/fonts/MuseoSans-500.woff') format('woff'),
            url('{{asset("assets/css")}}/fonts/MuseoSans-500.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }

        @font-face {
            font-family: 'Museo Sans 700';
            src: url('{{asset("assets/css")}}/fonts/MuseoSans-700.woff2') format('woff2'),
            url('{{asset("assets/css")}}/fonts/MuseoSans-700.woff') format('woff'),
            url('{{asset("assets/css")}}/fonts/MuseoSans-700.ttf') format('truetype');
            font-weight: 600;
            font-style: normal;
        }


        *{box-sizing:border-box;}
        *{margin:0px;padding:0px;  }
        body{font-family: 'Museo Sans 500' !important;}
        .nomember_auto{ max-width:1170px; margin:auto; }
        .newVualt_container_detail { width:100%; padding-top:40px; padding-bottom:60px;}
        .addShaddowBox { box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.15); }
        .newVualt_detail_outer{ width:100%; background:#fff;}
        .nomember_main{ width:100%; padding:50px 25px 50px; }
        .nomember_table{ width:100%; height:100%;  }
        .nomember_tableCell{ width:100%;  }
        .nomember_inner{ width:100%; }
        .nomember_detail{  width:100%; }
        .nomember_detail h1{ font-size:42px; line-height:1em; color: #1862a6; font-weight:300; padding-bottom:20px;font-family: 'Museo Sans 500';}
        .nomember_detail h2{ font-size:30px; line-height:1em; color: #1862a6; font-weight:300; padding-bottom:20px;font-family: 'Museo Sans 500'; }
        .nomember_detail h3{ font-size:20px; line-height:1em; color: #1862a6; font-weight:300; padding-bottom:20px;font-family: 'Museo Sans 500'; }
        .nomember_detail h4{ font-size:10px; line-height:1em; color: #1862a6; font-weight:300; padding-bottom:20px;font-family: 'Museo Sans 500'; }
        .nomember_detail p{ font-size:15px; line-height:1.6em; color: #617283; padding-bottom:30px;font-family: 'Museo Sans 500' }
        .nomember_auto{ max-width:1170px; margin:auto; }
        .backSave_buttons { width:100%; text-align:right;}
        .backSave_buttons ul{ margin:0px -5px;}
        .backSave_buttons ul li { list-style:none; margin:0px 5px; vertical-align:top; }
        .backSave_buttons ul li a { border-radius: 4px; background-color: #d2d6dd; border: solid 1px #a5adba; line-height:40px; font-size:12px; letter-spacing:1px; color: #617283;  text-align:center; display:block;  width:175px; text-decoration:none;font-family: 'Museo Sans 500'}
        .backSave_buttons ul li a.selecBttn {background-image: linear-gradient(to left, #003a5d, #0a62a3 50%, #00c1de);color: #fff;  }
        .backSave_buttons ul li a:hover  {background-image: linear-gradient(to left, #003a5d, #0a62a3 50%, #00c1de);color: #fff; transition:all 0.5s ease; }
        .nomember_detail .backSave_buttons{ text-align:center; }
        .nomember_detail .backSave_buttons ul li a{ width:210px; border:0px none;  }
        ul{margin-left: 40px; font-family: 'Museo Sans 500'; color: #617283;}
    </style>

</head>








<body class="nomember_bg" cz-shortcut-listen="true">
<div class="wrapper" style="max-width:1160px; margin:auto; padding:40px 0px; border:1px solid #000; padding:30px 40px 50px; box-sizing:border-box;">

    <h2>Terms &amp; Conditions and Privacy Policy</h2>
<div class="wrapper">
    <!--start content-->
    <div class="e_member_content">
        <div class="containerSection">
            <div class="nomember_auto">
                <div class="newVualt_container_detail">
                    <div class="newVualt_detail_outer addShaddowBox">
                        <div class="nomember_main">
                            <div class="nomember_table">
                                <div class="nomember_tableCell">
                                    <div class="nomember_inner">
                                        <div class="nomember_detail">
                                            {!! $faq->description !!}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--end content-->
</div>
</div>


</body>
</html>