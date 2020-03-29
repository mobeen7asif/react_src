import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {addScheduleValue} from "../../../redux/actions/CampaignBuilderActions";
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import {NotificationManager} from "react-notifications";

class LoyaltyConfiguration extends Component {

    dropDownPopup = null;
    state = {
        number: 0,
        numberId: 0,
        voucher_code:9,
        billing_status:false,
        gift_card:false,
        billingValues:[],
        dropDown_Value:""
    };

    componentDidMount = () => {
        this.getChartData();
    };

    getChartData = () => {
        show_loader();
        var venue_id = VenueID;
        axios.post(BaseUrl + '/api/get-charts-data', {venue_id: venue_id})
            .then(response => {
                if (response.data) {
                    let configureNumber = response.data.numberConfigure ? response.data.numberConfigure : 0 ;
                    let voucherCode = response.data.voucherCode ? response.data.voucherCode : 9;
                    let billing_status = (response.data.billing == 1) ? true : false ;

                    let billingValues = response.data.billingValues;
                    let gift_card = (response.data.giftCard == 1)? true : false;
                    this.setState(() => ({billing_status,billingValues,number:configureNumber.field1,voucher_code:(typeof voucherCode!='null' && typeof voucherCode.field1!='null')?voucherCode.field1:9,gift_card}), () => {

                    });
                    show_loader(true);
                } else {
                    show_loader(true);
                    NotificationManager.error("Error occurred while getting charts data.", 'Error', 1500);
                }
            }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while getting charts data.", 'Error', 1500);

        });

    }

    numericNumber = (e) => {

        this.setState(() => ({number: e}), () => {
            this.addConfigureNumber();
        });
    };

    addConfigureNumber = () => {
        show_loader();
        axios.post(BaseUrl + '/api/add-number-configurations', {
            value: this.state.number,
            type:'configure_numbers',
        }).then(res => {

            show_loader(true);

        }).catch((err) => {
            show_loader(true);

        });
    }
    changeVoucherCode =(e) =>{
        let value = e.target.value;
        this.setState(()=>({
            voucher_code: value
        }),()=>{
            this.addConfigureVoucherCode();
        });
    }
    addConfigureVoucherCode = () => {
        show_loader();
        axios.post(BaseUrl + '/api/add-number-configurations', {
            value: this.state.voucher_code,
            type:'voucher_code'
        }).then(res => {

            show_loader(true);

        }).catch((err) => {
            show_loader(true);

        });
    }

    billingOnOff = () => {
        this.setState((prevState)=>({billing_status:!prevState.billing_status}),()=>{
            this.configureBilling();

        });

    };

    giftCardOnOff = () => {
        this.setState((prevState)=>({gift_card:!prevState.gift_card}),()=>{
            this.configureGiftCard();

        });

    };

    configureBilling = () => {
        show_loader();
        axios.post(BaseUrl + '/api/add-number-configurations', {
            value: this.state.billing_status,
            billingValues:this.state.billingValues,
            type:'billing_on_off'
        }).then(res => {

            show_loader(true);
            NotificationManager.success("Billing setting completed.", 'Success',1500);

        }).catch((err) => {
            show_loader(true);

        });
    };


    openPopup = () => {
        this.dropDownPopup.style.display = "block";
        document.getElementById("config_buttons").style.display="block";

    };
    configureGiftCard = () =>{
        show_loader();
        axios.post(BaseUrl + '/api/add-number-configurations', {
            value: this.state.gift_card,
            type:'gift_card'
        }).then(res => {

            show_loader(true);
            NotificationManager.success("Billing setting completed.", 'Success',1500);

        }).catch((err) => {
            show_loader(true);

        });
    }
    validation = () => {

    };

    closePopup = () => {
        this.setState(()=>({downDownId:0,dropDownValue:"",is_multi_select:false}),()=>{
            this.dropDownPopup.style.display = "none";

        })

    };

    saveDropDown = (value) => {
        let area = document.getElementById("drop_down_values");
        let values = area.value.replace(/\r\n/g,"\n").split("\n");
        values = values.filter(value => value.trim() != "");
        let billingValues = [];
        let franchise = false;
        let headOffice = false;
        values.forEach((value)=>{
            if(value == "Franchise")
                franchise = true;
            if(value == "Head Office")
                headOffice = true;

            billingValues.push({label:value, value:0});
        });

        if(!franchise)
            billingValues.push({label:"Franchise",value:0});

        if(!headOffice)
            billingValues.push({label:"Head Office",value:0});

        if(billingValues.length == 0){
            NotificationManager.error("Please Add some values for drop down.", 'Error',1500);
            return false;
        }
        let duplication = this.checkDuplication(billingValues);
        if(duplication.length > 0){
            NotificationManager.error(`${[...duplication]}`, 'Duplication',3000);
            return false;
        }

        this.setState(()=>({billingValues}),()=>{
            this.configureBilling();
            this.closePopup();
            this.getChartData();
        });




    }
    checkDuplication = (fields) => {
        let uniq = fields
            .map((value) => {
                return {
                    count: 1,
                    label: value.label
                }
            })
            .reduce((a, b) => {
                a[b.label] = (a[b.label] || 0) + b.count
                return a
            }, {})
        let duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);
        return duplicates;

    }
    dropDownSettings = () => {
        let billingValues = this.state.billingValues;
        if(billingValues.length == 0){
            billingValues.push({label:"Franchise", value:0},{label:"Head Office", value:0});
        }

        let dropDown_Value = this.displayInTextArea(billingValues);

        this.setState(()=>({dropDown_Value}),()=>{
            this.openPopup();
        })
    }

    displayInTextArea = (value) => {

        let values = [];
        value.forEach((value,key)=>{
            values.push(value.label);
        });
        return values.join('\r\n');
    }

    textAreaChange = (dropDown_Value) => {
        if(dropDown_Value == ""){
            let billingValues = [];
            if(billingValues.length == 0){
                billingValues.push({label:"Franchise", value:false},{label:"Head Office", value:false});
            }
            this.setState(()=>({billingValues}),()=>{
                let val = this.displayInTextArea(billingValues);
                this.setState(()=>({dropDown_Value:val}));
            });
        }else{
            this.setState(()=>({dropDown_Value}));
        }

    }





    render() {
        return (
            <React.Fragment>
                <div className="dropSegmentation_section" id="loyalty_configuration" style={{height:"800px"}}>

                    <div className="dropSegmentation_heading clearfix">
                        <h3>Loyalty Configuration</h3>
                    </div>

                    <div className="venueInfo_div loyalty_configurations">
                        <div className="venueIdentification_section">
                            <p></p>


                            <div className="venueIdentification_form">

                                <ul>
                                    <li>


                                    </li>
                                    <li>
                                        <label>Voucher Code Pattern:</label>
                                        <div className="radio_button">
                                            <input name="optradio" type="radio"
                                                   checked={!!(this.state.number == 1)}
                                                   onChange={() => {
                                                   }}/>
                                            <label htmlFor="optradio" onClick={() => {
                                                this.numericNumber(1);
                                            }}>Alphanumeric</label>
                                        </div>
                                        <div className="radio_button" style={{marginTop: "-31px",marginLeft:'178px'}}>
                                            <input name="optradio" type="radio"
                                                   checked={!!(this.state.number == 0)}
                                                   onChange={() => {
                                                   }}/>
                                            <label htmlFor="optradio" onClick={() => {
                                                this.numericNumber(0)
                                            }}>Numeric</label>
                                        </div>
                                    </li>
                                    <li>
                                        <label>Voucher code length</label>
                                        <div className="customInput_div">
                                            <input type="text"  placeholder="Code Length" className="editable_input change" maxLength="15" name="rate_grade_1" defaultValue={(this.state.voucher_code) ? this.state.voucher_code : ""} onKeyUp={(e)=>{this.changeVoucherCode(e)}}/>
                                        </div>
                                    </li>

                                    <li>
                                        <div style={{width:"20%",float:"left"}}>
                                            <label className="capitalize">Billing</label>
                                            <ToggleSwitch

                                                checked={this.state.billing_status }
                                                onChange={(e)=> {this.billingOnOff(e)}}
                                            />
                                            <span style={{fontWeight:'bold'}}> {this.state.billing_status ? "On" : "Off"}</span>
                                        </div>
                                        {this.state.billing_status && (
                                            <div  style={{width:"60%",float:"left"}}>
                                                <label className="capitalize">.</label>
                                                <a href="javascript:void(0)">
                                                    <span style={{  fontSize: '20px',
                                                        marginRight: '10px'}}><i
                                                        className="fa fa-list-ul"
                                                        aria-hidden="true" style={{color:'gray'}} onClick={()=>{this.dropDownSettings()}}></i>
                                                                                            </span>
                                                </a>
                                            </div>
                                        )}
                                    </li>
                                    <br/><br/><br/>


                                    <li>
                                        <div style={{width:"20%",float:"left"}}>
                                            <label className="capitalize">Gift Card</label>
                                            <ToggleSwitch

                                                checked={this.state.gift_card }
                                                onChange={(e)=> {this.giftCardOnOff(e)}}
                                            />
                                            <span style={{fontWeight:'bold'}}> {this.state.gift_card ? "On" : "Off"}</span>
                                        </div>
                                    </li>
                                    {/*
                                                                                <li>
                                                                                    <label><b style={{fontWeight: 'bold', fontSize: '14px'}}>Autofill</b> Rating Grade 2</label>
                                                                                    <div className="customInput_div">
                                                                                        <input type="text"  placeholder="Rating Grade 2" className="editable_input change" data-field="rate_grade_2 change" maxLength="15" name="rate_grade_2" defaultValue={ (this.props.venue_loyalty) ? this.props.venue_loyalty.rate_grade_2 : ""} readOnly id="rate_grade_2" />
                                                                                    </div>
                                                                                </li>
                                                                                <li>
                                                                                    <label><b style={{fontWeight: 'bold', fontSize: '14px'}}>Autofill</b> Rating Grade 3</label>
                                                                                    <div className="customInput_div">
                                                                                        <input type="text"  placeholder="Rating Grade 3" className="editable_input change" data-field="rate_grade_3" maxLength="15" name="rate_grade_3" defaultValue={ (this.props.venue_loyalty) ? this.props.venue_loyalty.rate_grade_3 : ""} readOnly id="rate_grade_3" />
                                                                                    </div>
                                                                                </li>
                                                                                <li>
                                                                                    <label><b style={{fontWeight: 'bold', fontSize: '14px'}}>Autofill</b> Rating Grade 4</label>
                                                                                    <div className="customInput_div">
                                                                                        <input type="text"  placeholder="Rating Grade 4" data-field="rate_grade_4" className="editable_input change" maxLength="15" name="rate_grade_4" defaultValue={(this.props.venue_loyalty) ? this.props.venue_loyalty.rate_grade_4 : ""} readOnly id="rate_grade_4" />
                                                                                    </div>
                                                                                </li>
                                                                                <li>
                                                                                    <label><b style={{fontWeight: 'bold', fontSize: '14px'}}>Autofill</b> Rating Grade 5</label>
                                                                                    <div className="customInput_div">
                                                                                        <input type="text"  placeholder="Rating Grade 5" className="editable_input change" data-field="rate_grade_5" maxLength="15" name="rate_grade_5" defaultValue={(this.props.venue_loyalty) ? this.props.venue_loyalty.rate_grade_5 : ""} readOnly id="rate_grade_5" />
                                                                                    </div>
                                                                                </li>

                                                                                <li>
                                                                                    <label><b style={{fontWeight: 'bold', fontSize: '14px'}}>Autofill</b> Rating Grade 6</label>
                                                                                    <div className="customInput_div">
                                                                                        <input type="text"  placeholder="Rating Grade 6" className="editable_input change" maxLength="15" data-field="rate_grade_6" name="rate_grade_6" defaultValue={(this.props.venue_loyalty) ? this.props.venue_loyalty.rate_grade_6 : ""} readOnly id="rate_grade_6" />
                                                                                    </div>
                                                                                </li>*/}
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
                                                    <label>Values <span style={{fontSize: '10px',marginLeft: '19px',fontStyle: 'italic', color: 'silver'}}>(Enter all values line by line)</span></label>
                                                    <textarea id="drop_down_values" style={{width:"100%",height:"150px", border: '2px solid lightgray',padding: '11px',borderRadius: '6px'}} value={this.state.dropDown_Value} onChange={(e)=>{this.textAreaChange(e.target.value)}}></textarea>
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
}//..... end of LoyaltyConfiguration.

LoyaltyConfiguration.propTypes = {};

export default LoyaltyConfiguration;