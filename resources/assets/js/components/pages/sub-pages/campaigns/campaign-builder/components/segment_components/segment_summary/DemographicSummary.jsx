import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';
import {connect} from 'react-redux';

class DemographicSummary extends Component {

    colors = [ '#00C1DE', '#6ea988', '#f07f48', '#f15d3e', '#fcc93c', '#84c4d7', '#709ea9', '#6ea988', '#f07f48', '#f15d3e', '#fcc93c','#FD3D50'];

    componentDidMount = () => {

        DemographicSummary.hideChartOptions();
    };//..... end of componentDidMount() .....//

    componentDidUpdate = (prevProps, PrevState) => {
        DemographicSummary.hideChartOptions();
    };//..... end of componentDidUpdate() .....//

    static hideChartOptions() {
        Array.prototype.slice.call(document.querySelectorAll(".highcharts-legend, .highcharts-credits")).forEach((element) => {
            element.style.display = 'none';
        });
    }//..... end of hideChartOptions() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="segmentsCriterias">
                <div className="criterias_heading">
                    <h3>1. Demographic Criteria</h3>
                </div>

                <div className="criteria_detail">
                    <div className="democretic_age_gender criteriaDemo clearfix">
                        <ul>
                            <li style={{width: '50%', float: 'left'}}>
                                <div className="democretic_gender">
                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Total User in segment</h3>
                                            {/*<div className="segmntClose">
                                                <a  style={{cursor:'pointer'}}>&nbsp;</a>
                                            </div>*/}
                                        </div>
                                        <div className="democretic_genderDetail clearfix">
                                            <div className="democretic_genderDetail_graph" id='totalUsersChart'  style={{maxHeight: '380px'}}>
                                                <ReactHighcharts  config = {this.getTotalUsersConfig()} callback={this.setTotalUsersChartText}/>
                                                <div id="totalUsersChartText" style={{position: 'relative',left: '83px', top: '-246px'}} >
                                                    <span id="pieChartTotalUsersInfoText" style={{textAlign: 'center'}}>&nbsp;</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            {((this.props.type != 'saved' && (this.props.new_segment.hasOwnProperty("criterias") && this.props.new_segment.criterias[0].name !=='allUsers')) &&
                            <li style={{width: '50%'}}>
                                <div className="democretic_gender">
                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Segment Gender Split</h3>
                                           {/* <div className="segmntClose">
                                                <a  style={{cursor:'pointer'}}>&nbsp;</a>
                                            </div>*/}
                                        </div>
                                        <div className="democretic_genderDetail clearfix">
                                            <div className="democretic_genderDetail_graph" id='totalGenderChart' style={{maxHeight: '380px'}}>
                                                <ReactHighcharts  config = {this.getTotalGenderConfig()} callback={this.setGenderChartText}/>
                                                <div id="genderChartText" style={{position: 'relative',left: '83px', top: '-276px'}} >
                                                    <span id="pieChartGenderInfoText" style={{textAlign: 'center'}}>&nbsp;</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>)}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//

