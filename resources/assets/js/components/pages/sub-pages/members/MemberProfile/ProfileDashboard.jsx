import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import ProfileSideBar from "./ProfileSideBar";
import BasicInformation from "./components/BasicInformation";
import Transactions from "./components/transactions/Transactions";
import PointLevels from "./components/points_levels/PointLevels";
import Vouchers from "./components/vouchers/Vouchers";
import Gamification from "./components/gamification/Gamification";
import Campaigns from "./components/campaigns/Campaigns";
import StampCards from "./components/stamp_cards/StampCards";
import Segmentation from "./components/segmentation/Segmentation";
import MemberCustomFields from "./components/MemberCustomFields";
import Communications from "./components/Communications";
import MemberStores from "./components/MemberStores";
import PasswordComponent from "./components/PasswordComponent";




class ProfileDashboard extends Component {

    state = {
        activeTab : 'basic_information',
        memberDetail : {},
        mobile_number : [],
        gender : ''
    };

    constructor(props) {
        super(props);
        this.state = {activeTab: 'memberList'};
        //this.setActiveTab = this.setActiveTab.bind(this);
    }//..... end of constructor() .....//

    componentDidMount = () => {
    };//..... end of componentDidMount() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    getActiveState = (val) => {
        this.setState({activeTab : val});
    };

    loadActiveComponent = () => {
        switch (this.state.activeTab){
            case "basic_information" :
                return <BasicInformation persona_id={this.props.match.params.id}/>;
            case "custom_fields" :
                return <MemberCustomFields persona_id={this.props.match.params.id}/>;
            case "member_communications" :
                return <Communications persona_id={this.props.match.params.id}/>;
            case "member_stores" :
                return <MemberStores persona_id={this.props.match.params.id}/>;
            case "segmentation"  :
                return <Segmentation persona_id={this.props.match.params.id}/>;
            case "transactions":
                return <Transactions persona_id={this.props.match.params.id}/>;
            case "points_levels" :
                return <PointLevels persona_id={this.props.match.params.id}/>;
            case "vouchers" :
                return <Vouchers ref={el => (this.componentRef = el)} persona_id={this.props.match.params.id}/>;
            case 'gamification':
                return <Gamification persona_id={this.props.match.params.id}/>;
            case 'campaigns':
                return <Campaigns persona_id={this.props.match.params.id}/>;
            case 'stamp_cards':
                return <StampCards persona_id={this.props.match.params.id}/>;
            case 'password':
                return <PasswordComponent persona_id={this.props.match.params.id}/>;
                default :
                return "";
        }


    };

    render() {
        return (
            <div className="containerSection">
                <div className="dayMatrics">
                    <div className="dayMatrics_inner"> </div>
                </div>
                <div className="tabs_bttn">
                    <ul>
                        <li><a   style={{cursor:'pointer'}} className="selectTb">MEMBERS LIST</a></li>
                    </ul>
                </div>
                <div className="newVualt_container">
                    <div className="newVualt_container_detail">
                        <div className="e_member_main clearfix">
                           <ProfileSideBar persona_id={this.props.match.params.id} sendActiveState={this.getActiveState}/>

                            {this.loadActiveComponent()}

                        </div>
                    </div>
                </div>
            </div>

        );
    }//..... end of render() .....//
}//..... end of Member.

ProfileDashboard.propTypes = {};

export default ProfileDashboard;