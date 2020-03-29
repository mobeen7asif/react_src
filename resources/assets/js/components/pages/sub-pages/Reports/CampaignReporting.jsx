import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import Grid from "../../Grid";
import {connect} from 'react-redux';
import {resetRecipeOfferForm} from "../../../redux/actions/RecipeOfferActions";
import HeaderComponent from "../members/sub_components/HeaderComponent";
import NoDataFound from "../../../_partials/NoDataFound";
import ReactPaginate from "react-paginate";
import {DateRangePicker} from "react-date-range";
import VoucherDetail from "../members/MemberProfile/components/vouchers/sub_components/VoucherDetail";
import CampaignDetailReporting from "./subcomponent/CampaignDetailReporting";


class CampaignReporting extends Component {
    perPage = PerPage;
    pageLoader = null;
    state = {
        data            : [],
        offset          : 0,
        searchData      : '',
        orderBy         : 'date_added',
        orderType       : 'desc',
        pageCount       : 0,
        deleteRecord    : 0,
        headerList : [
            {"id": "1", "name": 'Campaign Name', 'filterName': 'name'},
            {"id": "3", "name": "Processed", "filterName": "processed"},
            {"id": "2", "name": 'Delivered', 'filterName': 'delivered'},
            {"id": "4", "name": 'Open', 'filterName': 'open'},
            {"id": "5", "name": 'Click', 'filterName': 'click'},
            {"id": "6", "name": 'Undelivered', 'filterName': 'undelivered'},{"id": "7", "name": 'Date', 'filterName': 'undelivered'}],
        showListError:false,
        showAll : false,

    };


    loadData = () => {
        this.pageLoader.show();
        axios.post(BaseUrl + `/api/campaign-report`, {
            'company_id': CompanyID,
            'venue_id': VenueID,
            'event_type'      :"email",
            'orderBy':      this.state.orderBy,
            'orderType':    this.state.orderType,
            'limit':        this.perPage,
            'offset':       this.state.offset,
            'search':       this.state.searchData,

        }).then(res => {
            if (res.data.status) {
                this.setState({
                    data: res.data.data,
                    pageCount: (res.data.count) / this.perPage,
                    showListError:false
                });
                this.pageLoader.hide();
            } else {
                this.setState({
                    showListError:true
                });
                this.pageLoader.hide();
            }


        }).catch((err) => {
            this.pageLoader.hide();
        });
    };//..... end of loadData() .....//

