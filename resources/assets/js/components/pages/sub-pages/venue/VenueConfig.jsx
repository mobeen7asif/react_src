import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PosOnboarding from "./PosOnboarding";
import VenueAccountUsers from "./VenueAccountUsers";
import BeaconConfiguration from "./BeaconConfiguration";
import {NotificationManager} from "react-notifications";
import AppSkinning from "./AppSkinning";
import AutoCheckout from "./AutoCheckout";
import PaymentGatway from "./PaymentGatway";
import PosCofiguration from "./PosCofiguration";
import CustomFields from "./CustomFields";
import Autocomplete from 'react-autocomplete';
import MemberFields from "./MemberFields";
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import LoyaltyConfiguration from "./LoyaltyConfiguration";
import SegmentCriteria from "./Subcomponent/SegmentCriteria";
class VenueConfig extends Component {
    dropDownUlRef = null;
    dropDownLabelRef = null;
    dropDownUlRef2 = null;
    dropDownLabelRef2 = null;
    dropDownPopup = null;
    state = {
        defaultPage: "default",
        compaing_satu_alerts: "",
        compaing_satu_block: "",
        contact_perioud_start_sms: '',
        contact_perioud_end_sms: '',
        contact_perioud_start_point_me: '',
        contact_perioud_end_point_me: '',
        is_open_sun: false,
        is_open_mon: false,
        is_open_tue: false,
        is_open_wed: false,
        is_open_thu: false,
        is_open_fri: false,
        is_open_sat: false,
        sun_start: "",
        sun_end: "",
        mon_start: "",
        mon_end: "",
        tue_start: "",
        tue_end: "",
        wed_start: "",
        wed_end: "",
        thu_start: "",
        thu_end: "",
        friday_start: "",
        friday_end: "",
        sat_start: "",
        sat_end: "",
        reward: (this.props.venue_conpain_saturation) ? this.props.venue_conpain_saturation.is_reward : "",
        venueData: [],
        payment_gatway: false,
        email_test_recipents: [],
        emails_value: "",
        sms_test_recipents: [],
        phone_value: "",
        app_test_recipents: [],
        app_value: "",
        value: "",
        value1: "",
        value2: "",
        searchValue: [],
        number: 0,
        numberId: 0,
        voucher_code:9,
        billing_status:false,
        billingValues:[],
        dropDown_Value:""

    };
    saveVenueRef = null;
    editVenueRef = null;
    discardVenueRef = null;
    editLoyaltyRef = null;
    saveLoyaltyRef = null;
    discardLoyaltyRef = null;
    editAlertRef = null;
    saveAlertRef = null;
    discardAlertRef = null;
    editSaturationRef = null;
    saveSaturationRef = null;
    discardSaturationRef = null;

    componentDidMount = () => {
        this.addMenue();
        let app_test_recipents = (this.props.venue_test_alerts && this.props.venue_test_alerts.application_recipient) ? JSON.parse(this.props.venue_test_alerts.application_recipient) : [];
        let sms_test_recipents = (this.props.venue_test_alerts && this.props.venue_test_alerts.mobile) ? JSON.parse(this.props.venue_test_alerts.mobile) : [];
        let email_test_recipents = (this.props.venue_test_alerts && this.props.venue_test_alerts.recipient_email) ? JSON.parse(this.props.venue_test_alerts.recipient_email) : [];

        this.setState(() => ({
            compaing_satu_block: (this.props.venue_conpain_saturation) ? this.props.venue_conpain_saturation.compaing_satu_block : "",
            compaing_satu_alerts: (this.props.venue_conpain_saturation) ? this.props.venue_conpain_saturation.compaing_satu_alerts : "",
            app_test_recipents,
            sms_test_recipents,
            email_test_recipents
        }));

        /* $("body").on("click",".customDropDown span",function (e) {
             $(this).toggleClass('changeAero');
             $(this).parent().find(".customDropDown_show").toggle();
         });

         $("body").on("click",".customDropDown_show li",function (e) {
             var selecttext = $(this).text();
             $(this).parents('.customDropDown').find("span").text(selecttext);
             $(".customDropDown_show").hide();
             $('.customDropDown span').removeClass('changeAero');

         });*/
        this.saveVenueRef.style.display = "none";
        this.saveLoyaltyRef.style.display = "none";
        this.saveAlertRef.style.display = "none";
        this.saveSaturationRef.style.display = "none";
        this.discardVenueRef.style.display = 'none';
        this.discardLoyaltyRef.style.display = "none";
        this.discardAlertRef.style.display = "none";
        this.discardSaturationRef.style.display = "none";

    };


    updateReward = (value) => {
        this.setState({reward: !value});

    };

    checkboxState = (key, value) => {
        var a = {};
        a[key] = !value;
        this.setState(a);
    }

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    getVenueData = (data) => {
        this.setState(() => ({venueData: data.data}), () => {
            this.setState(() => ({venueData: data.data}));
        });
    };

    loadComponents = () => {
        switch (this.state.defaultPage) {
            case "pos_onboarding":
                return <PosOnboarding/>
            case "beacon_config":
                return <BeaconConfiguration/>
            case "v_acc":
                return <VenueAccountUsers/>
            case "app_skinning":
                return <AppSkinning venueData={this.state.venueData}/>
            case "auto_checkout_setting":
                return <AutoCheckout getVenueData={this.getVenueData}/>
            case "payment_gatway":
                return <PaymentGatway/>
            case 'pos_configuration':
                return <PosCofiguration/>
            case 'loyalty_configuration':
                return <LoyaltyConfiguration/>
            case 'member_fields':
                return <MemberFields/>
            case 'custom_fields':
                return <CustomFields venueData={this.state.venueData}/>;
                case 'segment_criteria':
                return <SegmentCriteria />

        }

    }

    onChangeSearch = (e, searchBy,value2) => {

        let value = e.target.value;
        this.setState(() => ({[value2]: value}));

        /*if(value.length <=2 && value !="")
            return false;*/
        show_loader();

        axios.post(BaseUrl + '/api/getMembershipType', {
            value: value,
            searchBy
        }).then(res => {
            this.setState(() => ({searchValue: res.data.data}));
            show_loader(true);

        }).catch((err) => {
            show_loader(true);

        });
    };
    onSelectSearch = (e, stateKey,value2) => {

        let value = this.state[stateKey];
        value.push(e);
        var unique = value.filter((v, i, a) => a.indexOf(v) === i);
        this.setState(() => ({[value2]: "", searchValue:[], [stateKey]: unique}), () => {
            console.log(this.state[stateKey]);
        });

    };

    onSelectApp = (e, stateKey,value2) => {
        let value = this.state[stateKey];
        let v = e.split(":");
        value.push(v[1]);
        var unique = value.filter((v, i, a) => a.indexOf(v) === i);
        /*this.setState(()=>({value:"",[stateKey]:unique}),()=>{
                console.log(this.state[stateKey])
        });*/
        this.setState(() => ({[value2]: "", searchValue:[], [stateKey]: unique}), () => {
            console.log(this.state[stateKey]);
        });

    };

    removeRecipent = (removeValue, stateKey,value2) => {
        let value = this.state[stateKey];
        let v = value.filter((v, k) => {
            return v != removeValue;
        });
        this.setState(() => ({[value2]: "", [stateKey]: v}), () => {

        });
    }





