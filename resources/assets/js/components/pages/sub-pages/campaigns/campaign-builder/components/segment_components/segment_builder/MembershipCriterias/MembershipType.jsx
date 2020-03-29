import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {NotificationManager} from "react-notifications";

class MembershipType extends Component {

    state = {
        memberShipTypes: []
    };

    setValueSelected = (mtype) => {
        let newStates = this.props.criteria.value;
        if (newStates.indexOf(mtype) === -1) {
            newStates.push(mtype);
        } else {
            newStates = this.props.criteria.value.filter((st) => st !== mtype);
        }//..... end if-else() .....//

        this.setCriteriaValue(newStates);
    };//..... end of setValueSelected() ......//

    selectAll = () => {
        this.setCriteriaValue(this.state.memberShipTypes);
    };//..... end of selectAll() .....///

    clearAll = () => {
        this.setCriteriaValue([]);
    };//..... end of clearAll() .....//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('membership_type_id', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        show_loader();
        axios.get(BaseUrl + `/api/membership-type-list/${CompanyID}/${VenueID}`)
            .then((response) => {
                show_loader();
                this.setState(() => ({
                    memberShipTypes: response.data
                }));
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while fetching Membership Type List.", 'Error');
        });
    };//..... end of componentDidMount() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Membership Type</h3>
                    <div className="segmntClose"  onClick={(e)=> {this.props.removeCriteria('membership_type_id')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Membership Types</label>
                        <div className="tagsCompaigns_detail clearfix">
                            <div className="tagsCompaigns_list">
                                <div className="tagsCompaigns_listScroll">
                                    <div className="tagsScroll">
                                        <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                            <ul>
                                                {this.state.memberShipTypes.map((mtype)=> {
                                                    return <li key={mtype} onClick={()=> this.setValueSelected(mtype)}
                                                               className={(this.props.criteria.value.indexOf(mtype) !== -1) ? 'selectedItem' : ''}>
                                                        {mtype}
                                                        </li>;
                                                })}
                                            </ul>
                                        </Scrollbars>
                                    </div>
                                </div>
                            </div>
                            <div className="tagsSelected_tip">
                                <div className="selected_tip">
                                    <i>TIP</i>
                                    <p>Use the Control (Ctrl on Windows) or Command
                                    (⌘ on Mac)key to select or unselect items.</p>
                                    <button onClick={this.selectAll}>SELECT ALL</button>
                                    <button onClick={this.clearAll}>CLEAR ALL</button>
                                </div>
                            </div>
                        </div>
                        <div className="selectedTags">
                            <label>Selected</label>
                            <div className="showTags clearfix">
                                <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                    <span>
                                        {this.props.criteria.value.map((value) => {
                                            return <a  style={{cursor:'pointer'}} onClick={()=> this.setValueSelected(value)} key={value}>
                                                {value}
                                                <i>&nbsp;</i>
                                            </a>
                                        })}
                                    </span>
                                </Scrollbars>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of MembershipType.

export default MembershipType;