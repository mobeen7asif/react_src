import React, {Component} from 'react';
import {connect} from "react-redux";
import GamesGridComponent from "./GamesGridComponent";
import GameDetailsComponent from "./GameDetailsComponent";
import MissionDetailsComponent from "./MissionDetailsComponent";

class GameBuilderComponent extends Component {
    render() {
        return (
            <div>
                {this.props.type === 'game' || this.props.type === 'game-outcome'
                    ? <GameDetailsComponent setCurrentTab={this.props.setCurrentTab}/>
                    : (this.props.type === 'game-mission' || this.props.type === 'mission-duplication' ? <MissionDetailsComponent setCurrentTab={this.props.setCurrentTab}/>
                        :<GamesGridComponent saveCampaign={this.props.saveCampaign}/>)}
            </div>
        );
    }//..... end of render() .....//
}//..... end of GameBuilderComponent.

const mapStateToProps = (state) => {
    return {
       type: state.campaignBuilder.gameMissionTypeToCreate,
    };
};
export default connect(mapStateToProps)(GameBuilderComponent);