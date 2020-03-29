import React, {Component} from 'react';
import Faq from "./sub-pages/Help/Faq";
import UserGuide from "./sub-pages/Help/UserGuide";
import Contact from "./sub-pages/Help/Contact";
import PrivacyPolicy from "./sub-pages/Help/PrivacyPolicy";
import AboutLoyalty from "./sub-pages/Help/AboutLoyalty";
import FaqCategories from "./sub-pages/Help/FaqCategories";
import TermAndConditionMultipal from "./sub-pages/Help/TermAndConditionMultipal";

class Help extends Component {
    constructor(props) {
        super(props);
        this.state = {
          currentMenu :"faq_category",
          faq_category_id :"",
          faq_category_name:""
        };
    }//..... end of constructor() .....//



    changeMenue =(menuName) => {
        this.setState({currentMenu : menuName},()=>{
                this.loadComponent();
        });

    };

    listFaqs =(category_id,category_name) => {

        this.setState({faq_category_id : category_id,faq_category_name:category_name,currentMenu:"Faq"},()=>{
                this.loadComponent();
        });

    };

    loadComponent = () => {
        switch (this.state.currentMenu){
            case ("Faq"):
                return <Faq category_id={this.state.faq_category_id} category_name={this.state.faq_category_name}/>;
            case 'faq_category':
                return <FaqCategories listFaqs={this.listFaqs}/>;
            case ("user_guide"):
                return <UserGuide/>;
            case ("contact") :
                return <Contact/>;
            case ("terms_and_conditions") :
                return <TermAndConditionMultipal/>;
            case ("privacy_policy") :
                return <PrivacyPolicy/>;
            case 'about_loyalty':
                return <AboutLoyalty/>;
        }
    };

    render() {
        return (
            <React.Fragment>
                <div className="compaignstabsBttns change_colorTab clearfix">
                    {(appPermission("Faqs Category","view")) && (
                        <a  style={{cursor:'pointer'}} className={(this.state.currentMenu === 'faq_category' || this.state.currentMenu === 'Faq') ? "compaignsActive" : ""} onClick={(e)=>{this.changeMenue("faq_category")}}>FAQ's</a>
                    )}

                    {/*<a  style={{cursor:'pointer'}} className={this.state.currentMenu === 'Faq' ? "compaignsActive" : ""} onClick={(e)=>{this.changeMenue("Faq")}}>FAQ</a>*/}

                    {/* <a  style={{cursor:'pointer'}} className={this.state.currentMenu === 'user_guide' ? "compaignsActive" : ""} onClick={(e)=>{this.changeMenue("user_guide")}} >USER GUIDE</a>*/}
                    {(appPermission("Contact","view")) && (
                        <a  style={{cursor:'pointer'}} className={this.state.currentMenu === 'contact' ? "compaignsActive" : ""} onClick={(e)=>{this.changeMenue("contact")}}>CONTACT</a>
                    )}

                    {(appPermission("Terms And Conditions","view")) && (
                        <a  style={{cursor:'pointer'}} className={this.state.currentMenu === 'terms_and_conditions' ? "compaignsActive" : ""} onClick={(e)=>{this.changeMenue("terms_and_conditions")}}>Terms & Conditions</a>
                    )}

                    {/* <a  style={{cursor:'pointer'}} className={this.state.currentMenu === 'privacy_policy' ? "compaignsActive" : ""} onClick={(e)=>{this.changeMenue("privacy_policy")}}>Privacy Policy</a>*/}

                    {/*{(appPermission("About Loyalty","view")) && (
                        <a  style={{cursor:'pointer'}} className={this.state.currentMenu === 'about_loyalty' ? "compaignsActive" : ""} onClick={(e)=>{this.changeMenue("about_loyalty")}}>About Loyalty</a>
                    )}*/}

                </div>

                <div className="contentDetail">

                    <div className="autoContent">
                        {this.loadComponent()}
                    </div>
                </div>
            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of Help.

Help.propTypes = {};

export default Help;