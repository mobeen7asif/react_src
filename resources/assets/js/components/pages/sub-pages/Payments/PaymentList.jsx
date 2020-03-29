import React, {Component} from 'react';
import { DateRangePicker } from 'react-date-range';
import HeaderComponent from "../dashboard/sub_components/HeaderComponent";
import ReactPaginate from 'react-paginate';
import VoucherDetail from "../members/MemberProfile/components/vouchers/sub_components/VoucherDetail";
import {resetSegmentSearch} from "../../../redux/actions/CampaignBuilderActions";
import PaymentDetail from "./PaymentDetail";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import {NotificationManager} from "react-notifications";
import NoDataFound from "../../../_partials/NoDataFound";
class PaymentList extends Component {
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    state = {
        headerList: [{"id": "1", "name": 'User Name', 'filterName': '_id','disable_sort': true}, {"id": "2", "name": 'Order Amount', 'filterName': 'dateadded','disable_sort': true},
            {"id": "3", "name": 'Items Count', 'filterName': 'business_name','disable_sort': true}, {"id": "4", "name": 'Payment Time', 'filterName': 'promotion_text','disable_sort': true},
            {"id": "5", "name": 'Email', 'filterName': 'voucher_amount', 'disable_sort': true}, {"id": "6", "name": "Client ID", "filterName": "voucher_status", 'disable_sort': true},
            {"id": "7", "name": "Refund", "filterName": "voucher_status", 'disable_sort': true}],
        payments : [],
        pageCount: 0,
        offset: 0,
        perPage: 10,
        orderType: 'asc',
        filterSegment: 'created_at',
        showAll : false,
        showListError : false,
        search : '',
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
        randomKey: Math.floor(Math.random() * 11),
        refund_id:0,
        country: '',
        amount: 0,
        currency: '',
        items_discount: 0,
        delete_payment: false
    };

    componentDidMount = () => {
        this.loadAllPayments();
    };

    loadAllPayments =() =>{
        show_loader(false);
        axios.post(BaseUrl + '/api/get-all-payments', {
            'pageSize': this.state.perPage,
            'search':this.state.search,
            'offSet': this.state.offset,
            'sorting': this.state.filterSegment,
            'sortingOrder': this.state.orderType,
            'start_date' : this.state.start_date,
            'end_date' : this.state.end_date
        }).then(res => {
            if (res.data.status) {
                this.setState(()=>({
                    payments : res.data.data,
                    pageCount: res.data.total / this.state.perPage,
                }),()=>{
                    show_loader(true);
                })


            } else {

                show_loader(true);
                this.setState({showListError: true});
            }
        }).catch((err) => {

            show_loader(true);
            this.setState({showListError: true});
        });
    }//------ End of loadAllPayments() ------//

    changeDateFormat = (data) => {
        if(data){
            return moment(data*1000).format("DD/MM/YYYY");
        } else {
            return '';
        }
    };


    changeActiveStatus = (item) => {
        var changed_data = [];
        this.state.payments.map(function (obj) {
            if(obj.id === item.id){
                if(obj.active === true){
                    obj.active = false;
                } else {
                    obj.active = true;
                }
            }
            changed_data.push(obj);
        });
        this.setState({payments : changed_data});
    };

    changePageData = (data) => {
        this.setState({offset: Math.ceil(data.selected * this.state.perPage)}, () => this.loadAllPayments());
    };


    addSearchResult = (e) => {
        var value= e.target.value;

        this.setState(() => ({
            search: value
        }), () => {
            this.loadAllPayments();

        })

    };

    expandAll = (item) => {
        if(this.state.showAll){
            this.setState({showAll : false}, () => {this.getUpdatedPayments()});
        }
        else {
            this.setState({showAll : true}, () => {this.getUpdatedPayments()})
        }
    };
    dateInputClick = () => {
        this.setState({showDatePicker: true});
    };
    hideDatePicker = () => {
        this.setState({showDatePicker: false, selectDate: false, start_date : '', end_date : '',offset:0}, () => {this.loadAllPayments()});
    };

