import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';

class OverallStats extends Component {

    config = {};
    e_transaction = {};
    e_member_count= {};
    e_sale_count = {};
    e_gross_profit = {};
    e_discount_given = {};
    e_basket_size = {};
    voucher_redeem_chart = {};
    member_chart_status = {};
    avg_basket_size = {};
    state = {
        response_status : false,
        config : '',
        start_date : '',
        end_date : '',
        series : [],
        categories : [],
        overallStats : [],
        showTransaction: false,
        pop_up_name: '',
        pop_up_status: false,
        count_response: false,
        redeemed_vouchers:0,
        allChartsData:{
            e_transaction :"",
            e_member_count:"",
            e_sale_count:"",
            e_gross_profit:"",
            e_discount_given:"",
            e_basket_size:"",
            intervals:"",
        }
    };

    componentDidMount = () => {

        //this.getStatsCount();

    };

    componentWillReceiveProps(props) {

        if((!props.dateHandler.showDatePicker && props.dateHandler.applyFilter)){
            this.setState(()=>({
                    start_date: props.dateHandler.start_date,
                    end_date: props.dateHandler.end_date
                }),
                () => {this.getOverallStats();this.getStatsCount(); this.remdeemedVouchers();});
        }
    }

    getStatsCount = () => {

        let url =  BaseUrl+'/api/soldi-overall-stats-count';
        axios.post(url,{
            'company_id': CompanyID,
            'venue_id': VenueID,
            'start_date': this.props.dateHandler.start_date,
            'end_date' : this.props.dateHandler.end_date,
            'filterby' : this.props.dateHandler.filterPeriod,
            'api_key'   : this.props.api_key,
            'secret_key' : this.props.secret_key,
            'business_id' : this.props.business_id,
            'business_name' : this.props.business_name
        }).then((response) => {
            if(response.data.status){
                this.setState(()=>({
                        overallStats: response.data.data,
                        count_response: true
                }),
                () => {
                    this.loadChartData();
                    this.loadChartData2("member_chart_status",this.state.overallStats.member_stats.data,this.state.overallStats.member_stats.intervals);



                });
            }else{
                show_loader(true);
            }
        }).catch((err) => {

            //NotificationManager.error("Internal Server error occurred.", 'Error');
        });

    };//..... end of getMemberStats() .....//*/

    remdeemedVouchers = () => {
        let url =  BaseUrl+'/api/totalRedeemVouchers';
        axios.post(url,{
            'company_id': CompanyID,
            'venue_id': VenueID,
            'start_date': this.props.dateHandler.start_date,
            'end_date' : this.props.dateHandler.end_date,
            'filterby' : this.props.dateHandler.filterPeriod,
        }).then((response) => {
            if(response.data.status){
                this.setState(()=>({
                        redeemed_vouchers: response.data.count
                    }),
                    () => {
                    this.loadChartData();
                    this.loadChartData2("voucher_redeem_chart",response.data.interval_data,response.data.intervals)
                });


            }else{
                show_loader(true);
            }
        }).catch((err) => {

            //NotificationManager.error("Internal Server error occurred.", 'Error');
        });

    };

    loadChartData = () => {

        this.config = {
            title: null,

            series: [{
                data: this.state.series,
                showInLegend: false
            }],

            credits: {
                enabled: false
            },

            xAxis: {
                categories: this.state.categories
            },

            yAxis: {
                title: false
            },
            chart: {
                type: 'area',
                //backgroundColor: '#E4E7EC'
            },
        };
        this.setState({
            config : this.config
        })
    };



    toggle(pop_up_name){
        //e_transaction,e_sale_count,e_sale_count,e_discount_given,e_basket_size,e_member_count
        this.setState({
            pop_up_name: pop_up_name,
            pop_up_status: !this.state.pop_up_status
        }, () => {
            if(this.state.pop_up_status){
                
            }
        });
    }

