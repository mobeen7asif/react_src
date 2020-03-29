import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import HeaderComponent from "../../../sub_components/HeaderComponent";
import ReactPaginate from 'react-paginate';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar } from 'react-date-range';
import { DateRangePicker } from 'react-date-range';
import StampCardDetail from "./sub_components/StampCardDetail";
import StampCardStats from "./sub_components/StampCardStats";
import { PrintTool } from "react-print-tool";
import NoDataFound from "../../../../../../_partials/NoDataFound";
import StampCardDetailMember from "./sub_components/StampCardDetailMember";


class StampCards extends Component {

    state = {
        headerList: [{"id": "1", "name": 'Stamp Card ID', 'filterName': '_id'}, {"id": "2", "name": 'Date', 'filterName': 'dateadded'},
            {"id": "3", "name": 'Business', 'filterName': 'business_name', 'disable_sort': true}, {"id": "4", "name": 'Stamp Card Name', 'filterName': 'name'},
            {"id": "5", "name": 'Stamps', 'filterName': 'stamps', 'disable_sort': true}, {"id": "6", "name": "Status", "filterName": "status", 'disable_sort': true},],
        stamp_cards : [],
        totalStampCards: 0,
        offset: 0,
        perPage: 50,
        orderType: 'asc',
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
        selectDate : false,
        randomKey: Math.floor(Math.random() * 11)
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentWillMount = () => {
        this.loadStampCards();
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    loadStampCards = () => {
        show_loader();
        // let url = BaseUrl + '/api/member-vouchers';
        let url = BaseUrl + '/api/member-stamp-cards';

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
                this.setState({
                    stamp_cards: res.data.data,
                    totalStampCards: res.data.count / this.state.perPage,
                    showListError: false,
                });
                show_loader(true);
            } else {

                show_loader(true);
                this.setState({showListError: true});
            }
        }).catch((err) => {

            show_loader(true);
            this.setState({showListError: true});
        });
    };

    changePageData = (data) => {
        this.setState({offset: Math.ceil(data.selected * this.state.perPage)}, () => this.loadStampCards());
    };

    changeDateFormat = (data) => {
        if(data){
            return moment(data).format("DD/MM/YYYY");
        } else {
            return '';
        }
    };

    stampCardActiveStatus = (stampCard) => {
        if(stampCard.punch_card_count === stampCard.quantity){
            return 'Completed';
        }
        else {
            return 'Active';
        }
    };

    changeActiveStatus = (item) => {
        var changed_data = [];
        this.state.stamp_cards.map(function (obj) {
            if(obj.id === item.id){
                if(obj.active === true){
                    obj.active = false;
                } else {
                    obj.active = true;
                }
            }
            changed_data.push(obj);
        });
        this.setState({stamp_cards : changed_data});
    };

    expandAll = (item) => {
        if(this.state.showAll){
            this.setState({showAll : false}, () => {this.getUpdatedStampCards()});
        }
        else {
            this.setState({showAll : true}, () => {this.getUpdatedStampCards()})
        }
    };

    getUpdatedStampCards = () => {
        var changed_data = [];
        this.state.stamp_cards.map((obj) => {
            obj.active = this.state.showAll ===  true ? true : false;
            changed_data.push(obj);
        });
        this.setState({stamp_cards : changed_data});
    };
    handleSelect = (ranges) => {
        const mySelection = (ranges.selection);
        this.setState({
            selection:mySelection,
            start_date : moment(mySelection.startDate).format("YYYY-MM-DD"),
            end_date : moment(mySelection.endDate).format("YYYY-MM-DD"),
            selectDate : true
        });

    };
    dateFilter = () => {
        if(!this.state.selectDate){
            NotificationManager.warning("Please select date", 'Missing Fields');
        } else {
            if(this.state.start_date !== '' || this.state.end_date !== ''){
                this.setState({offset:0}, () => {this.setState({showDatePicker: false, selectDate: true}, () => {this.loadStampCards();});});
            } else {
                this.setState({showDatePicker: false, selectDate: true}, () => {this.loadStampCards()();});
            }
        }
    };

    dateInputClick = () => {
        this.setState({showDatePicker: true});
    };
    hideDatePicker = () => {
        this.setState({showDatePicker: false, selectDate: false, start_date : '', end_date : '',offset:0}, () => {this.loadStampCards()});
    };
    printDiv = (divName) => {
        PrintTool.printExistingElement("#"+divName);
    };

    render() {
        const selectionRange = {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        };
        return (
            <div className="e_member_right">
                <div className="add_category_listing">
                    <ul>
                        <li>
                            <div className="add_categoryList_info addProduct_setting">
                                <div className="newVualt_heading">
                                    <h3>Member / <a href="javascript:void(0);">Stamp Cards</a></h3>
                                </div>
                                <div className="categoryInfo_container clearfix">
                                    <div className="addCategoryRight_section">
                                        <div className="edit_category_rightDetail removeHighlights">
                                            <div className="e_transactions_main">

                                                <StampCardStats persona_id = {this.props.persona_id} stamps={this.state.stamp_cards}/>

                                                <div className="e_transaction_list">
                                                    <div className="e_all_trans_heading">
                                                        <h4>STAMP CARD LIST</h4>
                                                    </div>
                                                    <div className="listing_floating_row clearfix">
                                                        <div className="fieldIncremnt">
                                                            <div className="quantity clearfix">
                                                                <input
                                                                    onChange={(e) => {
                                                                        this.setState({
                                                                            perPage: e.target.value,
                                                                            offset: 0
                                                                        }, () => {
                                                                        });
                                                                    }}
                                                                    onKeyUp={(e)=>{
                                                                        if(e.key === 'Enter') {
                                                                            this.setState(()=>({randomKey: Math.floor(Math.random() * 11)}),()=>{
                                                                                this.loadStampCards()
                                                                            });

                                                                        }
                                                                    }}
                                                                    min={5} step={5} max={100} value={this.state.perPage}
                                                                    type="number" />
                                                                <div className="quantity-nav">
                                                                    <div
                                                                        onClick={() => this.setState({
                                                                            perPage: ((this.state.perPage) + (1)),
                                                                            offset: 0
                                                                        }, () => {
                                                                            this.loadStampCards()
                                                                        })}
                                                                        className="quantity-button quantity-up"/>
                                                                    <div
                                                                        onClick={() => this.setState({
                                                                            perPage: ((this.state.perPage) - (1)),
                                                                            offset: 0
                                                                        }, () => {
                                                                            this.loadStampCards()
                                                                        })}
                                                                        className="quantity-button quantity-down"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="expand_button"><a onClick={this.expandAll}
                                                                                           style={{cursor:'pointer'}}>
                                                            {this.state.showAll ? 'Collapse All' : 'Expand All'}</a></div>
                                                        <div className="grid_searching clearfix date_range_changes">
                                                            <input onFocus={this.dateInputClick}
                                                                   placeholder=''
                                                                   className="searchInput cursor_style" type="text" value={(this.state.selectDate)?(moment(this.state.selection.startDate).format('ll') + ' - ' + moment(this.state.selection.endDate).format('ll')):'Select Date'} readOnly/>

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
                                                                <li><a onClick={this.dateFilter} className="" href="javascript:void(0);">APPLY</a></li>
                                                                <li><a onClick={this.hideDatePicker} className="" href="javascript:void(0);">CLEAR</a></li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    {this.state.showListError ?
                                                      <NoDataFound customMessage="Stamp Card"/>
                                                        :
                                                        <div className="category_list_outer trans_listing" id='printableArea'>
                                                            <div className="cL_listing_tableInn longText">
                                                                <HeaderComponent listData={this.state}
                                                                                 onClick={(id, name) => this.setState({
                                                                                     filterSegment: id,
                                                                                     orderType: name
                                                                                 }, () => this.loadStampCards())}/>

                                                                <ul>
                                                                    {
                                                                        this.state.stamp_cards.map((item) => {
                                                                            return <li key={item.id}>
                                                                                <div
                                                                                    className="e_transaction_accordion"
                                                                                    >
                                                                                    <div
                                                                                        className={item.active ? 'e_transaction_accordionTitle active' : 'e_transaction_accordionTitle'}>
                                                                                        <div
                                                                                            className="listDataShowing">
                                                                                            <div onClick={() => {
                                                                                                this.changeActiveStatus(item)
                                                                                            }}
                                                                                                className="cL_listing_table_row">
                                                                                                <div
                                                                                                    className="cL_listing_table_cell cell1  ">
                                                                                           <span
                                                                                               className="cL_rowList_number ">{item.id}</span>
                                                                                                </div>
                                                                                                <div
                                                                                                    className="cL_listing_table_cell cell2  ">
                                                                                           <span
                                                                                               className="cL_rowList_number ">{this.changeDateFormat(item.created_at)}</span>
                                                                                                </div>
                                                                                                <div
                                                                                                    className="cL_listing_table_cell cell3  ">
                                                                                           <span
                                                                                               className="cL_rowList_number ">{item.hasOwnProperty('business')?((JSON.parse(item.business).hasOwnProperty('business_name'))?JSON.parse(item.business).business_name:''):''}</span>
                                                                                                </div>
                                                                                                <div
                                                                                                    className="cL_listing_table_cell cell4  ">
                                                                                          <span
                                                                                              className="cL_rowList_number ">{item.name}</span>
                                                                                                </div>
                                                                                                <div
                                                                                                    className="cL_listing_table_cell cell5  ">
                                                                                          <span
                                                                                              className="cL_rowList_number ">{item.available_stamp}</span>
                                                                                                </div>
                                                                                                <div
                                                                                                    className="cL_listing_table_cell cell6  ">
                                                                                           <span
                                                                                               className="cL_rowList_number padingLeft0"><i
                                                                                               className={'activeRedeemed'}>&nbsp;</i>{'Active'}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    {item.active ?
                                                                                        <StampCardDetailMember
                                                                                            stamp={item} showReport={false}/> : ''}

                                                                                </div>
                                                                            </li>
                                                                        })
                                                                    }

                                                                </ul>
                                                            </div>
                                                        </div>
                                                    }
                                                    {this.state.showListError ? '' :
                                                        <div className="campLstng_paginaton_out">
                                                            <div className="campLstng_paginaton_inn">
                                                                <ReactPaginate key={this.state.randomKey} previousLabel={""} nextLabel={""}
                                                                               nextLinkClassName={'campPagi_next'}
                                                                               breakLabel={<a href="">...</a>}
                                                                               breakClassName={"break-me"}
                                                                               pageCount={this.state.totalStampCards}
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
                            <li><a href="javascript:void(0);" onClick={() => {this.printDiv('printableArea')}}>PRINT</a></li>
                        </ul>
                    </div>
                </div>
            </div>



        );
    }//..... end of render() .....//
}//..... end of Member.

StampCards.propTypes = {};

export default StampCards;
