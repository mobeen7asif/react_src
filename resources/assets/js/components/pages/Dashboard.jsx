import React, {Component} from 'react';
import Venue from "./sub-pages/dashboard/Venue";
import Campaign from "./sub-pages/dashboard/Campaign";
import Point from "./sub-pages/dashboard/Point";
import Member from "./sub-pages/dashboard/Member"
import MainDashboard from "./sub-pages/dashboard/MainDashboard";
import EmptyPage from "./EmptyPage";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.changeDashboardTabs = this.changeDashboardTabs.bind(this);
        this.state = {
            // currentTab: 'dashboard/venus'
            currentTab: 'main-dashboard'
        };

        this.loadActiveComponent = this.loadActiveComponent.bind(this);
    }


    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {

        const sub_header = <div className="compaignstabsBttns clearfix">
                                <a  style={{cursor:'pointer'}} onClick={(e)=> { this.changeDashboardTabs('dashboard/venus')}}     className={this.state.currentTab == 'dashboard/venus' ? 'compaignsActive' : ''}>VENUES</a>
                                <a  style={{cursor:'pointer'}} onClick={(e)=> { this.changeDashboardTabs('dashboard/campaigns')}} className={this.state.currentTab == 'dashboard/campaigns' ? 'compaignsActive' : ''}>CAMPAIGNS</a>
                                <a  style={{cursor:'pointer'}} onClick={(e)=> { this.changeDashboardTabs('dashboard/points')}}    className={this.state.currentTab == 'dashboard/points' ? 'compaignsActive' : ''}>POINTS</a>
                                <a  style={{cursor:'pointer'}} onClick={(e)=> { this.changeDashboardTabs('dashboard/members')}}   className={this.state.currentTab == 'dashboard/members' ? 'compaignsActive' : ''}>MEMBERS</a>
                            </div>;
        if(!appPermission("Dashboard","view")){
            return (
                <EmptyPage/>
            )
        }else{
            return (

                <div>

                    {this.state.currentTab !== 'main-dashboard'?sub_header:''}

                    {this.state.currentTab !== 'main-dashboard'?<div className="contentDetail">

                            <div className="autoContent">

                                <div className="contentinner">
                                    {
                                        this.loadActiveComponent()
                                    }
                                </div>
                            </div>
                        </div>:
                        this.loadActiveComponent()
                    }


                </div>
            );
        }

    }

    changeDashboardTabs(tab) {
        this.setState({currentTab: tab});
    }//.... end of changeDashboardTabs() .....//

    loadActiveComponent() {
        switch (this.state.currentTab) {
            case 'dashboard/venus':
                return <Venue />;
            case 'main-dashboard':
                return <MainDashboard />;
            case 'dashboard/campaigns':
                return <Campaign />;
            case 'dashboard/points':
                return <Point />;
            case 'dashboard/members':
                return <Member />;
            default:
                return '';
        }
    }//..... end of loadActiveComponent() .....//
}

export default Dashboard;
