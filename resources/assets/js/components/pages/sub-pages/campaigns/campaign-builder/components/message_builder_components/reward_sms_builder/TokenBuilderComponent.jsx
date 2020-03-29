import React, {Component} from 'react';
import TagsComponent from "../alert_sms_builder/TagsComponent";
import { Droppable } from 'react-drag-and-drop';
import {NotificationManager} from 'react-notifications';
import {connect} from "react-redux";
import {addMessageBuilderValue} from "../../../../../../../redux/actions/CampaignBuilderActions";
import {
    selectMessage, selectMessageBuilderObject, selectTokens
} from "../../../../../../../redux/selectors/Selectors";

class TokenBuilderComponent extends Component {

    smsNumbers = null;
    state = { testNumbers:'',smsPopup:true};

    setMessage = (message) => {
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, message}}));
    };//..... end of setMessage() .....//

    setVenueName = (message) => {
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, venue_name:message}}));
    };//..... end of setVenueName() .....//

    onDrop = (data) => {
        let message = this.props.message;

        message += "|"+data.tags+"|";

        this.setMessage(message);
    };//..... end of onDrop() .....//

    quantityUp = (key) => {
        let prevValue = this.props.messageBuilder.other.content.tokens ? this.props.messageBuilder.other.content.tokens[key] : 0;
        let val = parseInt(prevValue);
        let result = (isFinite(val)) ? ++val : 0;
        this.setRewardPoints(result, key);
    };//..... end of quantityUp() .....//

    quantityDown = (key) => {
        let prevValue = this.props.messageBuilder.other.content.tokens ? this.props.messageBuilder.other.content.tokens[key] : 0;
        let val = parseInt(prevValue);
        let result = isFinite(val) ? (val <= 0 ? 0 : --val) : 0;
        this.setRewardPoints(result, key);
    };//..... end of quantityDown() .....//

    setRewardPoints = (value, key) => {
        let obj = this.props.messageBuilder;
        if (obj.other.content.tokens)
            obj.other.content.tokens[key] = value;
        else
            obj.other.content.tokens = {[key]: value};

        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...obj}}));
    };//..... end of setRewardPoints() ....//

    sendTestMessage = () => {
        if(this.props.messageBuilder.message === "") {
            NotificationManager.error("Please provide some text in message box.", 'Error');
            return false;
        }//..... end if() .....//
        if(this.props.currentChannel === 'sms' && this.state.smsPopup){
            this.smsNumbers.style.display = "block";
            return false;
        }
        if(this.props.currentChannel === 'sms'){
            this.smsNumbers.style.display = "none";
        }

        axios.post(BaseUrl + '/api/send-test',{mobile:this.state.testNumbers,venue_id:23020,'current_channel':this.props.currentChannel,channel_data:this.props.messageBuilder})
            .then(res => {

                if(JSON.parse(res.data) === true){
                    this.setState(()=>({smsPopup:true,testNumbers:''}),()=>{});
                    NotificationManager.success('Test is sent successfully', 'Success');
                }
                else{
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

    render() {
        return (
            <div className="messageBuilder_outer ">
                <div className="messageBuilder_heading">
                    <h3>Tokens Reward Builder</h3>
                    <br/>
                    <p>Specify token reward for your campaign and the period which it can be redeemed.</p>
                </div>
                <div className="voucher_counter">
                    <div className="dropSegmentation_section">
                        <div className="dropSegmentation_heading clearfix">
                            <h3>Tokens</h3>
                        </div>
                        <div className="voucher_counter_info">
                            <label>I want to reward Tokens</label>
                            <div className="reward_counter">
                                <div className="fieldIncremnt">
                                    <div className="quantity clearfix">
                                        <input min="1" step="1" type="number" onChange={e => this.setRewardPoints(e.target.value, "tokens")} value={this.props.tokens}/>
                                        <div className="quantity-nav">
                                            <div className="quantity-button quantity-up" onClick={(e)=>{this.quantityUp("tokens")}}>&nbsp;</div>
                                            <div className="quantity-button quantity-down" onClick={(e)=>{this.quantityDown("tokens")}}>&nbsp;</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pushNotification_section clearfix">
                    <div className="phone_preview_column">
                        <div className="phone_section_preview">
                            <div className="phone_preview">
                                <span><img src="assets/images/phone_previewImg.png" alt="#"/></span>
                                <div className="txtPush_previewMob_posBox">
                                    <div className="txtPush_previewMob_posBoxInnr">
                                        <div className="txtPush_previewMob_posBoxTitle clearfix">
                                            <h3 style={{width: '100%', fontFamily: 'Roboto'}}>{this.props.messageBuilder.venue_name}</h3>
                                        </div>
                                        <div className="txtPush_previewMob_posBoxDetail">
                                            <p style={{fontFamily: 'Roboto'}}>{this.props.message}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sendTest_bttn">
                                <a  style={{cursor:'pointer'}} onClick={this.sendTestMessage}>SEND TEST</a>
                            </div>
                        </div>
                    </div>
                    <div className="smsDetail_column">
                        <div className="segment_heading segmentaxn_heading">
                            <h3>PRIMARY MESSAGE</h3>
                        </div>
                        <div className="smsDetail_inner">
                            <div className="newSegment_form">
                                <ul>
                                    <li>
                                        <label>SENDER</label>
                                        <div className="segmentInput">
                                            <input placeholder={this.props.messageBuilder.venue_name} value={this.props.messageBuilder.venue_name} onChange={(e)=> this.setVenueName(e.target.value)} type="text"/>
                                        </div>
                                    </li>
                                    <li>
                                        <label>MESSAGE</label>
                                        <div className="segmentInput segmentARea subtitleArea">
                                            <Droppable types={['tags']} onDrop={this.onDrop.bind(this)}>
                                                <textarea placeholder="Type Here" value={this.props.message} onChange={(e)=> {this.setMessage(e.target.value)}}></textarea>
                                            </Droppable>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="unsubcribeMsg">
                            <label>Unsubscribe message</label>
                            <p>To opt-out send STOP to XXXXXXXXXX</p>
                            <div className="charector_counters clearfix">
                                <small>Estimated Messages</small>
                                <h4 className="perMember">1/ <i>per <br />member</i></h4>
                            </div>
                        </div>
                    </div>
                    <TagsComponent {...this.props} />
                </div>
                <br /><br /><br /><br />
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
                                        <div className="venueIdentification_form">
                                            <ul>
                                                <li>
                                                    <label>Enter Test Numbers</label>
                                                    <div className="customInput_div">
                                                        <input  defaultValue={this.state.testNumbers}  onChange={(e)=>{ this.setState({testNumbers:  e.target.value})}}  placeholder="Enter Phone Numbers" className='digitalNumbers' type="text" />
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="continueCancel place_beacon createUserButtons">
                                        <input className={this.state.testNumbers !="" ? "selecCompaignBttn save_category" : "selecCompaignBttn save_category disabled" } defaultValue="SEND" onClick={this.testConfirm} type="submit"  />
                                        <a  style={{cursor:'pointer'}} className="close_popup" onClick={()=>this.closePopup()}>CANCEL</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of PointBuilderComponent.

const mapStateToProps = (state) => {
    return {
        messageBuilder  : selectMessageBuilderObject(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        currentChannel  : state.campaignBuilder.currentChannel,
        message         : selectMessage(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        tokens          : selectTokens(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
    };
};
export default connect(mapStateToProps)(TokenBuilderComponent);