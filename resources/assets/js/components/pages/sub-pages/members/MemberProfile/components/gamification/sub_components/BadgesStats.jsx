import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";

class BadgesStats extends Component {

    state = {
        total_badges : 0,
        last_received : '',
        outstanding_badges : 0,
        badges : [],
        latest_badges : []
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//


    componentDidMount = () => {
        this.loadBadgesStats();
    };

    loadBadgesStats = () => {
        let url = BaseUrl + '/api/badges-stats';
        axios.post(url, {
            'company_id': CompanyID,
            'venue_id': VenueID,
            'persona_id': this.props.persona_id,
        }).then(res => {
           this.setState({total_badges : res.data.count, last_received: this.changeDateFormat(res.data.last_received), badges: res.data.badges, latest_badges:res.data.latest_badges }, () => {this.loadSlickPlugin();})
        }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while Badges Stats", 'Error');
        });
    };
    loadSlickPlugin = () => {
        $('.e_badges_slider').slick({
            dots: false,
            infinite: true,
            speed: 300,
            slidesToShow: 5,
            slidesToScroll: 1,
            centerMode: false,
            centerPadding: '60px',
            autoplay: false,
            autoplaySpeed: 2000,
            responsive: [
                {
                    breakpoint: 1025,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                    }
                },
                {
                    breakpoint: 601,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                },

                // You can unslick at a given breakpoint now by adding:
                // settings: "unslick"
                // instead of a settings object
            ]
        });
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


    render() {
       return (
           <div className="e_transactions_box">
               <div className="e_gamification_main clearfix">
                   <div className="e_gamification_left">
                       <div className="e_transactionsValue_list">
                           <div className="cmDashboard_columns">
                               <ul>
                                   <li>
                                       <div
                                           className="column_dboard_widget2 clearfix">
                                           <div
                                               className="column_dboard_widgetDetail2">
                                               <div className="columnHeading">
                                                   <label>LAST RECIEVED </label>
                                               </div>
                                               <div
                                                   className="averageSale_amountinfo">
                                                   <div
                                                       className="segment_gender_header blueBg clearfix">
                                                       <div
                                                           className="segment_gender_left">
                                                           <div
                                                               className="segment_state_main">
                                                               <div
                                                                   className="segment_state_left">
                                                                   <div
                                                                       className="e_transactions_icon">
                                                                                                            <span><img
                                                                                                                src={BaseUrl+"/assets/images/last_received_icon.png"}
                                                                                                                alt="#"/></span>
                                                                   </div>
                                                               </div>
                                                               <div
                                                                   className="segment_state_right">
                                                                   <span>{this.state.last_received}</span>
                                                               </div>
                                                           </div>
                                                       </div>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   </li>
                                   <li>
                                       <div
                                           className="column_dboard_widget2 clearfix">
                                           <div
                                               className="column_dboard_widgetDetail2">
                                               <div className="columnHeading">
                                                   <label>TOTAL BADGES
                                                       EARNED</label>
                                               </div>
                                               <div
                                                   className="averageSale_amountinfo">
                                                   <div
                                                       className="segment_gender_header greenBg blueBg clearfix">
                                                       <div
                                                           className="segment_gender_left">
                                                           <div
                                                               className="segment_state_main">
                                                               <div
                                                                   className="segment_state_left">
                                                                   <div
                                                                       className="e_transactions_icon">
                                                                                                            <span><img
                                                                                                                src={BaseUrl+"/assets/images/badges_lefticon_2.png"}
                                                                                                                alt="#"/></span>
                                                                   </div>
                                                               </div>
                                                               <div
                                                                   className="segment_state_right">
                                                                   <span>{this.state.total_badges}</span>
                                                               </div>
                                                           </div>
                                                       </div>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   </li>
                                   <li>
                                       <div
                                           className="column_dboard_widget2 clearfix">
                                           <div
                                               className="column_dboard_widgetDetail2">
                                               <div className="columnHeading">
                                                   <label>OUTSTANDING
                                                       BADGES</label>
                                               </div>
                                               <div
                                                   className="averageSale_amountinfo">
                                                   <div
                                                       className="segment_gender_header clearfix">
                                                       <div
                                                           className="segment_gender_left">
                                                           <div
                                                               className="segment_state_main">
                                                               <div
                                                                   className="segment_state_left">
                                                                   <div
                                                                       className="e_transactions_icon baadgeIcon_size">
                                                                                                            <span><img
                                                                                                                src={BaseUrl+"/assets/images/badges_lefticon_3.png"}
                                                                                                                alt="#"/></span>
                                                                   </div>
                                                               </div>
                                                               <div
                                                                   className="segment_state_right">
                                                                   <span>0</span>
                                                               </div>
                                                           </div>
                                                       </div>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   </li>
                               </ul>
                           </div>
                       </div>
                   </div>
                   <div className="e_gamification_right">
                       <div className="e_badges_box game_badges">
                           <div className="e_badges_row">
                               <div className="e_badges_inner">
                                   <div className="e_badges_heading">
                                       <h4>LATEST BADGES</h4>
                                   </div>
                                   <div className="e_badges_sliderOut">
                                       <div className="e_badges_slider">
                                           { this.state.latest_badges && (
                                               this.state.latest_badges.map(function (badge) {
                                                   return <div key={badge._id}>
                                                       <div className="e_badges_detail"><a
                                                           href="javascript:void(0);">
                                                                                        <span><i><img
                                                                                            src={badge._source.badge_image}
                                                                                            OUTSTANDING BADGES                                                        alt="#"/></i></span> </a>
                                                       </div>
                                                   </div>
                                               })
                                           )

                                           }

                                       </div>
                                   </div>
                               </div>
                           </div>
                           <div className="e_badges_row">
                               <div className="e_badges_inner">
                                   <div className="e_badges_heading">
                                       <h4>BADGES RECIEVED</h4>
                                   </div>
                                   <div className="e_badges_sliderOut">
                                       <div className="e_badges_slider">
                                           {
                                               this.state.badges && (
                                                   this.state.badges.map(function (badge) {
                                                       return <div key={badge._id}>
                                                           <div className="e_badges_detail"><a
                                                               href="javascript:void(0);">
                                                                                        <span><i><img
                                                                                            src={badge._source.badge_image}
                                                                                            alt="#"/></i></span> </a>
                                                           </div>
                                                       </div>
                                                   })
                                               )
                                           }
                                           </div>
                                   </div>
                               </div>
                           </div>
                           <div className="e_badges_row">
                               <div className="e_badges_inner">
                                   <div className="e_badges_heading">
                                       <h4>OUTSTANDING BADGES</h4>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       );
    }//..... end of render() .....//
}//..... end of Member.

BadgesStats.propTypes = {};

export default BadgesStats;
