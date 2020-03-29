import React, {Component} from 'react';
import DynamicSchedulingComponent from "./scheduling_confirmation_components/DynamicSchedulingComponent";
import ProximitySetAndForgetSchedulingComponent from "./scheduling_confirmation_components/ProximitySetAndForgetSchedulingComponent";
import SchedulingAndConfirmationValidator from "../../../../../utils/SchedulingAndConfirmationValidator";
import {addCampaignSchedulerType, addScheduleValue} from "../../../../../redux/actions/CampaignBuilderActions";
import {connect} from "react-redux";
import {selectMessageBuilderObject} from "../../../../../redux/selectors/Selectors";
import MissionSchedularComponent from "./scheduling_confirmation_components/MissionSchedularComponent";

class SchedulingAndConfirmation extends Component {
    constructor(props) {
        super(props);
        this.validator = new SchedulingAndConfirmationValidator;
    }//..... end of constructor() .....//

    componentDidMount() {
        if (this.props.campaign.selectedCampaign === 'Dynamic' || this.props.campaign.selectedCampaign === 'Virtual Voucher') {
            if (this.props.campaignSchedulerType === '' || ['run_now', 'schedule','permanent'].indexOf(this.props.campaignSchedulerType) === -1) {
                this.setSchedulerType('run_now');
                this.setScheduleValue({});
            }//..... end if() .....//
        } else {
            if (this.props.campaignSchedulerType === '' || ['permanent', 'schedule'].indexOf(this.props.campaignSchedulerType) === -1) {
                this.setSchedulerType('permanent');
                this.setScheduleValue({});
            }//..... end if() .....//
        }//..... end if-else() .....//

        if(!appPermission("Activate Campaigns","view")){
            this.setSchedulerType('schedule');
        }
    }//..... end of componentDidMount() .....//

    setSchedulerType = (schedulerType) => {
        this.props.dispatch(addCampaignSchedulerType(schedulerType));
        this.setScheduleValue({});
    };//..... end of setSchedulerType() .....//

    setScheduleValue = (scheduleObject) => {
        this.props.dispatch(addScheduleValue(scheduleObject));
    };//..... end of setSchedulerType() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <React.Fragment>

                {this.props.campaign.selectedCampaign === 'Gamification'
                    ?
                    (this.props.gameMissionTypeToCreate === 'game-mission'
                            ? <MissionSchedularComponent setGameMissionToPool={this.props.setGameMissionToPool}/>
                            : (
                                <div>
                                    <div className="compaign_segments">
                                        <div className="segment_tYpe">
                                            <div className="segment_tYpe_heading">
                                                <h3>Scheduling</h3>
                                            </div>
                                            <div className="segment_tYpe_detail">
                                                <div className="selectDescription">
                                                    <p>Save Or Cancel the {this.props.gameMissionTypeToCreate == 'game-outcome' ? 'Outcome of the Game' : 'Game'}.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="continueCancel">
                                        {!this.props.campaignDeleted &&
                                        <a  style={{cursor:'pointer'}} onClick={this.props.setGameToPool}
                                           className={'selecCompaignBttn'}>Save</a>
                                        }
                                        <a href="#">CANCEL</a>
                                    </div>
                                </div>
                            )
                    )
                    : (
                        <div>
                            <div className="compaign_segments">
                                <div className="segment_tYpe">
                                    <div className="segment_tYpe_heading">
                                        <h3>Scheduling</h3>
                                    </div>
                                    <div className="segment_tYpe_detail">
                                        <div className="selectDescription">
                                            <p>Define the campaign start and finish dates or set up a permanent campaign. You must make a choice to continue.</p>
                                            {this.props.type === 'integrated-voucher' &&
                                            <p><i style={{fontSize: '16px', color: '#ab5454'}}>{/*As this application doesn't support inventory, so campaign with integrated reward type will not be executed.*/}</i></p>}
                                        </div>
                                        <div className="segment_tYpe_columns runSchedule">
                                            <ul>
                                                {((this.props.campaign.selectedCampaign === 'Dynamic' || this.props.campaign.selectedCampaign === 'Virtual Voucher') && (appPermission("Activate Campaigns","view"))) &&

                                                <li>

                                                    <div className="segmentsOptions_detail">
                                                    <span className={(this.props.campaignSchedulerType === 'run_now') ? 'choseSegmnt' : ''}>
                                                        <b className="run_icon" onClick={(e)=> {this.setSchedulerType('run_now')}}>&nbsp;</b>
                                                    </span>

                                                        <h3>Run Now</h3>
                                                    </div>

                                                </li>

                                                }

                                                {(this.props.campaign.selectedCampaign != 'Virtual Voucher' && appPermission("Activate Campaigns","view")) &&
                                                <li>
                                                    <div className="segmentsOptions_detail">
                                                    <span className={(this.props.campaignSchedulerType === 'permanent') ? 'choseSegmnt' : ''}>
                                                        <b className="permanent_icon" onClick={(e)=> {this.setSchedulerType('permanent')}}>&nbsp;</b>
                                                    </span>
                                                        <h3>Permanent</h3>
                                                    </div>
                                                </li>
                                                }

                                                <li>
                                                    <div className="segmentsOptions_detail">

                                                <span className={(this.props.campaignSchedulerType === 'schedule') ? 'choseSegmnt' : ''}>
                                                    <b className="sched_icon" onClick={(e)=> {this.setSchedulerType('schedule')}}>&nbsp;</b>
                                                </span>
                                                        <h3>Schedule</h3>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                {this.getTemplate()}
                            </div>
                            <div className="continueCancel">
                                {!this.props.campaignDeleted &&
                                <a  style={{cursor:'pointer'}} onClick={this.props.saveCampaign}
                                   className={this.validator.validate(this.props.campaignSchedulerType, this.props.schedule, this.props.campaign.selectedCampaign) ? 'selecCompaignBttn' : 'disabled selecCompaignBttn'}>CONTINUE</a>
                                }
                                <a href="#">CANCEL</a>
                            </div>
                        </div>
                    )}
            </React.Fragment>
        );
    }//..... end of render() .....//

    getTemplate = () => {
        if (this.props.campaign.selectedCampaign === 'Dynamic' && this.props.campaignSchedulerType === 'schedule')
            return <DynamicSchedulingComponent />;
        else if (this.props.campaign.selectedCampaign !== 'Dynamic' && this.props.campaignSchedulerType === 'schedule')
            return <ProximitySetAndForgetSchedulingComponent />;
        else
            return '';
    };//...... end of getTemplate() .....//
}//..... end of SchedulingAndConfirmation.

const mapStateToProps = (state) => {
    return {
        campaign: state.campaignBuilder.campaign,
        campaignSchedulerType : state.campaignBuilder.campaignSchedulerType,
        schedule: state.campaignBuilder.schedule,
        gameMissionTypeToCreate: state.campaignBuilder.gameMissionTypeToCreate,
        type  : selectMessageBuilderObject(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel).type || '',
        campaignDeleted  : state.campaignBuilder.campaignDeleted
    };
};
export default connect(mapStateToProps)(SchedulingAndConfirmation);