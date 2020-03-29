import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {NotificationManager} from "react-notifications";

import { connect } from 'react-redux';
import CustomFields from "../pages/sub-pages/venue/CustomFields";

class Header extends Component {

    dropDownLabelRef     = null;
    dropDownUlRef        = null;
    state = {
        isSetData:false,
        venueList: [],
        venue_name: ''
    };



    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userData');
        localStorage.removeItem('loggedInTime');
        localStorage.removeItem('loggedInTime');
        localStorage.removeItem('memberCustomFields');
        localStorage.removeItem('CompanyId');
        localStorage.removeItem('user_form');
        localStorage.removeItem('all_custom_fields');
        this.props.history.push('/login');
    };

    componentDidUpdate = () => {
        this.updateLocalDetails();
    };//..... end of componentDidUpdate() .....//

    componentDidMount = () => {
        this.updateLocalDetails();
        this.populateVenueList();
        this.getCustomFieldOfVenue();
    };

    showLeftBar = () => {
        showLeftBar(true);
    };

    updateLocalDetails = () => {
        let userData = localStorage.getItem('userData');
        if (userData) {
            userData = JSON.parse(userData);
            if (Object.keys(userData).length > 0) {
                let lastLoggedInTime = localStorage.getItem('loggedInTime');// time in milliseconds
                let now = (new Date()).getTime();
                let rememberMe = localStorage.getItem('isRemember');
                if (rememberMe !== 'true' && (now - lastLoggedInTime) > (10000*60*24)) // if user doesn't perform any activity in 24 minutes than log him/her out.
                    this.handleLogout();


                CompanyID = localStorage.getItem('CompanyId');
                Currency = (CompanyID == 2) ? "£" : "€";

                if (!VenueID) {
                    VenueID = userData.venue_id;
                }//..... end if() .....//

                if (!VenueName) {
                    VenueName = userData.venue_name;
                    this.setState({venue_name: VenueName});
                }

                if(!IBS){
                    IBS = userData.ibs;
                }
                if(!INTEGRATED){
                    INTEGRATED = userData.is_integrated;

                }

                UserRole = userData.user_role;
                UserId = userData.user;
                UserPostCode = userData.postal_code;
                StoreName = userData.store_name;



                /*if (this.state.venue_name !== userData.venue_name) {
                    VenueName = userData.venue_name;
                    this.setState({venue_name: userData.venue_name});
                } else {
                    VenueName = this.state.venue_name;
                }*///.... end if-else() .....//

                window.axios.defaults.headers.common['Accept'] = 'application/json';
                window.axios.defaults.headers.common['Authorization'] = 'Bearer '+ userData.access_token;
                localStorage.setItem('loggedInTime', (new Date()).getTime());
            } else {
                this.handleLogout();
            }

        }//..... end if() .....//
    };

    selectVenue = (e,venue) => {
        this.dropDownUlRef.style.display = 'none';
        this.dropDownLabelRef.classList.remove('changeAero');
        VenueID = venue.id;
        localStorage.setItem('CompanyId', venue.company_id);


        VenueName = venue.title;

        VenueEmail = venue.sender_email;
        IBS = venue.ibs;
        INTEGRATED = venue.is_integrated;

        this.setState({venue_name: VenueName});
        this.props.onChangeVenue(VenueID);
        let userData = localStorage.getItem('userData');
        if (userData) {
            userData = JSON.parse(userData);
            if (userData.venue_id){
                userData.venue_id = VenueID;
                userData.venue_name = VenueName;

                userData.ibs = IBS;
                userData.is_integrated = INTEGRATED;

                localStorage.setItem('userData', JSON.stringify(userData));
            }
        }
        window.location.reload(true);
    };//..... end of selectVenue() ....//

    handleDropDownSpanClick = (e) => {
        this.populateVenueList();
        e.target.classList.toggle('changeAero');
        this.dropDownUlRef.style.display = (this.dropDownUlRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanClick() .....//

    populateVenueList = () => {
        let isAuthenticated = localStorage.getItem('isAuthenticated');
        if (isAuthenticated && isAuthenticated === 'true' && this.state.venueList.length === 0) {
            show_loader();

            axios.get(BaseUrl + '/api/venue-dropdown-list/'+CompanyID)
                .then((response) => {
                show_loader(true);
                (response.data.status === true) ? this.setState(() => ({venueList: response.data.data}))
                                            : NotificationManager.error(response.data.message, 'Error');
            }).catch((err) => {
                show_loader(true);
                NotificationManager.error(`Internal server error occurred, Please try later.`, 'Error');
            });
        }//..... end if() .....//
    };//..... end of populateVenueList() .....//

    getCustomFieldOfVenue = () => {

        axios.post(BaseUrl+'/api/getVenue',{venue_id:VenueID,company_id:CompanyID} ).then((arr)=>{
            if(arr.data){

                let data = arr.data.data.custom_fields ? JSON.parse(arr.data.data.custom_fields) : [];
                let user_forms = arr.data.user_form ? arr.data.user_form : [];
                let all_custom_fields = arr.data.all_custom_fields ? arr.data.all_custom_fields : [];

                if(data.length == 0)
                    data = [{id:1,field_name:"",field_label:"",field_type:"text",segment_name:"",search_name:"",field_unique_id:"custom_field_member_1"}];

                localStorage.setItem('memberCustomFields', JSON.stringify(data));
                localStorage.setItem('user_form', JSON.stringify(user_forms));
                localStorage.setItem('all_custom_fields', JSON.stringify(all_custom_fields));
            }else{
            }

        }).catch((err) => {

        });
    }
    render() {
        return (
            <header>
                <div className="header_nave_out">
                    <div className="header_nave_inner clearfix">
                        <div className="headerNave_left">
                            <div className="headerNave_profile clearfix">
                                <div className="headerNave_pro_userName">
                                    <a  style={{cursor:'pointer'}} className="header_navebar_editDots headerBackground" >&nbsp;</a>
                                    <div className="customDropDown link_lefthover header--venue--dropdown" style={{width: "55%", float: "right", padding: "8px 0px", background: "none"}}>
                                        <span ref={(ref) => this.dropDownLabelRef = ref} onClick={this.handleDropDownSpanClick}>{this.state.venue_name || 'Select Venue'}</span>
                                        <ul className="customDropDown_show triggersType customPlaceHolder" ref={(ref) => this.dropDownUlRef = ref} style={{marginBottom: '30px',marginTop: '-5px', maxHeight:'207px', display:'none'}} >
                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                {this.state.venueList.map((venue, key) => {
                                                    return <li key={key} onClick={(e)=> {this.selectVenue(e, venue)}} className={VenueID === venue.company_id ? 'selectedItem' : ''}>{venue.title}</li>;
                                                })}
                                            </Scrollbars>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="headerNave_mid">
                            <div className="logo"> <a  style={{cursor:'pointer'}}>{this.state.venue_name}</a> </div>
                        </div>
                        <div className="headerNave_right">
                            <div className="headerNave_rightInn clearfix">
                                <ul>
                                    <li><a  style={{cursor:'pointer'}} className="nave_logout link_lefthover" onClick={this.handleLogout}>Log Out</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="headerMenu_outer">
                    <div className="autoContent">
                        <div className="menu">
                            { this.props.children }
                        </div>
                    </div>
                </div>
            </header>
        );
    }//..... end of render() .....//
}//..... end of Header.


const mapDispatchToProps = dispatch => {
    return {
        onChangeVenue: (VenueID) => dispatch({type: "CHANGEVENUEID", venueId: VenueID})
    };
};

export default connect(null, mapDispatchToProps)(Header);
