import React, {Component} from 'react';
import HeaderComponent from "../../dashboard/sub_components/HeaderComponent";
import ReactPaginate from 'react-paginate';

class RedeemptionDetail extends Component {

    state = {
        voucher: {},
        offset: 0,
        perPage: 10,
        stampData: [],
        totalRecord: 0,
        allRecords:[],
        headerList: [{"id": "1", "name": 'Voucher Name', 'filterName': '_id', 'disable_sort': true}, {
            "id": "2",
            "name": 'count',
            'filterName': 'dateadded',
            'disable_sort': true
        }],
        offset1: 0,
        perPage1: 10,
        voucherRedeemed: [],
        totalvoucherRedeemed: 0,
        allvoucherRedeemed:[],
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleClickRedeem = this.handleClickRedeem.bind(this);
    }//..... end of constructor() .....//


    changeDateFormat = (data) => {
        if (data) {
            return moment(data * 1000).format("DD/MM/YYYY");
        } else {
            return '';
        }
    };

    changeDateFormatReport = (data) => {
        if (data) {
            return moment(data ).format("DD/MM/YYYY");
        } else {
            return '';
        }
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    componentDidMount = () => {
        this.setState(() => ({
            allRecords:this.props.redeem.issued_vouchers,
            totalRecord: Math.ceil(this.props.redeem.issued_vouchers.length / this.state.perPage),
            allvoucherRedeemed:this.props.redeem.voucher_details,
            totalvoucherRedeemed: Math.ceil(this.props.redeem.voucher_details.length / this.state.perPage1),

        }), () => {
            this.loadNext(),
                this.loadRedeemNext()
        })
    };

    loadNext = () => {
        var startObject = 0;
        var endData = 0;
        if (this.state.offset > 0) {
            startObject = Math.abs((this.state.offset - this.state.perPage));
            endData = this.state.offset;
        } else {
            startObject = this.state.offset;
            endData = this.state.perPage;
        }
        const currentTodos = this.state.allRecords.slice(startObject, endData);

        this.setState({
            stampData: currentTodos
        })
    }

    handleClick(data) {
        this.setState(() => ({
            offset: Math.ceil((data.selected + 1) * this.state.perPage)
        }), () => {
            this.loadNext()
        })
    };

    handleClickRedeem(data) {
        this.setState(() => ({
            offset1: Math.ceil((data.selected + 1) * this.state.perPage1)
        }), () => {
            this.loadRedeemNext()
        })
    };
    loadRedeemNext=()=>{
        var startObject = 0;
        var endData = 0;
        if (this.state.offset1 > 0) {
            startObject = Math.abs((this.state.offset1 - this.state.perPage1));
            endData = this.state.offset1;
        } else {
            startObject = this.state.offset1;
            endData = this.state.perPage1;
        }
        const currentTodos = this.state.allvoucherRedeemed.slice(startObject, endData);

        this.setState({
            voucherRedeemed: currentTodos
        })
    }
    render() {
        return (

            <div className="e_transaction_accordionShow"
                 style={this.props.redeem.active === true ? {display: 'block'} : {display: 'none'}}>
                <div className="e_transaction_detial">
                    <div className="e_transaction_top">

                    </div>
                    {
                        this.props.redeem.issued_vouchers.length > 0 ?
                            <div className="e_transaction_bottom">
                                <div className="e_refunded">
                                    <div className="e_refunded_heading">
                                        <h5>Issued Voucher</h5>
                                    </div>

                                    <div className="e_transaction_list">
                                        <div className="e_all_trans_heading">

                                        </div>
                                        <div ref={'printable_area'} className="category_list_outer trans_listing"
                                             id='printableArea'>
                                            <div className="cL_listing_tableInn longText">
                                                <HeaderComponent listData={this.state}/>

                                                <ul>
                                                    {
                                                        this.state.stampData.map((item) => {

                                                            return <li key={item._id}>
                                                                <div
                                                                    className="e_transaction_accordion"
                                                                >
                                                                    <div
                                                                        className='e_transaction_accordionTitle'>
                                                                        <div
                                                                            className="listDataShowing">
                                                                            <div
                                                                                className="cL_listing_table_row">
                                                                                <div
                                                                                    className="cL_listing_table_cell cell1 ">
                                                                                           <span
                                                                                               className="cL_rowList_number ">{(item._source.voucher_name)?item._source.voucher_name:item._source.promotion_text}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell2">
                                                                                           <span
                                                                                               className="cL_rowList_number ">1</span>
                                                                                </div>


                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </li>
                                                        })
                                                    }

                                                </ul>
                                            </div>

                                        </div>


                                    </div>
                                    <div className="campLstng_paginaton_out">
                                        <div className="campLstng_paginaton_inn produt_avail">
                                            <ReactPaginate previousLabel={""} nextLabel={""}
                                                           nextLinkClassName={'campPagi_next'}
                                                           breakLabel={<a href="">...</a>}
                                                           breakClassName={"break-me"}
                                                           pageCount={this.state.totalRecord}
                                                           marginPagesDisplayed={2}
                                                           pageRangeDisplayed={5}
                                                           previousLinkClassName={'campPagi_prev'}
                                                           onPageChange={this.handleClick}
                                                           activeClassName={"active"}/>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            : ''
                    }
                </div>
         <div className="e_transaction_detial">
                    <div className="e_transaction_top">

                    </div>
                    {
                        this.props.redeem.voucher_details.length > 0 ?
                            <div className="e_transaction_bottom">
                                <div className="e_refunded">
                                    <div className="e_refunded_heading">
                                        <h5>Redeemed Vouchers</h5>
                                    </div>

                                    <div className="e_transaction_list">
                                        <div className="e_all_trans_heading">

                                        </div>
                                        <div ref={'printable_area'} className="category_list_outer trans_listing"
                                             id='printableArea'>
                                            <div className="cL_listing_tableInn longText">
                                                <HeaderComponent listData={this.state}/>

                                                <ul>
                                                    {
                                                        this.state.voucherRedeemed.map((item) => {

                                                            return <li key={item._id}>
                                                                <div
                                                                    className="e_transaction_accordion"
                                                                >
                                                                    <div
                                                                        className='e_transaction_accordionTitle'>
                                                                        <div
                                                                            className="listDataShowing">
                                                                            <div
                                                                                className="cL_listing_table_row">
                                                                                <div
                                                                                    className="cL_listing_table_cell cell1 ">
                                                                                           <span
                                                                                               className="cL_rowList_number ">{(item._source.voucher_name)?item._source.voucher_name:item._source.promotion_text}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell2">
                                                                                           <span
                                                                                               className="cL_rowList_number ">{item._source.usedVoucher}</span>
                                                                                </div>


                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </li>
                                                        })
                                                    }

                                                </ul>
                                            </div>

                                        </div>


                                    </div>
                                    <div className="campLstng_paginaton_out">
                                        <div className="campLstng_paginaton_inn produt_avail">
                                            <ReactPaginate previousLabel={""} nextLabel={""}
                                                           nextLinkClassName={'campPagi_next'}
                                                           breakLabel={<a href="">...</a>}
                                                           breakClassName={"break-me"}
                                                           pageCount={this.state.totalvoucherRedeemed}
                                                           marginPagesDisplayed={2}
                                                           pageRangeDisplayed={5}
                                                           previousLinkClassName={'campPagi_prev'}
                                                           onPageChange={this.handleClickRedeem}
                                                           activeClassName={"active"}/>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            : ''
                    }
                </div>



            </div>


        );
    }//..... end of render() .....//
}//..... end of Member.

RedeemptionDetail.propTypes = {};

export default RedeemptionDetail;
