import React, {Component} from 'react';
import ReactHtmlParser from "react-html-parser";
import {NotificationManager} from "react-notifications";
import ConfirmationModal from "../../../../utils/ConfirmationModal";
import ReactPaginate from "react-paginate";

export default class ListTemplates extends Component {
    state = {
        htmlTemplate: [],
        test_email:"",
        template_id:"",
        deleteTemplate:0,
        offset: 0,
        perPage:16,
        order_by:'id',
        orderType:'desc',
        admin_role_ids:[],
        preview_template_id:0,
        listTestEmails:[]


    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    componentDidMount = () => {
        this.getTestEmail();
        let roles_id = [];
        getAclRoles("Admin").forEach(function(value,key){
            roles_id.push(value.id);
        });
        this.setState(()=>({admin_role_ids:roles_id}),()=>{
            this.loadTemplates();


        });
    };

    selectTemplate = (id) => this.props.editTemplate(id);

    handleChange = (obj) => this.setState(()=>(obj));

    isValidEmailAddress = () => !! this.state.test_email.match(/.+@.+/);

    loadTemplates = () => {
        show_loader();
        axios.post(BaseUrl + '/api/getTemplate',{...this.state,id:0,admin_ids:this.state.admin_role_ids,user_role:UserRole,user_id:UserId})
            .then(res => {
                show_loader(true);
                this.setState(()=>({htmlTemplate:res.data.data,pageCount:(res.data.total)/this.state.perPage}));
            }).catch((err) => {
            show_loader(true);
        });
    }



    testEmailPopup = (id) => {
        /*document.getElementById("user_test_email").value = "";*/

        let emails =[];
            this.state.listTestEmails.forEach((value,key)=>{
                emails.push({email:value.email,status:true});
        });
        this.setState(()=>({template_id:id,test_email:"",listTestEmails: emails}));

        document.getElementById("testEmailPopup").style.display = "block";
    };

    closePopup = () => {
        this.setState(()=>({template_id:"",test_email:""}));
        /*document.getElementById("user_test_email").value = "";*/
        document.getElementById("testEmailPopup").style.display = "none";
    };

    sendTestEmail = () => {

            let emails = [];
            this.state.listTestEmails.forEach((value,key)=>{
               if(value.status == true) {
                   emails.push(value.email);
               }
            });
            show_loader();
            axios.post(BaseUrl + '/api/sendTestEmail',{template_id:this.state.template_id,email:emails,venue_id:VenueID})

                .then(res => {
                    this.setState(()=>({template_id:"",test_email:""}));
                    document.getElementById("testEmailPopup").style.display = "none";
                    NotificationManager.success("Email Sent Successfully", 'Success');
                    show_loader(true);
                }).catch((err) => {
                show_loader(true);
                NotificationManager.error("Error occurred while sending email.Please try again.", 'Error');
            });

    };

    getTestEmail = () => {
            axios.post(BaseUrl + '/api/testEmailsSmsApp',{venue_id:VenueID,company_id:CompanyID})
                .then(res => {
                    let email = [];

                    res.data.data.recipient_email.map((value,key)=>{
                        email.push({email:value,status:true});
                    });
                    this.setState(()=>({listTestEmails:email}),()=>{

                    });

                }).catch((err) => {

            });
    };

    deleteTemplate = (value) => this.setState(() => ({deleteTemplate: value.id}));

    handleCloseModal = () => this.setState(() => ({deleteTemplate: 0}));

    handleDelete = () => {
        let templateID = this.state.deleteTemplate;
        this.setState({deleteTemplate: 0});
        show_loader();
        axios.delete(`${BaseUrl}/api/delete-template/${templateID}`)
            .then((response) => {
                show_loader();
                if (response.data.status === true){
                    NotificationManager.success(response.data.message, 'Success');
                    //this.loadVideos();
                    this.loadTemplates();
                } else
                    NotificationManager.error('Error occurred while deleting template.', 'Error');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDelete() .....//



    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        this.setState({offset: offset}, () => {
            this.loadTemplates();
        });
    };

    openPopup = (id) => {
        this.setState(()=>({preview_template_id: id}),()=>{
            this.NewsCatPopup.style.display = "block";
        });

    };

    closePrivewPopup = () => {
        this.setState(()=>({preview_template_id: 0}),()=>{

            this.NewsCatPopup.style.display = "none";
        });

    };

    is_featured = (value,key) => {

        let emails = this.state.listTestEmails;
        emails[key]['status'] = !value;
        this.setState(()=>({listTestEmails:emails}));

        let totalEnable = emails.filter((val,key)=>{
           return val.status == true;
        });

        if(totalEnable.length > 0)
            $("#send_email_test_btn").removeClass("disabled");
        else
            $("#send_email_test_btn").addClass("disabled");

    };//..... end of is_featured() .....//


    render() {
        return (
            <React.Fragment>
                <div className="compaign_addNew clearfix">
                    <a  style={{cursor:'pointer'}}  className="all_blue_button" onClick={()=>{this.props.changePage("create_template")}}>Create Templates</a>
                    <a  style={{cursor:'pointer',marginRight:'5px'}}  className="all_blue_button"onClick={()=>{this.props.changePage("create_template2")}}>Create Template (Drag & Drop)</a>
                </div>

                <ul style={{}} className="listStyle">
                    {this.state.htmlTemplate.length > 0 && (
                        this.state.htmlTemplate.map((value,key)=>{
                            return (
                                <li style={{position:"relative"}} key={key}>
                                    {(appPermission("Email Builder","delete") || value.created_by == UserId) && (
                                        <small onClick={()=>{this.deleteTemplate(value)}} style={{cursor:"pointer",fontSize:'12px', color:'red !important', position:'absolute', left:'11px', top:'1px', display:'block',zIndex:"1",padding:"2px 5px",borderRadius:'3px',background:"#ffffff"}}>X</small>
                                    )}
                                    {/*<iframe frameborder="0"  title="templates" className="templates" src={BaseUrl+"/list-emails/"+value.id} name={"frame_"+value.id} style={{width:'290px', height:'350px', border: '2px solid lightgrey',padding:"2px"}} id={"id_"+value.id} />*/}
                                    <div className="wrap_iframe">
                                        <iframe className="frame_iframe"
                                                src={BaseUrl+"/list-emails/"+value.id}></iframe>
                                    </div>
                                    {/*<div className="innerData" style={{minHeight:"350px",maxHeight:"350px",overflow:"auto"}}>{ReactHtmlParser(value.html)}</div>*/}
                                    <div className="continueCancel  listShops">
                                        <a style={{margin: "3px 45px auto"}}  href="javascript:void(0)" className="selecCompaignBttn" onClick={()=>{this.openPopup(value.id)}}>Preview</a>
                                        {(appPermission("Email Builder","edit")) && (
                                            <a style={{margin: "3px 45px auto"}}  href="javascript:void(0)" className="selecCompaignBttn" onClick={()=>{this.selectTemplate(value.id)}}>Edit</a>
                                        )}
                                        <a style={{margin: "3px 45px auto"}}  href="javascript:void(0)" className="selecCompaignBttn" onClick={()=>{this.testEmailPopup(value.id)}}>Test Email</a>


                                    </div>

                                </li>
                            )
                        })
                    )}
                </ul>

                <div className= "popups_outer" id="testEmailPopup" style={{display: 'none'}}>
                    <div className="popups_inner">
                        <div className="overley_popup" data-attr="addNewUser_popup" onClick={()=>this.closePopup()}></div>
                        <div className="popupDiv2">
                            <div className="popupDiv_detail">
                                <div className="popup_heading clearfix">
                                    <h3>Send Test Email</h3>
                                    <a href="javascript:void(0)" data-attr="addNewUser_popup" className="popupClose close_popup" onClick={()=>this.closePopup()}>&nbsp;</a>
                                </div>

                                <div className="beacon_popupDeatail"> <br /><br />
                                    <div className="beacon_popup_form">
                                        <div className="venueIdentification_form">
                                            <ul>
                                                <li>
                                                    <label>Do you want to send test email ?</label>
                                                </li>
                                                {this.state.listTestEmails.map((val,key)=>{

                                                    return (
                                                        <li>
                                                            <div >
                                                            <span className="cL_rowList_number" style={{fontSize:'13px', fontWeight:'bold'}}>
                                                               <input type="checkbox" checked={val.status} onClick={()=>{this.is_featured(val.status,key)}} /> {val.email}
                                                            </span>
                                                            </div>
                                                        </li>
                                                    )
                                                })}

                                            </ul>
                                        </div>
                                    </div>

                                    <div className="continueCancel place_beacon createUserButtons">
                                        <a  className="selecCompaignBttn save_category" id="send_email_test_btn" style={{cursor:"pointer"}} onClick={(e)=>{this.sendTestEmail()}} >Send Email</a>
                                        <a href="javascript:void(0)" className="close_popup" style={{cursor:"pointer"}} onClick={()=>this.closePopup()}>CANCEL</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="campLstng_paginaton_out">
                    <div className="campLstng_paginaton_inn">
                        <ReactPaginate previousLabel={""}
                                       nextLabel={""}
                                       nextLinkClassName={'campPagi_next'}
                                       breakLabel={<a href="">...</a>}
                                       breakClassName={"break-me"}
                                       pageCount={this.state.pageCount}
                                       marginPagesDisplayed={2}
                                       pageRangeDisplayed={5}
                                       previousLinkClassName={'campPagi_prev'}
                                       onPageChange={this.handlePageClick}
                                       activeClassName={"active"}/>
                    </div>

                </div>


                <div className= "popups_outer" ref={(ref)=>{this.NewsCatPopup = ref}} style={{display: 'none'}}>
                    <div className="popups_inner">
                        <div className="overley_popup" data-attr="addNewUser_popup" onClick={()=>this.closePrivewPopup()}></div>
                        <div className="popupDiv3">
                            <div className="popupDiv_detail">
                                <div className="popup_heading clearfix">
                                    <h3>Email Preview</h3>
                                    <a href="javascript:void(0)" data-attr="addNewUser_popup" className="popupClose close_popup" onClick={()=>this.closePrivewPopup()}>&nbsp;</a>
                                </div>

                                <div className="beacon_popupDeatail3">
                                    <div className="beacon_popup_form">
                                        <div className="venueIdentification_form" style={{height:"calc(100vh - 100px)"}}>
                                            <ul style={{height:"100%"}}>
                                                <li style={{height:"100%"}} >
                                                    <iframe src={BaseUrl+"/list-email-view/"+this.state.preview_template_id+"?venue_id="+VenueID} frameBorder="0"
                                                            style={{overflow:"hidden",height:"",width:"100%"}}
                                                            width="100%"></iframe>

                                                </li>

                                            </ul>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>







                <ConfirmationModal isOpen={!!this.state.deleteTemplate} handleCloseModal={this.handleCloseModal} text={'Email Template'} handleDeleteItem={this.handleDelete}/>
            </React.Fragment>
        )
    }
}