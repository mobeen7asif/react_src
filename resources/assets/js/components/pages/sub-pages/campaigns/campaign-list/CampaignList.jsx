import React, {Component} from 'react';
import { connect } from 'react-redux';


import HeaderComponent from '../../members/sub_components/HeaderComponent';
import ReactPaginate from 'react-paginate';
import ConfirmationModal from "../../../../utils/ConfirmationModal";
import {NotificationManager} from "react-notifications";
import GamificationStatisticsComponent from "./GamificationStatisticsComponent";
import VoucherExistModal from "../../../../utils/VoucherExistModal";
import EmptyPage from "../../../EmptyPage";
import CampaignActivationModal from "../../../../utils/CampaignActivationModal";
import NoDataFound from "../../../../_partials/NoDataFound";

class CampaignList extends Component {
    state = {
        campaignList: [],
        offset: 0,
        perPage: PerPage,
        searchCamapaign: '',
        campaignType: '',
        filterSegment: 'created_at',
        orderType: 'DESC',
        current: '',
        headerList: [{"id": "1", "name": 'Date Added', 'filterName': 'created_at'},
            {"id": "2", "name": 'Name', 'filterName': 'name'},
            {"id": "3", "name": 'Campaign status', 'filterName': 'is_play'},
            {"id": "4", "name": 'Type', 'filterName': 'type'},
            /*{"id": "5", "name": 'Message Type', 'filterName': 'nill'},*/
            {"id": "5", "name": 'Site Name', 'filterName': 'nill'},
            {"id": "6", "name": 'Status', 'filterName': 'status'},
            {"id": "7", "name": 'Nature', 'filterName': 'nill'}
        ],
        filterType: 'All',
        filterStatus: 'All',
        showListError: false,
        deleteCampaign: 0,
        activateCampaign:0,
        pageCount: 0,
        gameCampaignStatistics: 0,
        voucherStatus: false,
        checked: false
    };

    loadCamapginFromServer = () => {
        let preLoader = $("body").find('.preloader3');
        preLoader.show();
        axios.post(BaseUrl + `/api/campaign-list`, {
            'name': this.state.filterSegment,
            'orderData': this.state.orderType,
            'limit': this.state.perPage,
            'offset': this.state.offset,
            'nameSearch': this.state.searchCamapaign,
            'filterType': this.state.filterType,
            'filterStatus': this.state.filterStatus,
            'show_all_campaign': appPermission("ViewAllCampaigns","view") ? true : false,
            company_id  : CompanyID,
            venue_id    : (this.props.newVenueId > 0)? this.props.newVenueId : VenueID
        }).then(res => {
                if (res.data.status) {
                    this.setState({
                        campaignList: res.data.data,
                        pageCount: (res.data.total) / this.state.perPage,
                        showListError: false
                    });

                    preLoader.hide();
                } else {
                    this.setState({showListError: true});
                    preLoader.hide();
                }
            }).catch((err) => {
            this.setState({showListError: true});
            preLoader.hide();
        });
    };