    render() {
        return (
            <div>
                <div className="autoContent">

                    <div className="compaignHeadigs">
                        <h1>Site Configuration</h1>
                        <p>View and edit your site’s configuration</p>
                    </div>

                    <div className="compaigns_list_content venue_level_configurations">
                        <div className="compaigns_list_detail">

                            <div className="compaign_segments">

                                <div className="segment_tYpe">
                                    <div className="segment_tYpe_heading">
                                        <h3>Site Level Configuration</h3>
                                    </div>
                                    <div className="segment_tYpe_detail">
                                        <div className="selectDescription">
                                            <p>View and edit your site’s account details here.</p>
                                        </div>

                                        <div className="segmentsBuilder_container clearfix">
                                            <div className="segmentsSection_left">
                                                <div className="segment_heading">
                                                    <h3>CONFIGURATION</h3>
                                                </div>


                                                <div className="venueConfig">
                                                    <div className="venueConfig_inner">
                                                        <div className="venueSeprator"></div>
                                                        <ul>
                                                            <li id="ul_li_1">
                                                                <a onClick={this.getName}
                                                                   className="venuecounter venueDtail_ancor clickVenue"
                                                                   page-name="default" data-id="v_VenueDetails"
                                                                   style={{cursor: 'pointer'}}>
                                                                    <b>1</b><small>Site Details</small>
                                                                </a>


                                                                <div className="showVenue_data slide1">
                                                                    <div className="dragVenueData">
                                                                        <h4><a className="clickVenue"
                                                                               page-name="default" data-id="v_identity"
                                                                               style={{cursor: 'pointer'}}>Site
                                                                            Identification</a></h4>
                                                                    </div>
                                                                    <div className="dragVenueData">
                                                                        <h4><a className="clickVenue"
                                                                               page-name="default"
                                                                               data-id="v_opratingHour"
                                                                               style={{cursor: 'pointer'}}>Operating
                                                                            Hours</a></h4>
                                                                    </div>
                                                                    <div className="dragVenueData">
                                                                        <h4><a className="clickVenue"
                                                                               page-name="default"
                                                                               data-id="v_media_links"
                                                                               style={{cursor: 'pointer'}}>Social Media
                                                                            Links</a></h4>
                                                                    </div>
                                                                    <div className="dragVenueData">
                                                                        <h4><a className="clickVenue"
                                                                               page-name="default" data-id="v_senderId"
                                                                               style={{cursor: 'pointer'}}>Sender
                                                                            ID's</a></h4>
                                                                    </div>
                                                                </div>
                                                            </li>

                                                            <li id="ul_li_2">
                                                                <a onClick={this.getName}
                                                                   className="venuecounter venueDtail_ancor1 clickVenue"
                                                                   page-name="default" data-id="v_VenueDetailsCustom"
                                                                   style={{cursor: 'pointer'}}>
                                                                    <b>1</b><small>Custom Fields</small>
                                                                </a>


                                                                <div className="showVenue_data slide2">
                                                                    <div className="dragVenueData">
                                                                        <h4><a className="clickVenue"
                                                                               page-name="custom_fields"
                                                                               data-id="custom_fields"
                                                                               style={{cursor: 'pointer'}}>Members</a>
                                                                        </h4>
                                                                    </div>

                                                                </div>
                                                            </li>

                                                            <li>
                                                                <a className="venuecounter clickVenue"
                                                                   style={{cursor: 'pointer'}}
                                                                   page-name="loyalty_configuration"
                                                                   data-id="loyalty_configuration">
                                                                    <b>11</b><small>Loyalty Configuration</small>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a className="venuecounter clickVenue"
                                                                   page-name="default" data-id="v_testCompaign"
                                                                   style={{cursor: 'pointer'}}>
                                                                    <b>3</b><small>Campaign Tests &amp; Alerts</small>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a className="venuecounter clickVenue"
                                                                   page-name="default" data-id="v_saturationCompaign"
                                                                   style={{cursor: 'pointer'}}>
                                                                    <b>4</b><small>Campaign Saturation &amp; Non-Contact<br/> Period
                                                                    Controls</small>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a className="venuecounter clickVenue"
                                                                   style={{cursor: 'pointer'}}
                                                                   page-name="pos_configuration"
                                                                   data-id="pos_configuration">
                                                                    <b>10</b><small>POS Configuration</small>
                                                                </a>
                                                            </li>

                                                            <li>
                                                                <a className="venuecounter clickVenue"
                                                                   page-name="pos_onboarding" data-id="v_posBording"
                                                                   style={{cursor: 'pointer'}}>
                                                                    <b>5</b><small>POS Onboarding</small>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a className="venuecounter clickVenue"
                                                                   page-name="beacon_config" data-id="v_beaconConfig"
                                                                   style={{cursor: 'pointer'}}>
                                                                    <b>6</b><small>Beacon Configuration</small>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a className="venuecounter clickVenue"
                                                                   style={{cursor: 'pointer'}} onClick={(e) => {
                                                                    this.venueAccountUser()
                                                                }} page-name="v_acc" data-id="v_acc">
                                                                    <b>7</b><small>Site Accounts</small>
                                                                </a>
                                                            </li>

                                                            <li>
                                                                <a className="venuecounter clickVenue"
                                                                   style={{cursor: 'pointer'}} page-name="app_skinning"
                                                                   data-id="app_skinning">
                                                                    <b>8</b><small>App Skinning</small>
                                                                </a>
                                                            </li>

                                                            <li>
                                                                <a className="venuecounter clickVenue"
                                                                   style={{cursor: 'pointer'}}
                                                                   page-name="auto_checkout_setting"
                                                                   data-id="auto_checkout_setting">
                                                                    <b>9</b><small>Auto Checkout</small>
                                                                </a>
                                                            </li>

                                                            <li>
                                                                <a className="venuecounter clickVenue"
                                                                   style={{cursor: 'pointer'}}
                                                                   page-name="payment_gatway" data-id="payment_gatway">
                                                                    <b>10</b><small>Payment Gateway</small>
                                                                </a>
                                                            </li>
                                                            {(appPermission("MemberGroup","view")) && (
                                                            <li>
                                                                <a className="venuecounter clickVenue"
                                                                   style={{cursor: 'pointer'}} page-name="member_fields"
                                                                   data-id="member_fields">
                                                                    <b>8</b><small>Member Groups</small>
                                                                </a>
                                                            </li>


                                                            )}

                                                           <li>
                                                                <a className="venuecounter clickVenue"
                                                                   style={{cursor: 'pointer'}} page-name="segment_criteria"
                                                                   data-id="segment_criteria">
                                                                    <b>8</b><small>Segment Criteria</small>
                                                                </a>
                                                            </li>


                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="segmentsSection_right">
                                                <div className="segment_heading segmentaxn_heading">
                                                    <h3>SITE INFORMATION</h3>
                                                </div>


                                                <div className="segmentaxn_detail venuePortal">


                                                        <span>
                                                            <div className="dropSegmentation_section" id="v_identity">

                                                                <div className="dropSegmentation_heading clearfix">
                                                                    <h3>Site Identification</h3>
                                                                </div>

                                                                <div className="venueInfo_div">
                                                                    <div className="venueIdentification_section">
                                                                        <p>Site ID is unique and cannot be changed. Site Account Name is displayed on the Alveo Dashboard only.</p>


                                                                        <div className="venueIdentification_form">
                                                                            <ul>
                                                                                <li>
                                                                                    <label>Site ID</label>
                                                                                    <div className="customInput_div">

                                                                                        <input type="text"
                                                                                               className="change"
                                                                                               placeholder="Site ID"
                                                                                               name="venue_id"
                                                                                               defaultValue={(this.props.venue_data) ? this.props.venue_data.venue_id : ""}
                                                                                               readOnly id="venue_id"
                                                                                               placeholder="Venue Id"/>
                                                                                    </div>
                                                                                </li>

                                                                                <li>
                                                                                    <label>Site Account Name</label>
                                                                                    <div className="customInput_div">
                                                                                        <input className="change"
                                                                                               type="text"
                                                                                               name="venue_account_name"
                                                                                               readOnly
                                                                                               defaultValue={(this.props.venue_data) ? this.props.venue_data.venue_name : ""}
                                                                                               required="required"
                                                                                               id="account_id"
                                                                                               placeholder="Venue Account Name"/>
                                                                                    </div>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>

                                                            <div className="dropSegmentation_section"
                                                                 id="v_opratingHour">

                                                                <div className="dropSegmentation_heading clearfix">
                                                                    <h3>Operating Hours</h3>
                                                                </div>

                                                                <div className="venueInfo_div">
                                                                    <div className="venueIdentification_section">
                                                                        <p>Set the parameters for reporting on daily visitation, turnover and spend for your site.</p>
                                                                    </div>


                                                                    <div className="oprationHour_listing">
                                                                        <ul>
                                                                            <li>
                                                                                <div className="dayOption clearfix">
                                                                                    <strong>Sunday</strong>


                                                                                    <div className="onoffswitch">
                                                                                        <input name="sunday"
                                                                                               className="onoffswitch-checkbox operating_hours"
                                                                                               id="sunday"
                                                                                               type="checkbox"
                                                                                               defaultChecked={this.state.is_open_sun}
                                                                                               onClick={(e) => {
                                                                                                   this.checkboxState('is_open_sun', this.state.is_open_sun)
                                                                                               }}/>
                                                                                        <label
                                                                                            className="onoffswitch-label"
                                                                                            htmlFor="sunday">
                                                                                            <span
                                                                                                className="onoffswitch-inner"></span>
                                                                                            <span
                                                                                                className="onoffswitch-switch"></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>

                                                                                <div
                                                                                    className="dayOption_range yourSeg_age_rangeSlct">
                                                                                    <div>
                                                                                        <input type="text"
                                                                                               className="weeklyRange_time"
                                                                                               id="sunday_venue"
                                                                                               name="range"/>
                                                                                    </div>
                                                                                </div>
                                                                            </li>


                                                                            <li>
                                                                                <div className="dayOption clearfix">
                                                                                    <strong>monday</strong>


                                                                                    <div className="onoffswitch">
                                                                                        <input name="monday"
                                                                                               className="onoffswitch-checkbox operating_hours"
                                                                                               id="monday"
                                                                                               type="checkbox"
                                                                                               defaultChecked={this.state.is_open_mon}
                                                                                               onClick={(e) => {
                                                                                                   this.checkboxState('is_open_mon', this.state.is_open_mon)
                                                                                               }}/>
                                                                                        <label
                                                                                            className="onoffswitch-label"
                                                                                            htmlFor="monday">
                                                                                            <span
                                                                                                className="onoffswitch-inner"></span>
                                                                                            <span
                                                                                                className="onoffswitch-switch"></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>

                                                                                <div
                                                                                    className="dayOption_range yourSeg_age_rangeSlct">
                                                                                    <div>
                                                                                        <input type="text"
                                                                                               className="weeklyRange_time"
                                                                                               id="monday_venue"
                                                                                               name="range"/>
                                                                                    </div>
                                                                                </div>
                                                                            </li>


                                                                            <li>
                                                                                <div className="dayOption clearfix">
                                                                                    <strong>tuesday</strong>


                                                                                    <div className="onoffswitch">
                                                                                        <input name="tuesday"
                                                                                               className="onoffswitch-checkbox operating_hours"
                                                                                               id="tuesday"
                                                                                               type="checkbox"
                                                                                               defaultChecked={this.state.is_open_tue}
                                                                                               onClick={(e) => {
                                                                                                   this.checkboxState('is_open_tue', this.state.is_open_tue)
                                                                                               }}/>
                                                                                        <label
                                                                                            className="onoffswitch-label"
                                                                                            htmlFor="tuesday">
                                                                                            <span
                                                                                                className="onoffswitch-inner"></span>
                                                                                            <span
                                                                                                className="onoffswitch-switch"></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>

                                                                                <div
                                                                                    className="dayOption_range yourSeg_age_rangeSlct">
                                                                                    <div>
                                                                                        <input type="text"
                                                                                               className="weeklyRange_time"
                                                                                               id="tuesday_venue"
                                                                                               name="range"/>
                                                                                    </div>
                                                                                </div>
                                                                            </li>


                                                                            <li>
                                                                                <div className="dayOption clearfix">
                                                                                    <strong>wednesday</strong>


                                                                                    <div className="onoffswitch">
                                                                                        <input name="wednesday"
                                                                                               className="onoffswitch-checkbox operating_hours"
                                                                                               id="wednesday"
                                                                                               type="checkbox"
                                                                                               defaultChecked={this.state.is_open_wed}
                                                                                               onClick={(e) => {
                                                                                                   this.checkboxState('is_open_wed', this.state.is_open_wed)
                                                                                               }}/>
                                                                                        <label
                                                                                            className="onoffswitch-label"
                                                                                            htmlFor="wednesday">
                                                                                            <span
                                                                                                className="onoffswitch-inner"></span>
                                                                                            <span
                                                                                                className="onoffswitch-switch"></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>

                                                                                <div
                                                                                    className="dayOption_range yourSeg_age_rangeSlct">
                                                                                    <div>
                                                                                        <input type="text"
                                                                                               className="weeklyRange_time"
                                                                                               id="wednesday_venue"
                                                                                               name="range"/>
                                                                                    </div>
                                                                                </div>
                                                                            </li>


                                                                            <li>
                                                                                <div className="dayOption clearfix">
                                                                                    <strong>thursday</strong>


                                                                                    <div className="onoffswitch">
                                                                                        <input name="thursday"
                                                                                               className="onoffswitch-checkbox operating_hours"
                                                                                               id="thursday"
                                                                                               type="checkbox"
                                                                                               defaultChecked={this.state.is_open_thu}
                                                                                               onClick={(e) => {
                                                                                                   this.checkboxState('is_open_thu', this.state.is_open_thu)
                                                                                               }}/>
                                                                                        <label
                                                                                            className="onoffswitch-label"
                                                                                            htmlFor="thursday">
                                                                                            <span
                                                                                                className="onoffswitch-inner"></span>
                                                                                            <span
                                                                                                className="onoffswitch-switch"></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>

                                                                                <div
                                                                                    className="dayOption_range yourSeg_age_rangeSlct">
                                                                                    <div>
                                                                                        <input type="text"
                                                                                               className="weeklyRange_time"
                                                                                               id="thursday_venue"
                                                                                               name="range"/>
                                                                                    </div>
                                                                                </div>
                                                                            </li>

                                                                            <li>
                                                                                <div className="dayOption clearfix">
                                                                                    <strong>friday</strong>


                                                                                    <div className="onoffswitch">
                                                                                        <input name="friday"
                                                                                               className="onoffswitch-checkbox operating_hours"
                                                                                               id="friday"
                                                                                               type="checkbox"
                                                                                               defaultChecked={this.state.is_open_fri}
                                                                                               onClick={(e) => {
                                                                                                   this.checkboxState('is_open_fri', this.state.is_open_fri)
                                                                                               }}/>
                                                                                        <label
                                                                                            className="onoffswitch-label"
                                                                                            htmlFor="friday">
                                                                                            <span
                                                                                                className="onoffswitch-inner"></span>
                                                                                            <span
                                                                                                className="onoffswitch-switch"></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>

                                                                                <div
                                                                                    className="dayOption_range yourSeg_age_rangeSlct">
                                                                                    <div>
                                                                                        <input type="text"
                                                                                               className="weeklyRange_time"
                                                                                               id="friday_venue"
                                                                                               name="range"/>
                                                                                    </div>
                                                                                </div>
                                                                            </li>

                                                                            <li>
                                                                                <div className="dayOption clearfix">
                                                                                    <strong>saturday </strong>


                                                                                    <div className="onoffswitch">

                                                                                        <input name="saturday"
                                                                                               className="onoffswitch-checkbox operating_hours"
                                                                                               id="saturday"
                                                                                               defaultChecked={this.state.is_open_sat}
                                                                                               onClick={(e) => {
                                                                                                   this.checkboxState('is_open_sat', this.state.is_open_sat)
                                                                                               }} type="checkbox"/>
                                                                                        <label
                                                                                            className="onoffswitch-label"
                                                                                            htmlFor="saturday">
                                                                                            <span
                                                                                                className="onoffswitch-inner"></span>
                                                                                            <span
                                                                                                className="onoffswitch-switch"></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>

                                                                                <div
                                                                                    className="dayOption_range yourSeg_age_rangeSlct">
                                                                                    <div>
                                                                                        <input type="text"
                                                                                               className="weeklyRange_time"
                                                                                               id="saturday_venue"
                                                                                               name="range"/>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>

                                                            </div>

                                                            <div className="dropSegmentation_section"
                                                                 id="v_media_links">
                                                                <div className="dropSegmentation_heading clearfix">
                                                                    <h3>Social Media Links</h3>
                                                                </div>

                                                                <div className="venueInfo_div">
                                                                    <div className="venueIdentification_section">
                                                                        <p>Add your site's social media account links here to easily integrate them in to your campaigns.</p>


                                                                        <div className="venueIdentification_form">
                                                                            <ul>
                                                                                <li>
                                                                                    <div
                                                                                        className="socialMediaLinks_list clearfix">
                                                                                        <div
                                                                                            className="portalSocial_img"><span
                                                                                            className="fbportal_icon"><img
                                                                                            src="assets/images/portal_fb_icon@2x.png"
                                                                                            alt="#"/></span></div>
                                                                                        <small>Facebook</small>
                                                                                        <div
                                                                                            className="customInput_div"><input
                                                                                            type="text"
                                                                                            defaultValue={(this.props.venue_data) ? this.props.venue_data.facebook_id : ""}
                                                                                            id="facebook_id"
                                                                                            name="facebook_id" readOnly
                                                                                            className="editable_input change"
                                                                                            data-field="facebook_id"
                                                                                            placeholder="URL or Social Media Account"/></div>
                                                                                    </div>

                                                                                </li>
                                                                                <li>
                                                                                    <div
                                                                                        className="socialMediaLinks_list clearfix">
                                                                                        <div
                                                                                            className="portalSocial_img"><span
                                                                                            className="twportal_icon"><img
                                                                                            src="assets/images/portal_twitter_icon@2x.png"
                                                                                            alt="#"/></span></div>
                                                                                        <small>Twitter</small>
                                                                                        <div
                                                                                            className="customInput_div"><input
                                                                                            type="text"
                                                                                            defaultValue={(this.props.venue_data) ?this.props.venue_data.twitter_id : ""}
                                                                                            id="twitter_id"
                                                                                            className="editable_input change"
                                                                                            readOnly
                                                                                            data-field="twitter_id"
                                                                                            name="twitter_id"
                                                                                            placeholder="URL or Social Media Account"/></div>
                                                                                    </div>

                                                                                </li>
                                                                                <li>
                                                                                    <div
                                                                                        className="socialMediaLinks_list clearfix">
                                                                                        <div
                                                                                            className="portalSocial_img"><span
                                                                                            className="instaportal_icon"><img
                                                                                            src="assets/images/portal_insta_icon@2x.png"
                                                                                            alt="#"/></span></div>
                                                                                        <small>Instagram</small>
                                                                                        <div
                                                                                            className="customInput_div"><input
                                                                                            type="text"
                                                                                            defaultValue={(this.props.venue_data) ? this.props.venue_data.instagram_id : ""}
                                                                                            id="instagram_id"
                                                                                            className="editable_input change"
                                                                                            readOnly
                                                                                            data-field="twitter_id"
                                                                                            name="instagram_id"
                                                                                            placeholder="URL or Social Media Account"/></div>
                                                                                    </div>

                                                                                </li>

                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>


                                                            <div className="dropSegmentation_section" id="v_senderId">

                                                                <div className="dropSegmentation_heading clearfix">
                                                                    <h3>Sender ID's</h3>
                                                                </div>

                                                                <div className="venueInfo_div">
                                                                    <div className="venueIdentification_section">
                                                                        <p>Set the name of your site that will appear when sending campaigns to members.</p>


                                                                        <div className="venueIdentification_form">
                                                                            <ul>
                                                                                <li>
                                                                                    <label>SMS Sender ID:</label>
                                                                                    <div
                                                                                        className="customInput_div"><input
                                                                                        type="text"
                                                                                        defaultValue={(this.props.venue_data) ? this.props.venue_data.sms_sender_id : ""}
                                                                                        data-field="sms_sender_id"
                                                                                        name="sms_sender_id" readOnly
                                                                                        id="sms_sender_id"
                                                                                        className="editable_input change"
                                                                                        placeholder="SMS Sender ID"/></div>
                                                                                </li>

                                                                                <li>
                                                                                    <label>Email Sender ID:</label>
                                                                                    <div
                                                                                        className="customInput_div"><input
                                                                                        type="text"
                                                                                        defaultValue={(this.props.venue_data) ? this.props.venue_data.email_sender_id : ""}
                                                                                        data-field="email_sender_id"
                                                                                        name="email_sender_id" readOnly
                                                                                        id="email_sender_id"
                                                                                        className="editable_input change"
                                                                                        placeholder="Email Sender ID"/></div>
                                                                                </li>

                                                                                <li>
                                                                                    <label>Pointme Sender ID:</label>
                                                                                    <div
                                                                                        className="customInput_div"><input
                                                                                        type="text"
                                                                                        defaultValue={(this.props.venue_data) ?this.props.venue_data.pointme_sender_id : ""}
                                                                                        data-field="pointme_sender_id"
                                                                                        name="pointme_sender_id"
                                                                                        readOnly id="pointme_sender_id"
                                                                                        className="editable_input change"
                                                                                        placeholder="Pointme Sender ID"/></div>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>



                                                            <div
                                                                className="dropSegmentation_section campaign_test_alerts"
                                                                id="v_testCompaign">

                                                                <div className="dropSegmentation_heading clearfix">
                                                                    <h3>Campaign Tests &amp; Alerts</h3>
                                                                </div>

                                                                <div className="venueInfo_div">
                                                                    <div className="venueIdentification_section">
                                                                        <p>Review and test your campaigns before they are sent to your members. Enter multiple recipients using a comma to separate.</p>


                                                                        <div className="venueIdentification_form">
                                                                            <ul>

                                                                                <li>
                                                                                    <label>Reporting Email Address</label>
                                                                                    <div className="customInput_div">
                                                                                        <input
                                                                                            className="editable_input change"
                                                                                            placeholder="Reporting Email Address"
                                                                                            type="text"
                                                                                            name="reporting_email"
                                                                                            data-field="reporting_email"
                                                                                            defaultValue={(this.props.venue_test_alerts) ? this.props.venue_test_alerts.reporting_email : ""}
                                                                                            readOnly
                                                                                            id="reporting_email"/>
                                                                                    </div>
                                                                                </li>

                                                                                <li className="showTags pointer_event" id="recipient_email">
                                                                                    <label>Email Test Recipient</label>

                                                                                        {/*<div
                                                                                            className="customInput_div">
                                                                                            <input
                                                                                                className="editable_input change"
                                                                                                placeholder="Email Test Recipient"
                                                                                                type="text"
                                                                                                name="recipient_email"
                                                                                                data-field="recipient_email"
                                                                                                defaultValue={(this.props.venue_test_alerts) ? this.props.venue_test_alerts.recipient_email : ""}
                                                                                                readOnly
                                                                                                id="recipient_email"/>
                                                                                        </div>*/}

                                                                                    <div className=" numberFields_1 numberFields">
                                                                                               <Autocomplete
                                                                                                   getItemValue={(item) => item.label}
                                                                                                   items={this.state.searchValue}
                                                                                                   renderItem={(item, isHighlighted) =>
                                                                                                       <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                                                                           {item.label}
                                                                                                       </div>
                                                                                                   }
                                                                                                   value={this.state.value}
                                                                                                   onChange={(e)=>{this.onChangeSearch(e,"emails","value")}}
                                                                                                   onSelect={(e)=>{this.onSelectSearch(e,"email_test_recipents","value")}}
                                                                                               />

                                                                                    </div>
                                                                                    {this.state.email_test_recipents.map((value,key)=>{
                                                                                        return (
                                                                                            <a key={key} style={{marginTop:"5px"}} href="javascript:void(0)">{value}<i onClick={(e)=>{this.removeRecipent(value,"email_test_recipents","value")}}>&nbsp;</i></a>
                                                                                        )
                                                                                    })}

                                                                                </li>
                                                                                <li className="showTags pointer_event" id="mobile">
                                                                                    <label>SMS Test Recipient</label>
                                                                                    {/*<div className="customInput_div">
                                                                                        <input
                                                                                            className="editable_input change"
                                                                                            placeholder="SMS Test Recipient"
                                                                                            type="text" name="mobile"
                                                                                            data-field="mobile"
                                                                                            defaultValue={(this.props.venue_test_alerts) ? this.props.venue_test_alerts.mobile : ""}
                                                                                            readOnly id="mobile"/>
                                                                                    </div>*/}
                                                                                    <div className=" numberFields_1 numberFields">
                                                                                       <Autocomplete
                                                                                           getItemValue={(item) => item.label}
                                                                                           items={this.state.searchValue}
                                                                                           renderItem={(item, isHighlighted) =>
                                                                                               <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                                                                   {item.label}
                                                                                               </div>
                                                                                           }
                                                                                           value={this.state.value1}
                                                                                           onChange={(e)=>{this.onChangeSearch(e,"phone","value1")}}

                                                                                           //onSelect={(e)=>{this.onSelectSearch(e,"sms_test_recipents","value1")}}
                                                                                           onSelect={(e) => {
                                                                                               this.onSelectApp(e, "sms_test_recipents","value1")
                                                                                           }}

                                                                                       />

                                                                                    </div>
                                                                                    {this.state.sms_test_recipents.map((value,key)=>{
                                                                                        return (
                                                                                            <a key={key} style={{marginTop:"5px"}} href="javascript:void(0)">{value}<i onClick={(e)=>{this.removeRecipent(value,"sms_test_recipents","value1")}}>&nbsp;</i></a>
                                                                                        )
                                                                                    })}
                                                                                </li>
                                                                                <li className="showTags " id="application_recipient">
                                                                                    <label>App Test Recipient:</label>
                                                                                    {/*<div className="customInput_div">
                                                                                        <input className="editable_input change"  placeholder="App Test Recipient" type="text" name="application_recipient" data-field="application_recipient" defaultValue={(this.props.venue_test_alerts) ? this.props.venue_test_alerts.application_recipient : ""} readOnly id="application_recipient"/>
                                                                                    </div>*/}

                                                                                    <div
                                                                                        className=" numberFields_1 numberFields">
                                                                                       <Autocomplete
                                                                                           getItemValue={(item) => {
                                                                                               return item.label;
                                                                                           }}
                                                                                           items={this.state.searchValue}
                                                                                           renderItem={(item, isHighlighted) =>
                                                                                               <div
                                                                                                   style={{background: isHighlighted ? 'lightgray' : 'white'}}>
                                                                                                   {item.label}
                                                                                               </div>
                                                                                           }
                                                                                           value={this.state.value2}
                                                                                           onChange={(e) => {
                                                                                               this.onChangeSearch(e, "app","value2")
                                                                                           }}
                                                                                           onSelect={(e) => {
                                                                                               this.onSelectApp(e, "app_test_recipents","value2")
                                                                                           }}
                                                                                       />


                                                                                    </div>

                                                                                    {this.state.app_test_recipents.map((value, key) => {
                                                                                        return (
                                                                                            <a key={key}
                                                                                               style={{marginTop: "5px"}}
                                                                                               href="javascript:void(0)">{value}<i
                                                                                                onClick={(e) => {
                                                                                                    this.removeRecipent(value, "app_test_recipents","value2")
                                                                                                }}>&nbsp;</i></a>
                                                                                        )
                                                                                    })}
                                                                                </li>
                                                                                <li>
                                                                                    <label>Minimum Recipient Warning</label>
                                                                                    <div className="customInput_div">
                                                                                        <input
                                                                                            className="editable_input change"
                                                                                            placeholder="Minimum Recipient Warning"
                                                                                            type="text"
                                                                                            name="mimimum_recipient_warning"
                                                                                            data-field="mimimum_recipient_warning"
                                                                                            defaultValue={(this.props.venue_test_alerts) ? this.props.venue_test_alerts.mimimum_recipient_warning : ""}
                                                                                            readOnly
                                                                                            id="mimimum_recipient_warning"/>
                                                                                    </div>
                                                                                </li>
                                                                                <li>
                                                                                    <label>Maximum Recipient Warning</label>
                                                                                    <div className="customInput_div">
                                                                                        <input
                                                                                            className="editable_input change"
                                                                                            placeholder="Maximum Recipient Warning"
                                                                                            type="text"
                                                                                            name="maximum_recipient_warning"
                                                                                            data-field="maximum_recipient_warning"
                                                                                            defaultValue={(this.props.venue_test_alerts) ? this.props.venue_test_alerts.maximum_recipient_warning : ""}
                                                                                            readOnly
                                                                                            id="maximum_recipient_warning"/>
                                                                                    </div>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>

                                                            <div className="dropSegmentation_section"
                                                                 id="v_saturationCompaign">

                                                                <div className="dropSegmentation_heading clearfix">
                                                                    <h3>Campaign Saturation &amp; Non-Contact Period Controls</h3>
                                                                </div>

                                                                <div className="venueInfo_div">
                                                                    <div className="venueIdentification_section">
                                                                        <p>Set limits for the number of campaigns a member can receive and when they can receive them to minimise opt-outs.</p>
                                                                    </div>

                                                                    <br/>
                                                                    <div className="venueIdentification_form">
                                                                        <ul>
                                                                            <li>
                                                                                <label>Campaign Saturation Alert</label>
                                                                                <div className="compaignSaturation ">
                                                                                    <div className="customInput_div">
                                                                                        <input type="number"
                                                                                               className="change"
                                                                                               placeholder="Campaign Saturation Alert"
                                                                                               name="saturation_alerts"
                                                                                               defaultValue={(this.props.venue_conpain_saturation) ? this.props.venue_conpain_saturation.saturation_alerts : ""}
                                                                                               readOnly
                                                                                               id="saturation_alerts"/>
                                                                                    </div>

                                                                                    <small>in</small>

                                                                                    <div className="customDropDown">
                                                                                            <span
                                                                                                id="compaing_satu_alerts"
                                                                                                className="disabled_drop_down"
                                                                                                ref={(ref) => this.dropDownLabelRef = ref}
                                                                                                data-value=""
                                                                                                onClick={this.handleDropDownSpanClick}>

                                                                                                {/*{this.props.venue_conpain_saturation ? this.props.venue_conpain_saturation.compaing_satu_alerts : "24 Hours" }*/}
                                                                                                {this.state.compaing_satu_alerts ? this.state.compaing_satu_alerts : "24 Hours"}
                                                                                           </span>
                                                                                        <ul className="customDropDown_show customPlaceHolder compaign_saturation"
                                                                                            ref={(ref) => this.dropDownUlRef = ref}
                                                                                            style={{
                                                                                                overflow: "auto",
                                                                                                display: "none"
                                                                                            }}>
                                                                                            <li defaultValue="24 Hours"
                                                                                                onClick={(e) => {
                                                                                                    this.setTriggers('24 Hours', '24 Hours')
                                                                                                }}>24 Hours</li>
                                                                                            <li defaultValue="1 week"
                                                                                                onClick={(e) => {
                                                                                                    this.setTriggers('1 week', '1 week')
                                                                                                }}>1 week</li>
                                                                                            <li defaultValue="30 days"
                                                                                                onClick={(e) => {
                                                                                                    this.setTriggers('30 days', '30 days')
                                                                                                }}>30 days</li>

                                                                                        </ul>
                                                                                    </div>
                                                                                </div>

                                                                            </li>

                                                                            <li>
                                                                                <label>Campaign Saturation Block</label>
                                                                                <div className="compaignSaturation ">
                                                                                    <div className="customInput_div">
                                                                                        <input type="number"
                                                                                               className="change"
                                                                                               placeholder="Campaign Saturation Block"
                                                                                               name="saturation_block"
                                                                                               defaultValue={(this.props.venue_conpain_saturation) ? this.props.venue_conpain_saturation.saturation_block : ""}
                                                                                               readOnly
                                                                                               id="saturation_block"/>
                                                                                    </div>

                                                                                    <small>in</small>

                                                                                    <div className="customDropDown">
                                                                                             <span
                                                                                                 id="compaing_satu_block"
                                                                                                 className="disabled_drop_down"
                                                                                                 ref={(ref) => this.dropDownLabelRef2 = ref}
                                                                                                 data-value=""
                                                                                                 onClick={this.handleDropDownSpanClick2}>
                                                                                                 {/*{this.props.venue_conpain_saturation ? this.props.venue_conpain_saturation.compaing_satu_block : "24 Hours" }*/}
                                                                                                 {this.state.compaing_satu_block ? this.state.compaing_satu_block : "24 Hours"}


                                                                                </span>
                                                                                        <ul className="customDropDown_show customPlaceHolder compaign_saturation"
                                                                                            ref={(ref) => this.dropDownUlRef2 = ref}
                                                                                            style={{
                                                                                                overflow: "auto",
                                                                                                display: "none"
                                                                                            }}>
                                                                                            <li defaultValue="24 Hours"
                                                                                                onClick={(e) => {
                                                                                                    this.setTriggers2('24 Hours', '24 Hours')
                                                                                                }}>24 Hours</li>
                                                                                            <li defaultValue="1 week"
                                                                                                onClick={(e) => {
                                                                                                    this.setTriggers2('1 week', '1 week')
                                                                                                }}>1 week</li>
                                                                                            <li defaultValue="30 days"
                                                                                                onClick={(e) => {
                                                                                                    this.setTriggers2('30 days', '30 days')
                                                                                                }}>30 days</li>

                                                                                        </ul>
                                                                                    </div>
                                                                                </div>

                                                                            </li>
                                                                        </ul>
                                                                    </div>

                                                                    <div className="checkSaturation">
                                                                        <div className="control-group">

                                                                            <label className="control ">Include Campaigns with Rewards in Campaign Saturation Block
                                                                                <input type="checkbox"
                                                                                       id='saturation_checkbox'
                                                                                       defaultChecked={this.state.reward}
                                                                                       onClick={(e) => {
                                                                                           this.updateReward(this.state.reward)
                                                                                       }}/>
                                                                                <div
                                                                                    className="control__indicator"></div>
                                                                            </label>

                                                                        </div>
                                                                    </div>

                                                                    <div className="oprationHour_listing">
                                                                        <ul>
                                                                            <li>
                                                                                <div className="dayOption clearfix">
                                                                                    <strong>Non contact Period - SMS</strong>
                                                                                </div>

                                                                                <div
                                                                                    className="dayOption_range yourSeg_age_rangeSlct">
                                                                                    <div>
                                                                                        <span
                                                                                            id="contact_perioud_start_sms_span"
                                                                                            style={{display: 'none'}}>00:00 AM</span>
                                                                                        <span
                                                                                            id="contact_perioud_end_sms_span"
                                                                                            style={{display: 'none'}}>23:00 PM</span>
                                                                                        <input type="text"
                                                                                               className="weeklyRange_time"
                                                                                               id="non_contact_period_sms"
                                                                                               name="range"/>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        </ul>

                                                                        <br/><br/><br/>
                                                                    </div>

                                                                    <div className="oprationHour_listing">
                                                                        <ul>
                                                                            <li>
                                                                                <div className="dayOption clearfix">
                                                                                    <strong>Non contact Period - App</strong>
                                                                                </div>

                                                                                <div
                                                                                    className="dayOption_range yourSeg_age_rangeSlct">
                                                                                    <div>
                                                                                        <span
                                                                                            id="contact_perioud_start_point_me_span"
                                                                                            style={{display: 'none'}}>00:00 AM</span>
                                                                                        <span
                                                                                            id="contact_perioud_end_point_me_span"
                                                                                            style={{display: 'none'}}>23:00 PM</span>
                                                                                        <input type="text"
                                                                                               className="weeklyRange_time"
                                                                                               id="non_contact_period_pointme"
                                                                                               name="range"/>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        </ul>

                                                                        <br/><br/><br/>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </span>

                                                    {this.loadComponents()}


                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="venueBttn_outer">
                                <div className="continueCancel" style={{display: 'block'}} id="v_VenueDetails_btn">
                                    <input id="edit_venues" onClick={this.editVenue} ref={(ref) => {
                                        this.editVenueRef = ref;
                                    }} type="button" defaultValue="Edit"/>
                                    <input className="selecCompaignBttn" onClick={this.saveVenue} id="save_venues"
                                           ref={(ref) => {
                                               this.saveVenueRef = ref;
                                           }} type="button" defaultValue="Continue"/>
                                    <a id="discard_venues" onClick={this.discardVenues} ref={(ref) => {
                                        this.discardVenueRef = ref;
                                    }} style={{cursor: 'pointer'}}>Cancel</a>
                                </div>

                                <div className="continueCancel" id="v_loyalitys_btn">
                                    <input id="edit_loyalty" ref={(ref) => {
                                        this.editLoyaltyRef = ref;
                                    }} onClick={this.editLoyalty} type="button" defaultValue="Edit"/>
                                    <input id="save_loyalty" ref={(ref) => {
                                        this.saveLoyaltyRef = ref;
                                    }} onClick={this.saveLoyalty} className="selecCompaignBttn" type="button"
                                           defaultValue="Continue"/>
                                    <a id="discard_loyaltity" ref={(ref) => {
                                        this.discardLoyaltyRef = ref;
                                    }} onClick={this.discardLoyalty} style={{cursor: 'pointer'}}>Cancel</a>
                                </div>

                                <div className="continueCancel" id="v_testCompaign_btn">
                                    <input id="edit_alerts" ref={(ref) => {
                                        this.editAlertRef = ref;
                                    }} onClick={this.editAlerts} type="button" defaultValue="Edit"/>
                                    <input id="save_alerts" ref={(ref) => {
                                        this.saveAlertRef = ref;
                                    }} onClick={this.saveAlerts} className="selecCompaignBttn" type="button"
                                           defaultValue="Continue"/>
                                    <a id="discard_alerts" ref={(ref) => {
                                        this.discardAlertRef = ref;
                                    }} onClick={this.discardAlerts} style={{cursor: 'pointer'}}>Cancel</a>
                                </div>

                                <div className="continueCancel" id="v_saturationCompaign_btn">
                                    <input id="edit_saturation" ref={(ref) => {
                                        this.editSaturationRef = ref;
                                    }} type="button" onClick={this.editSaturation} defaultValue="Edit"/>
                                    <input id="save_saturation" ref={(ref) => {
                                        this.saveSaturationRef = ref;
                                    }} onClick={this.saveSaturation} className="selecCompaignBttn" type="button"
                                           defaultValue="Continue"/>
                                    <a id="discard_saturation" ref={(ref) => {
                                        this.discardSaturationRef = ref;
                                    }} onClick={this.discardSaturation} style={{cursor: 'pointer'}}>Cancel</a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>






            </div>
        );
    }//..... end of render() .....//


