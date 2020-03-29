import React, {Component} from 'react';
import { render } from 'react-dom';
import ReactHighcharts from 'react-highcharts';
// import OverallStats from './OverallStats';

class TotalTransactions extends Component {


    state = {
        response_status : false,
        config : {},
        start_date : '',
        end_date : '',
        series : [],
        categories : [],
        overallStats : []
    };

    componentDidMount = () => {
        show_loader();

        //this.getTransactionsData();
    };

    componentWillReceiveProps(props) {
        if((!props.dateHandler.showDatePicker && props.dateHandler.applyFilter)){
            show_loader();
            this.setState(()=>({
                    start_date: props.dateHandler.start_date,
                    end_date: props.dateHandler.end_date
                }),
                () => { this.getTransactionsData();});
        }
    }

    getTransactionsData = () => {
        let url =  BaseUrl+'/api/soldi-transactions-data';
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
                let transData = response.data.data.TransactionsData;
                let intervals = response.data.data.interval;
                let series = [];

                $.each(transData, function( index, transRow ) {
                    // (transRow, index);
                    if(transRow.name == 'Total Transactions') {
                        series.push({
                            name: 'Total Revenue',
                            data: transRow.data
                        });
                    }

                });

                this.setState(()=>({
                        categories:intervals,
                        series: series,
                        response_status: true,
                        overallStats: response.data.data
                    }),
                    () => {this.loadChartData();});
                show_loader(true);

            }else{
                show_loader(true);
            }
        }).catch((err) => {

            //NotificationManager.error("Internal Server error occurred.", 'Error');
        });

    };//..... end of getMemberStats() .....//*/

    loadChartData = () => {

        this.setState(()=>({
            config : {
                title: {
                    text: 'Total Revenue'
                },
                xAxis: {
                    categories: this.state.categories,
                    gridLineColor: 'white',
                    gridLineWidth: 1,
                },
                yAxis: {
                    title:{
                        text:"Revenue"
                    }
                },
                series: this.state.series,

                chart: {
                    type: 'area',
                    backgroundColor: '#E4E7EC'
                },
                credits: {
                    enabled: false
                },

            }
        }))
    };

    render() {
        return (
            <div className="e_dashboard_tarans" style={{paddingBottom: 0}}>
                <div className="e_dashboard_taransGraph">
                    {
                        (this.state.response_status &&
                            <ReactHighcharts config={this.state.config} ref={this.chart}></ReactHighcharts>
                        )
                    }
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of DetailList.

export default TotalTransactions;

