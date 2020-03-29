import React, {Component} from 'react';
import {
    addMissionValue, setDuplicatedMission,
    setGameMissionCreatingType
} from "../../../../../../redux/actions/CampaignBuilderActions";
import {connect} from "react-redux";

class MissionDetailsComponent extends Component {
    currentTab  = this.props.currentTab;

    render() {
        return (
            <div>
                <div className="compaign_segments">
                    <div className="segment_tYpe">
                        <div className="segment_tYpe_heading">
                            <h3>MISSION DETAILS</h3>
                        </div>
                        <div className="segment_tYpe_detail">
                            <div className="selectDescription">
                                <p>Name and describe your new mission in a way that will make sense to other staff at your site. Your members will not see these details. Your description should describe exactly what you want to achieve from your mission. You must complete both fields to continue.</p>
                            </div>
                            <div className="newSegment_form">
                                <ul>
                                    <li>
                                        <label>Mission Name</label>
                                        <div className="segmentInput">
                                            <input type="text" id={'dynamicCampaignName'} placeholder="Mission Name" onChange={(e)=>{this.props.dispatch(addMissionValue({title: e.target.value}))}} value={this.props.title}/>
                                        </div>
                                    </li>
                                    <li>
                                        <label>Mission Description</label>
                                        <div className="segmentInput segmentARea">
                                            <textarea style={{fontFamily: "'Roboto', sans-serif"}} placeholder="Mission Description" id={'dynamicCampaignDescription'} onChange={(e)=>{this.props.dispatch(addMissionValue({description: e.target.value}))}} value={this.props.description}></textarea>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="continueCancel">
                    <input type="submit" id={'dynamicCampaignContinueBtn'} value={this.props.type === 'mission-duplication' ? 'Save' : "CONTINUE"} onClick={(e) => { this.props.type === 'mission-duplication' ? this.props.dispatch(setDuplicatedMission()) :this.props.setCurrentTab(++this.currentTab) }} className={ (this.props.title == '' || this.props.description == '') ? 'disabled selecCompaignBttn' : 'selecCompaignBttn'}/>
                    <a href="#" onClick={(e) => {e.preventDefault(); this.props.dispatch(setGameMissionCreatingType(''));}}>CANCEL</a>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of GameDetailsComponent.

const mapStateToProps = (state) => {
    return {
        title: state.campaignBuilder.missionToCreate.title,
        description: state.campaignBuilder.missionToCreate.description,
        currentTab: state.campaignBuilder.selectedTab,
        type: state.campaignBuilder.gameMissionTypeToCreate,// 'mission-duplication'
    };
};

export default connect(mapStateToProps)(MissionDetailsComponent);