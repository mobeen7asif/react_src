import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';

class Venue extends Component {
    state = {
        venueByLocation         : [],
        highestUnsubscribeRate  : [],
        last_month_onboarded    : 0,
        avg                     : 0,
        total_venues            : 0
    };

    colors= ['#84c4d7','#709ea9','#6ea988','#f07f48','#f15d3e','#fcc93c','#84c4d7','#709ea9','#6ea988','#f07f48','#f15d3e','#fcc93c'];

    componentDidMount = () => {
        this.hideChartOptions();
        this.getDashboardData();
    };

    componentDidUpdate = (prevProps, PrevState) => {
        this.hideChartOptions();
    };//..... end of componentDidUpdate() .....//

    hideChartOptions = () => {
        document.querySelector(".highcharts-legend").style.display  = "none";
        // document.querySelector(".highcharts-credits").style.display = "none";
        $('.highcharts-credits').css('display','none');
    };//..... end of hideChartOptions() .....//

    getDashboardData = (type = 'all', filter = '') => {
        document.getElementById('span_campaign_select').innerHTML = filter === 'all' || filter === '' ? 'All Channels' : filter;
        axios.post(BaseUrl + '/api/venue-dashboard-data', {type, filter, company_id: CompanyID})
            .then((response) => {
                this.setState(() => ({...response.data}));
            }).catch((err) => {
                console.error(err);
        });
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="venueDashbord dataHide tabClick_1_show" style={{display: 'block'}}>
                <div className="dashborad_column clearfix">
                    <div className="column6_db" style={{maxHeight: '523px', minHeight: '523px'}}>
                        <div className="venueHead">
                            <h4>VENUE BY LOCATION</h4>
                            <div className="venueDropdown">
                                <div className="campaign_select">
                                    <span>All</span>
                                    <select>
                                        <option>All</option>
                                        <option>2</option>
                                        <option>3</option>
                                    </select>
                                </div>
                            </div>

                            <div className="vidget_dropdown">
                                <a  style={{cursor:'pointer'}} className="vidgetBtn">&nbsp;</a>
                                <ul className="showOptions">
                                    <li>
                                        <a  style={{cursor:'pointer'}}>Edit</a>
                                    </li>
                                    <li>
                                        <a  style={{cursor:'pointer'}}>Add</a>
                                    </li>
                                    <li>
                                        <a  style={{cursor:'pointer'}}>Delete</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="venueHighChart_outer clearfix">
                            <div className="chanel_chart">
                                <div id="venue_by_location_donuts">
                                    <ReactHighcharts  config = {this.getConfig()} />
                                </div>
                            </div>

                            <div className="chanel_chart_description" style={{marginTop: '21%'}}>
                                <ul>
                                    {
                                        this.state.venueByLocation.map((value, key) => {
                                            return (<li key={key}>
                                                <div className="chanel_descriptionList clearfix">
                                                    <b style={{background: this.colors[key]}}>&nbsp;</b>
                                                    <div className="chanel_descriptionList_text clearfix">
                                                        <p>{value.name ? value.name : 'Unknown'}</p>
                                                        <strong>{value.y} </strong>
                                                    </div>
                                                </div>
                                            </li>);
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="column6_db unscribeRates" style={{maxHeight: '523px', minHeight: '523px'}}>
                        <div className="venueHead">
                            <h4>HIGHEST UNSUBSCRIBE RATES</h4>
                            <div className="venueDropdown">
                                <div className="campaign_select">
                                    <span id="span_campaign_select">All Channels</span>
                                    <select id="channelValueId" onChange={(e) => { this.getDashboardData('usr', e.target.value) }}>
                                        <option value="all">All Channels</option>
                                        <option >Pointme</option>
                                        <option >SMS</option>
                                        <option >Email</option>
                                    </select>
                                </div>
                            </div>
                            <div className="vidget_dropdown">
                                <a  style={{cursor:'pointer'}} className="vidgetBtn">&nbsp;</a>
                                <ul className="showOptions">
                                    <li>
                                        <a  style={{cursor:'pointer'}}>Edit</a>
                                    </li>
                                    <li>
                                        <a  style={{cursor:'pointer'}}>Add</a>
                                    </li>
                                    <li>
                                        <a  style={{cursor:'pointer'}}>Delete</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="unscribeChart">
                            <div id="highest_unsubscribe_bar_chart" >
                                <ReactHighcharts  config = {this.getHighestSubscribedConfig()} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashborad_Totalcolumn clearfix">
                    <ul>
                        <li>
                            <div className="column_dboard_widget clearfix">
                                <div className="column_dboard_widgetDetail">
                                    <label>TOTAL VENUES</label>
                                    <strong id="total_alveo_venue">{this.state.total_venues}</strong>
                                    <small>Famous Brands</small>
                                </div>

                                <div className="column_dboard_widgetBttn">
                                    <div className="vidget_dropdown">
                                        <a  style={{cursor:'pointer'}} className="vidgetBtn">&nbsp;</a>
                                        <ul className="showOptions">
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Edit</a>
                                            </li>
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Add</a>
                                            </li>
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Delete</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li>
                            <div className="column_dboard_widget seleted_widget clearfix">
                                <div className="column_dboard_widgetDetail">
                                    <label>TOTAL CHANGE</label>
                                    <strong>{this.state.last_month_onboarded}</strong>
                                    <small>Famous Brands</small>
                                </div>

                                <div className="column_dboard_widgetBttn">
                                    <div className="vidget_dropdown">
                                        <a  style={{cursor:'pointer'}} className="vidgetBtn">&nbsp;</a>
                                        <ul className="showOptions">
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Edit</a>
                                            </li>
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Add</a>
                                            </li>
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Delete</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li>
                            <div className="column_dboard_widget clearfix">
                                <div className="column_dboard_widgetDetail">
                                    <label>Average Unsubscribe Rate</label>
                                    <strong id="average_unsub_rate">{this.state.avg}%</strong>
                                    <small>Famous Brands</small>
                                </div>

                                <div className="column_dboard_widgetBttn">
                                    <div className="vidget_dropdown">
                                        <a  style={{cursor:'pointer'}} className="vidgetBtn">&nbsp;</a>
                                        <ul className="showOptions">
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Edit</a>
                                            </li>
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Add</a>
                                            </li>
                                            <li>
                                                <a  style={{cursor:'pointer'}}>Delete</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }//..... end of render() .....//

    getConfig(){
        return (
            {
                chart: {
                    renderTo: 'venue_by_location_donuts',
                    backgroundColor: '#ffffff',
                    type: 'pie'
                },
                title: {
                    text: ' '
                },
                yAxis: {
                    title: {
                        text: 'Total percent market share'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false,
                        },
                        colors: this.colors
                    }
                },

                tooltip: {
                    formatter: function() {
                        return '<b>'+ this.point.name +'</b>: '+ this.y +'';
                    }
                },

                series: [{
                    name: 'Browsers',
                    data: this.state.venueByLocation,
                    size: '110%',
                    innerSize: '80%',
                    startAngle:30,
                    distance: 20,
                    showInLegend:true,
                    dataLabels: {
                        formatter: function () {
                            return '<span style="color:' + this.point.color + '; font-size:15px;">' + this.y + '</span><br>'+
                                '<span style="color:' + this.point.color + '; font-size:10px; font-weight:bold;">'+this.point.name+'</span><br>';
                        }
                    }
                }]
            }
        );
    }//..... end of getConfig() .....//

    getHighestSubscribedConfig () {
        return(
        {
            chart: {
                type: 'column',
                    backgroundColor: '#ffffff'
            },
            title: {
                text: ' '
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                labels: {
                    format: '{value}%'
                },
                min:0,
                    max:100,
                    tickInterval: 25,
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                        dataLabels: {
                        enabled: false,
                            format: '{point.y}'
                    },
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                },
                pie: {
                    colors: this.colors
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px"></span><br>',
                    pointFormat: '<span style="color:{point.color}"> <b>{point.y}</b>%</span><br/>'
            },
            series: [{
                point: {
                    events: {
                    }
                },
                name: 'Brands',
                colorByPoint: true,
                data:this.state.highestUnsubscribeRate
            }]
        }
        );
    }//..... end of getHighestSubscribedConfig() .....//
}//..... end of Venue.

export default Venue;