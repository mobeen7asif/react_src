import React, { Component } from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux'

import Navigation from "./_partials/Navigation";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Campaigns from "./pages/Campaigns";
import Venue from "./pages/Venue";
import Media from "./pages/Media";
import ImageCategories from "./pages/sub-pages/Media/ImageCategories";
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import PrivateRoute from "./_partials/PrivateRoute";
import Login from "./pages/Login";
import Help from "./pages/Help";
import MyNews from "./pages/MyNews";
import Charities from "./pages/Charities";
import Recipe from "./pages/Recipe";
import EmailBuilder from "./pages/sub-pages/campaigns/email-builder/EmailBuilder";
import Gamification from "./pages/Gamification";
import ProfileDashboard from "./pages/sub-pages/members/MemberProfile/ProfileDashboard";
import AddMember from "./pages/sub-pages/members/MemberProfile/components/AddMember";

import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";
import PaymentList from "./pages/sub-pages/Payments/PaymentList";
import VoucherManagement from "./pages/VoucherManagement";
import UploadMemberCsv from "./pages/sub-pages/members/UploadMemberCsv";
import CustomCsvUpload from "./pages/sub-pages/Csv/CustomCsvUpload";
import ManageComponent from "./pages/ManageComponent";
import QrCodeGenerate from "./pages/sub-pages/QrCodeGenerate";


class Master extends Component {
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <React.Fragment>
                <HashRouter>
                    <div>
                    <Navigation {...this.props}/>
                    <main className="e_member_content">
                        <div className="container_outer">
                            <Switch>
                                <PrivateRoute  exact path={'/'} component={Dashboard} />
                                <PrivateRoute exact path={'/members'} component={Members}/>
                                <PrivateRoute exact path={'/campaigns'} component={Campaigns} />

                                <PrivateRoute exact path={'/campaigns/builder/:id?'} component={Campaigns} />
                                <PrivateRoute exact path={'/campaigns/pet-pack'} component={Campaigns} />
                                <PrivateRoute exact path={'/campaigns/competition'} component={Campaigns} />
                                <PrivateRoute exact path={'/campaigns/survey'} component={Campaigns} />
                                <PrivateRoute exact path={'/venue'} component={Venue} />
                                <PrivateRoute exact path={'/gamification'} component={Gamification} />
                                <PrivateRoute exact path={'/Cms'} component={MyNews} />
                                <PrivateRoute exact path={'/help'} component={Help} />
                                <PrivateRoute exact path={'/ImageCategories'} component={ImageCategories} />
                                <PrivateRoute exact path={'/campaigns/emailBuilder/:id?'} component={EmailBuilder} />
                                <PrivateRoute exact path={'/members/profile/:id?'} component={ProfileDashboard} />
                                <PrivateRoute exact path={'/members/upload-csv'} component={CustomCsvUpload} />
                                <PrivateRoute exact path={'/customCsv'} component={CustomCsvUpload} />
                                <PrivateRoute exact path={'/members/add'} component={AddMember} />
                                <Route exact path={'/login'} component={Login}/>
                                <PrivateRoute exact path={'/reports'} component={Reports} />
                                <PrivateRoute exact path={'/manage/:voucher?/:id?'} component={ManageComponent} />
                                <PrivateRoute exact path={'/loyalty'} component={VoucherManagement} />
                                <PrivateRoute exact path={'/qrcode/:id?'} component={QrCodeGenerate} />
                                <PrivateRoute exact path={'/refund-failed-transactions'} component={PaymentList} />
                                <Route exact path={'/notFound'} component={NotFound}/>
                                <Route component={Login}/>
                            </Switch>
                        </div>

                    </main>
                        <footer style={{textAlign:'center',padding:'10px',fontFamily:'Roboto, sans-serif',fontSize:'12px',fontWeight:'900'}}>Version  3.1.17</footer>

                </div>
            </HashRouter>
                <NotificationContainer/>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {};
export default connect(mapStateToProps())(Master);
