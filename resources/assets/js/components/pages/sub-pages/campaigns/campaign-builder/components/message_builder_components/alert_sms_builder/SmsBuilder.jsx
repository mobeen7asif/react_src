import React, {Component} from 'react';
import TagsComponent from "./TagsComponent";
import TextComponent from "./TextComponent";
import ImageComponent from "./ImageComponent";
import VideoComponent from "./VideoComponent";
import UrlComponent from "./UrlComponent";
import {NotificationManager} from 'react-notifications';
import {connect} from "react-redux";
import {selectMessageBuilderObject} from "../../../../../../../redux/selectors/Selectors";
import {setAlertMessageBuilderType} from "../../../../../../../redux/actions/CampaignBuilderActions";

class SmsBuilder extends Component {
    smsNumbers = null;
    constructor(props) {
        super(props);
        this.state = { testNumbers:'',smsPopup:true,listTestSms:[],listTestPush:[]};


    }//..... end of constructor() .....//

    componentDidMount = () => {
        this.getTestSmsNumbers();
        if (this.props.messageBuilder.type === '')
            this.props.dispatch(setAlertMessageBuilderType(this.props.currentChannel,'text'));
    };//.... end of componentDidMount() .....//

    getTestSmsNumbers = () => {
        axios.post(BaseUrl + '/api/testEmailsSmsApp',{venue_id:VenueID,company_id:CompanyID})
            .then(res => {
                let sms = [];
                let push = [];

                res.data.data.mobile.map((value,key)=>{
                    sms.push({sms:value,status:true});

                });
                res.data.data.application_recipient.map((value,key)=>{
                    push.push({token:value,status:true});
                });
                this.setState(()=>({listTestSms:sms,listTestPush:push,testNumbers: sms[0].sms}),()=>{

                });

            }).catch((err) => {

        });


    };

    getMessageComponent = () => {

        switch (this.props.messageBuilder.type){
            case 'text':
                return <TextComponent/>;
            case 'image':
                return <ImageComponent/>;
            case 'video':
                return <VideoComponent/>;
            case 'url':
                return  <UrlComponent/>;
            case 'nooutcome':
                return  <UrlComponent/>;
            default:
                return "View not found.";
        }//..... end of switch() .....//
    };//..... end of getMessageComponent() .....//

