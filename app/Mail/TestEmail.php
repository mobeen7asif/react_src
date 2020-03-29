<?php

namespace App\Mail;

use App\Models\Venue;
use App\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\DB;

class TestEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public  $template_id;
    public  $email;
    public function __construct($id,$email)
    {
        $this->template_id = $id;
        $this->email = $email;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $user = User::where('email',$this->email)->first();
        $venue = null;
        if($user) {
            $venue = Venue::where('venue_id',$user->default_venue)->first();
        }
        $res = DB::table("email_builder")->where("id",$this->template_id)->first();
        $res->user = $user;
        $res->venue = $venue;
        return $this->view("email.testemail",["data"=>$res]);
    }
}
