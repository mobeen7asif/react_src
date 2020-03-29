import React, {Component} from 'react';

class ReferralUsers extends Component {
    componentDidMount =() =>{
        this.props.setCriteriaValue('referral_user', 'value', 'referral_user');
    };
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Refer a friend</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('referral_user')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                       {/* <label>Reffered User</label>*/}
                        <span>This will trigger when someone joins by refer a friend.</span>
                       {/* <div className="memberNumberOuter clearfix">
                            <div className="memberNumbe">
                                <div className="numberFields clearfix">

                                </div>
                            </div>
                        </div>*/}
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of UserOptionalFields.

export default ReferralUsers;