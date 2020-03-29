import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import CustomFields from "./sub-pages/venue/CustomFields";

class Login extends Component {
    constructor(props) {
        super(props);
        this.isLoggedIn();
        this.state = {
            password: '',
            email: '',
            isRemember: false,
            isEmailValid: false
        };

        this.passwordInput = null;
    }//..... end of constructor() .....//

    componentDidUpdate = () => {
        this.isLoggedIn();
    };

    isLoggedIn = () => {
        let isAuthenticated = localStorage.getItem('isAuthenticated');
        if (isAuthenticated && isAuthenticated === 'true') {
            //let from = '/';
            let from = this.checkActivePage();
            if (this.props.location.state && this.props.location.state.from){
                if(from != "/"){

                }else{
                    from = this.props.location.state.from;
                }
            }


            return this.props.history.push(from);
        }
    };//..... end of isLoggedIn() .....//

    checkActivePage = () => {
        if(appPermission("Dashboard","view")){
            return "/";
        }else if(appPermission("Members","view")){
            return "/members";
        }else if(appPermission("Campaigns","view")){
            return "/campaigns";
        }else if(appPermission("Venue","view")){
            return "/venue";
        }else if(appPermission("News","view")){
            return "/News";
        }else if(appPermission("Charities","view")){
            return "/Charities";
        }else if(appPermission("Help","view")){
           return "help";
        }else if(appPermission("Recipe","view")){
            return "/recipe";
        }else{
            return "/";
        }
    }

    handleSignInClick = () => {
        if (!this.state.isEmailValid) {
            NotificationManager.error(`Please provide a valid email.`, 'Error');
            return false;
        }//..... end if() ....//

        if (this.state.password.length === 0) {
            NotificationManager.error(`Password is required.`, 'Error');
            return false;
        }//..... end if() .....//

        show_loader();


       axios.post(BaseUrl + '/api/web-login', {
           password: this.state.password,
           email:    this.state.email
       }).then((response) => {
           show_loader(true);
          if (response.data.status === true && response.data.access_token_status === true){
              this.persistUserDetails(response.data);
             // window.location.reload(true);
          } else if (response.data.status === false)
              NotificationManager.error(response.data.message, 'Error');
          else
              NotificationManager.error(response.data.access_token_message, 'Error');
       }).catch((err) => {
           show_loader(true);
           // NotificationManager.error(`Internal server error occurred, Please try later.`, 'Error');
       });
    };

    handlePasswordChange = (e) => {
        this.setState({password: e.target.value});
    };//..... end of handlePasswordChange() .....//

    handleEmailChange = (e) => {
        this.setState({email: e.target.value, isEmailValid: e.target.validity.valid});
    };//..... end of handleEmailChange() .....//

    handleCheckbox = (e) => {
        this.setState({isRemember: e.target.checked});
    };//..... end of handleCheckbox() .....//

