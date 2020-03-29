import React, {Component} from 'react';
import HeaderComponent from "../../../../sub_components/HeaderComponent";
import ReactPaginate from 'react-paginate';

class StampCardDetail extends Component {

    state = {
        voucher: {},
        offset: 0,
        perPage: 10,
        stampData: [],
        totalRecord: 0,
        allRecords:[],
        headerList: [{"id": "1", "name": 'Stamp Date', 'filterName': '_id', 'disable_sort': true}, {
            "id": "2",
            "name": 'Amount',
            'filterName': 'dateadded',
            'disable_sort': true
        },{
            "id": "3",
            "name": 'Description',
            'filterName': 'dateadded',
            'disable_sort': true
        }]
    };

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
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
        if (this.props.showReport) {
            this.setState(() => ({
                allRecords:this.props.stamp.report,
                totalRecord: Math.ceil(this.props.stamp.report.length / this.state.perPage),

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

    render() {
        return (

            <div className="e_transaction_accordionShow"
                 style={this.props.stamp.active === true ? {display: 'block'} : {display: 'none'}}>
                <div className="e_transaction_detial">
                    <div className="e_transaction_top">
                        <div className="e_authorisation clearfix">
                            <div className="e_authorisation_left">
                                <div className="e_authorisation_list">
                                    <ul>
                                        <li>
                                            <div className="e_authorisation_inner clearfix">
                                                <div className="e_authorisation_listLeft">
                                                    <div className="e_authorisation_text"><span>Stamp Card ID</span>
                                                        <strong>{this.props.stamp.punch_id}</strong>
                                                    </div>
                                                </div>
                                                <div className="e_authorisation_listRight">
                                                    <div className="e_authorisation_text"><span>Date</span> <strong>03:45:56
                                                        PM</strong></div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="e_authorisation_inner clearfix">
                                                <div className="e_authorisation_listLeft">
                                                    <div className="e_authorisation_text"><span>Stamp Card Name</span>
                                                        <strong>{this.props.stamp.stamp[0].name}</strong>
                                                    </div>
                                                </div>
                                                <div className="e_authorisation_listRight">
                                                    <div className="e_authorisation_text"><span>Stamps Allocated</span>
                                                        <strong>{this.props.stamp.available_stamp}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="e_authorisation_inner clearfix">
                                                <div className="e_authorisation_listLeft width_100">
                                                    <div className="e_authorisation_text">
                                                        <span>Stamp Card Description</span>
                                                        <strong>{this.props.stamp.stamp[0].description}</strong>
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
                                                        <strong>{(this.props.stamp.hasOwnProperty("stamp")) ? ((this.props.stamp.stamp[0].hasOwnProperty("business") && JSON.parse(this.props.stamp.stamp[0].business).hasOwnProperty('business_name'))?JSON.parse(this.props.stamp.stamp[0].business).business_name:'') : ''}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="e_authorisation_right">
                                <img src={this.props.stamp.image}/>
                            </div>

                        </div>
                    </div>
                    {
                        this.props.stamp.report.length > 0 && this.props.showReport ?
                            <div className="e_transaction_bottom">
                                <div className="e_refunded">
                                    <div className="e_refunded_heading">
                                        <h5>Stamps Details</h5>
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
                                                                                               className="cL_rowList_number ">{item.created_at}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell2">
                                                                                           <span
                                                                                               className="cL_rowList_number ">{(item.credit>0)?item.credit:'-'+item.debit}</span>
                                                                                </div>

                                                                                <div
                                                                                    className="cL_listing_table_cell cell3">
                                                                                           <span
                                                                                               className="cL_rowList_number ">{item.assign_through}</span>
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

            </div>


        );
    }//..... end of render() .....//
}//..... end of Member.

StampCardDetail.propTypes = {};

export default StampCardDetail;
