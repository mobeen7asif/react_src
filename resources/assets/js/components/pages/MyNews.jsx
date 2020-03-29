import React, {Component} from 'react';
import PropTypes from 'prop-types';
import News from "./sub-pages/MyApplication/News";
import NewsCategory from "./sub-pages/MyApplication/NewsCategory";
import QuickBoard from "./sub-pages/MyApplication/QuickBoard";
import AddEditQuickBoard from "./sub-pages/MyApplication/AddEditQuickBoard";
import QuickBoardLevels from "./sub-pages/MyApplication/QuickBoardLevels";
import OfferListing from "./sub-pages/Recipe/OfferListing";
import AddOffer from "./sub-pages/Recipe/AddOffer";
import Faq from "./sub-pages/Help/Faq";
import FaqCategories from "./sub-pages/Help/FaqCategories";
import UserGuide from "./sub-pages/Help/UserGuide";
import Contact from "./sub-pages/Help/Contact";
import TermAndConditionMultipal from "./sub-pages/Help/TermAndConditionMultipal";
import PrivacyPolicy from "./sub-pages/Help/PrivacyPolicy";
import AboutLoyalty from "./sub-pages/Help/AboutLoyalty";
class MyNews extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMenu :"NewsCategory",
            quickBoardData:0,
            editData:{},
            faq_category_id :"",
            faq_category_name:""
        };
    }//..... end of constructor() .....//

    changeMenue =(menuName) => {
        this.setState({currentMenu : menuName},()=>{
            this.loadComponent();
        });

    };

    changeQuickBoard =(menuName,value) => {

        this.setState({currentMenu : menuName,quickBoardData:value},()=>{
            this.loadComponent();
        });

    };
    changeMainTab = (tab) => {
        this.setState({currentMenu : tab,editData: {}},()=>{
            this.loadComponent();
        });
        this.setState({currentMenu : tab, editData: {}});
    };
    setEditRecord = (editData, tab) => {
        this.setState(({currentMenu : tab, editData: editData}),()=>{
            this.loadComponent();
        });
    }

    listFaqs =(category_id,category_name) => {

        this.setState({faq_category_id : category_id,faq_category_name:category_name,currentMenu:"Faq"},()=>{
            this.loadComponent();
        });

    };

    loadComponent = () => {
        switch (this.state.currentMenu){
            case ("News"):
                return <News/>;
            case ("NewsCategory"):
                return <NewsCategory/>;
            case ("QuickBoardLevels"):
                return <QuickBoardLevels/>;
            case ("QuickBoard"):
                return <QuickBoard changeQuickBoard={this.changeQuickBoard}/>;
            case ("AddEditQuickBoard"):
                return <AddEditQuickBoard changeQuickBoard={this.changeQuickBoard} quickBoardData={this.state.quickBoardData} />;
            case "offer"  :
                return <OfferListing changeMainTab={this.changeMainTab} setEditRecord={this.setEditRecord} />;
            case "addOffer"  :
                return <AddOffer changeMainTab={this.changeMainTab} editData={this.state.editData} />;

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
            <div>
                <React.Fragment>
                    <div className="compaignstabsBttns_cms change_colorTab clearfix">

                        {(appPermission("News Category","view")) && (
                            <a  style={{cursor:'pointer'}} className={this.state.currentMenu === 'NewsCategory' ? "compaignsActive" : ""} onClick={(e)=>{this.changeMenue("NewsCategory")}} >News Category</a>
                        )}
                        {(appPermission("News","view")) && (
                            <a  style={{cursor:'pointer'}} className={this.state.currentMenu === 'News' ? "compaignsActive" : ""} onClick={(e)=>{this.changeMenue("News")}}>News</a>
                        )}
                        {(appPermission("Quick Board Levels","view")) && (
                            <a  style={{cursor:'pointer'}} className={this.state.currentMenu === 'QuickBoardLevels' ? "compaignsActive" : ""} onClick={(e)=>{this.changeMenue("QuickBoardLevels")}}>Quick Board Levels</a>
                        )}
                        {(appPermission("Quick Board","view")) && (
                            <a  style={{cursor:'pointer'}} className={this.state.currentMenu === 'QuickBoard' ? "compaignsActive" : ""} onClick={(e)=>{this.changeMenue("QuickBoard")}}>Quick Board</a>
                        )}
                        {(appPermission("Offers List","view")) && (
                            <a  style={{cursor:'pointer'}}    className={this.state.currentMenu == 'offer' || this.state.currentMenu == 'addOffer' ? 'compaignsActive' : ''} onClick={(e)=>{this.changeMenue("offer")}}>Offers List</a>
                        )}

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

                        <div className="autoContent" style={{maxWidth:"1330px"}}>
                            {this.loadComponent()}
                        </div>
                    </div>
                </React.Fragment>
            </div>
        );
    }//..... end of render() .....//
}//..... end of MyApplication.

MyNews.propTypes = {};

export default MyNews;