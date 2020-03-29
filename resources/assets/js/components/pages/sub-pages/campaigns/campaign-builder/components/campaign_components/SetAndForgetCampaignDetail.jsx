import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {connect} from "react-redux";
import {addCampaignValue} from "../../../../../../redux/actions/CampaignBuilderActions";

class SetAndForgetCampaignDetail extends Component {
    currentTab = this.props.currentTab;
    triggers   = {'birthday': 'Birthday',
                    "last_visit_date": 'Last Visit Date',
                    "new_member": 'New Member',
                    "inactivity": 'Inactivity',
                    /*"mycash_expiry": 'MyCash Expiry', "membership_renewal": 'Membership Renewal',"rating_grade_change": 'Rating Grade Change',
                    "imminent": 'Imminent Rating Grade Change', "gaming_turnover": 'Gaming Turnover',"pos_turnover": 'Pos Turnover',"referral_by":"Referral BY"*/
                     };

    dropDownLabelRef     = null;
    dropDownUlRef        = null;
    triggerDetailsTabRef = null;

    quantityUp = () => {
        let value = this.props.campaign.trigger_value;
        this.props.dispatch( addCampaignValue({trigger_value: ++value}) )
    };//..... end of quantityUp() ....//

    quantityDown = () => {
        let value = this.props.campaign.trigger_value;
        if(value >= 1)
            this.props.dispatch( addCampaignValue({trigger_value: --value}) )
    };//..... end of quantityDown() .....//

    setTrigger = (e,type) => {
        this.props.dispatch(addCampaignValue({trigger_type: type}));
        if(type!='referral_by')
        this.triggerDetailsTabRef.classList.remove('hidden', 'disabled');

        this.dropDownUlRef.style.display = 'none';
        this.dropDownLabelRef.classList.remove('changeAero');
    };//..... end of setTrigger() ....//

    handleDropDownSpanClick = (e) => {
        e.target.classList.toggle('changeAero');

        this.dropDownUlRef.style.display = (this.dropDownUlRef.style.display === 'none') ? 'block' : 'none';

        e.target.classList.contains('changeAero')
            ? this.triggerDetailsTabRef.classList.add('disabled')
            : this.triggerDetailsTabRef.classList.remove('disabled');
    };//..... end of handleDropDownSpanClick() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div>
                <div className="compaign_segments">
                    <div className="segment_tYpe">
                        <div className="segment_tYpe_heading">
                            <h3>CAMPAIGN DETAILS</h3>
                        </div>
                        <div className="segment_tYpe_detail">
                            <div className="selectDescription">
                                <p>Name and describe your new campaign in a way that will make sense to other staff at your site. Your members will not see these details. Your description should describe exactly what you want to achieve from your campaign. You must complete both fields to continue.</p>
                            </div>

                            <div className="newSegment_form">
                                <ul>
                                    <li>
                                        <label>Campaign Name:</label>
                                        <div className="segmentInput">
                                            <input type="text" placeholder="Campaign Name" onChange={(e)=>{this.props.dispatch(addCampaignValue({name: e.target.value}))}} value={this.props.campaign.name}/>
                                        </div>
                                    </li>
                                    <li>
                                        <label>Campaign Description:</label>
                                        <div className="segmentInput segmentARea">
                                            <textarea style={{fontFamily: "'Roboto', sans-serif"}} placeholder="Campaign Description" onChange={(e)=>{this.props.dispatch(addCampaignValue({detail: e.target.value}))}} value={this.props.campaign.detail}></textarea>
                                        </div>
                                    </li>
                                </ul>
                            </div>


                            {/*<div className={'trigger_amount clearfix'}>
                                <label>Stop this campaign if triggered X amount of time.</label>
                                <div className={'segmentInput'}>
                                    <input placeholder={'Leave blank for no limit'} type="number"  onChange={(e)=>{this.props.dispatch(addCampaignValue({trigger_amount: e.target.value}))}} value={this.props.campaign.trigger_amount}/>
                                </div>
                            </div>*/}
                            <div className={'trigger_amount clearfix'}>
                            </div>


