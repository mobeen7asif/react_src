import React, {Component,} from 'react';
import TargetChannels from "./TargetChannels";
import {forOwn, trimEnd} from "lodash";
import {NotificationManager} from "react-notifications";

import {connect} from "react-redux";
import {
    setSegmentUsers,
    setTargetChannelValue,
    setTriggerType
} from "../../../../../../redux/actions/CampaignBuilderActions";

class ChannelType extends Component {
    state = {
        totalPercentage :  0,
        totalMembers    :  0,
        chartData       : [],
    };

    currentTab     = this.props.currentTab;
    segmentName    = '';

    componentDidMount = () => {
        forOwn(this.props.segment.segments, (value, key) => {
            this.segmentName += value.name + ', ';
        });

        this.segmentName = trimEnd(this.segmentName, ', ');
        if(this.props.campaign.selectedCampaign != 'Set & Forget')
            this.getSegmentDetails();
    };//..... end of componentDidMount() .....//

    /**
     * ComponentWillMount Hook cycle.
     * load segments details.
     **/
    getSegmentDetails = () => {
        if (Object.keys(this.props.segment.segment_users).length === 0) {
            let segmentIDs = [];
            if (this.props.segment.type === 'saved' || this.props.segment.type === 'template') {
                segmentIDs = this.props.segment.segments.map((segment) => {
                    return segment.id;
                });
            } else {
                segmentIDs = this.props.segment.segments.id;
            }//.... end if() .....//

            show_loader();
            axios.post(BaseUrl + '/api/saved-segments-details',
                { segment_ids: segmentIDs, company_id: CompanyID, venue_id: VenueID})
                .then((response) => {
                    show_loader(true);
                    this.props.dispatch(setSegmentUsers(response.data));
                    this.populateEditModeData();
                }).catch((err) => {
                    show_loader(true);
                    NotificationManager.error('Could not get Segment(s) details.', 'Error');
            });
        } //..... end if() .....//

        this.populateChartData();
    };//..... end of componentWillMount() .....//

    populateEditModeData = () => {
        if (this.props.isEditMode) {
            forOwn(this.props.targetChannels, (channel, key) => {
                if (channel.isEnabled === true) {
                    let percentage = (parseFloat((this.props.segment.segment_users[channel.channel +'_users'] * 100)/this.props.segment.segment_users.total_users)).toFixed(2);
                    percentage = isNaN(percentage) ? 0 : percentage;
                    channel.members = this.props.segment.segment_users[channel.channel+'_users'];
                    channel.percentage = percentage;
                }//..... end if() .....//
            });//.... end of forOwn() .....//
            this.populateChartData();
        }//..... end if() ......//
    };//...... end of populateEditModeData() .....//

    selectChannel = (e, channelType) => {


        let index = '';
        let channel = '';
        forOwn(this.props.targetChannels, (value, key) => {
            if (value.isEnabled === false) {
                index = key;
                channel = value;
                return false;
            }//..... end if() .....//
        });//.... end of forOwn() .....//

        if (index && channel) {
            let percentage = (parseFloat((this.props.segment.segment_users[channelType+'_users'] * 100)/this.props.segment.segment_users.total_users)).toFixed(2);
            percentage = isNaN(percentage) ? 0 : percentage;
            let totalPercentage = parseFloat(this.state.totalPercentage) + parseFloat(percentage);

            if (totalPercentage > 100)
                return false;

            this.setState({totalPercentage: totalPercentage});
            channel.isEnabled = true;
            channel.icon = this.props.icons[channelType];
            channel.channel = channelType;
            channel.members = (this.props.segment.segment_users[channelType+'_users'])?this.props.segment.segment_users[channelType+'_users']:0;
            this.totalMembers += parseInt(channel.members);
            channel.percentage = percentage;

            if (e)
                $(e.target).parents('div.chanel_icon').addClass('disabled');
            channel.currentTarget = channelType;
            //this.props.setTargetChannelValue(index, channel);
            this.props.dispatch(setTargetChannelValue({[index]: channel}));

            this.populateChartData();
        }//.... end if() .....//
    };//..... end of selectChannel() .....//

    removeSelectedChannel = (e, channel) => {
        let intendedChannel = this.props.targetChannels[channel];
        intendedChannel.isEnabled = false;
        intendedChannel.icon = "";
        intendedChannel.channel = "";

        this.setState({
            totalPercentage: parseFloat(this.state.totalPercentage) - parseFloat(intendedChannel.percentage),
            totalMembers :  this.state.totalMembers - parseInt(intendedChannel.members)
        });
        intendedChannel.percentage = 0;
        intendedChannel.members = 0;
        document.querySelector(`.${intendedChannel.currentTarget}`).classList.remove('disabled');
        intendedChannel.currentTarget = "";
        //this.props.setTargetChannelValue(channel, intendedChannel);
        this.props.dispatch(setTargetChannelValue({[channel]: intendedChannel}));
        this.populateChartData();
    };//..... end of removeSelectedChannel() .....//

