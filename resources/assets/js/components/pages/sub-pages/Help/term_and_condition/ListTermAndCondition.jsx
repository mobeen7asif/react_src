import React, {Component} from 'react';
import Grid from '../../../Grid';
import {NotificationManager} from "react-notifications";
class ListTermAndCondition extends Component {
    perPage = PerPage;
    pageLoader = null;
    state = {
        data: [],
        offset: 0,
        searchData: '',
        orderBy: 'name',
        orderType: 'asc',
        pageCount: 0,
        deleteReferral: 0,
        deleteRecord    : 0,
    };

    headerList = [
        {"id": "1", "name": 'Title',         'filterName': 'title', htmlParser: true},
        {"id": "2", "name": 'Tags',         'filterName': 'tags'}
    ];

    loadData = () => {
        this.pageLoader.show();
        axios.post(BaseUrl + `/api/list-term-conditions`, {
            'orderBy':      this.state.orderBy,
            'orderType':    this.state.orderType,
            'limit':        this.perPage,
            'offset':       this.state.offset,
            'search':       this.state.searchData,
            'venue_id':     VenueID
        }).then(res => {
            if (res.data.status) {
                this.setState({
                    data: res.data.data,
                    pageCount: (res.data.total) / this.perPage,
                });
                this.pageLoader.hide();
            } else {
                this.pageLoader.hide();
            }
        }).catch((err) => {
            this.pageLoader.hide();
        });
    };//..... end of loadData() .....//

    componentDidMount = () => {
        this.pageLoader = $("body").find('.preloader3');
        this.loadData();
    };//---- end of componentDidMount() ----//


    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.perPage);
        this.setState({offset: offset}, () => {
            this.loadData();
        });
    };//..... end of handlePageClick() .....//

    editRecord = (aboutLoyalty) => {
        this.props.addAboutTermAndCondition('edit', aboutLoyalty);
    };//..... end of editRecord() .....//


    deleteRecord = (id) => {
        this.setState(() => ({deleteRecord: id}));
    };//..... end of deleteRecord() .....//

    handleCloseModal = () => {
        this.setState(() => ({deleteRecord: 0}));
    };//..... end of handleCloseModal() .....//

    handleDeleteRecord = () => {
        show_loader();
        axios.post(BaseUrl + `/api/delete-faq`, {faq_id: this.state.deleteRecord})
            .then(res => {
                show_loader(true);
                if (res.data.status) {
                    this.setState(() => ({deleteRecord: 0}));
                    this.loadData();
                    NotificationManager.success("Record deleted successfully!.", 'Success');
                } else {
                    NotificationManager.error("Error occurred while deleting record, please try later.", 'Error');
                }//..... end if-else() .....//
            }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDeleteRecord() .....//

    render() {
        return (
            <div className="cL_listing_tableOut memberTable">

                <div className="compaign_select_search clearfix">
                    <div className="searchCompaign clearfix">
                        <div className="preloader3" style={{marginLeft: '-104px', marginTop: '0px', display: 'none'}}>&nbsp;</div>
                    </div>
                </div>

                <div className="compaign_addNew clearfix">
                    <h3>List Terms & Conditions</h3>
              {(appPermission("Terms And Conditions","add")) && (
                  <a className="all_blue_button" onClick={this.props.addAboutTermAndCondition}>Add Terms & Conditions</a>
              )}
                </div>

                <Grid headerList                    = {this.headerList}
                      orderBy                       = {this.state.orderBy}
                      orderType                     = {this.state.orderType}
                      data                          = {this.state.data}
                      pageCount                     = {this.state.pageCount}
                      editRecord                    = {this.editRecord}
                      handlePageClick               = {this.handlePageClick}
                      addRecordToStateForDeletion   = {this.deleteRecord}
                      handleDeleteItem              = {this.handleDeleteRecord}
                      deleteItemID                  = {this.state.deleteRecord}
                />

            </div>
        );
    }//..... end of render() .....//
}//..... end of ListAboutLoyalty.

ListTermAndCondition.propTypes = {};

export default ListTermAndCondition;