    saveVenue = () => {
        var venue_id = VenueID;
        var account_id = document.querySelector("#account_id").value;
        var facebook_id = document.querySelector("#facebook_id").value;
        var instagram_id = document.querySelector("#instagram_id").value;
        var twitter_id = document.querySelector("#twitter_id").value;
        var pointme_sender_id = document.querySelector("#pointme_sender_id").value;
        var sms_sender_id = document.querySelector("#sms_sender_id").value;
        var email_sender_id = document.querySelector("#sms_sender_id").value;
        //venue opetating timings
        var monday_venue = document.querySelector("#monday_venue").value;
        var tuesday_venue = document.querySelector("#tuesday_venue").value;
        var wednesday_venue = document.querySelector("#wednesday_venue").value;
        var thursday_venue = document.querySelector("#thursday_venue").value;
        var friday_venue = document.querySelector("#friday_venue").value;
        var saturday_venue = document.querySelector("#saturday_venue").value;
        var sunday_venue = document.querySelector("#sunday_venue").value;

        var open_sunday = this.state.is_open_sun;
        var open_monday = this.state.is_open_mon;
        var open_tuesday = this.state.is_open_tue;
        var open_wednesday = this.state.is_open_wed;
        var open_thursday = this.state.is_open_thu;
        var open_friday = this.state.is_open_fri;
        var open_saturday = this.state.is_open_sat;

        var selected = [];
        selected = {
            venue_id: VenueID,
            account_id: account_id,
            facebook_id: facebook_id,
            instagram_id: instagram_id,
            twitter_id: twitter_id,

            pointme_sender_id: pointme_sender_id,
            sms_sender_id: sms_sender_id,
            email_sender_id: email_sender_id,
            monday_venue: monday_venue,
            tuesday_venue: tuesday_venue,
            wednesday_venue: wednesday_venue,
            thursday_venue: thursday_venue,
            friday_venue: friday_venue,
            saturday_venue: saturday_venue,
            sunday_venue: sunday_venue,
            open_sunday: open_sunday,
            open_monday: open_monday,
            open_tuesday: open_tuesday,
            open_wednesday: open_wednesday,
            open_thursday: open_thursday,
            open_friday: open_friday,
            open_saturday: open_saturday,
        };

        show_loader();
        axios.post(BaseUrl + '/api/add-venue-configuration', {dataArray: selected})
            .then(res => {
                if (res.data === "success") {
                    let inputs = document.querySelectorAll(".venue_level_configurations input");
                    let i;
                    for (i = 0; i < inputs.length; i++) {
                        inputs[i].readOnly = true;
                    }

                    //$('#save_venues').hide();
                    this.saveVenueRef.style.display = "none";
                    this.editVenueRef.style.display = "";
                    this.discardVenueRef.style.display = 'none';
                    $(".venue_operating_hours .operating_hours").prop('disabled', true);
                    $(".operating_hours").attr('disabled', "disabled");
                    $("#sunday_venue").data("ionRangeSlider").update({"disable": true});
                    $("#monday_venue").data("ionRangeSlider").update({"disable": true});
                    $("#tuesday_venue").data("ionRangeSlider").update({"disable": true});
                    $("#wednesday_venue").data("ionRangeSlider").update({"disable": true});
                    $("#thursday_venue").data("ionRangeSlider").update({"disable": true});
                    $("#friday_venue").data("ionRangeSlider").update({"disable": true});
                    $("#saturday_venue").data("ionRangeSlider").update({"disable": true});
                    NotificationManager.success("Site details are saved successfully.", 'success', 1500);
                    show_loader();
                } else {
                    NotificationManager.error("Error occurred while saving record.", 'Error', 1500);
                    show_loader();
                }
            }).catch((err) => {
            NotificationManager.error("Error occurred while saving record.", 'Error', 1500);
            show_loader();
        });
    };

