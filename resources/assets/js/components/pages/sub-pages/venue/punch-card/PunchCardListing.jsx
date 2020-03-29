import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import Grid from "../../../Grid";


class PunchCardListing extends Component {
    perPage = PerPage;
    pageLoader = null;
    state = {
        data: [],
        offset: 0,
        searchData: '',
        orderBy: 'name',
        orderType: 'asc',
        pageCount: 0,
        deletePunchCard: 0,
    };

    headerList = [
        {"id": "1", "name": 'Name',         'filterName': 'name'},
        {"id": "2", "name": 'Description',  'filterName': 'description'}
    ];

    loadData = () => {
        this.pageLoader.show();
        axios.post(BaseUrl + `/api/punch-card-list`, {
            'orderBy':      this.state.orderBy,
            'orderType':    this.state.orderType,
            'limit':        this.perPage,
            'offset':       this.state.offset,
            'search':       this.state.searchData,
            'venue_id':     VenueID,
            'company_id':   CompanyID
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

    editRecord = (punchCard) => {
        /*(punchCard);
        this.props.addIntegrated('integrated-edit', punchCard);*/

        if (punchCard.rule_on || punchCard.redemption_type == "transaction_value")
            this.props.addIntegrated('integrated-edit', punchCard);
        else
            this.props.addPunchCard('edit', punchCard);
    };//..... end of editRecord() .....//

    deleteRecord = (id) => {
        this.setState(() => ({deletePunchCard: id}));
    };//..... end of deleteRecord() .....//

    handleCloseModal = () => {
        this.setState(() => ({deletePunchCard: 0}));
    };//..... end of handleCloseModal() .....//

    handleDeletePunchCard = () => {
        show_loader();
        axios.post(BaseUrl + `/api/delete-punch-card`, {id: this.state.deletePunchCard, venue_id: VenueID, company_id: CompanyID})
            .then(res => {
                show_loader(true);
                if (res.data.status) {
                    this.setState(() => ({deletePunchCard: 0}));
                    this.loadData();
                    NotificationManager.success("Punch card deleted successfully!.", 'Success');
                } else {
                    NotificationManager.error("Error occurred while deleting punch card, please try later.", 'Error');
                }//..... end if-else() .....//
            }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDeletePunchCard() .....//

    enterPressed = (event) => {
        var code = event.keyCode || event.which;
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
                        <input type="text" value={this.state.searchData} placeholder="Search Punch Card" className="copmpaignSearch_field" onKeyPress={this.enterPressed}  onChange={this.searchData}/>
                        <input type="submit" value="" className="copmpaignIcon_field" onClick={() => this.loadData()}/>
                    </div>
                </div>

                <div className="compaign_addNew clearfix">
                    <h3>Stamp Cards List</h3>
                    {
                        (INTEGRATED ==1) &&  (
                        <a className="all_blue_button" onClick={() => this.props.addIntegrated('integrated-edit', {})}>Add Integrated Punch Card</a>
                    )}
                    { (INTEGRATED ==0) && (
                        <a className="all_blue_button" onClick={this.props.addPunchCard} style={{marginRight: '10px'}}>Add Punch Card</a>
                    )}

                </div>

                <Grid headerList                    = {this.headerList}
                      handleFilterChange            = {this.handleFilterChange}
                      orderBy                       = {this.state.orderBy}
                      orderType                     = {this.state.orderType}
                      data                          = {this.state.data}
                      editRecord                    = {(appPermission("Punch Card","edit")) ? this.editRecord : false}
                      addRecordToStateForDeletion   = {(appPermission("Punch Card","delete")) ? this.deleteRecord : false}
                      pageCount                     = {this.state.pageCount}
                      handlePageClick               = {this.handlePageClick}
                      deleteItemID                  = {this.state.deletePunchCard}
                      handleCloseModal              = {this.handleCloseModal}
                      deletePopupText               = {'Punch Card'}
                      handleDeleteItem              = {this.handleDeletePunchCard}
                />

            </div>
        );
    }//..... end of render() .....//
}//..... end of Class.

export default PunchCardListing;