import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import HeaderComponent from "../../../sub_components/HeaderComponent";

import ReactPaginate from 'react-paginate';
import BadgesStats from "./sub_components/BadgesStats";
import BadgeDetail from "./sub_components/BadgeDetail";
import { Calendar } from 'react-date-range';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { PrintTool } from "react-print-tool";
import NoDataFound from "../../../../../../_partials/NoDataFound";

class Gamification extends Component {

    state = {
        headerList: [{"id": "1", "name": 'Date', 'filterName': 'dateadded'}, {"id": "2", "name": 'Badge Name', 'filterName': 'badge_title'},
            {"id": "3", "name": 'Badge Description', 'filterName': 'badge_description','disable_sort': true}, {"id": "4", "name": 'Points', 'filterName': 'dateadded','disable_sort': true},],
        badges : [],
        totalBadges: 0,
        offset: 0,
        perPage: 50,
        orderType: 'desc',
        filterSegment: 'dateadded',
        showAll : false,
        showListError : false,
        start_date : '',
        end_date : '',
        selection:{
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
            showSelectionPreview:true
        },
        showDatePicker : false,
        selectDate : false
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidMount = () => {
        this.loadBadges()
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//


    loadBadges = () => {
        show_loader();
        let url = BaseUrl + '/api/member-badges';
        axios.post(url, {
            'company_id': CompanyID,
            'venue_id': VenueID,
            'pageSize': this.state.perPage,
            'offSet': this.state.offset,
            'sorting': this.state.filterSegment,
            'sortingOrder': this.state.orderType,
            'persona_id' : this.props.persona_id,
            'start_date' : this.state.start_date,
            'end_date' : this.state.end_date
        }).then(res => {
            if (res.data.status) {
                var data = [];
                res.data.listData.hits.hits.map(function (item) {
                    item._source.active = false;
                    data.push(item);
                });
                this.setState({
                    badges: data,
                    totalBadges: res.data.listData.hits.total / this.state.perPage,
                    showListError: res.data.listData.hits.hits.length > 0 ?  false : true,
                });
                show_loader(true);
            } else {
                show_loader(true);
                this.setState({showListError: true});
            }
        }).catch((err) => {
            show_loader(true);
            this.setState({showListError: true});
            NotificationManager.error("Error occurred while Badges", 'Error');
        });
    };

    changePageData = (data) => {
        this.setState({offset: Math.ceil(data.selected * this.state.perPage)}, () => this.loadBadges());
    };

    changeDateFormat = (data) => {
        if(data){
            return moment(data*1000).format("DD/MM/YYYY");
        } else {
            return '';
        }
    };

    changeActiveStatus = (item) => {
        var changed_data = [];
        this.state.badges.map(function (obj) {
            if(obj._id === item._id){
                if(obj._source.active === true){
                    obj._source.active = false;
                } else {
                    obj._source.active = true;
                }
            }
            changed_data.push(obj);
        });
        this.setState({badges : changed_data});
    };

    expandAll = (item) => {
        if(this.state.showAll){
            this.setState({showAll : false}, () => {this.getUpdatedBadges()});
        }
        else {
            this.setState({showAll : true}, () => {this.getUpdatedBadges()})
        }
    };

    getUpdatedBadges = () => {
        var changed_data = [];
        this.state.badges.map((obj) => {
            obj._source.active = this.state.showAll ===  true ? true : false;
            changed_data.push(obj);
        });
        this.setState({vouchers : changed_data});
    };

    handleSelect = (ranges) => {
        const mySelection = (ranges.selection);
        this.setState({
            selection:mySelection,
            start_date : moment(mySelection.startDate).format("YYYY-MM-DD"),
            end_date : moment(mySelection.endDate).format("YYYY-MM-DD"),
            selectDate:true
        });

    };
    dateFilter = () => {
        if(!this.state.selectDate){
            NotificationManager.warning("Please select date", 'Missing Fields');
        } else {
            if(this.state.start_date !== '' || this.state.end_date !== ''){
                this.setState({offset:0}, () => {this.setState({showDatePicker: false,selectDate: true}, () => {this.loadBadges();});});
            } else {
                this.setState({showDatePicker: false,selectDate: true}, () => {this.loadBadges();});
            }
        }
    };

    dateInputClick = () => {
      this.setState({showDatePicker: true});
    };
    hideDatePicker = () => {
        this.setState({showDatePicker: false, selectDate: false, start_date : '', end_date : '',offset:0}, () => {this.loadBadges()});
    };
    printDiv = (divName) => {
        PrintTool.printExistingElement("#"+divName);
    };

    render() {
        return (

            <div className="e_member_right">
                <div className="add_category_listing">
                    <ul className="">
                        <li>
                            <div className="add_categoryList_info addProduct_setting">
                                <div className="newVualt_heading">
                                    <h3>Member / <a href="javascript:void(0);">Gamification</a></h3>
                                </div>
                                <div className="categoryInfo_container clearfix">
                                    <div className="addCategoryRight_section">
                                        <div className="edit_category_rightDetail removeHighlights">
                                            <div className="e_transactions_main">
                                              <BadgesStats persona_id={this.props.persona_id}/>

                                                        <div className="e_transaction_list">
                                                            <div className="e_all_trans_heading">
                                                                <h4>BADGES LIST</h4>
                                                            </div>
                                                            <div className="listing_floating_row clearfix">
                                                                <div className="fieldIncremnt">
                                                                    <div className="quantity clearfix">
                                                                        <input
                                                                            onChange={(e) => this.setState({
                                                                                perPage: e.target.value,
                                                                                offset: 0
                                                                            }, () => {
                                                                                this.loadBadges()
                                                                            })}
                                                                            min={5} step={5} max={100} value={this.state.perPage}
                                                                            type="number"/>
                                                                        <div className="quantity-nav">
                                                                            <div onClick={() => this.setState({
                                                                                perPage: this.state.perPage + 1,
                                                                                offset: 0
                                                                            }, () => {
                                                                                this.loadBadges()
                                                                            })} className="quantity-button quantity-up"/>
                                                                            <div onClick={() => this.setState({
                                                                                perPage: this.state.perPage - 1,
                                                                                offset: 0
                                                                            }, () => {
                                                                                this.loadBadges()
                                                                            })}

                                                                                className="quantity-button quantity-down"/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="expand_button" onClick={this.expandAll}><a  style={{cursor:'pointer'}}>
                                                                    {this.state.showAll ? 'Collapse All' : 'Expand All'}</a></div>
                                                                <div className="grid_searching clearfix date_range_changes">
                                                                    <input onFocus={this.dateInputClick} placeholder=""
                                                                           value={(this.state.selectDate)?(moment(this.state.selection.startDate).format('ll') + ' - ' + moment(this.state.selection.endDate).format('ll')):'Select Date'}
                                                                        className="searchInput cursor_style" type="text" readOnly/>
                                                                    <ul>
                                                                        <li className="searching_li">
                                                                            <div className="searching clearfix" style={this.state.showDatePicker ? {display: 'block'} : {display: 'none'}}>
                                                                                <DateRangePicker className='"rdrDateRangeWrapper"'
                                                                                                 ranges={[this.state.selection]}
                                                                                                 onChange={this.handleSelect}/>
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                    <div className="e_member_printBtns clearfix filter_btns" style={this.state.showDatePicker ? {display: 'block'} : {display: 'none'}}>
                                                                        <ul>
                                                                            <li><a onClick={this.dateFilter}  href="javascript:void(0);">APPLY</a></li>
                                                                            <li><a onClick={this.hideDatePicker}  href="javascript:void(0);">CLEAR</a></li>
                                                                        </ul>
                                                                    </div>


                                                            </div>

                                                            { this.state.showListError ?
                                                               <NoDataFound customMessage="Gamification"/>
                                                                :
                                                                <div className="category_list_outer trans_listing" id='printableArea'>
                                                                    <div className="cL_listing_tableInn">
                                                                        <HeaderComponent listData={this.state}
                                                                                         onClick={(id, name) => this.setState({
                                                                                             filterSegment: id,
                                                                                             orderType: name
                                                                                         }, () => this.loadBadges())}/>
                                                                        <ul>
                                                                            {
                                                                                this.state.badges && (
                                                                                    this.state.badges.map((badge) => {
                                                                                        return <li key={badge._id}>
                                                                                            <div
                                                                                                className="e_transaction_accordion"
                                                                                                >
                                                                                                <div
                                                                                                    className={badge._source.active ? 'e_transaction_accordionTitle active' : 'e_transaction_accordionTitle'}>
                                                                                                    <div
                                                                                                        className="listDataShowing">
                                                                                                        <div
                                                                                                            onClick={() => {
                                                                                                                this.changeActiveStatus(badge)
                                                                                                            }}
                                                                                                            className="cL_listing_table_row">
                                                                                                            <div
                                                                                                                className="cL_listing_table_cell cell1">
                                                                                        <span
                                                                                            className="cL_rowList_number ">{this.changeDateFormat(badge._source.dateadded)}</span>
                                                                                                            </div>
                                                                                                            <div
                                                                                                                className="cL_listing_table_cell cell2">
                                                                                        <span
                                                                                            className="cL_rowList_number ">{badge._source.badge_title}</span>
                                                                                                            </div>
                                                                                                            <div
                                                                                                                className="cL_listing_table_cell cell3">
                                                                                        <span
                                                                                            className="cL_rowList_number ">{badge._source.badge_description}</span>
                                                                                                            </div>
                                                                                                            <div
                                                                                                                className="cL_listing_table_cell cell4">
                                                                                        <span
                                                                                            className="cL_rowList_number padingLeft25"
                                                                                            style={{marginTop: '7px'}}>2700</span>
                                                                                                            </div>
                                                                                                        </div>

                                                                                                    </div>
                                                                                                </div>


                                                                                                {badge._source.active ?
                                                                                                    <BadgeDetail
                                                                                                        badge={badge}/> : ''}

                                                                                            </div>
                                                                                        </li>
                                                                                    })
                                                                                )
                                                                            }
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            }

                                                            { this.state.showListError ? '' :
                                                                <div className="campLstng_paginaton_out">
                                                                    <div className="campLstng_paginaton_inn">
                                                                        <ReactPaginate previousLabel={""} nextLabel={""}
                                                                                       nextLinkClassName={'campPagi_next'}
                                                                                       breakLabel={<a href="">...</a>}
                                                                                       breakClassName={"break-me"}
                                                                                       pageCount={this.state.totalBadges}
                                                                                       marginPagesDisplayed={2}
                                                                                       pageRangeDisplayed={5}
                                                                                       previousLinkClassName={'campPagi_prev'}
                                                                                       onPageChange={this.changePageData}
                                                                                       activeClassName={"active"}/>
                                                                    </div>
                                                                </div>
                                                            }



                                                        </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="clearfix">
                    <div className="e_member_printBtns clearfix">
                        <ul>
                            <li><a  href="javascript:void(0);" onClick={() => {this.printDiv('printableArea')}}>PRINT</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of Member.

Gamification.propTypes = {};

export default Gamification;