                            <br/>
                            <br/>

                            <div className="forget_trigger_segment clearfix" style={{marginLeft: '-22px', marginTop: '30px'}}>
                                <div className="forgetColumn">
                                    <div className="segment_tYpe" style={{minHeight: "210px"}}>
                                        <div className="segment_tYpe_heading">
                                            <h3>SET &amp; FORGET TRIGGER</h3>
                                        </div>
                                        <div className="segment_tYpe_detail">
                                            <div className="selectDescription">
                                                <p>Choose your Set &amp; Forget Trigger and trigger criteria. You must define both to continue.</p>
                                            </div>
                                            <div className="newSegment_form">
                                                <ul>
                                                    <li>
                                                        <label>Set &amp; Forget Trigger</label>
                                                        <div className="customDropDown">
                                                            <span ref={(ref) => this.dropDownLabelRef = ref} onClick={this.handleDropDownSpanClick}> {this.props.campaign.trigger_type ? this.triggers[this.props.campaign.trigger_type] : 'Select Trigger'}</span>
                                                            <ul className="customDropDown_show triggersType customPlaceHolder" ref={(ref) => this.dropDownUlRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                                                <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                                    {Object.keys(this.triggers).map((key) => {
                                                                        return <li key={key} onClick={(e)=> {this.setTrigger(e, key)}} className={this.props.campaign.trigger_type === key ? 'selectedItem' : ''}>{this.triggers[key]}</li>;
                                                                    })}
                                                                </Scrollbars>
                                                            </ul>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="forgetColumn fr_birthday">

                                    <div className={(this.props.campaign.trigger_type === "" || this.props.campaign.trigger_type == 'referral_by') ? "hidden segment_tYpe triggerDetailsTab": "segment_tYpe triggerDetailsTab"} ref={(ref) => this.triggerDetailsTabRef = ref} style={{minHeight: "210px"}}>
                                        <div className="segment_tYpe_heading">
                                            <h3>{this.triggers[this.props.campaign.trigger_type]} TRIGGER DETAILS</h3>
                                        </div>
                                        <div className="segment_tYpe_detail">
                                            <div className="selectDescription">
                                                <p>Define the specific trigger criteria for your Set &amp; Forget campaign.</p>
                                            </div>
                                            <div className="birthdayCounter clearfix">
                                                <div className="recentTicket_incrimenter clearfix">
                                                    <label>Members {this.triggers[this.props.campaign.trigger_type]} is in</label>
                                                    <div className="fieldIncremnt">
                                                        <div className="quantity clearfix">
                                                            <input min="1" step="1" type="number" onChange={(e)=>{ this.props.dispatch( addCampaignValue({trigger_value: parseInt(e.target.value)}) ) }} value={this.props.campaign.trigger_value}/>
                                                            <div className="quantity-nav">
                                                                <div className="quantity-button quantity-up" onClick={this.quantityUp}>&nbsp;</div>
                                                                <div className="quantity-button quantity-down" onClick={this.quantityDown}>&nbsp;</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <label>days time.</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>







                </div>

                <div className="continueCancel">
                    <input type="submit" value="CONTINUE" onClick={(e) => { this.props.setCurrentTab((++this.currentTab)+2) }} className={(this.props.campaign.trigger_type !== 'referral_by')?(this.props.campaign.name === '' || this.props.campaign.detail === '' || this.props.campaign.trigger_type === "" || this.props.campaign.trigger_value === "") ? 'disabled selecCompaignBttn' : 'selecCompaignBttn':(this.props.campaign.name === '' || this.props.campaign.detail === '' || this.props.campaign.trigger_type === "" ) ? 'disabled selecCompaignBttn' : 'selecCompaignBttn'}/>
                    <a href="#">CANCEL</a>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of SetAndForgetCampaignDetail.

const mapStateToProps = (state) => {
    return {
        campaign: state.campaignBuilder.campaign,
        currentTab: state.campaignBuilder.selectedTab,
    };
};
export default connect(mapStateToProps)(SetAndForgetCampaignDetail);