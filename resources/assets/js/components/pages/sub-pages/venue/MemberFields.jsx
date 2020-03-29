import React, {Component} from 'react';

import {NotificationManager} from "react-notifications";


class MemberFields extends Component {
    state = {
        customFields:[],
        fieldCount : 5000,
        deleteFields:[]
    };

    componentDidMount = () => {
        this.getGroupsField();

    }//..... end of function componentDidMount  .....//

    getGroupsField = () => {
        show_loader();
        axios.post(BaseUrl+'/api/get-all-groups',{venue_id:VenueID,company_id:CompanyID} ).then((arr)=>{
            if(arr.data.status){
                show_loader(true);
                let data =  arr.data.data;


                this.setState(()=>({customFields: data,deleteFields:[]}),()=>{
                        if(this.state.customFields.length == 0)
                            this.addCustomFields();
                });
            }else{
                show_loader(true);
            }

        }).catch((err) => {
            show_loader(true);
        });
    }

    setInputValue = (value,id,field_name)=>{
        let fields = this.state.customFields;
        let index = fields.findIndex(item => item.id == id);
        fields[index][field_name.toLowerCase()]=value;
        this.setState(()=>({customFields:fields}));
    }//..... end of setInputValue  .....//

    addCustomFields = () => {
        let fields = this.state.customFields;
        let custom_field_length = this.state.customFields.length;
        let count = (custom_field_length > 0) ? parseInt(fields[custom_field_length - 1].id) + parseInt(1) : 1 ;
        fields.push({id:count,group_name:""});
        this.setState(()=>({customFields:fields,fieldCount: count}),()=>{

        })
    }//......  end of addCustomFields  ......//

    removeCustomFields = (id) => {
        let deleteFields = this.state.deleteFields;
        deleteFields.push(id);

        let fields = this.state.customFields.filter(value=> value.id != id);
        this.setState(()=>({customFields:fields,deleteFields}));
    }//......  end of removeCustomFields  .....//

    saveMemberFields = () => {
        let is_empty = false;
        let fields = this.state.customFields.map((value,key)=>{
            if(value.group_name == ""){
                is_empty = true;
                return false;
            }

            return value;
        });


        if(is_empty){
            NotificationManager.error("Field name is missing.", 'Error',1500);
            return false;
        }


        let duplication = this.checkDuplication(fields);
        if(duplication.length > 0){
            NotificationManager.error(`${[...duplication]}`, 'Duplication',3000);
            return false;
        }


        show_loader();
        axios.post(BaseUrl+'/api/save-groups',{company_id:CompanyID,venue_id:VenueID,fields:fields,deleteFields:this.state.deleteFields} ).then((arr)=>{
            if(arr.data.status){
                show_loader(true);
                NotificationManager.success("Fields updated successfully.", 'success',1500);
                this.getGroupsField();
            }

        }).catch((err) => {
            show_loader(true);
        });
    }//......  end of saveFields  ......//

    checkDuplication = (fields) => {
        let uniq = fields
            .map((value) => {
                return {count: 1, group_name: value.group_name}
            })
            .reduce((a, b) => {
                a[b.group_name] = (a[b.group_name] || 0) + b.count
                return a
            }, {})
        let duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);
        return duplicates;

    }

    render() {
        return (
            <React.Fragment>
                <div className="dropSegmentation_section" id="member_fields" >

                    <div className="dropSegmentation_heading clearfix">
                        <h3 style={{fontWeight: 'bold'}}>Member Groups</h3>
                    </div>

                    <div className="venueInfo_div">
                        <div className="venueIdentification_section">
                            <div className="venueIdentification_form">
                                <ul>
                                    {this.state.customFields && (
                                        this.state.customFields.map((value,key)=>{
                                            return (
                                                <li key={key}>
                                                    <div className="compaignSaturation ">
                                                        <div style={{width:"40%",display:"inline-block",paddingRight:"10px"}}>
                                                            <label>Group Name</label>
                                                            <div className="customInput_div" style={{width:"100%"}}>
                                                                <input type="text" className="change" onChange={(e)=>{this.setInputValue(e.target.value,value.id,"group_name")}} value={value.group_name} placeholder={value.group_name} name={value.group_name} value={value.group_name}  />
                                                            </div>
                                                        </div>



                                                        <div style={{width:"20%",display:"inline-block",paddingLeft:"20px"}}>
                                                            {this.state.customFields.length > 0 && (
                                                                <div  id="auto_checkout_btn" style={{display: 'block',textAlign:'left'}}>
                                                                <span>


                                                                 <span style={{  fontSize: '20px',
                                                                    marginRight: '10px'}}><i
                                                                    className="fa fa-minus-circle"
                                                                    aria-hidden="true" style={{color:'red'}} onClick={()=>{this.removeCustomFields(value.id)}}></i>
                                                                </span>


                                                                    </span>
                                                                </div>
                                                            )}

                                                        </div>
                                                    </div>

                                                </li>
                                            )
                                        })
                                    )}

                                    <li>
                                        <div className="compaignSaturation ">
                                            <div style={{width:"40%",display:"inline-block",paddingRight:"10px"}}>
                                            </div>
                                            <div style={{width:"40%",display:"inline-block",paddingLeft:"10px"}}>
                                                <div  id="auto_checkout_btn" style={{display: 'block',textAlign:'left'}}>
                                                    <span><span style={{  fontSize: '20px',
                                                        marginLeft: '10px'}}><i
                                                        className="fa fa-plus-circle"
                                                        style={{color:'green'}} onClick={()=>{this.addCustomFields()}}></i></span>
                                                        </span>
                                                </div>
                                            </div>
                                            <div style={{width:"20%",display:"inline-block",paddingLeft:"20px"}}>

                                            </div>
                                        </div>
                                    </li>
                                        {this.state.customFields.length > 0 && (
                                            <li>
                                                <div className="compaignSaturation ">
                                                    <div className="continueCancel" id="skinning_save_btn" style={{display: 'block',textAlign:'left',marginTop:'20px'}}>
                                                        <input  className="selecCompaignBttn" onClick={()=>{this.saveMemberFields()}} type="submit" value="Save"  />
                                                    </div>
                                                </div>
                                            </li>
                                        )}
                                </ul>
                            </div>
                        </div>
                    </div>


                </div>


            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of MemberFields.

export default MemberFields;