import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NotificationManager} from "react-notifications";
import {NavLink} from "react-router-dom";

class MemberDetail extends Component {
    state = {
        avg_basket_size: 0,
        last_purchase_date: "",
        last_purchase_time: "",
        number_of_sale: 0,
        total_spend: 0
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    componentDidMount = () => {
        show_loader();
        axios.post(BaseUrl + '/api/member-sale-details',{
            persona_id: this.props.listItem._id,
            venue_id: VenueID,
            company_id: CompanyID
        }).then((response) => {
            show_loader();
            this.setState(() => ({...response.data}))
        }).catch((err) => {
            show_loader();
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of componentDidMount() .....//

    render() {
        return (
            <div className="memberList_showDetail clearfix">
                <div className="memberList_showDetail_left">
                    <h3>{this.props.listItem._source.persona_fname} {this.props.listItem._source.persona_lname}<b>
                        { this.props.listItem._source.date_of_birth !== '' ?
                            (~~(moment().diff(this.props.listItem._source.date_of_birth, 'years', true)))
                            : ''
                        }
                    </b>
                    </h3>
                    <ul>
                        <li>
                            <div className="memberNumber_status clearfix">
                                <div className="memberNumber_row">
                                    <label>Member Number</label>
                                    <span>{this.props.listItem._source.membership_id}</span>
                                </div>

                                <div className="memberNumber_row">
                                    <label>Status</label>
                                    <span><i className={this.props.listItem._source.status === 'Active' ? 'activeGreen' : 'completed_voucher'}>&nbsp;</i>{this.props.listItem._source.status}</span>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="memberNumber_status clearfix">
                                <div className="memberNumber_row">
                                    <label>Email</label>
                                    <span><a href="#">{this.props.listItem._source.persona_email}</a></span>
                                </div>

                                <div className="memberNumber_row">
                                    <label>Language</label>
                                    <span>English</span>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="memberNumber_status clearfix">
                                <div className="memberNumber_row">
                                    <label>Mobile</label>
                                    <span>{this.props.listItem._source.devices.mobile?this.props.listItem._source.devices.mobile:''}</span>
                                </div>

                                <div className="memberNumber_row">
                                    <label>Postcode</label>
                                    <span>{this.props.listItem._source.residential_address ? this.props.listItem._source.residential_address.postal_code : ''}</span>
                                </div>
                            </div>
                        </li>

                    </ul>

                    <NavLink to={
                        {
                            pathname: `members/profile/${this.props.listItem._source.persona_id}`,
                            query: {
                                item: this.props.listItem
                            }
                        }

                    }>
                        <button className="viewMemberInsight">VIEW MEMBER INSIGHT</button>

                    </NavLink>

                </div>

                <div className="memberList_showDetail_right">
                    <ul>
                        <li>
                            <div className="memberNumber_status clearfix">
                                <div className="memberNumber_row">
                                    <label>Last Purchase</label>
                                    <span>{this.state.last_purchase_date}</span>
                                </div>

                                <div className="memberNumber_row">
                                    <label>&nbsp;</label>
                                    <span>{this.state.last_purchase_time} </span>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="memberNumber_status oneColumn clearfix">
                                <div className="memberNumber_row">
                                    <label>Total Spend</label>
                                    <span>${this.state.total_spend.toFixed()}</span>
                                </div>

                            </div>
                        </li>
                        <li>
                            <div className="memberNumber_status oneColumn clearfix">
                                <div className="memberNumber_row">
                                    <label>Average Basket Size</label>
                                    <span>${this.state.avg_basket_size.toFixed()}</span>
                                </div>

                            </div>
                        </li>
                        <li>
                            <div className="memberNumber_status oneColumn clearfix">
                                <div className="memberNumber_row">
                                    <label>Number of Purchases</label>
                                    <span>{this.state.number_of_sale.value}</span>
                                </div>

                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of MemberDetail.

MemberDetail.propTypes = {};

export default MemberDetail;