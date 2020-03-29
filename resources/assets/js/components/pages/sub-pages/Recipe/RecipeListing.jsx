import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import Grid from "../../Grid";
import EmptyPage from "../../EmptyPage";


class RecipeListing extends Component {
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
        venue_id        :VenueID
    };


    loadData = () => {
        this.pageLoader.show();
        axios.post(BaseUrl + `/api/recipes-lists`, ''.recipeListHeader(this.state.orderBy, this.state.orderType, this.perPage, this.state.offset, this.state.searchData,VenueID)).then(res => {
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

    editRecord = (recipe) => {
        let newRecipe = (recipe);
        this.props.setEditRecord(newRecipe, 'edit');
    };//..... end of editRecord() .....//

    deleteRecord = (id) => {
        this.setState(() => ({deleteRecord: id}));
    };//..... end of deleteRecord() .....//

    handleCloseModal = () => {
        this.setState(() => ({deleteRecord: 0}));
    };//..... end of handleCloseModal() .....//

    handleDeleteRecord = () => {
        show_loader();
        axios.post(BaseUrl + `/api/delete-recipe`, {id: this.state.deleteRecord, venue_id: VenueID, company_id: CompanyID})
            .then(res => {
                show_loader(true);
                if (res.data.status) {
                    this.setState(() => ({deleteRecord: 0}));
                    this.loadData();
                    NotificationManager.success("Recipe deleted successfully!.", 'Success');
                } else {
                    NotificationManager.error("Error occurred while deleting recipe, please try later.", 'Error');
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
        if(!appPermission("Recipe List","view")){
            return (
                <EmptyPage/>
            )
        }else{
            return (
                <div className="cL_listing_tableOut memberTable">

                    <div className="compaign_select_search clearfix">
                        <div className="searchCompaign clearfix">
                            <div className="preloader3" style={{marginLeft: '-104px', marginTop: '0px', display: 'none'}}>&nbsp;</div>
                            <input type="text" value={this.state.searchData} placeholder="Search Recipe" className="copmpaignSearch_field" onKeyPress={this.enterPressed} onChange={this.searchData}/>
                            <input type="submit" value="" className="copmpaignIcon_field" onClick={() => this.loadData()}/>
                        </div>
                    </div>

                    <div className="compaign_addNew clearfix">
                        <h3>Recipe(s) List</h3>
                        {(appPermission("Recipe List","add")) && (
                            <a className="all_blue_button" onClick={(e) => this.props.changeMainTab('edit')}>Add Recipe</a>
                        )}
                    </div>

                    <Grid headerList                    = {[].recipeHeaderList}
                          handleFilterChange            = {this.handleFilterChange}
                          orderBy                       = {this.state.orderBy}
                          orderType                     = {this.state.orderType}
                          data                          = {this.state.data}
                          editRecord                    = {(appPermission("Recipe List","edit")) ? this.editRecord : false}
                          addRecordToStateForDeletion   = {(appPermission("Recipe List","delete")) ? this.deleteRecord : false}
                          pageCount                     = {this.state.pageCount}
                          handlePageClick               = {this.handlePageClick}
                          deleteItemID                  = {this.state.deleteRecord}
                          handleCloseModal              = {this.handleCloseModal}
                          deletePopupText               = {'Recipe'}
                          handleDeleteItem              = {this.handleDeleteRecord}
                    />

                </div>
            );
        }


    }//..... end of render() .....//
}//..... end of Class.

export default RecipeListing;