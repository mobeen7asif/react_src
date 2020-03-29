import React, {Component} from 'react';

import ReactPaginate from 'react-paginate';
import HeaderComponent from "../../../../sub_components/HeaderComponent";
class VoucherDetail extends Component {

    state = {
        voucher: {},
        offset:0,
        perPage: 10,
        voucherAvailData: [],
        totalRecord:0,
        allRecords:(this.props.voucher.user_voucher.length>0)?this.props.voucher.user_voucher[0].voucher_avial_data:[],
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
        return moment(data).format("DD/MM/YYYY");
    };

    loadVoucherDetail = () => {
        show_loader();
        let url = BaseUrl + '/api/voucher-detail';
        axios.post(url, {
            'company_id': CompanyID,
            'venue_id': VenueID,
            'voucher_id': this.props.voucher._id
        }).then(res => {
            if (res.data.status) {
                this.setState({
                    voucher: res.data,
                });
                show_loader(true);
                this.preLoader.hide();
            } else {
                show_loader(true);
                this.setState({showError: true});
            }
        }).catch((err) => {
            show_loader(true);
            this.setState({showError: true});
        });
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    handleClick(data) {
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
            voucherAvailData:currentTodos
        })
    }

    render() {
        return (
            <div className="e_transaction_accordionShow"
                 style={this.props.voucher.active === true ? {display: 'block'} : {display: 'none'}}>
                <div className="e_transaction_detial">
                    <div className="e_transaction_top">
                        <div className="e_authorisation clearfix">
                            <div className="e_authorisation_left">
                                <div className="e_authorisation_list">
                                    <ul>
                                        <li>
                                            <div className="e_authorisation_inner clearfix">
                                                <div className="e_authorisation_listLeft">
                                                    <div className="e_authorisation_text"><span>Voucher ID</span>
                                                        <strong>{this.props.voucher.voucher_code}</strong></div>
                                                </div>
                                                <div className="e_authorisation_listRight">
                                                    <div className="e_authorisation_text"><span>Date</span>
                                                        <strong>{this.changeDateFormat(this.props.voucher.created_at)}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="e_authorisation_inner clearfix">
                                                <div className="e_authorisation_listLeft">
                                                    <div className="e_authorisation_text"><span>Voucher Name</span>
                                                        <strong>{(this.props.voucher.user_voucher.length>0)?(this.props.voucher.user_voucher[0].hasOwnProperty('name') ? this.props.voucher.user_voucher[0].name : ''):''}</strong>
                                                    </div>
                                                </div>
                                                <div className="e_authorisation_listRight">
                                                    <div className="e_authorisation_text"><span>Value</span>
                                                        <strong>{(this.props.voucher.user_voucher.length>0)?((this.props.voucher.user_voucher[0].discount_type !=='Free')?this.props.voucher.user_voucher[0].amount+this.props.voucher.user_voucher[0].discount_type:this.props.voucher.user_voucher[0].discount_type):''}</strong></div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="e_authorisation_inner clearfix">
                                                <div className="e_authorisation_listLeft width_100">
                                                    <div className="e_authorisation_text">
                                                        <span>Voucher Description</span>
                                                        <strong>{(this.props.voucher.user_voucher.length>0)?this.props.voucher.user_voucher[0].promotion_text:''}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="e_authorisation_inner clearfix">
                                                <div className="e_authorisation_listLeft">
                                                    <div className="e_authorisation_text"><span>Business</span>
                                                        <strong>GBK</strong></div>
                                                </div>
                                                <div className="e_authorisation_listRight">
                                                    <div className="e_authorisation_text"><span>Store</span>
                                                        <strong>{(this.props.voucher.user_voucher.length>0)?(this.props.voucher.user_voucher[0].hasOwnProperty('business') && Object.keys(JSON.parse(this.props.voucher.user_voucher[0].business)).length !== 0 ? JSON.parse(this.props.voucher.user_voucher[0].business).business_name : ''):''}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="e_authorisation_right">
                                {/*<div className="e_serviceStamp_main">*/}
                                {/*<div className="stampCard_boxOut">*/}
                                {/*<div className="stampCard_box">*/}
                                {/*<div className="discount_voucher_main">*/}
                                {/*<div className="stampCard_header whitebg clearfix">*/}
                                {/*<h5>DISCOUNT VOUCHER</h5>*/}
                                {/*<span>21/03/2019 <small>Expiry Date</small></span> </div>*/}
                                {/*<div className="discount_voucher">*/}
                                {/*<div className="discount_voucherInner">*/}
                                {/*<div className="discount_voucherText">*/}
                                {/*<h1><b>30</b><span>%<small>OFF</small></span></h1>*/}
                                {/*<p>SELECTED DOG PRODUCTS</p>*/}
                                {/*</div>*/}
                                {/*</div>*/}
                                {/*</div>*/}
                                {/*</div>*/}
                                {/*</div>*/}
                                {/*</div>*/}
                                {/*</div>*/}
                                <div
                                    className={this.props.voucher.uses_remaining == 0 ? 'voucher_grey_scale active' : 'voucher_grey_scale'}>
                                    <img src={BaseUrl+'/'+this.props.voucher.user_voucher[0].image}/>
                                </div>

                            </div>
                        </div>
                    </div>

                    {
                        this.props.voucher.user_voucher.length>0 && this.props.voucher.user_voucher[0].voucher_avial_data.length > 0 && this.props.listProducts ?

                            <div className="e_transaction_bottom">
                                <div className="e_refunded">
                                    <div className="e_refunded_heading">
                                        <h5>Voucher Avail Data</h5>
                                    </div>

                                    <div className="e_transaction_list">
                                        <div className="e_all_trans_heading">

                                        </div>
                                        <div ref={'printable_area'} className="category_list_outer trans_listing" id='printableArea'>
                                            <div className="cL_listing_tableInn longText">
                                                <HeaderComponent listData={this.state} />

                                                <ul>
                                                    {
                                                        this.state.voucherAvailData.map((item) => {

                                                            return <li key={item.voucher_avail_type_id}>
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
                                                                                               className="cL_rowList_number " style={{'textDecoration':(item.status)?'line-through':'','color':(item.status)?'red':''}}>{item.voucher_avail_type_id}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell2">
                                                                                           <span
                                                                                               className="cL_rowList_number " style={{'textDecoration':(item.status)?'line-through':'','color':(item.status)?'red':''}}>{item.cat_product_name}</span>
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

VoucherDetail.propTypes = {};

export default VoucherDetail;
