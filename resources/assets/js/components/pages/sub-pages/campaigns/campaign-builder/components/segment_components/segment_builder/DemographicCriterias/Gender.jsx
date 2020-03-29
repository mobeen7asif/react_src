import React, {Component} from 'react';

class Gender extends Component {


    setCriteriaValue = (value) => {
        var gender = this.props.criteria.value;
        if(typeof (gender) == "string")
            gender = value.split(",");

        gender.indexOf(value) === -1 ? gender.push(value) :  gender.splice(gender.indexOf(value),1) ;

        this.props.setCriteriaValue('gender', 'value', gender);
    };//..... end of setCriteriaValue() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    componentDidMount = () => {
        let value = this.props.criteria.value;
        if(typeof (value) == "string"){
            value = value.split(",");
            this.props.setCriteriaValue('gender', 'value', value);
        }

    }
    


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
                        <li style={{width:"25%"}}>
                            <div className="genderDetail">
                                <span id="maleSegment" className={this.props.criteria.value.includes("male") ? 'selectGender' : ''}>
                                    <b  onClick={()=>{this.setCriteriaValue('male')}}><i>&nbsp;</i></b> Male </span>
                            </div>
                        </li>
                        <li style={{width:"25%"}}>
                            <div className="genderDetail">
                                <span id="femaleSegment" className={this.props.criteria.value.includes("female") ? 'selectGender' : ''}>
                                    <b className="genderFemale" onClick={()=>{this.setCriteriaValue('female')}}><i>&nbsp;</i></b> Female
                                </span>
                            </div>
                        </li>
                        <li style={{width:"25%"}}>
                            <div className="genderDetail">
                                <span id="otherSegment" className={this.props.criteria.value.includes("other") ? 'selectGender' : ''}>
                                    <b className="genderOther" onClick={()=>{this.setCriteriaValue('other')}}><i>&nbsp;</i></b> Other
                                </span>
                            </div>
                        </li>

                        <li style={{width:"25%"}}>
                            <div className="genderDetail">
                                <span id="otherSegment" className={this.props.criteria.value.includes("unknown") ? 'selectGender' : ''}>
                                    <b className="genderUnknown" onClick={()=>{this.setCriteriaValue('unknown')}}><i>&nbsp;</i></b> Unknown
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