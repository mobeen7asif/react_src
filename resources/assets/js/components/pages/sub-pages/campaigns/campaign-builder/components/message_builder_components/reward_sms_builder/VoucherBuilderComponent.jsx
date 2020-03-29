import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import {NotificationManager} from 'react-notifications';
import {connect} from "react-redux";
import {
    addMessageBuilderValue,
    setVoucherData,
} from "../../../../../../../redux/actions/CampaignBuilderActions";

import {find} from "lodash";
import {
    selectMessageBuilderObject,
    selectVoucherEndDate,
    selectVoucherStartDate
} from "../../../../../../../redux/selectors/Selectors";

import ToggleSwitch from "@trendmicro/react-toggle-switch";
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
class VoucherBuilderComponent extends Component {
    customDropDownBSpanRef = null;
    customDropDownShowBRef = null;
    state={
        is_day: (this.props.messageBuilder.other.content.hasOwnProperty('isNumberOfDays') && this.props.messageBuilder.other.content.isNumberOfDays) ? true : false,
        billingType:(this.props.messageBuilder.other.content.hasOwnProperty('billingType')) ? this.props.messageBuilder.other.content.billingType : "Partially Settled",
        billingValues:[],
        billing_status:false,
        billingMessage:"",
    }

    setMessageValue = (key, value) => {
        let other = {...this.props.messageBuilder.other};
        other.content[key] = value;
        this.props.dispatch(addMessageBuilderValue({
            [this.props.currentChannel]: {
                ...this.props.messageBuilder,
                other: {...other}
            }
        }));
    };//..... end of setMessageValue() .....//


    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//


    setVoucher = (voucher,type) => {
        this.customDropDownShowBRef.style.display = 'none';
        this.customDropDownBSpanRef.classList.remove('changeAero');

        if(voucher.end_date <  moment().format('YYYY-MM-DD 23:59:59')){
            this.setMessageValue('showDate',true);
        }else{
            this.setMessageValue('showDate',false);
        }

        this.setMessageValue('voucher_id', voucher.id);
    };//..... end of setVoucher() .....//

    handleDropDownBSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowBRef.style.display =  this.customDropDownShowBRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownBSpanClick() .....//


    showHideDate = () => {
        var value = 0;

        this.setState((prevState)=>({is_day:!prevState.is_day}),()=>{
            if(this.state.is_day){

                value = 1;
            }else{

                value = 0;
            }

            this.setMessageValue('isNumberOfDays',value);
            if(value ==1) {
                this.setMessageValue('voucher_start_date', '');
                this.setMessageValue('voucher_end_date', '');
            }
        });
    };//..... end of showHideDate() .....//

    checkNumberOfDays = (e) => {
        let value = e.target.value;

        if (! isFinite(value))
            return false;
        if(value == "")
            value = 1;

        if (value == 0){
            value =1;
        }

        this.setMessageValue('isNumberOfDays',value);
    };//..... end of checkNumberOfDays() ......//

    handleChangeStartDate = (date) => {
        this.setVoucherValidDate('voucher_start_date', date);
    };//..... end of handleChangeStartDate() .....//

    handleChangeEndDate = (date) => {
        this.setVoucherValidDate('voucher_end_date', date);
    };//..... end of handleChangeEndDate() .....//

