import React, {Component} from 'react';
import { render } from 'react-dom';
import ReactHighcharts from 'react-highcharts';
import {NotificationManager} from "react-notifications";

class GenderSplit extends Component {

    config = {};
    state = {
        allMaleData : [0,0,0,0,0],
        allFemaleData : [0,0,0,0,0],
        allOtherData : [0,0,0,0,0],
        allUnknownData : [0,0,0,0,0],
        response_status : false,
        config : '',
        start_date : '',
        end_date : ''
    };

    categories = [
        '0-17', '17-24', '24-34', '34-44','44-150'
    ];

    showCategories = [
        '0-17', '17-24', '24-34', '34-44','44+'
    ];

    componentDidMount = () => {
        // show_loader();
        this.preLoader = $("body").find('.preloader3');
        this.getGenderStats();
    };

    componentWillReceiveProps(props) {
        if(!props.dateHandler.showDatePicker && props.dateHandler.applyFilter){
            this.setState(()=>({
                    start_date: props.dateHandler.start_date,
                    end_date: props.dateHandler.end_date
                }),
                () => {this.getGenderStats();});
            // show_loader(true);
        }
    }

    getGenderStats = () => {
        // show_loader();
        axios.post(BaseUrl + '/api/all-gender-stats',{
            venue_id: VenueID,
            company_id: CompanyID,
            rangeData : this.categories,
            start_date: this.state.start_date,
            end_date : this.state.end_date,
            filterPeriod : this.props.dateHandler.filterPeriod,

        }).then((response) => {
            if(response.data.status){
                this.setState(()=>({
                        allMaleData: response.data.maleData,
                        allFemaleData: response.data.femaleData,
                        allOtherData: response.data.otherData,
                        allUnknownData: response.data.unknownData,
                        response_status: true}),
                    () => {this.loadChartData();});
                // show_loader(true);
            }else{
                // show_loader(true);
            }
        }).catch((err) => {

            // show_loader(true);
            //NotificationManager.error("Internal Server error occurred.", 'Error');
        });

    };//..... end of getMemberStats() .....//

    loadChartData = () => {
        this.config = {
            title: null,
            chart: {
                type: 'bar'
            },

            xAxis: {
                categories: this.showCategories,
                reversed: false
            },
            yAxis: {
                min: 0,
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: [{
                name: 'Unknown',
                data: this.state.allUnknownData,
                // color: '#A2CD3A',
            }, {
                name: 'Other',
                data: this.state.allOtherData,
                // color: '#003A5D',
            }, {
                name: 'Female',
                data: this.state.allFemaleData,
                color: '#A5E8FF',
            }, {
                name: 'Male',
                data: this.state.allMaleData,
                color: '#0A62A3',
            }],
            credits: {
                enabled: false
            }
        }

        /*this.config = {
            chart: {
                type: 'bar'
            },
            xAxis: [{
                categories: this.showCategories,
                reversed: false,
                labels: {
                    step: 1
                }
            }, { // mirror axis on right side
                opposite: true,
                reversed: false,
                categories: this.showCategories,
                linkedTo: 0,
                labels: {
                    step: 1
                }
            }],
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    formatter: function () {
                        return Math.abs(this.value);
                    }
                }
            },

            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },

            title: null,

            tooltip: {
                formatter: function() {
                    return this.x + '<br/>' + this.series.name + ': ' + Math.abs(this.y);
                }
            },

            series: [{
                name: 'Male',
                data: this.state.allMaleData,
                color: '#0A62A3',
            }, {
                name: 'Female',
                data: this.state.allFemaleData,
                color: '#A2CD3A',
            }],

            credits: {
                enabled: false
            },

        };*/
        this.setState({
            config : this.config
        })
    };

    render() {

        return (
            <li className="width_50">
                <div className="e_column_dboard clearfix">
                    <div className="column_dboard_widgetDetail2">
                        <div className="columnHeading">
                            <label>AGE / GENDER SPLIT</label>
                        </div>
                        <div className="chartColumn2 clearfix">

                            <div className="averageSale_amountinfo">
                                <div className="segment_gender_header clearfix">
                                    <div className="ageGenderSplit_main">
                                        <div className="ageGenderSplit">
                                            {
                                                (this.state.response_status &&

                                                    <ReactHighcharts config={this.config} />

                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </li>
        );
    }//..... end of render() .....//
}//..... end of DetailList.

export default GenderSplit;

