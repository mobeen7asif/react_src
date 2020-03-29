import React, {Component} from 'react';
import VoucherReport from "./sub-pages/Reports/VoucherReport";
import StampcardReport from "./sub-pages/Reports/StampcardReport";

import RedeemptionReport from "./sub-pages/Reports/RedeemptionReport";
import CampaignReporting from "./sub-pages/Reports/CampaignReporting";
import SmsReporting from "./sub-pages/Reports/SmsReporting";
import UnsubscriptionReport from "./sub-pages/Reports/UnsubscriptionReport";

class Reports extends Component {
    constructor(props) {
        super(props);
        this.state = {currentTab:'redeemption',showTab:true};

        this.setActiveTab = this.setActiveTab.bind(this);
    }//..... end of constructor() ....//
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    componentDidMount = () => {

        if((this.props.location.pathname.indexOf("/voucher") >= 0)){
            this.setState((prevState)=>({showTab:!prevState.showTab}));
        }
    }

    render() {
        return (
            <div>
                <div className="compaignstabsBttns clearfix">
                    {
                        (this.state.showTab) && (
                            <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.setActiveTab('redeemption') }} className={this.state.currentTab == 'redeemption' ? 'compaignsActive' : ''}>Redeemption Report</a>
                        )
                    }
                    <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.setActiveTab('email-report') }} className={this.state.currentTab == 'email-report' ? 'compaignsActive' : ''}>Email Report</a>
                    <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.setActiveTab('sms-report') }} className={this.state.currentTab == 'sms-report' ? 'compaignsActive' : ''}>Sms Report</a>
                    <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.setActiveTab('unsubscribe') }} className={this.state.currentTab == 'unsubscribe' ? 'compaignsActive' : ''}>Unsubscribe Report</a>

                </div>

                <div className="contentDetail">
                    <div className="autoContent">
                        <div className="contentinner">

                            {
                                this.loadActiveComponent()
                            }

                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//

    setActiveTab(tab) {
        this.setState({currentTab: tab});
    }//..... end of setActiveTab() .....//

    loadActiveComponent = () => {
        switch (this.state.currentTab){
            case "redeemption":
                return <RedeemptionReport />;
            case "email-report" :
                return <CampaignReporting />;
            case "sms-report" :
                return <SmsReporting />;
                case "unsubscribe" :
                return <UnsubscriptionReport />;
            default :
                return "";
        }
    };
}//..... end of members() .....//

export default Reports;
