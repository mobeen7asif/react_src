import React, {Component} from 'react';

import Voucher from "./sub-pages/voucher/Voucher";
import GroupVoucher from "./sub-pages/voucher/GroupVoucher";
import PunchCard from "./sub-pages/venue/PunchCard";
import {resetVoucherData} from "../redux/actions/VoucherAction";
import Gamification from "./Gamification";
import Competition from "./Competition";
import Survey from "./Survey";
import EmailBuilder from "./sub-pages/campaigns/email-builder/EmailBuilder";
import ListTemplates from "./sub-pages/campaigns/email-builder/ListTemplates";
import CreateEmailTemplate from "./sub-pages/campaigns/email-builder/CreateEmailTemplate";
import CreateEmailTemplate1 from "./sub-pages/campaigns/email-builder/CreateEmailTemplate1";
import EmailComponent from "./sub-pages/campaigns/email-builder/EmailComponent";

class VoucherManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {currentTab: 'email_builder',currentView:'listing',template_id:0,i:0};
        this.setActiveTab = this.setActiveTab.bind(this);
    }//..... end of constructor() ....//
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    componentDidMount = () => {
            this.setState(()=>({currentTab:"email_builder"}));

    }

    changeVenueTab = (tab) => {

        this.setState({currentTab : tab,currentView:'listing'});

    };



    render() {
        return (
            <div>
                <div className="compaignstabsBttns clearfix">
                    {(appPermission("Email Builder","view")) && (
                        <a  style={{cursor:'pointer'}} onClick={(e)=>{ this.changeVenueTab('email_builder') }}className={this.state.currentTab == 'email_builder' ? 'compaignsActive' : ''}>Email Templates</a>
                    )}
            {/*        {(appPermission("Email Builder","add")) && (
                        <a  style={{cursor:'pointer'}} onClick={()=>{this.changeVenueTab("create_template")}} className={this.state.defaultPage === 'create_template' ? "compaignsActive" : ""} >Create Templates</a>
                    )}
                    {(appPermission("EmailBuilderDragDrop","view")) && (
                        <a  style={{cursor:'pointer'}} onClick={()=>{this.changeVenueTab("create_template2")}} className={this.state.defaultPage === 'create_template2' ? "compaignsActive" : ""} >Create Template (Drag & Drop)</a>
                    )}
*/}
                    {(appPermission("Asset-Vouchers","view")) && (
                    <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.changeVenueTab('voucher') }} className={this.state.currentTab == 'voucher' ? 'compaignsActive' : ''}>Vouchers</a>
                    )}
                    {(appPermission("Punch Card","view")) && (
                        <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.changeVenueTab('manage/punch-card') }} className={this.state.currentTab == 'manage/punch-card' ? 'compaignsActive' : ''}>Stamp Cards</a>
                    )}

                  {/*  {(appPermission("Pet Pack","view") && appPermission("Campaigns","view")) && (
                        <a  style={{cursor:'pointer'}} onClick={(e)=> {this.navigateToCampaignBuilder(e, (this.props.match.params.id) ? `/campaigns/pet-pack` : '/campaigns/pet-pack')}} className={(this.props.match.path === '/campaigns/pet-pack') ? 'compaignsActive': ''}>Pet Pack Configuration</a>
                    )}
                    {(appPermission("Competition","view") && appPermission("Campaigns","view")) && (
                        <a  style={{cursor:'pointer'}} onClick={(e)=> {this.navigateToCampaignBuilder(e, (this.props.match.params.id) ? `/campaigns/competition` : '/campaigns/competition')}} className={(this.props.match.path === '/campaigns/competition') ? 'compaignsActive': ''}>Competition</a>
                    )}*/}
                    {(appPermission("Surveys","view") && appPermission("Campaigns","view")) && (
                        <a  style={{cursor:'pointer'}} onClick={(e)=>{ this.changeVenueTab('survey') }} className={this.state.currentTab == 'survey' ? 'compaignsActive' : ''}>Surveys</a>
                    )}

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

    navigateToCampaignBuilder = (e, slug) => {
        if (e)
            e.preventDefault();
        this.setState({current_page: slug});
        this.props.history.push(slug);
    };//..... end of navigateToCampaignBuilder() .....//

    loadActiveComponent = () => {
        switch (this.state.currentTab){
            case "voucher" :
                return <Voucher  currentTab='listing' navigate={this.navigateToCampaignBuilder} currentView={this.state.currentView} setActiveTab={this.setActiveTab}/>;
            case 'manage/punch-card':
                return <PunchCard />;
            case 'email_builder':
                return <EmailComponent />;
            case '/campaigns/pet-pack':
                return <Gamification />;
            case '/campaigns/competition':
                return <Competition />;
            case 'survey':
                return <Survey />;
            default :
                return "";
        }
    };
}//..... end of members() .....//

export default VoucherManagement;
