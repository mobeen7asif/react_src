import React, {Component} from 'react';
import { Draggable } from 'react-drag-and-drop';
import {find} from 'lodash';

class GamingActivityCriteria extends Component {
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <li>
                <a className="accordianIcons clickAccordian"  style={{cursor:'pointer'}}>
                    <b>&nbsp;</b>
                    <small>Gaming Activity Criteria</small>
                </a>
                <div className="showAccordian_data clickAccordian_show">

                    <Draggable type="tags" data="gaming_player">
                        <div className={find(this.props.criterias, {name: 'gaming_player'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"} id={'gaming_playerCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('gaming_player')}>
                            <h4>Gaming Player</h4>
                        </div>
                    </Draggable>

                    <Draggable type="tags" data="gaming_turnover">
                        <div className={find(this.props.criterias, {name: 'gaming_turnover'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'gaming_turnoverCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('gaming_turnover')}>
                            <h4>Gaming Turnover</h4>
                        </div>
                    </Draggable>

                    <Draggable type="tags" data="gaming_spend">
                        <div className={find(this.props.criterias, {name: 'gaming_spend'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'gaming_spendCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('gaming_spend')}>
                            <h4>Gaming Spend</h4>
                        </div>
                    </Draggable>

                    <Draggable type="tags" data="cancel_credit_amount">
                        <div className={find(this.props.criterias, {name: 'cancel_credit_amount'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'cancel_credit_amountCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('cancel_credit_amount')}>
                            <h4>Cancel Credit Amount</h4>
                        </div>
                    </Draggable>

                    <Draggable type="tags" data="recent_tickets">
                        <div className={find(this.props.criterias, {name: 'recent_tickets'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'recent_ticketsCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('recent_tickets')}>
                            <h4>Recent Tickets</h4>
                        </div>
                    </Draggable>

                    <Draggable type="tags" data="last_updated_datetime">
                        <div className={find(this.props.criterias, {name: 'last_updated_datetime'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'last_updated_datetimeCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('last_updated_datetime')}>
                            <h4>Draw Winner</h4>
                        </div>
                    </Draggable>

                    <Draggable type="tags" data="Gaming_Spend_Time">
                        <div className={find(this.props.criterias, {name: 'Gaming_Spend_Time'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'Gaming_Spend_TimeCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('Gaming_Spend_Time')}>
                            <h4>Gaming Spend Time</h4>
                        </div>
                    </Draggable>

                    <Draggable type="tags" data="Gaming_Spend_day">
                    <div className={find(this.props.criterias, {name: 'Gaming_Spend_day'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'Gaming_Spend_dayCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('Gaming_Spend_day')}>
                        <h4>Gaming Spend On</h4>
                    </div>
                    </Draggable>
                </div>
            </li>
        );
    }//..... end of render() .....//
}//..... end of GamingActivityCriteria.

export default GamingActivityCriteria;