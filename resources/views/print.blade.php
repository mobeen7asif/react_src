<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
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
        padding: 8px;

    }
    th {
        background: lightgray;
    }
</style>
<body>
<h3 colspan="3" style="text-align: center;">Venue wise Charities Report</h3>
<table width="100%" id="printTable" >
    <thead>

    <tr>
        <th >Venue Name</th>
        <th >Total Donors</th>
        <th>Total Coins</th>
        <th>Status</th>
    </tr>
    </thead>
    <tbody>
        @foreach($data as $key => $value)
        <tr >
            <td >{{$value['venue_name']}}</td>
            <td >{{$value['totalDonorInVenue']}}</td>
            <td >{{$value['totalCoins']}}</td>
            <td >{{$value['venue_status']}}</td>

        </tr>




        <tr>
            <td></td>
            <td></td>
            <td colSpan="2">
                <table width="100%">
                    <thead>
                    <tr>
                        <th >Charity Name</th>
                        <th>Coins</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach($value['charities'] as $key2 => $value2)
                        <tr >
                            <td>{{$value2["charity_name"]}}</td>
                            <td>{{$value2["coins_count"]}}</td>

                        </tr>
                    @endforeach

                    </tbody>
                </table>
            </td>
        </tr>
     @endforeach
    </tbody>

</table>

</body>
</html>