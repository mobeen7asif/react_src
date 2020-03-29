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


class Communications extends Component {
    state = {
        sms_subscribed_flag:false,
        email_subscribed_flag:false,
        is_pointme_notifications:false
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
                show_loader(true);
                this.setState(()=>({
                    ...this.state,
                    sms_subscribed_flag:response.data.member.sms_subscribed_flag,
                    email_subscribed_flag:response.data.member.email_subscribed_flag,
                    is_pointme_notifications:response.data.member.is_pointme_notifications,
                }),()=>{

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




    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//




    referredStatusChanged = (field_name) => {

        let value = this.state[field_name];
        value = !value;
        this.setState(()=>({[field_name]:value}),()=>{
            this.adjustChannelSettings(this.props.persona_id,field_name,value);
        });
    };

    adjustChannelSettings = (id, channel, value) => {
        show_loader();
        axios.post(BaseUrl + '/api/adjust-member-subscription', {
            id,channel,value,
            company_id      : CompanyID,
            venue_id        : VenueID
        }).then((response) => {
            show_loader(true);
            let message = "";
            if(channel == "sms_subscribed_flag")
                message = "Sms notification ";
            if(channel == "email_subscribed_flag")
                message = "Email notification ";
            if(channel == "is_pointme_notifications")
                message = "App notification ";
            if(value)
                message = message+"activated successfully";
            else
                message = message+"deactivated successfully";

            NotificationManager.success(message, "Success");
        }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while saving settings.", 'Error');
        });
    };//..... end of adjustChannelSettings() .....//




    render() {

        return (
            <div className="e_member_right">
                <div className="add_category_listing">
                    <ul>
                        <li>
                            <div className="add_categoryList_info addProduct_setting" id="printableArea">
                                <div className="newVualt_heading">
                                    <h3>Communications<a href="javascript:void(0);"></a></h3>
                                </div>
                                <div className="categoryInfo_container clearfix">
                                    <div className="addCategoryRight_section">
                                        <div className="edit_category_rightDetail removeHighlights">


                                            <div className="addCategory_formSection">

                                                <ul>
                                                    <li style={{width:"33.3%"}}>
                                                        <div className="customPlaceholder_outer">
                                                            <h4 className="capitalize">SMS</h4>

                                                            <div className="customPlaceholder">
                                                                <ToggleSwitch

                                                                    checked={this.state.sms_subscribed_flag}
                                                                    onChange={(e)=> {this.referredStatusChanged("sms_subscribed_flag")}}
                                                                />
                                                                <span style={{fontWeight:'bold',fontSize:"16px",color:"gray"}}> {this.state.sms_subscribed_flag ? "On" : "Off"}</span>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li style={{width:"33.3%"}}>
                                                        <div className="customPlaceholder_outer">
                                                            <h4 className="capitalize">Email</h4>

                                                            <div className="customPlaceholder">
                                                                <ToggleSwitch

                                                                    checked={this.state.email_subscribed_flag}
                                                                    onChange={(e)=> {this.referredStatusChanged("email_subscribed_flag")}}
                                                                />
                                                                <span style={{fontWeight:'bold',fontSize:"16px",color:"gray"}}> {this.state.email_subscribed_flag ? "On" : "Off"}</span>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li style={{width:"33.3%"}}>
                                                        <div className="customPlaceholder_outer">
                                                            <h4 className="capitalize">Push</h4>

                                                            <div className="customPlaceholder">
                                                                <ToggleSwitch

                                                                    checked={this.state.is_pointme_notifications}
                                                                    onChange={(e)=> {this.referredStatusChanged("is_pointme_notifications")}}
                                                                />
                                                                <span style={{fontWeight:'bold',fontSize:"16px",color:"gray"}}> {this.state.is_pointme_notifications ? "On" : "Off"}</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="clearfix">
                    <div className="e_member_printBtns clearfix">
                        {/*<ul>
                            <li>
                                <input   type="submit" value="SUBMIT" onClick={this.updateMember} />
                            </li>
                        </ul>*/}
                    </div>
                </div>



            </div>
        );
    }//..... end of render() .....//
}//..... end of Member.

Communications.propTypes = {};

// export default MemberSubscriptionStatus;

export default Communications;