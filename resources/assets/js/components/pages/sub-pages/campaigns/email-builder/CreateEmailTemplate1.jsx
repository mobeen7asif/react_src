import React, {Component} from 'react';
import EmailEditor from "react-email-editor";
import ReactHtmlParser from "react-html-parser";
import {NotificationManager} from "react-notifications";
export default class CreateEmailTemplate1 extends Component {
    state = {
        htmlTemplate : [],
        emailSubject:"",
        title:''
    };

    componentDidMount = () => {
        document.getElementById("title").value = "";

        setTimeout(()=>{
            this.loadTags();
        },5000);
    }

    loadTags = () => {
        let memberCustomFields= JSON.parse(localStorage.getItem('memberCustomFields'));
        let fields = [];
        memberCustomFields.forEach((value)=>{
            let val = "|custom_"+value.search_name+"|";
            fields.push({name:value.field_label.toUpperCase(),value:val})
        });
        this.editor.setMergeTags([
            {name: "First Name", value: "|FirstName| "},
            {name: "Last Name", value: "|LastName| "},
            {name: "Email", value: "|Email| "},
            {name: "Phone No", value: "|HomeTelephone| "},
            {name: "Mobile", value: "|Mobile| "},
            {name: "Venue Name", value: "|VenueName| "},
            {name: "Venue Address", value: "|VenueAddress| "},
            {name: "Venue Phone", value: "|VenuePhoneNo| "},
            {name: "Venue Twitter", value: "|twitter| "},
            {name: "Venue Facebook", value: "|facebook| "},
            {name: "Venue Instagram", value: "|instagram| "},
            ...fields
        ]);
    }


    saveTemplate = () =>{
        if(this.state.title === ""){
            NotificationManager.error("Provide a suitable name for template.", 'Error');
            return false;
        }else if(this.state.emailSubject ==""){
            NotificationManager.error("Email Subject is required.", 'Error');
            return false;
        }

        this.editor.exportHtml(data => {
            const { design, html } = data;
            let res = {body:design.body};
            show_loader();
            axios.post(BaseUrl + '/api/saveTemplate2',{id:this.props.template_id,data:JSON.stringify(res),html:html,...this.state,user_role:UserRole,user_id:UserId})
                .then(res => {
                    show_loader();
                    if(res.data.status){
                        this.props.changePage("list_template");
                    }

                }).catch((err) => {
                show_loader();
            });
        });
    };

    onLoad = () => {
        if(this.props.template_id){
            axios.post(BaseUrl + '/api/getTemplate',{id:this.props.template_id})
                .then(res => {
                    this.setState(()=>({htmlTemplate:res.data.data}));
                    document.getElementById("title").value = res.data.data.title;
                    let r = JSON.parse(res.data.data.design);
                    this.editor.loadDesign(r);

                    setTimeout(()=>{
                        this.loadTags();
                        this.applyCss();
                    },5000);

                }).catch((err) => {
            });
        }


    };





    render() {
        return (
            <div className="newVualt_container">
                <div className="newVualt_container_detail">

                    <div className="">
                        <div className="newVualt_detail" style={{background:"#f7f8f8"}}>
                            <div className="newVualt_heading_with_buttons clearfix">
                                <div className="newVualt_heading">
                                    <h3>Email Builder</h3>
                                </div>
                            </div>
                            <div className="categoryInfo_container clearfix ">
                                <div className=" primary_voucher_setting" style={{background:"#f7f8f8"}}>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Template Name</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input placeholder="Template Name..." type="text" id="title" value={this.state.title} onChange={(e)=>{this.setState({title:e.target.value})}} />
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Subject</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input placeholder="Template Subject..." type="text" value={this.state.emailSubject} onChange={(e)=>{this.setState({emailSubject:e.target.value})}}  />
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section holder" style={{border:"none"}} >

                                        <EmailEditor
                                            ref={editor => this.editor = editor}
                                            onLoad={this.onLoad}
                                        />


                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>

                    <br/>
                    <div className="bar" style={{height:"131px"}}></div>
                    <div className="continueCancel  listShops">
                        <a  style={{cursor:'pointer'}} className="" onClick={this.saveTemplate}>Save</a>
                        <a  style={{cursor:'pointer'}} className="close_punch_popup" onClick={() => {this.redirectToListing()}}>CANCEL</a>
                    </div>


                </div>




            </div>
        )
    }

}