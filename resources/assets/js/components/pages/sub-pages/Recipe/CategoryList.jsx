import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import Grid from "../../Grid";


class CategoryList extends Component {
    perPage = PerPage;
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

    headerList = [
        {"id": "1", "name": 'Title',            'filterName': 'title'}
    ];

    loadData = () => {
        this.pageLoader.show();
        axios.post(BaseUrl + `/api/get-recipe-category-list`, {
            'orderBy':      this.state.orderBy,
            'orderType':    this.state.orderType,
            'limit':        this.perPage,
            'offset':       this.state.offset,
            'search':       this.state.searchData,
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

    editRecord = (category) => {
        this.props.setEditRecord(category, 'addCategory');
    };//..... end of editRecord() .....//

    deleteRecord = (id) => {
        this.setState(() => ({deleteRecord: id}));
    };//..... end of deleteRecord() .....//

    handleCloseModal = () => {
        this.setState(() => ({deleteRecord: 0}));
    };//..... end of handleCloseModal() .....//

    handleDeleteRecord = () => {
        show_loader();
        axios.post(BaseUrl + `/api/delete-recipe-category`, {id: this.state.deleteRecord, venue_id: VenueID, company_id: CompanyID})
            .then(res => {
                show_loader(true);
                if (res.data.status) {
                    this.setState(() => ({deleteRecord: 0}));
                    this.loadData();
                    NotificationManager.success("Category deleted successfully!.", 'Success');
                } else {
                    NotificationManager.error("Error occurred while deleting category, please try later.", 'Error');
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
                        <div className="preloader3" style={{marginLeft: '-104px', marginTop: '0px', display: 'none'}}>&nbsp;</div>
                        <input type="text" value={this.state.searchData} placeholder="Search category" className="copmpaignSearch_field" onChange={this.searchData} onKeyPress={this.enterPressed}/>
                        <input type="submit" value="" className="copmpaignIcon_field" onClick={() => this.loadData()}/>
                    </div>
                </div>

                <div className="compaign_addNew clearfix">
                    <h3>Category List</h3>
                    {(appPermission("Offers List","add")) && (
                        <a className="all_blue_button" onClick={(e) => this.props.changeMainTab('addCategory')}>Add Category</a>
                    )}
                </div>

                <Grid headerList                    = {this.headerList}
                      handleFilterChange            = {this.handleFilterChange}
                      orderBy                       = {this.state.orderBy}
                      orderType                     = {this.state.orderType}
                      data                          = {this.state.data}
                      editRecord                    = {(appPermission("Offers List","edit")) ? this.editRecord : false}
                      addRecordToStateForDeletion   = {(appPermission("Offers List","delete")) ? this.deleteRecord : false}
                      pageCount                     = {this.state.pageCount}
                      handlePageClick               = {this.handlePageClick}
                      deleteItemID                  = {this.state.deleteRecord}
                      handleCloseModal              = {this.handleCloseModal}
                      deletePopupText               = {'Category'}
                      handleDeleteItem              = {this.handleDeleteRecord}
                />

            </div>
        );
    }//..... end of render() .....//
}//..... end of Class.

export default CategoryList;