    sendTestMessage = () => {
        let message = "";
        switch (this.props.messageBuilder.type){
            case 'text': {
                if(this.props.messageBuilder.message == ""){
                    message = "Please enter some text to send test !"; break;
                }else{ message = ""; break;}
            }
            case 'image': {
                if(this.props.messageBuilder.message == ""){
                    message = "Please enter some text to send image message !"; break;
                }else if(this.props.messageBuilder.resource == ""){
                    message = "Please select image to send image message !"; break;
                }else{ message = ""; break;}
            }
            case 'video': {
                if(this.props.messageBuilder.message == ""){
                    message = "Please enter some text to send video message !"; break;
                }else if(this.props.messageBuilder.resource == ""){
                    message = "Please select video to send video message !"; break;
                }else{ message = ""; break;}
            }
            case 'url': {
                if(this.props.messageBuilder.message == ""){
                    message = "Please enter some text to send website url !"; break;
                }else if(this.props.messageBuilder.other.url == ""){
                    message = "Please enter website url to send test !"; break;
                }else{ message = ""; break;}
            }
            default:{
                message = "";
                break;
            }

        }//..... end of switch() .....//
        if(message != ""){
            NotificationManager.error(message, 'Error');
            return false;
        }
        if(this.props.currentChannel === 'sms' && this.state.smsPopup){
            this.smsNumbers.style.display = "block";
            let sms =[];
            this.state.listTestSms.forEach((value,key)=>{
                sms.push({sms:value.sms,status:true});
            });
            return false;
        }
        if(this.props.currentChannel === 'sms'){
            this.smsNumbers.style.display = "none";
        }
        if(this.props.currentChannel === 'push' && this.state.smsPopup){
            this.smsNumbers.style.display = "block";
            let push =[];
            this.state.listTestPush.forEach((value,key)=>{
                push.push({token:value.token,status:true});
            });
            return false;
        }
        if(this.props.currentChannel === 'push'){
            this.smsNumbers.style.display = "none";
        }

        let sms = [];
        let push = [];
        this.state.listTestSms.forEach((value,key)=>{
            if(value.status == true) {
                sms.push(value.sms);
            }
        });
        this.state.listTestPush.forEach((value,key)=>{
            if(value.status == true) {
                push.push(value.token);
            }
        });


        axios.post(BaseUrl + '/api/sendSms',{ mobile:sms,push:push,venue_id:VenueID,company_id:CompanyID,'current_channel':this.props.currentChannel,channel_data:this.props.messageBuilder})
            .then(res => {
                if(JSON.parse(res.data.status) === true) {
                    this.setState(()=>({smsPopup:true}),()=>{});

                    NotificationManager.success('Test is sent successfully', 'Success');
                }
                else {
                    this.setState(()=>({smsPopup:true}),()=>{});
                    NotificationManager.error('Test is Failed', 'Error');
                }
            }).catch((err) => {
            this.setState(()=>({smsPopup:true}),()=>{});
            NotificationManager.error('Error occurred while sending test.', 'Error');
        });

    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    closePopup = () => {
        this.smsNumbers.style.display = "none";
    };//--- End of closePopup() ---//

    testConfirm = () => {
        this.setState(()=>({smsPopup:false }),()=>{
            this.sendTestMessage();
        });
    };

    is_sms = (value,key) => {

        let sms = this.state.listTestSms;
        sms[key]['status'] = !value;
        this.setState(()=>({listTestSms:sms}));

        let totalEnable = sms.filter((val,key)=>{
            return val.status == true;
        });



    };//..... end of is_sms() .....//

    is_push = (value,key) => {

        let push = this.state.listTestPush;
        push[key]['status'] = !value;
        this.setState(()=>({listTestPush:push}));

        let totalEnable = push.filter((val,key)=>{
            return val.status == true;
        });



    };//..... end of is_sms() .....//


    render() {
        return (
            <div>
                {this.props.messageBuilder.type != "nooutcome" && (

                    <div className="messageBuilder_outer ">
                        <div className="messageBuilder_heading">
                            <h3>{ this.props.messageBuilder.type.charAt(0).toUpperCase() + this.props.messageBuilder.type.slice(1) } Push Notification Builder</h3>
                            <p>Use tags by dragging and dropping them into your message box.</p>

                        </div>
                        <div className="pushNotification_section clearfix">
                            <div className="phone_preview_column">
                                <div className="phone_section_preview">
                                    <div className="phone_preview">
                                <span>
                                    <img src="assets/images/phone_previewImg.png" alt="#"/>
                                </span>
                                        <div className="txtPush_previewMob_posBox">
                                            <div className="txtPush_previewMob_posBoxInnr">
                                                <div className="txtPush_previewMob_posBoxTitle clearfix">
                                                    <h3 style={{width:"100%", fontFamily: 'Roboto'}}>{this.props.messageBuilder.venue_name}</h3>
                                                </div>
                                                <div className="txtPush_previewMob_posBoxDetail" style={{maxHeight:245}}>
                                                    {(this.props.messageBuilder.type =='image' &&
                                                        <img src={BaseUrl+'/'+this.props.messageBuilder.resource} alt="" style={{height:100}}/>
                                                    )}

                                                    <p style={{fontFamily: 'Roboto'}}>{this.props.messageBuilder.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sendTest_bttn">
                                        <a  style={{cursor:'pointer'}} onClick={this.sendTestMessage}>SEND TEST</a>
                                    </div>
                                </div>
                            </div>
                            {this.getMessageComponent()}

                            <TagsComponent  {...this.props} />

                        </div>
                        <br/><br/><br/><br/>

                        <div className= "popups_outer addNewsCategoryPopup"  ref={(ref)=>{this.smsNumbers = ref}} style={{display: 'none',position:'fixed'}}>
                            <div className="popups_inner">
                                <div className="overley_popup" data-attr="addNewUser_popup" onClick={()=>this.closePopup()}></div>

                                <div className="popupDiv2">
                                    <div className="popupDiv_detail">

                                        <div className="popup_heading clearfix">
                                            <h3>Add Test Numbers</h3>
                                            <a  style={{cursor:'pointer'}} data-attr="addNewUser_popup" className="popupClose close_popup" onClick={()=>this.closePopup()}>&nbsp;</a>
                                        </div>


                                        <div className="beacon_popupDeatail"> <br /><br />
                                            <div className="beacon_popup_form">
                                                {(this.props.currentChannel === 'sms') && (
                                                    <div className="venueIdentification_form">
                                                        <ul>
                                                            <li>
                                                                <label>Do you want to send test Sms ?</label>
                                                            </li>
                                                            {this.state.listTestSms.map((val,key)=>{

                                                                return (
                                                                    <li>
                                                                        <div >
                                                            <span className="cL_rowList_number" style={{fontSize:'13px', fontWeight:'bold'}}>
                                                               <input type="checkbox" checked={val.status} onClick={()=>{this.is_sms(val.status,key)}} /> {val.sms}
                                                            </span>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            })}

                                                        </ul>
                                                    </div>
                                                )}


                                                {(this.props.currentChannel === 'push') && (
                                                    <div className="venueIdentification_form">
                                                        <ul>
                                                            <li>
                                                                <label>Do you want to send Push ?</label>
                                                            </li>
                                                            {this.state.listTestPush.map((val,key)=>{

                                                                return (
                                                                    <li>
                                                                        <div >
                                                            <span className="cL_rowList_number" style={{fontSize:'13px', fontWeight:'bold'}}>
                                                               <input type="checkbox" checked={val.status} onClick={()=>{this.is_push(val.status,key)}} /> {val.token}
                                                            </span>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            })}

                                                        </ul>
                                                    </div>
                                                )}

                                            </div>

                                            <div className="continueCancel place_beacon createUserButtons">
                                                <input className={this.state.testNumbers !="" ? "selecCompaignBttn save_category" : "selecCompaignBttn save_category disabled" } value="SEND" onClick={this.testConfirm} type="submit"  />
                                                <a  style={{cursor:'pointer'}} className="close_popup" onClick={()=>this.closePopup()}>CANCEL</a>
                                            </div>

                                        </div>




                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                )}
            </div>



        );
    }//..... end of render() .....//
}//..... end of TextComponent.

const mapStateToProps = (state) => {
    return {
        messageBuilder  : selectMessageBuilderObject(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        currentChannel  : state.campaignBuilder.currentChannel
    };
};
export default connect(mapStateToProps)(SmsBuilder);