    componentDidMount = () => {
        this.pageLoader = $("body").find('.preloader3');
        this.loadData();
    };//..... end of componentDidMount() .....//

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.perPage);
        this.setState({offset: offset}, () => {
            this.loadData();
        });
    };//..... end of handlePageClick() .....//

    /**
     * search Segment
     * @param e
     */
    searchData = (e) => {
        let searchData = e.target.value;
        this.setState({searchData, offset: 0, perPage: this.perPage});
    };//--- End of searchData()  ---//

    handleFilterChange = (orderBy, orderType) => {
        this.setState({orderBy, orderType}, () => {
            this.loadData();
        });
    };//--- End of () ---//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    editRecord = (offer) => {

        // (offer);
        this.props.setEditRecord(offer, 'addOffer');
    };//..... end of editRecord() .....//

    deleteRecord = (id) => {
        this.setState(() => ({deleteRecord: id}));
    };//..... end of deleteRecord() .....//

    handleCloseModal = () => {
        this.setState(() => ({deleteRecord: 0}));
    };//..... end of handleCloseModal() .....//

    handleDeleteRecord = () => {
        show_loader();
        axios.post(BaseUrl + `/api/delete-recipe-offer`, {id: this.state.deleteRecord, venue_id: VenueID, company_id: CompanyID})
            .then(res => {
                show_loader(true);
                if (res.data.status) {
                    this.setState(() => ({deleteRecord: 0}));
                    this.loadData();
                    NotificationManager.success("Offer deleted successfully!.", 'Success');
                } else {
                    NotificationManager.error("Error occurred while deleting offer, please try later.", 'Error');
                }//..... end if-else() .....//
            }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDeleteRecord() .....//

    enterPressed = (event) => {
        let code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.loadData();
        }
    };//--- End of enterPressed() ----//

    handleDownloadReport = (cmpt) => {
        let newCmpt = (cmpt);
        window.open(
            BaseUrl+'/api/export-offer-stats?offer_id='+newCmpt.id,
            '_blank'
        );
    };

    changeActiveStatus = (item) => {
        var changed_data = [];
        this.state.data.map(function (obj) {
            if(obj.id === item.id){
                if(obj.active === true){
                    obj.active = false;
                } else {
                    obj.active = true;
                }
            }
            changed_data.push(obj);
        });
        this.setState({data : changed_data});
    };

    expandAll = (item) => {
        if(this.state.showAll){
            this.setState({showAll : false}, () => {this.getUpdatedCampaigns()});
        }
        else {
            this.setState({showAll : true}, () => {this.getUpdatedCampaigns()})
        }
    };

    getUpdatedCampaigns = () => {
        var changed_data = [];
        this.state.data.map((obj) => {
            obj.active = this.state.showAll ===  true ? true : false;
            changed_data.push(obj);
        });
        this.setState({data : changed_data});
    };
    render() {
        return (
           <div>
               <div className="categoryInfo_container clearfix">
                   <div >
                       <div className="edit_category_rightDetail removeHighlights">
                           <div className="e_transactions_main">

                               <div className="e_transaction_list">
                                   <div className="listing_floating_row clearfix">

                                       <div className="expand_button"><a onClick={this.expandAll}
                                                                         style={{cursor:'pointer','opacity':'1'}}>
                                           {this.state.showAll ? 'Collapse All' : 'Expand All'}</a></div>
                                   </div>

                                   {this.state.showListError ?
                                       <NoDataFound customMessage="Voucher"/>
                                       :
                                       <div ref={'printable_area'} className="category_list_outer trans_listing" id='printableArea'>
                                           <div className="cL_listing_tableInn longText">
                                               <HeaderComponent listData={this.state}
                                                                onClick={(id, name) => this.setState({
                                                                    filterSegment: id,
                                                                    orderType: name
                                                                }, () => this.loadData())}/>

                                               <ul>
                                                   {
                                                       this.state.data.map((item) => {
                                                           return <li key={item.id}>
                                                               <div className="e_transaction_accordion">
                                                                   <div
                                                                       className={item.active ? 'e_transaction_accordionTitle active' : 'e_transaction_accordionTitle'}>
                                                                       <div
                                                                           className="listDataShowing">
                                                                           <div className="cL_listing_table_row">
                                                                               <div  className="cL_listing_table_cell cell1"  onClick={() => {
                                                                                   this.changeActiveStatus(item)
                                                                               }}>
                                                                                           <span
                                                                                               className="cL_rowList_number">{item.name}</span>
                                                                               </div>
                                                                               <div
                                                                                   onClick={() => {
                                                                                       this.changeActiveStatus(item)
                                                                                   }} className="cL_listing_table_cell cell3">
                                                                                           <span
                                                                                               className="cL_rowList_number">{item.open}</span>
                                                                               </div>
                                                                               <div
                                                                                   onClick={() => {
                                                                                       this.changeActiveStatus(item)
                                                                                   }}  className="cL_listing_table_cell cell2">
                                                                                           <span
                                                                                               className="cL_rowList_number">{item.delivered}</span>
                                                                               </div>
                                                                               <div
                                                                                   onClick={() => {
                                                                                       this.changeActiveStatus(item)
                                                                                   }} className="cL_listing_table_cell cell4">
                                                                                           <span
                                                                                               className="cL_rowList_number">{item.click}</span>
                                                                               </div>
                                                                               <div
                                                                                   onClick={() => {
                                                                                       this.changeActiveStatus(item)
                                                                                   }} className="cL_listing_table_cell cell5">
                                                                                                        <span
                                                                                                            className="cL_rowList_number ">{item.click}</span>

                                                                               </div>
                                                                               <div
                                                                                   onClick={() => {
                                                                                       this.changeActiveStatus(item)
                                                                                   }} className="cL_listing_table_cell cell6">
                                                                                           <span
                                                                                               className="cL_rowList_number padingLeft0">{item.undelivered}</span>
                                                                               </div>

                                                                               <div
                                                                                   onClick={() => {
                                                                                       this.changeActiveStatus(item)
                                                                                   }} className="cL_listing_table_cell cell3">
                                                                                           <span
                                                                                               className="cL_rowList_number">{item.created_at}</span>
                                                                               </div>

                                                                           </div>
                                                                       </div>
                                                                   </div>


                                                                   {item.active ?
                                                                       <CampaignDetailReporting
                                                                           campaign={item} /> : ''}

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
                                               <ReactPaginate previousLabel={""} nextLabel={""}
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
                                   }

                               </div>

                           </div>
                       </div>
                   </div>
               </div>
           </div>
        );
    }//..... end of render() .....//
}//..... end of Class.

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(CampaignReporting);