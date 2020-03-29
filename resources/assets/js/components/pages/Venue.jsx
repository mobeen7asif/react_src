import React, {Component} from 'react';
import PropTypes from 'prop-types';
import VenueList from './sub-pages/venue/VenueList';
import AddVenue from "./sub-pages/venue/AddVenue";
import VenueConfig from "./sub-pages/venue/VenueConfig";
import '../../../../../public/assets/css/sp.css';
import VenueCategory from "./sub-pages/venue/VenueCategory";
import UserRole from "./sub-pages/venue/UserRole";
import PunchCard from "./sub-pages/venue/PunchCard";
import Gyms from "./sub-pages/venue/Gyms";
import StoreListing from "./sub-pages/venue/Stores/StoreListing";
import AddCategory from "./sub-pages/venue/AddCategory";
import ReferralFriend from "./sub-pages/venue/ReferralFriend";
import ListGroups from "./sub-pages/venue/ListGroups";
import AddGroup from "./sub-pages/venue/AddGroup";


class Venue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab : "venue/venueList",
            venue_data: {},
            edit_venue_id:0,
            venueData:[],
            venue_loyalty: {},
            venue_test_alerts: {},
            venue_conpain_saturation: {},
            edit_category_id:0,
            categoryData:[],
            version1:false,
            edit_group_id:0,
            groupData:[],
        };

    }//..... end of constructor() .....//

    componentDidMount = () =>{

        this.loadVenueConfigData();
        this.getVenueSettings()
    };

    setEditVenue = (venue_id,venueData) => {
        this.setState(()=>({edit_venue_id:venue_id,venueData:venueData,activeTab:"venue/addVenue"}));

    };

    setEditCategoryData = (category_id,categoryData) => {
        this.setState(()=>({edit_category_id:category_id,categoryData:categoryData,activeTab:"addNewCategory"}));

    };

    loadVenueConfigData = () => {
        axios.post(BaseUrl+'/api/venue-configuration',{venue_id:VenueID,company_id:CompanyID} ).then((arr)=>{
            if(arr.data){
                //let res = arr.data;
                /*let data = {
                    venue_data: res.venue_data,
                    venue_loyalty: res.venue_loyalty,
                    venue_test_alerts: res.venue_test_alerts,
                    venue_conpain_saturation: res.venue_conpain_saturation,
                };*/
                this.setState(()=>({...arr.data}));
            }

        });
    };

    addNewVenue = ()=>{
        this.setState(()=>({edit_venue_id:0,venueData:[]}),()=>{
            this.setState({activeTab:"venue/addVenue"});
        });

    };

    createNewCategory = ()=> {
        this.setState(()=>({edit_venue_id:0,venueData:[]}),()=>{
            this.setState({activeTab:"addNewCategory"});
        });

    };

    //...... Group Menu Methods ......//
    createNewGroup = ()=> {
        this.setState(()=>({edit_group_id:0,venueData:[]}),()=>{
            this.setState({activeTab:"addNewGroup"});
        });
    };

    setEditGroupData = (group_id,groupData) => {
        this.setState(()=>({edit_group_id:group_id,groupData:groupData,activeTab:"addNewGroup"}));
    };
    //......  end of group menu methods ......//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    getVenueSettings = () => {
        axios.post(BaseUrl + '/api/get-payment-gateway').then((response) => {
            let userData = localStorage.getItem('userData');
            if (userData) {
                userData = JSON.parse(userData);
                if (userData.venue_id){

                    userData.venue_settings = response.data.venue_setting;
                    venueSettings = response.data.venue_setting;

                    localStorage.setItem('userData', JSON.stringify(userData));
                }
            }
        })
    }

    render() {
        return (
            <div>
                <div className="compaignstabsBttns clearfix">
                    {(appPermission("Venue List","view")) && (
                        <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.changeVenueTab('venue/venueList') }}   className={this.state.activeTab == 'venue/venueList' ? 'compaignsActive venueListTab' : 'venueListTab'}>Site List</a>
                    )}
                    {/*<a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.changeVenueTab('venue/addVenue') }}    className={this.state.activeTab == 'venue/addVenue' ? 'compaignsActive' : ''}>Add Venue</a>*/}

                    {/*{(appPermission("Venue Category","view") && !venueSettings) && (*/}
                        <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.changeVenueTab('venue/addVenueCategory') }}    className={this.state.activeTab == 'venue/addVenueCategory' ? 'compaignsActive' : ''}>Site Category</a>
                    {/*)}*/}

                    {(appPermission("Venue Configuration","view")) && (
                        <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.changeVenueTab('venue/venueConfig') }} className={this.state.activeTab == 'venue/venueConfig' ? 'compaignsActive' : ''}>Site Configuration</a>
                    )}

                    {(appPermission("User Role","view")) && (
                        <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.changeVenueTab('add/userRole') }} className={this.state.activeTab == 'add/userRole' ? 'compaignsActive' : ''}>User Role</a>
                    )}

                    {/*{(appPermission("Punch Card","view")) && (
                        <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.changeVenueTab('manage/punch-card') }} className={this.state.activeTab == 'manage/punch-card' ? 'compaignsActive' : ''}>Stamp Cards</a>
                    )}*/}
                    {/*<a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.changeVenueTab('manage-gyms') }} className={this.state.activeTab == 'manage-gyms' ? 'compaignsActive' : ''}>Gyms</a>*/}

                    {/*<a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.changeVenueTab('manageStore') }} className={this.state.activeTab == 'manageStore' ? 'compaignsActive' : ''}>Manage Stores</a>*/}
                    {(appPermission("Referral Settings","view")) && (
                        <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.changeVenueTab('manage/referral-friend') }} className={this.state.activeTab == 'manage/referral-friend' ? 'compaignsActive' : ''}>Referral Settings</a>
                    )}
                    {/*<a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.changeVenueTab('manage/listGroups') }} className={this.state.activeTab == 'manage/listGroups' ? 'compaignsActive' : ''}>List Groups</a>*/}
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


    changeVenueTab = (tab) => {
        this.setState({activeTab : tab});
    };

    loadActiveComponent = () => {
        switch (this.state.activeTab){
            case "venue/venueList" :
                return <VenueList changeVenueTab={this.changeVenueTab} setEditVenue={this.setEditVenue} addNewVenue={this.addNewVenue} />;

            case "venue/addVenue"  :
                return <AddVenue changeVenueTab={this.changeVenueTab} setEditVenue={this.setEditVenue} venueData={this.state.venueData} getEditVenueID={this.state.edit_venue_id}  />;
            case "venue/addVenueCategory":
                return <VenueCategory changeVenueTab={this.changeVenueTab} setEditCategoryData={this.setEditCategoryData} categoryData={this.state.categoryData} getEditCategoryID={this.state.edit_category_id} createNewCategory={this.createNewCategory} />;
            case "venue/venueConfig" :
                return <VenueConfig venue_data={this.state.venue_data} venue_loyalty = {this.state.venue_loyalty} venue_test_alerts={this.state.venue_test_alerts} venue_conpain_saturation={this.state.venue_conpain_saturation} />;
            case "add/userRole" :
                return <UserRole/>;
            /*case 'manage/punch-card':
                return <PunchCard />;*/
            case 'manage-gyms':
                return <Gyms />;
            case 'manageStore':
                return <StoreListing/>;
            case 'addNewCategory':
                return <AddCategory changeVenueTab={this.changeVenueTab} setEditCategoryData={this.setEditCategoryData} categoryData={this.state.categoryData} getEditCategoryID={this.state.edit_category_id} />;
            case 'manage/referral-friend':
                return <ReferralFriend/>;
            case 'manage/listGroups':
                return <ListGroups changeVenueTab={this.changeVenueTab} setEditGroupData={this.setEditGroupData} groupData={this.state.groupData} getEditGroupID={this.state.edit_group_id} createNewGroup={this.createNewGroup}   />;

            case 'addNewGroup':
                return <AddGroup changeVenueTab={this.changeVenueTab} setEditGroupData={this.setEditGroupData} groupData={this.state.groupData} getEditGroupID={this.state.edit_group_id} />;

            default :
                return "";
        }


    };



}//..... end of Venue.




Venue.propTypes = {};

export default Venue;