import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";


class TotalVoucherStats extends Component {
    state ={
        showListError:false,
        total_vouchers :0,
        stamp_voucher_count:0,
        total_voucher_percentage:0.00,
        total_unused_vouchers : 0,
        total_punch_cards : 0,
        total_unredeemed_stamps: 0
    };

    componentDidMount = () => {
       // this.dashboardVoucherStats();
    };

    componentWillReceiveProps(props) {
        if((!props.dateHandler.showDatePicker && props.dateHandler.applyFilter)){
             this.setState(()=>({
             start_date: props.dateHandler.start_date,
             end_date: props.dateHandler.end_date}),
             () => {this.dashboardVoucherStats();});
         }
     }

    componentDidCatch = (error, info) => {
        // show_loader(true);
    };//...... end of componentDidCatch() .....//

    // dashboardVoucherStats
    dashboardVoucherStats = () => {
        let url = BaseUrl + '/api/dashboard-voucher-stats';
        axios.post(url, {
            'company_id': CompanyID,
            'venue_id': VenueID,
            'start_date': this.props.dateHandler.start_date,
            'end_date' : this.props.dateHandler.end_date,
            'filterPeriod' : this.props.dateHandler.filterPeriod,
            'rangeData' : this.categories,
            'api_key'   : this.props.api_key,
            'secret_key' : this.props.secret_key,
            'business_id' : this.props.business_id,
            'business_name': this.props.business_name

        }).then(res => {
            if (res.status) {
                this.setState({
                    total_vouchers: res.data.stats.count,
                    stamp_voucher_count: res.data.stats.stamp_voucher_count,
                    total_voucher_percentage: res.data.stats.voucher_percentage,
                    total_unused_vouchers: res.data.stats.unusedVouchersCount,
                    total_punch_cards: res.data.stats.punch_card_Count,
                    total_unredeemed_stamps: res.data.stats.total_unredeemed_stamps
                });
                /*this.setState((prevState) => ({
                    total_vouchers : prevState.total_vouchers + res.data.count
                }));*/

            } else {
                // show_loader(true);
                // this.setState({showListError: true});
            }
        }).catch((err) => {
            // show_loader(true);
            this.setState({showListError: true});
            //NotificationManager.error("Error occurred in getting Voucher Status", 'Error');
        });
    };

    render() {
        return (
            <div className="dayMatrics">
                <div className="e_transactionsValue_list">
                    <div className="cmDashboard_columns">
                        <ul>
                            <li>
                                <div className="column_dboard_widget2 clearfix">
                                    <div className="column_dboard_widgetDetail2">
                                        <div className="columnHeading">
                                            <label>TOTAL UNUSED VOUCHERS</label>
                                        </div>
                                        <div className="averageSale_amountinfo">
                                            <div className="segment_gender_header greenBg blueBg clearfix">
                                                <div className="segment_state_main">
                                                    <div className="segment_state_left">
                                                        <div className="e_transactions_icon"> <span><img src="assets/images/points_voucher_icon1.png" alt="#" /></span> </div>
                                                    </div>
                                                    <div className="segment_state_right"> <span className="voucherTxt">{this.state.total_unused_vouchers}</span> </div>
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
                                            <label>TOTAL UNREDEEMED STAMPS</label>
                                        </div>
                                        <div className="averageSale_amountinfo">
                                            <div className="segment_gender_header blueBg clearfix">
                                                <div className="segment_state_main">
                                                    <div className="segment_state_left">
                                                        <div className="e_transactions_icon"> <span><img src="assets/images/green_voucher_icon.png" alt="#" /></span> </div>
                                                    </div>
                                                    <div className="segment_state_right"> <span className="voucherTxt">{this.state.total_unredeemed_stamps}</span> </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
 {/*                           <li>
                                <div className="column_dboard_widget2 clearfix">
                                    <div className="column_dboard_widgetDetail2">
                                        <div className="columnHeading">
                                            <label>STAMP VOUCHERS</label>
                                        </div>
                                        <div className="averageSale_amountinfo">
                                            <div className="segment_gender_header clearfix">
                                                <div className="segment_state_main">
                                                    <div className="segment_state_left">
                                                        <div className="e_transactions_icon"> <span><img src="assets/images/costPrice_iconBlue@2x.png" alt="#" /></span> </div>
                                                    </div>
                                                    <div className="segment_state_right"> <span className="voucherTxt">{this.state.stamp_voucher_count}</span> </div>
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
                                            <label>TOTAL STAMP CARDS</label>
                                        </div>
                                        <div className="averageSale_amountinfo">
                                            <div className="segment_gender_header clearfix">
                                                <div className="segment_state_main">
                                                    <div className="segment_state_left">
                                                        <div className="e_transactions_icon"> <span><img src="assets/images/green_star.png" alt="#" /></span> </div>
                                                    </div>
                                                    <div className="segment_state_right"> <span className="voucherTxt">{this.state.total_punch_cards}</span> </div>
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
        );
    }//..... end of render() .....//
}//..... end of DetailList.

export default TotalVoucherStats;