import React, {Component} from 'react';
import PropTypes from 'prop-types';

class SegmentDemographic extends Component {
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="popupDiv_segments">
                <div className="popupDiv_segments_detail">
                    <div className="dashborad_column clearfix">
                        <div className="column6_db" style={{borderColor: '#0963a761'}}>
                            <div className="venueHead">
                                <h4>AGE SPLIT</h4>
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
                                    <img src="assets/images/location_chart.png" alt="#"/>
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
                                <h4>Gender Split</h4>
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
                            <div className="gender_lits_detail">
                                <ul>
                                    <li>
                                        <div className="gender_lits_info maleGender">
                                            <span className=""><b></b></span>

                                            <strong>65%</strong>
                                            <small>Male</small>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="gender_lits_info femaleGender">
                                            <span className=""><b></b></span>
                                            <strong>35%</strong>
                                            <small>Female</small>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="gender_lits_info otherGender">
                                            <span className=""><b></b></span>
                                            <strong>0%</strong>
                                            <small>Other</small>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="dashborad_column clearfix">
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
                            <div className="unscribeChart"
                                 style={{width: '80%', margin: 'auto', paddingBottom: '20px'}}>
                                <img src="assets/images/unscribe_chartImg@2x.png" alt="#"/>
                            </div>
                        </div>
                        <div className="column6_db unscribeRates">
                            <div className="venueHead">
                                <h4>POSTCODE SPLIT</h4>
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
                                    <img src="assets/images/location_chart.png" alt="#"/>
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
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of SegmentDemographic.

SegmentDemographic.propTypes = {};

export default SegmentDemographic;