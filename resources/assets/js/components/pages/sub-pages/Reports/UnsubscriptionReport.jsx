import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import Grid from "../../Grid";
import {connect} from 'react-redux';
import {resetRecipeOfferForm} from "../../../redux/actions/RecipeOfferActions";


class UnsubscriptionReport extends Component {
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


    };

    headerList = [{"id": "1", "name": 'Date', 'filterName': 'date_added'},
        {"id": "2", "name": 'Campaign Name', 'filterName': 'name'},
        {"id": "3", "name": 'User Name', 'filterName': 'userName'},
        {"id": "4", "name": "Phone", "filterName": "phone_number"},
        {"id": "5", "name": 'Member ID', 'filterName': 'client_customer_id'},
        {"id": "5", "name": 'Type', 'filterName': 'event_type'},
        {"id": "5", "name": 'Status', 'filterName': 'status'}];

    loadData = () => {
        this.pageLoader.show();
        axios.post(BaseUrl + `/api/campaign-report-unsubscription`, {
            'company_id': CompanyID,
            'venue_id': VenueID,
            'event_type'      :"unsubscribe",
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
                        <input type="text" value={this.state.searchData} placeholder="Search..." className="copmpaignSearch_field" onChange={this.searchData} onKeyPress={this.enterPressed}/>
                        <input type="submit" value="" className="copmpaignIcon_field" onClick={() => this.loadData()}/>
                    </div>
                </div>



                <Grid headerList                    = {this.headerList}
                      handleFilterChange            = {this.handleFilterChange}
                      orderBy                       = {this.state.orderBy}
                      orderType                     = {this.state.orderType}
                      data                          = {this.state.data}
                      pageCount                     = {this.state.pageCount}

                />

            </div>
        );
    }//..... end of render() .....//
}//..... end of Class.

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(UnsubscriptionReport);