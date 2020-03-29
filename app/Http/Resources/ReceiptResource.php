<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class ReceiptResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'            => $this->id ?? "",
            'business_id'   => $this->business_id ?? "",
            'title'         => $this->title ?? "",
            'business_name' => $this->business_name ?? "",
            'venue_id'      => $this->venue_id ?? "",
            'company_id'    => $this->company_id ?? "",
            'user_id'       => $this->user_id ?? "",
            'description'   => $this->description ?? "",
            'receipt'       => (isset($this->receipt) and $this->receipt) ? url('/'.$this->receipt) : "",
            'status'        => $this->status ?? "",
            'price'         => $this->price ?? "",
            'receipt_number'=> $this->receipt_number ?? "",
            'created_at'    => isset($this->created_at) ? Carbon::parse($this->created_at)->format('Y-m-d H:i:s') : '',
        ];
    }
}
