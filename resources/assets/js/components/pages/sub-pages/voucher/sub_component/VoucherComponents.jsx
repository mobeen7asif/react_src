import React,{Component} from 'react'
import {connect} from 'react-redux';
import {Scrollbars} from 'react-custom-scrollbars';

import ToggleSwitch from "@trendmicro/react-toggle-switch";
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import DatePicker from 'react-datepicker';
import MultiSelectReact from "multi-select-react";
import {NotificationManager} from "react-notifications";
class VoucherComponents extends Component{
    customDropDownBSpanRef   = null;
    customDropDownShowBRef   = null;
    customDropDownShowOneRef = null;
    customDropDownShowtwoRef = null;
    customDropDowntwoSpanRef = null;
    customDropDownThreeSpanRef = null;
    customDropDownFourSpanRef = null;
    customDropDownShowThreeRef =null;
    customDropDownShowFourRef =null;
    state={
        redemptionData:[{
            'id':1,
            'name':'Standard'
        },{
            'id':2,
            'name':'Similar Products'
        }],
        billingType:(this.props.hasOwnProperty('billingType') && this.props.billingType ) ? this.props.billingType : "Partially Settled",
        billingValues:[],
        billing_status:false,
        billingMessage:"",
        billingFields:{}
    };
    componentDidMount = () => {
        setTimeout(()=>{
            this.getBillingStatus();
        },1000)


    }

    voucherStartDate = (date) => {
        this.props.setKeyValueVoucher('start_date', date);
    };//..... end of handleChangeStartDate() .....//

    voucherEndDate = (date) => {
        this.props.setKeyValueVoucher('end_date', date);
    };//..... end of handleChangeStartDate() .....//


    setDiscountVoucherType = (value) => {
        this.customDropDownShowOneRef.style.display = 'none';
        this.customDropDownOneSpanRef.classList.remove('changeAero');
        if(value =='Free')
            this.props.setKeyValueVoucher('amount',0);

        this.props.setKeyValueVoucher('discount_type',value);
    };//..... end of setDiscountVoucherType() .....//

    handleDropDownOneSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowOneRef.style.display = this.customDropDownShowOneRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownOneSpanClick() .....//

    handleDropDownBSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowBRef.style.display =  this.customDropDownShowBRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownBSpanClick() .....//

    setBusiness = (business,type) => {
        this.customDropDownShowBRef.style.display = 'none';
        this.customDropDownBSpanRef.classList.remove('changeAero');
        this.setState({btnGroupClasses:true});

        this.props.setKeyValueVoucher('business', business);
        if(type == "All"){
            return false;
        }

        this.props.getBusinessCategoriesList(business,true);
    };//..... end of setBusiness() .....//
    optionClicked = (businessList) => {
        this.setSelectedBusinessList(businessList);
    };//..... end of optionClicked() .....//

    selectedBadgeClicked = (businessList) => {
        this.setSelectedBusinessList(businessList);
    };//..... end of selectedBadgeClicked() .....//

    setSelectedBusinessList = (businessList) => {
        this.props.setKeyValueVoucher('businessData', businessList.filter(b => b.value));
    };

    handleDropDownTwoSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowtwoRef.style.display = this.customDropDownShowtwoRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownOneSpanClick() .....//

    setVoucherCateory =(category)=>{
        this.props.setKeyValueVoucher('category',category.name);
        this.props.setKeyValueVoucher('quantity',0);
        this.customDropDownShowtwoRef.style.display = 'none';
        this.customDropDowntwoSpanRef.classList.remove('changeAero');
    }

    handleDropDownThreeSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowThreeRef.style.display = this.customDropDownShowThreeRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownThreeSpanClick() .....//

    handleDropDownFourSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowFourRef.style.display = this.customDropDownShowFourRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownThreeSpanClick() .....//
    changeGroupStatus = (e) =>{
        var value=false;

        if(!this.props.is_group)
            value  = true;

        if(!value)
            this.props.setKeyValueVoucher('group_id',0);
        else {
            let findMember = this.props.groups.find((item) => item.group_name === 'Member').id;
            this.props.setKeyValueVoucher('group_id', findMember);

        }

        this.props.setKeyValueVoucher('is_group',value);
    }
    setGroup =(group)=>{
        this.customDropDownShowThreeRef.style.display = 'none';
        this.customDropDownThreeSpanRef.classList.remove('changeAero');
        this.props.setKeyValueVoucher('group_id',group.id);
    }
    setRedemptionRule = (data) =>{
        this.customDropDownShowFourRef.style.display = 'none';
        this.customDropDownFourSpanRef.classList.remove('changeAero');
        this.props.setKeyValueVoucher('redemption_rule',data.name);
    }


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
                if(aspect == "Partially Settled"){
                    this.setDefaulValues();
                }
                this.setBillingValues();

            });
        this.props.setKeyValueVoucher('billingType', aspect);


    }

    getBillingStatus = () => {

        axios.post(BaseUrl + '/api/get-billing-settings', {venue_id: VenueID})
            .then(response => {
                let billingStatus = this.props.hasOwnProperty('billingStatus') ? this.props.billingStatus : false;
                let initial_billing_fields_type = (this.props.hasOwnProperty('billingType') && this.props.billingType) ? this.props.billingType : "Partially Settled";

                let billing_status = (response.data.billingStatus == 1) ? true : false;
                BillingStatus = billing_status;

                let billingValues = response.data.billingFieldValues;
                let billingFields = {};

                billingValues.forEach((val,key)=>{
                    billingFields = {...billingFields,[val.label]:val.value};
                });



                this.setState(() => ({billing_status,billingType: initial_billing_fields_type}), () => {
                    billingFields = {...billingFields,...this.props.billingFields};
                    if(!billing_status){
                        return false;
                    }

                    this.setState(()=>({billingFields:billingFields}),()=>{
                        this.props.setKeyValueVoucher('billingFields', billingFields);


                        this.props.setKeyValueVoucher('billingStatus', billing_status);
                        this.props.setKeyValueVoucher('billingType', initial_billing_fields_type);

                        this.props.setKeyValueVoucher('voucherFactor', 1);
                        this.fieldEnableDisabled(this.state.billingType);
                        if(this.props.editMode == 0){
                            this.setBillingValues();
                            this.calculateTotal();

                        }

                    });
                });




            }).catch((err) => {
            NotificationManager.error("Error occurred while getting charts data.", 'Error', 1500);

        });



    }

    setDefaulValues = () => {
        let fields = this.state.billingFields ? this.state.billingFields : {};
        let totalFields = parseInt(Object.keys(fields).length);
        let values = parseInt(100 / totalFields);

            Object.keys(fields).map((v,k)=>{
                fields[v] = values;
            });
            this.setState(()=>{billingFields:fields});


        let total = this.calculateTotal();
        let voucherFactor = ((fields['Head Office'])/(100)).toFixed(2);



        this.props.setKeyValueVoucher('voucherFactor', voucherFactor);


        /*this.props.setKeyValueVoucher('billingFields', fields);*/
    }


    setBillingValues = (field_name="",value=0) => {

        if(value > 100)
            return false;


        let fields = this.state.billingFields;
        let totals = 100;
        let totalFields = parseInt(Object.keys(fields).length);


        if(this.state.billingType == "Partially Settled"){
            fields = this.state.billingFields ? this.state.billingFields : {};
            if(field_name !="")
                fields[field_name] = value ? value : 0;


            this.fieldEnableDisabled("Partially Settled");

        }else if(this.state.billingType == "Non-Settled"){
            fields = this.state.billingFields ? this.state.billingFields : {};

            let values = 0;
            Object.keys(fields).map((v,k)=>{
                fields[v] = values;
            });
            fields['Franchise'] = 100;
            this.fieldEnableDisabled("Non-Settled");

        }else{
            fields = this.state.billingFields ? this.state.billingFields : {};

            Object.keys(fields).map((v,k)=>{
                fields[v] = 0;
            });
            fields['Head Office'] = 100;
            this.fieldEnableDisabled("Fully Settled");
        }
        let total = this.calculateTotal();
        let voucherFactor = ((fields['Head Office'])/(100)).toFixed(2);


        this.setState(()=>({billingFields:fields}));
        this.props.setKeyValueVoucher('voucherFactor', voucherFactor);
        this.props.setKeyValueVoucher('billingFields', fields);
        if(total > 100)
            NotificationManager.error("Exceeding 100%.", 'Error', 1500);



    }

    fieldEnableDisabled = (type) => {
        let fields = this.state.billingFields;
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
        let fields = this.state.billingFields ? this.state.billingFields : {};
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
        const selectedOptionsStyles = {
            color: "#3c763d",
            backgroundColor: "#dff0d8"
        };
        const optionsListStyles = {
            backgroundColor: "#fcf8e3",
            color: "#8a6d3b"
        };

        return (
            <div>
                <div className="dropSegmentation_section">
                    <div className="dropSegmentation_heading clearfix">
                        <h3>Voucher Type</h3>
                    </div>
                    <div className="stateSegmentation primary_voucher_setting">
                        <div className="venueIdentification_section">
                            <div className="customDropDown">
                                <span  ref={ref => this.customDropDowntwoSpanRef = ref} onClick={this.handleDropDownTwoSpanClick}> {this.props.category ? this.props.category : 'Select Voucher Category'}</span>
                                <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowtwoRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                        {

                                            this.props.voucherCategory.map((category) => {
                                                return <li key={category.id} onClick={(e)=> {this.setVoucherCateory(category,"")}} className={category.name === this.props.category ? 'selectedItem' : ''}>{category.name}</li>;
                                            })
                                        }
                                    </Scrollbars>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dropSegmentation_section">
                    <div className="dropSegmentation_heading clearfix">
                        <h3>Voucher Name</h3>
                    </div>

                    <div className="stateSegmentation primary_voucher_setting">
                        <div className="venueIdentification_section">
                            <div className="venueIdentification_form">
                                <ul>
                                    <li>
                                        <div className="customInput_div">
                                            <input onChange={(e) => {
                                                let value = e.target.value;
                                                this.props.setKeyValueVoucher("name", value);
                                            }} placeholder="Voucher Name" type="text"
                                                   value={this.props.name ? this.props.name : ''}/>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dropSegmentation_section">
                    <div className="dropSegmentation_heading clearfix">
                        <h3>Discount Type</h3>
                    </div>
                    <div className="stateSegmentation primary_voucher_setting">
                        <div className="venueIdentification_section">
                            <div className="customDropDown">
                                <span  ref={ref => this.customDropDownOneSpanRef = ref} onClick={this.handleDropDownOneSpanClick}> {this.props.discount_type ? (this.props.discount_type == Currency ? 'Fixed' : (this.props.discount_type == '%' &&(this.props.discount_type <= '99')) ? "Percentage" : "Free") : 'Select discount type'}</span>
                                <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowOneRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                        <li onClick={(e)=> {this.setDiscountVoucherType('%')}} className={(this.props.discount_type === '%') && (this.props.discount_type <= '99') ? "selectedItem" : ''}>Percentage</li>
                                        <li onClick={(e)=> {this.setDiscountVoucherType(Currency)}} className={this.props.discount_type === Currency ? "selectedItem" : ''}>Fixed</li>
                                        <li onClick={(e)=> {this.setDiscountVoucherType('Free')}} className={(this.props.discount_type === 'Free') ? "selectedItem" : ''}>Free</li>
                                    </Scrollbars>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {((this.props.discount_type === '%') && (this.props.discount_type <= '99') || (this.props.discount_type === Currency) ) && (
                    <div className="dropSegmentation_section">
                        <div className="dropSegmentation_heading clearfix">
                            <h3>Voucher </h3>
                        </div>
                        <div className="stateSegmentation">
                            <div className="compaignDescription_outer   clearfix">
                                <div className="voucherDiscount">
                                    <label style={{float: 'left',
                                        lineHeight: '50px',
                                        marginRight: '10px'}}>I want to offer a voucher for</label>
                                    <div className="gammingDollar_outer" style={{    float: 'left',
                                        display: 'block'}}>
                                        {( this.props.discount_type == Currency &&
                                            <small>{this.props.discount_type}</small>
                                        )}
                                    </div>

                                    <div className="gammingValue_outer clearfix">
                                        <div className="gamingAmount clearfix">
                                            <input type="text" style={{width: '100%'}} onChange={(e)=>{ this.props.checkDiscountVoucherValue(e); }}  onKeyPress={this.props.backSpaceEnter} value={this.props.amount} />
                                        </div>
                                        <small>{this.props.discount_type === "%" && this.props.discount_type}</small>
                                    </div>
                                    <label>discount on</label>
                                </div>
                            </div>
                        </div>
                    </div>
                ) }



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


                                            {Object.keys(this.state.billingFields).map((value,key)=>{
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
                                                                   value={this.state.billingFields[value]}/>
                                                        </div>

                                                    )
                                                }) }


                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}




                {(IBS ==1) && (
                    <div className="dropSegmentation_section">
                        <div className="dropSegmentation_heading clearfix">
                            <h3>IBS Adjustment Code</h3>
                        </div>
                        <div className="stateSegmentation primary_voucher_setting">
                            <div className="venueIdentification_section">
                                <div className="venueIdentification_form">
                                    <ul>
                                        <li className="voucherDesc">
                                            <div className="segmentInput ">
                                                <input type="text" style={{width: '100%'}} onChange={(e)=>{
                                                    let value = e.target.value;
                                                    if (value.match(/^\d*$/gm))
                                                        this.props.checkValidVoucherIbs(e);
                                                }} value={this.props.pos_ibs?this.props.pos_ibs:''} />
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="dropSegmentation_section">
                    <div className="dropSegmentation_heading clearfix">
                        <h3>Date</h3>
                    </div>

                    <div className="stateSegmentation">
                        <div className="compaignDescription_outer   clearfix">
                            <label>Voucher is valid
                                <span style={{fontSize: '10px',marginLeft: '19px',fontStyle: 'italic', color: 'silver'}}>We are using Australian Eastern Standard Time (AEST), please set your time accordingly</span></label>

                            <div className='venueIdentification_form' >
                                <ul>
                                    <li>
                                        <label>Days</label>
                                        <ToggleSwitch

                                            checked={this.props.is_day ? true : false}
                                            onChange={(e)=> {this.props.showHideDate(e)}}
                                        />
                                        <span style={{fontWeight:'bold'}}> {this.props.is_day ? "ON" : "OFF"}</span>
                                    </li>
                                </ul>


                            </div>
                            <div className="voucherDiscount"   style={{display:(this.props.is_day)?'block':'none'}}>
                                <label style={{float: 'left',
                                    lineHeight: '50px',
                                    marginRight: '10px'}}>Expire after</label>


                                <div className="gammingValue_outer clearfix ">
                                    <div className="gamingAmount clearfix">
                                        <input type="text" style={{width: '100%'}} onChange={(e)=>{
                                            let value = e.target.value;
                                            if (value.match(/^\d*$/gm))
                                                this.props.setKeyValueVoucher('isNumberOfDays',value);
                                        }} value={this.props.isNumberOfDays?this.props.isNumberOfDays:1} />

                                    </div>
                                    <small></small>
                                </div>
                                <label>Days</label>
                            </div>


                            <div className="datePickerOuter clearfix" style={{display:(!this.props.is_day)?'block':'none'}}>
                                <div className="datePickerLeft">
                                    <strong>From</strong>
                                    <div className="datePicker">
                                        <DatePicker selected={this.props.start_date} dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm"  minDate={moment()} onChange={this.voucherStartDate}/>
                                    </div>
                                </div>
                                <div className="datePickerLeft frDatePicker">
                                    <strong>To</strong>
                                    <div className="datePicker">
                                        <DatePicker selected={this.props.end_date} dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm" minDate={this.props.start_date} onChange={this.voucherEndDate}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dropSegmentation_section">
                    <div className="dropSegmentation_heading clearfix">
                        <h3>Promotional Text</h3>
                    </div>
                    <div className="stateSegmentation primary_voucher_setting">
                        <div className="venueIdentification_section">
                            <div className="venueIdentification_form">
                                <ul>
                                    <li className="voucherDesc">
                                        <div className="segmentInput ">
                                            <textarea placeholder="Promotional text" onChange={(e)=>{this.props.setKeyValueVoucher('promotion_text', e.target.value)}} value={this.props.promotion_text ? this.props.promotion_text : ''}></textarea>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dropSegmentation_section">
                    <div className="dropSegmentation_heading clearfix">
                        <h3>No of Uses (Per User)</h3>
                    </div>
                    <div className="stateSegmentation primary_voucher_setting">
                        <div className="venueIdentification_section">
                            <div className="venueIdentification_form">
                                <ul>
                                    <li>
                                        <div className="customInput_div">
                                            <input onChange={(e) => {
                                                let value = e.target.value;
                                                if (value.match(/^\d*$/gm))
                                                    this.props.setKeyValueVoucher('no_of_uses', value);
                                            }} placeholder="No of uses" type="text" value={this.props.no_of_uses ? this.props.no_of_uses : '' }/>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {(this.props.category =='Public Voucher') && (
                        <div className="dropSegmentation_section">
                            <div className="dropSegmentation_heading clearfix">
                                <h3>Quantity (number of vouchers to issue)</h3>
                            </div>
                            <div className='stateSegmentation primary_voucher_setting'>
                                <div className="venueIdentification_section">
                                    <div className="venueIdentification_form">
                                        <ul>
                                            <li>
                                                <div className="customInput_div">
                                                    <input onChange={(e) => {
                                                        let value = e.target.value;
                                                        if (value.match(/^\d*$/gm))
                                                            (this.props.id ==0)?this.props.setKeyValueVoucher('quantity', value):'';
                                                    }} placeholder="Quantity" type="text" value={this.props.quantity ? this.props.quantity : '' } readOnly={this.props.id>0?true:false} />
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                <div className="dropSegmentation_section">
                    <div className="dropSegmentation_heading clearfix">
                        <h3>Redemption Rule</h3>
                    </div>

                    <div className="stateSegmentation">
                        <div className="compaignDescription_outer   clearfix">
                            <div className="venueIdentification_section">
                                <div className="customDropDown">
                                    <span  ref={ref => this.customDropDownFourSpanRef = ref} onClick={this.handleDropDownFourSpanClick}> {this.props.redemption_rule  ? this.props.redemption_rule : 'Select Redemption Rule'}</span>
                                    <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowFourRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                        <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                            {

                                                this.state.redemptionData.map((redeem) => {
                                                    return <li key={redeem.id} onClick={(e)=> {this.setRedemptionRule(redeem,"")}} className={this.state.redemptionData && redeem.name === this.props.redemption_rule ? 'selectedItem' : ''}>{redeem.name}</li>;
                                                })
                                            }
                                        </Scrollbars>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                {(this.props.showDropDown) &&(
                        <div className="dropSegmentation_section">
                            <div className="dropSegmentation_heading clearfix">
                                <h3>Business</h3>
                            </div>
                            <div className="stateSegmentation primary_voucher_setting">
                                <div className="venueIdentification_section">
                                    <div className="venueIdentification_form">
                                        <div className='customDropDown'>
                                            <span  ref={ref => this.customDropDownBSpanRef = ref} onClick={this.handleDropDownBSpanClick}> {this.props.business && this.props.business.hasOwnProperty('business_name') ? this.props.business.business_name : 'Select Business'}</span>
                                            <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowBRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none',zIndex: '3'}} >
                                                <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                    {

                                                        this.props.businessList.map((business) => {
                                                            return <li key={business.business_id} onClick={(e)=> {this.setBusiness(business,"")}} className={this.props.business && business.business_id === this.props.business.business_id ? 'selectedItem' : ''}>{business.business_name}</li>;
                                                        })
                                                    }
                                                </Scrollbars>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    (!this.props.showDropDown) &&(
                        <div className="dropSegmentation_section">
                            <div className="dropSegmentation_heading clearfix">
                                <h3>Business</h3>
                            </div>
                            <div className="stateSegmentation primary_voucher_setting">
                                <div className="venueIdentification_section">

                                    <MultiSelectReact
                                        options={this.props.businessList}
                                        optionClicked={this.optionClicked}
                                        selectedBadgeClicked={this.selectedBadgeClicked}
                                        selectedOptionsStyles={selectedOptionsStyles}
                                        optionsListStyles={optionsListStyles}/>
                                </div>
                            </div>
                        </div>
                    )
                }
                <div className="dropSegmentation_section">
                    <div className="dropSegmentation_heading clearfix">
                        <h3>Member Group</h3>
                    </div>

                    <div className="stateSegmentation">
                        <div className="compaignDescription_outer   clearfix">

                            <div className='venueIdentification_form' >
                                <ul>
                                    <li>
                                        <ToggleSwitch

                                            checked={this.props.is_group ? true : false}
                                            onChange={(e)=> {this.changeGroupStatus(e)}}
                                        />
                                        <span style={{fontWeight:'bold'}}> {this.props.is_group ? "Yes" : "No"}</span>
                                    </li>
                                </ul>


                            </div>
                            <br/><br/>
                            <div className="venueIdentification_section" style={{display:(this.props.is_group)?'block':'none'}}>
                                <div className="customDropDown">
                                    <span  ref={ref => this.customDropDownThreeSpanRef = ref} onClick={this.handleDropDownThreeSpanClick}> {this.props.group_id ? this.props.groups.find( (item) => item.id ===  this.props.group_id).group_name: 'Select Member Group'}</span>
                                    <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowThreeRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                        <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                            {

                                                this.props.groups.map((group) => {
                                                    return <li key={group.id} onClick={(e)=> {this.setGroup(group,"")}} className={this.props.groups && group.id === this.props.group_id ? 'selectedItem' : ''}>{group.group_name}</li>;
                                                })
                                            }
                                        </Scrollbars>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    ...state.voucherBuilder,
});
export default connect(mapStateToProps)(VoucherComponents);