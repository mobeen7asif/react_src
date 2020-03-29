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


class FormMemberCustomFields extends Component {
    state = {
        customFields:[],
        custom_fields:{},
        saved_custom_fields:{}
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

        },2000);
        show_loader();
        axios.post(BaseUrl + '/api/user-custom-form-data',{
            persona_id: this.props.persona_id,
            venue_id: VenueID,
            company_id: CompanyID,
            form_id: this.props.parent_id,
            form_index: this.props.form_index,
        }).then((response) => {
            if (response.data.status) {
                this.setState(()=>({
                    saved_custom_fields: response.data.data ? (response.data.data) : {} ,
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
            }).then((response) => {
                show_loader(true);
                NotificationManager.success('Member Updated Successfully', 'Success');
            }).catch((err)=> {
                show_loader(true);
                NotificationManager.error("Error occurred while updating member, please try later.", 'Error');
            });

    };//..... end of updateMember() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//


    getCustomFields = () => {

        axios.post(BaseUrl+'/api/getVenue',{venue_id:VenueID,company_id:CompanyID,parent_id:this.props.parent_id} ).then((arr)=>{
            if(arr.data){
                show_loader(true);
                let custom_fields = {};
                let data = arr.data.data.custom_fields ? JSON.parse(arr.data.data.custom_fields) : [];

                data.forEach((value,key)=>{

                    let field_name = this.convertSpaceToUnderscore((value.field_name.trim()));

                    value["field"] = field_name;
                    if(value.field_type == "date"){
                        custom_fields[field_name] = moment().format('YYYY-MM-DD');
                       // custom_fields[field_name] = "2020-01-01";

                    }

                    else if(value.field_type == "datetime")
                        custom_fields[field_name] = "01-01-2020 00:00:00";
                    else if(value.field_type == "bollean")
                        custom_fields[field_name] = false;
                    else if(value.field_type == "dropdown"){
                        let d1 = this.manageDropDown(field_name,value);
                        let d2 = this.manageDropDown2(field_name,value);

                        custom_fields[field_name] = d1;
                        data[key]['drop_down_values'] = d2;


                    }
                    else
                        custom_fields[field_name]="";



                });


                custom_fields = {...custom_fields,...this.state.saved_custom_fields};
                //custom_fields = {...custom_fields};


                this.setState(()=>({customFields: data,custom_fields}),()=>{
                    this.returnValues();
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
        if(typeof selected_values == "string")
            selected_values = JSON.parse(selected_values);

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
        if(typeof selected_values == "string")
            selected_values = JSON.parse(selected_values);

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
        this.setState(()=>({custom_fields}),()=>{
            this.returnValues();
        });

    }


    handleCustomDate = (date,value) => {
        let custom_fields = {...this.state.custom_fields,[value]: moment(date._d).format('Y-MM-DD')};
        this.setState(()=>({custom_fields}),()=>{
            this.returnValues();
        });

    };//..... end of handleCustomDate() .....//

    referredStatusChanged = (field_name) => {
        let value = this.state.custom_fields[field_name];
        let new_value = !value;

        let custom_fields = {...this.state.custom_fields,[field_name]:new_value};
        this.setState(()=>({custom_fields}),()=>{
            this.returnValues();
        });
    };

    handleChangeEndDate = (date,value) => {
        let date_value = moment(date,"YYYY-MM").format('DD-MM-YYYY HH:mm');

        let custom_fields = {...this.state.custom_fields,[value]: date_value};
        this.setState(()=>({custom_fields}),()=>{
            this.returnValues();
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
        this.setState(()=>(obj),()=>{
            this.returnValues();
        });
    };//..... end of handleChange() .....//


    returnValues = () => {
        let memberCustomFields= JSON.parse(localStorage.getItem('memberCustomFields'));

        let custome_fields = this.state.custom_fields;
        custome_fields.parent_id = this.props.parent_id;

        this.props.memberFormsData(this.props.indexNumber,custome_fields);

    }

    duplicate = (value,form_index,parent_id) => {
        let newValue = value;
        this.props.duplicateForm(newValue,form_index,parent_id);
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

            <div className="addCategory_formSection" style={{borderBottom:"0px solid white"}}>
                <div className="newVualt_heading">
                    <h3>{this.props.value.field_label} <a href="javascript:void(0);"></a>
                        {this.props.form_index !="0" && (
                            <span style={{  fontSize: '20px',
                                marginRight: '10px',float:"right",cursor:"pointer"}}><i
                                className="fa fa-times"
                                aria-hidden="true" style={{color:'red'}} onClick={()=>{this.props.removeForm(this.props.indexNumber,this.props.form_index,this.props.parent_id)}}></i>
                        </span>
                        )}

                        <span style={{  fontSize: '20px',
                            marginRight: '10px',float:"right",cursor:"pointer"}}><i
                            className="fa fa-plus-square"
                            aria-hidden="true" style={{color:'green'}} onClick={()=>{this.duplicate(this.props.value,this.props.form_index,this.props.parent_id)}}></i>
                        </span>


                    </h3>
                </div>
                <ul>
                    {this.state.customFields && (
                        this.state.customFields.map((value,key)=>{
                            if(typeof value.drop_down_values == "string")
                                value.drop_down_values = JSON.parse(value.drop_down_values);



                            if(value.field_type == "number"){
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
                            }else if(value.field_type == "date"){
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
                            }else if(value.field_type == "datetime"){
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
                            }else if(value.field_type == "bollean"){
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
                            }else if(value.field_type == "dropdown" && (JSON.parse(value.is_multi_select) == true || JSON.parse(value.is_multi_select) == "true")){

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
                            }else if(value.field_type == "dropdown" && (JSON.parse(value.is_multi_select) == false || JSON.parse(value.is_multi_select) == "false")){

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



                        })
                    )}
                </ul>
            </div>




        );
    }//..... end of render() .....//
}//..... end of Member.

FormMemberCustomFields.propTypes = {};

// export default FormMemberCustomFields;

export default FormMemberCustomFields;