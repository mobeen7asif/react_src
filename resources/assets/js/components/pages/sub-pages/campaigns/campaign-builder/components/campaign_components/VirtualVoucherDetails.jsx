import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {connect} from "react-redux";
import {
    addCampaignValue,
    addMessageBuilderValue, setCurrentChannel,
    setTargetChannelValue, setTriggerType
} from "../../../../../../redux/actions/CampaignBuilderActions";
import {forOwn, trimEnd} from "lodash";
class VirtualVoucherDetails extends Component {
    currentTab = this.props.currentTab;
    triggers   = {'birthday': 'Birthday',
                    "last_visit_date": 'Last Visit Date',
                    "new_member": 'New Member',
                    "inactivity": 'Inactivity',
                    /*"mycash_expiry": 'MyCash Expiry', "membership_renewal": 'Membership Renewal',"rating_grade_change": 'Rating Grade Change',
                    "imminent": 'Imminent Rating Grade Change', "gaming_turnover": 'Gaming Turnover',"pos_turnover": 'Pos Turnover',"referral_by":"Referral BY"*/
                     };

    dropDownLabelRef     = null;
    dropDownUlRef        = null;
    triggerDetailsTabRef = null;

    componentDidMount = () => {
        this.props.dispatch(setTriggerType("reward"));
        this.props.dispatch(setCurrentChannel("push"));
        this.selectChannel("push");

        if(!this.props.campaignBuilder.isEditMode){
            this.setBuilderType('voucher',"push");
            this.setMessageType("voucher","push");
          /*  if(parseInt(INTEGRATED) ==0){
                this.setBuilderType('voucher',"push");
                this.setMessageType("voucher","push");
            }
            else{
                this.setBuilderType('integrated-voucher',"push");
                this.setMessageType("integrated-voucher","push");
            }*/

        }
    }



    handleDropDownSpanClick = (e) => {
        e.target.classList.toggle('changeAero');

        this.dropDownUlRef.style.display = (this.dropDownUlRef.style.display === 'none') ? 'block' : 'none';

        e.target.classList.contains('changeAero')
            ? this.triggerDetailsTabRef.classList.add('disabled')
            : this.triggerDetailsTabRef.classList.remove('disabled');
    };//..... end of handleDropDownSpanClick() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    setBuilderType = (type, channel) => {
        this.props.dispatch(addMessageBuilderValue({[channel]: {...this.props.messageBuilder[channel], type,message: '', resource: ''}}));
    };//..... end of setBuilderType() .....//


    selectChannel = (channelType) => {
        let index = '';
        let channel = {channel: "push", currentTarget: "push",icon: "ap_white@2x.png",isEnabled: true,members: 0,percentage: 0};

            //this.props.setTargetChannelValue(index, channel);
            this.props.dispatch(setTargetChannelValue({primary: channel}));

    };

    setMessageType = (type, channel) => {

        this.props.dispatch(addMessageBuilderValue({[channel]: {...this.props.messageBuilder[channel], type,message: '', resource: ''}}));
    };//..... end of setMessageType() .....//



    render() {
        return (
            <div>
                <div className="compaign_segments">
                    <div className="segment_tYpe">
                        <div className="segment_tYpe_heading">
                            <h3>CAMPAIGN DETAILS</h3>
                        </div>
                        <div className="segment_tYpe_detail">
                            <div className="selectDescription">
                                <p>Name and describe your new campaign in a way that will make sense to other staff at your site. Your members will not see these details. Your description should describe exactly what you want to achieve from your campaign. You must complete both fields to continue.</p>
                            </div>

                            <div className="newSegment_form">
                                <ul>
                                    <li>
                                        <label>Campaign Name:</label>
                                        <div className="segmentInput">
                                            <input type="text" placeholder="Campaign Name" onChange={(e)=>{this.props.dispatch(addCampaignValue({name: e.target.value}))}} value={this.props.campaign.name}/>
                                        </div>
                                    </li>
                                    <li>
                                        <label>Campaign Description:</label>
                                        <div className="segmentInput segmentARea">
                                            <textarea style={{fontFamily: "'Roboto', sans-serif"}} placeholder="Campaign Description" onChange={(e)=>{this.props.dispatch(addCampaignValue({detail: e.target.value}))}} value={this.props.campaign.detail}></textarea>
                                        </div>
                                    </li>
                                </ul>
                            </div>


                            {/*<div className={'trigger_amount clearfix'}>
                                <label>Stop this campaign if triggered X amount of time.</label>
                                <div className={'segmentInput'}>
                                    <input placeholder={'Leave blank for no limit'} type="number"  onChange={(e)=>{this.props.dispatch(addCampaignValue({trigger_amount: e.target.value}))}} value={this.props.campaign.trigger_amount}/>
                                </div>
                            </div>*/}
                            <div className={'trigger_amount clearfix'}>
                            </div>


                            <br/>
                            <br/>



                        </div>

                    </div>







                </div>

                <div className="continueCancel">
                    <input type="submit" value="CONTINUE" onClick={(e) => { this.props.setCurrentTab((++this.currentTab)+3) }} className={(this.props.campaign.trigger_type !== 'referral_by')?(this.props.campaign.name === '' || this.props.campaign.detail === '') ? 'disabled selecCompaignBttn' : 'selecCompaignBttn':(this.props.campaign.name === '' || this.props.campaign.detail === '') ? 'disabled selecCompaignBttn' : 'selecCompaignBttn'}/>
                    <a href="#">CANCEL</a>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of VirtualVoucherDetails.

const mapStateToProps = (state) => {
    return {
        campaignBuilder: state.campaignBuilder,
        campaign: state.campaignBuilder.campaign,
        currentTab: state.campaignBuilder.selectedTab,
        messageBuilder  : state.campaignBuilder.messageBuilder,
        targetChannels  : state.campaignBuilder.targetChannels,
        triggerType     : state.campaignBuilder.trigger_type,
        currentChannel  : state.campaignBuilder.currentChannel,
    };
};
export default connect(mapStateToProps)(VirtualVoucherDetails);