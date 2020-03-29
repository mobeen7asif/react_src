<?php
/**
 * Created by PhpStorm.
 * User: Rafay
 * Date: 3/5/2019
 * Time: 4:19 PM
 */

namespace App\Utility;


use App\Http\Controllers\API\EmailBuilder;
use App\Http\Controllers\API\EmailBuilderController;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailGenerator
{
    /**
     * @param array $data
     * @return string
     */
    public function makeGeneratedEmail($data = [])
    {
        try {
            if ($data) {
                $req = new Request();
                $req->replace(["id" => $data->other->emailID->id ?? '', "slug_name" => $data->other->emailID->slug_name ?? '', 'company_id' => config('constant.COMPANY_ID')]);

                if (config('constant.isLogging'))
                Log::channel('custom')->info('Get Decedra Email template Id and slug', ["template_id" => $data->other->emailID->id ?? '', "slug_name" => $data->other->emailID->slug_name ?? '']);

                $dataRecive = (new EmailBuilder())->getTemplate($req);

                if($dataRecive['status'])
                      return $dataRecive['data'];
                else
                    return '';

            }
        }catch (\Exception $e){
            return $e->getMessage();
        }
    }//------ End of makeGeneratedEmail() ------//

    /**
     * @param $user
     * @param $text
     * @return string
     */
    public function sendEmail($user, $text,$subject="Gamification Email")
    {
        try {
            $res['data'] = $text;
            $user_name = $user->user_first_name . ' ' . $user->user_family_name;
            $email_from = config('constant.mail_from_address');
            $user_email = $user->email;
            $email_subject = $subject;
            Mail::send('email.gamification', $res, function ($message) use ($email_from, $user_email, $user_name, $email_subject) {
                $message->to($user_email, $user_name)->subject($email_subject);
            });
            return 'Send successful';
        } catch (\Exception $e){
            return 'Error Occurred while sending email';
        }
    }//----- End of sendEmail() -----//
}