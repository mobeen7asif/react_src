import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {find} from "lodash";

class MembershipStatus extends Component {
    memberShipStatus      = ['Active', 'Cancelled', 'Deceased', 'Excluded Gaming', 'Excluded Full Exclusion', 'Excluded Non-gaming', 'Expired', 'Suspended'];
    customDropDownSpanRef = null;
    customDropDownShowRef = null;

    setValueSelected = (value) => {
        this.setCriteriaValue(value);

        this.customDropDownShowRef.style.display = 'none';
        this.customDropDownSpanRef.classList.remove('changeAero');
    };//..... end of setValueSelected() ......//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('membership_status', 'value', value);
    };//..... end of setCriteriaValue() .....//

    handleDropDownSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRef.style.display = this.customDropDownShowRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownSpanClick() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Membership Status</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('membership_status')}}>
                        <a   style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Member is</label>
                        <div className="placeHolderOuter expandPlaceholder clearfix">
                            <div className="customDropDown">
                                <span onClick={this.handleDropDownSpanClick} ref={ref => this.customDropDownSpanRef = ref}> {this.props.criteria.value ? this.props.criteria.value : 'Membership Status'}</span>
                                <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                        {
                                            this.memberShipStatus.map((ms) => {
                                                return <li key={ms} onClick={(e)=> {this.setValueSelected(ms)}}
                                                           className={(this.props.criteria.value === ms) ? 'selectedItem' : ''}>{ms}</li>
                                            })
                                        }
                                    </Scrollbars>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of MembershipStatus.

export default MembershipStatus;