import React, {Component} from 'react';
import ReactPaginate from 'react-paginate';
import HeaderComponent from '../members/sub_components/HeaderComponent';
import ListingComponent from '../members/sub_components/ListingComponent';
import PopupComponent from '../members/sub_components/PopupComponent';
import {NotificationManager} from "react-notifications";


class SegmentList extends Component {
    perPage = 10;
    pageLoader = null;
    state = {
        segmentList: [],
        offset: 0,
        searchSegment: '',
        segmentType: '',
        filterSegment: 'name',
        orderType: 'asc',
        current: '',
        show: false,
        popupShow: false,
        segmentFilter: 'All',
        pageCount: 0,
        headerList: [{"id": "1", "name": 'Segment Type', 'filterName': 'type'}, {"id": "2", "name": 'Segment Details', 'filterName': 'description'},
            {"id": "3", "name": 'Segment Name', 'filterName': 'name'}, {"id": "4", "name": 'Segment Size', 'filterName': 'persona'},
            {"id": "5", "name": '% of Venue Membership', 'filterName': 'percent'}],
    };

    loadSegmentsFromServer = () => {
        this.pageLoader.show();
        axios.post(BaseUrl + `/api/segment-detail-list`, {
            'name': this.state.filterSegment,
            'orderData': this.state.orderType,
            'limit': this.perPage,
            'offset': this.state.offset,
            'nameSearch': this.state.searchSegment,
            'segmentFilter': this.state.segmentFilter,
            venue_id: VenueID,
            company_id: CompanyID
        }).then(res => {
                if (res.data.status) {
                    this.setState({
                        segmentList: res.data.data,
                        pageCount: (res.data.totalSegments) / this.perPage,
                    });
                    this.pageLoader.hide();
                } else {
                    this.pageLoader.hide();
                }
            }).catch((err) => {
            this.pageLoader.hide();
        });
    };

    componentDidMount = () => {
        this.pageLoader = $("body").find('.preloader3');
        this.loadSegmentsFromServer();
    };//--- End of componentDidMount() ---//

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.perPage);
        this.setState({offset: offset}, () => {
            this.loadSegmentsFromServer();
        });
    };

    /**
     * search Segment
     * @param e
     */
    searchSegmentData = (e) => {
        this.setState({searchSegment: e.target.value, offset: 0, perPage: this.perPage});
    };//--- End of searchSegmentData()  ---//

    /**
     *  Filter Segment
     * @param name
     * @param data
     */
    segmentTypeFilterChanges = (name, data) => {
        this.setState({filterSegment: name, orderType: data}, () => {
            this.loadSegmentsFromServer();
        });
    };//--- End of () ---//

    /**
     * Delete Segment Data
     * @param dataID
     */
    deleteSegment = (dataID) => {
        show_loader();
        axios.post(BaseUrl + `/api/delete-segment`, {'segmentID': dataID})
            .then(res => {
                show_loader(true);
                if (res.data.status) {
                    this.loadSegmentsFromServer();
                    NotificationManager.success("Segment deleted successfully!.", 'Success');
                } else {
                    NotificationManager.error("Error occurred while deleting segment, please try later.", 'Error');
                }
            }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };

    /**
     * function for Show Popup
     * @param data
     */
    popupShow = (data) => {
        this.setState({popupShow: true, segmentType: data});
    };//--- End of popupShow ---//
    /**
     *  function for close pop up
     */
    closePopup = () => {
        this.setState({popupShow: false, segmentType: ''});
    };//--- End of closePopup() ---//

    changeType = (data) => {
        this.setState({segmentType: data});
    };//--- End of closePopup() ---//

    filterSegmentData = (e) => {
        this.setState({segmentFilter: e.target.value, offset: 0}, () => {
            this.loadSegmentsFromServer();
        });
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.loadSegmentsFromServer();
        }
    };//--- End of enterPressed() ----//

    render() {
        return (
            <div className="cL_listing_tableOut memberTable">
                <div className="compaign_select_search clearfix">
                    <div className="selectCompaign">
                        <div className="campaign_select">
                            <span>{this.state.segmentFilter}</span>
                            <select onChange={this.filterSegmentData}>
                                <option value="All">All</option>
                                <option value="Global">Global</option>
                                <option value="Segment Template">Segment Template</option>
                                <option value="Venue">Venue</option>
                            </select>
                        </div>
                    </div>
                    <div className="searchCompaign clearfix">
                        <div className="preloader3" style={{marginLeft: '-104px', marginTop: '0px', display: 'none'}}>&nbsp;</div>
                        <input type="text" value={this.state.searchSegment} placeholder="Search Member" className="copmpaignSearch_field" onKeyPress={this.enterPressed} onChange={this.searchSegmentData}/>
                        <input type="submit" value="" className="copmpaignIcon_field" onClick={() => this.loadSegmentsFromServer()}/>
                    </div>
                </div>
                <div className="compaign_addNew clearfix">
                    <h3>MY SEGMENTS</h3>
                </div>
                <div className="cL_listing_tableInn segmentTable_cells_setting">

                    <HeaderComponent listData={this.state} onClick={(id, name) => this.segmentTypeFilterChanges(id, name)} />

                    <ListingComponent listingData={this.state} onClick={(id, name) => this.segmentTypeSelected(id, name)}
                                      popupShow={this.popupShow} deleteSegment={this.deleteSegment} editSegment={this.props.editSegment} />

                </div>
                <div className="campLstng_paginaton_out">
                    <div className="campLstng_paginaton_inn">
                        <ReactPaginate previousLabel={""} nextLabel={""} nextLinkClassName={'campPagi_next'} breakLabel={<a href="">...</a>}
                                       breakClassName={"break-me"} pageCount={this.state.pageCount} marginPagesDisplayed={2}
                                       pageRangeDisplayed={5} previousLinkClassName={'campPagi_prev'} onPageChange={this.handlePageClick}
                                       activeClassName={"active"}/>
                    </div>
                </div>

                {this.state.popupShow ? <PopupComponent typeDetail={this.state} closePopup={this.closePopup}
                                                        changeType={this.changeType}/> : ''}

            </div>
        );
    }//..... end of render() .....//
}//..... end of SegmentList.

export default SegmentList;