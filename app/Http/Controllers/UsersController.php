<?php

namespace App\Http\Controllers;

use App\Exports\UsersExport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use App\Utility\TagReplacementUtility;

class UsersController extends Controller
{
    /**
     * @return BinaryFileResponse
     */
    public function export()
    {
        return Excel::download(new UsersExport(), 'users.xlsx');
    }

    public function listEmail($id)
    {

        $data = \App\Models\EmailTemplate::whereId($id)->first();
        $html = "";
        if(!empty($data))
            $html = $data->html;


        //$newArray = array_merge($venues[0],$users[0]);



        return view("list-emails",["html"=>$html]);

    }

    # Generate a email template preview with the tags
    # replaced for the configured test user
    #
    public function listEmailView($email_template_id)
    {
        try {


            $venue_id = request()->venue_id;
            $user_id = null;



            # Retrieve the test configuration for this venue
            $venue_conf = DB::table('venue_configurations_test_alerts')->where(
                'venue_id',
                $venue_id
            )->first();





            # Retrieve test emails stored in JSON
            #
            if (!empty($venue_conf) && !empty($venue_conf->recipient_email)) {
                $testEmails = json_decode($venue_conf->recipient_email, true) ?? [];



                # Resolve test emails to user IDs
                if (is_array($testEmails)) {
                    $testUserIDs = DB::table('users')->whereIn(
                        "email",
                        $testEmails
                    )->get(["user_id"]);


                    # Use the first one only
                    if (count($testUserIDs) > 0) {

                        $user_id = $testUserIDs[0]->user_id;
                    }

                }
            }

            # Fallback to first user record if test user not found
            #
            if (empty($user_id)) {
                $fallback_user = DB::table('users')->first();
                $user_id = $fallback_user->user_id;
            }



            # Retrieve the HTML content from the email template
            #
            $html = "";

            $data = \App\Models\EmailTemplate::whereId($email_template_id)->first();
            if(!empty($data)) {
                $html = $data->html;
            }
            # Perform the replacements
            #

            $html = (new TagReplacementUtility())->generateTagText(
                $html,
                $venue_id,
                $user_id,
                $email_template_id
            );



            return view("list-emails", ["html" => $html]);
        }
        catch(\Exception $e) {
            Log::channel('custom')->error('emailView_error', ['emailView_error' => $e->getMessage(),'emailView_error_line' => $e->getLine()]);
            return ["status"=>false,"message"=>$e->getMessage()];
        }

    }
}