    setVoucherValidDate = (key, momentObj) => {
        let other = {...this.props.messageBuilder.other};
        other.content[key] =  momentObj.format('DD-MM-YYYY HH:mm');
        other.content['voucher_valid'] = 'between';
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, other: {...other}}}));
    };//..... end of setVoucherValidDate() .....//


    checkNumber = (e) => {
        let value = e.target.value;

        if (!isFinite(value))
            return false;

        return  true;


    };

    handlebillingType = (e, aspect) => {

        this.setState(()=>({
            billingType:aspect
        }),()=>{
            this.setMessageValue('billingType', aspect);
            this.setBillingValues();
        });
    }

    getBillingStatus = () => {
        let billingStatus = this.props.messageBuilder.other.content.hasOwnProperty('billingStatus') ? this.props.messageBuilder.other.content.billingStatus : false;
        let initial_billing_fields_type = this.props.messageBuilder.other.content.hasOwnProperty('billingType') ? this.props.messageBuilder.other.content.billingType : "Partially Settled";
        let initial_billing_fields = this.props.messageBuilder.other.content.hasOwnProperty('billingFields') ? this.props.messageBuilder.other.content.billingFields : {};
        var venue_id = VenueID;
        axios.post(BaseUrl + '/api/get-billing-settings', {venue_id: venue_id})
            .then(response => {


                let billing_status = (response.data.billingStatus == 1) ? true : false;
                BillingStatus = billing_status;

                let billingValues = response.data.billingFieldValues;
                let billingFields = {};
                billingValues.forEach((val,key)=>{

                    billingFields = {...billingFields,[val.label]:val.value};
                });

                this.setState(() => ({billing_status,billingType: initial_billing_fields_type}), () => {
                    billingFields = {...billingFields,...initial_billing_fields};
                    if(!billing_status){
                        return false;
                    }

                    this.setMessageValue('billingStatus', billing_status);

                    this.setMessageValue('billingType', initial_billing_fields_type);
                    this.setMessageValue('billingFields', billingFields);
                    this.setMessageValue('voucherFactor', 1);
                    this.fieldEnableDisabled(initial_billing_fields_type);
                    this.calculateTotal();
                    if(!(this.props.editMode)){
                        this.setDefaulValues();
                        this.setBillingValues();

                    }

                });




            }).catch((err) => {
            NotificationManager.error("Error occurred while getting charts data.", 'Error', 1500);

        });

    }

    setDefaulValues = () => {
        let fields = this.props.messageBuilder.other.content.billingFields;
        let totalFields = parseInt(Object.keys(fields).length);
        let values = parseInt(100 / totalFields);
        if(this.props.editMode == false){
            Object.keys(fields).map((v,k)=>{
                fields[v] = values;
            });
        }
        this.setMessageValue('billingFields', fields);
    }


    setBillingValues = (field_name="",value=0) => {
        if(value > 100)
            return false;

        let fields = this.props.messageBuilder.other.content.billingFields;
        let totals = 100;
        let totalFields = parseInt(Object.keys(fields).length);



        if(this.props.messageBuilder.other.content.billingType == "Partially Settled"){
            fields = this.props.messageBuilder.other.content.billingFields;
            if(field_name !="")
                fields[field_name] = value ? value : 0;


            this.fieldEnableDisabled("Partially Settled");

        }else if(this.props.messageBuilder.other.content.billingType == "Non-Settled"){
            fields = this.props.messageBuilder.other.content.billingFields;

            let values = 0;
            Object.keys(fields).map((v,k)=>{
                fields[v] = values;
            });
            fields['Franchise'] = 100;
            this.fieldEnableDisabled("Non-Settled");

        }else{
            fields = this.props.messageBuilder.other.content.billingFields;

            Object.keys(fields).map((v,k)=>{
                fields[v] = 0;
            });
            fields['Head Office'] = 100;
            this.fieldEnableDisabled("Fully Settled");
        }
        let total = this.calculateTotal();
        let voucherFactor = ((fields['Head Office'])/(100)).toFixed(2);
        this.setMessageValue('billingFields', fields);
        this.setMessageValue('voucherFactor', voucherFactor);
        if(total > 100)
            NotificationManager.error("Exceeding 100%.", 'Error', 1500);



    }

    fieldEnableDisabled = (type) => {
        let fields = this.props.messageBuilder.other.content.billingFields;
        if(type == "Partially Settled"){
            Object.keys(fields).map((v,k)=>{
                $("#"+this.convertSpaceToUnderscore(v)).removeClass("pointer_events");
            });
        }else if(type == "Non-Settled"){
            Object.keys(fields).map((v,k)=>{
                $("#"+this.convertSpaceToUnderscore(v)).addClass("pointer_events");
            });
        }else{
            Object.keys(fields).map((v,k)=>{
                $("#"+this.convertSpaceToUnderscore(v)).addClass("pointer_events");
            });
        }
    }
    convertSpaceToUnderscore = (str) => {

        if(str)
            return str.replace(/\s+/g, '_').toLowerCase();
        else
            return "";
    };

    calculateTotal = () => {
        let fields = this.props.messageBuilder.other.content.billingFields;
        let total = 0;
        Object.keys(fields).map((v,k)=>{
            total = (parseInt(total) + parseInt(fields[v]));
        });
        total = parseInt(total);
        if(total != 100)
            this.setState(()=>({billingMessage:"(Sum of all values must be 100.)"}));
        else
            this.setState(()=>({billingMessage:""}));

        return total;
    }

    render() {


        return (
            <div className="messageBuilder_outer ">
                <div className="messageBuilder_heading">
                    <h3>Vouchers</h3>
                    <p></p>
                </div>
                <div className="pushNotification_section clearfix">
                    <div>
                        <div className="segment_heading segmentaxn_heading">
                            <h3>Select Voucher</h3>
                        </div>
                        <div className="smsDetail_inner primary_voucher_setting">

                            <div className="dropSegmentation_section">
                                <div className="dropSegmentation_heading clearfix">
                                    <h3>Voucher</h3>
                                </div>
                                <div className="stateSegmentation primary_voucher_setting">
                                    <div className="venueIdentification_section">
                                        <div className="venueIdentification_form">
                                            <div className='customDropDown'>
                                                <span  ref={ref => this.customDropDownBSpanRef = ref} onClick={this.handleDropDownBSpanClick}> {this.props.messageBuilder.other.content.voucher_id ? this.props.voucherListData.find( (item) => item.id ===  this.props.messageBuilder.other.content.voucher_id).name : 'Select Voucher'}</span>
                                                <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowBRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none',zIndex: '3'}} >
                                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                        {

                                                            this.props.voucherListData.map((voucher) => {
                                                                return <li key={voucher.id} onClick={(e)=> {this.setVoucher(voucher,"")}} className={ voucher.id === this.props.messageBuilder.other.content.voucher_id ? 'selectedItem' : ''}>{(voucher.voucher_type!='group-voucher')?<a>{voucher.name}</a>:<a>{voucher.name}<a style={{marginLeft:"3%",color:'blue', fontWeight:'bold',textTransform:'uppercase'}}>Group Voucher</a></a>}</li>;
                                                            })
                                                        }
                                                    </Scrollbars>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {(this.state.billing_status) && (
                                <div className="dropSegmentation_section" style={{overflow:"hidden",padding:"6px"}}>
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Billing <span style={{color:"red",fontSize: "12px",marginLeft:"20px"}}> <i>{this.state.billingMessage}</i> </span></h3>
                                    </div>
                                    <div className="stateSegmentation primary_voucher_setting">
                                        <div className="venueIdentification_section">
                                            <div className="venueIdentification_form">
                                                <ul>
                                                    <li>
                                                        <div className="customInput_div">
                                                            <div className="placeholder_radio_column" style={{width: '30%'}}>
                                                                <div className="radio_button">
                                                                    <input id="test_10" name="radio-group-voucher" type="radio"
                                                                           checked={this.state.billingType == "Partially Settled" ? 'checked' : ''}
                                                                           onChange={(e) => { this.handlebillingType(e, "Partially Settled") }}
                                                                    />
                                                                    <label htmlFor="test_10">Partially Settled</label>
                                                                </div>
                                                            </div><div className="placeholder_radio_column" style={{width: '30%'}}>
                                                            <div className="radio_button">
                                                                <input id="test_22" name="radio-group-voucher" type="radio"
                                                                       checked={this.state.billingType == "Fully Settled" ?'checked':''}
                                                                       onChange={(e) => { this.handlebillingType(e, "Fully Settled") }}
                                                                />
                                                                <label htmlFor="test_22">Fully Settled</label>
                                                            </div>
                                                        </div>
                                                            <div className="placeholder_radio_column" style={{width: '30%'}}>
                                                                <div className="radio_button">
                                                                    <input id="test_31" name="radio-group-voucher" type="radio"
                                                                           checked={this.state.billingType == "Non-Settled" ? 'checked':''}
                                                                           onChange={(e) => { this.handlebillingType(e, "Non-Settled") }}
                                                                    />
                                                                    <label htmlFor="test_31">Non-Settled</label>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {this.props.messageBuilder.other.content.hasOwnProperty("billingFields") && (
                                                            Object.keys(this.props.messageBuilder.other.content.billingFields).map((value,key)=>{
                                                                return (
                                                                    <div className="voucher_outer"  key={key}>
                                                                        <label style={{textAlign:"center"}}>{value}</label>
                                                                        <input id={this.convertSpaceToUnderscore(value)} className="voucher_inputs" onChange={(e) => {
                                                                            let val = e.target.value;
                                                                            let is_number = false;
                                                                            if (val.match(/^\d*$/gm))
                                                                                is_number = this.checkNumber(e);
                                                                            if(is_number)
                                                                                this.setBillingValues(value, val);
                                                                        }} placeholder={value} type="text"
                                                                               value={this.props.messageBuilder.other.content.billingFields[value]}/>
                                                                    </div>

                                                                )
                                                            })
                                                        )}

                                                    </li>

                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}


                            <div className="dropSegmentation_section" style={{display:(this.props.messageBuilder.other.content.showDate)?'block':'none'}}>
                                <div className="dropSegmentation_heading clearfix">
                                    <h3>Date</h3>
                                    {/* <div className="segmntClose">
                                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                                    </div>*/}
                                </div>

                                <div className="stateSegmentation">
                                    <div className="compaignDescription_outer   clearfix">
                                        <label></label>
                                        {/*<div className="placeHolderOuter expandPlaceholder clearfix">
                                             <div className="customDropDown">
                                                 <span>Between</span>
                                                 <ul className="customDropDown_show customPlaceHolder">
                                                     <li>Between</li>
                                                 </ul>
                                             </div>
                                        </div>*/}

                                        <div className='venueIdentification_form' >
                                            <ul>
                                                <li>
                                                    <label>Days</label>
                                                    <ToggleSwitch

                                                        checked={this.state.is_day ? true : false}
                                                        onChange={(e)=> {this.showHideDate(e)}}
                                                    />
                                                    <span style={{fontWeight:'bold'}}> {this.state.is_day ? "ON" : "OFF"}</span>
                                                </li>
                                            </ul>


                                        </div>
                                        <div className="voucherDiscount"  style={{display:(this.state.is_day)?"block":"none"}}>
                                            <label style={{float: 'left',
                                                lineHeight: '50px',
                                                marginRight: '10px'}}>Expire after</label>


                                            <div className="gammingValue_outer clearfix">
                                                <div className="gamingAmount clearfix">
                                                    <input type="text" style={{width: '100%'}} onChange={(e)=>{
                                                        let value = e.target.value;
                                                        if (value.match(/^\d*$/gm))
                                                            this.checkNumberOfDays(e);
                                                    }} value={this.props.messageBuilder.other.content.isNumberOfDays?this.props.messageBuilder.other.content.isNumberOfDays:1} />

                                                </div>
                                                <small></small>
                                            </div>
                                            <label>Days</label>
                                        </div>


                                        <div className="datePickerOuter clearfix"  style={{display:(!this.state.is_day)?"block":"none"}}>
                                            <div className="datePickerLeft">
                                                <strong>From</strong>
                                                <div className="datePicker">
                                                    <DatePicker selected={this.props.startDate} dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm"  minDate={moment()} onChange={this.handleChangeStartDate}/>
                                                </div>
                                            </div>
                                            <div className="datePickerLeft frDatePicker">
                                                <strong>To</strong>
                                                <div className="datePicker">
                                                    <DatePicker selected={this.props.endDate} dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm" minDate={this.props.startDate} onChange={this.handleChangeEndDate}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>

        );
    }//..... end of render() .....//
}//..... end of VoucherBuilderComponent.

const mapStateToProps = (state) => {
    return {
        ...state.campaignBuilder,
        messageBuilder  : selectMessageBuilderObject(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        voucher:state.voucherBuilder,
        startDate       : selectVoucherStartDate(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        endDate         : selectVoucherEndDate(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
    };
};
export default connect(mapStateToProps)(VoucherBuilderComponent);