import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import ReactHighcharts from 'react-highcharts';
class Graph extends Component {

    state = {
        filter: 'year',
        categories: [],
        data: [],
        config : {},
        response_status: false
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
        axios.post(BaseUrl + '/api/sent-campaigns-graph',{
            company_id: CompanyID,
            venue_id: VenueID,
            filter: this.state.filter,
            persona_id: this.props.persona_id,
        }).then((response) => {
            this.setState({
                categories: response.data.dates,
                data: response.data.counts
            },() => {this.loadGraph();});
            show_loader(true);
        }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
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
                name: 'Sent Campaigns',
                // data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                data: this.state.data
            }],
            title:{
                text:''
            },
            chart: {
                type: 'area'
                //backgroundColor: '#E4E7EC'
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
            return moment(data*1000).format("DD/MM/YYYY");
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
               <div className="e_transactions_graphOut">
                   <h5>SENT CAMPAIGNS</h5>
                   <br/>

                   {
                       this.state.response_status &&

                       <div className="members_dayMain">
                           <div className="members_dayInner">
                               <ul>
                                   <li><a className={this.state.filter === 'week' ? 'active' : ''} href="javascript:void(0);" onClick={() => {this.changeFilter('week')}}>Week</a></li>
                                   <li><a className={this.state.filter === 'month' ? 'active' : ''} href="javascript:void(0);" onClick={() => {this.changeFilter('month')}}>Month</a></li>
                                   <li><a className={this.state.filter === 'year' ? 'active' : ''} href="javascript:void(0);" onClick={() => {this.changeFilter('year')}}>Year</a></li>
                               </ul>
                           </div>
                       </div>
                   }



                   <br/>
                   <div className="e_transactions_graph">
                       {
                           (this.state.response_status && <ReactHighcharts config={this.state.config} ref={this.chart}/>)
                       }

                   </div>
               </div>
           </div>
       );
    }//..... end of render() .....//
}//..... end of Member.

Graph.propTypes = {};

export default Graph;
