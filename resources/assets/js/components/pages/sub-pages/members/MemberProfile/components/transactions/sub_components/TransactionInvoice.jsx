import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";


class TransactionInvoice extends Component {

    state = {
        count : 0,
        amount : 0,
        last_received : '',
        voucher_percentage : 0
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//



    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    changeTimeFormat = (data) => {
        if(data){
            console.log('date',data);
            return moment(data).format("hh:mm:ss a");
        } else {
            return '';
        }
    };

    changeDateFormat = (data) => {
        if(data){
            return moment(data).format("DD/MM/YYYY");
        } else {
            return '';
        }
    };



    render() {
        return (

            <div className="e_transaction_accordionShow" style={this.props.transaction.active === true ? {display : 'block'} : {display : 'none'}}>
                <div className="e_transaction_detial">
                    <div className="e_transaction_top">
                        <div className="e_authorisation clearfix">
                            <div className="e_authorisation_left">
                                <div className="e_authorisation_list">
                                    <ul>
                                        <li>
                                            <div className="e_authorisation_inner clearfix">
                                                <div className="e_authorisation_listLeft">
                                                    <div className="e_authorisation_text"> <span>Transaction ID</span> <strong>{this.props.transaction.transaction_id}</strong> </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="e_authorisation_inner clearfix">
                                                <div className="e_authorisation_listLeft">
                                                    <div className="e_authorisation_text"> <span>Authorisation Date</span> <strong>{this.changeDateFormat(this.props.transaction.date)}</strong> </div>
                                                </div>
                                                <div className="e_authorisation_listRight">
                                                    <div className="e_authorisation_text"> <span>Authorisation Time</span> <strong>{this.changeTimeFormat(this.props.transaction.date)}</strong> </div>
                                                </div>
                                            </div>
                                        </li>

                                        <li>
                                            <div className="e_authorisation_inner clearfix">
                                                <div className="e_authorisation_listLeft">
                                                    <div className="e_authorisation_text"> <span>Business</span> <strong>{this.props.transaction.business_name}</strong> </div>
                                                </div>
                                                <div className="e_authorisation_listRight">
                                                    <div className="e_authorisation_text"> <span>Staff Member</span> <strong>{this.props.transaction.staff_member}</strong> </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="e_authorisation_inner clearfix">
                                                <div className="e_authorisation_listLeft">
                                                    <div className="e_authorisation_text"> <span>Payment Method</span>
                                                        <figure>
                                                            {
                                                                this.props.transaction.type == 'card' ?
                                                                    <i>
                                                                        <img src={BaseUrl+"/assets/images/mastercard-icon@2x.png"} alt="#" />
                                                                    </i>: ''
                                                            }
                                                            <strong>{firstLetterCapital(this.props.transaction.type)}</strong>
                                                        </figure>
                                                    </div>
                                                </div>
                                                <div className="e_authorisation_listRight">
                                                    <div className="e_authorisation_text"> <span>Status </span> <strong className={'capital_text'}>{this.props.transaction.status}</strong> </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="e_authorisation_right">
                                <div className="e_authorisation_box">
                                    <div className="e_authorisation_list">
                                        <ul>
                                            <li>
                                                <div className="e_authorisation_inner clearfix">
                                                    <div className="e_authorisation_listLeft">
                                                        <div className="e_authorisation_text"> <span>Transaction Value</span>
                                                            <h1>{(this.props.transaction.currency ? this.props.transaction.currency : '')+ (this.props.transaction.amount ? Number(this.props.transaction.amount).toFixed(2): 0)}</h1>
                                                        </div>
                                                    </div>
                                                    <div className="e_authorisation_listRight">
                                                        <div className="e_authorisation_text"> <span>Items in Transaction</span>
                                                            <h1>{this.props.transaction.number_of_items}</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="e_authorisation_inner clearfix">
                                                    <div className="e_authorisation_listLeft">
                                                        <div className="e_authorisation_text"> <span>Tax Amount</span> <strong>{(this.props.transaction.currency ? this.props.transaction.currency: '')+ (this.props.transaction.tax ? Number(this.props.transaction.tax).toFixed(2) : 0)}</strong> </div>
                                                    </div>
                                                    <div className="e_authorisation_listRight">
                                                        <div className="e_authorisation_text"> <span>Discount Amount</span> <strong>{(this.props.transaction.currency ? this.props.transaction.currency: '')+ (this.props.transaction.discount ? Number(this.props.transaction.discount).toFixed(2): 0)}</strong> </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="e_authorisation_inner clearfix">
                                                    <div className="e_authorisation_listLeft">
                                                        <div className="e_authorisation_text"> <span>Tip Amount</span> <strong>0</strong> </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*{*/}
                    {/*this.props.transaction.refunded_items.length > 0 ?*/}
                    {/*<div className="e_transaction_bottom">*/}
                    {/*<div className="e_refunded">*/}
                    {/*<div className="e_refunded_heading">*/}
                    {/*<h5>Refunded Items</h5>*/}
                    {/*</div>*/}

                    {/*<div className="e_refunded_table">*/}
                    {/*<div className="category_list_outer trans_listing">*/}
                    {/*<div className="cL_listing_tableInn">*/}
                    {/*<div className="cL_listing_tableTitle">*/}
                    {/*<div className="cL_listing_table_row">*/}
                    {/*<div className="cL_listing_table_cell cell1   "> <strong><span><b></b><b></b></span>Date</strong> </div>*/}
                    {/*<div className="cL_listing_table_cell cell1  "> <strong><span><b></b><b></b></span>Product Name</strong> </div>*/}
                    {/*<div className="cL_listing_table_cell cell1  "> <strong><span><b></b><b></b></span>Total Refunded</strong> </div>*/}
                    {/*<div className="cL_listing_table_cell cell1  "> <strong><span><b></b><b></b></span>Refunded Amount</strong> </div>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*<ul>*/}
                    {/*{*/}
                    {/*this.props.transaction.refunded_items.map((refunded) => {*/}
                    {/*return <li>*/}
                    {/*<div className="listDataShowing">*/}
                    {/*<div className="cL_listing_table_row">*/}
                    {/*<div className="cL_listing_table_cell cell1  "> <span className="cL_rowList_number ">{this.props.transaction.ord_date}</span> </div>*/}
                    {/*<div className="cL_listing_table_cell cell1  "> <span className="cL_rowList_number ">{refunded.prd_name}</span> </div>*/}
                    {/*<div className="cL_listing_table_cell cell1  "> <span className="cL_rowList_number ">{refunded.refunded_qty}</span> </div>*/}
                    {/*<div className="cL_listing_table_cell cell1  "> <span className="cL_rowList_number ">${refunded.refunded_amount}</span> </div>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*</li>*/}
                    {/*})*/}
                    {/*}*/}

                    {/*</ul>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*</div>*/}

                    {/*</div>*/}
                    {/*</div>*/}
                    {/*: ''*/}
                    {/*}*/}
                </div>
            </div>


        );
    }//..... end of render() .....//
}//..... end of Member.

TransactionInvoice.propTypes = {};

export default TransactionInvoice;
