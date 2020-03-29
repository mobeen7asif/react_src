import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import Grid from "../../../Grid";
import CompetitionDetails from "./CompetitionDetails";

class CompetitionListing extends Component {
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
        selectedCompetition : {},
        editData        : {}
    };

    headerList = [
        {"id": "1", "name": 'Title',        'filterName': 'title'},
        /*{"id": "2", "name": 'Executed',  'filterName': 'is_executedd'},*/
        {"id": "2", "name": 'Start Date',   'filterName': 'start_date'},
        {"id": "3", "name": 'End Date',     'filterName': 'end_date'},
        {"id": "4", "name": 'Entries',     'filterName': 'total_users'}
    ];

    loadData = () => {
        this.pageLoader.show();
        axios.post(BaseUrl + `/api/competitions-list`, {
            orderBy:    this.state.orderBy,
            orderType:  this.state.orderType,
            limit:      this.perPage,
            offset:     this.state.offset,
            search:     this.state.searchData
        }).then(res => {
            if (res.data.status) {
                this.setState((prevState) => ({
                    data: res.data.data,
                    pageCount: (res.data.total) / this.perPage,
                    selectedCompetition: Object.keys(prevState.selectedCompetition).length > 0 ? res.data.data.filter((mission) => mission.id == prevState.selectedCompetition.id)[0]: {}
                }));
                this.pageLoader.hide();
            } else {
                this.pageLoader.hide();
            }
            $('.cl_rowEdit_popOut').css('right', '-24% !important');
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

    editRecord = (competition) => {
        this.props.setEditRecord(competition,"edit-competition","edit");
    };//..... end of editRecord() .....//

    deleteRecord = (id) => {
        this.setState(() => ({deleteRecord: id}));
    };//..... end of deleteRecord() .....//

    handleCloseModal = () => {
        this.setState(() => ({deleteRecord: 0}));
    };//..... end of handleCloseModal() .....//

    handleDeleteRecord = () => {
        show_loader();
        axios.post(BaseUrl + `/api/delete-competition`, {id: this.state.deleteRecord, venue_id: VenueID, company_id: CompanyID})
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

    handleThirdBtnClick = (selectedCompetition) => {
        this.props.setEditRecord(selectedCompetition, 'edit-competition',"duplicate");
    };//..... end of handleThirdBtnClick() .....//

    handleCloseCompetitionDetailsWindow = () => {
        this.setState(() => ({selectedCompetition : {}}))
    };//..... end of handleCloseCompetitionDetailsWindow() .....//

    handleDownloadReport = (cmpt) => {
        window.open(
            BaseUrl+'/api/export-competition-members?id='+cmpt.id,
            '_blank'
        );
    };

    render() {
        return (
            <div className="cL_listing_tableOut memberTable">

                <div className="compaign_select_search clearfix">
                    <div className="searchCompaign clearfix">
                        <div className="preloader3" style={{marginLeft: '-229px', marginTop: '0px', display: 'none'}}>&nbsp;</div>
                        <input type="text" value={this.state.searchData} placeholder="Search Competition" className="copmpaignSearch_field" onKeyPress={this.enterPressed} onChange={this.searchData}/>
                        <input type="submit" value="" className="copmpaignIcon_field" onClick={() => this.loadData()}/>
                    </div>
                </div>

                <div className="compaign_addNew clearfix">
                    <h3>Competition(s) List</h3>
                    {(appPermission("Competition","add")) && (
                        <a className="all_blue_button" onClick={(e) => this.props.changeMainTab('edit-competition')}>Add Competition</a>
                    )}
                </div>

                <Grid headerList                    = {this.headerList}
                      handleFilterChange            = {this.handleFilterChange}
                      orderBy                       = {this.state.orderBy}
                      orderType                     = {this.state.orderType}
                      data                          = {this.state.data}
                      editRecord                    = {(appPermission("Competition","edit")) ? this.editRecord : false}
                      editBtnText                   = {'Edit'}
                      editBtnIconClass              = {'duplicateIcon'}
                      thirdBtnText                  = {'Duplicate'}
                      handleThirdBtnClick           = {this.handleThirdBtnClick}
                      addRecordToStateForDeletion   = {(appPermission("Competition","delete")) ? this.deleteRecord : false}
                      pageCount                     = {this.state.pageCount}
                      handlePageClick               = {this.handlePageClick}
                      deleteItemID                  = {this.state.deleteRecord}
                      handleCloseModal              = {this.handleCloseModal}
                      deletePopupText               = {'Competition'}
                      handleDeleteItem              = {this.handleDeleteRecord}
                      fourthBtnText                 = {'Download'}
                      handleFourthBtnClick          = {this.handleDownloadReport}
                />

                {
                    Object.keys(this.state.selectedCompetition).length > 0 &&
                    <CompetitionDetails mission={this.state.selectedCompetition} handleCloseCompetitionDetailsWindow={this.handleCloseCompetitionDetailsWindow} loadCompetitions={this.loadData}/>
                }
            </div>
        );
    }//..... end of render() .....//
}//..... end of CompetitionListing.

export default CompetitionListing;