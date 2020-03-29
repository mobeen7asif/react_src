import React, {Component} from 'react';

class UserOptionalFields extends Component {
    componentDidMount =() =>{
        this.props.setCriteriaValue('user_optional_field', 'value', 'user_optional_field');
    };
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>User Optional Fields Filling</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('user_optional_field')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Filter User Against Optional Field Filling</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumbe">
                                <div className="numberFields clearfix">
                                    <input  type="text" placeholder='Optional Fields Filling' style={{width:100+'%'}} readOnly/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of UserOptionalFields.

export default UserOptionalFields;