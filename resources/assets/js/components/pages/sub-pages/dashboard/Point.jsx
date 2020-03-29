import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Point extends Component {

    componentDidMount = () => {
        this.pointDashboardCharts();
    };

    pointDashboardCharts = () => {
        let data1,data2,data3,data4;
        axios.get(BaseUrl+'/api/point-dashboard-charts/'+VenueID ).then((arr)=>{
            if(arr.data){
                data1 = arr.data.pointme_users_percentage;
                data2 = arr.data.total_patrons;
                data3 = arr.data.total_patronss;
                data4 = arr.data.total_patronsss;
                this.load_charts(data1,'PreviewGaugeMeter_2');
                this.load_charts(data2,'redemption_rate_point_me_host');
                this.load_charts(data3,'redemption_rate_sms_host');
                this.load_charts(data4,'redemption_rate_email_host');

            }else{
                this.load_charts(1,'PreviewGaugeMeter_2');
                this.load_charts(1,'redemption_rate_point_me_host');
                this.load_charts(1,'redemption_rate_sms_host');
                this.load_charts(1,'redemption_rate_email_host');
            }
        });
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    load_charts = (value,id) =>{
        $("#"+id).attr("data-percent",value);
        $("#"+id).gaugeMeter();
    };

    render() {
        return (
            <div className="venueDashbord">
                <div className="dashborad_column memberChartOuter clearfix">
                    <ul>
                        <li>
                            <div className="column6_db">
                                <div className="venueHead">
                                    <h4>USERS</h4>
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
                                <div className="menber_chard">
                                    <div style={{display:'block', margin:'auto'}}  className="GaugeMeter" id="PreviewGaugeMeter_2" data-percent="70" data-append="%" data-size="250" data-color="rgb(7, 119, 176)" data-back="#F5F6F8" data-animate_gauge_colors="0" data-animate_text_colors="1" data-width="10" data-label="20 Memberships" data-style="Arch" data-label_color="#2492C0"></div>
                                    <span className="left_span_0">0</span>
                                    <span className="right_span_100">100%</span>
                                </div>
                            </div>
                        </li>
                        <li className="point_member">
                            <div className="column6_db">
                                <div className="venueHead">
                                    <h4>AVERAGE CAMPAIGN REDEMPTION RATES</h4>
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
                                <div className="points_chart_columns clearfix">
                                    <div className="menber_chard">
                                        <div style={{display:'block', margin:'auto'}}  className="GaugeMeter" id="redemption_rate_point_me_host" data-percent="70" data-append="%" data-size="200" data-color="rgb(7, 119, 176)" data-back="#F5F6F8" data-animate_gauge_colors="0" data-animate_text_colors="1" data-width="8" data-label="{{$pointme_host['total_patrons']}} Memberships" data-style="Arch" data-label_color="#2492C0"></div>
                                        <span className="left_span_0">0</span>
                                        <span className="right_span_100">100%</span>
                                    </div>
                                    <div className="menber_chard">
                                        <div style={{display:'block', margin:'auto'}}  className="GaugeMeter" id="redemption_rate_sms_host" data-percent="70" data-append="%" data-size="200" data-color="rgb(7, 119, 176)" data-back="#F5F6F8" data-animate_gauge_colors="0" data-animate_text_colors="1" data-width="8" data-label="{{$pointme_host['total_patrons']}} Memberships" data-style="Arch" data-label_color="#2492C0"></div>
                                        <span className="left_span_0">0</span>
                                        <span className="right_span_100">100%</span>
                                    </div>
                                    <div className="menber_chard">
                                        <div style={{display:'block', margin:'auto'}}  className="GaugeMeter" id="redemption_rate_email_host" data-percent="70" data-append="%" data-size="200" data-color="rgb(7, 119, 176)" data-back="#F5F6F8" data-animate_gauge_colors="0" data-animate_text_colors="1" data-width="8" data-label="{{$pointme_host['total_patrons']}} Memberships" data-style="Arch" data-label_color="#2492C0"></div>
                                        <span className="left_span_0">0</span>
                                        <span className="right_span_100">100%</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of Point.

Point.propTypes = {};

export default Point;