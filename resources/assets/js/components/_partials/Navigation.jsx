import React, {Component} from 'react';
import {NavLink, withRouter} from 'react-router-dom';
import Header from "./Header";
import EmptyPage from "../pages/EmptyPage";
import {NotificationManager} from "react-notifications";


class Navigation extends Component {
    acl_permission = [];

    componentDidCatch = (error, info) => {
        show_loader(true);

    };//...... end of componentDidCatch() .....//




    componentDidUpdate = () => {
        var path = this.props.location.pathname.substring(1);

        if(path == ""){
            path = "dashboard";
            if(!appPermission(path,"view")){
                return <EmptyPage/>
            }

        }
        //---- here route having / will be replace with knox created url ......//
        if(path == "campaigns/")
            path = "campaigns";

        if(appPermission("Campaigns","view") == true){
            if(path == "campaigns/builder")
                path = "Campaign Builder";

            if(path == "campaigns/emailBuilder")
                path = "Email Builder";

            if(path == "campaigns/pet-pack")
                path = "Pet Pack";

            if(path == "campaigns/competition")
                path = "Competition";

            if(path == "campaigns/survey")
                path = "Surveys";
        }


        if(!appPermission(path,"view") && path != "login"){
            window.location.href = BaseUrl+'#/notFound';
        }
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
            <Header {...this.props}>
                <ul>
                    {appPermission("Dashboard","view") && (
                        <li>
                            <NavLink  to='/' className={"dash_b_icon "}  activeClassName={'active'} exact={true} >
                                <b id="main_mnu_dashboard" >DASHBOARD</b>
                            </NavLink>
                        </li>
                    )}
                    {appPermission("Members","view") && (

                        <li>
                            <NavLink to='/members' className={"members_icon "} activeClassName={'active'} >
                                <b id="main_mnu_members">MEMBERS</b>
                            </NavLink>
                        </li>
                    )}

                    {appPermission("Campaigns","view") && (
                        <li>
                            <NavLink to='/campaigns' className={"target_icon "}  activeClassName={'active'}>

                                <b id="main_mnu_campaing">CAMPAIGNS</b>

                            </NavLink>
                        </li>
                    )}

                    <li>
                        <NavLink to='/loyalty' className={"loyalty_icon"} activeClassName={'active'}>
                            <b id={"main_mnu_recipe"}>Assets</b>
                        </NavLink>
                    </li>
                    {appPermission("Manage","view") && (
                        <li>
                        <NavLink to='/manage' className={"report_icon"} activeClassName={'active'}>
                            <b id={"main_mnu_recipe"}>Manage</b>
                        </NavLink>
                    </li>
                    )}

                    {appPermission("Reports","view") && (

                    <li>
                        <NavLink to='/reports' className={"report_icon"} activeClassName={'active'}>
                            <b id={"main_mnu_recipe"}>Reports</b>
                        </NavLink>
                    </li>
                    )}

                    {appPermission("News","view") && (
                        <li>
                            <NavLink to='/Cms' className={"cms_icon "} activeClassName={'active'}>
                                <b id={"main_mnu_my_news"}>CMS</b>
                            </NavLink>
                        </li>
                    )}

                    {appPermission("Venue","view") && (
                        <li>
                            <NavLink to='/venue' className={"setting_icon "} activeClassName={'active'}>
                                <b id="main_mnu_venue">Settings</b>
                            </NavLink>
                        </li>
                    )}

                    {/*<li>
                        <NavLink to='/gamification' className={"media_icon "} activeClassName={'active'}>
                            <b id={"main_mnu_media"}>Gamification</b>
                        </NavLink>
                    </li>*/}


                    {/*{appPermission("Charities","view") && (
                    <li>
                        <NavLink to='/Charities' className={"help_icon disable_menues"} activeClassName={'active'}>
                            <b id={"main_mnu_help"}>Charities</b>
                        </NavLink>
                    </li>
                    )}*/}

                    {/*{appPermission("Help","view") && (
                    <li>
                        <NavLink to='/help' className={"help_icon "} activeClassName={'active'}>
                            <b id={"main_mnu_help"}>HELP</b>
                        </NavLink>
                    </li>
                    )}*/}

                    {/*{appPermission("Recipe","view") && (

                    <li>
                        <NavLink to='/recipe' className={"help_icon disable_menues"} activeClassName={'active'}>
                            <b id={"main_mnu_recipe"}>Recipe</b>
                        </NavLink>
                    </li>
                    )}*/}



                </ul>
            </Header>
        );
    }//..... end of render() .....//
}//..... end of Navigation.

export default withRouter(Navigation);