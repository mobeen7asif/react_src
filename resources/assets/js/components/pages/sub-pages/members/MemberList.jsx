import React, {Component} from 'react';
import HeaderComponent from "./sub_components/HeaderComponent";
import ReactPaginate from 'react-paginate';
import MemberDetail from "./sub_components/MemberDetail";
import MerchantUpdate from "./sub_components/MerchantUpdate";
import {NotificationManager} from "react-notifications";
import NoMember from "./NoMember";
import MemberStats from "./MemberStats";
import Autosuggest from 'react-autosuggest';
import {connect} from "react-redux";
import {addNewSearchMemberValue} from "../../../redux/actions/CampaignBuilderActions";
import {resetSegmentSearch} from "../../../redux/actions/CampaignBuilderActions";
import {NavLink} from 'react-router-dom';
import AdvanceFilterMember from "./AdvanceFilterMember";
import ConfirmationModal from "../../../utils/ConfirmationModal";

class MemberList extends Component {
    state = {
        offset: 0,
        perPage: 100,
        headerList:[{"id": "0", "name": 'all', 'filterName': ''},
            {"id": "1", "name": 'Engage ID', 'filterName': 'persona_id'},
            {"id": "2", "name": 'Member Number', 'filterName': 'membership_id'}, {"id": "3", "name": 'First Name', 'filterName': 'persona_fname'},
            {"id": "4", "name": 'Last Name', 'filterName': 'persona_lname'},
            {"id": "5", "name": 'Email', 'filterName': 'persona_email'},
            {"id": "6", "name": 'Member Type', 'filterName': 'membership_type_name','disable_sort': true},
            {"id": "7", "name": "Status", "filterName": "is_merchant"},
            {"id": "8", "name": "Joining Date", "filterName": "date_added"},
            {"id": "9", "name": "DOB", "filterName": "date_of_birth"}],
        filterSegment: 'persona_id',
        orderType: 'asc',
        searchMember: '',
        membersList: [],
        showDaya: false,
        showError: false,
        totalMember: 0,
        selectedMemberToUpgrade: {},
        businessList: [],
        member_status : true,
        value: '',
        suggestions: [],
        segmentSearch: [],
        show_filter : false,
        search_for : false,
        show_member_list : false,
        deleteMember:0,
        selectedIds:[],
        delete_all: false
    };
    enter_pressed = false;
    preLoader = null;
    initialState = {};


    getInitialState = () => {
        return this.initialState;
    };
    constructor(props) {
        super(props);
        this.initialState = this.state;
    }

    loadMemberDetail = () => {
        show_loader();
        let url = BaseUrl + '/api/get-patron-detail';
        axios.post(url, {
            'company_id': CompanyID,
            'venue_id': VenueID,
            'pageSize': this.state.perPage,
            'offSet': this.state.offset,
            'sorting': this.state.filterSegment,
            'sortingOrder': this.state.orderType,
            'serchName': this.state.searchMember,
            'segmentSearch' : this.state.segmentSearch
        }).then(res => {
            if(res.data.listData.hits.total < 1){
                this.setState({member_status : false});
            } else {
                this.setState({member_status : true});
            }
            if (res.data.status) {
                this.setState({
                    membersList: res.data.listData.hits.hits,
                    totalMember: res.data.listData.hits.total / this.state.perPage,
                    showError: false,
                    show_member_list: (this.state.searchMember !== '' || this.props.member_search.criterias.length > 0) ? true : false
                });
                show_loader(true);
                this.preLoader.hide();
            } else {
                show_loader(true);
                this.preLoader.hide();
                this.setState({showError: true});
            }
        }).catch((err) => {
            show_loader(true);
            this.preLoader.hide();
            this.setState({showError: true});
        });
    };

    componentDidMount = () => {
        this.preLoader = $("body").find('.preloader3');
        this.loadMemberDetail();
        this.getSegmentCritera();
    };



    changeDateFormat = (data) => {
        if(data){
            return moment(data).format('D/M/YYYY');
        }
        return '';
    };

