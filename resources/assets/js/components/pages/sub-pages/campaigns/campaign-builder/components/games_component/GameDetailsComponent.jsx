import React, {Component} from 'react';
import {addGameValue, setGameMissionCreatingType} from "../../../../../../redux/actions/CampaignBuilderActions";
import {connect} from "react-redux";

class GameDetailsComponent extends Component {
    currentTab  = this.props.currentTab;

    render() {
        return (
            <div>
                <div className="compaign_segments">
                    <div className="segment_tYpe">
                        <div className="segment_tYpe_heading">
                            <h3>GAME DETAILS</h3>
                        </div>
                        <div className="segment_tYpe_detail">
                            <div className="selectDescription">
                                <p>Name and describe your new game in a way that will make sense to other staff at your site. Your members will not see these details. Your description should describe exactly what you want to achieve from your game. You must complete both fields to continue.</p>
                            </div>
                            <div className="newSegment_form">
                                <ul>
                                    <li>
                                        <label>Game Name</label>
                                        <div className="segmentInput">
                                            <input type="text" id={'dynamicCampaignName'} placeholder="Game Name" onChange={(e)=>{this.props.dispatch(addGameValue({title: e.target.value}))}} value={this.props.title}/>
                                        </div>
                                    </li>
                                    <li>
                                        <label>Game Description</label>
                                        <div className="segmentInput segmentARea">
                                            <textarea style={{fontFamily: "'Roboto', sans-serif"}} placeholder="Game Description" id={'dynamicCampaignDescription'} onChange={(e)=>{this.props.dispatch(addGameValue({description: e.target.value}))}} value={this.props.description}></textarea>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="continueCancel">
                    <input type="submit" id={'dynamicCampaignContinueBtn'} value="CONTINUE" onClick={(e) => { this.props.setCurrentTab(5) }} className={ (this.props.title == '' || this.props.description == '') ? 'disabled selecCompaignBttn' : 'selecCompaignBttn'}/>
                    <a href="#" onClick={(e) => {e.preventDefault(); this.props.dispatch(setGameMissionCreatingType(''));}}>CANCEL</a>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of GameDetailsComponent.

const mapStateToProps = (state) => {
    return {
        title: state.campaignBuilder.gameToCreate.title,
        description: state.campaignBuilder.gameToCreate.description,
        currentTab: state.campaignBuilder.selectedTab,
    };
};

export default connect(mapStateToProps)(GameDetailsComponent);