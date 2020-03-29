import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";


class MemberStats extends Component {

    state = {
        avg_spend: 0,
        avg_basket_size: 0,
        members_count: 0,
        new_members_count : 0,
        filter : 'year'
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidMount = () => {
        this.preLoader = $("body").find('.preloader3');
        this.getMemberStats();
    };


    getMemberStats = () => {
        axios.post(BaseUrl + '/api/all_member-stats',{
            venue_id: VenueID,
            company_id: CompanyID,
            filter: this.state.filter
        }).then((response) => {
            this.setState({avg_spend: response.data.total_spend,
                avg_basket_size:response.data.avg_basket_size,
                members_count:response.data.total_members_count,
                new_members_count: response.data.new_members_count
            });
            show_loader(true);
        }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of getMemberStats() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    changeFilter = (filter) => {
        show_loader();
        this.setState({filter: filter},() => {this.getMemberStats();});
    };//...... end of changeFilter() .....//


    render() {
        return (
            <div className="awesome">
                <div className="dayMatrics">
                    <div className="dayMatrics_inner">

                        {
                            (appPermission('Member Date Filters','view')) && (
                                <div className="members_dayMain">
                                    <div className="members_dayInner">
                                        <ul>
                                            <li><a className={this.state.filter === 'day' ? 'active' : ''} style={{cursor:'pointer'}} onClick={() => {this.changeFilter('day')}}>Day</a></li>
                                            <li><a className={this.state.filter === 'week' ? 'active' : ''} style={{cursor:'pointer'}} onClick={() => {this.changeFilter('week')}}>Week</a></li>
                                            <li><a className={this.state.filter === 'month' ? 'active' : ''} style={{cursor:'pointer'}} onClick={() => {this.changeFilter('month')}}>Month</a></li>
                                            <li><a className={this.state.filter === 'year' ? 'active' : ''} style={{cursor:'pointer'}} onClick={() => {this.changeFilter('year')}}>Year</a></li>
                                        </ul>
                                    </div>
                                </div>
                            )
                        }



                        <div className="e_transactionsValue_list">
                            <div className="cmDashboard_columns">
                                <ul className={'member_stats'}>
                                    <li>
                                        <div className="column_dboard_widget2 clearfix">
                                            <div className="column_dboard_widgetDetail2">
                                                <div className="columnHeading">
                                                    <label>TOTAL MEMBERS</label>
                                                </div>
                                                <div className="averageSale_amountinfo">
                                                    <div className="segment_gender_header greenBg blueBg clearfix">
                                                        <div className="segment_state_main">
                                                            <div className="segment_state_left">
                                                                <div className="e_transactions_icon"><span><img
                                                                    src={BaseUrl+"/assets/images/search_total_mamber1.png"} alt="#"/></span>
                                                                </div>
                                                            </div>
                                                            <div className="segment_state_right seg_r"><span>{this.state.members_count}</span>
                                                            </div>


                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="column_dboard_widget2 clearfix">
                                            <div className="column_dboard_widgetDetail2">
                                                <div className="columnHeading">
                                                    <label>NEW MEMBERS</label>
                                                </div>
                                                <div className="averageSale_amountinfo">
                                                    <div className="segment_gender_header blueBg clearfix">
                                                        <div className="segment_state_main">
                                                            <div className="segment_state_left">
                                                                <div className="e_transactions_icon"><span><img
                                                                    src={BaseUrl+"/assets/images/search_total_mamber2.png"} alt="#"/></span>
                                                                </div>
                                                            </div>
                                                            <div className="segment_state_right seg_r"><span>{this.state.new_members_count}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                 {/*   <li>
                                        <div className="column_dboard_widget2 clearfix">
                                            <div className="column_dboard_widgetDetail2">
                                                <div className="columnHeading">
                                                    <label>Average Spend</label>
                                                </div>
                                                <div className="averageSale_amountinfo">
                                                    <div className="segment_gender_header clearfix">
                                                        <div className="segment_state_main">
                                                            <div className="segment_state_left">
                                                                <div className="e_transactions_icon"><span><img
                                                                    src={BaseUrl+"/assets/images/costPrice_iconBlue@2x.png"} alt="#"/></span>
                                                                </div>
                                                            </div>
                                                            <div className="segment_state_right"><span>{Currency} {this.state.avg_spend}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="column_dboard_widget2 clearfix">
                                            <div className="column_dboard_widgetDetail2">
                                                <div className="columnHeading">
                                                    <label>AVG. BASKET SIZE</label>
                                                </div>
                                                <div className="averageSale_amountinfo">
                                                    <div
                                                        className="segment_gender_header darkBlueBg blueBg clearfix">
                                                        <div className="segment_state_main">
                                                            <div className="segment_state_left">
                                                                <div className="e_transactions_icon"><span><img
                                                                    src={BaseUrl+"/assets/images/search_total_mamber3.png"} alt="#"/></span>
                                                                </div>
                                                            </div>
                                                            <div className="segment_state_right"><span>{this.state.avg_basket_size}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>*/}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of Member.

MemberStats.propTypes = {};

export default MemberStats;