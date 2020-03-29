<?php

namespace App\Http\Controllers\API;

use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;

class EmailBuilder extends Controller
{


    public function saveTemplate(Request $request){

        if($request->id != 0 && $request->user_role !="Admin"){
            $template = EmailTemplate::where("id",$request->id)->first();

            if($template->created_by != $request->user_id)
                EmailTemplate::insert(["design"=>"0","html"=>$request->rawHtml,"title"=>$request->templateName,'subject'=>$template->emailSubject,"created_by" => $request->user_id,"parent_id"=>$template->id,"tag_values"=>json_encode($request->tag_values),"created_at"=>date("Y-m-d H:i:s")]);
            else
                EmailTemplate::where("id",$request->id)->update(["design"=>"0","html"=>$request->rawHtml,"title"=>$request->templateName,'subject'=>$request->emailSubject,"tag_values"=>json_encode($request->tag_values),"updated_at"=>date("Y-m-d H:i:s")]);

        }else{

            if($request->id == 0)
                EmailTemplate::insert(["design"=>"0","html"=>$request->rawHtml,"title"=>$request->templateName,'subject'=>$request->emailSubject,"created_by" => $request->user_id,"tag_values"=>json_encode($request->tag_values),"created_at"=>date("Y-m-d H:i:s")]);
            else
                EmailTemplate::where("id",$request->id)->update(["tag_values"=>json_encode($request->tag_values),"design"=>"0","html"=>$request->rawHtml,"title"=>$request->templateName,'subject'=>$request->emailSubject,"updated_at"=>date("Y-m-d H:i:s")]);
        }
        return ["status"=>true,"message"=>"Template saved successfully"];
    }


    public function saveTemplate2(Request $request){
        EmailTemplate::updateOrCreate(
            ["id" => $request->id],

            ["design"=>$request->data,"html"=>$request->html,"title"=>$request->title,'subject'=>$request->emailSubject,"created_by" => $request->user_id]
        );
        return ["status"=>true,"message"=>"Template saved successfully"];
    }

    public function getTemplate(Request $request){
        //..... get single template for editing .....//

        if($request->id != 0){
            return ["status"=>true,"data"=>EmailTemplate::whereId($request->id)->first()];
        }
        else{
            $templats = DB::table("email_builder")->skip($request->offset)->take($request->perPage)->orderBy("id","desc");

            if($request->user_role == "Admin"){
                $templats->whereIn("created_by",$request->admin_ids);
                $total = DB::table("email_builder")->whereIn("created_by",$request->admin_ids)
                    ->where("title","!=","CampaignActivate")
                    ->where("title","!=","CampaignActivated")
                    ->count();
            }else{

                $getAdminAndLoginUserTemplates = EmailTemplate::whereIn("created_by",$request->admin_ids)
                    ->orWhere("created_by",$request->user_id)->get(["id"]);
                //---- check if user copy the template of admin. if yes then admin template will not be shown to franchise  ....//
                $duplication = EmailTemplate::where("parent_id","!=",0)->where("created_by",$request->user_id)->pluck("parent_id");

                $finalTemplates = $getAdminAndLoginUserTemplates->whereNotIn("id",$duplication)->pluck("id");

                $templats->whereIn("id",$finalTemplates)->where("title","!=","CampaignActivate")
                    ->where("title","!=","CampaignActivated");
                $total = DB::table("email_builder")->whereIn("id",$finalTemplates)
                    ->where("title","!=","CampaignActivate")
                    ->where("title","!=","CampaignActivated")
                    ->count();
            }
            $templats = $templats->get();

            return [

                "status"=>true,
                "data"=> $templats,
                "total"=> $total
            ];
        }

        //..... end of edit .....//
    }

    /*.....  Delete api of template  .....*/
    function deleteTemplate($id){
        EmailTemplate::destroy($id);
        return ["status"=>true,"message"=>"Template Deleted successfully "];
    }/*..... end of function ......*/


    public function getCampaignTemplate(Request $request){
        //..... get single template for editing .....//
        $skip = ($_GET["perPage"]) * $_GET['page'];
        $data = EmailTemplate::select(["id","title as name","title as slug_name","created_at as date","updated_at","type"])->orderBy("id","DESC")
            ->skip($skip)->take($_GET["perPage"])->get();


        foreach ($data as $key => $value){
            //echo $value->date."=====";
            $value->date = !empty($value->date) ? date("d-m-Y",strtotime($value->date)) : !empty($value->updated_at) ? date("d-m-Y",strtotime($value->updated_at)) : "";
        }
        return [

            "status"=>true,
            "data"=>$data,
            "totalRecords"=>EmailTemplate::select(["id"])->count(),
        ];
        //..... end of edit .....//
    }

    public function getSingleTemplate($id){
        $res = DB::table("email_builder")->where("id",$id)->first();

        $tags = $res->tag_values ?? [];
        $html_text = $res->html;
        $vars = $this->getTags($tags);
        $html = strtr($html_text, $vars);
        $res->html = $html;

        return ["status"=>true,"html"=>$res->html];
    }


    public function getTemplateForCampaign(Request $request){
        //..... get single template for editing .....//
        $skip = ($request->selectedPage) * ($request->perPageCount);

        $templats = DB::table("email_builder")->select(["id","title as name","title as slug_name","created_at as date","type"])->skip($skip)->take($request->perPageCount)->orderBy("id","desc");

        if($request->user_role == "Admin"){
            $templats->whereIn("created_by",$request->admin_ids)->where("title","!=","CampaignActivate")
                ->where("title","!=","CampaignActivated");
            $total = DB::table("email_builder")->whereIn("created_by",$request->admin_ids)->count();
        }else{

            $getAdminAndLoginUserTemplates = EmailTemplate::whereIn("created_by",$request->admin_ids)
                ->orWhere("created_by",$request->user_id)
                ->get(["id"]);
            //---- check if user copy the template of admin. if yes then admin template will not be shown to franchise  ....//
            $duplication = EmailTemplate::where("parent_id","!=",0)->where("created_by",$request->user_id)->pluck("parent_id");

            $finalTemplates = $getAdminAndLoginUserTemplates->whereNotIn("id",$duplication)->pluck("id");

            $templats->whereIn("id",$finalTemplates)->where("title","!=","CampaignActivate")
                ->where("title","!=","CampaignActivated");
            $total = DB::table("email_builder")->whereIn("id",$finalTemplates)->orWhere("id",$request->selected_email_id)
                ->where("title","!=","CampaignActivate")
                ->where("title","!=","CampaignActivated")
                ->count();
        }
        //if($request->selected_email_id != 0){
        $templats = $templats->orWhere("id",$request->selected_email_id);
        // }
        $templats = $templats->get();
        return [
            "status"=>true,
            "data"=> $templats,
            "totalRecords"=> $total
        ];


        //..... end of edit .....//
    }

    public function getTags($tags)
    {
        $res = json_decode($tags,true) ?? [];

        $final_tags = [];
        foreach ($res as $key => $value)
            $final_tags["|$key|"] = $value;

        return $final_tags;
    }
}
