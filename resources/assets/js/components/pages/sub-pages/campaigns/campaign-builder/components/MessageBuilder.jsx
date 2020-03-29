import React, {Component} from 'react';
import {values} from 'lodash';
import AlertSmsBuilder from "./message_builder_components/AlertSmsBuilder";
import AlertEmailBuilder from "./message_builder_components/AlertEmailBuilder";
import RewardSmsBuilder from "./message_builder_components/RewardSmsBuilder";
import MessageBuilderValidator from "../../../../../utils/MessageBuilderValidator";
import GamePushBuilder from "./message_builder_components/GamePushBuilder";
import {connect} from "react-redux";
import {
    addMessageBuilderValue,
    setCurrentChannel,
    setGameMissionCreatingType, setRewardSmsBuilderType
} from "../../../../../redux/actions/CampaignBuilderActions";

class MessageBuilder extends Component {
    currentTab = this.props.currentTab;
    currentChannel = '';
    messageBuilderValidator = new MessageBuilderValidator;

    selectChannel = (channel) => {
        if (!channel)
            return;

        this.props.dispatch(setCurrentChannel(channel));

        if (this.props.triggerType === 'alert' && (channel === 'push' || channel === 'sms')) {
            if (['text', 'image', 'video', 'url', 'animation', 'competition','nooutcome'].indexOf(this.props.messageBuilder[channel].type) === -1)
                this.setMessageType('text', channel);
        }//..... end if() .....//

        if ((this.props.triggerType === 'reward' || this.props.triggerType === 'game') && (channel === 'sms' || channel === 'push')) {
            if (((this.props.gameMissionTypeToCreate === 'game-outcome' || this.props.gameMissionTypeToCreate === 'game')
                ? ['voucher','integrated-voucher','point', 'token', 'competition','nooutcome']
                : (this.props.gameMissionTypeToCreate === 'mission-outcome' || this.props.gameMissionTypeToCreate === 'game-mission'
                    ? ['voucher','integrated-voucher','point', 'token', 'competition', 'animation','stamp-card']
                    : ['voucher','integrated-voucher','point'])).indexOf(this.props.messageBuilder[channel].type) === -1) {

                    this.setBuilderType('voucher',channel);
            }
        }//..... end if() .....//
    };;//..... end of selectChannel() .....//

    componentDidMount = () => {
        let userData = localStorage.getItem('userData');
        if (userData) {
            userData = JSON.parse(userData);
            if (userData.venue_id){

                INTEGRATED  = userData.is_integrated

            }
        }
        this.selectChannel(this.currentChannel);
    };//..... end of componentDidMount() ......//

    setMessageType = (type, channel) => {
        this.props.dispatch(addMessageBuilderValue({[channel]: {...this.props.messageBuilder[channel], type,message: '', resource: ''}}));
    };//..... end of setMessageType() .....//

    setBuilderType = (type, channel) => {
        this.props.dispatch(addMessageBuilderValue({[channel]: {...this.props.messageBuilder[channel], type,message: '', resource: ''}}));
    };//..... end of setBuilderType() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//



