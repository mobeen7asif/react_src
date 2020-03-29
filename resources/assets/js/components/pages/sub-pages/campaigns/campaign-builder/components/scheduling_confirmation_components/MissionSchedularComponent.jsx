import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import {connect} from "react-redux";
import {
    addMissionScheduleValue,
    setGameMissionCreatingType
} from "../../../../../../redux/actions/CampaignBuilderActions";

class MissionSchedularComponent extends Component {
    constructor(props) {
        super(props);
        this.state      = { fromDate: null, endDate: null, startTime:null, endTime:null };
    }//..... end of constructor() .....//

    handleChangeFromDate = (date) => {
        this.setState({
            fromDate: date,
            endDate: null
        });

        this.props.dispatch(addMissionScheduleValue({from_date: date.format('DD-MM-YYYY HH:mm'), end_date: null}));
    };//..... end of handleChangeFromDate() .....//

    handleChangeEndDate = (date) => {
        this.setState({
            endDate: date
        });

        this.props.dispatch(addMissionScheduleValue({end_date: date.format('DD-MM-YYYY HH:mm')}));
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
    };//..... end of componentDidMount() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//\

    render() {
        return (
            <div>
                <div className="segment_tYpe">
                    <div className="segment_tYpe_heading">
                        <h3>Schedule</h3>
                    </div>
                    <div className="segment_tYpe_detail">
                        <div className="selectDescription">
                            <p>Run the mission
                                <span style={{fontSize: '10px',marginLeft: '19px',fontStyle: 'italic', color: 'silver'}}>We are using Australian Eastern Standard Time (AEST), please set your time accordingly</span></p>
                        </div>
                  {/*      <div className="schedule_dating clearfix">
                            <div className="startDate_schedule" style={{width: '49%'}}>
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

                            <div className="startDate_schedule endDate_info"  style={{width: '49%'}}>
                                <div className="dropSegmentation_heading clearfix">
                                    <h3>End Date</h3>
                                </div>
                                <div className="startDate_schedule_info">
                                    <div className="datePickerOuter clearfix">
                                        <div>
                                            <div className="datePickerLeft">
                                                <strong>When should mission end</strong>
                                                <div className={(this.props.schedule.from_date) ? "datePicker" : "datePicker disabled"}>
                                                    <DatePicker selected={this.state.endDate}  dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm" minDate={this.state.fromDate} onChange={this.handleChangeEndDate}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>*/}
                    </div>
                </div>
                <div className="continueCancel">
                    {!this.props.campaignDeleted &&
                    <a  style={{cursor:'pointer'}}
                       className={'selecCompaignBttn'}
                       onClick={this.props.setGameMissionToPool}>Save</a>
                    }
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        this.props.dispatch(setGameMissionCreatingType(''));
                    }
                    }>CANCEL</a>
                </div>
        </div>
        );
    }//..... end of render() .....//
}//..... end of MissionSchedularComponent.

const mapStateToProps = (state) => {
    return {
        schedule: state.campaignBuilder.missionToCreate,
        campaignDeleted: state.campaignBuilder.campaignDeleted
    };
};
export default connect(mapStateToProps)(MissionSchedularComponent);