    persistUserDetails = (data) => {

         localStorage.setItem('memberCustomFields', JSON.stringify([]));
         localStorage.setItem('isAuthenticated', 'true');
         localStorage.setItem('userData', JSON.stringify(data));
         localStorage.setItem('isRemember', this.state.isRemember ? 'true' : 'false');
         localStorage.setItem('loggedInTime', (new Date()).getTime());
         localStorage.setItem('CompanyId', data.company);
         VenueID = data.venue_id;
         UserRole = data.user_role;
         UserId = data.user;
         IBS = data.ibs;
         INTEGRATED = data.is_integrated;
         CompanyID = data.company;
        Currency = (data.company == 2) ? "£" : "€";
        UserPostCode = data.postal_code;
        StoreName = data.store_name;
        this.getCustomFieldOfVenue(data.venue_id,data.company);
         this.isLoggedIn();
    };//..... end of persistUserDetails() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    getCustomFieldOfVenue = (venue_id,company_id) => {
        show_loader();
        axios.post(BaseUrl+'/api/getVenue',{venue_id:venue_id,company_id:company_id} ).then((arr)=>{
            if(arr.data){
                show_loader(true);
                let data = arr.data.data.custom_fields ? JSON.parse(arr.data.data.custom_fields) : [];
                let user_forms = arr.data.user_form ? arr.data.user_form : [];
                let all_custom_fields = arr.data.all_custom_fields ? arr.data.all_custom_fields : [];
                if(data.length == 0)
                    data = [{id:1,field_name:"",field_label:"",field_type:"text",segment_name:"",search_name:"",field_unique_id:"custom_field_member_1"}];

                localStorage.setItem('memberCustomFields', JSON.stringify(data));
                localStorage.setItem('user_form', JSON.stringify(user_forms));
                localStorage.setItem('all_custom_fields', JSON.stringify(all_custom_fields));

            }else{
                show_loader(true);
            }

        }).catch((err) => {
            show_loader();
        });
    }

    render() {
        return (
            <div className="popups_outer warningPopup" id="delete_popup" style={{display: 'block'}}>
                <div className="popups_inner">
                    <div className="overley_popup" style={{background: `url(${BaseUrl}/assets/images/signupBg.png)`}}>&nbsp;</div>
                    <div className="popupDiv">
                        <div className="popupDiv_detail">
                            <div className="signInWeb_autoContainer">
                                <div className="signInWeb_detail">
                                    <div className="tabsBttns clearfix">
                                        <a  style={{cursor:'pointer'}} className="activeTab" id="signInClick">SIGN IN</a>
                                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                                    </div>

                                    <div className="signInWeb_view" style={{display:'block'}} id="signIn_show">
                                        <div className="signView">
                                            <div className="signUp_logo">
                                                <a  style={{cursor:'pointer'}}>
                                                    <img src="assets/images/login_logo.png" alt="#"/>
                                                </a>
                                            </div>
                                            <div className="sign_form">
                                                <ul>
                                                    <li>
                                                        <div className="customeInput">
                                                            <input type="email" placeholder="Email Address" value={this.state.email} onChange={this.handleEmailChange} required='required'
                                                                   onKeyPress={(e) => {if (e.key === 'Enter') this.passwordInput.focus() }} id={'email'}/>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="customeInput">
                                                            <input type="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}
                                                                   ref={ref => this.passwordInput = ref} onKeyPress={(e) => {if (e.key === 'Enter') this.handleSignInClick(); }} id={'password'}/>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="control-group">
                                                            <label className="control control--checkbox">Remember me
                                                                <input type="checkbox" onClick={this.handleCheckbox} id={'rememberMe'}/>
                                                                <div className="control__indicator">&nbsp;</div>
                                                            </label>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="submitBtn">
                                                            <input type="submit" id={'submit'} value="SIGN IN" onClick={this.handleSignInClick}/>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="forgotPassword">
                                            <p>Did you <a href="https://www.myknox.co/auth/forgot_password">forget your password?</a></p>
                                        </div>
                                    </div>
                                    <div className="signInWeb_view signUpView" id="signUp_show">
                                        <div className="signView">
                                            <div className="signUp_logo">
                                                <a  style={{cursor:'pointer'}}>
                                                    <img src="assets/images/amplify_logo@2x.png" alt="#"/>
                                                </a>
                                            </div>
                                            <div className="sign_form">
                                                <ul>
                                                    <li>
                                                        <div className="customeInput">
                                                            <input type="email"  placeholder="Email Address"/>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="customeInput">
                                                            <input type="password"  placeholder="Password"/>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="customeInput">
                                                            <input type="password"
                                                                   placeholder="Confirm Password"/>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="submitBtn">
                                                            <input type="submit" defaultValue="SIGN IN"/>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="signUp_copyRights">
                                    <p>2010 2018 © Amplify (Pty) Ltd. All Rights Reserved</p>
                                    <ul>
                                        <li><a href={BaseUrl+"/privacy-policy"} target="_blank">Privacy Policy</a><b>|</b></li>
                                        <li><a href={BaseUrl+"/term-and-conditions"} target="_blank">Terms and Conditions</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of Login.

export default Login;