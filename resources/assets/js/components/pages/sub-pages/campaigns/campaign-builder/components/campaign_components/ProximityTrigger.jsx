import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import { Scrollbars } from 'react-custom-scrollbars';
import ProximityTriggersValidator from "../../../../../../utils/ProximityTriggersValidator";
import {connect} from "react-redux";
import {
    addBeaconsList,
    addCampaignValue,
    addFloorsList,
    setBeaconsData
} from "../../../../../../redux/actions/CampaignBuilderActions";

class ProximityTrigger extends Component {
    currentTab              = this.props.currentTab;
    dropDownUlRef           = null;
    floorDropDownSpan       = null;
    frequencyDropDownSpan   = null;
    frequencyDropDownUlRef  = null;
    proximityValidator      = new ProximityTriggersValidator;

    messageFrequency    = ['once', 'multiple'];

    componentDidMount = () => {
        if (this.props.floors.length === 0)
            this.getFloorsList();

        if (this.props.beacons.length === 0 && this.props.isEditMode)
            this.getLevelBeacons(this.props.beaconsData.selectedFloorPlan);
    };//..... end of componentDidMount() .....//

    floorSpanClicked = (e) => {
        e.target.classList.toggle('changeAero');
        this.dropDownUlRef.style.display =  (this.dropDownUlRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of floorSpanClicked() .....//

    getFloorsList = () => {
        axios.get(`${BaseUrl}/api/floor-list/${VenueID}`)
            .then((response)=> {
                this.props.dispatch(addFloorsList(response.data));
            }).catch((err) => {
                NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of getFloorsList() .....//

    selectFloor = ({id: selectedFloorPlan, name: selectedFloorPlanName, image: selectedFloorImageName, beacon_id = "", beacon_name = ""} = {}) => {
        this.dropDownUlRef.style.display = 'none';
        this.floorDropDownSpan.classList.remove('changeAero');
        this.props.dispatch(setBeaconsData({selectedFloorPlan, selectedFloorPlanName, selectedFloorImageName, beacon_id, beacon_name}));
        this.getLevelBeacons(selectedFloorPlan);
    };//.... end of selectFloor() .....//

    selectMechanic = (beacon_event) => {
        this.props.dispatch(setBeaconsData({beacon_event}));
    };//..... end of selectMechanic() .....//

    selectMessageFrequency = (frequency) => {
        this.frequencyDropDownUlRef.style.display = 'none';
        this.frequencyDropDownSpan.classList.remove('changeAero');
        this.props.dispatch(addCampaignValue({trigger_type: frequency}))
    };//..... end of selectMessageFrequency() .....//

    handleFrequencySpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.frequencyDropDownUlRef.style.display =  (this.frequencyDropDownUlRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleFrequencySpanClick() .....//

    quantityUpHours = () => {
        let intVersion = parseInt(this.props.beaconsData.trigger_value_hour);
        intVersion  = (!isNaN(intVersion)) ? intVersion + 1 : 1;
        this.props.dispatch(setBeaconsData({trigger_value_hour: intVersion}));
    };//...... end of quantityUpHours() ......//

    quantityDownHours = () => {
        let intVersion = parseInt(this.props.beaconsData.trigger_value_hour);
        if ( intVersion > 0) {
            this.props.dispatch(setBeaconsData({trigger_value_hour: intVersion - 1}));
        }//..... end if() .....//
    };//...... end of quantityDownHours() ......//

    setHourQuantityValue = (e) => {
        let intVersion = parseInt(e.target.value);
        if (! isNaN(intVersion)) {
            this.props.dispatch(setBeaconsData({trigger_value_hour: intVersion}));
        }//..... end if() .....//
    };//...... end of setHourQuantityValue() ......//

    setMinuteQuantityValue = (e) => {
        let intVersion = parseInt(e.target.value);
        if (! isNaN(intVersion)) {
            this.props.dispatch(setBeaconsData({trigger_value_min: intVersion}));
        }//..... end if() .....//
    };//...... end of setMinuteQuantityValue() ......//

    quantityUpMinutes = () => {
        let intVersion = parseInt(this.props.beaconsData.trigger_value_min);
        intVersion  = (!isNaN(intVersion)) ? intVersion + 1 : 1;
        this.props.dispatch(setBeaconsData({trigger_value_min: intVersion}));
    };//...... end of quantityUpMinutes() ......//

    quantityDownMinutes = () => {
        let intVersion = parseInt(this.props.beaconsData.trigger_value_min);
        if ( intVersion > 0) {
            this.props.dispatch(setBeaconsData({trigger_value_min: intVersion - 1}));
        }//..... end if() .....//
    };//...... end of quantityUpMinutes() ......//

    getLevelBeacons = (level_id) => {
        axios.get(`${BaseUrl}/api/floor-beacons/${VenueID}/${level_id}`)
            .then((response)=> {
                this.props.dispatch(addBeaconsList(response.data));
            }).catch((err) => {
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of getLevelBeacons() ......//

    selectBeacon = ({id: beacon_id = '', beacon_name = ''} = {}) => {
        this.props.dispatch(setBeaconsData({...this.props.beaconsData, beacon_name, beacon_id}));
    };//..... end of selectBeacon() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div>
                <div className="compaign_segments proximityHeading">
                    <div className="segment_tYpe">
                        <div className="segment_tYpe_heading">
                            <h3>Proximity Trigger</h3>
                        </div>
                        <div className="segment_tYpe_detail">
                            <div className="proximityTrider_contant">
                                <div className="selectDescription">
                                    <p>Choose a Beacon and trigger mechanic to trigger your campaign. You must choose both to continue.</p>
                                </div>
                                <div className="segment_tYpe">
                                    <div className="segment_tYpe_heading">
                                        <h3>Choose Beacon</h3>
                                    </div>
                                    <div className="segment_tYpe_detail">
                                        <div className="selectDescription">
                                            <p>Choose which Beacon will trigger the campaign. First select a floor, then click on the beacon you wish to use.</p>
                                        </div>
                                        <div className="selectFlorrr">
                                            <div className="compaignDescription_outer   clearfix">
                                                <label>Select the floor</label>
                                                <div className="placeHolderOuter expandPlaceholder clearfix">
                                                    <div className="customDropDown">
                                                        <span onClick={this.floorSpanClicked} ref={(ref) => {this.floorDropDownSpan = ref;}}> {this.props.beaconsData.selectedFloorPlanName ? this.props.beaconsData.selectedFloorPlanName : 'Select the floor'} </span>
                                                        <ul className="customDropDown_show customPlaceHolder" ref={(refrence) => {this.dropDownUlRef = refrence;}} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                                {
                                                                    this.props.floors.map((floor) => {
                                                                        return <li key={floor.venue_level} onClick={(e) => this.selectFloor({id: floor.venue_level, name: floor.floor_name, image: floor.floor_plan})}
                                                                        className={this.props.beaconsData.selectedFloorPlan === floor.venue_level ? 'selectedItem' : ''}>{floor.floor_name}</li>
                                                                    })
                                                                }
                                                            </Scrollbars>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="buildMap">
                                            {this.props.beacons.length > 0 &&
                                            <span className="show-mutiple-beacons" style={{position: 'relative'}}>
                                                {
                                                    this.props.beacons.map((beacon) => {
                                                        return (
                                                            <span key={beacon.id} className="beacon-style-on-main-add tooltip" style={{top:`${beacon.x_coordinate * 700-250}px`, left: `${beacon.y_coordinate * 251+240}px`,
                                                                background: this.props.beaconsData.beacon_id === beacon.id ? `url(${BaseUrl}/assets/images/blueTooth2.png)` : `url(${BaseUrl}/assets/images/blueTooth.png)`}}
                                                                onClick={(e) => this.selectBeacon(beacon)}>
                                                                <span className="tooltiptext">{beacon.beacon_name}<br/>Active</span>
                                                            </span>
                                                        );
                                                    })
                                                }
                                            </span>
                                            }
                                            <img src={this.props.beaconsData.selectedFloorImageName ? BaseUrl+'/floor_plan/'+this.props.beaconsData.selectedFloorImageName : "assets/images/choose_beacon_img.png"} alt="#"
                                                 style={{display:'block', maxHeight:'350px', minHeight:'350px', maxWidth: '975px', minWidth: '975px', margin:'auto'}}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="segment_tYpe">
                                    <div className="segment_tYpe_heading">
                                        <h3>Choose Mechanic</h3>
                                    </div>
                                    <div className="segment_tYpe_detail">
                                        <div className="selectDescription">
                                            <p>Choose which mechanic will trigger the campaign.</p>
                                        </div>
                                        <div className="mechanic_option">
                                            <div className="segmentsOptions clearfix">
                                                <ul>
                                                    <li>
                                                        <div className="segmentsOptions_detail">
                                                            <span onClick={(e)=> {this.selectMechanic('immediate')}} className={this.props.beaconsData.beacon_event === 'immediate' ? 'selectedBox' : ''}>
                                                                <b className="imediate_machine">&nbsp;</b>
                                                            </span>
                                                            <h3>Immediate</h3>
                                                            <p>Select this event trigger if you would like to interact
                                                                with a user who is within 0-30cm of the selected
                                                                beacon.</p>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="segmentsOptions_detail">
                                                            <span onClick={(e)=> {this.selectMechanic('near')}} className={this.props.beaconsData.beacon_event === 'near' ? 'selectedBox' : ''}>
                                                                <b className="near_machine">&nbsp;</b>
                                                            </span>
                                                            <h3>Near</h3>
                                                            <p>Select this event trigger if you would like to interact
                                                                with a user who is within
                                                                1-5m of the selected beacon</p>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="segmentsOptions_detail">
                                                            <span onClick={(e)=> {this.selectMechanic('enter')}} className={this.props.beaconsData.beacon_event === 'enter' ? 'selectedBox' : ''}>
                                                                <b className="enter_machine">&nbsp;</b>
                                                            </span>
                                                            <h3>Enter region</h3>
                                                            <p>Select this event trigger if you would like to interact
                                                                with a user when they come within the range of a
                                                                specific beacon</p>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="segmentsOptions_detail">
                                                            <span  onClick={(e)=> {this.selectMechanic('exit')}}  className={this.props.beaconsData.beacon_event === 'exit' ? 'selectedBox' : ''}>
                                                                <b className="exit_machine">&nbsp;</b>
                                                            </span>
                                                            <h3>Exit region</h3>
                                                            <p>Select this event trigger if you would like to interact
                                                                with a user who has left the range of a specific
                                                                beacon.</p>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="segmentsOptions_detail">
                                                            <span onClick={(e)=> {this.selectMechanic('dwell')}}  className={this.props.beaconsData.beacon_event === 'dwell' ? 'selectedBox' : ''}>
                                                                <b className="dwell_machine">&nbsp;</b>
                                                            </span>
                                                            <h3>Dwell time</h3>
                                                            <p>Select this event trigger if you would like to interact
                                                                with a user who has spent a defined time within the
                                                                range of a specific beacon.</p>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="segment_tYpe">
                        <div className="segment_tYpe_heading">
                            <h3>Message Frequency</h3>
                        </div>
                        <div className="segment_tYpe_detail">
                            <div className="proximityTrider_contant">
                                <div className="selectDescription">
                                    <p>Choose your Proximity Trigger and trigger criteria. You must define both to continue.</p>
                                </div>
                                <div className="segment_tYpe">
                                    <div className="segment_tYpe_heading">
                                        <h3>Message Frequency</h3>
                                    </div>
                                    <div className="segment_tYpe_detail">
                                        <div className="selectDescription">
                                            <p>Specify how often the member can receive this message.</p>
                                        </div>
                                        <div className="selectFlorrr message_trigger">
                                            <div className="compaignDescription_outer   clearfix">
                                                <label>Campaign can be triggered </label>
                                                <div className="placeHolderOuter expandPlaceholder clearfix">
                                                    <div className="customDropDown">
                                                        <span onClick={this.handleFrequencySpanClick} ref={(ref) => {this.frequencyDropDownSpan = ref;}}> {this.props.campaign.trigger_type ? this.props.campaign.trigger_type : 'Select message frequency'} </span>
                                                        <ul className="customDropDown_show customPlaceHolder" ref={(refrence) => {this.frequencyDropDownUlRef = refrence;}} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                                {
                                                                    this.messageFrequency.map((frequency) => {
                                                                        return <li key={frequency} onClick={(e) => this.selectMessageFrequency(frequency)}
                                                                                   className={this.props.campaign.trigger_type === frequency ? 'selectedItem' : ''}>{frequency}</li>
                                                                    })
                                                                }
                                                            </Scrollbars>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <label>by each member</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="segment_tYpe">
                                    <div className="segment_tYpe_heading">
                                        <h3>Message Delay</h3>
                                    </div>
                                    <div className="segment_tYpe_detail">
                                        <div className="selectDescription">
                                            <p>How long before a member can trigger this message again.</p>
                                        </div>
                                        <div className="selectFlorrr message_delay ">
                                            <div className="compaignDescription_outer   clearfix">
                                                <label>Hours</label>
                                                <div className="fieldIncremnt">
                                                    <div className="quantity clearfix">
                                                        <input type="number" min="1" step="1" value={this.props.beaconsData.trigger_value_hour} onChange={this.setHourQuantityValue}/>
                                                            <div className="quantity-nav">
                                                                <div className="quantity-button quantity-up" onClick={this.quantityUpHours}>&nbsp;</div>
                                                                <div className="quantity-button quantity-down" onClick={this.quantityDownHours}>&nbsp;</div>
                                                            </div>
                                                    </div>
                                                </div>
                                                <label>Minutes</label>
                                                <div className="fieldIncremnt">
                                                    <div className="quantity clearfix">
                                                        <input type="number" min="1" step="1" value={this.props.beaconsData.trigger_value_min} onChange={this.setMinuteQuantityValue}/>
                                                        <div className="quantity-nav">
                                                            <div className="quantity-button quantity-up" onClick={this.quantityUpMinutes}>&nbsp;</div>
                                                            <div className="quantity-button quantity-down" onClick={this.quantityDownMinutes}>&nbsp;</div>
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
                </div>
                <div className="continueCancel">
                    <input type="submit" value="CONTINUE" onClick={(e) => { this.props.setCurrentTab(++this.currentTab) }} className={this.proximityValidator.validate(this.props.beaconsData, this.props.campaign) ? 'selecCompaignBttn' : 'selecCompaignBttn disabled'}/>
                    <a href="#">CANCEL</a>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of ProximityTrigger.

const mapStateToProps = (state) => {
    return {
        campaign    : state.campaignBuilder.campaign,
        beaconsData : state.campaignBuilder.beaconsData,
        beacons     : state.campaignBuilder.beacons,
        floors      : state.campaignBuilder.floors,
        currentTab  : state.campaignBuilder.selectedTab,
    };
};

export default connect(mapStateToProps)(ProximityTrigger);