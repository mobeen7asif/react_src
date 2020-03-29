import React, {Component} from 'react';
import { Draggable } from 'react-drag-and-drop';
import {find} from 'lodash';

class VenueUtilizationCriteria extends Component {
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <li>
                <a className="accordianIcons clickAccordian"  style={{cursor:'pointer'}}>
                    <b>&nbsp;</b>
                    <small>Venue Utilisation Criteria</small>
                </a>
                <div className="showAccordian_data clickAccordian_show">
                    <Draggable type="tags" data="venue">
                        <div className={find(this.props.criterias, {name: 'venue'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"} id={'venueCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('venue')}>
                            <h4>Venue Utilisation</h4>
                        </div>
                    </Draggable>
                </div>
            </li>
        );
    }//..... end of render() .....//
}//..... end of VenueUtilizationCriteria.

export default VenueUtilizationCriteria;