import React, {Component} from 'react';
import MemberInsightReport from "./member_insight_components/MemberInsightReport";
import MarketingSpendTurnOverReport from "./member_insight_components/MarketingSpendTurnOverReport";
import CampaignSaturationReport from "./member_insight_components/CampaignSaturationReport";

class MemberInsight extends Component {
    state = {
        currentComponent: 'member_insight'
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    handleTabClick = (currentComponent) => {
        this.setState(() => ({currentComponent}));
    };//..... end of handleTabClick() .....//

    render() {
        return (
            <div className="cL_listing_tableOut memberInsight">
                <div className="messageBuilders_links">
                    <ul>
                        <li><a  style={{cursor:'pointer'}} onClick={ () => this.handleTabClick('member_insight') } className={this.state.currentComponent === 'member_insight' ? "selectLink" : ''}>MEMBER INSIGHT</a></li>
                        <li><a  style={{cursor:'pointer'}} onClick={ () => this.handleTabClick('marketing_spend_turn_over') } className={this.state.currentComponent === 'marketing_spend_turn_over' ? "selectLink" : ''}>MARKETING SPEND VS TURNOVER</a></li>
                        <li><a  style={{cursor:'pointer'}} onClick={ () => this.handleTabClick('campaign_saturation') } className={this.state.currentComponent === 'campaign_saturation' ? "selectLink" : ''}>CAMPAIGN SATURATION</a></li>
                    </ul>
                </div>
                {this.getComponent()}
            </div>
        );
    }//..... end of render() .....//

    getComponent = () => {
        switch (this.state.currentComponent) {
            case 'member_insight':
                return <MemberInsightReport />;
            case 'marketing_spend_turn_over':
                return <MarketingSpendTurnOverReport />;
            case 'campaign_saturation':
                return <CampaignSaturationReport />;
            default:
                return "";
        }//..... end switch() .....//
    };//..... end of getComponent() .....//
}//..... end of MemberInsight.

export default MemberInsight;