import React, {Component} from 'react';
import { Draggable } from 'react-drag-and-drop';
import {find} from 'lodash';

class MembershipCriteria extends Component {



    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <li>

                <a className="accordianIcons clickAccordian"  style={{cursor:'pointer'}}>
                    <b>&nbsp;</b>
                    <small>Membership Criteria</small>
                </a>
                <div className="showAccordian_data clickAccordian_show">

                    {/*    <Draggable type="tags" data="membership_type_id">
                        <div className={find(this.props.criterias, {name: 'membership_type_id'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"} id={'membership_type_idCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('membership_type_id')}>
                            <h4>Membership Type</h4>
                        </div>
                    </Draggable>*/}

                    {/* <Draggable type="tags" data="membership_status">
                        <div className={find(this.props.criterias, {name: 'membership_status'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"} id={'membership_statusCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('membership_status')}>
                            <h4>Membership Status</h4>
                        </div>
                    </Draggable>*/}

                    {/*  <Draggable type="tags" data="point_balance">
                        <div className={find(this.props.criterias, {name: 'point_balance'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'point_balanceCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('point_balance')} >
                            <h4>Point Balance</h4>
                        </div>
                    </Draggable>*/}

                    {/*    <Draggable type="tags" data="rating_grade_id">
                        <div className={find(this.props.criterias, {name: 'rating_grade_id'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'rating_grade_idCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('rating_grade_id')} >
                            <h4>Rating Card</h4>
                        </div>
                    </Draggable>
*/}
                    {(this.props.checkSegmentCriteria('Membership Criteria','creation_datetime') && appPermission("SegmentMembership-MembershipJoinDate","view")) && (
                        <Draggable type="tags" data="creation_datetime">
                            <div className={find(this.props.criterias, {name: 'creation_datetime'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'creation_datetimeCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('creation_datetime')} >
                                <h4>Membership Join Date</h4>
                            </div>
                        </Draggable>
                    )}

                    {/*     <Draggable type="tags" data="expiry_datetime">
                        <div className={find(this.props.criterias, {name: 'expiry_datetime'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'expiry_datetimeCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('expiry_datetime')} >
                            <h4>Membership Expiry</h4>
                        </div>
                    </Draggable>*/}
                    {(this.props.checkSegmentCriteria('Membership Criteria','membership_number') && appPermission("SegmentMembership-MembershipNumber","view")) && (
                        <Draggable type="tags" data="membership_number">
                            <div className={find(this.props.criterias, {name: 'membership_number'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'membership_numberCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('membership_number')} >
                                <h4>Membership Number</h4>
                            </div>
                        </Draggable>
                    )}
                    {(this.props.checkSegmentCriteria('Membership Criteria','last_login') && appPermission("SegmentMembership-LastLogin","view")) && (
                        <Draggable type="tags" data="last_login">
                            <div className={find(this.props.criterias, {name: 'last_login'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'last_loginCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('last_login')} >
                                <h4>Last Login</h4>
                            </div>
                        </Draggable>
                    )}
                    {(this.props.checkSegmentCriteria('Membership Criteria','reffering_users') && appPermission("SegmentMembership-RefferingUsers","view")) && (
                        <Draggable type="tags" data="reffering_users">
                            <div className={find(this.props.criterias, {name: 'reffering_users'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'reffering_usersCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('reffering_users')} >
                                <h4>Referring user</h4>
                            </div>
                        </Draggable>
                    )}
                    {(this.props.checkSegmentCriteria('Membership Criteria','reffered_user') && appPermission("SegmentMembership-RefferedUser","view")) && (
                        <Draggable type="tags" data="reffered_user">
                            <div className={find(this.props.criterias, {name: 'reffered_user'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'reffered_userCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('reffered_user')} >
                                <h4>Referred User</h4>
                            </div>
                        </Draggable>
                    )}


                    {(this.props.checkSegmentCriteria('Membership Criteria','member_group') && appPermission("SegmentMembership-MemberGroup","view")) && (
                        <Draggable type="tags" data="member_group">
                            <div className={find(this.props.criterias, {name: 'member_group'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'member_groupCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('member_group')} >
                                <h4>Member Group</h4>
                            </div>
                        </Draggable>
                    )}
                    {(this.props.checkSegmentCriteria('Membership Criteria','user_source') && appPermission("SegmentMembership-Source","view")) && (
                        <Draggable type="tags" data="user_source">
                            <div className={find(this.props.criterias, {name: 'user_source'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'user_sourceCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('user_source')} >
                                <h4>Source</h4>
                            </div>
                        </Draggable>
                    )}
                    {(this.props.checkSegmentCriteria('Membership Criteria','last_transaction') && appPermission("SegmentMembership-LastTransaction","view")) && (
                        <Draggable type="tags" data="last_transaction">
                            <div className={find(this.props.criterias, {name: 'last_transaction'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'last_transactionCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('last_transaction')} >
                                <h4>Last Transaction</h4>
                            </div>
                        </Draggable>
                    )}
                    {(this.props.checkSegmentCriteria('Membership Criteria','total_spending') && appPermission("SegmentMembership-TotalSpending","view")) && (
                        <Draggable type="tags" data="total_spending">
                            <div className={find(this.props.criterias, {name: 'total_spending'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'total_spendingCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('total_spending')} >
                                <h4>Total Spending</h4>
                            </div>
                        </Draggable>
                    )}
                    {(this.props.checkSegmentCriteria('Membership Criteria','average_basket_value') && appPermission("SegmentMembership-AverageBasketValue","view")) && (
                        <Draggable type="tags" data="average_basket_value">
                            <div className={find(this.props.criterias, {name: 'average_basket_value'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'average_basket_valueCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('average_basket_value')} >
                                <h4>Average Basket Value</h4>
                            </div>
                        </Draggable>
                    )}
                    {(this.props.checkSegmentCriteria('Membership Criteria','spender_percentage') && appPermission("SegmentMembership-SpenderPercentage","view")) && (
                        <Draggable type="tags" data="spender_percentage">
                            <div className={find(this.props.criterias, {name: 'spender_percentage'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'spender_percentageCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('spender_percentage')} >
                                <h4>Spender (%)</h4>
                            </div>
                        </Draggable>
                    )}
                    {(this.props.checkSegmentCriteria('Membership Criteria','user_activity') && appPermission("SegmentMembership-Activity","view")) && (
                        <Draggable type="tags" data="user_activity">
                            <div className={find(this.props.criterias, {name: 'user_activity'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'user_activityCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('user_activity')} >
                                <h4>Activity</h4>
                            </div>
                        </Draggable>
                    )}

                   {/* {this.props.checkSegmentCriteria('Membership Criteria','gap_map_users') && (
                        <Draggable type="tags" data="gap_map_users">
                            <div className={find(this.props.criterias, {name: 'gap_map_users'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'gap_map_usersCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('gap_map_users')} >
                                <h4>Gap Map</h4>
                            </div>
                        </Draggable>
                    )}*/}

                    {(this.props.checkSegmentCriteria('Membership Criteria','last_login') && appPermission("SegmentMembership-LastLogin","view")) && (
                    <Draggable type="tags" data="last_login">
                        <div className={find(this.props.criterias, {name: 'last_login'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'last_loginCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('last_login')} >
                            <h4>Last Login</h4>
                        </div>
                    </Draggable>
                    )}
                    {/*<Draggable type="tags" data="reffering_users">
                        <div className={find(this.props.criterias, {name: 'reffering_users'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'reffering_usersCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('reffering_users')} >
                            <h4>Referring user</h4>
                        </div>
                    </Draggable>*/}
                    {(this.props.checkSegmentCriteria('Membership Criteria','enter_venue') && appPermission("SegmentMembership-EnterVenue","view")) && (
                    <Draggable type="tags" data="enter_venue">
                        <div className={find(this.props.criterias, {name: 'enter_venue'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'enter_venueCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('enter_venue')} >
                            <h4>Enter Site</h4>
                        </div>
                    </Draggable>
                    )}
                    {(this.props.checkSegmentCriteria('Membership Criteria','default_venue') && appPermission("SegmentMembership-DefaultVenue","view")) && (
                    <Draggable type="tags" data="default_venue">
                        <div className={find(this.props.criterias, {name: 'default_venue'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'default_venueCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('default_venue')} >
                            <h4>Default Site</h4>
                        </div>
                    </Draggable>
                    )}
                    {(this.props.checkSegmentCriteria('Membership Criteria','member_group') && appPermission("SegmentMembership-MemberGroup","view")) && (
                    <Draggable type="tags" data="member_group">
                        <div className={find(this.props.criterias, {name: 'member_group'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'member_groupCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('member_group')} >
                            <h4>Member Group</h4>
                        </div>
                    </Draggable>
                    )}
                    {(this.props.checkSegmentCriteria('Membership Criteria','target_users') && appPermission("SegmentMembership-TargetUsers","view")) && (
                    <Draggable type="tags" data="target_users">
                        <div className={find(this.props.criterias, {name: 'target_users'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'target_usersCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('target_users')} >
                            <h4>Target Users</h4>
                        </div>
                    </Draggable>
                    )}
                    {(this.props.checkSegmentCriteria('Membership Criteria','user_region') && appPermission("SegmentMembership-UserRegion","view")) && (
                    <Draggable type="tags" data="user_region">
                        <div className={find(this.props.criterias, {name: 'user_region'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'user_regionCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('user_region')} >
                            <h4>User Region</h4>
                        </div>
                    </Draggable>
                    )}
                    {(this.props.checkSegmentCriteria('Membership Criteria','gap_map_users') && appPermission("SegmentMembership-GapMap","view")) && (
                    <Draggable type="tags" data="gap_map_users">
                        <div className={find(this.props.criterias, {name: 'gap_map_users'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'gap_map_usersCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('gap_map_users')} >
                            <h4>Never Transacted Customers</h4>
                        </div>
                    </Draggable>
                    )}
                    {(this.props.checkSegmentCriteria('Membership Criteria','venue_store_name') && appPermission("SegmentMembership-StoreName","view")) && (
                    <Draggable type="tags" data="venue_store_name">
                        <div className={find(this.props.criterias, {name: 'venue_store_name'}) || find(this.props.criterias, {name: 'allUsers'}) ? "dragAccordianData disableCriteria" : "dragAccordianData"}  id={'venue_store_nameCriteria'} onDoubleClick={(e)=> this.props.handleCriteriaDoubleClick('venue_store_name')} >
                            <h4>Store Name</h4>
                        </div>
                    </Draggable>
                    )}



                </div>
            </li>
        );
    }//..... end of render() .....//
}//..... end of MembershipCriteria.

export default MembershipCriteria;