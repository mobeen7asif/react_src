import React, {Component} from 'react';
import ReactPaginate from 'react-paginate';
import {NotificationManager} from "react-notifications";
import {setSegmentUsers} from "../../../../../../../redux/actions/CampaignBuilderActions";
import {connect} from "react-redux";
import {selectSegmentBuilderMembersList} from "../../../../../../../redux/selectors/MemberSelector";

class SegmentMembers extends Component {
    perPage = 10;
    state = {
        searchValue: '',
        action: '',
        selectedIds: [],
        currentPage: 0,
        update:false,
        memberList:[],

    };

    handlePaginationClick = (data) => {
        this.setState({currentPage: data.selected});
        this.getMemberList(data.selected, '');
    };//..... end of handlePaginationClick() ......//

    getMemberList = (page, search, excludedUsers = []) => {
        show_loader();
        axios.post(BaseUrl + '/api/segment-member-list', {
                page            : page,
                query           : this.props.query,
                segment_type:    this.props.segment_type,
                search          : search,
                excluded_users  : excludedUsers.length > 0 ? excludedUsers : this.props.excluded_users,
                company_id      : CompanyID,
                venue_id        : VenueID
            }).then((response) => {
            show_loader(true);
            this.props.dispatch(setSegmentUsers({data: response.data.data, total_users: response.data.total_records, total_male: response.data.total_male, total_female: response.data.total_female}));
        }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while getting Segment Members", 'Error');
        });
    };//..... end of getMemberList() .....//

    recordSelected = (_id) => {
        this.setState((prevState) => ({
            selectedIds: this.state.selectedIds.includes(_id) ?
                            prevState.selectedIds.filter((id) => id != _id) : [...prevState.selectedIds, _id]
        }), () => {
            if (this.state.selectedIds.length === 0)
                this.setState({action: ''});
        });


        if (!this.props.excluded_users.includes(_id)) {
            this.setState((prevState) => ({action: prevState.action === "" ? 'exclude' : (prevState.action === 'include' ? 'both' : 'exclude') }));
        } else {
            this.setState((prevState) => ({action: prevState.action === "" ? 'include' : (prevState.action === 'exclude' ? 'both' : 'include') }));
        }//..... end if-else() .....//
    };//..... user is selected.

    searchMember = (e) => {
        this.setState({searchValue: e.target.value});
    };//..... end of searchMember() ......//

    search = () => {
        this.getMemberList(0, this.state.searchValue);
    };//..... end of search() ....//

    adjustSelectedUser = (action = '') => {
        let excludedUsers = this.props.excluded_users;

        if (action === 'exclude') {
            excludedUsers = [...excludedUsers, ...this.state.selectedIds];
        } else {
            excludedUsers = excludedUsers.filter((id) => !this.state.selectedIds.includes(id));
        }//.... end if-else() .....//

        this.props.dispatch(setSegmentUsers({excluded_users: excludedUsers}));
        this.setState(() => ({selectedIds: [], action : ''}));
        this.getMemberList(0, '', excludedUsers);
    };//..... end of adjustSelectedUser() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    enterPressed = (event) => {
        let code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.getMemberList(0, this.state.searchValue);
        }
    };//--- End of enterPressed() ----//

    adjustChannelSettings = (id, channel, value) => {
        show_loader();
        axios.post(BaseUrl + '/api/adjust-member-channel', {
           id,channel,value:!value,
            company_id      : CompanyID,
            venue_id        : VenueID
        }).then((response) => {
            show_loader(true);
            if(response.data.status){
                setTimeout(()=>{
                    this.getMemberList(this.state.currentPage, this.state.searchValue);
                },600);
            }

        }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while saving settings.", 'Error');
        });
    };//..... end of adjustChannelSettings() .....//


    render() {
        return (
            <div className="modifySegments_detail">
                <div className="addMember_removeMember clearfix">
                    <h3>MEMBERS IN SEGMENT</h3>
                    {this.props.type !== 'saved' &&
                    <div className="addMember_removeMemberBttn clearfix">
                        <a  style={{cursor:'pointer'}} className={this.state.action === 'include' || this.state.action === 'both' ? 'selecCompaignBttn' : 'disabled'} onClick={() => this.adjustSelectedUser('include')}>ADD MEMBERS</a>
                        <a  style={{cursor:'pointer'}} className={this.state.action === 'exclude' || this.state.action === 'both' ? 'selecCompaignBttn' : 'disabled'} onClick={() => this.adjustSelectedUser('exclude')}>REMOVE MEMBERS</a>
                    </div>
                    }
                </div>

                <div className="compaign_select_search memberSearchField clearfix">
                    <div className="searchCompaign clearfix">
                        <input type="text" value={this.state.searchValue} placeholder="Search Member" className="copmpaignSearch_field" onChange={this.searchMember} onKeyPress={this.enterPressed}/>
                        <input type="submit" value="" className="copmpaignIcon_field" onClick={this.search}/>
                    </div>
                </div>

                <div className="cL_listing_tableInn searchMember_table">
                    <div className="cL_listing_tableTitle">
                        <div className="cL_listing_table_row">
                            <div className="cL_listing_table_cell cell1">
                                <strong>Member Number</strong>
                            </div>
                            <div className="cL_listing_table_cell cell2">
                                <strong>First Name</strong>
                            </div>
                            <div className="cL_listing_table_cell cell3">
                                <strong>Last Name</strong>
                            </div>
                            <div className="cL_listing_table_cell cell4">
                                <strong>Email</strong>
                            </div>
                            <div className="cL_listing_table_cell cell5">
                                <strong>Member Type</strong>
                            </div>
                            {appPermission("SegmentSubUnsub","view") && (
                                <div className="cL_listing_table_cell cell6">
                                    <strong>Status</strong>
                                </div>
                            )}
                            <div className="cL_listing_table_cell cell7">
                                <strong style={{textAlign: 'right'}}>Actions</strong>
                            </div>
                        </div>
                    </div>

                    <ul>
                        {
                            this.props.membersList.map((record) => {

                                return (
                                    <li key={"record-"+record._id}>
                                        <div className="cL_listing_table_row changeStyle" >
                                            <div className="cL_listing_table_cell cell1">
                                                <span className="cL_rowList_number" style={{color: this.props.excluded_users.includes(record._id) ? 'red' : ''}}>{record.persona_id}</span>
                                            </div>
                                            <div className="cL_listing_table_cell cell2">
                                                <span className="cL_rowList_number">{record.persona_fname}</span>
                                            </div>
                                            <div className="cL_listing_table_cell cell3">
                                                <span className="cL_rowList_number">{record.persona_lname}</span>
                                            </div>
                                            <div className="cL_listing_table_cell cell4">
                                                <span className="cL_rowList_number">{record.emails.personal_emails}</span>
                                            </div>
                                            <div className="cL_listing_table_cell cell5">
                                                <span className="cL_rowList_number">{(record.is_merchant && record.is_merchant == 1) ? 'Merchant' : 'Customer'}</span>
                                            </div>
                                            {appPermission("SegmentSubUnsub","view") && (
                                                <div className="cL_listing_table_cell cell6 ">
                                                    <small className="">
                                                        <span onClick={() => {this.adjustChannelSettings(record._id, 'sms_subscribed_flag', record.sms_subscribed_flag)}} className={record.sms_subscribed_flag ? 'active--channel' : 'deActive--channel'} title={`Click to ${record.sms_subscribed_flag ? 'disable' : 'enable'} SMS Notification`}>SMS</span> |&nbsp;
                                                        <span onClick={() => {this.adjustChannelSettings(record._id, 'is_pointme_notifications', record.is_pointme_notifications)}} className={record.is_pointme_notifications ? 'active--channel' : 'deActive--channel'} title={`Click to ${record.is_pointme_notifications ? 'disable' : 'enable'} PUSH Notification`}>PUSH</span> |&nbsp;
                                                        <span onClick={() => {this.adjustChannelSettings(record._id, 'email_subscribed_flag', record.email_subscribed_flag)}} className={record.email_subscribed_flag ? 'active--channel' : 'deActive--channel'} title={`Click to ${record.email_subscribed_flag ? 'disable' : 'enable'} EMAIL Notification`}>EMAIL</span>
                                                    </small>
                                                </div>
                                            )}
                                            <div className="cL_listing_table_cell cell7">
                                                <span className="cL_rowList_number">
                                                    <input type="checkbox" style={{float: 'right'}} onChange={(e) => {this.recordSelected(record._id)}} checked={!!this.state.selectedIds.includes(record._id)}/>
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
                <div className="campLstng_paginaton_out">
                    <div className="campLstng_paginaton_inn">
                        <Pagination handlePaginationClick={this.handlePaginationClick} totalRecords={this.props.totalRecords} perPage={this.perPage}/>
                    </div>
                </div>
                <br /><br />
            </div>
        );
    }//..... end of render() .....//
}//..... end of SegmentMembers.

function Pagination(props) {
    const totalRecords = parseInt(props.totalRecords) / parseInt(props.perPage);
    return (
        <div className="campLstng_paginaton_out">
            <div className="campLstng_paginaton_inn">
                <ReactPaginate previousLabel={""} nextLabel={""} nextLinkClassName={'campPagi_next'} breakLabel={<a href="">...</a>} breakClassName={"break-me"}
                               pageCount={totalRecords} marginPagesDisplayed={2} pageRangeDisplayed={5} previousLinkClassName={'campPagi_prev'}
                               onPageChange={props.handlePaginationClick} activeClassName={"active"}/>
            </div>
        </div>
    );
}//..... end of Pagination() ......//


const mapStateToProps = (state) => {
    return {
        query:          state.campaignBuilder.segment.segment_users.query,
        membersList:    selectSegmentBuilderMembersList(state.campaignBuilder.segment),
        totalRecords:   state.campaignBuilder.segment.segment_users.total_users,
        excluded_users: state.campaignBuilder.segment.segment_users.excluded_users,
        type:           state.campaignBuilder.segment.type,
        segment_type:   state.campaignBuilder.segment.new_segment.segment_type,
    };
};

export default connect(mapStateToProps)(SegmentMembers);