    /**
     * Get Chart configuration.
     * @returns Object.
     */
    getTotalUsersConfig = () => {
        return {
            chart: {
                renderTo: 'totalUsersChart',
                backgroundColor: '#fff',
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
                    size: '100%',
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                    },
                    colors: ['#f07f48']
                }
            },
            tooltip: {
                formatter: function () {
                    let y = this.y;
                    if (this.point.name === 'Data Not Found')
                        y = 0;
                    return '<b>' + this.point.name.toUpperCase() + '</b>: ' + y + '%';
                }
            },
            series: [{
                name: 'Browsers',
                data: [{name: 'Total Users', y: this.props.total_users, total: this.props.total_users}],
                size: '110%',
                innerSize: '80%',
                startAngle: 30,
                distance: 20,
                showInLegend: true,
                dataLabels: {
                    formatter: function () {
                        return '<span style={{color:' + this.point.color + ', fontSize: "15px"}}>' + this.y + '</span><br>' +
                            '<span style={{color:' + this.point.color + ', fontSize:"10px", fontWeight:"bold"}}>' + this.point.name.toUpperCase() + '</span><br>';
                    }
                }
            }]
        };
    };//..... end of getConfig() .....//

    getTotalGenderConfig = () => {
        return {
            chart: {
                renderTo: 'totalUsersChart',
                backgroundColor: '#fff',
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
                    size: '100%',
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                    },
                    colors: this.colors
                }
            },
            tooltip: {
                formatter: function () {
                    let y = this.y;
                    if (this.point.name === 'Data Not Found')
                        y = 0;
                    return '<b>' + this.point.name.toUpperCase() + '</b>: ' + y + '%';
                }
            },
            series: [{
                name: 'Browsers',
                data: [{name: 'Male Users', y: this.props.total_male, total: this.props.total_users}, {name: 'Female Users', y: this.props.total_female, total: this.props.total_users}],
                size: '110%',
                innerSize: '80%',
                startAngle: 30,
                distance: 20,
                showInLegend: true,
                dataLabels: {
                    formatter: function () {
                        return '<span style={{color:' + this.point.color + ', fontSize: "15px"}}>' + this.y + '</span><br>' +
                            '<span style={{color:' + this.point.color + ', fontSize:"10px", fontWeight:"bold"}}>' + this.point.name.toUpperCase() + '</span><br>';
                    }
                }
            }]
        };
    };//..... end of getTotalGenderConfig() .....//

    setGenderChartText = (chart) => {
        let data = [{name: 'Male Users', y: this.props.total_male ? this.props.total_male : 0, total: this.props.total_users ? this.props.total_users : 0},
                     {name: 'Female Users', y: this.props.total_female ? this.props.total_female : 0, total: this.props.total_users ? this.props.total_users : 0}];
        let genderChartText = document.querySelector('#pieChartGenderInfoText');
            genderChartText.textContent = '';

        data.forEach((value) => {
            let span = document.createElement('span');
            span.setAttribute('class', 'customChartValue');
            span.textContent = value["y"];
            let span2 = document.createElement('span');
            span2.setAttribute('class', 'customChartLabel');
            span2.textContent = value["name"];
            genderChartText.appendChild(span);
            genderChartText.appendChild(document.createElement('br'));
            genderChartText.appendChild(span2);
            genderChartText.appendChild(document.createElement('br'));
        });

        genderChartText.style.left = (chart.plotLeft + (chart.plotWidth * 0.5)) + (genderChartText.clientWidth * -0.5);
        genderChartText.style.top = (chart.plotTop + (chart.plotHeight * 0.5)) + (genderChartText.clientHeight * -0.5);
    };//...... end of setGenderChartText() .....//

    setTotalUsersChartText = (chart) => {
        let data = [{name: 'Total Users', y: this.props.total_users ? this.props.total_users : 0, total: this.props.total_users ? this.props.total_users : 0}];
        let totalUsersChartText = document.querySelector('#pieChartTotalUsersInfoText');
        totalUsersChartText.textContent = '';

        data.forEach((value) => {
            let span = document.createElement('span');
            span.setAttribute('class', 'customChartValue');
            span.textContent = value["y"];
            let span2 = document.createElement('span');
            span2.setAttribute('class', 'customChartLabel');
            span2.textContent = value["name"];
            totalUsersChartText.appendChild(span);
            totalUsersChartText.appendChild(document.createElement('br'));
            totalUsersChartText.appendChild(span2);
            totalUsersChartText.appendChild(document.createElement('br'));
        });

        totalUsersChartText.style.left = (chart.plotLeft + (chart.plotWidth * 0.5)) + (totalUsersChartText.clientWidth * -0.5);
        totalUsersChartText.style.top = (chart.plotTop + (chart.plotHeight * 0.5)) + (totalUsersChartText.clientHeight * -0.5);
    };//..... end of setTotalUsersChartText() .....//
}//..... end of DemographicCriteria.

const mapStateToProps = (state) => {
    return {
        total_users :    state.campaignBuilder.segment.segment_users.total_users,
        total_male  :     state.campaignBuilder.segment.segment_users.total_male,
        total_female:   state.campaignBuilder.segment.segment_users.total_female,
        new_segment :    state.campaignBuilder.segment.new_segment,
        type        :    state.campaignBuilder.segment.type
    };
};

export default connect(mapStateToProps)(DemographicSummary);