    componentDidMount = () => {
        this.loadCamapginFromServer();
    };

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.newVenueId !== this.props.newVenueId) {
            this.loadCamapginFromServer();
        }
    };

    /**
     * Navigation for campaign Builder
     * @param e
     * @param slug
     */
    campaignBuilder = (e, slug) => {
        e.preventDefault();
        this.props.navigate(e, slug);
    };//--- End of

    /**
     * Sorting Campaign
     * @param name
     * @param data
     */
    campaignSorting = (name, data) => {
        this.setState({filterSegment: name, orderType: data}, () => {
            this.loadCamapginFromServer();
        });
    };//--- End of

    /**
     *
     * @param data
     */
    changePages = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        this.setState({offset: offset}, () => {
            this.loadCamapginFromServer();
        });
    };//--- End of changePages() ---//

    deleteCampaign = (campaign) => {
        let res = campaign.action_value.match(/"type":"voucher"/g);
        if(res){
            this.setState({voucherStatus: true});
        }
        if(!this.state.voucherStatus) {
            this.setState(() => ({deleteCampaign: campaign.id}));
        }
    };

    handleCloseModal = () => {
        this.setState(() => ({deleteCampaign: 0,voucherStatus: false,checked: false}));
    };


    handleStatus = (status) => {
        let campaignId = this.state.deleteCampaign;
        this.setState({deleteCampaign: 0,voucherStatus: false,checked: false});
        show_loader();
        axios.post(`${BaseUrl}/api/delete-campaign/${campaignId}`,{voucher_status: status})
            .then((response) => {
                show_loader();
                if (response.data.status === true){
                    NotificationManager.success(response.data.message, 'Success');
                    this.loadCamapginFromServer();
                } else
                    NotificationManager.error(response.data.message, 'Error');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };

    hanldeCheckBoxButton = () => {
        this.setState({checked: !this.state.checked});
    };


    handleDeleteCampaign = () => {
        let campaignId = this.state.deleteCampaign;
        this.setState({deleteCampaign: 0,voucherStatus: false});
        show_loader();
        axios.post(`${BaseUrl}/api/delete-campaign/${campaignId}`,{voucher_status: this.state.checked})
            .then((response) => {
                show_loader();
                if (response.data.status === true){
                    NotificationManager.success(response.data.message, 'Success');
                    this.loadCamapginFromServer();
                } else
                    NotificationManager.error(response.data.message, 'Error');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDeleteCampaign() .....//

    duplicateCampaign = (campaignId) => {
        show_loader();
        axios.get(`${BaseUrl}/api/duplicate-campaign/${campaignId}`)
            .then((response) => {
                show_loader();
                if (response.data.status === true){
                    NotificationManager.success(response.data.message, 'Success');
                    this.loadCamapginFromServer();
                } else
                    NotificationManager.error(response.data.message, 'Error');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of duplicateCampaign() .....//

    handleButtonsShow = (e) => {
        let li = e.target.closest('li');
        if (li.classList.contains('active_editMod')) {
            li.classList.remove('active_editMod');
        } else {
            Array.prototype.slice.call(e.target.closest('ul').querySelectorAll('li'))
                .map((ele) => ele.classList.remove('active_editMod'));
            li.classList.add('active_editMod');
        }//..... end if-else() .....//
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.loadCamapginFromServer();
        }
    };//--- End of enterPressed() ----//

    handleGameStatisticsModel = (campaign_id) => {
        this.setState(() => ({gameCampaignStatistics: campaign_id}));
    };//..... end of handleGameStatisticsModel() ......//

    activateCampaign = (id) => {
            this.setState(() => ({activateCampaign: id}));
    };


    handleActivateModal = () => {
        this.setState(() => ({activateCampaign: 0}));
    };

    handleActivateCampaign = () => {
        show_loader();
        axios.post(BaseUrl + '/api/activate-campaign', {
            campaign_id: this.state.activateCampaign,
            send_email: getAclRoles("Franchisee")
        }).then(res => {
            show_loader(true);
            this.setState({activateCampaign: 0});
            this.loadCamapginFromServer();
            NotificationManager.success("Campaign activated successfully.", 'Success');
        }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while activating campaign.", 'Error');
        });


    };

    playStopCampaign = (id,status) => {
        show_loader();
        axios.post(BaseUrl + '/api/play-stop-campaign', {
            id: id,
            status: status
        }).then(res => {
            show_loader(true);
            this.loadCamapginFromServer();
            if(status == 1){
                NotificationManager.success("Campaign has been play successfully.", 'Success');
            }else{
                NotificationManager.success("Campaign has been stop successfully.", 'Success');
            }
        }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while activating campaign.", 'Error');
        });

    }




    render() {
        if(!appPermission("Campaign List","view")){
            return (
                <EmptyPage/>
            )
        }else{
            return (
                <div className="contentDetail">
                    <div className="autoContent">
                        <div className="compaignHeadigs">
                            <h1>Campaign Type</h1>
                            <p>View a list of your current and past campaigns. You can search, edit, pause, delete and run reports depending on campaign type and status.</p>
                        </div>

                        <div className="compaigns_list_content">
                            <div className="compaigns_list_detail">
                                <div className="cL_listing_tableOut">
                                    <div className="compaign_select_search clearfix">
                                        <div className="selectCompaign">
                                            <div className="campaign_select">
                                                <span>{this.state.filterType}</span>
                                                <select onChange={(e) => this.setState({filterType: e.target.value, offset: 0}, () => {this.loadCamapginFromServer()})}>
                                                    <option value="All">All</option>
                                                    <option value="Set & Forget">Set & Forget</option>
                                                    <option value="Proximity">Proximity</option>
                                                    <option value="Dynamic">Dynamic</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="selectCompaign">
                                            <div className="campaign_select">
                                                <span>{this.state.filterStatus}</span>
                                                <select onChange={(e)=>this.setState({filterStatus: e.target.value, offset: 0}, () => {this.loadCamapginFromServer();})}>
                                                    <option value="All">All</option>
                                                    <option value="Active">Active</option>
                                                    <option value="Scheduled">Scheduled</option>
                                                    <option value="Draft">Draft</option>
                                                    <option value="Paused">Paused</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Deleted">Deleted</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="searchCompaign clearfix">
                                            <div className="preloader3" style={{marginLeft: '-104px', marginTop: '0px', display: 'none'}}>&nbsp;</div>
                                            <input type="text" placeholder="Search Campaign" value={this.state.searchCamapaign}
                                                   onChange={(e) => this.setState({searchCamapaign: e.target.value, offset: 0})}
                                                   onKeyPress={this.enterPressed} className="copmpaignSearch_field"/>
                                            <input type="submit" value="" className="copmpaignIcon_field" onClick={() => this.loadCamapginFromServer()}/>
                                        </div>
                                    </div>

                                    <div className="compaign_addNew clearfix">
                                        <h3>MY CAMPAIGNS</h3>
                                        {(appPermission("Campaign Builder","add")) && (
                                            <a onClick={(e) => {
                                                this.campaignBuilder(e, '/campaigns/builder')
                                            }} className="all_blue_button">Add New Campaign</a>
                                        )}
                                    </div>


                                    <div className="cL_listing_tableInn">
                                        <HeaderComponent listData={this.state} onClick={(id, name) => this.campaignSorting(id, name)} />
                                        <ul>
                                            {(this.state.showListError)? <NoDataFound customMessage="Campaign"/>
                                                :this.state.campaignList.map(item =>
                                                    <li key={item.id} className="cl_rowEdit_popOut4">
                                                        <div className="cL_listing_table_row ">
                                                            <div className="cL_listing_table_cell cell1">
                                                                <span className="cL_rowList_number">{item.created_at}</span>
                                                            </div>
                                                            <div className="cL_listing_table_cell cell2">
                                                                <span className="cL_rowList_number">{item.name}</span>
                                                            </div>
                                                            <div className="cL_listing_table_cell cell3">
                                                                <span className="cL_rowList_number">{item.is_play == 1 ? "Play" : "Stopped" }</span>
                                                            </div>
                                                            <div className="cL_listing_table_cell cell4">
                                                                <span className="cL_rowList_number">{item.type}</span>
                                                            </div>
                                                            {/*<div className="cL_listing_table_cell cell5">
                                                        <span className="cL_rowList_number">{item.action_type}</span>
                                                    </div>*/}
                                                            <div className="cL_listing_table_cell cell5">
                                                                <span className="cL_rowList_number">{item.venue_name}</span>
                                                            </div>
                                                            <div className="cL_listing_table_cell cell6">
                                                                <span className="cL_rowList_number">{item.status}</span>
                                                            </div>
                                                            <div className="clEditDotes_cell cell7_set cell7 clearfix">
                                                                <span className="cL_rowList_number" style={{marginTop: '5px'}}>{item.campaign_type}</span>
                                                                <a className="cl_tableRow_editDotes" onClick={this.handleButtonsShow}  style={{cursor:'pointer'}}><i></i></a>
                                                            </div>
                                                        </div>
                                                        <div className="cl_rowEdit_popOut">
                                                            <div className="cl_rowEdit_pop_table">
                                                                <div className="cl_rowEdit_popOut_tableRow">
                                                                    {(item.status == 'Active' && item.is_play == 0 && appPermission("CampaignPlayStop","view"))   &&
                                                                    <div className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                                        <a className="duplicateIcon" style={{backgroundColor:"green"}}  style={{cursor:'pointer'}} onClick={(e) => {this.playStopCampaign(item.id,1)}}><strong><i>&nbsp;</i>Play</strong></a>
                                                                    </div>}

                                                                    {(item.status == 'Active' && item.is_play == 1 && appPermission("CampaignPlayStop","view"))   &&
                                                                    <div className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                                        <a className="duplicateIcon" style={{backgroundColor:"red"}}  style={{cursor:'pointer'}} onClick={(e) => {this.playStopCampaign(item.id,0)}}><strong><i>&nbsp;</i>Stop</strong></a>
                                                                    </div>}


                                                                    {(item.status == 'Deactivated' && appPermission("Activate Campaigns","view"))   &&
                                                                    <div className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                                        <a className="duplicateIcon" style={{backgroundColor:"green"}}  style={{cursor:'pointer'}} onClick={(e) => {this.activateCampaign(item.id)}}><strong><i>&nbsp;</i>Activate</strong></a>
                                                                    </div>}

                                                                    <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1">
                                                                        {(appPermission("Campaign List","edit")) && (
                                                                        <a className="edit_icon"  style={{cursor:'pointer'}} onClick={(e) => {this.props.navigate(null, `/campaigns/builder/${item.id}`)}}>
                                                                            <strong><i>&nbsp;</i>
                                                                                {(!item.deleted_at)?'Edit/View':'View'}</strong>
                                                                        </a>
                                                                        )}
                                                                    </div>
                                                                    {/* <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1">
                                                                <a className="scheduleIcon"  style={{cursor:'pointer'}}><strong><i>&nbsp;</i>Schedule</strong></a>
                                                            </div>*/}
                                                                    {(item.type !== 'Gamification' && appPermission("Campaign List","edit"))   &&
                                                                    <div className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                                        <a className="duplicateIcon"  style={{cursor:'pointer'}} onClick={(e) => {this.duplicateCampaign(item.id)}}><strong><i>&nbsp;</i>Duplicate</strong></a>
                                                                    </div>}
                                                                    {(!item.deleted_at && appPermission("Campaign List","delete") ) &&
                                                                    <div className="cl_rowEdit_popOut_tableRow_cell eidtCell3">
                                                                        <a className="delete_icon"  style={{cursor:'pointer'}} onClick={(e) => {this.deleteCampaign(item)}}><strong><i>&nbsp;</i>Delete</strong></a>
                                                                    </div>}
                                                                    {item.type === 'Gamification' &&
                                                                    <div className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                                        <a className="scheduleIcon"  style={{cursor:'pointer'}} onClick={(e) => this.handleGameStatisticsModel(item.id)}>
                                                                            <strong><i>&nbsp;</i>Statistics</strong>
                                                                        </a>
                                                                    </div>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )}
                                        </ul>
                                    </div>

                                    <div className="campLstng_paginaton_out">
                                        <div className="campLstng_paginaton_inn">
                                            <ReactPaginate previousLabel={""} nextLabel={""} nextLinkClassName={'campPagi_next'} breakLabel={<a href="">...</a>}
                                                           breakClassName={"break-me"} pageCount={this.state.pageCount} marginPagesDisplayed={2} pageRangeDisplayed={5}
                                                           previousLinkClassName={'campPagi_prev'} onPageChange={this.changePages} activeClassName={"active"}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <VoucherExistModal voucherStatus={this.state.voucherStatus}  isOpen={!!this.state.deleteCampaign} handleCloseModal={this.handleCloseModal}  text={'Campaign'} handleDeleteItem={this.handleDeleteCampaign} handleCheckBox={() => {this.hanldeCheckBoxButton()}}/>
                    <CampaignActivationModal isOpen={!!this.state.activateCampaign} handleCloseModal={this.handleActivateModal} text={'activate Campaign'} handleDeleteItem={this.handleActivateCampaign}/>
                    {/*<ConfirmationModal isOpen={!!this.state.deleteCampaign} handleCloseModal={this.handleCloseModal} text={'Campaign'} handleDeleteItem={this.handleDeleteCampaign}/>*/}



                    {this.state.gameCampaignStatistics > 0 &&  <GamificationStatisticsComponent campaign_id = {this.state.gameCampaignStatistics} handleGameStatisticsModel={this.handleGameStatisticsModel} />}
                </div>
            );
        }

    }//..... end of render() .....//

}//..... end of CampaignList.


const mapStateToProps = (state) => {
    return {
        newVenueId: state.headerVenueId.venueId
    };
};

export default connect(mapStateToProps)(CampaignList);