import React, {Component} from 'react';
import { render } from 'react-dom';
import ReactHighcharts from 'react-highcharts';

class TotalPointsLevels extends Component {

    componentWillMount() {
        this.loadChartData();
    }

    loadChartData = () => {
        this.config = {
            xAxis: {
                categories: ['Adrian Cooper'],
            },

            yAxis: {
                gridLineWidth: 0
            },

            series: [{
                name: 'Year 1800',
                data: [107]
            }, {
                name: 'Year 1900',
                data: [133]
            }, {
                name: 'Year 2000',
                data: [814]
            }],

            chart: {
                type: 'bar'
            },
            credits: {
                enabled: false
            }
        }
    }

    render() {
        return (
            <div className="e_dboard_points">
                <div className="e_dboard_campaign">
                    <div className="cmDashboard_columns">
                        <ul>
                            <li className="width_100">
                                <div className="e_column_dboard clearfix">
                                    <div className="column_dboard_widgetDetail2">
                                        <div className="columnHeading">
                                            <label>POINTS AND LEVELS</label>
                                        </div>
                                        <div className="averageSale_amountinfo">
                                            <div className="segment_gender_header clearfix">
                                                <div className="e_dboard_totalPoints clearfix">
                                                    <div className="e_dboard_totalPoints_left">
                                                        <div className="totalPoints_detail">
                                                            <div className="totalPoints_detail_left">
                                                                <div className="totalPoints_detail_img"> <span><img src="assets/images/current_ranking_icon.png" alt="#" /></span> </div>
                                                            </div>
                                                            <div className="totalPoints_detail_right">
                                                                <div className="totalPoints_detail_text"> <strong>12 456 765</strong> <span>TOTAL MEMBER POINTS</span> </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="e_dboard_totalPoints_right">
                                                        <div className="totalPoints_detail">
                                                            <div className="totalPoints_detail_left">
                                                                <div className="totalPoints_detail_img"> <a href="javascript:void(0);"><img src="assets/images/profile_img@2x.png" alt="#" /></a> </div>
                                                            </div>
                                                            <div className="totalPoints_detail_right">
                                                                <div className="totalPoints_detail_text"> <strong>Adrian Cooper (13 456pt)</strong> <span>LEADER</span> </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="e_dboard_points_progress">
                                                <div className="customer_matrics_lists">
                                                    <ul>
                                                        <li className="width_100 grayList">
                                                            <div className="customer_matrics_row">
                                                                <div className="customer_matrics_cell matrics_cell_4"> <span className="cL_rowList_number paddLeft_0">Adrian Cooper</span> </div>
                                                                <div className="customer_matrics_cell matrics_cell_3 padding0px">
                                                                    <div className="matrics_progress">
                                                                        <div className="matrics_progress_baar progreesdark_blue">&nbsp;</div>
                                                                        <div className="matrics_progress_baar progreesgreen">&nbsp;</div>
                                                                        <div className="matrics_progress_baar progreeslight_blue">&nbsp;</div>
                                                                    </div>
                                                                </div>
                                                                <div className="customer_matrics_cell matrics_cell_4">
                                                                    <div className="visits_active"> <strong><b className="oval_blue_midium">&nbsp;</b>701</strong> <small>Total Visits</small> </div>
                                                                </div>
                                                                <div className="customer_matrics_cell matrics_cell_4">
                                                                    <div className="visits_active"> <strong><b className="oval_green_midium">&nbsp;</b>701</strong> <small>Total Visits</small> </div>
                                                                </div>
                                                                <div className="customer_matrics_cell matrics_cell_5">
                                                                    <div className="visits_active"> <strong><b className="oval_lightblue_midium">&nbsp;</b>701</strong> <small>Basket size ($)</small> </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="width_100 darkbrownList">
                                                            <div className="customer_matrics_row">
                                                                <div className="customer_matrics_cell matrics_cell_4"> <span className="cL_rowList_number paddLeft_0">Adrian Cooper</span> </div>
                                                                <div className="customer_matrics_cell matrics_cell_3 padding0px">
                                                                    <div className="matrics_progress">
                                                                        <div className="matrics_progress_baar progreesdark_blue">&nbsp;</div>
                                                                        <div className="matrics_progress_baar progreesgreen">&nbsp;</div>
                                                                        <div className="matrics_progress_baar progreeslight_blue">&nbsp;</div>
                                                                    </div>
                                                                </div>
                                                                <div className="customer_matrics_cell matrics_cell_4">
                                                                    <div className="visits_active"> <strong><b className="oval_blue_midium">&nbsp;</b>701</strong> <small>Total Visits</small> </div>
                                                                </div>
                                                                <div className="customer_matrics_cell matrics_cell_4">
                                                                    <div className="visits_active"> <strong><b className="oval_green_midium">&nbsp;</b>701</strong> <small>Total Visits</small> </div>
                                                                </div>
                                                                <div className="customer_matrics_cell matrics_cell_5">
                                                                    <div className="visits_active"> <strong><b className="oval_lightblue_midium">&nbsp;</b>701</strong> <small>Basket size ($)</small> </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="width_100 cardList">
                                                            <div className="customer_matrics_row">
                                                                <div className="customer_matrics_cell matrics_cell_4"> <span className="cL_rowList_number paddLeft_0">Adrian Cooper</span> </div>
                                                                <div className="customer_matrics_cell matrics_cell_3 padding0px">
                                                                    <div className="matrics_progress">
                                                                        <div className="matrics_progress_baar progreesdark_blue">&nbsp;</div>
                                                                        <div className="matrics_progress_baar progreesgreen">&nbsp;</div>
                                                                        <div className="matrics_progress_baar progreeslight_blue">&nbsp;</div>
                                                                    </div>
                                                                </div>
                                                                <div className="customer_matrics_cell matrics_cell_4">
                                                                    <div className="visits_active"> <strong><b className="oval_blue_midium">&nbsp;</b>701</strong> <small>Total Visits</small> </div>
                                                                </div>
                                                                <div className="customer_matrics_cell matrics_cell_4">
                                                                    <div className="visits_active"> <strong><b className="oval_green_midium">&nbsp;</b>701</strong> <small>Total Visits</small> </div>
                                                                </div>
                                                                <div className="customer_matrics_cell matrics_cell_5">
                                                                    <div className="visits_active"> <strong><b className="oval_lightblue_midium">&nbsp;</b>701</strong> <small>Basket size ($)</small> </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of DetailList.

export default TotalPointsLevels;