    changePageData = (data) => {
        this.setState({offset: Math.ceil(data.selected * this.state.perPage)}, () => this.loadMemberDetail());
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.loadMemberDetail();
        }
    };

    handleButtonsShow = (e) => {
        let li = e.target.closest('li');
        if (li.classList.contains('active_editMod')) {
            li.classList.remove('active_editMod');
        } else {
            Array.prototype.slice.call(e.target.closest('ul').querySelectorAll('li'))
                .map((ele) => ele.classList.remove('active_editMod'));
            li.classList.add('active_editMod');
        }//..... end if-else() .....//
    };//..... end of handleButtonsShow() .....//

    upgradeToMerchant = (selectedMemberToUpgrade) => {
        this.setState(() => ({selectedMemberToUpgrade}));
    };//..... end of upgradeToMerchant() .....//

    loadBusinessList = () => {
        show_loader();
        axios.get(`${BaseUrl}/api/business-list?venue_id=${VenueID}`).
        then((response) => {
            show_loader(true);
            this.setState(() => ({businessList: response.data.data}))
        }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while getting businesses list.", 'Error');
        });
    };//..... end of loadBusinessList() .....//

    handleCloseMerchant = () => {
        this.setState(() => ({selectedMemberToUpgrade: {}}), () => this.loadMemberDetail());
    };//...... end of handleCloseMerchant() ......//

    searchMemberTextInput = (e) => {
        if(e.key === 'Enter'){
            this.loadMemberDetail();
        } else {
            this.setState({searchMember: e.target.value});
        }
    };//...... end of handleCloseMerchant() ......//

    onChange = (event, { newValue, method }) => {

            this.setState(()=>({
                value: newValue,
                searchMember: newValue,
            }) , () => {
                if (newValue.length === 0) {
                    this.loadMemberDetail();
                } if(method === 'click') {
                    this.loadMemberDetail();
                }
            });


    };

    onKeyPressed = (e) => {
        if(e.keyCode === 13) {
            this.enter_pressed = true;
            this.loadMemberDetail();
        } else {
            this.enter_pressed = false;
        }
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState(()=>({searchMember: value}),()=>{
            this.getAutoSuggestData();
        });
    };

    getSuggestionValue = (suggestion) => {
        return suggestion.name;
    };

    renderSuggestion = (suggestion) => {
        this.setState({search_for: true});
        return (
            <div>
                <span style={{'display' : 'block'}}>{ suggestion.name }</span>
            </div>
        );
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
            search_for : false
        });
    };

    getAutoSuggestData = () => {
        // if(this.state.searchMember.length % 2 === 0){
            this.preLoader.show();
           this.preLoader.show();
            let url = BaseUrl + '/api/get-auto-suggest_data';
            axios.post(url, {
                'company_id': CompanyID,
                'venue_id': VenueID,
                'pageSize': this.state.perPage,
                'offSet': this.state.offset,
                'sorting': this.state.filterSegment,
                'sortingOrder': this.state.orderType,
                'serchName': this.state.searchMember,
                'segmentSearch' : this.state.segmentSearch
            }).then(res => {
                this.preLoader.hide();
                if (res.data.status) {
                    let suggestions = [];
                    res.data.listData.hits.hits.map(function (value) {
                        suggestions.push({
                            name: value._source.persona_fname+' '+value._source.persona_lname
                        });
                    });
                    this.setState({suggestions: suggestions});
                }
            }).catch((err) => {
                this.preLoader.hide();
                this.setState({showError: true});
            });
        //}
    };

    renderInputComponent = inputProps => (
        <div>
            <input {...inputProps} />
            { (this.state.search_for) ? <div className="labelSearch">Search For</div> : ''}
        </div>
    );

    segmentSearch = (event) => {
        this.setState({segmentSearch : this.props.member_search.criterias} , () => this.loadMemberDetail());
    };

    show_hide_advance_search = (event) => {
        if(!this.state.show_filter) {
            this.setState({show_filter: true} , () => {this.props.dispatch(resetSegmentSearch({criterias: []}))});
        }else{
            this.setState({show_filter:false});
        }
    };

    deleteMember = (member_id) => {
        var member_ids = [member_id];
        this.setState({'selectedIds':member_ids, deleteMember:1});
    };
    bulkDelete = () => {
        this.setState({deleteMember:1});
    };

    handleCloseModal = () => {
        this.setState(() => ({deleteMember: 0}));
    };
    handleDelete = () => {
        let member_id = this.state.deleteMember;
        show_loader();
        axios.post(`${BaseUrl}/api/delete-member`,
            {
                'company_id': CompanyID,
                'venue_id': VenueID,
                'delete_ids': this.state.selectedIds
            })
            .then((response) => {
                show_loader();
                if (response.data.status === true){
                    let memberList = this.state.membersList;
                    console.log('member list befor',memberList.length);
                    this.state.selectedIds.map( (delete_id) => {
                        let obj = memberList.findIndex(o => o._id ==delete_id);
                        if (obj > -1) {
                            memberList.splice(obj, 1);
                        }
                    });
                    this.setState(()=>({membersList: memberList,
                        deleteMember:0,
                        selectedIds:[],
                        delete_all: false
                    })),() => {
                        console.log('member list after',this.state.membersList.length);
                    };
                    NotificationManager.success(response.data.message, 'Success');
                   // this.loadMemberDetail();
                } else
                    NotificationManager.error(response.data.message, 'Error');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDelete() .....//


    recordSelected = (persona_id) => {
        this.setState((prevState) => ({
            selectedIds: this.state.selectedIds.includes(persona_id) ?
                prevState.selectedIds.filter((id) => id != persona_id) : [...prevState.selectedIds, persona_id]
        }), () => {
           console.log(this.state.selectedIds);
        });



    };//..... user is selected.


    deleteAll = () => {
        this.setState({'delete_all' : !this.state.delete_all}, () => {
            if(this.state.delete_all){
                let persona_ids = [];
                this.state.membersList.map((member) => {
                    persona_ids.push(member._source.persona_id);
                });
                this.setState({'selectedIds': persona_ids});
            } else {
                this.setState({'selectedIds': []});
            }
        });

    };

    getSegmentCritera =()=>{
        show_loader();
        axios.get(BaseUrl + '/api/get-segment-data').then(res => {

            this.setState(() => ({data: res.data.data}));

            localStorage.setItem('segment_data', JSON.stringify(res.data.data));
            show_loader(true);

        }).catch((err) => {
            show_loader(true);

        });
    }



    render() {
        const inputProps = {
            placeholder: "Type anything",
            value: this.state.value,
            onChange: this.onChange,
            onKeyDown: this.onKeyPressed
        };
        return (
            <div>
                <div className="searchSection_submit add_member">
                    <NavLink to={
                        {
                            pathname: 'members/upload-csv',
                        }
                    }
                             className={"e_user_info2_icon"}  activeClassName={'active'}>
                        <strong>
                            <i>&nbsp;</i>Import Members
                        </strong>

                    </NavLink>

                    <NavLink to={
                        {
                            pathname: 'members/add',
                        }
                    }
                             className={"e_user_info2_icon"}  activeClassName={'active'}>
                        <strong>
                            <i>&nbsp;</i>Add Member
                        </strong>

                    </NavLink>
                </div>

                <div className="searchSection searchSectionSett" style={{display: "block"}}>

                    <div className="searchSection_bar" style={{position: 'relative'}}>
                        <div className="preloader3" style={{marginTop: '0px', display: 'none',position:'absolute',top:'118px',left:'50%',marginLeft:'-10px'}}>&nbsp;</div>
                        <Autosuggest
                            suggestions={this.state.suggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={this.getSuggestionValue}
                            renderSuggestion={this.renderSuggestion}
                            inputProps={inputProps}
                            renderInputComponent={this.renderInputComponent}
                            />
                    </div>

                    <div className="searchSection_submit">
                        <input id="filter_button" type="submit"  onClick={this.show_hide_advance_search}  value={(this.state.show_filter) ? 'CLEAR FILTERS': 'FILTER YOUR RESULTS'}/>
                        <input className="blueBg" type="submit" onClick={() => {this.segmentSearch(event)}} value="SEARCH"/>

                    </div>
                </div>
                {
                    (this.state.show_filter) ?
                    <AdvanceFilterMember/> : ''
                }


                {
                    this.state.show_member_list ?
                        <div className="cL_listing_mainOuter">
                            <div className="cL_listing_auto">
                                {(this.state.showError || !this.state.member_status) ?
                                    <NoMember/> :
                                    <div className="cL_listing_tableOut memberTable">

                                        <div className="newVualt_heading_with_buttons  vouchBttn clearfix">
                                            <div className="newVualt_heading">
                                                <h3>Member Listing</h3>
                                            </div>
                                        </div>
                                        <div className="compaign_select_search clearfix">
                                            <span className="records_per_page">Records per page</span>
                                            <div className="selectCompaign">
                                                <div className="campaign_select">
                                                    <span>{this.state.perPage}</span>
                                                    <select onChange={(e) => this.setState({
                                                        perPage: e.target.value,
                                                        offset: 0
                                                    }, () => {
                                                        this.loadMemberDetail()
                                                    })}>
                                                        <option selected={this.state.perPage === 5} value="5">5</option>
                                                        <option selected={this.state.perPage === 10} value="10">10</option>
                                                        <option selected={this.state.perPage === 50} value="50">50</option>
                                                        <option selected={this.state.perPage === 100} value="100">100</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {
                                                this.state.selectedIds.length > 0 ?
                                                    <a className="bulk_delete"  onClick={()=>{this.bulkDelete()}}>Delete</a>
                                                    : ''
                                            }
                                        </div>
                                        <div className="cL_listing_tableInn memberTable_cells_setting">
                                            <HeaderComponent deleteAll={this.deleteAll} listData={this.state} onClick={(id, name) => this.setState({
                                                filterSegment: id,
                                                orderType: name
                                            }, () => this.loadMemberDetail())}/>
                                            <ul>
                                                {
                                                    this.state.membersList.map(item =>
                                                            <li id={item._id} className={'three_box'} key={item._id}>
                                                                <div className="cL_listing_table_row">
                                                                    <div className="cL_listing_table_cell cell0">
                                                <span className="cL_rowList_number" >

                                                    <input type="checkbox" onChange={(e) => {this.recordSelected(item._source.persona_id)}} checked={!!this.state.selectedIds.includes(item._source.persona_id)}/>

                                                </span>
                                                                    </div>

                                                                    <div className="cL_listing_table_cell cell1">
                                            <span className="cL_rowList_number" onClick={() => this.setState({
                                                uniqueID: item._id, showDaya:
                                                    (this.state.uniqueID === item._id) ? (this.state.showDaya === true ? false : true) : true
                                            })}>
                                                {item._source.persona_id}
                                            </span>
                                                                    </div>

                                                                    <div className="cL_listing_table_cell cell1">
                                            <span className="cL_rowList_number" onClick={() => this.setState({
                                                uniqueID: item._id, showDaya:
                                                    (this.state.uniqueID === item._id) ? (this.state.showDaya === true ? false : true) : true
                                            })}>
                                                {item._source.client_customer_id}
                                            </span>
                                                                    </div>
                                                                    <div className="cL_listing_table_cell cell2">
                                            <span className="cL_rowList_number" onClick={() => this.setState({
                                                uniqueID: item._id,
                                                showDaya: (this.state.uniqueID === item._id) ? (this.state.showDaya === true ? false : true) : true
                                            })}>{item._source.persona_fname}</span>
                                                                    </div>
                                                                    <div className="cL_listing_table_cell cell3">
                                            <span className="cL_rowList_number" onClick={() => this.setState({
                                                uniqueID: item._id,
                                                showDaya: (this.state.uniqueID === item._id) ? (this.state.showDaya === true ? false : true) : true
                                            })}>{item._source.persona_lname}</span>
                                                                    </div>
                                                                    <div className="cL_listing_table_cell cell4">
                                            <span className="cL_rowList_number" onClick={() => this.setState({
                                                uniqueID: item._id,
                                                showDaya: (this.state.uniqueID === item._id) ? (this.state.showDaya === true ? false : true) : true
                                                
                                            })}>{item._source.emails.personal_emails}</span>

                                                                        </div>
                                                                        <div className="cL_listing_table_cell cell5">

                                            <span className="cL_rowList_number" onClick={() => this.setState({
                                                uniqueID: item._id,
                                                showDaya: (this.state.uniqueID === item._id) ? (this.state.showDaya === true ? false : true) : true
                                            })}>{item._source.member_type}</span>
                                                                    </div>
                                                                    <div className="cL_listing_table_cell cell6">
                                            <span className="cL_rowList_number" onClick={() => this.setState({
                                                uniqueID: item._id,
                                                showDaya: (this.state.uniqueID === item._id) ? (this.state.showDaya === true ? false : true) : true
                                            })}>{item._source.status.toUpperCase()}</span>

                                                            </div>
                                                            <div className="cL_listing_table_cell">
                                            <span className="cL_rowList_number" style={{marginTop: '5px'}}
                                                  onClick={() => this.setState({
                                                      uniqueID: item._id,
                                                      showDaya: (this.state.uniqueID === item._id) ? (this.state.showDaya === true ? false : true) : true
                                                  })}>
                                                {this.changeDateFormat(item._source.creation_datetime)}
                                                </span>
                                                            </div>

                                                            <div className="clEditDotes_cell cell7 cell7_set clearfix">

                                            <span className="cL_rowList_number" style={{marginTop: '5px'}}
                                                  onClick={() => this.setState({
                                                      uniqueID: item._id,
                                                      showDaya: (this.state.uniqueID === item._id) ? (this.state.showDaya === true ? false : true) : true
                                                  })}>
                                                {this.changeDateFormat(item._source.date_of_birth)}
                                                </span>
                                                                        <a className="cl_tableRow_editDotes"
                                                                           style={{cursor:'pointer'}}

                                                                           tabIndex={'-1'}
                                                                           onClick={this.handleButtonsShow}><i>&nbsp;</i></a>
                                                                    </div>
                                                                </div>

                                                                <div className="cl_rowEdit_popOut merchant_button">
                                                                    <div className="cl_rowEdit_pop_table">
                                                                        <div className="cl_rowEdit_popOut_tableRow">
                                                                            {/*<div
                                                                                className="cl_rowEdit_popOut_tableRow_cell eidtCell1">
                                                                                <a className="edit_icon"
                                                                                   style={{cursor:'pointer'}}
                                                                                   onClick={() => this.upgradeToMerchant(item)}>
                                                                                    <strong><i>&nbsp;</i>{(item._source.is_merchant && item._source.is_merchant == 1) ? 'Downgrade Merchant' : 'Upgrade To Merchant'}
                                                                                    </strong>
                                                                                </a>
                                                                            </div>*/}


                                                                            <div
                                                                                className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                                                <NavLink to={
                                                                                    {
                                                                                        pathname: `members/profile/${item._source.persona_id}`,
                                                                                        query: {
                                                                                            item: item
                                                                                        }
                                                                                    }

                                                                                }
                                                                                         className={"e_user_info2_icon"}  activeClassName={'active'}>
                                                                                    <strong>
                                                                                        <i>&nbsp;</i>Member Profile
                                                                                    </strong>

                                                                                </NavLink>
                                                                            </div>
                                                                                    <div
                                                                                        className="cl_rowEdit_popOut_tableRow_cell eidtCell3">
                                                                                        <a className="delete_icon"
                                                                                           style={{cursor:'pointer'}} onClick={()=>{this.deleteMember(item._source.persona_id)}}><strong><i>&nbsp;</i>Delete</strong></a>
                                                                                    </div>



                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {(this.state.showDaya && this.state.uniqueID === item._id) ?
                                                                    <MemberDetail listItem={item}/> : ''}
                                                            </li>
                                                    )
                                                }
                                            </ul>
                                        </div>

                                        <div className="campLstng_paginaton_out">
                                            <div className="campLstng_paginaton_inn">
                                                <ReactPaginate previousLabel={""} nextLabel={""}
                                                               nextLinkClassName={'campPagi_next'}
                                                               breakLabel={<a href="">...</a>}
                                                               breakClassName={"break-me"} pageCount={this.state.totalMember}
                                                               marginPagesDisplayed={2} pageRangeDisplayed={5}
                                                               previousLinkClassName={'campPagi_prev'}
                                                               onPageChange={this.changePageData} activeClassName={"active"}/>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>


                        : ''
                }




                {
                    Object.keys(this.state.selectedMemberToUpgrade).length > 0 &&
                    <MerchantUpdate member={this.state.selectedMemberToUpgrade} businessList={this.state.businessList}
                                    loadBusinessList={this.loadBusinessList} handleCloseMerchant={this.handleCloseMerchant}/>
                }
                <ConfirmationModal isOpen={!!this.state.deleteMember} handleCloseModal={this.handleCloseModal} text={'Member'} handleDeleteItem={this.handleDelete}/>
            </div>
        );
    }//..... end of render() .....//
}//..... end of MemberList.

const mapStateToProps = (state) => {
    return {member_search: state.searchMember};
};

export default connect(mapStateToProps)(MemberList);