    getOverallStats = () => {
        let url =  BaseUrl+'/api/soldi-overall-stats-data';

        axios.post(url,{
            'company_id': CompanyID,
            'venue_id': VenueID,
            'start_date': this.props.dateHandler.start_date,
            'end_date' : this.props.dateHandler.end_date,
            'filterby' : this.props.dateHandler.filterPeriod,
            'api_key'   : this.props.api_key,
            'secret_key' : this.props.secret_key,
            'business_id' : this.props.business_id,
            'business_name': this.props.business_name
        }).then((response) => {
            if(response.data.status){
                show_loader(true);
                    let e_transaction = response.data.data.TransactionsData[0].TotalTransaction;
                    let e_member_count = response.data.data.TransactionsData[0].MemberCount;
                    let e_sale_count = response.data.data.TransactionsData[0].SaleCount;
                    let e_gross_profit = response.data.data.TransactionsData[0].GrossProfit;
                    let e_discount_given = response.data.data.TransactionsData[0].TotalDiscountGiven;
                    let e_basket_size = response.data.data.TransactionsData[0].AverageBasketValue;
                    let intervals = response.data.data.intervals;

                    let allChartsData =  {
                        e_transaction,
                        e_member_count,
                        e_sale_count,
                        e_gross_profit,
                        e_discount_given,
                        e_basket_size,
                        intervals
                    };
                    this.setState(()=>({allChartsData,response_status: true}),()=>{
                        this.populateChartsData();
                    });


                /*this.setState(()=>({
                        categories:intervals,
                        series: transData,
                        response_status: true
                    }),
                    () => {this.loadChartData();});

                if(this.state.pop_up_status){
                    show_loader(true);
                }*/

            }else{
                return {
                    e_transaction :"",
                    e_member_count:"",
                    e_sale_count:"",
                    e_gross_profit:"",
                    e_discount_given:"",
                    e_basket_size:"",
                    intervals:"",
                };
                show_loader(true);
            }
        }).catch((err) => {
            console.log(err);
            // show_loader(true);
            //NotificationManager.error("Internal Server error occurred.", 'Error');
        });

    };//..... end of getMemberStats() .....//*/

    populateChartsData = () => {
        let avg_basket_size = [];
        this.state.allChartsData.intervals.map((value,key)=>{
           avg_basket_size.push(0);
        });


        //e_transaction,,e_sale_count,e_discount_given,e_basket_size,e_member_count
        this.loadChartData2("e_sale_count",this.state.allChartsData.e_sale_count,this.state.allChartsData.intervals);
        this.loadChartData2("e_transaction",this.state.allChartsData.e_transaction,this.state.allChartsData.intervals);
        this.loadChartData2("e_member_count",this.state.allChartsData.e_member_count,this.state.allChartsData.intervals);
        this.loadChartData2("e_discount_given",this.state.allChartsData.e_discount_given,this.state.allChartsData.intervals);
        this.loadChartData2("e_basket_size",this.state.allChartsData.e_basket_size,this.state.allChartsData.intervals);
        this.loadChartData2("avg_basket_size",avg_basket_size,this.state.allChartsData.intervals);
    }

    loadChartData2 = (chart_config,data,intervals) => {

        this[chart_config] = {
            title: null,

            series: [{
                data: data /*this.state.series*/,
                showInLegend: false
            }],

            credits: {
                enabled: false
            },

            xAxis: {
                categories: intervals /*this.state.categories*/
            },

            yAxis: {
                title: false
            },
            chart: {
                type: 'area',
                //backgroundColor: '#E4E7EC'
            },
            legend: {
                verticalAlign: 'top',
            }
        };
        this.setState({
            config : this.config
        })
    };


