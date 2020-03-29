import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';


class FormCustomFields extends Component {
    dropDownPopup = null;
    formCustomField = null;
    state = {
        customFields:[],
        fieldCount : 5000,
        dropDownId : 0,
        dropDownValue:"",
        is_multi_select:false,
        form_id:0,
        is_form:[],
    };

    componentDidMount = () => {
        this.getUpdatedCustomFields();
        setTimeout(()=>{

            document.getElementById("custom_form_fields").style.display="block";

        },1000)

    }//..... end of function componentDidMount  .....//

    getUpdatedCustomFields = () => {
        show_loader();
        axios.post(BaseUrl+'/api/getFormCustomFields',{venue_id:VenueID,company_id:CompanyID,parent_id:this.props.form_id} ).then((arr)=>{
            if(arr.data){
                show_loader(true);
                let custom_fields = {};
                let data = arr.data.data.custom_fields ? JSON.parse(arr.data.data.custom_fields) : [];
                let user_forms = arr.data.user_form ? arr.data.user_form : [];
                let all_custom_fields = arr.data.all_custom_fields ? arr.data.all_custom_fields : [];
                data.forEach((value)=>{
                    let field_name = this.convertSpaceToUnderscore((value.field_name.trim()));
                    value["field"] = field_name;
                    if(value.field_type == "date")
                        custom_fields[field_name] = "1970-01-01";
                    else
                        custom_fields[field_name]="";
                });
                localStorage.setItem('memberCustomFields', JSON.stringify(data));
                localStorage.setItem('user_form', JSON.stringify(user_forms));
                localStorage.setItem('all_custom_fields', JSON.stringify(all_custom_fields));
                this.setState(()=>({customFields: data,custom_fields}),()=>{
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
        let count = (custom_field_length > 0) ? parseInt(fields[custom_field_length - 1].id) + parseInt(1) : 10000 ;
        fields.push({id:count,field_name:"",field_label:"",field_type:"text",segment_name:"",search_name:"",field_unique_id:"custom_field_member_"+count});
        this.setState(()=>({customFields:fields,fieldCount: count}),()=>{

        })
    }//......  end of addCustomFields  ......//

    removeCustomFields = (id) => {
        let fields = this.state.customFields.filter(value=> value.id != id);
        this.setState(()=>({customFields:fields}));
        this.props.deleteFormFields(id);
    }//......  end of removeCustomFields  .....//
    convertSpaceToUnderscore = (str) => str.replace(/\s+/g, '_').toLowerCase();

    saveFields = () => {
        let is_empty = false;
        let drop_down_empty = false;

        let fields = this.state.customFields.map((value,key)=>{
            if(value.field_type == "dropdown" && typeof value.drop_down_values == "string"){
                value.drop_down_values = JSON.parse(value.drop_down_values);

            }
            if(value.field_type == "dropdown" && typeof value.is_multi_select == "string"){
                value.is_multi_select = JSON.parse(value.is_multi_select);
            }


            if(value.field_name == ""){
                value.field_name = this.convertSpaceToUnderscore(value.field_label.trim());
                value.field_unique_id ="custom_field_member_"+value.field_name
            }


                value.segment_name="custom_"+value.field_type+"_f"+(value.id);
                value.search_name=this.convertSpaceToUnderscore(value.field_name.trim());

            if(value.field_label == ""){
                is_empty = true;
                return false;
            }
            if(value.field_type == "dropdown" && !value.hasOwnProperty("drop_down_values")){
                drop_down_empty = true;
            }
            return value;
        });


        if(is_empty){
            NotificationManager.error("Field name is missing.", 'Error',1500);
            return false;
        }
        if(drop_down_empty){
            NotificationManager.error("Drop Down value is missing.", 'Error',1500);
            return false;
        }

        let duplication = this.checkDuplication(fields);
        if(duplication.length > 0){
            NotificationManager.error(`${[...duplication]}`, 'Duplication',3000);
            return false;
        }
        this.props.formFields(this.props.form_id,fields);
        this.closePopup();
        return false;

        show_loader();
        axios.post(BaseUrl+'/api/update-form-custom-fields',{venue_id:VenueID,company_id:CompanyID,fields:fields} ).then((arr)=>{
            if(arr.status){
                NotificationManager.success("Fields updated successfully.", 'success',1500);
                this.getUpdatedCustomFields();
            }
            show_loader(true);

        }).catch((err) => {
            show_loader(true);
        });
    }//......  end of saveFields  ......//

    checkDuplication = (fields) => {
        let uniq = fields
            .map((value) => {
                return {
                    count: 1,
                    field_name: value.field_name
                }
            })
            .reduce((a, b) => {
                a[b.field_name] = (a[b.field_name] || 0) + b.count
                return a
            }, {})
        let duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);
        return duplicates;

    }

    handleChanges = (e) => {
        var index = e.target.selectedIndex;
        var optionElement = e.target.childNodes[index]
        var id =  optionElement.getAttribute('id');
        var value =  optionElement.getAttribute('value');
        this.setInputValue(value,id,"field_type");
        if(value == "dropdown")
            this.dropDownSettings(id);
    }

    dropDownSettings = (dropDownId) => {
        let fields = this.state.customFields;

        let index = fields.findIndex(item => item.id == dropDownId);
        let dropDownValue = fields[index].hasOwnProperty("drop_down_values") ? this.displayInTextArea(fields[index]['drop_down_values']) : " ";
        let is_multi_select = (fields[index].hasOwnProperty("is_multi_select") && fields[index]['is_multi_select'] == "true") ? true : false;


        this.setState(()=>({dropDownId,dropDownValue,is_multi_select}),()=>{
            this.openPopup();
        })
    }

    openPopup = () => {
        this.dropDownPopup.style.display = "block";
        document.getElementById("config_buttons").style.display="block";

    };



    validation = () => {

    };

    closePopup = () => {
        this.setState(()=>({downDownId:0,dropDownValue:"",is_multi_select:false}),()=>{
            this.dropDownPopup.style.display = "none";

        })

    };

    saveDropDown = (value) => {
        let area = document.getElementById("form_drop_down_values");
        let values = area.value.replace(/\r\n/g,"\n").split("\n");
        values = values.filter(value => value.trim() != "");
        console.log(values);
        let drop_down_values = [];
        values.forEach((value)=>{
           drop_down_values.push({id:value,label:value, value:false});
        });

        if(drop_down_values.length == 0){
            NotificationManager.error("Please Add some values for drop down.", 'Error',1500);
            return false;
        }

        let fields = this.state.customFields;
        let dropDownId = this.state.dropDownId;
        let index = fields.findIndex(item => item.id == dropDownId);
        fields[index]["drop_down_values"]=drop_down_values;
        fields[index]["is_multi_select"]=this.state.is_multi_select;
        console.log("drop_down_values",drop_down_values);

        this.setState(()=>({customFields:fields}));
        this.closePopup();

    }

    displayInTextArea = (value) => {
        let current_value = value;

        if(typeof current_value == "string"){
            current_value = JSON.parse(current_value);

        }

        let values = [];
        current_value.forEach((value,key)=>{
            values.push(value.label);
        });
        return values.join('\r\n');
    }

    textAreaChange = (dropDownValue) => {
        this.setState(()=>({dropDownValue}));
    }

    changeMultiSelect = () => {
        this.setState((prevState)=>({is_multi_select:!prevState.is_multi_select}));

    };





    render() {
        return (
            <React.Fragment>
                <div className="dropSegmentation_section" id="custom_form_fields"style={{display: 'block'}}>

                    <div className="dropSegmentation_heading clearfix">
                        <h3 style={{fontWeight: 'bold'}}>{this.props.form_name} Custom Fields</h3>
                    </div>

                    <div className="venueInfo_div">
                        <div className="venueIdentification_section">
                            <div className="venueIdentification_form">
                                <ul>
                                    {this.state.customFields && (
                                        this.state.customFields.map((value,key)=>{
                                            return (
                                                <li key={key}>
                                                    {/*<label>Field Name</label>*/}
                                                    <div className="compaignSaturation ">
                                                        <div style={{width:"40%",display:"inline-block",paddingRight:"10px"}}>
                                                            <label>Field Name</label>
                                                            <div className="customInput_div" style={{width:"100%"}}>
                                                                <input type="text" className="change" onChange={(e)=>{this.setInputValue(e.target.value,value.id,"field_label")}} value={value.field_label} placeholder={value.field_label} name={value.field_name} value={value.field_label}  />
                                                            </div>
                                                        </div>


                                                        <div style={{width:"40%",display:"inline-block",paddingLeft:"10px"}}>
                                                            <label>Field Type</label>
                                                            <div className="" style={{width:"100%"}}>

                                                                <select style={{border: "1px solid lightgray",width: "100%",height:"38px"}} id="mainselection" onChange={(e)=>{this.handleChanges(e)}} value={value.field_type} >
                                                                    <option value="text" id={value.id} >Text</option>
                                                                    <option value="number" id={value.id} >Number</option>
                                                                    <option value="date" id={value.id} >Date</option>
                                                                    <option value="bollean" id={value.id} >True/False</option>
                                                                    <option value="datetime" id={value.id} >Date Time</option>
                                                                    <option value="dropdown" id={value.id} >Drop Down</option>

                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div style={{width:"20%",display:"inline-block",paddingLeft:"20px"}}>
                                                            {this.state.customFields.length > 1 && (
                                                                <div  id="auto_checkout_btn" style={{display: 'block',textAlign:'left'}}>
                                                                <span>
                                                                    {value.field_type == "dropdown" && (
                                                                        <span style={{  fontSize: '20px',
                                                                            marginRight: '10px',cursor:"pointer"}}><i
                                                                            className="fa fa-list-ul"
                                                                            aria-hidden="true" style={{color:'gray'}} onClick={()=>{this.dropDownSettings(value.id)}}></i>
                                                                </span>
                                                                    )}



                                                                 <span style={{  fontSize: '20px',
                                                                    marginRight: '10px',cursor:"pointer"}}><i
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

                                            </div>
                                            <div style={{width:"20%",display:"inline-block",paddingLeft:"20px"}}>
                                                <div  id="auto_checkout_btn" style={{display: 'block',textAlign:'left'}}>
                                                    <span><span style={{  fontSize: '20px',
                                                        marginRight: '10px',cursor:"pointer"}}><i
                                                        className="fa fa-plus-circle"
                                                         style={{color:'green'}} onClick={()=>{this.addCustomFields()}}></i></span>
                                                        </span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                        {this.state.customFields.length > 0 && (
                                            <li>
                                                <div className="compaignSaturation ">
                                                    <div className="continueCancel" id="skinning_save_btn" style={{display: 'block',textAlign:'left',marginTop:'20px'}}>
                                                        <input  className="selecCompaignBttn" onClick={()=>{this.saveFields()}} type="submit" value="Save"  />
                                                    </div>
                                                </div>
                                            </li>
                                        )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>





                <div className= "popups_outer addNewsCategoryPopup" ref={(ref)=>{this.dropDownPopup = ref}} style={{display: 'none'}}>
                    <div className="popups_inner">
                        <div className="overley_popup" data-attr="addNewUser_popup" onClick={()=>this.closePopup()}></div>

                        <div className="popupDiv2">
                            <div className="popupDiv_detail">

                                <div className="popup_heading clearfix">
                                    <h3>Add Drop Down Value </h3>
                                    <a  style={{cursor:'pointer'}} data-attr="addNewUser_popup" className="popupClose close_popup" onClick={()=>this.closePopup()}>&nbsp;</a>
                                </div>


                                <div className="beacon_popupDeatail" style={{padding:"6px 40px"}}> <br /><br />
                                    <div className="beacon_popup_form">

                                        <div className="venueIdentification_form">
                                            <ul>

                                                <li>
                                                    <label className="capitalize">Is Multiselect</label>
                                                    <div className="customInput_div">
                                                        <ToggleSwitch
                                                            checked={this.state.is_multi_select }
                                                            onChange={(e)=> {this.changeMultiSelect(e)}}
                                                        />
                                                        <span style={{fontWeight:'bold'}}> {this.state.is_multi_select ? "Yes" : "No"}</span>
                                                    </div>

                                                </li>
                                                <li>
                                                    <label>Values <span style={{fontSize: '10px',marginLeft: '19px',fontStyle: 'italic', color: 'silver'}}>(Enter all values line by line)</span></label>
                                                    <textarea id="form_drop_down_values" style={{width:"100%",height:"150px", border: '2px solid lightgray',padding: '11px',borderRadius: '6px'}} value={this.state.dropDownValue} onChange={(e)=>{this.textAreaChange(e.target.value)}}></textarea>
                                                </li>



                                            </ul>
                                        </div>
                                    </div>
                                    <div className="continueCancel place_beacon createUserButtons" id="config_buttons" >
                                        <input ref={(ref)=>{this.saveCategoryBtn = ref;}} className="selecCompaignBttn save_category"  value="SAVE" type="submit" onClick={(e)=>{this.saveDropDown()}} />
                                        <a  style={{cursor:'pointer'}} className="close_popup" onClick={()=>this.closePopup()}>CANCEL</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>







            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of FormCustomFields.

export default FormCustomFields;