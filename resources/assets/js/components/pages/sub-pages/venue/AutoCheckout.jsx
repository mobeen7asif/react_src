import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {addScheduleValue} from "../../../redux/actions/CampaignBuilderActions";
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import {NotificationManager} from "react-notifications";

class AutoCheckout extends Component {
    saveButton = null; beaconAreaInput = null; minutDataInput = null;

    state = {
        autoChecked : false,
        beacon_condition : false,
        beacon_listining : false,
        minutes_condition : false,
        beacon_area : 0,
        minutesData : 0,
        disable_beacon_condition:true,
        disable_beacon_listining:true,
        disable_minutes_condition: true,
        disable_beacon_area:true,
        disable_minutesData:true


    };

    componentDidMount = () => {
        var venue_id = VenueID;
        axios.post(BaseUrl + '/api/list-venue-data',{venue_id: venue_id})
            .then(response => {
                if(response.data.status){

                    let res = response.data.data;
                    var data = {
                        autoChecked : (res.auto_checkout == 0) ? false : true,
                        beacon_condition : (res.beacon_condition == 0) ? false : true,
                        beacon_listining : (res.beacon_listining == 0) ? false : true,
                        minutes_condition : (res.minutes_condition == 0) ? false : true,
                        beacon_area : res.beacon_area,
                        minutesData : res.beacon_minutes,
                        disable_beacon_listining: (res.auto_checkout == 0 || res.beacon_condition == 1 || res.minutes_condition)? true : false,
                        disable_beacon_condition: (res.auto_checkout == 0)? true : false,
                        disable_minutes_condition: (res.auto_checkout == 0)? true : false,
                        disable_beacon_area: (res.auto_checkout == 0)? true : false,
                        disable_minutesData: (res.auto_checkout == 0)? true : false,
                    };
                    this.setState(()=>(data));
                    this.props.getVenueData(response.data);

                }else{
                    NotificationManager.error("Error occured while saving record", 'Error',1500);
                }
            }).catch((err) => {
        });
    };

    autoChecked = (e) => {
        this.setState((prevState)=>({autoChecked:!prevState.autoChecked}),()=>{

            if(this.state.autoChecked == false){
                this.setState((prevState)=>({
                    beacon_condition:false,beacon_listining:false,minutes_condition:false,beacon_area:0,minutesData:0,
                    disable_beacon_condition:true,disable_beacon_listining:true,disable_minutes_condition:true,disable_beacon_area:true,disable_minutesData:true
                }));
            }else{
                this.setState((prevState)=>({
                    disable_beacon_condition:false,disable_beacon_listining:false,disable_minutes_condition:false,disable_beacon_area:false,disable_minutesData:false
                }));
            }
        });
    };//..... end of handleMembersCap() .....//

    beacon_condition = (e) => {
        this.setState((prevState)=>({beacon_condition:!prevState.beacon_condition}),()=>{
            if(this.state.beacon_condition == true || this.state.minutes_condition == true ){
                this.setState(()=>({beacon_listining:true,disable_beacon_listining:true,beacon_area:200}));
            }else{
                this.setState(()=>({disable_beacon_listining:false}));
            }
        });
    };//..... end of handleMembersCap() .....//

    beacon_listining = (e) => {
        this.setState((prevState)=>({beacon_listining:!prevState.beacon_listining}));
    };//..... end of handleMembersCap() .....//

    minutes_condition = (e) => {
        this.setState((prevState)=>({minutes_condition:!prevState.minutes_condition}),()=>{
            if(this.state.beacon_condition == true || this.state.minutes_condition == true ){
                this.setState(()=>({beacon_listining:true,disable_beacon_listining:true,minutesData:5}));
            }else{
                this.setState(()=>({disable_beacon_listining:false}));
            }
        });
    };//..... end of handleMembersCap() .....//

    beaconAreaInputChanged(value){
        if(this.state.beacon_condition && value.beacon_area <=0){
            NotificationManager.warning("When using AND function, None of the condtion can be turned off or set to 0", 'warning',3000);
            this.setState(()=>({beacon_area:200}));
            return false;
        }
        this.setState(()=>(value));
    };

    minutsInputChanged(value){
        if(this.state.minutes_condition && value.minutesData <=0){
            this.setState(()=>({minutesData:5}));
            NotificationManager.warning("When using AND function, None of the condtion can be turned off or set to 0", 'warning',3000);
            return false;
        }
        this.setState(()=>(value));
    };

