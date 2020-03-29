import React, {Component} from 'react';
import PropTypes from 'prop-types';

class MemberInsightReport extends Component {
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    render() {
        return (
            <React.Fragment>
                <div className="compaign_addNew clearfix">
                    <h3>MY MEMBERS INSIGHT</h3>
                </div>

                <div className="compaign_select_search clearfix">
                    <div className="selectCompaign">
                        <div className="placeHolderOuter  clearfix">
                            <div className="dropDown_member_insight">
                                <span>Reporting Period</span>
                                <ul className="dropDown_member_insight_show ">
                                    <li><a  style={{cursor:'pointer'}}>Today</a></li>
                                    <li><a  style={{cursor:'pointer'}}>Yesterday</a></li>
                                    <li><a  style={{cursor:'pointer'}}>Week to Date</a></li>
                                    <li><a  style={{cursor:'pointer'}}>Last Week</a></li>
                                    <li><a  style={{cursor:'pointer'}}>Month to Date</a></li>
                                    <li><a  style={{cursor:'pointer'}}>Last Month</a></li>
                                    <li><a  style={{cursor:'pointer'}}>Year to Date</a></li>
                                    <li><a  style={{cursor:'pointer'}}>Last Year</a></li>
                                    <li><a  style={{cursor:'pointer'}}>Date Range</a>

                                        <div className="show_picker">
                                            <div className="datePickerOuter clearfix">
                                                <div className="datePickerLeft">
                                                    <div className="datePicker">
                                                        <input value="" placeholder="22 Jan 2018" type="text"/>
                                                    </div>
                                                </div>

                                                <div className="datePickerLeft frDatePicker">
                                                    <div className="datePicker">
                                                        <input value="" placeholder="22 Jan 2018" type="text"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="searchCompaign clearfix">
                        <input type="text" value="" placeholder="Search Segment" className="copmpaignSearch_field"/>
                        <input type="submit" value="" className="copmpaignIcon_field"/>
                    </div>
                    <div className="searchCompaign clearfix">
                        <input type="text" value="" placeholder="Search Member" className="copmpaignSearch_field"/>
                        <input type="submit" value="" className="copmpaignIcon_field"/>
                    </div>
                </div>

                <div className="member_indsight_charts">
                    <ul>
                        <li>
                            <div className="column6_db">
                                <div className="venueHead">
                                    <h4>AGE/GENDER SPLIT</h4>
                                    <div className="vidget_dropdown">
                                        <a  style={{cursor:'pointer'}} className="vidgetBtn">&nbsp;</a>
                                        <ul className="showOptions">
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Edit</a>
                                            </li>
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Add</a>
                                            </li>
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Delete</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="member_insight_highChart">
                                    <img src="images/chartPic.png" alt="#" style={{display: 'block', width: '100%'}}/>
                                </div>
                            </div>
                        </li>

                        <li>
                            <div className="column6_db">
                                <div className="venueHead">
                                    <h4>TURNOVER</h4>
                                    <div className="vidget_dropdown">
                                        <a  style={{cursor:'pointer'}} className="vidgetBtn">&nbsp;</a>
                                        <ul className="showOptions">
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Edit</a>
                                            </li>
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Add</a>
                                            </li>
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Delete</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>


                                <div className="member_insight_highChart">
                                    <img src="images/chartPic.png" alt="#" style={{display: 'block', width: '100%'}}/>
                                </div>
                            </div>
                        </li>

                        <li>
                            <div className="column6_db">
                                <div className="venueHead">
                                    <h4>DWELL TIME</h4>
                                    <div className="vidget_dropdown">
                                        <a  style={{cursor:'pointer'}} className="vidgetBtn">&nbsp;</a>
                                        <ul className="showOptions">
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Edit</a>
                                            </li>
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Add</a>
                                            </li>
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Delete</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="member_insight_highChart">
                                    <img src="images/chartPic.png" alt="#" style={{display: 'block', width: '100%'}}/>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of memberInsight.

MemberInsightReport.propTypes = {};

export default MemberInsightReport;