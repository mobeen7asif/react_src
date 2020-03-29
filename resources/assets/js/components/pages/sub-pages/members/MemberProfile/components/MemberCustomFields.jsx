import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import {validateMemberData} from "../../../../../utils/Validations";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";
import DatePicker from 'react-datepicker';
import ReactCodeInput from "react-code-input";
import { PrintTool } from "react-print-tool";
import moment from "moment/moment";
import { Scrollbars } from 'react-custom-scrollbars';
import {find} from 'lodash';
import {setRedemptionFrequency} from "../../../../../redux/actions/PunchCardActions";

import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import MultiSelectReact from "multi-select-react";
import FormMemberCustomFields from "./FormMemberCustomFields";


class MemberCustomFields extends Component {
    state = {
        customFields:[],
        custom_fields:{},
        saved_custom_fields:{},
        list_forms:[],
        form_data:[],
        delete_form:[]
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidMount = () => {
        $('.arrow').html('&nbsp;');
        $('.arrow').addClass('set_width');
        setTimeout(()=>{
            $('.arrow').html('&nbsp;');
            $('.arrow').addClass('set_width');

        },2000)
        show_loader();
        axios.post(BaseUrl + '/api/member-details',{
            persona_id: this.props.persona_id,
            venue_id: VenueID,
            company_id: CompanyID,
        }).then((response) => {
            if (response.data.status) {

                this.setState(()=>({
                    saved_custom_fields: response.data.member.custom_fields ? (response.data.member.custom_fields) : {} ,
                }),()=>{

                    this.getCustomFields();
                });
            }
            else {
                NotificationManager.error("Something went wrong with server", 'Error');
                show_loader(true);
            }
        }).catch((err) => {
            NotificationManager.error("Something went wrong with server", 'Error');
            show_loader(true);
        });
    };//..... end of componentDidMount() .....//


    updateMember = () => {
            show_loader();
            axios.post(BaseUrl + '/api/update-custom-fields', {
                user_id: this.props.persona_id,
                company_id : CompanyID,
                venue_id: VenueID,
                custom_fields : JSON.stringify(this.state.custom_fields),
                form_data : this.state.form_data,
                delete_form : this.state.delete_form,
            }).then((response) => {
                show_loader(true);
                if(!response.data.status){
                    NotificationManager.error('Member Not Updated', 'Error');
                }
                else {
                    NotificationManager.success('Member Updated Successfully', 'Success');
                }

            }).catch((err)=> {
                show_loader(true);
                NotificationManager.error("Error occurred while updating member, please try later.", 'Error');
            });

    };//..... end of updateMember() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//


    getCustomFields = () => {

        axios.post(BaseUrl+'/api/getVenue',{venue_id:VenueID,company_id:CompanyID,user_id: this.props.persona_id} ).then((arr)=>{
            if(arr.data){
                show_loader(true);
                let custom_fields = {};
                let data = arr.data.data.custom_fields ? JSON.parse(arr.data.data.custom_fields) : [];
                let list_forms = arr.data.forms ? arr.data.forms : [];


                data.forEach((value,key)=>{

                    let field_name = this.convertSpaceToUnderscore((value.field_name.trim()));

                    value["field"] = field_name;
                    if(value.field_type == "date")
                        custom_fields[field_name] = "2020-01-01";
                    else if(value.field_type == "datetime")
                        custom_fields[field_name] = "01-01-2020 00:00:00";
                    else if(value.field_type == "bollean")
                        custom_fields[field_name] = false;
                    else if(value.field_type == "dropdown"){



                        custom_fields[field_name] = this.manageDropDown(field_name,value);

                        data[key]['drop_down_values'] = this.manageDropDown2(field_name,value);

                    }
                    else
                        custom_fields[field_name]="";



                });


                custom_fields = {...custom_fields,...this.state.saved_custom_fields};


                this.setState(()=>({customFields: data,custom_fields,list_forms}),()=>{

                });
            }else{

            }

        }).catch((err) => {

        });
    }

    manageDropDown = (field_name,value) => {
        let drop_down_list = value.drop_down_values;

        if(typeof drop_down_list == "string"){
            drop_down_list = JSON.parse(drop_down_list);
            if(typeof drop_down_list == "string")
                drop_down_list = JSON.parse(drop_down_list);
        }




        let selected_values = this.state.saved_custom_fields.hasOwnProperty(field_name) ? this.state.saved_custom_fields[field_name] : [];

        selected_values.forEach((values,key)=>{
            let index = drop_down_list.findIndex(item => item.id == values);
            if(index != -1)
                drop_down_list[index]['value'] = true;

        });

        return selected_values;
    }
    manageDropDown2 = (field_name,value) => {
        let drop_down_list = value.drop_down_values;

        if(typeof drop_down_list == "string"){
            drop_down_list = JSON.parse(drop_down_list);


            if(typeof drop_down_list == "string")
                drop_down_list = JSON.parse(drop_down_list);
        }


        let selected_values = this.state.saved_custom_fields.hasOwnProperty(field_name) ? this.state.saved_custom_fields[field_name] : [];

        selected_values.forEach((values,key)=>{
            let index = drop_down_list.findIndex(item => item.id == values);
            if(index != -1)
                drop_down_list[index]['value'] = true;
        });

        return drop_down_list;
    }

    removeUnderscore = (str) => str.replace(/_/g, " ");
    convertSpaceToUnderscore = (str) => str.replace(/\s+/g, '_').toLowerCase();

    validateNumber = (key,value) => {
        if (value.match(/^\d*$/gm))
            this.handleCustomeFields(key,value)
        else
            return "";
    };

    handleCustomeFields = (key,value) =>{
        let custom_fields = {...this.state.custom_fields,[key]:value};
        this.setState(()=>({custom_fields}));

    }


    handleCustomDate = (date,value) => {
        let custom_fields = {...this.state.custom_fields,[value]: moment(date._d).format('Y-MM-DD')};
        this.setState(()=>({custom_fields}),()=>{

        });

    };//..... end of handleCustomDate() .....//

    referredStatusChanged = (field_name) => {
        let value = this.state.custom_fields[field_name];
        let new_value = !value;

        let custom_fields = {...this.state.custom_fields,[field_name]:new_value};
        this.setState(()=>({custom_fields}),()=>{

        });
    };

    handleChangeEndDate = (date,value) => {
        let date_value = moment(date,"YYYY-MM").format('DD-MM-YYYY HH:mm');

        let custom_fields = {...this.state.custom_fields,[value]: date_value};
        this.setState(()=>({custom_fields}),()=>{

        });
    };

    getAllCustomFields = () => {
        let memberCustomFields= JSON.parse(localStorage.getItem('memberCustomFields'));
        return memberCustomFields;
    }



    optionClicked = (multiSelect,field_name) => {
        this.handleChange({ multiSelect },field_name);
    };//..... end of optionClicked() .....//

    selectedBadgeClicked = (multiSelect,field_name) => {
        this.handleChange({ multiSelect },field_name);
    };//..... end of selectedBadgeClicked() .....//

    handleChange = (obj,field_name) => {
        let drop_down_value = [];
        obj.multiSelect.forEach(function(value,key){
            if(value.value == true){
                drop_down_value.push(value.id);
            }
        });
        this.handleCustomeFields(field_name,drop_down_value);
        this.setState(()=>(obj));
    };//..... end of handleChange() .....//

    duplicateForm = (value,form_index,form_id) => {

        let newvalues = {...value};

        form_index = parseInt(form_index + 1);
        newvalues.form_index = form_index;

        let list_forms = this.state.list_forms;
        list_forms.push(newvalues);

        list_forms = _.sortBy(list_forms,"id");
        console.log("after",list_forms);

        this.setState(()=>({list_forms}),()=>{
            console.log(this.state.list_forms);
        });




    }

    memberFormsData = (key,value) => {
        let formData = this.state.form_data;
        formData[key] = value;
        this.setState(()=>({form_data:formData}),()=>{
            console.log(this.state.list_forms);

        });

    }

    removeForm = (deleteKey,form_index,form_id) => {

        let list_forms = [...this.state.list_forms];
         list_forms = list_forms.filter((value,key)=>{
            return key != deleteKey;
        });
        let delete_form = [...this.state.delete_form];

        delete_form.push({form_id,form_index});
        let formData = this.state.form_data;
        formData = formData.filter((value,key)=>{
            return key != deleteKey;
        });
        console.log("befor",formData);
        formData = _.sortBy(formData,"form_id");
        console.log("after",formData);

        this.setState(()=>({list_forms,delete_form,form_data:formData}),()=>{
            console.log(this.state.list_forms);
        });
    }

    render() {

        const selectedOptionsStyles = {
            color: "#3c763d",
            backgroundColor: "#dff0d8"
        };
        const optionsListStyles = {
            backgroundColor: "#fcf8e3",
            color: "#8a6d3b"
        };
        return (
            <React.Fragment>
                <div className="e_member_right">
                    <div className="add_category_listing">
                        <ul>
                            <li>
                                <div className="add_categoryList_info addProduct_setting" id="printableArea">
                                    <div className="newVualt_heading">
                                        <h3>Custom Fields <a href="javascript:void(0);"></a></h3>
                                    </div>
                                    <div className="categoryInfo_container clearfix">
                                        <div className="addCategoryRight_section">
                                            <div className="edit_category_rightDetail removeHighlights" style={{paddingBottom:"0px"}}>


                                                <div className="addCategory_formSection" style={{borderBottom:"0px solid white"}}>

                                                    <ul>
                                                        {this.state.customFields && (
                                                            this.state.customFields.map((value,key)=>{
                                                                if(typeof value.drop_down_values == "string")
                                                                    value.drop_down_values = JSON.parse(value.drop_down_values);



                                                                if(value.field_type == "number" && value.parent_id == 0){
                                                                    return (
                                                                        <li key={"custom-"+key}>
                                                                            <div className="customPlaceholder_outer">
                                                                                <h4 className="capitalize">{this.removeUnderscore(value.field_label)}</h4>
                                                                                <div className="customPlaceholder">
                                                                                    <input value={this.state.custom_fields.hasOwnProperty(value.field) ? this.state.custom_fields[value.field] : ""}
                                                                                           onChange={(e)=>{this.validateNumber(value.field,e.target.value)}}
                                                                                           placeholder={this.removeUnderscore(value.field_name)} type="text"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                }else if(value.field_type == "date" && value.parent_id == 0){
                                                                    return (
                                                                        <li key={"custom-"+key}>
                                                                            <div className="customPlaceholder_outer">
                                                                                <h4 className="capitalize">{this.removeUnderscore(value.field_label)}</h4>
                                                                                <div className="customPlaceholder">

                                                                                    <DatePicker peekNextMonth showMonthDropdown showYearDropdown  selected={this.state.custom_fields.hasOwnProperty(value.field) ? moment(this.state.custom_fields[value.field]) : moment()}  dateFormat="DD MMM YYYY"  onChange={
                                                                                        (e)=>{
                                                                                            let field = value.field;
                                                                                            this.handleCustomDate(e,field);
                                                                                        }
                                                                                    }/>

                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                }else if(value.field_type == "datetime" && value.parent_id == 0){
                                                                    return (
                                                                        <li key={"custom-"+key}>
                                                                            <div className="customPlaceholder_outer">
                                                                                <h4 className="capitalize">{this.removeUnderscore(value.field_label)}</h4>
                                                                                <div className="customPlaceholder">
                                                                                    <DatePicker  timeIntervals={5} peekNextMonth showMonthDropdown showYearDropdown selected={this.state.custom_fields.hasOwnProperty(value.field) ? moment(this.state.custom_fields[value.field], "DD-MM-YYYY HH:mm:ss") : moment()} dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm"  onChange={
                                                                                        (e)=>{
                                                                                            let field = value.field;
                                                                                            this.handleChangeEndDate(e,field);
                                                                                        }
                                                                                    }/>


                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                }else if(value.field_type == "bollean" && value.parent_id == 0){
                                                                    return (
                                                                        <li key={"custom-"+key}>
                                                                            <div className="customPlaceholder_outer">
                                                                                <h4 className="capitalize">{this.removeUnderscore(value.field_label)}</h4>

                                                                                <div className="customPlaceholder">
                                                                                    <ToggleSwitch

                                                                                        checked={this.state.custom_fields[value.field]}
                                                                                        onChange={(e)=> {this.referredStatusChanged(value.field)}}
                                                                                    />
                                                                                    <span style={{fontWeight:'bold',fontSize:"16px",color:"gray"}}> {this.state.custom_fields[value.field] ? "True" : "False"}</span>
                                                                                </div>

                                                                            </div>
                                                                        </li>
                                                                    )
                                                                }else if(value.field_type == "dropdown" && value.parent_id == 0 && (JSON.parse(value.is_multi_select) == true || JSON.parse(value.is_multi_select) == "true")){

                                                                    return (
                                                                        <li key={"custom-"+key}>
                                                                            <div className="customPlaceholder_outer">
                                                                                <h4 className="capitalize">{this.removeUnderscore(value.field_label)}</h4>

                                                                                <div className="customDropDown custom_class_multiselect">
                                                                                    <MultiSelectReact   options={value.drop_down_values} optionClicked={(e)=>{this.optionClicked(e,value.field_name)}} selectedBadgeClicked={(e)=>{this.selectedBadgeClicked(e,value.field_name)}}
                                                                                                        selectedOptionsStyles={selectedOptionsStyles} optionsListStyles={optionsListStyles} />
                                                                                </div>



                                                                            </div>
                                                                        </li>
                                                                    )
                                                                }else if(value.field_type == "dropdown" && value.parent_id == 0 && (JSON.parse(value.is_multi_select) == false || JSON.parse(value.is_multi_select) == "false")){

                                                                    return (
                                                                        <li key={"custom-"+key}>
                                                                            <div className="customPlaceholder_outer">
                                                                                <h4 className="capitalize">{this.removeUnderscore(value.field_label)}</h4>

                                                                                <div className="customDropDown custom_class_multiselect">
                                                                                    <MultiSelectReact   options={value.drop_down_values} optionClicked={(e)=>{this.optionClicked(e,value.field_name)}} selectedBadgeClicked={(e)=>{this.selectedBadgeClicked(e,value.field_name)}}
                                                                                                        isSingleSelect={true}  selectedOptionsStyles={selectedOptionsStyles} optionsListStyles={optionsListStyles} />
                                                                                </div>

                                                                            </div>
                                                                        </li>
                                                                    )
                                                                }

                                                                else{
                                                                    if(value.parent_id == 0){
                                                                        return (
                                                                            <li key={"custom-"+key}>
                                                                                <div className="customPlaceholder_outer">
                                                                                    <h4 className="capitalize">{this.removeUnderscore(value.field_label)}</h4>
                                                                                    <div className="customPlaceholder">
                                                                                        <input value={this.state.custom_fields.hasOwnProperty(value.field) ? this.state.custom_fields[value.field] : ""}
                                                                                               onChange={(e)=>{this.handleCustomeFields(value.field,e.target.value)}}
                                                                                               placeholder={this.removeUnderscore(value.field_name)} type={value.field_type}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        )
                                                                    }

                                                                }



                                                            })
                                                        )}
                                                    </ul>
                                                </div>


                                            </div>
                                        </div>

                                        {this.state.list_forms.map((value,key)=>{

                                            return (
                                                <FormMemberCustomFields key={value.id+"_"+value.form_index} removeForm={this.removeForm} memberFormsData={this.memberFormsData}  indexNumber={key} duplicateForm={this.duplicateForm} value={value} persona_id={this.props.persona_id} parent_id={value.id} form_index={value.form_index}  />
                                            )
                                        })}

                                    </div>
                                </div>
                            </li>

                        </ul>
                    </div>





                    <div className="clearfix">
                        <div className="e_member_printBtns clearfix">
                            <ul>
                                <li>
                                    <input   type="submit" value="SUBMIT" onClick={this.updateMember} />
                                </li>
                            </ul>
                        </div>
                    </div>



                </div>


            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of Member.

MemberCustomFields.propTypes = {};

// export default MemberCustomFields;

export default MemberCustomFields;