    saveAutoCheckout = () => {
        axios.post(BaseUrl + '/api/save-auto-checkout',{...this.state, venue_id: VenueID, company_id: CompanyID})
            .then(response => {
                if(response.status){
                    NotificationManager.success(response.data.message, 'success',1500);
                }else{
                    NotificationManager.error('Error occurred while saving record.', 'error',1500);
                }
            }).catch((err) => {
            NotificationManager.error("Error occurred while getting loyalty data.", 'Error',1500);
        });
    };


    render() {
        return (
            <React.Fragment>
                <div className="dropSegmentation_section" id="auto_checkout_setting"style={{display: 'none'}}>

                    <div className="dropSegmentation_heading clearfix">
                        <h3 style={{fontWeight: 'bold'}}>Site Checkout Feature</h3>
                    </div>

                    <div className="venueInfo_div">
                        <div className="venueIdentification_section">



                            <div className="venueIdentification_form">
                                <ul>


                                    <li className="autoCheckData" style={{display: 'block'}}>
                                        <span style={{fontWeight:'bold'}}>Auto-checkout </span><ToggleSwitch
                                            checked={this.state.autoChecked}
                                            onChange={(e)=> {this.autoChecked(e)}}
                                        />
                                        <span style={{fontWeight:'bold'}}> {this.state.autoChecked ? "ON" : "OFF"}</span>

                                    </li>

                                    <li className="autoCheckData" style={{display: 'block'}}>
                                        <div className="compaignSaturation ">
                                            <span style={{fontWeight:'bold'}}>Out of the area by </span>

                                            <div className="customDropDown compaign_saturation" style={{width:'28%'}}>
                                                <div className="customInput_div">
                                                    <input type="number" pattern="[0-9]*" inputMode="numeric" disabled={this.state.disable_beacon_area} className="change" name="beacon_area" onChange={(e)=>{this.beaconAreaInputChanged({beacon_area:e.target.value})}} value={this.state.beacon_area} id="beacon_area" />
                                                </div>
                                            </div>
                                            <span style={{fontWeight:'bold'}}>meters. (0 = OFF, Minimum ON value is 1)</span>
                                        </div>

                                    </li>

                                    <li className="autoCheckData" style={{display: 'block'}}>
                                        <ToggleSwitch
                                            checked={this.state.beacon_condition}
                                            onChange={(e)=> {this.beacon_condition(e)}}
                                            disabled={this.state.disable_beacon_condition}
                                        />
                                        <span style={{fontWeight:'bold'}}> {this.state.beacon_condition ? "AND" : "OR"}</span>

                                    </li>



                                    <li className="autoCheckData" style={{display: 'block'}}>
                                        <span style={{fontWeight:'bold'}}>Beacon listening active ?  </span><ToggleSwitch
                                        checked={this.state.beacon_listining}
                                        onChange={(e)=> {this.beacon_listining(e)}}
                                        disabled={this.state.disable_beacon_listining}
                                    />
                                        <span style={{fontWeight:'bold'}}>{this.state.beacon_listining ? "Yes" : "No"}</span>

                                    </li>

                                    <li className="autoCheckData" style={{display: 'block'}}>
                                        <ToggleSwitch
                                            checked={this.state.minutes_condition}
                                            onChange={(e)=> {this.minutes_condition(e)}}
                                            disabled={this.state.disable_minutes_condition}
                                        />
                                        <span style={{fontWeight:'bold'}}> {this.state.minutes_condition ? "AND" : "OR"}</span>

                                    </li>

                                    <li className="autoCheckData" style={{display: 'block'}}>
                                        <div className="compaignSaturation ">
                                            <span style={{fontWeight:'bold'}}>After </span>

                                            <div className="customDropDown compaign_saturation" style={{width:'28%'}}>
                                                <div className="customInput_div">
                                                    <input  type="number" pattern="[0-9]*" inputMode="numeric"  disabled={this.state.disable_minutesData} className="change" onChange={(e)=>{this.minutsInputChanged({minutesData:e.target.value})}} name="minutesData" value={this.state.minutesData} id="minutesData" />
                                                </div>
                                            </div>
                                            <span style={{fontWeight:'bold'}}> Minutes</span>
                                        </div>

                                    </li>

                                    <li className="autoCheckData" style={{display: 'block'}}>
                                        <div className="continueCancel" id="auto_checkout_btn" style={{display: 'block',textAlign:'left'}}>
                                           <input id="save_loyalty" className="selecCompaignBttn" ref={(ref)=>{this.saveButton=ref}} onClick={()=>{this.saveAutoCheckout()}} type="submit" value="Save"  />
                                        </div>
                                    </li>





                                </ul>
                            </div>
                        </div>
                    </div>


                </div>
            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of AutoCheckout.

AutoCheckout.propTypes = {};

export default AutoCheckout;