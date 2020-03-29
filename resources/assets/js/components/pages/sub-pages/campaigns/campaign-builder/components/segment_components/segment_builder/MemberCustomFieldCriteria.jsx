import React, {Component} from 'react';
import { Draggable } from 'react-drag-and-drop';
import {find} from 'lodash';

class MemberCustomFieldCriteria extends Component {
    state = {
        venueFields:[]
    };

    componentDidMount() {
        let memberCustomFields= JSON.parse(localStorage.getItem('all_custom_fields'));


        if(this.props.hasOwnProperty("listSegments")){
            memberCustomFields = this.props.listSegments;
        }
        this.setState(()=>({venueFields:memberCustomFields}),()=>{
            console.log("---",this.state.venueFields);
        })
    }

    removeUnderscore = (str) => {
        return str.replace(/_/g, " ").toLowerCase();
    }
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//



    render() {
        return (

            <li>

                <a className="accordianIcons clickAccordian"  style={{cursor:'pointer'}}>
                    <b>&nbsp;</b>
                    <small className="capitalize">{this.removeUnderscore(this.props.segment_name)}</small>
                </a>
                <div className="showAccordian_data clickAccordian_show">

                    {this.state.venueFields.map((value,key)=>{
                        if(value.field_type !="form"){
                            let segment_name = value.field_unique_id;
                            return (
                                <Draggable key={key} type="tags" data={segment_name} >
                                    <div className={find(this.props.criterias, {name: segment_name}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={segment_name+"Criteria"} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick(segment_name)} >
                                        <h4 className="capitalize">{this.removeUnderscore(value.field_label)}</h4>
                                    </div>
                                </Draggable>
                            )
                        }
                    })}


                </div>
            </li>
        );
    }//..... end of render() .....//
}//..... end of CustomFieldCriteria.

export default MemberCustomFieldCriteria;