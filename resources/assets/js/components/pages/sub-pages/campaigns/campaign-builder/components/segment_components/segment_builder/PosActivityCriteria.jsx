import React, {Component} from 'react';
import { Draggable } from 'react-drag-and-drop';
import {find} from 'lodash';

class PosActivityCriteria extends Component {

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <li>
                <a className="accordianIcons clickAccordian"  style={{cursor:'pointer'}}>
                    <b>&nbsp;</b>
                    <small>POS Activity Criteria</small>
                </a>

                <div className="showAccordian_data clickAccordian_show">

                    <Draggable type="tags" data="pos_spend_date">
                        <div className={find(this.props.criterias, {name: 'pos_spend_date'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"} id={'pos_spend_dateCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('pos_spend_date')}>
                            <h4>POS Spend Date</h4>
                        </div>
                    </Draggable>

                    <Draggable type="tags" data="pos_location">
                        <div className={find(this.props.criterias, {name: 'pos_location'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"} id={'pos_locationCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('pos_location')}>
                            <h4>POS Location</h4>
                        </div>
                    </Draggable>

                    <Draggable type="tags" data="pos_sale_item">
                        <div className={find(this.props.criterias, {name: 'pos_sale_item'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"} id={'pos_sale_itemCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('pos_sale_item')}>
                            <h4>POS Sale Item</h4>
                        </div>
                    </Draggable>

                    <Draggable type="tags" data="POS_Spend_Time">
                        <div className={find(this.props.criterias, {name: 'POS_Spend_Time'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"} id={'POS_Spend_TimeCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('POS_Spend_Time')}>
                            <h4>POS Spend Time</h4>
                        </div>
                    </Draggable>
                </div>
            </li>
        );
    }//..... end of render() .....//
}//..... end of PosActivityCriteria.

export default PosActivityCriteria;