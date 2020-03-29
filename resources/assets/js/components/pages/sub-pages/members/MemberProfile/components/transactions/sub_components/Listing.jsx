import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import TransactionInvoice from "./TransactionInvoice";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar } from 'react-date-range';
import { DateRangePicker } from 'react-date-range';
import HeaderComponent from "../../../../sub_components/HeaderComponent";
import ReactPaginate from 'react-paginate';
import { PrintTool } from "react-print-tool";
import NoDataFound from "../../../../../../../_partials/NoDataFound";


class Listing extends Component {

    state = {
        headerList: [{"id": "1", "name": 'Transaction ID', 'filterName': 'transaction_id'}, {"id": "2", "name": 'Transaction Date', 'filterName': 'date'},
            {"id": "3", "name": 'Amount', 'filterName': 'amount'}, {"id": "4", "name": 'Payment Method', 'filterName': 'type'},
            {"id": "5", "name": 'Status', 'filterName': 'status'}, {"id": "6", "name": "Invoice", "filterName": "is_merchant", 'disable_sort': true}],
        transactions : [],
        pageCount: 0,
        offset: 0,
        perPage: 50,
        orderType: 'asc',
        filterSegment: 'transaction_id',
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
        card_filter: '',
        randomKey: Math.floor(Math.random() * 11)
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//
    componentDidMount = () => {
        this.loadTransactions();
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    loadTransactions = () => {
        show_loader();
        let url = BaseUrl + '/api/member-transactions';
        axios.post(url, {
            'company_id': CompanyID,
            'venue_id': VenueID,
            'pageSize': this.state.perPage,
            'offSet': this.state.offset,
            'sorting': this.state.filterSegment,
            'sortingOrder': this.state.orderType,
            'persona_id' : this.props.persona_id,
            'start_date' : this.state.start_date,
            'end_date' : this.state.end_date,
            'card_filter': this.state.card_filter
        }).then(res => {
            if (res.data.status) {
                var data = [];
                res.data.data.map(function (item) {
                    item.active = false;
                    data.push(item);
                });

                this.setState({
                    transactions: data,
                    pageCount: res.data.total/this.state.perPage,
                    showListError: false,
                });
                show_loader(true);
            } else {
                show_loader(true);
                this.setState({showListError: true});
            }
        })
            .catch((err) => {
                show_loader(true);
                this.setState({showListError: true});
            });
    };

    changePageData = (data) => {
        /*this.setState({offset: data.selected}, () => this.loadTransactions());*/
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        this.setState({offset: offset}, () => {
            this.loadTransactions();
        });

    };

    changeDateFormat = (data) => {
        if(data){
            return moment(data).format("DD/MM/YYYY");
        } else {
            return '';
        }
    };


    changeActiveStatus = (item) => {
        var changed_data = [];
        this.state.transactions.map(function (obj) {
            if(obj.transaction_id === item.transaction_id){
                if(obj.active === true){
                    obj.active = false;
                } else {
                    obj.active = true;
                }
            }
            changed_data.push(obj);
        });
        this.setState({transactions : changed_data});
    };

    expandAll = (item) => {
        if(this.state.showAll){
            this.setState({showAll : false}, () => {this.getUpdatedTransactions()});
        }
        else {
            this.setState({showAll : true}, () => {this.getUpdatedTransactions()})
        }
    };

    getUpdatedTransactions = () => {
        var changed_data = [];
        this.state.transactions.map((obj) => {
            obj.active = this.state.showAll ===  true ? true : false;
            changed_data.push(obj);
        });
        this.setState({transactions : changed_data});
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
                this.setState({offset:0}, () => {this.setState({showDatePicker: false, selectDate: true}, () => {this.loadTransactions();});});
            } else {
                this.setState({showDatePicker: false, selectDate: true}, () => {this.loadTransactions();});
            }
        }
    };

    dateInputClick = () => {
        this.setState({showDatePicker: true});
    };

    hideDatePicker = () => {
        this.setState({showDatePicker: false, selectDate: false, start_date : '', end_date : '',offset:0}, () => {this.loadTransactions()});
    };

    printDiv = (divName) => {
        PrintTool.printExistingElement("#"+divName);
    };