    getUpdatedPayments = () => {
        var changed_data = [];
        this.state.payments.map((obj) => {
            obj.active = this.state.showAll ===  true ? true : false;
            changed_data.push(obj);
        });
        this.setState({payments : changed_data});
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
                this.setState({offset:0}, () => {this.setState({showDatePicker: false, selectDate: true}, () => {this.loadAllPayments();});});
            } else {
                this.setState({showDatePicker: false, selectDate: true}, () => {this.loadAllPayments();});
            }
        }
    };

    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.loadAllPayments();
        }
    };//--- End of enterPressed() ----//

    refundPaymentClick = (refund_id,country,amount,items_discount,delete_payment) => {
        this.setState({refund_id:refund_id,country:country,amount:amount,items_discount:items_discount,delete_payment:delete_payment});
    };

    handleCloseModal = () => {
        this.setState(() => ({refund_id: 0}));
    };

    handleRefund = () => {
        show_loader();
        const headers = {
            'Country': this.state.country
        };
        axios.post(`${BaseUrl}/api/refund-payment`,
            {
                'refund_id': this.state.refund_id,
                'amount': this.state.amount,
                'items_discount': this.state.items_discount,
                'delete_payment': this.state.delete_payment
            },
            {
                headers
            }
            )
            .then((response) => {
                show_loader();
                if (response.data.status === true){
                    let paymentList = this.state.payments;
                    this.state.payments.map((payment) => {
                        let obj = paymentList.findIndex(o => o.id == payment.id);
                        if (obj > -1) {
                            paymentList.splice(obj, 1);
                        }
                    });
/*
                    this.state.selectedIds.map( (refund_id) => {
                        let obj = paymentList.findIndex(o => o._id == refund_id);
                        if (obj > -1) {
                            paymentList.splice(obj, 1);
                        }
                    });*/
                    this.setState(()=>({payments: paymentList,
                        refund_id:0,
                    })),() => {
                        //console.log('member list after',this.state.membersList.length);
                    };
                    NotificationManager.success(response.data.message, 'Success');
                    // this.loadMemberDetail();
                } else
                    NotificationManager.error(response.data.message, 'Error');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleRefund() .....//

    render() {
        return (
            <div>
                <div className="categoryInfo_container clearfix">
                    <div >
                        <div className="edit_category_rightDetail removeHighlights">
                            <div className="e_transactions_main">
                                <div className="searchCompaign clearfix">
                                    <div className="preloader3" style={{marginLeft: '-104px', marginTop: '0px', display: 'none'}}>&nbsp;</div>
                                    <input type="text" placeholder="Search " value={this.state.search}
                                           onChange={(e) => this.setState({search: e.target.value, offset: 0})}
                                           onKeyPress={this.enterPressed} className="copmpaignSearch_field" style={{'borderBottom': '1px solid lightgray'}}/>
                                    <input type="submit" value="" className="copmpaignIcon_field" onClick={() => this.addSearchResult()} />
                                </div>

                                <div className="e_transaction_list">
                                    <div className="e_all_trans_heading">
                                        <h4>FAILED TRANSACTIONS</h4>
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
                                                                this.loadAllPayments()
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
                                                            this.loadAllPayments()
                                                        })}
                                                        className="quantity-button quantity-up"/>
                                                    <div
                                                        onClick={() => this.setState({
                                                            perPage: ((this.state.perPage) - (1)),
                                                            offset: 0
                                                        }, () => {
                                                            this.loadAllPayments()
                                                        })}
                                                        className="quantity-button quantity-down"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="expand_button"><a onClick={this.expandAll}
                                                                          style={{cursor:'pointer','opacity':'1'}}>
                                            {this.state.showAll ? 'Collapse All' : 'Expand All'}</a></div>
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


                                        <div className="e_member_printBtns clearfix filter_btns" style={this.state.showDatePicker ? {display: 'block', 'marginTop':'-57px'} : {display: 'none'}}>
                                            <ul>
                                                <li><a  onClick={this.dateFilter}  href="javascript:void(0);">APPLY</a></li>
                                                <li><a onClick={this.hideDatePicker}  href="javascript:void(0);">CLEAR</a></li>
                                            </ul>
                                        </div>
                                    </div>

                                    {this.state.showListError ?
                                        <NoDataFound customMessage="Payment"/>
                                        :
                                        <div ref={'printable_area'} className="category_list_outer trans_listing" id='printableArea'>
                                            <div className="cL_listing_tableInn longText">
                                                <HeaderComponent listData={this.state}
                                                                 onClick={(id, name) => this.setState({
                                                                     filterSegment: id,
                                                                     orderType: name
                                                                 }, () => this.loadAllPayments())}/>

                                                <ul>
                                                    {
                                                        this.state.payments.map((item) => {
                                                            return <li key={item.id}>
                                                                <div
                                                                    className="e_transaction_accordion"
                                                                >
                                                                    <div
                                                                        className={item.active ? 'e_transaction_accordionTitle active' : 'e_transaction_accordionTitle'}>
                                                                        <div
                                                                            className="listDataShowing">
                                                                            <div
                                                                                 className="cL_listing_table_row">
                                                                                <div
                                                                                    className="cL_listing_table_cell cell1">
                                                                                           <span
                                                                                               className="cL_rowList_number">{item.user_name}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell2">
                                                                                           <span
                                                                                               className="cL_rowList_number">{Number(item.ord_amount).toFixed(2)}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell3">
                                                                                           <span onClick={() => {
                                                                                               this.changeActiveStatus(item)
                                                                                           }}
                                                                                               className="cL_rowList_number line_item">{item.items_count}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell4">
                                                                                           <span
                                                                                               className="cL_rowList_number">{item.ord_time}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell5">
                                                                                           <span
                                                                                               className="cL_rowList_number">{item.user_email}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell6">
                                                                                           <span
                                                                                               className="cL_rowList_number">{item.client_id}</span>
                                                                                </div>
                                                                                {
                                                                                    item.payment_status == 'complete' ?
                                                                                        <div
                                                                                            className="cL_listing_table_cell cell3">
                                                                                            <a className="bulk_delete" style={{float:'none'}} onClick={()=>{this.refundPaymentClick(item.payment_id,item.country,item.ord_amount,item.items_discount,true)}}>Delete</a>
                                                                                        </div>
                                                                                        :
                                                                                        <div
                                                                                            className="cL_listing_table_cell cell3">
                                                                                            <a className="bulk_delete" style={{background: 'green',float:'none'}} onClick={()=>{this.refundPaymentClick(item.payment_id,item.country,item.ord_amount,item.items_discount,false)}}>Refund</a>
                                                                                        </div>
                                                                                }


                                                                            </div>
                                                                        </div>
                                                                    </div>


                                                                    {item.active ?
                                                                        <PaymentDetail
                                                                            payment={item} listProducts={true}/> : ''}

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

                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <ConfirmationModal refund={true} isOpen={!!this.state.refund_id} handleCloseModal={this.handleCloseModal} text={'transaction'} handleDeleteItem={this.handleRefund}/>

            </div>

        );
    }//..... end of render() .....//
}

export default PaymentList;