import React, {Component} from 'react';
import {connect} from "react-redux";
import {addCampaignValue} from "../../../../../../redux/actions/CampaignBuilderActions";

class GamificationCampaignDetails extends Component {

    currentTab  = this.props.currentTab;

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

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
                                        <label>Campaign Name</label>
                                        <div className="segmentInput">
                                            <input type="text" id={'dynamicCampaignName'} placeholder="Campaign Name" onChange={(e)=>{this.props.dispatch(addCampaignValue({name: e.target.value}))}} value={this.props.campaign.name}/>
                                        </div>
                                    </li>
                                    <li>
                                        <label>Campaign Description</label>
                                        <div className="segmentInput segmentARea">
                                            <textarea style={{fontFamily: "'Roboto', sans-serif"}} placeholder="Campaign Description" id={'dynamicCampaignDescription'} onChange={(e)=>{this.props.dispatch(addCampaignValue({detail: e.target.value}))}} value={this.props.campaign.detail}></textarea>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            {/*<div className={'trigger_amount clearfix'}>
                                <label>Stop this campaign if triggered X amount of time.</label>
                                <div className={'segmentInput'}>
                                    <input placeholder={'Leave blank for no limit'} type="number"  onChange={(e)=>{this.props.dispatch(addCampaignValue({trigger_amount: e.target.value}))}} value={this.props.campaign.trigger_amount}/>
                                </div>
                            </div>
                            <div className={'trigger_amount clearfix'}>
                            </div>*/}
                        </div>
                    </div>
                </div>

                <div className="continueCancel">
                    <input type="submit" id={'dynamicCampaignContinueBtn'} value="CONTINUE" onClick={(e) => { this.props.setCurrentTab(++this.currentTab) }} className={(this.props.campaign.name === '' || this.props.campaign.detail === '') ? 'disabled selecCompaignBttn' : 'selecCompaignBttn'}/>
                    <a href="#">CANCEL</a>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of DynamicCampaignDetail.

const mapStateToProps = (state) => {
    return {
        campaign: state.campaignBuilder.campaign,
        currentTab: state.campaignBuilder.selectedTab,
    };
};
export default connect(mapStateToProps)(GamificationCampaignDetails);