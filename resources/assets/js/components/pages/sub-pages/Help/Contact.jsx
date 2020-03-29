import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NotificationManager} from "react-notifications";
import ReactHtmlParser from "react-html-parser";
import CKEditor from "react-ckeditor-component";

class Contact extends Component {
    state = {

        is_edit:0,
        type:"contact",
        description:"",
    };
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidMount = () => {
        this.getContacts();
    };
    openPopup = () => {
        this.FaqPopupRef.style.display = "block";
        this.saveCategoryBtn.classList.add("disabled");
    };

    closePopup = () => {
        this.FaqPopupRef.style.display = "none";
    };

    getContacts = (value = '') => {

        axios.post(BaseUrl + '/api/contacts',{'search':value,venue_id: VenueID,company_id:CompanyID,type:this.state.type})
            .then(res => {
                this.setState({description : res.data.data.description,is_edit:res.data.data.id});
            }).catch((err) => {
        });
    };

    saveFaq = () => {
        show_loader();
        axios.post(BaseUrl + '/api/save-faqs',{...this.state,venue_id: VenueID,company_id:CompanyID,title:"contact"})
            .then(res => {
                this.closePopup();
                this.getContacts();
                show_loader();
                NotificationManager.success(res.data.message, 'Success');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while adding Contacts .", 'Error');
        });
    };

    editFaq = (value) => {
        this.setState(()=>({is_edit : value.id,title:value.title,description:value.description}),()=>{
            this.FaqPopupRef.style.display = "block";
            this.saveCategoryBtn.classList.add("disabled");
        });
    };

    onChangeDescriptions = (evt) => {
        let description = evt.editor.getData();
        this.handleChange({description})
    };//..... end of onChangeDescriptions() .....//

    handleChange = (obj) => {
        this.setState(()=>(obj),()=>{
            this.validation();
        });
    };//..... end of handleChange() .....//

    validation = () => {
        if(this.state.description == "")
            this.saveCategoryBtn.classList.add("disabled");
        else
            this.saveCategoryBtn.classList.remove("disabled");
    };
    render() {
        return (
            <React.Fragment>
                <div className="contentDetail">

                    <div className="autoContent">

                        <div className="compaignHeadigs">
                            <h1>Contact Details</h1>
                        </div>
                        <div className="backSave_buttons" style={{width:"96%"}}>
                            <ul>
                                <li>
                                    {(appPermission("Contact","add")) && (
                                        <a  style={{cursor:'pointer'}} className="selecBttn" onClick={()=>{this.openPopup()}} >Add/Update Contact</a>
                                    )}
                                </li>
                            </ul>
                        </div>

                        <div className="faq_description_section" style={{padding:'0px'}}>
                            <div className=" faq_userGuide_Container">
                                {ReactHtmlParser(this.state.description)}

                            </div>
                        </div>
                    </div>

                    <div className= "popups_outer addNewsCategoryPopup" ref={(ref)=>{this.FaqPopupRef = ref}} style={{display: 'none'}}>
                        <div className="popups_inner">
                            <div className="overley_popup" data-attr="addNewUser_popup" onClick={()=>this.closePopup()}></div>

                            <div className="popupDiv2" style={{width:"1024px",left:"33%"}}>
                                <div className="popupDiv_detail">

                                    <div className="popup_heading clearfix">
                                        <h3>ADD/Edit Contact</h3>
                                        <a  style={{cursor:'pointer'}} data-attr="addNewUser_popup" className="popupClose close_popup" onClick={()=>this.closePopup()}>&nbsp;</a>
                                    </div>

                                    <div className="beacon_popupDeatail"> <br /><br />
                                        <div className="beacon_popup_form">

                                            <div className="venueIdentification_form">
                                                <ul>


                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Description</h4>
                                                            <CKEditor activeClass="p10" content={this.state.description} events={{"change": this.onChangeDescriptions}}/>
                                                        </div>
                                                    </li>



                                                </ul>
                                            </div>
                                        </div>

                                        <div className="continueCancel place_beacon createUserButtons">
                                            <input ref={(ref)=>{this.saveCategoryBtn = ref;}} className="disabled selecCompaignBttn save_category" defaultValue="Save"  onClick={(e)=>{this.saveFaq()}} />
                                            <a  style={{cursor:'pointer'}} className="close_popup" onClick={()=>this.closePopup()}>CANCEL</a>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of Contact.

Contact.propTypes = {};

export default Contact;