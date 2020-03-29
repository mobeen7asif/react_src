import React, {Component} from 'react';

class Gender extends Component {

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('gender', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix"><h3>Gender</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('gender')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="genderSelected clearfix">
                    <ul>
                        <li>
                            <div className="genderDetail">
                                <span id="maleSegment" className={this.props.criteria.value === 'male' ? 'selectGender' : ''}>
                                    <b  onClick={()=>{this.setCriteriaValue('male')}}><i>&nbsp;</i></b> Male </span>
                            </div>
                        </li>
                        <li>
                            <div className="genderDetail">
                                <span id="femaleSegment" className={this.props.criteria.value === 'female' ? 'selectGender' : ''}>
                                    <b className="genderFemale" onClick={()=>{this.setCriteriaValue('female')}}><i>&nbsp;</i></b> Female
                                </span>
                            </div>
                        </li>
                        <li>
                            <div className="genderDetail">
                                <span id="otherSegment" className={this.props.criteria.value === 'other' ? 'selectGender' : ''}>
                                    <b className="genderOther" onClick={()=>{this.setCriteriaValue('other')}}><i>&nbsp;</i></b> Other
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of Gender.

export default Gender;