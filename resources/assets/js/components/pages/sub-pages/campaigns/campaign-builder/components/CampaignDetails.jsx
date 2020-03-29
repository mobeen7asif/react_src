import React, {Component} from 'react';
import {connect} from 'react-redux';
import CampaignType from "./campaign_components/CampaignType";
import DynamicCampaignDetail from "./campaign_components/DynamicCampaignDetail";
import SetAndForgetCampaignDetail from "./campaign_components/SetAndForgetCampaignDetail";
import ProximityCampaignDetail from "./campaign_components/ProximityCampaignDetail";
import GamificationCampaignDetails from "./campaign_components/GamificationCampaignDetails";
import VirtualVoucherDetails from "./campaign_components/VirtualVoucherDetails";

class CampaignDetails extends Component {
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//
    state = {
        campaignType:[]
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    componentDidMount = () => {
        let campaignType = [];
        if(appPermission("CampaignTypeSetForget","view"))
            campaignType.push({title: 'Set & Forget', id: 'set_and_forget_campagin', iconClass: '',  campaignDescription:'Send a campaign to a member automatically based on an event or action. Ideal for happy birthday and new status level messages, and to reward members for reaching a nominated turnover target.'})
        if(appPermission("CampaignTypeProximity","view"))
            campaignType.push({title: 'Proximity', id: 'proximity_campaign', iconClass: 'proximityIcon', campaignDescription:'Send a campaign to a member through their app based on their proximity to a nominated Beacon, or through GPS location tracking or by being detected on a public WiFi network. Ideal for welcome messages and exclusive app user rewards.'})
        if(appPermission("CampaignTypeDynamic","view"))
            campaignType.push({title: 'Dynamic', id: 'dynamic_campaign', iconClass: 'dynamicIcon', campaignDescription:'Send a campaign to a defined group of members at a specific time, either now or at a scheduled time in the future. Ideal to incentivise visitation or reward a new behaviour.'})
        if(appPermission("CampaignTypeGamification","view"))
            campaignType.push({title: 'Gamification', id: 'gamification_campaign', iconClass: 'dynamicIcon', campaignDescription:'Send a campaign to members that rewards them for completing a specific action, for example, scanning a QR code, entering a site, or signing up to the app. Ideal for increasing ongoing customer engagement.'})
        if(appPermission("CampaignTypeVirtualVoucher","view"))
            campaignType.push({title: 'Virtual Voucher', id: 'virtual_voucher', iconClass: 'dynamicIcon', campaignDescription:'Send a virtual voucher that rewards them for completing a specific action, for example, scanning a QR code, entering a site, or signing up to the app. Ideal for increasing ongoing customer engagement.'})

        this.setState(()=>({campaignType: campaignType}))

    };

    render() {
        return (
            <div>
                <div className="compaignsType">
                    <ul style={{textAlign:"center"}}>

                        { /*[
                            {title: 'Set & Forget', id: 'set_and_forget_campagin', iconClass: '',  campaignDescription:'Send a campaign to a member automatically based on an event or action. Ideal for happy birthday and new status level messages, and to reward members for reaching a nominated turnover target.'},
                            {title: 'Proximity', id: 'proximity_campaign', iconClass: 'proximityIcon', campaignDescription:'Send a campaign to a member through their app based on their proximity to a nominated Beacon, or through GPS location tracking or by being detected on a public WiFi network. Ideal for welcome messages and exclusive app user rewards.'},
                            {title: 'Dynamic', id: 'dynamic_campaign', iconClass: 'dynamicIcon', campaignDescription:'Send a campaign to a defined group of members at a specific time, either now or at a scheduled time in the future. Ideal to incentivise visitation or reward a new behaviour.'},
                            {title: 'Gamification', id: 'gamification_campaign', iconClass: 'dynamicIcon', campaignDescription:'Send a campaign to members that rewards them for completing a specific action, for example, scanning a QR code, entering a site, or signing up to the app. Ideal for increasing ongoing customer engagement.'},
                            {title: 'Virtual Voucher', id: 'virtual_voucher', iconClass: 'dynamicIcon', campaignDescription:'Send a virtual voucher that rewards them for completing a specific action, for example, scanning a QR code, entering a site, or signing up to the app. Ideal for increasing ongoing customer engagement.'}
                            ]*/
                            this.state.campaignType.map((campaign_type) =>  <CampaignType key={campaign_type.id} cType={campaign_type} />  ) }

                    </ul>
                </div>
                <div className="compaign_segment">
                    { (this.props.campaign.selectedCampaign === 'Virtual Voucher') ? <VirtualVoucherDetails setCurrentTab={this.props.setCurrentTab}/> : (this.props.campaign.selectedCampaign === 'Set & Forget') ?
                    <SetAndForgetCampaignDetail setCurrentTab={this.props.setCurrentTab} /> :
                    ((this.props.campaign.selectedCampaign === 'Proximity') ?
                    <ProximityCampaignDetail setCurrentTab={this.props.setCurrentTab} /> :
                    ((this.props.campaign.selectedCampaign === 'Dynamic') ?
                    <DynamicCampaignDetail setCurrentTab={this.props.setCurrentTab} /> :
                        ((this.props.campaign.selectedCampaign === 'Gamification') ?
                            <GamificationCampaignDetails setCurrentTab={this.props.setCurrentTab} /> :
                            ''))
                    )}
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of CampaignDetails.

const mapStateToProps = (state) => {
    return {
        campaign: state.campaignBuilder.campaign,
        selectedTab: state.campaignBuilder.selectedTab,
    };
};
export default connect(mapStateToProps)(CampaignDetails);