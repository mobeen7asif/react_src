import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";


class VoucherStats extends Component {

    state = {
        count : 0,
        amount : 0,
        last_received : '',
        voucher_percentage : 0
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//


    componentDidMount = () => {
        let url = BaseUrl + '/api/voucher-stats';
        axios.post(url, {
            'company_id': CompanyID,
            'venue_id': VenueID,
            'persona_id': this.props.persona_id,
        }).then(res => {
            this.setState({count : res.data.count, amount : res.data.voucher_amount, last_received:res.data.last_received, voucher_percentage: res.data.voucher_percentage })
        }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while Badges Stats", 'Error');
        });
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    changeDateFormat = (data) => {
        if(data){
            return moment(data).format("DD/MM/YYYY");
        } else {
            return '';
        }
    };



    render() {
        return (

            <div className="e_transactions_box">
                <div className="e_transactionsValue_list">
                    <div className="cmDashboard_columns">
                        <ul>
                            <li>
                                <div className="column_dboard_widget2 clearfix">
                                    <div className="column_dboard_widgetDetail2">
                                        <div className="columnHeading">
                                            <label>TOTAL VOUCHERS</label>
                                        </div>
                                        <div className="averageSale_amountinfo">
                                            <div className="segment_gender_header greenBg blueBg clearfix">
                                                <div className="segment_gender_left">
                                                    <div className="segment_state_main">
                                                        <div className="segment_state_left">
                                                            <div className="e_transactions_icon"> <span><img src={BaseUrl+"/assets/images/points_voucher_icon1.png"} alt="#" /></span> </div>
                                                        </div>
                                                        <div className="segment_state_right"> <span>{this.state.count}</span> </div>
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
                                            <label>LAST RECIEVED </label>
                                        </div>
                                        <div className="averageSale_amountinfo">
                                            <div className="segment_gender_header blueBg clearfix">
                                                <div className="segment_gender_left">
                                                    <div className="segment_state_main">
                                                        <div className="segment_state_left">
                                                            <div className="e_transactions_icon"> <span><img src={BaseUrl+"/assets/images/last_received_icon.png"} alt="#" /></span> </div>
                                                        </div>
                                                        <div className="segment_state_right"> <span>{this.state.last_received}</span> </div>
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
                                            <label>VOUCHER VALUE</label>
                                        </div>
                                        <div className="averageSale_amountinfo">
                                            <div className="segment_gender_header clearfix">
                                                <div className="segment_gender_left">
                                                    <div className="segment_state_main">
                                                        <div className="segment_state_left">
                                                            <div className="e_transactions_icon"> <span><img src={BaseUrl+"/assets/images/points_voucher_icon3.png"} alt="#" /></span> </div>
                                                        </div>

                                                        <div className="segment_state_right"> <span>{this.state.amount}</span> </div>
                                                    </div>
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
}//..... end of Member.

VoucherStats.propTypes = {};

export default VoucherStats;
