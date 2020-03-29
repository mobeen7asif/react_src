import React, {Component} from 'react';

import ReactPaginate from 'react-paginate';
import HeaderComponent from "../members/sub_components/HeaderComponent";
class PaymentDetail extends Component {

    state = {
        voucher: {},
        offset:0,
        perPage: 3,
        paymentData: [],
        totalRecord:0,
        allRecords:this.props.payment.ord_items,
        headerList: [{"id": "1", "name": 'Product ID', 'filterName': '_id','disable_sort': true}, {"id": "2", "name": 'Product Name', 'filterName': 'dateadded','disable_sort': true}]
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }//..... end of constructor() .....//

    componentDidMount = () => {
        this.setState({
            totalRecord: Math.ceil(this.state.allRecords.length / this.state.perPage)
        })
        this.loadNext();
    };

    changeDateFormat = (data) => {
        return moment(data * 1000).format("DD/MM/YYYY");
    };


    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    handleClick(data) {
        console.log(data);
        this.setState(()=>({
            offset: Math.ceil((data.selected + 1) * this.state.perPage)
        }),()=>{
            this.loadNext()
        })
    }
    loadNext = () =>{
        var startObject=0;
        var endData=0;
        if(this.state.offset>0){
            startObject =Math.abs((this.state.offset - this.state.perPage ));
            endData = this.state.offset;
        }else{
            startObject =this.state.offset;
            endData = this.state.perPage;
        }
        const currentTodos = this.state.allRecords.slice(startObject,endData);

        this.setState({
            paymentData:currentTodos
        })
    }

    render() {
        return (
            <div className="e_transaction_accordionShow"
                 style={this.props.payment.active === true ? {display: 'block'} : {display: 'none'}}>
                <div className="e_transaction_detial">
                    {
                        this.props.payment.ord_items.length > 0 && this.props.listProducts ?
                            <div className="e_transaction_bottom">
                                <div className="e_refunded">
                                    <div className="e_transaction_list">
                                        <div className="e_all_trans_heading">
                                            <h4>Order Items</h4>
                                        </div>
                                        <div ref={'printable_area'} className="category_list_outer trans_listing" id='printableArea'>
                                            <div className="cL_listing_tableInn longText">
                                                <HeaderComponent listData={this.state} />

                                                <ul>
                                                    {
                                                        this.state.paymentData.map((item) => {

                                                            return <li key={item.prd_id}>
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
                                                                                               className="cL_rowList_number ">{item.prd_id}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell2">
                                                                                           <span
                                                                                               className="cL_rowList_number ">{item.prd_name}</span>
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
                                            <ReactPaginate  previousLabel={""} nextLabel={""}
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
            </div>

        );
    }//..... end of render() .....//
}//..... end of Member.

PaymentDetail.propTypes = {};

export default PaymentDetail;
