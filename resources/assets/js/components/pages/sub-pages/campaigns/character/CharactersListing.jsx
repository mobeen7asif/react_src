import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import Grid from "../../../Grid";

class CharactersListing extends Component {
    perPage = 10;
    pageLoader = null;
    state = {
        data            : [],
        offset          : 0,
        searchData      : '',
        orderBy         : 'title',
        orderType       : 'asc',
        pageCount       : 0,
        deleteRecord    : 0,
    };

    headerList =  [
        {"id": "1", "name": 'Title',        'filterName': 'title'},
        {"id": "1", "name": 'Unique Title', 'filterName': 'unique_title'},
        {"id": "2", "name": 'Description',  'filterName': 'description'},
    ];

    loadData = () => {
        this.pageLoader.show();
        axios.post(BaseUrl + `/api/list-characters`, {
            orderBy:    this.state.orderBy,
            orderType:  this.state.orderType,
            limit:      this.perPage,
            offset:     this.state.offset,
            search:     this.state.searchData
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

    editRecord = (character) => {
        this.props.setEditRecord(character, 'edit-character');
    };//..... end of editRecord() .....//

    deleteRecord = (id) => {
        this.setState(() => ({deleteRecord: id}));
    };//..... end of deleteRecord() .....//

    handleCloseModal = () => {
        this.setState(() => ({deleteRecord: 0}));
    };//..... end of handleCloseModal() .....//

    handleDeleteRecord = () => {
        show_loader();
        axios.post(BaseUrl + `/api/delete-character`, {id: this.state.deleteRecord, venue_id: VenueID, company_id: CompanyID})
            .then(res => {
                show_loader(true);
                if (res.data.status) {
                    this.setState(() => ({deleteRecord: 0}));
                    this.loadData();
                    NotificationManager.success(res.data.message, 'Success');
                } else {
                    NotificationManager.error(res.data.message, 'Error');
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

    render() {
        return (
            <div className="cL_listing_tableOut memberTable">

                <div className="compaign_select_search clearfix">
                    <div className="searchCompaign clearfix">
                        <div className="preloader3" style={{marginLeft: '-229px', marginTop: '0px', display: 'none'}}>&nbsp;</div>
                        <input type="text" value={this.state.searchData} placeholder="Search Character" className="copmpaignSearch_field" onKeyPress={this.enterPressed} onChange={this.searchData}/>
                        <input type="submit" value="" className="copmpaignIcon_field" onClick={() => this.loadData()}/>
                    </div>
                </div>

                <div className="compaign_addNew clearfix">
                    <h3>Character(s) List</h3>
                    {(appPermission("Pet Pack","add")) && (
                        <a className="all_blue_button" onClick={(e) => this.props.changeMainTab('edit-character')}>Add Character</a>
                    )}
                </div>

                <Grid headerList                    = {this.headerList}
                      handleFilterChange            = {this.handleFilterChange}
                      orderBy                       = {this.state.orderBy}
                      orderType                     = {this.state.orderType}
                      data                          = {this.state.data}
                      editRecord                    = {(appPermission("Pet Pack","edit")) ? this.editRecord : false}
                      addRecordToStateForDeletion   = {(appPermission("Pet Pack","delete")) ? this.deleteRecord : false}
                      pageCount                     = {this.state.pageCount}
                      handlePageClick               = {this.handlePageClick}
                      deleteItemID                  = {this.state.deleteRecord}
                      handleCloseModal              = {this.handleCloseModal}
                      deletePopupText               = {'Character'}
                      handleDeleteItem              = {this.handleDeleteRecord}
                />

            </div>
        );
    }//..... end of render() .....//
}//..... end of CharactersListing.

export default CharactersListing;