import React, {Component} from 'react';

class AllUsers extends Component {

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('gender', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix"><h3>All Users</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('allUsers')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="genderSelected clearfix">
                    <h2>All Users</h2>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of Gender.

export default AllUsers;