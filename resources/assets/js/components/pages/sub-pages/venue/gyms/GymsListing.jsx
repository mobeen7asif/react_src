import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import Grid from "../../../Grid";

class GymsListing extends Component {
    perPage = 10;
    pageLoader = null;
    state = {
        data: [],
        offset: 0,
        searchData: '',
        orderBy: 'name',
        orderType: 'asc',
        pageCount: 0,
        deleteGym: 0,
    };

    headerList = [
        {"id": "1", "name": 'Name',         'filterName': 'name'},
        {"id": "2", "name": 'State',        'filterName': 'state'}
    ];

    loadData = () => {
        this.pageLoader.show();
        axios.post(BaseUrl + `/api/gym-list`, {
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

    editRecord = (gym) => {
        this.props.addGym('edit', gym);
    };//..... end of editRecord() .....//

    deleteRecord = (id) => {
        this.setState(() => ({deleteGym: id}));
    };//..... end of deleteRecord() .....//

    handleCloseModal = () => {
        this.setState(() => ({deleteGym: 0}));
    };//..... end of handleCloseModal() .....//

    handleDeleteGym = () => {
        show_loader();
        axios.post(BaseUrl + `/api/delete-dym`, {id: this.state.deleteGym})
            .then(res => {
                show_loader(true);
                if (res.data.status) {
                    this.setState(() => ({deleteGym: 0}));
                    this.loadData();
                    NotificationManager.success("Gym deleted successfully!.", 'Success');
                } else {
                    NotificationManager.error("Error occurred while deleting Gym, please try later.", 'Error');
                }//..... end if-else() .....//
            }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDeleteGym() .....//

    render() {
        return (
            <div className="cL_listing_tableOut memberTable">

                <div className="compaign_select_search clearfix">
                    <div className="searchCompaign clearfix">
                        <div className="preloader3" style={{marginLeft: '-104px', marginTop: '0px', display: 'none'}}>&nbsp;</div>
                        <input type="text" value={this.state.searchData} placeholder="Search gym" className="copmpaignSearch_field" onChange={this.searchData}/>
                        <input type="submit" value="" className="copmpaignIcon_field" onClick={() => this.loadData()}/>
                    </div>
                </div>

                <div className="compaign_addNew clearfix">
                    <h3>Gym(s) List</h3>
                    <a className="all_blue_button" onClick={this.props.addGym}>Add Gym</a>
                </div>


                <Grid headerList                    = {this.headerList}
                      handleFilterChange            = {this.handleFilterChange}
                      orderBy                       = {this.state.orderBy}
                      orderType                     = {this.state.orderType}
                      data                          = {this.state.data}
                      editRecord                    = {this.editRecord}
                      addRecordToStateForDeletion   = {this.deleteRecord}
                      pageCount                     = {this.state.pageCount}
                      handlePageClick               = {this.handlePageClick}
                      deleteItemID                  = {this.state.deleteGym}
                      handleCloseModal              = {this.handleCloseModal}
                      deletePopupText               = {'Gym'}
                      handleDeleteItem              = {this.handleDeleteGym}
                />

            </div>
        );
    }//..... end of render() .....//
}//..... end of Class.

export default GymsListing;