    render() {
        let flag = 0;
        return (
            <div>
                <div className="compaign_segments">
                    <div className="segment_tYpe">
                        <div className="segment_tYpe_heading">
                            <h3>MESSAGE BUILDER</h3>
                        </div>
                        <div className="segment_tYpe_detail">
                            <div className="messageBuilders_links">
                                <ul>
                                    {
                                        (values(this.props.targetChannels)).map((channel, index) => {
                                            if (channel.isEnabled === true) {
                                                if (flag === 0) {
                                                    this.currentChannel = channel.channel;
                                                }//..... end if() ....//

                                                return <li key={index}>
                                                    <a  style={{cursor:'pointer'}} onClick={(e) => {
                                                        this.selectChannel(channel.channel);
                                                    }} className={(this.props.currentChannel === channel.channel ? 'selectLink' : '')}><b>{++flag}</b>{channel.channel.toUpperCase()} MESSAGE</a>
                                                </li>
                                            }//..... end if() .....//
                                        })//..... end of map() .....//
                                    }
                                </ul>
                            </div>
                            {
                                this.getMessageBuilderComponent()
                            }
                        </div>
                    </div>
                </div>

                <div className="continueCancel">
                    <input type="submit" value={(this.props.gameMissionTypeToCreate === 'mission-outcome' || this.props.gameMissionTypeToCreate === 'game' || this.props.gameMissionTypeToCreate === 'game-outcome') && !this.props.campaignDeleted ? 'Save' : "CONTINUE"} className={ this.messageBuilderValidator.validate(this.props.targetChannels, this.props.messageBuilder, this.props.triggerType, this.props.selectedCampaign, this.props.gameMissionTypeToCreate) ? 'selecCompaignBttn' : 'disabled selecCompaignBttn'}
                           onClick={(e) => { this.props.gameMissionTypeToCreate === 'mission-outcome' ? this.props.setMissionOutcome() : (this.props.gameMissionTypeToCreate === 'game'  || this.props.gameMissionTypeToCreate === 'game-outcome' ? this.props.setGameToPool() : this.props.setCurrentTab(++this.currentTab)) }}/>
                    <a href="#" onClick={(e) => {
                        if (this.props.selectedCampaign === 'Gamification') {
                            e.preventDefault();
                            this.props.dispatch(setGameMissionCreatingType(''));
                        }
                    }
                    }>CANCEL</a>
                </div>
            </div>
        );
    }//..... end of render() .....//

    getMessageBuilderComponent() {
        if (this.props.triggerType === 'alert' && (this.props.currentChannel === 'sms' || this.props.currentChannel === 'push'))
            return <AlertSmsBuilder />;
        else if ((this.props.triggerType === 'alert' || this.props.triggerType === 'reward' || this.props.triggerType === 'game') && this.props.currentChannel === 'email')
            return <AlertEmailBuilder />;
        /* else if (this.props.triggerType === 'alert' && this.props.currentChannel === 'push')
             return <AlertPushBuilder currentChannel={this.props.currentChannel} {...this.props}/>;*/
        /*else if (this.props.triggerType === 'reward' && this.props.currentChannel === 'push')
            return <RewardPushBuilder currentChannel={this.props.currentChannel} {...this.props}/>;*/
        else if (this.props.triggerType === 'reward' && (this.props.currentChannel === 'sms' || this.props.currentChannel === 'push'))
            return <RewardSmsBuilder />;
        else if (this.props.triggerType === 'game' &&  (this.props.currentChannel === 'push' || this.props.currentChannel === 'sms'))
            return <GamePushBuilder />;
        //else if (this.props.triggerType === 'game' &&  this.props.currentChannel === 'sms')
        //  return <GameSmsBuilder currentChannel={this.props.currentChannel} {...this.props} setBuilderType={this.setBuilderType} saveToMessageBuilder={this.saveToMessageBuilder}/>;
        else
            return "Unknown Message Builder Type.";
    }//..... end of getMessageBuilderComponent() .....//
}//..... end of MessageBuilder.

const mapStateToProps = (state) => {
    return {
        triggerType     : state.campaignBuilder.trigger_type,
        targetChannels  : state.campaignBuilder.targetChannels,
        messageBuilder  : state.campaignBuilder.messageBuilder,
        currentTab      : state.campaignBuilder.selectedTab,
        currentChannel  : state.campaignBuilder.currentChannel,
        gameMissionTypeToCreate: state.campaignBuilder.gameMissionTypeToCreate,
        selectedCampaign: state.campaignBuilder.campaign.selectedCampaign,
        campaignDeleted  : state.campaignBuilder.campaignDeleted
    };
};
export default connect(mapStateToProps)(MessageBuilder);