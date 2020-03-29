import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";

class MemberSplit extends Component {
    state = {
        avg_spend: 0,
        avg_basket_size: 0,
        members_count: 0,
        new_members_count : 0,
        filter : 'week',
        male_percentage : 0,
        female_percentage : 0,
        other_percentage : 0,
        unknown_percentage : 0,
        start_date : '',
        end_date : ''
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidMount = () => {
        // show_loader();
        this.preLoader = $("body").find('.preloader3');
        this.getMemberStats();
    };

    componentWillReceiveProps(props) {
        if(!props.dateHandler.showDatePicker && props.dateHandler.applyFilter){
            this.setState(()=>({
                start_date: props.dateHandler.start_date,
                end_date: props.dateHandler.end_date
            }),
            () => {this.getMemberStats();});
        }
    }

    getMemberStats = () => {
        axios.post(BaseUrl + '/api/all_member-stats',{
            venue_id: VenueID,
            company_id: CompanyID,
            start_date: this.state.start_date,
            end_date : this.state.end_date,
            filter: this.props.dateHandler.filterPeriod,
        }).then((response) => {
            this.setState({avg_spend: response.data.total_spend,
                avg_basket_size:response.data.avg_basket_size,
                members_count:response.data.datewise_total_members,
                new_members_count: response.data.new_members_count,
                male_percentage: response.data.male_percentage,
                female_percentage: response.data.female_percentage,
                other_percentage: response.data.other_percentage,
                unknown_percentage: response.data.unknown_percentage

            });
            // show_loader(true);
        }).catch((err) => {
            // show_loader(true);
            //NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of getMemberStats() .....//

    componentDidCatch = (error, info) => {
        // show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <li className="width_50">
                <div className="e_column_dboard clearfix">
                    <div className="column_dboard_widgetDetail2">
                        <div className="columnHeading">
                            <label>GENDER SPLIT</label>
                        </div>
                        <div className="averageSale_amountinfo">
                            <div className="segment_gender_header clearfix">
                                <div className="e_dboard_totalPoints clearfix">
                                    <div className="e_dboard_totalPoints_left">
                                        <div className="totalPoints_detail">
                                            <div className="totalPoints_detail_left">
                                                <div className="totalPoints_detail_img"> <span><img src="assets/images/search_total_mamber1.png" alt="#" /></span> </div>
                                            </div>
                                            <div className="totalPoints_detail_right">
                                                <div className="totalPoints_detail_text"> <strong>{this.state.members_count}</strong> <span>TOTAL MEMBERS</span> </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*<div className="e_dboard_totalPoints_right">
                                        <div className="totalPoints_detail">
                                            <div className="totalPoints_detail_left">
                                                <div className="totalPoints_detail_img"> <span><img src="assets/images/greenedit_man.png" alt="#" /></span> </div>
                                            </div>
                                            <div className="totalPoints_detail_right">
                                                <div className="totalPoints_detail_text"> <strong>{this.state.new_members_count}</strong> <span>NEW MEMBERS</span> </div>
                                            </div>
                                        </div>
                                    </div>*/}
                                </div>
                            </div>
                            <div className="e_genderSplit" style={{minHeight:250}}>
                                <div className="gender_lits_detail">
                                    <ul>
                                        <li className="adjustUnknown">
                                            <div className="gender_lits_info maleGender"> <span><b style={{height: this.state.male_percentage}} ></b></span> <strong style={{'fontSize':32}}>{this.state.male_percentage}%</strong> <small>Male</small> </div>
                                        </li>
                                        <li className="adjustUnknown">
                                            <div className="gender_lits_info femaleGender"> <span><b style={{height: this.state.female_percentage}} ></b></span> <strong style={{'fontSize':32}}>{this.state.female_percentage}%</strong> <small>Female</small> </div>
                                        </li>
                                        <li className="adjustUnknown">
                                            <div className="gender_lits_info otherGender"> <span><b style={{height: this.state.other_percentage}} ></b></span> <strong style={{'fontSize':32}}>{this.state.other_percentage}%</strong> <small>Other</small> </div>
                                        </li>
                                        <li className="adjustUnknown">
                                            <div className="gender_lits_info otherGender"> <span><b style={{height: this.state.unknown_percentage}} ></b></span> <strong style={{'fontSize':32}}>{this.state.unknown_percentage}%</strong> <small>Unknown</small> </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        );
    }//..... end of render() .....//
}//..... end of DetailList.

export default MemberSplit;