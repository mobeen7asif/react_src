import React, {Component} from 'react';

class Member extends Component {
    state = {
        memberVisitationHost : 0,
        memberTurnOverHost   : 0,
        memberPointMeHost    : 0,
        total_membership     : 0,
        clubNewmembers       : 0,
        total_venues         : 0
    };

    componentDidMount = () => {
        this.getDashboardData();
    };

    getDashboardData = () => {
        axios.get(BaseUrl + '/api/member-dashboard-data/'+VenueID).then(response => {
            this.setState(() => ({...response.data}), () => {
                this.pd_members_visitation_host('On this time yesterday');
                this.pd_members_turnover_chart_host('On this time yesterday');
                this.pd_pointme_user_dwell_host('On this time yesterday');
            });
        }).catch((err) => {
           console.error(err);
        });
    };//..... end of getDashboardData() .....//

    pd_members_visitation_host(txt)
    {
        var percent_factor_big = 83;
        var percent_factor_small = 81;
        let wr_prcnt_visitation = parseInt(this.state.memberVisitationHost);
        var $ele = $('#members_visitation');
        var new_prcnt_visitation;
        if(wr_prcnt_visitation >100){ wr_prcnt_visitation = 100;}
        if(wr_prcnt_visitation < -100 ){ wr_prcnt_visitation = -100;}

        if(wr_prcnt_visitation == 1){ new_prcnt_visitation = 1;}
        else if(wr_prcnt_visitation == -1){ new_prcnt_visitation = -1;}
        else{new_prcnt_visitation = parseInt((percent_factor_big * wr_prcnt_visitation)/100);}
        var minus_color = 'rgb(224,50,51)';
        var plus_color = 'rgb(7, 119, 176)';

        if(new_prcnt_visitation > 0)
        {
            var interval3 = 1;
            var members_visitation_interval = setInterval(function(){
                if(interval3 == new_prcnt_visitation) clearInterval(members_visitation_interval);
                $('#members_visitation').find('.custom-right').css({
                    "background-image": "-webkit-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) " + interval3 + "%, transparent " + interval3 + "%, transparent 100%)",
                });
                $('#members_visitation').find('.custom-right').css({
                    "background-image": "-moz-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) " + interval3 + "%, transparent " + interval3 + "%, transparent 100%)"
                });
                $('#members_visitation').find('.custom-right').css({
                    "background-image": "-0-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) " + interval3 + "%, transparent " + interval3 + "%, transparent 100%)"
                });

                $('#members_visitation').find('.custom-right').css({
                    "background-image": "linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) " + interval3 + "%, transparent " + interval3 + "%, transparent 100%)",
                });
                interval3++;
            }, 5);

            $ele.find('.wr-p-container').css('color',plus_color);
            $ele.find('.percent-text.symbol').text('+');
            $ele.find('.percent-text.symbol').addClass('plus_icon');

        }
        if(new_prcnt_visitation < 0)
        {
            new_prcnt_visitation = Math.abs(new_prcnt_visitation);
            wr_prcnt_visitation = Math.abs(wr_prcnt_visitation);

            var interval_4 = 1;
            var member_turnover_interval = setInterval(function () {
                if (interval_4 == new_prcnt_visitation)
                    clearInterval(member_turnover_interval);

                $('#members_visitation').find('.custom-left').css({
                    "background-image": "-webkit-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5)" + interval_4 + "%, transparent " + interval_4 + "%, transparent 100%)",
                });
                $('#members_visitation').find('.custom-left').css({
                    "background-image": "-moz-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval_4 + "%, transparent " + interval_4 + "%, transparent 100%)",
                });
                $('#members_visitation').find('.custom-left').css({
                    "background-image": "-o-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval_4 + "%, transparent " + interval_4 + "%, transparent 100%)",
                });
                $('#members_visitation').find('.custom-left').css({
                    "background-image": "linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval_4 + "%, transparent " + interval_4 + "%, transparent 100%)",
                });

                interval_4++;
            }, 5);

            $ele.find('.wr-p-container').css('color',minus_color);
            $ele.find('.percent-text.symbol').text('-');
            $ele.find('.percent-text.symbol').addClass('minus_icon');
        }

        $ele.find('.percent-num').prop('counter',0).animate({
            counter: wr_prcnt_visitation
        }, {
            duration: 1500,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
        // e.find('.percent-num').text(wr_prcnt_visitation);
        $ele.find('.wr-chart-circle').children('p').text(txt);
    }

    pd_members_turnover_chart_host(txt)
    {
        var percent_factor_big = 83;
        var percent_factor_small = 81;
        var wr_prcnt = parseInt(this.state.memberTurnOverHost);
        var new_prcnt_turnover;
        var $e = $('#members_turnover_chart');
        if(wr_prcnt >100){ wr_prcnt = 100;}
        if(wr_prcnt < -100 ){ wr_prcnt = -100;}

        if(wr_prcnt == 1){ new_prcnt_turnover = 1;}
        else if(wr_prcnt == -1){ new_prcnt_turnover = -1;}
        else{ new_prcnt_turnover = Math.ceil(parseInt((percent_factor_big * wr_prcnt)/100));}
        var minus_color = 'rgb(224,50,51)';
        var plus_color = 'rgb(77, 119, 176)';

        if(new_prcnt_turnover > 0)
        {
            var interval1 = 1;
            var member_turnover_interval = setInterval(function(){
                if(interval1 == new_prcnt_turnover) clearInterval(member_turnover_interval);

                $('#members_turnover_chart').find('.custom-right').css({
                    "background-image": "-webkit-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) "+interval1+"%, transparent "+interval1+"%, transparent 100%)",
                });
                $('#members_turnover_chart').find('.custom-right').css({
                    "background-image": "-moz-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) "+interval1+"%, transparent "+interval1+"%, transparent 100%)",
                });
                $('#members_turnover_chart').find('.custom-right').css({
                    "background-image": "-o-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) "+interval1+"%, transparent "+interval1+"%, transparent 100%)",
                });
                $('#members_turnover_chart').find('.custom-right').css({
                    "background-image": "linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) "+interval1+"%, transparent "+interval1+"%, transparent 100%)",
                });
                interval1++;
            }, 5);

            $e.find('.wr-p-container').css('color',plus_color);
            $e.find('.percent-text.symbol').text('+');
            $e.find('.percent-text.symbol').addClass('plus_icon');
        }
        if(new_prcnt_turnover < 0)
        {
            new_prcnt_turnover = Math.abs(new_prcnt_turnover);
            wr_prcnt = Math.abs(wr_prcnt);
            var $custom_left = $e.find('.custom-left');

            var interval2 = 1;
            var member_turnover_interval2 = setInterval(function () {
                if (interval2 == new_prcnt_turnover)
                    clearInterval(member_turnover_interval2);

                $('#members_turnover_chart').find('.custom-left').css({
                    "background-image": "-webkit-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval2 + "%, transparent " + interval2 + "%, transparent 100%)",
                });
                $('#members_turnover_chart').find('.custom-left').css({
                    "background-image": "-moz-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval2 + "%, transparent " + interval2 + "%, transparent 100%)",
                });
                $('#members_turnover_chart').find('.custom-left').css({
                    "background-image": "-o-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval2 + "%, transparent " + interval2 + "%, transparent 100%)",
                });
                $('#members_turnover_chart').find('.custom-left').css({
                    "background-image": "linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval2 + "%, transparent " + interval2 + "%, transparent 100%)",
                });

                interval2++;
            }, 5);

            $e.find('.wr-p-container').css('color',minus_color);
            $e.find('.percent-text.symbol').text('-');
            $e.find('.percent-text.symbol').addClass('minus_icon');
        }

        $e.find('.percent-num').prop('counter',0).animate({
            counter: wr_prcnt
        }, {
            duration: 1500,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
        $e.find('.wr-chart-circle').children('p').text(txt);
    }

   pd_pointme_user_dwell_host(txt)
    {
        var percent_factor_big = 83;
        var percent_factor_small = 81;
        var wr_prcnt_pointme = parseInt(this.state.memberPointMeHost);
        var $el = $('#pointme_users_dwell');
        var new_prcnt_pointme;
        if(wr_prcnt_pointme >100){ wr_prcnt_pointme = 100;}
        if(wr_prcnt_pointme < -100 ){ wr_prcnt_pointme = -100;}

        if(wr_prcnt_pointme == 1){ new_prcnt_pointme = 1;}
        else if(wr_prcnt_pointme == -1){ new_prcnt_pointme = -1;}
        else{new_prcnt_pointme = parseInt((percent_factor_big * wr_prcnt_pointme)/100);}

        var minus_color = 'rgb(224,50,51)';
        var plus_color = 'rgb(7, 119, 176)';

        if(new_prcnt_pointme > 0)
        {
            var interval5 = 1;
            var pointme_interval = setInterval(function(){
                if(interval5 == new_prcnt_pointme) clearInterval(pointme_interval);
                $('#pointme_users_dwell').find('.custom-right').css({
                    "background-image": "-webkit-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) " + interval5 + "%, transparent " + interval5 + "%, transparent 100%)"
                });
                $('#pointme_users_dwell').find('.custom-right').css({
                    "background-image": "-moz-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) " + interval5 + "%, transparent " + interval5 + "%, transparent 100%)"
                });
                $('#pointme_users_dwell').find('.custom-right').css({
                    "background-image": "-o-linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) " + interval5 + "%, transparent " + interval5 + "%, transparent 100%)"
                });
                $('#pointme_users_dwell').find('.custom-right').css({
                    "background-image": "linear-gradient(top, rgb(7, 119, 176), rgba(7, 119, 176,0.5) " + interval5 + "%, transparent " + interval5 + "%, transparent 100%)"
                });
                interval5++;
            }, 5);

            $el.find('.wr-p-container').css('color',plus_color);
            $el.find('.percent-text.symbol').text('+');
            $el.find('.percent-text.symbol').addClass('plus_icon');
        }
        if(new_prcnt_pointme < 0)
        {
            new_prcnt_pointme = Math.abs(new_prcnt_pointme);
            wr_prcnt_pointme = Math.abs(wr_prcnt_pointme);
            var $custom_left3 = $el.find('.custom-left');
            var interval_6 = 1;
            var pointme_interval_2 = setInterval(function(){
                if(interval_6 == new_prcnt_pointme) clearInterval(pointme_interval_2);
                $('#pointme_users_dwell').find('.custom-left').css({
                    "background-image": "-webkit-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval_6 + "%, transparent " + interval_6 + "%, transparent 100%)",
                });

                $('#pointme_users_dwell').find('.custom-left').css({
                    "background-image": "-moz-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval_6 + "%, transparent " + interval_6 + "%, transparent 100%)"
                });

                $('#pointme_users_dwell').find('.custom-left').css({
                    "background-image": "-o-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval_6 + "%, transparent " + interval_6 + "%, transparent 100%)"
                });

                $('#pointme_users_dwell').find('.custom-left').css({
                    "background-image": "-moz-linear-gradient(top, rgb(224,50,51), rgba(224,50,51,0.5) " + interval_6 + "%, transparent " + interval_6 + "%, transparent 100%)"
                });
                interval_6++;
            }, 5);
            $el.find('.wr-p-container').css('color',minus_color);
            $el.find('.percent-text.symbol').text('-');
            $el.find('.percent-text.symbol').addClass('minus_icon');
        }

        $el.find('.percent-num').prop('counter',0).animate({
            counter: wr_prcnt_pointme
        }, {
            duration: 1500,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
        // e.find('.percent-num').text(wr_prcnt_pointme);
        $el.find('.wr-chart-circle').children('p').text(txt);
    }

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="venueDashbord">
                <div className="dashborad_column memberChartOuter clearfix">
                    <ul>
                        <li>
                            <div className="column6_db">
                                <div className="venueHead">
                                    <h4>TOTAL MEMBER VISITATION</h4>
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
                                    <div id="members_visitation" className="wr-chart-container  wr-chart-big" >
                                        <div className="wr-chart-left">&nbsp;</div>
                                        <div className="wr-chart-left custom-left">&nbsp;</div>
                                        <div className="wr-chart-circle">
                                            <div>0</div>
                                            <div className="wr-p-container" style={{color: 'rgb(73, 184, 80)'}}>
                                                <span className="percent-text symbol">+</span><span counter="0" className="percent-num">0</span> <span className="percent-text">%</span>
                                            </div>
                                            <p>On Yesterday</p>
                                        </div>
                                        <div className="wr-chart-right">&nbsp;</div>
                                        <div className="wr-chart-right custom-right">&nbsp;</div>
                                        <div className="wr-chart-button">
                                            <div style={{paddingRight: '24px'}}>
                                                <a  style={{cursor:'pointer'}}>-</a></div>
                                            <div style={{paddingLeft: '35px'}}>
                                                <a  style={{cursor:'pointer'}} >+</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="column6_db">
                                <div className="venueHead">
                                    <h4>TOTAL MEMBER TURNOVER</h4>
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
                                    <div id="members_turnover_chart" className="wr-chart-container wr-chart-big" >
                                        <div className="wr-chart-left">&nbsp;</div>
                                        <div className="wr-chart-left custom-left">&nbsp;</div>
                                        <div className="wr-chart-circle">
                                            <div>0</div>
                                            <div className="wr-p-container" style={{color: 'rgb(73, 184, 80'}}>
                                                <span className="percent-text symbol">+</span><span counter="0" className="percent-num">0</span> <span className="percent-text">%</span>
                                            </div>
                                            <p>On Yesterday</p>
                                        </div>
                                        <div className="wr-chart-right">&nbsp;</div>
                                        <div className="wr-chart-right custom-right">&nbsp;</div>
                                        <div className="wr-chart-button">
                                            <div style={{paddingRight: '30px'}}>
                                                <a  style={{cursor:'pointer'}}>-</a></div>
                                            <div style={{paddingLeft: '30px'}}>
                                                <a  style={{cursor:'pointer'}} >+</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="column6_db">
                                <div className="venueHead">
                                    <h4>TOTAL POINTME USER DWELL TIME</h4>
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
                                    <div id="pointme_users_dwell" className="wr-chart-container  wr-chart-big" >
                                        <div className="wr-chart-left">&nbsp;</div>
                                        <div className="wr-chart-left custom-left">&nbsp;</div>
                                        <div className="wr-chart-circle">
                                            <div style={{fontSize: '15px', paddingTop: '10px', color: '#000', fontWeight: 'bold'}}>0</div>
                                            <div className="wr-p-container" style={{color: 'rgb(73, 184, 80)'}}>
                                                <span className="percent-text symbol">+</span><span counter="0" className="percent-num">0</span> <span className="percent-text">%</span>
                                            </div>
                                            <p>On Yesterday</p>
                                        </div>
                                        <div className="wr-chart-right">&nbsp;</div>
                                        <div className="wr-chart-right custom-right">&nbsp;</div>
                                        <div className="wr-chart-button">
                                            <div style={{paddingRight: '22px'}}>
                                                <a  style={{cursor:'pointer'}}>-</a></div>
                                            <div style={{paddingLeft: '43px'}}>
                                                <a  style={{cursor:'pointer'}} >+</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="dashborad_Totalcolumn clearfix">
                    <ul>
                        <li>
                            <div className="column_dboard_widget clearfix">
                                <div className="column_dboard_widgetDetail">
                                    <label>TOTAL MEMBERSHIPS</label>
                                    <strong id="total_membership">{this.state.total_membership}</strong>
                                    <small>Famouse Brands</small>
                                </div>
                                <div className="column_dboard_widgetBttn">
                                    <div className="vidget_dropdown">
                                        <a  style={{cursor:'pointer'}} className="vidgetBtn">&nbsp;</a>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="column_dboard_widget seleted_widget clearfix">
                                <div className="column_dboard_widgetDetail">
                                    <label>Club Membership</label>
                                    <strong id="club_membership">{this.state.clubNewmembers}</strong>
                                    <small>Famous Brands</small>
                                </div>
                                <div className="column_dboard_widgetBttn">
                                    <div className="vidget_dropdown">
                                        <a  style={{cursor:'pointer'}} className="vidgetBtn">&nbsp;</a>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="column_dboard_widget clearfix">
                                <div className="column_dboard_widgetDetail">
                                    <label>TOTAL VENUES</label>
                                    <strong id="total_venues">{this.state.total_venues}</strong>
                                    <small>Famous Brands</small>
                                </div>
                                <div className="column_dboard_widgetBttn">
                                    <div className="vidget_dropdown">
                                        <a  style={{cursor:'pointer'}} className="vidgetBtn">&nbsp;</a>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of Member.

export default Member;