    populateChartData = () => {
        let chartData = [];
        let totalPercentage = 0;
        let totalMembers = 0;

        forOwn(this.props.targetChannels, (value, key) => {
            if (value.isEnabled === true) {
                chartData.push({name:value.channel, y: parseFloat(value.percentage), total: value.members });
                totalPercentage = parseFloat(totalPercentage) + parseFloat(value.percentage);
                totalMembers = totalMembers + parseInt(value.members);
            }//..... end if() .....//
        });//.... end of forOwn() .....//

        if (chartData.length === 0)
            chartData.push({name: 'Data Not Found', y:100});
        else {
            this.setState(() => ({
                chartData,
                totalPercentage: totalPercentage,
                totalMembers: totalMembers
            }));
        }//..... end if-else() .....//
    };//..... end of populateChartData() .....//

    resetDataAndSelectChannelType = (channel) => {
        this.setState(() => ({
            totalMembers: 0,
            totalPercentage: 0,
            chartData: [{name: 'Data Not Found', y:100}]
        }));
        this.props.dispatch(setTriggerType(channel));
    };//..... end of resetData() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div>
                <div className="compaign_segments">
                    <div className="segment_tYpe">
                        <div className="segment_tYpe_heading">
                            <h3>CHANNEL AND TYPE</h3>
                        </div>
                        <div className="segment_tYpe_detail">
                            <div className="chanelType_outer chanelType_outer_setting">
                                {appPermission("ChannelTypeAlert","view") && (
                                    <div className="chanelType_column">
                                        <span>

                                            <img id={'alertChannel'} src={(this.props.triggerType === 'alert') ? 'assets/images/image2-active@2x.png' : 'assets/images/image2@2x.png'} onClick={(e)=>{
                                                this.resetDataAndSelectChannelType('alert');
                                            }}/>
                                            <b>CONTENT</b>

                                        </span>
                                        <p>Send information to your members via SMS, Email or mobile app<br/>. SMS and Push notifications are great for short<br/> messages, use email for longer newsletters.</p>
                                    </div>
                                )}
                                {appPermission("ChannelTypeReward","view") && (
                                    <div className="chanelType_column">
                                        <span>
                                            <img id={'rewardChannel'} src={(this.props.triggerType === 'reward') ? 'assets/images/image@2x.png' : 'assets/images/image-active@2x.png'} onClick={(e)=>{
                                                this.resetDataAndSelectChannelType('reward');
                                            }}/>
                                            <b>VALUE</b>
                                        </span>
                                        <p>Create behavioral change in your members by offering a<br/> reward for action. Rewards can be redeemed through the<br/> mobile app, and you can notify your members via SMS and email.</p>
                                    </div>
                                )}

                                {/*{appPermission("ChannelTypeGame","view") && (
                                    <div className="chanelType_column">
                                        <span>
                                            <img id={'gameChannel'} src={(this.props.triggerType === 'game') ? 'assets/images/gameimageActive@2x.png' : 'assets/images/gameimage2@2x.png'} onClick={(e)=>{this.resetDataAndSelectChannelType('game')}}/>
                                            <b>GAME</b>
                                        </span>
                                        <p>Create behavioral change in your members by offering a<br/> reward for action. Rewards can be redeemed via or at the<br/> Kiosk, and you can notify your members via SMS and email.</p>
                                    </div>
                                )}*/}


                            </div>
                        </div>
                    </div>

                    {
                        (this.props.triggerType &&
                            <TargetChannels targetChannels={this.props.targetChannels} segment={this.props.segment} selectChannel={this.selectChannel}
                                            removeSelectedChannel={this.removeSelectedChannel} totalPercentage={this.state.totalPercentage} totalMembers={this.state.totalMembers}
                                            segmentName={this.segmentName} chartData={this.state.chartData}/>)
                    }

                </div>
                <div className="continueCancel">
                    <input type="submit" className={(this.state.chartData.length === 1 && this.state.chartData[0].name && this.state.chartData[0].name === 'Data Not Found' ) ? 'disabled selecCompaignBttn':'selecCompaignBttn'}
                           onClick={(e) => {
                               this.props.setCurrentTab(++this.currentTab)
                           }} value="CONTINUE"/>
                    <a href="#">CANCEL</a>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of ChannelType.

const mapStateToProps = (state) => {
    return {
        targetChannels  : state.campaignBuilder.targetChannels,
        segment         : state.campaignBuilder.segment,
        triggerType     : state.campaignBuilder.trigger_type,
        currentTab      : state.campaignBuilder.selectedTab,
        campaign:           state.campaignBuilder.campaign,
    };
};
export default connect(mapStateToProps)(ChannelType);