import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {NotificationManager} from "react-notifications";

class RatingCard extends Component {

    state = {
        ratingGradeId: []
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
        this.setCriteriaValue(this.state.ratingGradeId);
    };//..... end of selectAll() .....///

    clearAll = () => {
        this.setCriteriaValue([]);
    };//..... end of clearAll() .....//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('rating_grade_id', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        show_loader();
        axios.get(BaseUrl + `/api/rating-grade-list/${CompanyID}/${VenueID}`)
            .then((response) => {
                show_loader();
                this.setState(() => ({
                    ratingGradeId: response.data
                }));
            }). catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while fetching Rating Grade List.", 'Error');
        });
    };//..... end of componentDidMount() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Rating Card</h3>
                    <div className="segmntClose"  onClick={(e)=> {this.props.removeCriteria('rating_grade_id')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Rating Card</label>
                        <div className="tagsCompaigns_detail clearfix">
                            <div className="tagsCompaigns_list">
                                <div className="tagsCompaigns_listScroll tagsScroll">
                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                        <ul style={{height: '197px'}}>
                                            {this.state.ratingGradeId.map((mtype)=> {
                                                return <li key={mtype} onClick={()=> this.setValueSelected(mtype)}
                                                           className={(this.props.criteria.value.indexOf(mtype) !== -1) ? 'selectedItem' : ''}>
                                                    {mtype}
                                                </li>;
                                            })}
                                        </ul>
                                    </Scrollbars>
                                </div>
                            </div>
                            <div className="tagsSelected_tip">
                                <div className="selected_tip">
                                    <i>TIP</i>
                                    <p>Use the Control (Ctrl on Windows) or Command
                                    (âŒ˜ on Mac)key to select or unselect items.</p>
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
}//..... end of RatingCard.

export default RatingCard;