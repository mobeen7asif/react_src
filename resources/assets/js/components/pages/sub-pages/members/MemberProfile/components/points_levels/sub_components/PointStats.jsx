import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';
import {NotificationManager} from "react-notifications";

class PointStats extends Component {


    state = {
        filter: 'year',
        categories: [],
        data: [],
        config : {},
        response_status: false,
        last_received: ''
    };
    config = {};

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//



    componentDidMount = () => {
        this.loadData();
    };//..... end of componentDidMount() .....//

    loadData = () => {
        //show_loader();
        // axios.post(BaseUrl + '/api/points-graph',{
        //     filter: this.state.filter,
        //     persona_id: this.props.persona_id
        // }).then((response) => {
        //     if(response.data.status) {
        //         this.setState({
        //             categories: response.data.dates,
        //             data: response.data.counts,
        //             last_received: response.data.last_received
        //         },() => {this.loadGraph();});
        //     }
        //
        //     show_loader(true);
        // }).catch((err) => {
        //     show_loader(true);
        //     NotificationManager.error("Internal Server error occurred.", 'Error');
        // });
    };

    loadGraph = () => {
        let config = {
            xAxis: {
                // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                categories: this.state.categories,
                gridLineColor: 'white',
                gridLineWidth: 1,
            },

            series: [{
                name: 'Loyalty Points',
                // data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                data: this.state.data
            }],
            title:{
                text:''
            },
        };
        this.setState({
            config:config,
            response_status: true
        })
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
    changeFilter = (filter) => {
        this.setState({filter: filter}, () => {this.loadData()});
    };//...... end of changeFilter() .....//

    render() {
       return (
           <div className="e_transactions_box">
               {
                   this.state.response_status && <div className="e_transactions_box">
                       <br/>
                       <div className="members_dayMain">
                           <div className="members_dayInner">
                               <ul>
                                   <li><a className={this.state.filter === 'week' ? 'active' : ''} href="javascript:void(0);" onClick={() => {this.changeFilter('week')}}>Week</a></li>
                                   <li><a className={this.state.filter === 'month' ? 'active' : ''} href="javascript:void(0);" onClick={() => {this.changeFilter('month')}}>Month</a></li>
                                   <li><a className={this.state.filter === 'year' ? 'active' : ''} href="javascript:void(0);" onClick={() => {this.changeFilter('year')}}>Year</a></li>
                               </ul>
                           </div>
                       </div>

                       <br/>
                       <div className="e_transactions_inner">

                           {
                               (this.state.response_status && <div className="e_transactions_graphOut">

                                   <div className="e_transactions_graph">
                                       {
                                           <ReactHighcharts config={this.state.config} ref={this.chart}/>
                                       }


                                   </div>
                               </div> )
                           }


                       </div>
                   </div>

               }




               <div className="e_transactionsValue_list">
                   <div className="cmDashboard_columns">
                       <ul>
                           <li>
                               <div className="column_dboard_widget2 clearfix">
                                   <div className="column_dboard_widgetDetail2">
                                       <div className="columnHeading">
                                           <label>MEMBERSHIP LEVEL</label>
                                       </div>
                                       <div className="averageSale_amountinfo">
                                           <div className="segment_gender_header greenBg blueBg clearfix">
                                               <div className="segment_gender_left">
                                                   <div className="segment_state_main">
                                                       <div className="segment_state_left"> </div>
                                                       <div className="segment_state_right"> <span>Silver</span> </div>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </li>
                           <li>e_transactionsValue_list
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
                                                       <div className="segment_state_right"> <span>{this.changeDateFormat(this.state.last_received)}</span> </div>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </li>
                          {/* <li>
                               <div className="column_dboard_widget2 clearfix">
                                   <div className="column_dboard_widgetDetail2">
                                       <div className="columnHeading">
                                           <label>CURRENT RANKING</label>
                                       </div>
                                       <div className="averageSale_amountinfo">
                                           <div className="segment_gender_header clearfix">
                                               <div className="segment_gender_left">
                                                   <div className="segment_state_main">
                                                       <div className="segment_state_left">
                                                           <div className="e_transactions_icon"> <span><img src={BaseUrl+"/assets/images/current_ranking_icon.png"} alt="#" /></span> </div>
                                                       </div>
                                                       <div className="segment_state_right"> <span>14</span> </div>
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
             {/*  <div className="e_transactionsValue_list">
                   <div className="cmDashboard_columns">
                       <ul>
                           <li className="width_100">
                               <div className="column_dboard_widget2 clearfix">
                                   <div className="column_dboard_widgetDetail2">
                                       <div className="statusNext_main clearfix">
                                           <div className="segment_gender_left">
                                               <div className="columnHeading">
                                                   <label>STATUS TO NEXT LEVEL</label>
                                               </div>
                                           </div>
                                           <div className="segment_gender_right">
                                               <h4><b>185</b> / 300</h4>
                                           </div>
                                       </div>
                                       <div className="averageSale_amountinfo">
                                           <div className="segment_gender_header clearfix">
                                               <div className="status_next_progressOut">
                                                   <div className="statusNext_progress">
                                                       <div className="statusNext_progressInner"> </div>
                                                   </div>
                                               </div>
                                               <div className="statusNext_text">
                                                   <p>115 Points to reach next level</p>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </li>
                       </ul>
                   </div>
               </div>*/}
           </div>


       );
    }//..... end of render() .....//
}//..... end of Member.

PointStats.propTypes = {};

export default PointStats;
