import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';


class Campaign extends Component {
    state = {
        chanelUtilizationChartData  : [],
        bestCampaignChartData       : [],
        total_campaign              : 0,
        set_and_forget              : 0,
        proximity                   : 0
    };
    colors = ['#84c4d7','#709ea9','#6ea988','#f07f48','#f15d3e','#fcc93c','#84c4d7','#709ea9','#6ea988','#f07f48','#f15d3e','#fcc93c'];

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    componentDidMount = () => {
        this.getDashboardData();
        this.hideChartOptions();
    };

    getDashboardData = (type = 'all', filter = '') => {
        axios.post(BaseUrl + '/api/campaign-dashboard-data', {type, filter})
            .then((response) => {
                this.setState(() => ({...response.data}));
            }).catch((err) => {
                console.error(err);
        });
    };//..... end of getDashboardData() .....//

    componentDidUpdate = (prevProps, PrevState) => {
        this.hideChartOptions();
    };//..... end of componentDidUpdate() .....//

    hideChartOptions = () => {
        document.querySelector(".highcharts-legend").style.display  = "none";
        document.querySelector(".highcharts-credits").style.display = "none";
    };//..... end of hideChartOptions() .....//

    render() {
        return (
            <div className="venueDashbord ">
                <div className="dashborad_column clearfix">
                    <div className="column6_db" style={{maxHeight: '523px', minHeight: '523px'}}>
                        <div className="venueHead">
                            <h4>CHANNEL UTILISATION</h4>
                            <div className="venueDropdown">
                                <div className="campaign_select">
                                    <span>Last Week</span>
                                    <select id="channel_utilization"  onChange={(e)=>{this.getDashboardData('chu', e.target.value) }}>
                                        <option value="all">All</option>
                                        <option value="last_week">Last Week</option>
                                        <option value="last_three_month">Last Three Months</option>
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
                                <div id="chanal_utilization_donut" >
                                    <ReactHighcharts  config = {this.chanelUtilizationChart()} />
                                </div>
                            </div>

                            <div className="chanel_chart_description" style={{marginTop: '16%'}}>
                                <ul>
                                    {
                                        this.state.chanelUtilizationChartData.map((value, key) => {
                                            return (
                                                <li key={key}>
                                                    <div className="chanel_descriptionList clearfix">
                                                        <b style={{background: this.colors[key]}}>&nbsp;</b>
                                                        <div className="chanel_descriptionList_text clearfix">
                                                            <p>{value.name}</p>
                                                            <strong>{value.y}</strong>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="column6_db unscribeRates" style={{maxHeight: '523px', minHeight: '523px'}}>
                        <div className="venueHead">
                            <h4>BEST CAMPAIGN REDEMPTION RATE BY VENUE</h4>
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
                        <div className="unscribeChart barrGrapgh">
                            <div id="campaign_bar_chart">
                                <ReactHighcharts  config = {this.bestCampaignChart()} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="activeHeading">
                    <h4>ACTIVE CAMPAIGNS</h4>
                </div>
                <div className="dashborad_Totalcolumn clearfix">
                    <ul>
                        <li>
                            <div className="column_dboard_widget activeCompaignColumn clearfix">
                                <div className="activeCompaign_icon">
                                    <a href="#">&nbsp;</a>
                                </div>
                                <div className="column_dboard_widgetDetail">
                                    <strong>{this.state.total_campaign}</strong>
                                    <small>Total Campaigns</small>
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
                            <div className="column_dboard_widget seleted_widget activeCompaignColumn clearfix">
                                <div className="activeCompaign_icon">
                                    <a href="#" className="forgetIcon">&nbsp;</a>
                                </div>
                                <div className="column_dboard_widgetDetail">
                                    <strong>{this.state.set_and_forget}</strong>
                                    <small>Set and forget</small>
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
                            <div className="column_dboard_widget  activeCompaignColumn clearfix">
                                <div className="activeCompaign_icon">
                                    <a href="#" className="dynamicIcon">&nbsp;</a>
                                </div>
                                <div className="column_dboard_widgetDetail">
                                    <strong>{this.state.proximity}</strong>
                                    <small>Proximity</small>
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

    chanelUtilizationChart = () => {
        return (
            {
                chart: {
                    renderTo: 'chanal_utilization_donut',
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
                        return '<b>'+ this.point.name +'</b> '+ this.y +'%';
                    }
                },
                legend: {
                    itemMarginTop: 20
                },
                series: [{
                    name: 'Browsers',
                    data: this.state.chanelUtilizationChartData,
                    size: '110%',
                    innerSize: '80%',
                    startAngle:30,
                    distance: 20,
                    showInLegend:true,
                    dataLabels: {
                        formatter: function () {
                            return '<span style="color:' + this.point.color + '; font-size:12px;text-align:center">'+this.point.name +' </span><br><div style="color:' + this.point.color + '">' + this.y + '% ('+this.point.total_members+' Members)</div>';
                        }
                    }
                }]
            }
        );
    };//..... end of chanelUtilizationChart() .....//

    bestCampaignChart = () => {
        return (
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
                    max:100
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
                        colors:['#a3bfca', '#709ea9','#2f6d7c','#6ea988']
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
                },
                series: [{
                    point: {
                        events: {}
                    },
                    name: 'Brands',
                    colorByPoint: true,
                    data:this.state.bestCampaignChartData
                }]
            }
        );
    };//..... end of bestCampaignChart() .....//
}//..... end of Campaign.

Campaign.propTypes = {};

export default Campaign;