import React, {Component} from 'react';
import { Draggable } from 'react-drag-and-drop';
import {find} from 'lodash';

class MissionCriteria extends Component {
    missionCriteriaList = ['scan_qr_code', 'user_sign_up', 'user_gps_detect', 'user_optional_field','transaction_amount','referral_user'];
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <li>
                <a className="accordianIcons clickAccordian "  style={{cursor:'pointer'}}>
                    <b>&nbsp;</b>
                    <small>Mission Criteria</small>
                </a>
                <div className="showAccordian_data clickAccordian_show" >
                    {this.props.checkSegmentCriteria('Mission Criteria','scan_qr_code') && (
                    <Draggable type="tags" data="scan_qr_code">
                        <div className={find(this.props.criterias, {name: 'scan_qr_code'})  || find(this.props.criterias, function(o) { return this.missionCriteriaList.indexOf(o.name) !== -1 }.bind(this))  ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'scan_qr_codeCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('scan_qr_code')} >
                            <h4>Scan QR Code</h4>
                        </div>
                    </Draggable>
                    )}
                    {this.props.checkSegmentCriteria('Mission Criteria','user_sign_up') && (
                    <Draggable type="tags" data="user_sign_up">
                        <div className={find(this.props.criterias, {name: 'user_sign_up'})  || find(this.props.criterias, function(o) { return this.missionCriteriaList.indexOf(o.name) !== -1 }.bind(this)) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'user_sign_upCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('user_sign_up')} >
                            <h4>Sign Up</h4>
                        </div>
                    </Draggable>
                    )}
                    {this.props.checkSegmentCriteria('Mission Criteria','user_gps_detect') && (
                    <Draggable type="tags" data="user_gps_detect">
                        <div className={find(this.props.criterias, {name: 'user_gps_detect'})  || find(this.props.criterias, function(o) { return this.missionCriteriaList.indexOf(o.name) !== -1 }.bind(this)) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'user_gps_detectCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('user_gps_detect')} >
                            <h4>GPS</h4>
                        </div>
                    </Draggable>
                    )}
                    {this.props.checkSegmentCriteria('Mission Criteria','user_optional_field') && (
                    <Draggable type="tags" data="user_optional_field">
                        <div className={find(this.props.criterias, {name: 'user_optional_field'})  || find(this.props.criterias, function(o) { return this.missionCriteriaList.indexOf(o.name) !== -1 }.bind(this)) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'user_optional_fieldCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('user_optional_field')} >
                            <h4>Optional Fields Filling</h4>
                        </div>
                    </Draggable>
                    )}
                    {this.props.checkSegmentCriteria('Mission Criteria','transaction_amount') && (
                    <Draggable type="tags" data="transaction_amount">
                        <div className={find(this.props.criterias, {name: 'transaction_amount'})  || find(this.props.criterias, function(o) { return this.missionCriteriaList.indexOf(o.name) !== -1 }.bind(this)) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'transaction_amountCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('transaction_amount')} >
                            <h4>Transaction Amount</h4>
                        </div>
                    </Draggable>
                    )}
                    {this.props.checkSegmentCriteria('Mission Criteria','referral_user') && (
                    <Draggable type="tags" data="referral_user">
                        <div className={find(this.props.criterias, {name: 'referral_user'})  || find(this.props.criterias, function(o) { return this.missionCriteriaList.indexOf(o.name) !== -1 }.bind(this)) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'referral_userCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('referral_user')} >
                            <h4>Referred User</h4>
                        </div>
                    </Draggable>
                    )}

                </div>
            </li>
        );
    }//..... end of render() .....//
}//..... end of MembershipCriteria.

export default MissionCriteria;