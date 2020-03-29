<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Swimmart</title>

    <!-- Styles -->
    <link href="{{ asset('assets/css/app.css') }}" rel="stylesheet">
</head>
<body>
<div id="app">
    <nav class="navbar navbar-default navbar-static-top">
        <div class="container">
            <div class="navbar-header">

                <!-- Collapsed Hamburger -->
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navbar-collapse">
                    <span class="sr-only">Toggle Navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <!-- Branding Image -->
                <a class="navbar-brand" href="{{ url('/') }}">
                    {{ config('app.name', 'Laravel') }}
                </a>
            </div>

            <div class="collapse navbar-collapse" id="app-navbar-collapse">
                <!-- Left Side Of Navbar -->
                <ul class="nav navbar-nav">
                    &nbsp;
                </ul>

            </div>
        </div>
    </nav>


    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">CSV Import</div>

                    <div class="panel-body">
                        <form id="upload_csv" method="post" enctype="multipart/form-data">

                            <div class="col-md-12">
                                <div class="col-md-3">
                                    <br />
                                    <label>Select CSV File</label>
                                </div>
                                <div class="col-md-4">
                                    <input type="file" name="csv_file" id="csv_file" accept=".csv" style="margin-top:15px;" required />
                                </div>
                                <div class="col-md-5">
                                    <input type="submit" name="upload" id="upload" value="Upload" style="margin-top:10px;" class="btn btn-info" />
                                </div>
                            </div>
                            <div style="clear:both"></div>
                        </form>
                        <br/>
                        <div id="csv_file_data"></div>
                        <div id="import_message">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>




        $(document).ready(function(){

//            file validation
            $(function () {
                $('input[type=file]').change(function () {
                    var val = $(this).val().toLowerCase(),
                        regex = new RegExp("(.*?)\.(csv)$");

                    if (!(regex.test(val))) {
                        $(this).val('');
                        alert('Please select csv file format');
                    }
                });
            });
//            file validation ends

            var timeOutId = 0;
            var offset  =   0;
            var limit   =   500;
            var total = 0;
            var url = "{{url('import_parse_ajax')}}";
            var saveFileUrl = "{{url('saveFile')}}";


            var fileName = '';

            $('#upload_csv').on('submit', function(event){
                event.preventDefault();
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });

//                save file on upload
                var saveFile = function () {

                    $("#upload").prop('disabled', true);
                    $.ajax({
                        url:saveFileUrl,
                        method:"POST",
                        data: new FormData( $("#upload_csv")[0] ),
                        dataType:'json',
                        contentType:false,

                        processData:false,
                        success:function(result){

                            fileName    = result.data.file_name;
                            $("#import_message").html('Reading File...');
                            if(result.status == true){
                                ajaxFn();
                            }
                        }
                    })
                }
                saveFile();

//                read file and ajax call
                var ajaxFn = function () {

                    console.log(offset);
                    $.ajax({
                        url:url,
                        method:"POST",
                        data: buildFormData(),
                        dataType:'json',
                        contentType:false,

                        processData:false,
                        success:function(result){

                            if(result.status == true){
                                offset = 0;
                                $('#offset').val(offset);
                                clearTimeout(timeOutId);
                                $("#import_message").html("Import finished");
                                $("#upload").prop('disabled', false);
                                $("#csv_file").val('');
                                alert(result.total+" Records are dumped successfully");
                            }else{
                                alert("Oops error occured !");
                            }
                        }, error: function(xhr) { // if error occured
                            alert("Error occured.please try again");
                            $("#import_message").html('');
                            $("#upload").prop('disabled', false);
                            $("#csv_file").val('');
                        }
                    })
                }
                //ajaxFn();
            });




            function buildFormData() {
                var formData = new FormData();
                formData.append('limit', limit);
                formData.append('offset', offset);
                formData.append('fileName', fileName);

                return formData;
            }
        });

    </script>


</div>

<!-- Scripts -->
<script src="{{ asset('assets/js/app.js') }}"></script>
</body>
</html>
