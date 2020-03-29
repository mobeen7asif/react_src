import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import {connect} from "react-redux";
import {addScheduleValue} from "../../../../../../redux/actions/CampaignBuilderActions";

class DynamicSchedulingComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { fromDate: null,startTime:null };

        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }//..... end of constructor() .....//

    handleChangeStartDate(date) {
        this.setState({
            fromDate: date
        });

        this.props.dispatch(addScheduleValue({from_date: date.format('DD-MM-YYYY HH:mm')}));
    }//..... end of handleChangeStartDate() .....//

    componentDidMount() {

        if (this.state.fromDate === null) {
            if (this.props.schedule.from_date) {

                let fromDate = this.props.schedule.from_date.split('-');
                let fromTime = fromDate[2].split(' ');
                this.setState(() => ({
                    fromDate: moment(`${fromTime[0]}-${fromDate[1]}-${fromDate[0]} ${fromTime[1]}`)
                }));
            }//..... end if() .....//
        }//...... end if() .....//
        if(this.state.startTime === null){
            if (this.props.schedule.from_time) {
                let fromDate = this.props.schedule.from_time;
             this.setState(() => ({
                 startTime:moment(fromDate,'HH:mm')
                }));
            }//..... end if() .....//
        }//...... end if() .....//
    }//..... end of componentDidMount() .....//
    handleChange(date) {
        this.setState({
            startTime: date
        });
         this.props.dispatch(addScheduleValue({...this.props.schedule, from_time:date.format('HH:mm')}));
    }//..... end of handleChange() .....//
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="segment_tYpe">
                <div className="segment_tYpe_heading">
                    <h3>Schedule</h3>
                </div>
                <div className="segment_tYpe_detail">
                    <div className="selectDescription">
                        <p>Run the campaign <span style={{fontSize: '10px',marginLeft: '19px',fontStyle: 'italic', color: 'silver'}}>We are using Australian Eastern Standard Time (AEST), please set your time accordingly</span></p>
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
                                            <DatePicker selected={this.state.fromDate} dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm"  minDate={moment()} onChange={this.handleChangeStartDate}/>
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
}//..... end of DynamicSchedulingComponent.

const mapStateToProps = (state) => {
    return {
        schedule: state.campaignBuilder.schedule,
        campaignDeleted  : state.campaignBuilder.campaignDeleted
    };
};
export default connect(mapStateToProps)(DynamicSchedulingComponent);