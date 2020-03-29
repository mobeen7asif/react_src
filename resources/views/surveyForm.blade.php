<!DOCTYPE html>
<html>
<head>
    <title>Survey Form</title>

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://unpkg.com/jquery"></script>
    <script src="https://surveyjs.azureedge.net/1.1.12/survey.jquery.js"></script>
    <link href="https://surveyjs.azureedge.net/1.1.12/survey.css" type="text/css" rel="stylesheet"/>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.0/dist/loadingoverlay.min.js"></script>
    <link href="{{asset('assets/css/survey_form_view.css')}}" rel="stylesheet" type="text/css">

</head>
<body>
<div id="surveyElement"></div>
<div id="surveyResult"></div>

<script>

    $(document).ready(function(){


        var id = "{{$id}}";
        var user_id = "{{$user_id}}";
        /*load survey form*/


        loadSurveyForm(id, user_id);
    });


    function loadSurveyForm(id, user_id){

        var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
        $.ajax({
            /* the route pointing to the post function */
            url: "{{url('api/surveyJson')}}",
            type: 'POST',
            /* send the csrf-token and the input to the controller */
            data: {_token: CSRF_TOKEN, id:id},
            dataType: 'JSON',
            /* remind that 'data' is the response of the AjaxController */
            success: function (data) {
                var json = data.json;
                window.survey = new Survey.Model(json);
                survey
                    .onComplete
                    .add(function (result) {
                        /*hide thank message for mobile*/
                        if(user_id){
                            $('.sv_completed_page').hide();
                        }
                        document
                            .querySelector('#surveyResult')
                            .textContent = "";
//                            .textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);

                        var surveyData = survey.data;
//                        console.log(id, surveyData);
                        saveSurveyData(id, user_id, surveyData);
                    });

                /*hide loader*/
//                $("#surveyElement").LoadingOverlay("hide");

                $("#surveyElement").Survey({model: survey});
            },
            error: function (jqXHR, exception) {
                console.log(exception);return false;
            }
        });
    }

    function saveSurveyData(edit_id, user_id, surveyData){
        var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
//        console.log('here', surveyData);

        /*show loader*/
        $("#surveyElement").LoadingOverlay("show");
        /*save Data*/
        $.ajax({
            /* the route pointing to the post function */
            url: "{{url('api/save-survey-answers')}}",
            type: 'POST',
            /* send the csrf-token and the input to the controller */
            data: {
                _token: CSRF_TOKEN,
                data: surveyData,
                edit_id: edit_id,
                user_id: user_id
            },
            dataType: 'JSON',
            /* remind that 'data' is the response of the AjaxController */
            success: function (data) {

                /*hide loader*/
                $("#surveyElement").LoadingOverlay("hide");

                /*add addEventListener for mobile*/
                if(user_id) {
                    addUserPoints(user_id);
                    sendToMobile(true);

                }

                console.log(data);return false;
            },
            error: function (jqXHR, exception) {
                /*load survey form*/
                loadSurveyForm(edit_id, user_id);
                /*hide loader*/
                $("#surveyElement").LoadingOverlay("hide");

                /*add addEventListener for mobile*/
                if (user_id){
                    sendToMobile(false);
                }
                console.log(exception);return false;
            }
        });
    }


    function sendToMobile(result) {

        var obj = "{ \"result\": " + result + ", \"points\": 10}";

        // if iPhone
        var is_uiwebview = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
        if (is_uiwebview) {
            window.webkit.messageHandlers.MobileEvent.postMessage(obj);
        } else {

            // For Android
            if(window.MobileEvent)
                window.MobileEvent.textFromWeb(obj);
        }

    }

    function addUserPoints(id) {
        var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
        $.ajax({
            /* the route pointing to the post function */
            url: "{{url('api/assign-points-survey')}}",
            type: 'POST',
            /* send the csrf-token and the input to the controller */
            data: {
                _token: CSRF_TOKEN,

                user_id: id
            },
            dataType: 'JSON',
            success: function (data) {
                return false;
            },
            error: function (jqXHR, exception) {

            }
        });
    }

</script>
</body>
</html>