    render() {
        return (
            <div className="e_dashboardcolumns_main">
                <div className="cmDashboard_columns">
                    <ul>
                        <li>
                            <div className="e_column_dboard clearfix">
                                <div className="column_dboard_widgetDetail2">
                                    <div className="columnHeading">
                                        <label>REVENUE</label>
                                        <div className="column_dboard_widgetBttn2" onClick={() => this.toggle('e_transaction')}>
                                            <div className={(this.state.pop_up_status)?'vidget_dropdown2 active':'vidget_dropdown2'}> <a  style={{cursor:'pointer'}} className="e_vidgetBtn2">&nbsp;</a> </div>
                                        </div>
                                    </div>
                                    <div className="averageSale_amountinfo">
                                        <div className="averageSale_amountinfo_head cmDashboard_colHead clearfix cmDashboard_pad">
                                            <label className="totalTransIcon">{Currency} {this.state.count_response ? (this.state.overallStats.TotalTransaction).toFixed(2): 0}</label>
                                            <strong className= {(this.state.overallStats.TransactionTrend < 0) ? "redcolor" : ""}>{(this.state.overallStats.TransactionTrend < 0)?<img src="assets/images/triangleLow@2x.png" alt="#" />:<img src="assets/images/triangleHigh@2x.png" alt="#" />}  {this.state.overallStats.TransactionTrend}%</strong>
                                        </div>
                                        <div className="salveAmountGraphs" style={{display: ( this.state.pop_up_status) ? "block" : "none"}}>
                                            {/*<img src="assets/images/saleAmout_graph.png" alt="#" style={{display: 'block', width: '100%'}} />*/}
                                            <ReactHighcharts config={this.e_transaction} ref={this.chart}></ReactHighcharts>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li>
                            <div className="e_column_dboard clearfix">
                                <div className="column_dboard_widgetDetail2">

                                    <div className="columnHeading">
                                        <label>TRANSACTION COUNT</label>
                                        <div className="column_dboard_widgetBttn2" onClick={() => this.toggle('e_sale_count')}>
                                            <div className={( this.state.pop_up_status)?'vidget_dropdown2 active':'vidget_dropdown2'}> <a  style={{cursor:'pointer'}} className="e_vidgetBtn2">&nbsp;</a> </div>
                                        </div>
                                    </div>

                                    <div className="averageSale_amountinfo">
                                        <div className="averageSale_amountinfo_head cmDashboard_colHead clearfix cmDashboard_pad">
                                            <label className="totalTransIcon">{this.state.count_response ? this.state.overallStats.SaleCount : 0}</label>
                                            <strong className= {(this.state.overallStats.SaleTrend < 0) ? "redcolor" : ""}>{(this.state.overallStats.SaleTrend < 0)?<img src="assets/images/triangleLow@2x.png" alt="#" />:<img src="assets/images/triangleHigh@2x.png" alt="#" />}  {this.state.overallStats.SaleTrend}%</strong></div>
                                        <div className="salveAmountGraph" style={{display: ( this.state.pop_up_status) ? "block" : "none"}}>
                                            {/*<img src="assets/images/saleAmout_graph.png" alt="#" style={{display: 'block', width: '100%'}} />*/}
                                            <ReactHighcharts config={this.e_sale_count} ref={this.chart}></ReactHighcharts>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>



                        <li>
                            <div className="e_column_dboard clearfix">
                                <div className="column_dboard_widgetDetail2">
                                    <div className="columnHeading ">
                                        <label>AVERAGE BASKET VALUE</label>
                                        <div className="column_dboard_widgetBttn2" onClick={() => this.toggle('e_basket_size')}>
                                            <div className={( this.state.pop_up_status)?'vidget_dropdown2 active':'vidget_dropdown2'}> <a  style={{cursor:'pointer'}} className="e_vidgetBtn2">&nbsp;</a> </div>
                                        </div>
                                    </div>
                                    <div className="averageSale_amountinfo">
                                        <div className="averageSale_amountinfo_head cmDashboard_colHead clearfix cmDashboard_pad cmDashboard_pad cmDashboard_pad">
                                            <label className="bascketValueIcon">{this.state.count_response ? (this.state.overallStats.BasketValue).toFixed(2):0}</label>
                                            <strong className= {(this.state.overallStats.BasketTrend < 0) ? "redcolor" : ""}>{(this.state.overallStats.BasketTrend < 0)?<img src="assets/images/triangleLow@2x.png" alt="#" />:<img src="assets/images/triangleHigh@2x.png" alt="#" />}  {this.state.overallStats.BasketTrend}%</strong></div>
                                        <div className="salveAmountGraph" style={{display: (this.state.pop_up_status) ? "block" : "none"}}>
                                            {/*<img src="assets/images/saleAmout_graph.png" alt="#" style={{display: 'block', width: '100%'}} />*/}
                                            <ReactHighcharts config={this.e_basket_size} ref={this.chart}></ReactHighcharts>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li>
                            <div className="e_column_dboard clearfix">
                                <div className="column_dboard_widgetDetail2">
                                    <div className="columnHeading ">
                                        <label>AVERAGE BASKET SIZE</label>
                                        <div className="column_dboard_widgetBttn2" onClick={() => this.toggle('avg_basket_size')}>
                                            <div className={( this.state.pop_up_status)?'vidget_dropdown2 active':'vidget_dropdown2'}> <a  style={{cursor:'pointer'}} className="e_vidgetBtn2">&nbsp;</a> </div>
                                        </div>

                                    </div>
                                    <div className="averageSale_amountinfo">
                                        <div className="averageSale_amountinfo_head cmDashboard_colHead clearfix cmDashboard_pad cmDashboard_pad cmDashboard_pad">
                                            <label className="bascketValueIcon">{this.state.count_response ? (this.state.overallStats.AverageBasketTrend).toFixed(2):0}</label>
                                            <strong className= {(this.state.overallStats.BasketTrend < 0) ? "redcolor" : ""}>{(this.state.overallStats.BasketTrend < 0)?<img src="assets/images/triangleLow@2x.png" alt="#" />:<img src="assets/images/triangleHigh@2x.png" alt="#" />}  {this.state.overallStats.AverageBasketTrend}%</strong></div>
                                        <div className="salveAmountGraph" style={{display: (this.state.pop_up_status) ? "block" : "none"}}>
                                            {/*<img src="assets/images/saleAmout_graph.png" alt="#" style={{display: 'block', width: '100%'}} />*/}
                                            <ReactHighcharts config={this.avg_basket_size} ref={this.chart}></ReactHighcharts>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li>
                            <div className="e_column_dboard clearfix">
                                <div className="column_dboard_widgetDetail2">

                                    <div className="columnHeading">
                                        <label>REDEEMED VOUCHERS</label>
                                        <div className="column_dboard_widgetBttn2" onClick={() => this.toggle('voucher_redeem_chart')}>
                                            <div className={( this.state.pop_up_status)?'vidget_dropdown2 active':'vidget_dropdown2'}> <a  style={{cursor:'pointer'}} className="e_vidgetBtn2">&nbsp;</a> </div>
                                        </div>
                                    </div>

                                    <div className="averageSale_amountinfo">
                                        <div className="averageSale_amountinfo_head cmDashboard_colHead clearfix cmDashboard_pad">
                                            <label className="totalTransIcon">{this.state.redeemed_vouchers ? this.state.redeemed_vouchers : 0}</label>
                                            <strong className= {(this.state.overallStats.SaleTrend < 0) ? "redcolor" : ""}>{(this.state.redeemed_vouchers < 0)?<img src="assets/images/triangleLow@2x.png" alt="#" />:<img src="assets/images/triangleHigh@2x.png" alt="#" />}  {this.state.redeemed_vouchers}</strong></div>
                                        <div className="salveAmountGraph" style={{display: ( this.state.pop_up_status) ? "block" : "none"}}>
                                            {/*<img src="assets/images/saleAmout_graph.png" alt="#" style={{display: 'block', width: '100%'}} />*/}
                                            <ReactHighcharts config={this.voucher_redeem_chart} ref={this.chart}></ReactHighcharts>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>


                        <li>
                            <div className="e_column_dboard clearfix">
                                <div className="column_dboard_widgetDetail2">
                                    <div className="columnHeading">
                                        <label>TOTAL DISCOUNT GIVEN</label>
                                        <div className="column_dboard_widgetBttn2" onClick={() => this.toggle('e_discount_given')}>
                                            <div className={(this.state.pop_up_status)?'vidget_dropdown2 active':'vidget_dropdown2'}> <a href="javascript:void(0)" className="e_vidgetBtn2">&nbsp;</a> </div>
                                        </div>
                                    </div>
                                    <div className="averageSale_amountinfo">
                                        <div className="averageSale_amountinfo_head cmDashboard_colHead clearfix cmDashboard_pad cmDashboard_pad cmDashboard_pad">
                                            <label className="totalDiscIcon2">{Currency} {this.state.count_response ? (this.state.overallStats.TotalDiscountGiven).toFixed(2):0}</label>
                                            <strong className= {(this.state.overallStats.DiscountTrend < 0) ? "redcolor" : ""}>{(this.state.overallStats.DiscountTrend < 0)?<img src="assets/images/triangleLow@2x.png" alt="#" />:<img src="assets/images/triangleHigh@2x.png" alt="#" />}  {this.state.overallStats.DiscountTrend}%</strong></div>
                                        <div className="salveAmountGraph" style={{display: ( this.state.pop_up_status) ? "block" : "none"}}>
                                            {/*<img src="assets/images/saleAmout_graph.png" alt="#" style={{display: 'block', width: '100%'}} /> */}
                                            <ReactHighcharts config={this.e_discount_given} ref={this.chart}></ReactHighcharts>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>


                        <li>
                            {/*<div className="e_column_dboard clearfix">
                                <div className="column_dboard_widgetDetail2">
                                    <div className="columnHeading">
                                        <label>TOTAL MEMBERS</label>
                                        <div className="column_dboard_widgetBttn2" onClick={() => this.toggle('e_member_count')}>
                                            <div className={(this.state.pop_up_name == 'e_member_count' && this.state.pop_up_status)?'vidget_dropdown2 active':'vidget_dropdown2'}> <a  style={{cursor:'pointer'}} className="e_vidgetBtn2">&nbsp;</a> </div>
                                        </div>
                                    </div>
                                    <div className="averageSale_amountinfo">
                                        <div className="averageSale_amountinfo_head cmDashboard_colHead clearfix cmDashboard_pad cmDashboard_pad">
                                            <label className="memberCountIcon">{this.state.count_response ? this.state.overallStats.TotalMembers : 0}</label>
                                            <strong className= {(this.state.overallStats.MemberTrend < 0) ? "redcolor" : ""}>{(this.state.overallStats.MemberTrend < 0)?<img src="assets/images/triangleLow@2x.png" alt="#" />:<img src="assets/images/triangleHigh@2x.png" alt="#" />}  {this.state.overallStats.MemberTrend}%</strong></div>
                                        <div className="salveAmountGraph" style={{display: (this.state.pop_up_name == 'e_member_count' && this.state.pop_up_status) ? "block" : "none"}}>
                                            <img src="assets/images/saleAmout_graph.png" alt="#" style={{display: 'block', width: '100%'}} />
                                            <ReactHighcharts config={this.config} ref={this.chart}></ReactHighcharts>
                                        </div>
                                    </div>
                                </div>
                            </div>*/}


                            <div className="e_column_dboard clearfix">
                                <div className="column_dboard_widgetDetail2">
                                    <div className="columnHeading ">
                                        <label>MEMBERS</label>
                                        <div className="column_dboard_widgetBttn2" onClick={() => this.toggle('member_chart_status')}>
                                            <div className={(this.state.pop_up_status)?'vidget_dropdown2 active':'vidget_dropdown2'}> <a  style={{cursor:'pointer'}} className="e_vidgetBtn2">&nbsp;</a> </div>
                                        </div>
                                    </div>
                                    <div className="averageSale_amountinfo">
                                        <div className="averageSale_amountinfo_head cmDashboard_colHead clearfix">
                                            <div className="eng_members_info">
                                                <ul>
                                                    <li>
                                                        <div className="eng_members_info_detail">
                                                            <strong><i><img src="images/search_total_mamber1.png" alt="#" /></i>{this.state.count_response ? this.state.overallStats.member_stats.total: 0}</strong>
                                                            <span>TOTAL</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="eng_members_info_detail">
                                                            <strong><i><img src="images/member_active_icon.png" alt="#" /></i>{this.state.count_response ? this.state.overallStats.member_stats.active: 0}</strong>
                                                            <span>ACTIVE</span>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="eng_members_info_detail">
                                                            <strong><i><img src="images/member_inactive_icon.png" alt="#" /></i>{this.state.count_response ? this.state.overallStats.member_stats.inactive: 0}</strong>
                                                            <span>INACTIVE</span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="salveAmountGraph"> <img src="images/saleAmout_graph.png" alt="#" style={{display: 'block', width: '100%'}} /> </div>


                                        <div className="salveAmountGraph" style={{display: ( this.state.pop_up_status) ? "block" : "none"}}>
                                            {/*<img src="assets/images/saleAmout_graph.png" alt="#" style={{display: 'block', width: '100%'}} /> */}
                                            <ReactHighcharts config={this.member_chart_status} ref={this.chart}></ReactHighcharts>
                                        </div>



                                    </div>
                                </div>
                            </div>
                        </li>

                        <li>
                            <div className="e_column_dboard clearfix">
                                <div className="column_dboard_widgetDetail2">
                                    <div className="columnHeading ">
                                        <label>MEMBER GROWTH</label>
                                        <div className="column_dboard_widgetBttn2" onClick={() => this.toggle('e_member_count')}>
                                            <div className={(this.state.pop_up_status)?'vidget_dropdown2 active':'vidget_dropdown2'}> <a  style={{cursor:'pointer'}} className="e_vidgetBtn2">&nbsp;</a> </div>
                                        </div>
                                    </div>
                                    <div className="averageSale_amountinfo">
                                        <div className="averageSale_amountinfo_head cmDashboard_colHead clearfix cmDashboard_pad">
                                            <label className="memberCountIcon">{this.state.count_response ? Math.round(this.state.overallStats.MemberCount): 0}</label>
                                            <strong className= {(this.state.overallStats.MemberTrend < 0) ? "redcolor" : ""}>{(this.state.overallStats.MemberTrend < 0)?<img src="assets/images/triangleLow@2x.png" alt="#" />:<img src="assets/images/triangleHigh@2x.png" alt="#" />}  {this.state.overallStats.MemberTrend}%</strong></div>
                                        <div className="salveAmountGraph" style={{display: ( this.state.pop_up_status) ? "block" : "none"}}>
                                            {/*<img src="assets/images/saleAmout_graph.png" alt="#" style={{display: 'block', width: '100%'}} /> */}
                                            <ReactHighcharts config={this.e_member_count} ref={this.chart}></ReactHighcharts>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>




                        {/*<li>
                            <div className="e_column_dboard clearfix">
                                <div className="column_dboard_widgetDetail2">
                                    <div className="columnHeading ">
                                        <label>GROSS PROFIT</label>
                                        <div className="column_dboard_widgetBttn2" onClick={() => this.toggle('e_gross_profit')}>
                                            <div className={(this.state.pop_up_status)?'vidget_dropdown2 active':'vidget_dropdown2'}> <a  style={{cursor:'pointer'}} className="e_vidgetBtn2">&nbsp;</a> </div>
                                        </div>
                                    </div>
                                    <div className="averageSale_amountinfo">
                                        <div className="averageSale_amountinfo_head cmDashboard_colHead clearfix cmDashboard_pad">
                                            <label className="totalDiscIcon1">{this.state.overallStats.GrossProfit}</label>
                                            <strong className= {(this.state.overallStats.GrossTrend < 0) ? "redcolor" : ""}>{(this.state.overallStats.GrossTrend < 0)?<img src="assets/images/triangleLow@2x.png" alt="#" />:<img src="assets/images/triangleHigh@2x.png" alt="#" />}  {this.state.overallStats.GrossTrend}%</strong></div>
                                        <div className="salveAmountGraph" style={{display: (this.state.pop_up_status) ? "block" : "none"}}>
                                            <img src="assets/images/saleAmout_graph.png" alt="#" style={{display: 'block', width: '100%'}} />
                                            <ReactHighcharts config={this.e_gross_profit} ref={this.chart}></ReactHighcharts>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>*/}










                    </ul>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of DetailList.

export default OverallStats;