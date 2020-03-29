import React, {Component} from 'react';
import SmsBuilder from "./alert_sms_builder/SmsBuilder";
import {connect} from "react-redux";
import {selectMessageBuilderObject} from "../../../../../../redux/selectors/Selectors";
import {setAlertMessageBuilderType,} from "../../../../../../redux/actions/CampaignBuilderActions";
import CompetitionBuilderComponent from "./reward_sms_builder/CompetitionBuilderComponent";
import AnimationBuilderComponent from "./reward_sms_builder/AnimationBuilderComponent";

class AlertSmsBuilder extends Component {
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    setMessageType = (type) => {
        this.props.dispatch(setAlertMessageBuilderType(this.props.currentChannel, type));
    };

    render() {
        return (
            <div>
                <div className="chooseMessageType">
                <label>Choose your Message type for users.</label>
                <div className="chooseMessageType_icons">
                    <div className="segmentsOptions clearfix">
                        <ul>
                            <li>
                                <div className="segmentsOptions_detail">
                                    <span className={this.props.messageBuilder.type === 'text' ? 'choseSegmnt': ''}>
                                        <b className="chooseText" onClick={(e)=> { this.setMessageType('text')}}>&nbsp;</b>
                                    </span>
                                    <h3>Text Message</h3>
                                </div>
                            </li>
                            <li>
                                <div className="segmentsOptions_detail">
                                    <span className={this.props.messageBuilder.type === 'image' ? 'choseSegmnt': ''}>
                                        <b className="chooseImg" onClick={(e)=> { this.setMessageType('image')}}>&nbsp;</b>
                                    </span>
                                    <h3>Image Message</h3>
                                </div>
                            </li>
                            <li>
                                <div className="segmentsOptions_detail">
                                    <span className={this.props.messageBuilder.type === 'video' ? 'choseSegmnt': ''}>
                                        <b className="chooseVideo" onClick={(e)=> { this.setMessageType('video')}}>&nbsp;</b>
                                    </span>
                                    <h3>Video Message</h3>
                                </div>
                            </li>
                            <li>
                                <div className="segmentsOptions_detail">
                                    <span className={this.props.messageBuilder.type === 'url' ? 'choseSegmnt': ''}>
                                        <b className="ChooseUrl" onClick={(e)=> { this.setMessageType('url')}}>&nbsp;</b>
                                    </span>
                                    <h3>Website URL</h3>
                                </div>
                            </li>
                            {(this.props.gameMissionTypeToCreate === 'mission-outcome' || this.props.gameMissionTypeToCreate === 'game' || this.props.gameMissionTypeToCreate === 'game-mission' || this.props.gameMissionTypeToCreate === 'game-outcome') && <li>
                                <div className="segmentsOptions_detail">
                                        <span className={this.props.messageBuilder.type === 'competition' ? 'choseSegmnt' : ""}>
                                            <b className="point_icon" onClick={(e)=> {this.setMessageType('competition')}}>&nbsp;</b>
                                        </span>
                                    <h3>Competition</h3>
                                </div>

                            </li>}

                            {(this.props.gameMissionTypeToCreate === 'mission-outcome' || this.props.gameMissionTypeToCreate === 'game-mission') && <li>
                                <div className="segmentsOptions_detail">
                                        <span className={this.props.messageBuilder.type === 'animation' ? 'choseSegmnt' : ""}>
                                            <b className="point_icon" onClick={(e)=> {this.setMessageType('animation')}}>&nbsp;</b>
                                        </span>
                                    <h3>Animation</h3>
                                </div>
                            </li>}

                            {(this.props.gameMissionTypeToCreate === 'game' || this.props.gameMissionTypeToCreate === 'game-outcome') && <li>
                                <div className="segmentsOptions_detail">
                                        <span className={this.props.messageBuilder.type === 'nooutcome' ? 'choseSegmnt' : ""}>
                                            <b className="point_icon" onClick={(e)=> {this.setMessageType('nooutcome')}}>&nbsp;</b>
                                        </span>
                                    <h3>No Outcome</h3>
                                </div>
                            </li>}
                        </ul>
                    </div>
                </div>
            </div>

                {this.props.messageBuilder.type === 'competition' ? <CompetitionBuilderComponent /> : (this.props.messageBuilder.type === 'animation'
                    ? <AnimationBuilderComponent />:<SmsBuilder />)}

            </div>
        );
    }//..... end of render() .....//
}//..... end of AlertSmsBuilder.

const mapStateToProps = (state) => {
    return {
        messageBuilder  : selectMessageBuilderObject(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        currentChannel  : state.campaignBuilder.currentChannel,
        gameMissionTypeToCreate: state.campaignBuilder.gameMissionTypeToCreate,
    };
};
export default connect(mapStateToProps)(AlertSmsBuilder);
