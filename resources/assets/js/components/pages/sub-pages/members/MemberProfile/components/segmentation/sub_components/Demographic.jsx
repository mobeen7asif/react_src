import React, {Component} from 'react';
import ReactHighcharts from 'react-highcharts';
import {NotificationManager} from "react-notifications";

class Demographic extends Component {


    ages = ['0-14', '15-34', '35-44', '45-55'];
    state = {
        demographic : false,
        gender : '',
        gender_count: 0,
        total_members: 0,
        male_percentage: 0,
        female_percentage: 0,
        unknown_percentage: 0,
        other_percentage: 0,
        age_graph_data:[],
        member_age: 0,
        total_age_members: 0,
        response_status: false,
        config : {},
        ageConfig : {}
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentWillMount = () => {
        //this.loadGenderGraph();
        //this.loadAgeGraph();
    };

    loadGenderGraph = () => {
        let config =
            {
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    gridLineWidth: 0
                },
                legend: {
                    enabled: false
                },
                tooltip: "none",
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f}%'
                        }
                    }
                },

                series: [
                    {
                        colorByPoint: true,
                        data: [
                            {
                                name: "Male",
                                y: this.state.male_percentage,
                                color: '#a2cd3a',
                                showInLegend: false,
                            },
                            {
                                name: "Female",
                                y: this.state.female_percentage,
                                color: '#0a62a3',
                                showInLegend: false,
                            },
                            {
                                name: "Other",
                                y: this.state.other_percentage,
                                color: '#003a5d',
                                showInLegend: false,
                            },
                            {
                                name: "Unknown",
                                y: this.state.unknown_percentage,
                                color: '#00C1DE',
                                showInLegend: false,
                            },
                        ]
                    }
                ],
                credits: {
                    enabled: false
                },
            };
        this.setState({config: config, response_status: true})

    };

    loadAgeGraph = () => {
        let  ageConfig = {
            chart: {
                type: 'column',

            },
            tooltip: '',
            xAxis: {
                categories: this.ages,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: '',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                },
                gridLineWidth: 0,
                minorGridLineWidth: 0,

            },
            plotOptions: {
                column: {
                    pointPadding: 0.25,
                    borderWidth: 0,
                    groupPadding: 0.01,
                },
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.1f}%',
                        color:'black'
                    }
                }
            },
            // legend: {
            //     layout: 'vertical',
            //     align: 'right',
            //     verticalAlign: 'top',
            //     x: -40,
            //     y: 80,
            //     floating: true,
            //     borderWidth: 1,
            //     backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            //     shadow: true
            // },
            credits: {
                enabled: false
            },
            title: null,
            series: [
                {
                    color: '#a2cd3a',
                    showInLegend: true,
                    data: [this.state.age_graph_data[0][0],this.state.age_graph_data[1][0],this.state.age_graph_data[2][0],this.state.age_graph_data[3][0]],
                    name: 'Male'
                },
                {
                    color: '#0a62a3',
                    showInLegend: true,
                    data: [this.state.age_graph_data[0][1],this.state.age_graph_data[1][1],this.state.age_graph_data[2][1],this.state.age_graph_data[3][1]],
                    name: 'Female'
                },
                {
                    data: [this.state.age_graph_data[0][2],this.state.age_graph_data[1][2],this.state.age_graph_data[2][2],this.state.age_graph_data[3][2]],
                    color: '#003a5d',
                    showInLegend: true,
                    name: 'Other'
                },
                {
                    data: [this.state.age_graph_data[0][3],this.state.age_graph_data[1][3],this.state.age_graph_data[2][3],this.state.age_graph_data[3][3]],
                    color: '#00C1DE',
                    showInLegend: true,
                    name: 'Unknown'
                },
            ]
        };
        this.setState({ageConfig: ageConfig, response_status: true})
    };

    componentDidMount = () => {
        show_loader();
        axios.post(BaseUrl + '/api/get-demographic-data',{
            persona_id: this.props.persona_id,
            venue_id: VenueID,
            company_id: CompanyID,
            rangeData: this.ages
        }).then((response) => {
            this.setState({
                gender : response.data.gender,
                gender_count : response.data.gender_count,
                male_percentage: response.data.male,
                female_percentage: response.data.female,
                other_percentage: response.data.other,
                unknown_percentage: response.data.unknown,
                total_members: response.data.total,
                age_graph_data: response.data.age_graph_data,
                member_age: response.data.member_age,
                total_age_members: response.data.total_age_members
            }, () => {this.loadGenderGraph(); this.loadAgeGraph()});


            show_loader(true);
        }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });


    };//..... end of componentDidMount() .....//

    render() {
        let background = BaseUrl+'/assets/images/male_pic@2x.png';
        background = `url(${background})`;
        return (
            <div className="e_segmentdemographic">
                <div className="cmDashboard_columns">
                    <ul>
                        <li>
                            <div className="column_dboard_widget2 clearfix">
                                <div className="column_dboard_widgetDetail2">
                                    <div className="columnHeading">
                                        <label>GENDER SPLIT</label>
                                    </div>
                                    <div className="averageSale_amountinfo">
                                        <div className="segment_gender_header blueBg clearfix">
                                            {
                                                this.state.gender !== '' ?
                                                    <div>
                                                        <div className="segment_gender_left">
                                                            <h4 className={ (() => {
                                                                if (this.state.gender === 'M')
                                                                    return 'male_gender_display';
                                                                if (this.state.gender === 'F')
                                                                    return 'female_gender_display';
                                                                if(this.state.gender === 'O')
                                                                    return 'other_gender_display'
                                                            })()}>{
                                                                (() => {
                                                                    if (this.state.gender === 'M')
                                                                        return 'Male';
                                                                    if (this.state.gender === 'F')
                                                                        return 'Female';
                                                                    if(this.state.gender === 'O')
                                                                        return 'Other'
                                                                })()
                                                            }</h4>
                                                        </div>
                                                        <div className="segment_gender_right">
                                                            <h4><b>{this.state.gender_count}</b> / {this.state.total_members}</h4>
                                                            <span>Gender Segment</span>
                                                        </div>
                                                    </div>
                                                    : ''
                                            }



                                        </div>
                                        <div className="salveAmountGraph">
                                            {
                                                (this.state.response_status && <ReactHighcharts config={this.state.config} ref={this.chart}/>)
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="column_dboard_widget2 clearfix">
                                <div className="column_dboard_widgetDetail2">
                                    <div className="columnHeading">
                                        <label>AGE SPLIT</label>
                                    </div>
                                    <div className="averageSale_amountinfo">
                                        <div className="segment_gender_header clearfix">
                                            {this.state.member_age > 0 ?
                                                <div className="segment_gender_left">
                                                    <h1>{this.state.member_age}<span>YEARS <br />OLD</span></h1>
                                                </div>
                                                : ''}

                                            <div className="segment_gender_right">
                                                <h4><b>{this.state.total_age_members}</b> / {this.state.total_members}</h4>
                                                <span>Age Segment</span>
                                            </div>
                                        </div>
                                        <div className="salveAmountGraph">
                                            {
                                                (this.state.response_status && <ReactHighcharts config={this.state.ageConfig} ref={this.chart}/>)
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        {/* <li>
                            <div className="column_dboard_widget2 clearfix">
                                <div className="column_dboard_widgetDetail2">
                                    <div className="columnHeading">
                                        <label>STATE</label>
                                    </div>
                                    <div className="averageSale_amountinfo">
                                        <div className="segment_gender_header darkBlueBg blueBg clearfix">
                                            <div className="segment_gender_left">
                                                <div className="segment_state_main">
                                                    <div className="segment_state_left">
                                                        <div className="segment_state_circle">
                                                            <img src={BaseUrl+"/assets/images/segment_state_circle.png"} alt="#" style={{display: 'block'}} />
                                                        </div>
                                                    </div>
                                                    <div className="segment_state_right">
                                                        <span>NSW</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="segment_gender_right">
                                                <h4><b>5 000</b> / 10 000</h4>
                                                <span>State Segment</span>
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
                                        <label>STATE</label>
                                    </div>
                                    <div className="averageSale_amountinfo">
                                        <div className="segment_gender_header clearfix">
                                            <div className="segment_gender_left">
                                                <div className="segment_state_main">
                                                    <div className="segment_state_left">
                                                        <div className="segment_postal_circle">
                                                            <img src={BaseUrl+"/assets/images/segment_postal_circle.png"} alt="#" style={{display: 'block'}} />
                                                        </div>
                                                    </div>
                                                    <div className="segment_state_right">
                                                        <span>NSW</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="segment_gender_right">
                                                <h4><b>5 000</b> / 10 000</h4>
                                                <span>State Segment</span>
                                            </div>
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
}//..... end of Member.

Demographic.propTypes = {};

export default Demographic;