    editVenue = () => {
        var is_open_sun = this.state.is_open_sun;
        var is_open_mon = this.state.is_open_mon;
        var is_open_tue = this.state.is_open_tue;
        var is_open_wed = this.state.is_open_wed;
        var is_open_thu = this.state.is_open_thu;
        var is_open_fri = this.state.is_open_fri;
        var is_open_sat = this.state.is_open_sat;
        if ($('#sunday').is(":checked")) {
            $("#sunday_venue").data("ionRangeSlider").update({"disable": false});
        }
        if ($('#monday').is(":checked")) {
            $("#monday_venue").data("ionRangeSlider").update({"disable": false});
        }
        if ($('#tuesday').is(":checked")) {
            $("#tuesday_venue").data("ionRangeSlider").update({"disable": false});
        }
        if ($('#wednesday').is(":checked")) {
            $("#wednesday_venue").data("ionRangeSlider").update({"disable": false});
        }
        if ($('#thursday').is(":checked")) {
            $("#thursday_venue").data("ionRangeSlider").update({"disable": false});
        }
        if ($('#friday').is(":checked")) {
            $("#friday_venue").data("ionRangeSlider").update({"disable": false});
        }
        if ($('#saturday').is(":checked")) {
            $("#saturday_venue").data("ionRangeSlider").update({"disable": false});
        }
        if (is_open_sun) {
            $("#sunday_venue").data("ionRangeSlider").update({"disable": false});
        }
        if (is_open_mon) {
            $("#monday_venue").data("ionRangeSlider").update({"disable": false});
        }
        if (is_open_tue) {
            $("#tuesday_venue").data("ionRangeSlider").update({"disable": false});
        }
        if (is_open_wed) {
            $("#wednesday_venue").data("ionRangeSlider").update({"disable": false});
        }
        if (is_open_thu) {
            $("#thursday_venue").data("ionRangeSlider").update({"disable": false});
        }
        if (is_open_fri) {
            $("#friday_venue").data("ionRangeSlider").update({"disable": false});
        }
        if (is_open_sat) {
            $("#saturday_venue").data("ionRangeSlider").update({"disable": false});
        }
        this.editVenueRef.style.display = "none";
        var venue_id = VenueID;
        if (venue_id) {
            $('#venue_id').prop("readonly", true);
        } else {
            $('#venue_id').prop("readonly", false);
        }
        this.discardVenueRef.style.display = '';
        $('#account_id').prop("readonly", false);
        $('#facebook_id').prop("readonly", false);
        $('#instagram_id').prop("readonly", false);
        $('#twitter_id').prop("readonly", false);

        $('#pointme_sender_id').prop("readonly", false);
        $('#sms_sender_id').prop("readonly", false);
        $('#email_sender_id').prop("readonly", false);
        $(".venue_operating_hours .operating_hours").prop('disabled', false);
        $(".operating_hours").removeAttr('disabled');
        $('#save_venues').show();
    };

