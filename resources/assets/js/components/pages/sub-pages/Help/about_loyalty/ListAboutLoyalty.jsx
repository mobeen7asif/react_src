import React, {Component} from 'react';
import Grid from '../../../Grid';
class ListAboutLoyalty extends Component {
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
    };

    headerList = [
        {"id": "1", "name": 'type',         'filterName': 'type'},
        {"id": "2", "name": 'Voucher',         'filterName': 'field2', htmlParser: true},
        {"id": "3", "name": 'Stamp Card',         'filterName': 'field3', htmlParser: true},
    ];

    loadData = () => {
        this.pageLoader.show();
        axios.post(BaseUrl + `/api/list-loyalty-about`, {
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
        this.props.addAboutLoyalty('edit', aboutLoyalty);
    };//..... end of editRecord() .....//

    render() {
        return (
            <div className="cL_listing_tableOut memberTable">

                <div className="compaign_select_search clearfix">
                    <div className="searchCompaign clearfix">
                        <div className="preloader3" style={{marginLeft: '-104px', marginTop: '0px', display: 'none'}}>&nbsp;</div>
                    </div>
                </div>

                <div className="compaign_addNew clearfix">
                    <h3>Referral Setting List</h3>
              {(this.state.data.length !=1 && appPermission("About Loyalty","add")) && (
                  <a className="all_blue_button" onClick={this.props.addAboutLoyalty}>Add Loyalty Settings</a>
              )}
                </div>

                <Grid headerList                    = {this.headerList}
                      orderBy                       = {this.state.orderBy}
                      orderType                     = {this.state.orderType}
                      data                          = {this.state.data}
                      pageCount                     = {this.state.pageCount}
                      editRecord                    = {(appPermission("About Loyalty","edit")) ? this.editRecord : false}
                      handlePageClick               = {this.handlePageClick}
                />

            </div>
        );
    }//..... end of render() .....//
}//..... end of ListAboutLoyalty.

ListAboutLoyalty.propTypes = {};

export default ListAboutLoyalty;