    render() {
        return (

            <div className="e_transaction_list">
                <div className="e_all_trans_heading">
                    <h4>POINTS LIST</h4>
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
                                            this.loadTransactions()
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
                                        this.loadTransactions()
                                    })}
                                    className="quantity-button quantity-up"/>
                                <div
                                    onClick={() => this.setState({
                                        perPage: ((this.state.perPage) - (1)),
                                        offset: 0
                                    }, () => {
                                        this.loadTransactions()
                                    })}
                                    className="quantity-button quantity-down"/>
                            </div>
                        </div>
                    </div>
                    <div className="expand_button"><a onClick={this.expandAll}
                                                       style={{cursor:'pointer'}}>
                        {this.state.showAll ? 'Collapse All' : 'Expand All'}</a></div>


                    <div className="grid_searching newList">
                        <ul>
                            <li onClick={() => {this.setState({card_filter: 'cash'}, () => {this.loadTransactions()})}}><a  style={{cursor:'pointer'}} className={this.state.card_filter === 'cash' ? 'e_transactionPayment_1 card_filter' : 'e_transactionPayment_1'}>&nbsp;</a></li>
                            <li onClick={() => {this.setState({card_filter: 'card'}, () => {this.loadTransactions()})}}><a  style={{cursor:'pointer'}} className={this.state.card_filter === 'card' ? 'e_transactionPayment_2 card_filter' : 'e_transactionPayment_2'}>&nbsp;</a></li>
                            {/*<li onClick={() => {this.setState({card_filter: 'master'}, () => {this.loadTransactions()})}}><a  style={{cursor:'pointer'}} className={this.state.card_filter === 'master' ? 'e_transactionPayment_3 card_filter' : 'e_transactionPayment_3'}>&nbsp;</a></li>*/}
                        </ul>

                    </div>



                    <div className="grid_searching clearfix date_range_changes">

                        <input onFocus={this.dateInputClick}
                               placeholder=''
                               className="searchInput cursor_style" type="text" value={(this.state.selectDate)?(moment(this.state.selection.startDate).format('ll') + ' - ' + moment(this.state.selection.endDate).format('ll')):'Select Date'} readOnly/>
                        <ul>
                            <li className="searching_li">
                                <div className="searching clearfix" style={this.state.showDatePicker ? {display: 'block'} : {display: 'none'}}>
                                    <DateRangePicker className="rdrDateRangeWrapper"
                                                     ranges={[this.state.selection]}
                                                     onChange={this.handleSelect}/>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="e_member_printBtns clearfix filter_btns" style={this.state.showDatePicker ? {display: 'block'} : {display: 'none'}}>
                        <ul>
                            <li><a  onClick={this.dateFilter}  href="javascript:void(0);">APPLY</a></li>
                            <li><a onClick={this.hideDatePicker}  href="javascript:void(0);">CLEAR</a></li>
                        </ul>
                    </div>
                </div>

                {this.state.showListError ?
                    <NoDataFound customMessage="Points"/>
                    :
                    <div className="category_list_outer trans_listing" id='printableArea'>
                        <div className="cL_listing_tableInn longText">
                            <HeaderComponent listData={this.state}
                                             onClick={(id, name) => this.setState({
                                                 filterSegment: id,
                                                 orderType: name
                                             }, () => this.loadTransactions())}/>

                            <ul>
                                {
                                    this.state.transactions.map((item) => {

                                        return <li key={Math.random()}>
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
                                                                                               className="cL_rowList_number ">{item.transaction_id}</span>
                                                            </div>
                                                            <div
                                                                className="cL_listing_table_cell cell2  ">
                                                                                           <span
                                                                                               className="cL_rowList_number ">{this.changeDateFormat(item.date)}</span>
                                                            </div>
                                                            <div
                                                                className="cL_listing_table_cell cell3  ">
                                                                                           <span
                                                                                               className="cL_rowList_number ">{(item.currency ? item.currency : '')  + (item.amount ? Number(item.amount).toFixed(2) : 0)}</span>
                                                            </div>
                                                            <div
                                                                className="cL_listing_table_cell cell4  ">
                                                                                           <span
                                                                                               className="cL_rowList_number capital_text">{item.type}</span>
                                                            </div>
                                                            <div
                                                                className="cL_listing_table_cell cell5  ">
                                                                                                   <span
                                                                                                       className="cL_rowList_number capital_text">{item.status}</span>
                                                            </div>
                                                            <div
                                                                className="cL_listing_table_cell cell6  ">
                                                                                                   <span
                                                                                                       className="cL_rowList_number">{'Invoice'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>


                                                {item.active ?
                                                    <TransactionInvoice
                                                        transaction={item}/> : ''}

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
                                           pageCount={this.state.pageCount}
                                           marginPagesDisplayed={2}
                                           pageRangeDisplayed={5}
                                           previousLinkClassName={'campPagi_prev'}
                                           onPageChange={this.changePageData}
                                           activeClassName={"active"}/>
                        </div>
                    </div>
                }

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

Listing.propTypes = {};

export default Listing;
