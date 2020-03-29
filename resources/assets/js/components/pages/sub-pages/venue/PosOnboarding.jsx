import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import {NotificationManager} from "react-notifications";

class PosOnboarding extends Component {
    state = {
        listData : [],
        offset: 0,
        perPage:10,
        searchValue:'',
        order_by:'store_id',
        orderType:'desc'
    };

    loadCommentsFromServer = () => {
        var venue_id = VenueID;
        axios.post(BaseUrl + '/api/get-venue-stores',{'venue_id':venue_id,'order_by':this.state.order_by,'orderData':this.state.orderType,'limit': this.state.perPage, 'offset': this.state.offset,'nameSearch':this.state.searchValue})
            .then(res => {
                this.setState({listData:res.data.data,pageCount:(res.data.total)/this.state.perPage});
            }).catch((err) => {
            NotificationManager.error("Error occurred while getting venue stores.", 'Error',1500);
        });

    };

    componentDidMount = () => {
        this.loadCommentsFromServer();
    };//--- End of componentDidMount() ---//


    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        this.setState({offset: offset}, () => {
            this.loadCommentsFromServer();
        });
    };

    /**
     * search Segment
     * @param e
     */
    searchGridData = (e) => {
        this.setState({searchValue:e.target.value,offset: 0,perPage:this.state.perPage}, () => {
            this.loadCommentsFromServer();
        });
    };//--- End of searchGridData()  ---//

    updateStoreStatus = (value,index) => {
        let data = this.state.listData;
        data[index].is_onboard = !value;
        var venue_id= VenueID;
        this.setState({listData: data});
        show_loader();
        axios.post(BaseUrl + '/api/venue-onboard',{'store_id':data[index].store_id, checked: !value ,venue_id:venue_id })
            .then(res => {
                if(res.data === "success"){
                    NotificationManager.success("Subscribe successfully.", 'Success',1500);
                    show_loader();
                }
                else{
                    NotificationManager.warning("Unsubscribe successfully.", 'Success',1500);
                    show_loader();
                }


            }).catch((err) => {
            NotificationManager.error("Error occurred while subscribing/unsubscribing.", 'Error',1500);
            show_loader();
        });
    };

    changeOrder = (orderField,order) => {
        this.setState((e)=>({order_by:orderField,orderType:order}),()=>{this.loadCommentsFromServer();});
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section" id="v_posBording" style={{display:"block"}}>

                <div className="dropSegmentation_heading clearfix">
                    <h3>POS Onboarding</h3>
                </div>

                <div className="venueInfo_div">

                    <div className="posOnbording_table">

                        <div className="cL_listing_tableInn">

                            <div className="cL_listing_tableTitle">
                                <div className="cL_listing_table_row">
                                    <div className="cL_listing_table_cell cell_pos1">
                                        <strong>&nbsp;</strong>
                                    </div>
                                    <div className="cL_listing_table_cell cell_pos2">
                                        <strong><span><b><img onClick={(e)=>{this.changeOrder("store_name","desc")}} src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img onClick={(e)=>{this.changeOrder("store_name","asc")}} src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Store Name</strong>
                                    </div>
                                    <div className="cL_listing_table_cell cell_pos3">
                                        <strong><span><b><img onClick={(e)=>{this.changeOrder("pos_code","desc")}} src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img onClick={(e)=>{this.changeOrder("pos_code","asc")}} src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>POS Vendor</strong>
                                    </div>


                                </div>

                            </div>


                            <ul>
                                {this.state.listData.map((item,index) =>
                                        <li key={index}>
                                        <div className="cL_listing_table_row">
                                            <div className="cL_listing_table_cell cell_pos1">
                                                <div className="pos_check">
                                                    <div className="control-group">
                                                        <label className="control control--checkbox">&nbsp;
                                                            <input className="bcnConfig_tblRow_checkBox store_checkbox_list" defaultChecked={item.is_onboard} onClick={(e)=>{ this.updateStoreStatus(item.is_onboard,index) }} store_id="{item.store_id}" type="checkbox"  />
                                                            <div className="control__indicator"></div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="cL_listing_table_cell cell_pos2">
                                                <span className="cL_rowList_number">{item.store_name}</span>
                                            </div>
                                            <div className="cL_listing_table_cell cell_pos3">
                                                <span className="cL_rowList_number">
                                                    {(item.pos_code == 1) && ( "SOLDI" )}
                                                    {(item.pos_code == 2) && ( "STARTECH" )}
                                                    {(item.pos_code == 3) && ( "SWIFT" )}
                                                </span>
                                            </div>


                                        </div>
                                    </li>
                                )}

                            </ul>
                        </div>

                        <div className="campLstng_paginaton_out">
                            <div className="campLstng_paginaton_inn">
                                <ReactPaginate previousLabel={""}
                                               nextLabel={""}
                                               nextLinkClassName={'campPagi_next'}
                                               breakLabel={<a href="">...</a>}
                                               breakClassName={"break-me"}
                                               pageCount={this.state.pageCount}
                                               marginPagesDisplayed={2}
                                               pageRangeDisplayed={5}
                                               previousLinkClassName={'campPagi_prev'}
                                               onPageChange={this.handlePageClick}
                                               activeClassName={"active"}/>
                            </div>

                        </div>
                        <br />
                        <br />

                    </div>
                </div>


            </div>
        );
    }//..... end of render() .....//
}//..... end of PosOnboarding.

PosOnboarding.propTypes = {};

export default PosOnboarding;