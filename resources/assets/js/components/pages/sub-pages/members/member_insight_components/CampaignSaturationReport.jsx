import React, {Component} from 'react';
import PropTypes from 'prop-types';

class CampaignSaturationReport extends Component {
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    render() {
        return (
            <React.Fragment>
                <div className="compaign_addNew clearfix">
                    <h3>CAMPAIGN SATURATION</h3>
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
                                                        <input value="" placeholder="22 Jan 2018" type="text" />
                                                    </div>
                                                </div>
                                                <div className="datePickerLeft frDatePicker">
                                                    <div className="datePicker">
                                                        <input value="" placeholder="22 Jan 2018" type="text" />
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
                <div className="compaignSaturation_listing">
                    <ul>
                        <li>
                            <div className="dashborad_column clearfix">
                                <div className="column6_db">
                                    <div className="venueHead">
                                        <h4>CAMPAIGN SATURATION - ALL CAMPAIGN TYPES</h4>
                                        <div className="venueDropdown">
                                            <div className="campaign_select">
                                                <span>All</span>
                                                <select>
                                                    <option>All</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                </select>
                                            </div>
                                        </div>
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
                                    <div className="venueHighChart_outer clearfix">
                                        <div className="chanel_chart">
                                            <img src="images/location_chart.png" alt="#"/>
                                        </div>
                                        <div className="chanel_chart_description">
                                            <ul>
                                                <li>
                                                    <div className="chanel_descriptionList clearfix">
                                                        <b className="greyActive">&nbsp;</b>
                                                        <div className="chanel_descriptionList_text clearfix">
                                                            <p>Venue Name Input 1</p>
                                                            <strong>1085 </strong>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="chanel_descriptionList clearfix">
                                                        <b className="blueActive">&nbsp;</b>
                                                        <div className="chanel_descriptionList_text clearfix">
                                                            <p>Venue Name Input 1</p>
                                                            <strong>1085 </strong>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="chanel_descriptionList clearfix">
                                                        <b className="greenActive">&nbsp;</b>
                                                        <div className="chanel_descriptionList_text clearfix">
                                                            <p>Venue Name Input 1</p>
                                                            <strong>1085 </strong>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="chanel_descriptionList clearfix">
                                                        <b className="navyBlueActive">&nbsp;</b>
                                                        <div className="chanel_descriptionList_text clearfix">
                                                            <p>Venue Name Input 1</p>
                                                            <strong>1085 </strong>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="column6_db unscribeRates">
                                    <div className="venueHead">
                                        <h4>CAMPAIGN SATURATION - DISTRIBUTION</h4>
                                        <div className="venueDropdown">
                                            <div className="campaign_select">
                                                <span>All</span>
                                                <select>
                                                    <option>All</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                </select>
                                            </div>
                                        </div>
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

                                    <div className="unscribeChart">
                                        <img src="images/unscribe_chartImg@2x.png" alt="#"/>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="activeHeading">
                                <h4>CAMPAIGN SATURATION - BY CAMPAIGN TYPE</h4>
                            </div>
                            <div className="dashborad_Totalcolumn clearfix">
                                <ul>
                                    <li>
                                        <div className="column_dboard_widget activeCompaignColumn clearfix">
                                            <div className="activeCompaign_icon">
                                                <a href="#">&nbsp;</a>
                                            </div>
                                            <div className="column_dboard_widgetDetail">
                                                <strong>34</strong>
                                                <small>Total Campaigns</small>
                                            </div>
                                            <div className="column_dboard_widgetBttn">
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
                                        </div>
                                    </li>
                                    <li>
                                        <div className="column_dboard_widget activeCompaignColumn clearfix">
                                            <div className="activeCompaign_icon">
                                                <a href="#" className="forgetIcon">&nbsp;</a>
                                            </div>
                                            <div className="column_dboard_widgetDetail">
                                                <strong>18</strong>
                                                <small>Set and forget</small>
                                            </div>
                                            <div className="column_dboard_widgetBttn">
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
                                        </div>
                                    </li>
                                    <li>
                                        <div className="column_dboard_widget activeCompaignColumn clearfix">
                                            <div className="activeCompaign_icon">
                                                <a href="#" className="dynamicIcon">&nbsp;</a>
                                            </div>
                                            <div className="column_dboard_widgetDetail">
                                                <strong>16</strong>
                                                <small>Dynamic</small>
                                            </div>
                                            <div className="column_dboard_widgetBttn">
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
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div className="column6_db deliverChanel">
                                <div className="venueHead">
                                    <h4>DELIVERY CHANNEL DISTTRIBUTION</h4>
                                    <div className="venueDropdown" style={{width: '20%'}}>
                                        <div className="campaign_select">
                                            <span>All</span>
                                            <select>
                                                <option>All</option>
                                                <option>2</option>
                                                <option>3</option>
                                            </select>
                                        </div>
                                    </div>
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
                            <div className="activeHeading">
                                <h4>UNSUBSCRIPTIONS</h4>
                            </div>

                            <div className="dashborad_Totalcolumn clearfix">
                                <ul>
                                    <li>
                                        <div className="column_dboard_widget activeCompaignColumn clearfix">
                                            <div className="activeCompaign_icon">
                                                <a href="#">&nbsp;</a>
                                            </div>
                                            <div className="column_dboard_widgetDetail">
                                                <strong>34</strong>
                                                <small>Total Campaigns</small>
                                            </div>
                                            <div className="column_dboard_widgetBttn">
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
                                        </div>
                                    </li>
                                    <li>
                                        <div className="column_dboard_widget activeCompaignColumn clearfix">
                                            <div className="activeCompaign_icon">
                                                <a href="#" className="forgetIcon">&nbsp;</a>
                                            </div>
                                            <div className="column_dboard_widgetDetail">
                                                <strong>18</strong>
                                                <small>Set and forget</small>
                                            </div>
                                            <div className="column_dboard_widgetBttn">
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
                                        </div>
                                    </li>
                                    <li>
                                        <div className="column_dboard_widget activeCompaignColumn clearfix">
                                            <div className="activeCompaign_icon">
                                                <a href="#" className="dynamicIcon">&nbsp;</a>
                                            </div>
                                            <div className="column_dboard_widgetDetail">
                                                <strong>16</strong>
                                                <small>Dynamic</small>
                                            </div>
                                            <div className="column_dboard_widgetBttn">
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
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of CampaignSiturationReport.

CampaignSaturationReport.propTypes = {};

export default CampaignSaturationReport;