    discardVenues = () => {
        var is_open_sun = this.state.is_open_sun;
        var is_open_mon = this.state.is_open_mon;
        var is_open_tue = this.state.is_open_tue;
        var is_open_wed = this.state.is_open_wed;
        var is_open_thu = this.state.is_open_thu;
        var is_open_fri = this.state.is_open_fri;
        var is_open_sat = this.state.is_open_sat;

        if (is_open_sun) {
            $('#sunday').parent().removeClass('checked');
        } else {
            $('#sunday').parent().addClass('checked');
        }
        if (is_open_mon) {
            $('#monday').parent().removeClass('checked');
        } else {
            $('#monday').parent().addClass('checked');
        }
        if (is_open_tue) {
            $('#tuesday').parent().removeClass('checked');
        } else {
            $('#tuesday').parent().addClass('checked');
        }
        if (is_open_wed) {
            $('#wednesday').parent().removeClass('checked');
        } else {
            $('#wednesday').parent().addClass('checked');
        }
        if (is_open_thu) {
            $('#thursday').parent().removeClass('checked');
        } else {
            $('#thursday').parent().addClass('checked');
        }
        if (is_open_fri) {
            $('#friday').parent().removeClass('checked');
        } else {
            $('#friday').parent().addClass('checked');
        }
        if (is_open_sat) {
            $('#saturday').parent().removeClass('checked');
        } else {
            $('#saturday').parent().addClass('checked');
        }
        var venue_id = VenueID;
        axios.post(BaseUrl + '/api/get-venue-data', {venue_id: venue_id})
            .then(response => {
                if (response.data) {
                    document.getElementById("account_id").value = response.data.data.venue_name;
                    document.getElementById("facebook_id").value = response.data.data.facebook_id;
                    document.getElementById("instagram_id").value = response.data.data.instagram_id;
                    document.getElementById("twitter_id").value = response.data.data.twitter_id;
                    document.getElementById("pointme_sender_id").value = response.data.data.pointme_sender_id;
                    document.getElementById("sms_sender_id").value = response.data.data.sms_sender_id;
                    document.getElementById("email_sender_id").value = response.data.data.email_sender_id;
                    $(".operating_hours").attr('disabled', 'disabled');
                    $('.venue_level_configurations :input').prop("readonly", true);
                } else {
                    NotificationManager.error("Error occured while saving record", 'Error', 1500);
                }
            }).catch((err) => {
            NotificationManager.error("Error occurred while getting Site data.", 'Error', 1500);
        });
        $("#save_venues").hide();
        this.editVenueRef.style.display = "block";
        this.discardVenueRef.style.display = 'none';
        $(".operating_hours").attr('disabled', "disabled");
        $("#sunday_venue").data("ionRangeSlider").update({"disable": true});
        $("#monday_venue").data("ionRangeSlider").update({"disable": true});
        $("#tuesday_venue").data("ionRangeSlider").update({"disable": true});
        $("#wednesday_venue").data("ionRangeSlider").update({"disable": true});
        $("#thursday_venue").data("ionRangeSlider").update({"disable": true});
        $("#friday_venue").data("ionRangeSlider").update({"disable": true});
        $("#saturday_venue").data("ionRangeSlider").update({"disable": true});
    };

