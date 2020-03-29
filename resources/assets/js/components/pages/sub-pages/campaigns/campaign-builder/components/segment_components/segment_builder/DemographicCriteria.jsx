import React, {Component} from 'react';
import {Draggable} from 'react-drag-and-drop';
import {find} from 'lodash';

class DemographicCriteria extends Component {

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <li>
                <a className="accordianIcons  clickAccordian active"  style={{cursor:'pointer'}}>
                    <b>&nbsp;</b>
                    <small>Demographic Criteria</small>
                </a>
                <div className="showAccordian_data clickAccordian_show" style={{display: 'block'}}>
                    {this.props.checkSegmentCriteria('Demographic Criteria','allUsers') && (
                        <Draggable type="tags" data="allUsers" >
                            <div className={find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"} id={'allUsersCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('allUsers')}>
                                <h4>All Users</h4>
                            </div>
                        </Draggable>
                    )}
                    {this.props.checkSegmentCriteria('Demographic Criteria','gender') && (
                        <Draggable type="tags" data="gender" data-id="test">
                            <div className={find(this.props.criterias, {name: 'gender'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"} id={'genderCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('gender')}>
                                <h4>Gender</h4>
                            </div>
                        </Draggable>
                    )}
                    {this.props.checkSegmentCriteria('Demographic Criteria','date_of_birth') && (
                        <Draggable type="tags" data="date_of_birth">
                            <div className={find(this.props.criterias, {name: 'date_of_birth'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"} id={'date_of_birthCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('date_of_birth')}>
                                <h4>Age</h4>
                            </div>
                        </Draggable>
                    )}
                    {this.props.checkSegmentCriteria('Demographic Criteria','birth_day') && (
                        <Draggable type="tags" data="birth_day">
                            <div className={find(this.props.criterias, {name: 'birth_day'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"} id={'birth_dayCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('birth_day')}>
                                <h4>Birthday</h4>
                            </div>
                        </Draggable>
                    )}
                    {this.props.checkSegmentCriteria('Demographic Criteria','postal_code') && (
                        <Draggable type="tags" data="postal_code">
                            <div className={find(this.props.criterias, {name: 'postal_code'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"} id={'postal_code_newCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('postal_code')}>
                                <h4>Postcode</h4>
                            </div>
                        </Draggable>
                    )}

                    {/*   <Draggable type="tags" data="residential_address.state">
                        <div className={find(this.props.criterias, {name: 'residential_address.state'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"} id={'residential_address_stateCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('residential_address.state')}>
                            <h4>State</h4>
                        </div>
                    </Draggable>

                    <Draggable type="tags" data="residential_address.postal_code">
                        <div className={find(this.props.criterias, {name: 'residential_address.postal_code'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"} id={'residential_address_postal_codeCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('residential_address.postal_code')}>
                            <h4>Postcode / Suburb</h4>
                        </div>
                    </Draggable>*/}

                </div>
            </li>
        );
    }//..... end of render() .....//
}//..... end of DemographicCriteria.

export default DemographicCriteria;