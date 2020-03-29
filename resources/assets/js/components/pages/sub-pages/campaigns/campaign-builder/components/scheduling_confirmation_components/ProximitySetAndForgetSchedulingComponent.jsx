import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import {connect} from "react-redux";
import {addScheduleValue} from "../../../../../../redux/actions/CampaignBuilderActions";

class ProximitySetAndForgetSchedulingComponent extends Component {
    constructor(props) {

        super(props);
        this.state      = { fromDate: null, endDate: null, startTime:null, endTime:null };
        this.capInput   = null;

    }//..... end of constructor() .....//

    handleChangeFromDate = (date) => {
        this.setState({
            fromDate: date,

        });

        this.props.dispatch(addScheduleValue({...this.props.schedule, from_date: date.format('DD-MM-YYYY HH:mm')}));
    };//..... end of handleChangeFromDate() .....//

    handleChangeEndDate = (date) => {
        this.setState({
            endDate: date
        });

        this.props.dispatch(addScheduleValue({...this.props.schedule, end_date: date.format('DD-MM-YYYY HH:mm')}));
    };//..... end of handleChangeEndDate() .....//


    componentDidMount = () => {
        if (this.state.fromDate === null) {
            if (this.props.schedule.from_date) {
                let fromDate = this.props.schedule.from_date.split('-');
                let fromTime = fromDate[2].split(' ');

                this.setState(() => ({
                    fromDate: moment(`${fromTime[0]}-${fromDate[1]}-${fromDate[0]} ${fromTime[1]}`)
                }));
            }//..... end if() .....//
        }//...... end if() .....//

        if (this.state.endDate === null) {
            if (this.props.schedule.end_date) {
                let endDate = this.props.schedule.end_date.split('-');
                let endTime = endDate[2].split(' ');
                this.setState(() => ({
                    endDate: moment(`${endTime[0]}-${endDate[1]}-${endDate[0]} ${endTime[1]}`)
                }));
            }//..... end if() .....//
        }//...... end if() .....//



        if (!this.props.schedule.isCapCampaign) {
            this.props.dispatch(addScheduleValue({...this.props.schedule, isCapCampaign: false}));
        } else {
            document.querySelector('.onoffswitchInnerFlag').style.marginLeft = 0;
            document.querySelector('.switchButton').style.marginRight = '-25px';
        }//..... end if() .....//
    };//..... end of componentDidMount() .....//

    quantityUp = () => {
        let val = parseInt(this.capInput.value);
        let result = (isNaN(val)) ? 1 : ++val;
        this.setCapCampaign(result);
    };//..... end of quantityUp() .....//

    quantityDown = () => {
        let val = parseInt(this.capInput.value);
        let result = (isNaN(val) || val <= 1) ? 1 : --val;
        this.setCapCampaign(result);
    };//..... end of quantityDown() .....//

    setCapCampaign = (result) => {
        this.props.dispatch(addScheduleValue({...this.props.schedule, cap: result}));
    };//..... end of setCapCampaign() .....//

    handleMembersCap = (e) => {
        let switchInner = document.querySelector('.onoffswitchInnerFlag');
        let switchDiv = document.querySelector('.switchButton');

        if (this.props.schedule.isCapCampaign) {
            switchInner.style.marginLeft = "-100%";
            switchDiv.style.marginRight = 0;
            this.props.dispatch(addScheduleValue({...this.props.schedule, isCapCampaign: false}));
        } else {
            switchInner.style.marginLeft = 0;
            switchDiv.style.marginRight = '-25px';
            this.props.dispatch(addScheduleValue({...this.props.schedule, isCapCampaign: true}));
        }//..... end if-else() .....//
    };//..... end of handleMembersCap() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//\


    render() {

        return (

            <div className="segment_tYpe">
                <div className="segment_tYpe_heading">
                    <h3>Schedule</h3>
                </div>
                <div className="segment_tYpe_detail">
                    <div className="selectDescription">
                        <p>Run the campaign
                            <span style={{fontSize: '10px',marginLeft: '19px',fontStyle: 'italic', color: 'silver'}}>We are using Australian Eastern Standard Time (AEST), please set your time accordingly</span></p>
                    </div>

                    <div className="schedule_dating clearfix">
                        <div className="startDate_schedule">
                            <div className="dropSegmentation_heading clearfix">
                                <h3>Start Date</h3>
                            </div>

                            <div className="startDate_schedule_info">
                                <div className="datePickerOuter clearfix">
                                    <div className="datePickerLeft">
                                        <strong>From Date</strong>
                                        <div className="datePicker">
                                            <DatePicker selected={this.state.fromDate}  dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm" minDate={moment()} onChange={this.handleChangeFromDate}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="startDate_schedule endDate_info">
                            <div className="dropSegmentation_heading clearfix">
                                <h3>End Date</h3>
                            </div>
                            <div className="startDate_schedule_info">
                                <div className="datePickerOuter clearfix">
                                    <div className="endDate_info_left">
                                        <div className="datePickerLeft">
                                            <strong>When should campaign end</strong>
                                            <div className={(this.props.schedule.from_date) ? "datePicker" : "datePicker disabled"}>
                                                <DatePicker selected={this.state.endDate}  dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm" minDate={this.state.fromDate} onChange={this.handleChangeEndDate}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="endDate_info_right">
                                        <div className="endDate_info_right_text">
                                            <p>Do you wish to cap the amount of members who can receive this campaign</p>
                                            <div className={(this.props.schedule.from_date) ? "endDtae_off": "endDtae_off disabled"}>
                                                <div className="onoffswitch">
                                                        <label className="onoffswitch-label" htmlFor="sunday" onClick={(e)=> {this.handleMembersCap(e)}}>
                                                            <span className="onoffswitch-inner onoffswitchInnerFlag"></span>
                                                            <span className="onoffswitch-switch switchButton" style={{backgroundColor: '#d2d6dd'}}></span>
                                                        </label>
                                                </div>
                                            </div>
                                            <div className="selectFlorrr  message_delay compaignTrigger">
                                                <div className="compaignDescription_outer     clearfix">
                                                    <label>Cap campaign at </label>
                                                    <div className="fieldIncremnt">
                                                        <div className={this.props.schedule.isCapCampaign ? "quantity clearfix": "quantity clearfix disabled"}>
                                                            <input min="1" step="1" type="number" ref={(ref) => this.capInput = ref} onChange={e => this.setCapCampaign(e.target.value)} value={this.props.schedule.cap ? this.props.schedule.cap : ''}/>
                                                            <div className="quantity-nav">
                                                                <div className="quantity-button quantity-up" onClick={(e)=>{this.quantityUp()}}>&nbsp;</div>
                                                                <div className="quantity-button quantity-down" onClick={(e)=>{this.quantityDown()}}>&nbsp;</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <label>triggers</label>
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
}//..... end of ProximitySetAndForgetSchedulingComponent.

const mapStateToProps = (state) => {
    return {
        schedule: state.campaignBuilder.schedule,
        campaignDeleted  : state.campaignBuilder.campaignDeleted
    };
};
export default connect(mapStateToProps)(ProximitySetAndForgetSchedulingComponent);