    editLoyalty = () => {
        this.editLoyaltyRef.style.display = "none";
        var venue_id = VenueID;
        document.querySelector("#rate_grade_1").readOnly = false;
        document.querySelector("#rate_grade_2").readOnly = false;
        document.querySelector("#rate_grade_3").readOnly = false;
        document.querySelector("#rate_grade_4").readOnly = false;
        document.querySelector("#rate_grade_5").readOnly = false;
        document.querySelector("#rate_grade_6").readOnly = false;
        this.saveLoyaltyRef.style.display = "";
        this.discardLoyaltyRef.style.display = "";

    };

    saveLoyalty = () => {
        var venue_id = VenueID;
        var rate_grade_1 = document.querySelector("#rate_grade_1").value;
        var rate_grade_2 = document.querySelector("#rate_grade_2").value;
        var rate_grade_3 = document.querySelector("#rate_grade_3").value;
        var rate_grade_4 = document.querySelector("#rate_grade_4").value;
        var rate_grade_5 = document.querySelector("#rate_grade_5").value;
        var rate_grade_6 = document.querySelector("#rate_grade_6").value;
        var selected = [];
        selected = {
            venue_id: venue_id,
            rate_grade_1: rate_grade_1,
            rate_grade_2: rate_grade_2,
            rate_grade_3: rate_grade_3,
            rate_grade_4: rate_grade_4,
            rate_grade_5: rate_grade_5,
            rate_grade_6: rate_grade_6,
        };
        // send ajax call to get the next view add-loyalty-config
        show_loader();
        axios.post(BaseUrl + '/api/add-loyalty-config', {dataArray: selected})
            .then(response => {
                if (response.data === 'success') {
                    let inputs = document.querySelectorAll(".loyalty_configurations input");

                    let i;
                    for (i = 0; i < inputs.length; i++) {
                        inputs[i].readOnly = true;
                    }
                    this.saveLoyaltyRef.style.display = "none";
                    this.editLoyaltyRef.style.display = "";
                    this.discardLoyaltyRef.style.display = "none";
                    NotificationManager.success("Record Saved successfully.", 'success', 1500);
                    show_loader();
                } else {
                    NotificationManager.error("Error occurred while saving record.", 'Error', 1500);
                    show_loader();
                }
            }).catch((err) => {
            NotificationManager.error("Internal server error.", 'Error', 1500);
            show_loader();
        });
    };

    discardLoyalty = () => {
        var venue_id = VenueID;
        axios.post(BaseUrl + '/api/get-loyalty-data', {venue_id: venue_id})
            .then(response => {
                if (response.data) {
                    document.querySelector('#rate_grade_1').value = response.data.data.rate_grade_1;
                    document.querySelector('#rate_grade_2').value = response.data.data.rate_grade_2;
                    document.querySelector('#rate_grade_3').value = response.data.data.rate_grade_3;
                    document.querySelector('#rate_grade_4').value = response.data.data.rate_grade_4;
                    document.querySelector('#rate_grade_5').value = response.data.data.rate_grade_5;
                    document.querySelector('#rate_grade_6').value = response.data.data.rate_grade_6;
                    let ele = document.querySelectorAll(".loyalty_configurations input");
                    let i = 0;
                    for (i = 0; i < ele.length; i++) {
                        ele[i].readOnly = true;
                    }
                    this.saveLoyaltyRef.style.display = "none";
                    this.editLoyaltyRef.style.display = "";
                    this.discardLoyaltyRef.style.display = "none";
                } else {
                    NotificationManager.error("Error occured while saving record", 'Error', 1500);
                }
            }).catch((err) => {
            NotificationManager.error("Error occurred while getting loyalty data.", 'Error', 1500);
        });
    };

    editAlerts = () => {
        this.editAlertRef.style.display = "none";
        this.discardAlertRef.style.display = "";
        var venue_id = VenueID;
        document.querySelector("#reporting_email").readOnly = false;
        document.querySelector("#mimimum_recipient_warning").readOnly = false;
        document.querySelector("#maximum_recipient_warning").readOnly = false;
        $("#mobile").removeClass("pointer_event");
        $("#application_recipient").removeClass("pointer_event");
        $("#recipient_email").removeClass("pointer_event");
        this.saveAlertRef.style.display = "";
    };

    saveAlerts = () => {
        var venue_id = VenueID;

        var reporting_email = document.querySelector("#reporting_email").value.trim();
        var mimimum_recipient_warning = document.querySelector("#mimimum_recipient_warning").value.trim();
        var maximum_recipient_warning = document.querySelector("#maximum_recipient_warning").value.trim();
        $("#mobile").addClass("pointer_event");
        $("#application_recipient").addClass("pointer_event");
        $("#recipient_email").addClass("pointer_event");
        var selected = [];
        selected = {
            venue_id: venue_id,
            reporting_email: reporting_email,
            recipient_email: this.state.email_test_recipents,
            mobile: this.state.sms_test_recipents,
            application_recipient: this.state.app_test_recipents,
            mimimum_recipient_warning: mimimum_recipient_warning,
            maximum_recipient_warning: maximum_recipient_warning,
        };
        show_loader();
        axios.post(BaseUrl + '/api/add-campaign-test-alert', {dataArray: selected})
            .then(response => {
                if (response.data.status == true) {
                    $('.campaign_test_alerts :input').prop("readonly", true);
                    this.saveAlertRef.style.display = "none";
                    this.editAlertRef.style.display = "";
                    this.discardAlertRef.style.display = "none";
                    NotificationManager.success("Record saved successfully.", 'Success', 1500);
                    show_loader();

                } else {
                    NotificationManager.error("Error occurred while saving record.", 'Error', 1500);
                    show_loader();
                }
            }).catch((err) => {
            NotificationManager.error("Internal server error occured while adding test alerts.", 'Error', 1500);
            show_loader();

        });
    };

    discardAlerts = () => {
        var venue_id = VenueID;
        axios.post(BaseUrl + '/api/get-venue-config-test-alerts', {venue_id: venue_id})
            .then(response => {
                if (response.data.status) {
                    document.getElementById("reporting_email").value = response.data.data.reporting_email;
                    document.getElementById("mimimum_recipient_warning").value = response.data.data.mimimum_recipient_warning;
                    document.getElementById("maximum_recipient_warning").value = response.data.data.maximum_recipient_warning;
                    $('.campaign_test_alerts :input').prop("readonly", true);

                    this.saveAlertRef.style.display = "none";
                    this.editAlertRef.style.display = "";
                    this.discardAlertRef.style.display = "none";
                    $("#mobile").addClass("pointer_event");
                    $("#application_recipient").addClass("pointer_event");
                    $("#recipient_email").addClass("pointer_event");
                } else {
                    NotificationManager.error("Error occured while saving record", 'Error', 1500);
                }
            }).catch((err) => {
            NotificationManager.error("Error occurred while getting test alerts.", 'Error', 1500);
        });
        $(".operating_hours").attr('disabled', "disabled");
    };

