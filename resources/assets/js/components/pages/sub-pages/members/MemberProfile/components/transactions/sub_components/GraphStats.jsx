import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';
import {NotificationManager} from "react-notifications";

class GraphStats extends Component {


    state = {
        filter : 'week',
        data_points:[7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
        intervals: [],
        config : {},
        cash_transactions: 0.0,
        card_transactions: 0.0,
        masterpass_transactions: 0.0,
        cash_transactions_p: 0,
        card_transactions_p: 0,
        masterpass_transactions_p: 0,
        transaction_count: 0,
        basket_size: 0,
        basket_value: 0,
        response_status: false
    };
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentWillMount = () => {
        //this.loadGraphConf();
    };

    componentDidMount = () => {
        this.loadData();
    };//..... end of componentDidMount() .....//

    loadData = () => {
        axios.post(BaseUrl + '/api/transaction-graph',{
            'company_id': CompanyID,
            'venue_id': VenueID,
            persona_id: this.props.persona_id,
            filter: this.state.filter,
        }).then((response) => {
            this.setState({
                data_points: response.data.data.data,
                intervals: response.data.data.data_intervals,
                cash_transactions: response.data.data.cash_transactions,
                card_transactions: response.data.data.card_transactions,
                transaction_count: response.data.data.transactions_total,
                basket_size: response.data.data.basket_size,
                basket_value: response.data.data.basket_value,
                cash_transactions_p: response.data.data.cash_p,
                card_transactions_p: response.data.data.card_P

            },() => {this.loadGraphConf();});
            show_loader(true);
        })
            .catch((err) => {
                show_loader(true);
                //NotificationManager.error("Internal Server error occurred.", 'Error');
            });
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    loadGraphConf = () => {
        let config = {
            xAxis: {
                //categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                categories: this.state.intervals,
                gridLineColor: 'white',
                gridLineWidth: 1,
            },

            series: [{
                name: 'Amount',
                //data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
                data: this.state.data_points,
                showInLegend: false
            }],

            chart: {
                type: 'area'
                //backgroundColor: '#E4E7EC'
            },
            title:null,
            credits: {
                enabled: false
            }

        };
        this.setState({
            config:config,
            response_status: true
        })
    };

    changeFilter = (filter) => {
        this.setState({filter: filter}, () => {this.loadData()});
    };//...... end of changeFilter() .....//

    render() {
        return (

            <div className="e_transactions_box">
                <div className="e_transactions_box">
                    <div className="e_transactions_inner">
                        {(this.state.response_status &&
                            <div className="e_transactions_graphOut">
                                <h5>TOTAL TRANSACTIONS</h5>
                                <br/>
                                <div className="members_dayMain">
                                    <div className="members_dayInner">
                                        <ul>
                                            {/*<li><a className={this.state.filter === 'day' ? 'active' : ''} href="javascript:void(0);" onClick={() => {this.changeFilter('day')}}>Day</a></li>*/}
                                            <li><a className={this.state.filter === 'week' ? 'active' : ''} href="javascript:void(0);" onClick={() => {this.changeFilter('week')}}>Week</a></li>
                                            <li><a className={this.state.filter === 'month' ? 'active' : ''} href="javascript:void(0);" onClick={() => {this.changeFilter('month')}}>Month</a></li>
                                            <li><a className={this.state.filter === 'year' ? 'active' : ''} href="javascript:void(0);" onClick={() => {this.changeFilter('year')}}>Year</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <br/>
                                <div className="e_transactions_graph">



                                    <ReactHighcharts config={this.state.config} ref={this.chart}/>




                                </div>
                            </div>
                        )}

                        <div className="e_transactions_detail">
                            <div className="totalRevenue_head transectionText clearfix">
                                <ul>
                                    <li>
                                        <div className="totalRevenue_val">
                                            <figure><img src={BaseUrl+"/assets/images/combined-shape@2x.png"} alt="#" /></figure>
                                            <b>{this.state.cash_transactions}</b>
                                            <p>Cash Transactions</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="totalRevenue_val">
                                            <figure><img src={BaseUrl+"/assets/images/card_light_icon@2x.png"} alt="#" /></figure>
                                            <b>{this.state.card_transactions}</b>
                                            <p>Card Transactions</p>
                                        </div>
                                    </li>
                                    {/*    <li>
                                       <div className="totalRevenue_val">
                                           <figure><img src={BaseUrl+"/assets/images/master_pass_icon@2x.png"} alt="#" /></figure>
                                           <b>${this.state.masterpass_transactions}</b>
                                           <p>Masterpass Transactions</p>
                                       </div>
                                   </li>*/}
                                </ul>
                            </div>
                            <div className="cashCardPass_transection clearfix">
                                <ul>
                                    <li className="cashList">
                                        <div className="cashCardPass_transRow clearfix">
                                            <div className="cashCardPass_label">
                                                <label>Cash Transactions</label>
                                            </div>
                                            <div className="e_transection_progressOut">
                                                <div className={this.state.card_transactions_p >= 100 ? 'e_membership_progress bar_p' : 'e_membership_progress'}>
                                                    <div className={'e_membership_progress progressSky'} style={{width: `${Number(this.state.cash_transactions_p).toFixed(1)}%`}}><span>{Number(this.state.cash_transactions_p).toFixed(1)}%</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="cardList">
                                        <div className="cashCardPass_transRow clearfix">
                                            <div className="cashCardPass_label">
                                                <label>Card Transactions</label>
                                            </div>
                                            <div className="e_transection_progressOut">
                                                <div className= {this.state.card_transactions_p >= 100 ? 'e_membership_progress bar_p' : 'e_membership_progress'}>
                                                    <div className={'e_membership_progress progressBlue'} style={{width: `${Number(this.state.card_transactions_p).toFixed(1)}%`}}><span>{Number(this.state.card_transactions_p).toFixed(1)}%</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    {/*  <li className="passList">
                                       <div className="cashCardPass_transRow clearfix">
                                           <div className="cashCardPass_label">
                                               <label>Masterpass Transactions</label>
                                           </div>
                                           <div className="e_transection_progressOut">
                                               <div className="e_membership_progress">
                                                   <div className={'e_membership_progress progressDarkblue'} style={{width: `${Number(this.state.masterpass_transactions_p).toFixed(1)}%`}}><span style={{marginRight: '-10px'}}>{Number(this.state.masterpass_transactions_p).toFixed(1)}%</span></div>
                                               </div>
                                           </div>
                                       </div>
                                   </li>*/}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="e_transactionsValue_list">
                    <div className="cmDashboard_columns">
                        <ul>
                            <li>
                                <div className="column_dboard_widget2 clearfix">
                                    <div className="column_dboard_widgetDetail2">
                                        <div className="columnHeading">
                                            <label>AVG. BASKET VALUE</label>
                                        </div>
                                        <div className="averageSale_amountinfo">
                                            <div className="segment_gender_header blueBg clearfix">
                                                <div className="segment_gender_left">
                                                    <div className="segment_state_main">
                                                        <div className="segment_state_left">
                                                            <div className="e_transactions_icon"> <span><img src={BaseUrl+"/assets/images/transaction_icon1.png"} alt="#" /></span> </div>
                                                        </div>
                                                        <div className="segment_state_right"> <span>{this.state.basket_value}</span> </div>
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
                                            <label>TRANSACTIONS</label>
                                        </div>
                                        <div className="averageSale_amountinfo">
                                            <div className="segment_gender_header greenBg blueBg clearfix">
                                                <div className="segment_gender_left">
                                                    <div className="segment_state_main">
                                                        <div className="segment_state_left">
                                                            <div className="e_transactions_icon"> <span><img src={BaseUrl+"/assets/images/transaction_icon2.png"} alt="#" /></span> </div>
                                                        </div>
                                                        <div className="segment_state_right"> <span>{this.state.transaction_count}</span> </div>
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
                                            <label>Avg. Basket Size</label>
                                        </div>
                                        <div className="averageSale_amountinfo">
                                            <div className="segment_gender_header clearfix">e_membership_progress
                                                <div className="segment_gender_left">
                                                    <div className="segment_state_main">
                                                        <div className="segment_state_left">
                                                            <div className="e_transactions_icon"> <span><img src={BaseUrl+"/assets/images/transaction_icon3.png"} alt="#" /></span> </div>
                                                        </div>
                                                        <div className="segment_state_right"> <span>{this.state.basket_size}</span> </div>
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

GraphStats.propTypes = {};

export default GraphStats;
