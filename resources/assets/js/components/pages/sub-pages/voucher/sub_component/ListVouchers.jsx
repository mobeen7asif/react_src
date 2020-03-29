import React, {Component} from 'react';
import {connect} from 'react-redux';
import HeaderComponent from "../../dashboard/sub_components/HeaderComponent";
import ReactPaginate from 'react-paginate';
class ListVouchers extends Component{
    state={
        headerList: [{"id": "1", "name": 'Voucher Name', 'filterName': '_id', 'disable_sort': true}, {
            "id": "2",
            "name": 'Weight',
        }],
        offset: 0,
        perPage: 10,
        totalRecord: 0,
        allRecords:[],
        vouchersData:[]
    }
  /*  constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);

    }//..... end of constructor() .....//*/
    componentDidMount = () => {
        if(this.props.voucher_data.length>0) {
            this.setState(() => ({
                allRecords: this.props.voucher_data,
                totalRecord: Math.ceil(this.props.voucher_data.length / this.state.perPage),
            }), () => {
                this.loadNext()
            })
        }
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
            vouchersData: currentTodos
        })
    }
    render() {
        return (
            <div className="e_transaction_detial">
                <div className="e_transaction_top">

                </div>
                {
                    this.props.vouchers.length > 0 ?
                        <div className="e_transaction_bottom">
                            <div className="e_refunded">
                                <div className="e_refunded_heading">
                                    <h5>Vouchers</h5>
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
                                                    this.state.vouchersData.map((item) => {

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
                                                                                <input type='checkbox' />
                                                                                           <span
                                                                                               className="cL_rowList_number ">{item.name}</span>
                                                                            </div>
                                                                            <div
                                                                                className="cL_listing_table_cell cell2">
                                                                                           <span
                                                                                               className="cL_rowList_number "><input
                                                                                               type="text" value={item.value}/></span>
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
        )
    }
}

const mapStateToProps = (state) => ({
    ...state.voucherBuilder,
});
export default connect(mapStateToProps)(ListVouchers);