    editSaturation = () => {
        this.editSaturationRef.style.display = "none";
        $("#compaing_satu_alerts").removeClass("disabled_drop_down");
        $("#compaing_satu_block").removeClass("disabled_drop_down");
        $("#non_contact_period_sms").data("ionRangeSlider").update({"disable": false});
        $("#non_contact_period_pointme").data("ionRangeSlider").update({"disable": false});
        $('.cmp_satu_alert').prop('disabled', false);
        this.discardSaturationRef.style.display = "";
        var venue_id = VenueID;
        $('#saturation_alerts').prop("readonly", false);
        $('#saturation_block').prop("readonly", false);
        $('#contact_perioud_start_sms').prop("readonly", false);
        $('#contact_perioud_end_sms').prop("readonly", false);
        $('#contact_perioud_start_point_me').prop("readonly", false);
        $('#contact_perioud_end_point_me').prop("readonly", false);
        $(".compaign_saturation #saturation_rewards").removeAttr('disabled');
        this.saveSaturationRef.style.display = "";
    };

    saveSaturation = () => {
        var venue_id = VenueID;
        var saturation_alerts = $('#saturation_alerts').val();
        var saturation_block = $('#saturation_block').val();
        var contact_perioud_start_sms = $('#contact_perioud_start_sms_span').text().trim();
        var contact_perioud_end_sms = $('#contact_perioud_end_sms_span').text().trim();
        var contact_perioud_start_point_me = $('#contact_perioud_start_point_me_span').text().trim();
        var contact_perioud_end_point_me = $('#contact_perioud_end_point_me_span').text().trim();

        var compaing_satu_alerts = this.state.compaing_satu_alerts;
        var compaing_satu_block = this.state.compaing_satu_block;

        var reward_check = $(".compaign_saturation").val();
        var reward = $("#saturation_rewards").is(':checked');
        if ($("#saturation_rewards").is(':checked'))
            reward_check = 1;
        else
            reward_check = 0;

        var selected = [];
        selected = {
            venue_id: venue_id,
            saturation_alerts: saturation_alerts,
            saturation_block: saturation_block,
            contact_perioud_start_sms: contact_perioud_start_sms,
            contact_perioud_end_sms: contact_perioud_end_sms,
            contact_perioud_start_point_me: contact_perioud_start_point_me,
            contact_perioud_end_point_me: contact_perioud_end_point_me,
            compaing_satu_alerts: compaing_satu_alerts.trim(),
            compaing_satu_block: compaing_satu_block.trim(),
            rewards: this.state.reward,
        };


        show_loader();
        axios.post(BaseUrl + '/api/save-campaign_saturation', {dataArray: selected})
            .then(res => {
                if (res.data === "success") {

                    $('.compaign_saturation :input').prop("readonly", true);
                    this.saveSaturationRef.style.display = "none";
                    this.editSaturationRef.style.display = "";
                    this.discardSaturationRef.style.display = "none";
                    $('.cmp_satu_alert').prop('disabled', true);
                    $(".compaign_saturation #saturation_rewards").attr('disabled', "disabled");
                    $("#compaing_satu_alerts").addClass("disabled_drop_down");
                    $("#compaing_satu_block").addClass("disabled_drop_down");
                    $("#non_contact_period_sms").data("ionRangeSlider").update({"disable": true});
                    $("#non_contact_period_pointme").data("ionRangeSlider").update({"disable": true});
                    $('#saturation_alerts').prop("readonly", true);
                    $('#saturation_block').prop("readonly", true);
                    NotificationManager.success("Record saved successfully.", 'Success', 1500);
                    show_loader();

                } else {
                    NotificationManager.error("Error occurred while saving record.", 'Error', 1500);
                    show_loader();
                }
            }).catch((err) => {
            NotificationManager.error("Internal server error occured while saving campaign saturation.", 'Error', 1500);
            show_loader();
        });
    };

    discardSaturation = () => {
        axios.post(BaseUrl + '/api/venue-configuration', {venue_id: VenueID, company_id: CompanyID}).then((arr) => {
            if (arr.data) {
                let res = arr.data;
                $('#saturation_alerts').val(res.venue_conpain_saturation.saturation_alerts);
                $('#saturation_block').val(res.venue_conpain_saturation.saturation_block);
                $('#compaing_satu_alerts').text(res.venue_conpain_saturation.compaing_satu_alerts);
                $('#compaing_satu_block').text(res.venue_conpain_saturation.compaing_satu_block);
                this.setState({reward: res.venue_conpain_saturation.is_reward});
                if (res.venue_conpain_saturation.is_reward) {
                    $("#saturation_checkbox").attr("checked", "checked");
                    $("#saturation_checkbox").trigger("click");
                } else {
                    $("#saturation_checkbox").removeAttr("checked");
                    $("#saturation_checkbox").trigger("click");

                }

                document.getElementById("compaing_satu_alerts").classList.add("disabled_drop_down");
                document.getElementById("compaing_satu_block").classList.add("disabled_drop_down");
                $('#saturation_alerts').prop("readonly", true);
                $('#saturation_block').prop("readonly", true);
                $("#non_contact_period_sms").data("ionRangeSlider").update({"disable": true});
                $("#non_contact_period_pointme").data("ionRangeSlider").update({"disable": true});
                this.saveSaturationRef.style.display = "none";
                this.discardSaturationRef.style.display = "none";
                this.editSaturationRef.style.display = "";
            }

        });
    };

    setTriggers = (id, value) => {
        this.dropDownUlRef.style.display = 'none';
        this.dropDownLabelRef.classList.remove('changeAero');
        //{this.props.venue_conpain_saturation ? this.props.venue_conpain_saturation.compaing_satu_alerts : "24 Hours" }
        this.setState({compaing_satu_alerts: value});
    };//..... end of setTriggers() ....//

    handleDropDownSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.dropDownUlRef.style.display = (this.dropDownUlRef.style.display === 'none') ? 'block' : 'none';

    };//..... end of handleDropDownSpanClick() .....//

    setTriggers2 = (id, value) => {
        this.dropDownUlRef2.style.display = 'none';
        this.dropDownLabelRef2.classList.remove('changeAero');
        this.setState({compaing_satu_block: value});
    };//..... end of setTriggers() ....//

    handleDropDownSpanClick2 = (e) => {
        e.target.classList.toggle('changeAero');
        this.dropDownUlRef2.style.display = (this.dropDownUlRef2.style.display === 'none') ? 'block' : 'none';

    };//..... end of handleDropDownSpanClick() .....//
    componentWillUnmount = () => {
        $("body").find('.clickVenue').off('click');
        $("body").find('.clickVenue').unbind('click', function () {
            return false;
        });
    };

    addMenue = () => {
        let that = this;
        $("body").on("click", ".clickVenue", function (e) {
            $("body").find(".dragVenueData").removeClass("subVenueActive");
            var page_name = $(this).attr("page-name");
            if (that.state.defaultPage != page_name) {
                that.setState(() => ({defaultPage: page_name}));
            }
            $("#title_of_menu").html($(this).attr("data-title"));
            $('.dropSegmentation_section , .beaconConfig_outer').hide();
            var href_id = $(this).attr("data-id");

            if (href_id == "v_VenueDetails") {
                $(".venuePortal").removeAttr("style");
                $(".venuePortal").addClass('assignLength');

            } else {

                $(".venuePortal").removeClass('assignLength');
            }
            var btn_id = $(this).attr("data-id");

            if ($(this).parents("li").find("a").hasClass("venueDtail_ancor")) {
                $(".slide2").slideUp();
                $("#ul_li_2").removeClass("activeVenue");
                $(".venueConfig_inner ul li ").removeClass("activeVenue");
                $(".slide1").show();
                $(".slide2").find('div.subVenueActive').removeClass('subVenueActive');
                $(this).parents("div").addClass("subVenueActive");
                $(this).parents("li").addClass("activeVenue");
                btn_id = $(this).parents("li").find("a").attr("data-id");
                href_id = $(this).attr("data-id");
                $(".slide1").css("display", "block");
            } else if ($(this).parents("li").find("a").hasClass("venueDtail_ancor1")) {
                $(".dragVenueData").removeClass("subVenueActive");
                $(".slide1").slideUp();
                $("#ul_li_1").removeClass("activeVenue");
                $(".venueConfig_inner").removeClass("activeVenue");
                $(".slide2").show();
                $(".slide1").find('div.subVenueActive').removeClass('subVenueActive');
                $(this).parents("div").addClass("subVenueActive");
                $(this).parents("li").addClass("activeVenue");
                btn_id = $(this).parents("li").find("a").attr("data-id");
                href_id = $(this).attr("data-id");
                $(".showVenue_data1").css("display", "block");

            } else {
                $(".showVenue_data").slideUp();
                $(".venueConfig_inner ul li ").removeClass("activeVenue");
                $(".dragVenueData").removeClass("subVenueActive");
                $(this).parent("li").addClass("activeVenue");

            }

            $('.continueCancel').hide();
            $('#' + href_id).fadeIn();
            $('#' + btn_id + '_btn').fadeIn();

            if (href_id == "auto_checkout_setting" || href_id == "app_skinning" || href_id == "custom_fields" || href_id == "member_fields" || href_id == 'segment_criteria') {
                $("#auto_checkout_btn").show();
                $("#skinning_save_btn").show();
            }


            return false;
        });

    }


    campaign_saturation_charts = () => {
        moment.locale("en");
        var $range = $(".weeklyRange_time");
        var start = moment("2017-07-17 06:00", "YYYY-MM-DD HH:mm");
        var end = moment("2017-07-18 05:59", "YYYY-MM-DD HH:mm");

        $range.ionRangeSlider({
            type: "double",
            //grid: true,
            disable: false,
            min: start.format("x"),
            max: end.format("x"),
            step: 1800000, // 30 minutes in ms
            prettify: function (num) {
                return moment(num, 'x').format("h:mm A");
            }
        });

        var current_date = moment(new Date()).format("YYYY-MM-DD");
        var start = moment(current_date + " 00:00", "YYYY-MM-DD HH:mm");
        var end = moment(current_date + " 23:30", "YYYY-MM-DD HH:mm");
        var non_contact_period_sms = $("#non_contact_period_sms").data("ionRangeSlider");

        var start1 = moment(this.state.contact_perioud_start_sms ? this.state.contact_perioud_start_sms : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");
        var end1 = moment(this.state.contact_perioud_end_sms ? this.state.contact_perioud_end_sms : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");
        non_contact_period_sms.update({
            min: start.format("x"),
            max: end.format("x"),
            from: start1.format("x"),
            to: end1.format("x"),
            step: 1800000,
            disable: true,
            prettify: function (num) {
                return moment(num, 'x').format("h:mm A");

            },
            onFinish: function (num) {

                $("#contact_perioud_start_sms_span").text(moment(num.from, 'x').format("h:mm A"));
                $('#contact_perioud_end_sms_span').text(moment(num.to, 'x').format("h:mm A"));
            }
        });


        var non_contact_period_pointme = $("#non_contact_period_pointme").data("ionRangeSlider");
        var start1 = moment(this.state.contact_perioud_start_point_me ? this.state.contact_perioud_start_point_me : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");
        var end1 = moment(this.state.contact_perioud_end_point_me ? this.state.contact_perioud_end_point_me : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");

        non_contact_period_pointme.update({
            min: start.format("x"),
            max: end.format("x"),
            from: start1.format("x"),
            to: end1.format("x"),
            step: 1800000,
            disable: true,
            prettify: function (num) {
                return moment(num, 'x').format("h:mm A");

            },
            onFinish: function (num) {
                $("#contact_perioud_start_point_me_span").text(moment(num.from, 'x').format("h:mm A"));
                $('#contact_perioud_end_point_me_span').text(moment(num.to, 'x').format("h:mm A"));
            }
        });
    };

    operating_hours_charts = () => {
        var $range = $(".weeklyRange_time");
        var start = moment("2017-07-17 06:00", "YYYY-MM-DD HH:mm");
        var end = moment("2017-07-18 05:59", "YYYY-MM-DD HH:mm");

        $range.ionRangeSlider({
            type: "double",
            //grid: true,
            disable: false,
            min: start.format("x"),
            max: end.format("x"),
            step: 1800000, // 30 minutes in ms
            prettify: function (num) {
                return moment(num, 'x').format("h:mm A");
            }
        });


        var current_date = moment(new Date()).format("YYYY-MM-DD");
        var start = moment(current_date + " 00:00", "YYYY-MM-DD HH:mm");
        var end = moment(current_date + " 23:30", "YYYY-MM-DD HH:mm");

        var slider1 = $("#sunday_venue").data("ionRangeSlider");
        var start1 = moment(this.state.sun_start ? this.state.sun_start : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");
        var end1 = moment(this.state.sun_end ? this.state.sun_end : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");
        slider1.update({
            min: start.format("x"),
            max: end.format("x"),
            from: start1.format("x"),
            to: end1.format("x"),
            step: 1800000,
            disable: true,
            prettify: function (num) {
                return moment(num, 'x').format("h:mm A");
            }
        });

        var slider2 = $("#monday_venue").data("ionRangeSlider");
        var start2 = moment(this.state.mon_start ? this.state.mon_start : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");
        var end2 = moment(this.state.mon_end ? this.state.mon_end : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");
        slider2.update({
            min: start.format("x"),
            max: end.format("x"),
            from: start2.format("x"),
            to: end2.format("x"),
            step: 1800000,
            disable: true,
            prettify: function (num) {
                return moment(num, 'x').format("h:mm A");
            }
        });

        var slider3 = $("#tuesday_venue").data("ionRangeSlider");
        var start3 = moment(this.state.tue_start ? this.state.tue_start : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");
        var end3 = moment(this.state.tue_end ? this.state.tue_end : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");
        slider3.update({
            min: start.format("x"),
            max: end.format("x"),
            from: start3.format("x"),
            to: end3.format("x"),
            step: 1800000,
            disable: true,
        });

        var slider4 = $("#wednesday_venue").data("ionRangeSlider");
        var start4 = moment(this.state.wed_start ? this.state.wed_start : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");
        var end4 = moment(this.state.wed_end ? this.state.wed_end : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");
        slider4.update({
            min: start.format("x"),
            max: end.format("x"),
            from: start4.format("x"),
            to: end4.format("x"),
            step: 1800000,
            disable: true,
        });


        var slider5 = $("#thursday_venue").data("ionRangeSlider");
        var start5 = moment(this.state.thu_start ? this.state.thu_start : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");
        var end5 = moment(this.state.thu_end ? this.state.thu_end : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");
        slider5.update({
            min: start.format("x"),
            max: end.format("x"),
            from: start5.format("x"),
            to: end5.format("x"),
            step: 1800000,
            disable: true,
        });

        var slider6 = $("#friday_venue").data("ionRangeSlider");
        var start6 = moment(this.state.friday_start ? this.state.friday_start : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");
        var end6 = moment(this.state.friday_end ? this.state.friday_end : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");
        slider6.update({
            min: start.format("x"),
            max: end.format("x"),
            from: start6.format("x"),
            to: end6.format("x"),
            step: 1800000,
            disable: true,
        });


        var slider7 = $("#saturday_venue").data("ionRangeSlider");
        var start7 = moment(this.state.sat_start ? this.state.sat_start : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");
        var end7 = moment(this.state.sat_end ? this.state.sat_end : "2017-07-18 10:00", "YYYY-MM-DD HH:mm");
        slider7.update({
            min: start.format("x"),
            max: end.format("x"),
            from: start7.format("x"),
            to: end7.format("x"),
            step: 1800000,
            disable: true,
        });

        $('#sunday').change(function () {

            if ($(this).is(":checked")) {
                slider1.update({"disable": false});
            } else {
                slider1.update({"disable": true});
            }
        });
        $('#monday').change(function () {
            if ($(this).is(":checked")) {
                slider2.update({"disable": false});
            } else {
                slider2.update({"disable": true});
            }
        });
        $('#tuesday').change(function () {
            if ($(this).is(":checked")) {
                slider3.update({"disable": false});
            } else {
                slider3.update({"disable": true});
            }
        });
        $('#wednesday').change(function () {
            if ($(this).is(":checked")) {
                slider4.update({"disable": false});
            } else {
                slider4.update({"disable": true});
            }
        });
        $('#thursday').change(function () {
            if ($(this).is(":checked")) {
                slider5.update({"disable": false});
            } else {
                slider5.update({"disable": true});
            }
        });
        $('#friday').change(function () {
            if ($(this).is(":checked")) {
                slider6.update({"disable": false});
            } else {
                slider6.update({"disable": true});
            }
        });
        $('#saturday').change(function () {
            if ($(this).is(":checked")) {
                slider7.update({"disable": false});
            } else {
                slider7.update({"disable": true});
            }
        });
        $(".operating_hours").attr('disabled', "disabled");
    };

    componentWillMount = () => {
        this.getChartData();

    };

    getChartData = () => {
        var venue_id = VenueID;
        axios.post(BaseUrl + '/api/get-charts-data', {venue_id: venue_id})
            .then(response => {
                if (response.data) {
                    let compaign_saturation = response.data.campaign_saturation_data;
                    let hours = response.data.opening_hr;
                    let configureNumber = response.data.numberConfigure ? response.data.numberConfigure : 0 ;
                    let voucherCode = response.data.voucherCode ? response.data.voucherCode : 9;
                    let billing_status = response.data.billing ;
                    let billingValues = response.data.billingValues;
                    this.setState(() => ({billing_status,billingValues,number:configureNumber.field1,voucher_code:(typeof voucherCode!='null' && typeof voucherCode.field1!='null')?voucherCode.field1:9}), () => {

                    });
                    let data = {
                        contact_perioud_start_sms: compaign_saturation.contact_perioud_start_sms,
                        contact_perioud_end_sms: compaign_saturation.contact_perioud_end_sms,
                        contact_perioud_start_point_me: compaign_saturation.contact_perioud_start_point_me,
                        contact_perioud_end_point_me: compaign_saturation.contact_perioud_end_point_me,
                        is_open_sun: hours[0].is_open,
                        is_open_mon: hours[1].is_open,
                        is_open_tue: hours[2].is_open,
                        is_open_wed: hours[3].is_open,
                        is_open_thu: hours[4].is_open,
                        is_open_fri: hours[5].is_open,
                        is_open_sat: hours[6].is_open,

                        sun_start: hours[0].start_time,
                        sun_end: hours[0].end_time,
                        mon_start: hours[1].start_time,
                        mon_end: hours[1].end_time,
                        tue_start: hours[2].start_time,
                        tue_end: hours[2].end_time,
                        wed_start: hours[3].start_time,
                        wed_end: hours[3].end_time,
                        thu_start: hours[4].start_time,
                        thu_end: hours[4].end_time,
                        friday_start: hours[5].start_time,
                        friday_end: hours[5].end_time,
                        sat_start: hours[6].start_time,
                        sat_end: hours[6].end_time,


                    };

                    this.updateState(data);

                } else {
                    //NotificationManager.error("Error occurred while getting charts data.", 'Error', 1500);
                }
            }).catch((err) => {
            //NotificationManager.error("Error occurred while getting charts data.", 'Error', 1500);

        });

    }

    updateState = (data) => {
        this.setState({
            contact_perioud_start_sms: data.contact_perioud_start_sms,
            contact_perioud_end_sms: data.contact_perioud_end_sms,
            contact_perioud_start_point_me: data.contact_perioud_start_point_me,
            contact_perioud_end_point_me: data.contact_perioud_end_point_me,
            is_open_sun: data.is_open_sun,
            is_open_mon: data.is_open_mon,
            is_open_tue: data.is_open_tue,
            is_open_wed: data.is_open_wed,
            is_open_thu: data.is_open_thu,
            is_open_fri: data.is_open_fri,
            is_open_sat: data.is_open_sat,
            sun_start: data.sun_start,
            sun_end: data.sun_end,
            mon_start: data.mon_start,
            mon_end: data.mon_end,
            tue_start: data.tue_start,
            tue_end: data.tue_end,
            wed_start: data.wed_start,
            wed_end: data.wed_end,
            thu_start: data.thu_start,
            thu_end: data.thu_end,
            friday_start: data.friday_start,
            friday_end: data.friday_end,
            sat_start: data.sat_start,
            sat_end: data.sat_end,

        });

        if (this.state.is_open_sun) {
            document.getElementById("sunday").click();
            this.setState({is_open_sun: true});
        }
        if (this.state.is_open_mon) {
            document.getElementById("monday").click();
            this.setState({is_open_mon: true});
        }
        if (this.state.is_open_tue) {
            document.getElementById("tuesday").click();
            this.setState({is_open_tue: true});
        }
        if (this.state.is_open_wed) {
            document.getElementById("wednesday").click();
            this.setState({is_open_wed: true});
        }
        if (this.state.is_open_thu) {
            document.getElementById("thursday").click();
            this.setState({is_open_thu: true});
        }
        if (this.state.is_open_fri) {
            document.getElementById("friday").click();
            this.setState({is_open_fri: true});
        }
        if (this.state.is_open_sat) {
            document.getElementById("saturday").click();
            this.setState({is_open_sat: true});
        }


        this.campaign_saturation_charts();
        this.operating_hours_charts();

    };


}//..... end of VenueConfig.

VenueConfig.propTypes = {};

export default VenueConfig;