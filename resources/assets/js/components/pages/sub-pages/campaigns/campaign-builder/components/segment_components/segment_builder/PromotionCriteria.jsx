import React, {Component} from 'react';
import { Draggable } from 'react-drag-and-drop';
import {find} from 'lodash';

class PromotionCriteria extends Component {
    promotionCriteriaList = ['voucher_expiry', 'voucher_status', 'punch_card_status', 'token_not_used',"token_used_in_charity","token_used"];
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <li>
             <a className="accordianIcons clickAccordian "  style={{cursor:'pointer'}}>
                    <b>&nbsp;</b>
                    <small>Promotions</small>
                </a>
                <div className="showAccordian_data clickAccordian_show" >
                    {this.props.checkSegmentCriteria('Promotion Criteria','voucher_expiry') && (
                        <Draggable type="tags" data="voucher_expiry">
                            <div className={find(this.props.criterias, {name: 'voucher_expiry'})  || find(this.props.criterias, function(o) { return this.promotionCriteriaList.indexOf(o.name) !== -1 }.bind(this))  ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'voucher_expiryCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('voucher_expiry')} >
                                <h4>Voucher Expiry</h4>
                            </div>
                        </Draggable>
                    )}
                    {this.props.checkSegmentCriteria('Promotion Criteria','voucher_status') && (
                        <Draggable type="tags" data="voucher_status">
                            <div className={find(this.props.criterias, {name: 'voucher_status'})  || find(this.props.criterias, function(o) { return this.promotionCriteriaList.indexOf(o.name) !== -1 }.bind(this)) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'voucher_statusCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('voucher_status')} >
                                <h4>Voucher Status</h4>
                            </div>
                        </Draggable>
                    )}
                    {this.props.checkSegmentCriteria('Promotion Criteria','punch_card_status') && (
                        <Draggable type="tags" data="punch_card_status">
                            <div className={find(this.props.criterias, {name: 'punch_card_status'})  || find(this.props.criterias, function(o) { return this.promotionCriteriaList.indexOf(o.name) !== -1 }.bind(this)) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'punch_card_statusCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('punch_card_status')} >
                                <h4>Punch Card Status</h4>
                            </div>
                        </Draggable>
                    )}
                    {this.props.checkSegmentCriteria('Promotion Criteria','token_not_used') && (
                        <Draggable type="tags" data="token_not_used">
                            <div className={find(this.props.criterias, {name: 'token_not_used'})  || find(this.props.criterias, function(o) { return this.promotionCriteriaList.indexOf(o.name) !== -1 }.bind(this)) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'token_not_usedCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('token_not_used')} >
                                <h4>Token Not Used</h4>
                            </div>
                        </Draggable>
                    )}
                    {this.props.checkSegmentCriteria('Promotion Criteria','token_used_in_charity') && (
                        <Draggable type="tags" data="token_used_in_charity">
                            <div className={find(this.props.criterias, {name: 'token_used_in_charity'})  || find(this.props.criterias, function(o) { return this.promotionCriteriaList.indexOf(o.name) !== -1 }.bind(this)) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'token_used_in_charityCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('token_used_in_charity')} >
                                <h4>Token Used in Charity</h4>
                            </div>
                        </Draggable>
                    )}
                    {this.props.checkSegmentCriteria('Promotion Criteria','token_used') && (
                        <Draggable type="tags" data="token_used">
                            <div className={find(this.props.criterias, {name: 'token_used'})  || find(this.props.criterias, function(o) { return this.promotionCriteriaList.indexOf(o.name) !== -1 }.bind(this)) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'token_usedCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('token_used')} >
                                <h4>Token Used</h4>
                            </div>
                        </Draggable>
                    )}
                    {this.props.checkSegmentCriteria('Promotion Criteria','completed_survey') && (
                        <Draggable type="tags" data="completed_survey">
                            <div className={find(this.props.criterias, {name: 'completed_survey'})  || find(this.props.criterias, function(o) { return this.promotionCriteriaList.indexOf(o.name) !== -1 }.bind(this)) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'completed_surveyCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('completed_survey')} >
                                <h4>Completed Survey</h4>
                            </div>
                        </Draggable>
                    )}
                    {this.props.checkSegmentCriteria('Promotion Criteria','seen_videos') && (
                        <Draggable type="tags" data="seen_videos">
                            <div className={find(this.props.criterias, {name: 'seen_videos'})  || find(this.props.criterias, function(o) { return this.promotionCriteriaList.indexOf(o.name) !== -1 }.bind(this)) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'seen_videosCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('seen_videos')} >
                                <h4>Seen Videos</h4>
                            </div>
                        </Draggable>
                    )}

                    {this.props.checkSegmentCriteria('Promotion Criteria','campaign_triggers') && (
                        <Draggable type="tags" data="campaign_triggers">
                            <div className={find(this.props.criterias, {name: 'campaign_triggers'})  || find(this.props.criterias, function(o) { return this.promotionCriteriaList.indexOf(o.name) !== -1 }.bind(this)) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'campaign_triggersCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('campaign_triggers')} >
                                <h4>Campaign Triggers</h4>
                            </div>
                        </Draggable>
                    )}




                </div>
            </li>
        );
    }//..... end of render() .....//
}//..... end of MembershipCriteria.

export default PromotionCriteria;