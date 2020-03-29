import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';

class TargetSummary extends Component {
    chart = null;
    colors = ['#FD3D50', '#00C1DE', '#6ea988', '#f07f48', '#f15d3e', '#fcc93c', '#84c4d7', '#709ea9', '#6ea988', '#f07f48', '#f15d3e', '#fcc93c'];

    componentDidMount() {
        TargetSummary.hideChartOptions();
        /*if (this.chart) {
            this.chart = this.chart.getChart();
        }*///..... end if() .....//
        //this.chart.series[0].setData([{name: 'Tassaduq', y: 50}, {name: 'Hussain', y: 60}]);
    }//..... end of componentDidMount() .....//

    componentWillUnmount() {
        /*if(this.chart)
            this.chart.destroy();*/
    }//..... end of componentWillUnmount() .....//

    componentDidUpdate(prevProps, PrevState) {
        //if (this.chart)
            //this.chart.series[0].setData(this.state.chartData);
        TargetSummary.hideChartOptions();
    }//..... end of componentDidUpdate() .....//

    static hideChartOptions() {
        document.querySelector(".highcharts-legend").style.display  = "none";
        document.querySelector(".highcharts-credits").style.display = "none";
    }//..... end of hideChartOptions() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="chanelTarget_summery">
                <div className="column6_db">
                    <div className="venueHead">
                        <h4>TARGET SUMMARY</h4>
                        <p>This campaign will target</p>
                    </div>
                    <div className="venueHighChart_outer clearfix">
                        <div className="chanelTarget_summery_value">
                            <strong>{(this.props.totalMembers.toLocaleString())?this.props.totalMembers.toLocaleString():0}</strong>
                            <small>members</small>
                            <p>Which is <b>{this.props.totalPercentage.toFixed(2)}%</b> of the segment</p>
                            <span>{this.props.segmentName}</span>
                        </div>

                        <div className="chanel_chart">
                            <ReactHighcharts  config = {this.getConfig()} ref={(chart) => {this.chart = chart}}/>
                        </div>

                        <div className="chanel_chart_description">
                            <ul>
                                {
                                    this.props.chartData.map((obj, index) => {
                                        return (
                                            <li key={index}>
                                                <div className="chanel_descriptionList clearfix">
                                                    <b style={{backgroundColor: (obj.name === 'Data Not Found') ? '#a5adba': this.colors[index]}}>&nbsp;</b>
                                                    <div className="chanel_descriptionList_text clearfix">
                                                        <p>{ obj.name.toUpperCase() }</p>
                                                        <strong>{(obj.name === 'Data Not Found') ? 0 : obj.total} </strong>
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
            </div>
        );
    }//..... end of render() .....//

    /**
     * Get Chart configuration.
     * @returns Object.
     */
    getConfig() {
        return {
            chart: {
                renderTo: 'targetChannelsChart',
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
                    colors: (this.props.chartData.length === 1 && this.props.chartData[0].name === 'Data Not Found') ? ['#a5adba'] : this.colors
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
                data: this.props.chartData,
                size: '110%',
                innerSize: '80%',
                startAngle: 30,
                distance: 20,
                showInLegend: true,
                dataLabels: {
                    formatter: function () {
                        return '<span style={{color:' + this.point.color + ', fontSize: "15px"}}>' + this.y + '%</span><br>' +
                            '<span style={{color:' + this.point.color + ', fontSize:"10px", fontWeight:"bold"}}>' + this.point.name.toUpperCase() + '</span><br>';
                    }
                }
            }]
        };
    }//..... end of getConfig() .....//
}//..... end of TargetSummary.

export default TargetSummary;