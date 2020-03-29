import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import {NotificationManager} from "react-notifications";
import EmptyPage from "../../EmptyPage";

class VenueList extends Component {
    state = {
        listData : [],
        offset: 0,
        perPage: PerPage,
        searchValue:'',
        order_by:'id',
        orderType:'asc',
        venuSettings:false,
        classActive:true
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    loadVenuesFromServer = () => {
        let preLoader = $("body").find('.preloader3');
        preLoader.show();
        axios.post(BaseUrl + '/api/list-venues/'+CompanyID,{'order_by':this.state.order_by,'orderData':this.state.orderType,'limit': this.state.perPage, 'offset': this.state.offset,'nameSearch':this.state.searchValue})
            .then(res => {
                preLoader.hide();
                var settingsData;
                if(res.data.settings) {
                    settingsData= JSON.parse(res.data.settings.field2);
                }
                this.setState({listData:res.data.list,pageCount:(res.data.totalSegments)/this.state.perPage,venuSettings:(settingsData)?settingsData.from_pos:false});

            }).catch((err) => {
            preLoader.hide();
            NotificationManager.error("Error occurred while getting list venues .", 'Error');
        });

    };
    clickView = (e) => {
        var element = e.currentTarget;
        var venue_id = 23020;
        var click = element.getAttribute("data-click");
        var id = element.getAttribute("id");
        if(click == 0){
            axios.post(BaseUrl + '/api/venue-total-campaign',{venue_id:venue_id})
                .then(res => {
                    if(res.data){
                        document.getElementById(id).setAttribute("data-click",1);
                        document.getElementById(id+"_total_campaigns").innerHTML = res.data.total_campaign;
                        document.getElementById(id+"_active_campaigns").innerHTML = res.data.active;
                        document.getElementById(id+"_total_beacons").innerHTML = res.data.total_beacons;
                    }else{
                        NotificationManager.error("Error occured while saving record", 'Error',1500);
                    }
                }).catch((err) => {
                NotificationManager.error("Error occurred while getting venue total campaign .", 'Error');
            });
        }
    };


    componentDidMount = () => {
        this.loadVenuesFromServer();
    };//--- End of componentDidMount() ---//




    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        this.setState({offset: offset}, () => {
            this.loadVenuesFromServer();
        });
    };

    /**
     * search Segment
     * @param e
     */
    searchGridData = (e) => {
        this.setState({searchValue:e.target.value,offset: 0,perPage:10}, () => {
            this.loadVenuesFromServer();
        });
    };//--- End of searchGridData()  ---//

    changeOrder = (orderField,order) => {
        this.setState((e)=>({order_by:orderField,orderType:order}),()=>{this.loadVenuesFromServer();});
    };

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

    editVenue = (venue_id,item) => {
        this.props.setEditVenue(venue_id,item);

    };

    selectVenue = (value) => {

       let userData = JSON.parse(localStorage.getItem('userData'));
       if(userData.venue_id === value.venue_id){
           NotificationManager.warning("Venue is already selected. Please select other venue", 'Warning');
           return false;
       }
       userData.venue_id = value.venue_id;
       userData.venue_name = value.venue_name;
       userData.sender_email = value.sender_email;

       VenueID = value.venue_id;
       localStorage.setItem('userData',JSON.stringify(userData));
        window.location.reload(true);
        NotificationManager.success("Venue selected successfully .", 'Success');
    };
    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.loadVenuesFromServer();
        }
    };//--- End of enterPressed() ----//

    venuesFromPos = (e) =>{
        const currentState = this.state.classActive;
        this.setState({ classActive: !currentState });
        axios.post(BaseUrl + '/api/add-pos-venues',{
            company_id : CompanyID
        })
            .then(res => {
                if(res.data.status) {
                    this.setState({classActive: !this.state.classActive});
                    this.loadVenuesFromServer();
                    NotificationManager.success(res.data.message, 'Success');
                }else{
                    this.setState({classActive: !this.state.classActive});
                    NotificationManager.error(res.data.message, 'Success')
                }

            }).catch((err) => {
            this.setState({classActive: !this.state.classActive});
            NotificationManager.error("Error occurred while getting list venues .", 'Error');
        });
    }

    render() {
        if(!appPermission("Venue List","view")){
            return (
                <EmptyPage/>
            )
        }else{
            return (

                <div>
                    <div className="compaignHeadigs">
                        <h1>My Sites</h1>
                        <p>View a list of your current and past sites. You can search, edit, pause, delete and run reports depending on your sites.</p>
                    </div>

                    <div className="compaigns_list_content">
                        <div className="compaigns_list_detail">

                            <div className="cL_listing_tableOut memberTable">

                                <div className="compaign_select_search clearfix">


                                    <div className="searchCompaign clearfix">
                                        <div className="preloader3" style={{marginLeft: '-265px', marginTop: '0px', display: (this.state.classActive)?'none':'inline-block'}}>&nbsp;</div>
                                        <input type="text"  placeholder="Search site" defaultValue={this.state.searchValue}  onKeyPress={this.enterPressed} className="copmpaignSearch_field" />
                                        <input type="submit" style={{textIndent:"-99px"}}  className="copmpaignIcon_field"  />
                                    </div>
                                </div>

                                <div className="compaign_addNew clearfix">
                                    <h3>ALL SITES</h3>

                                    {(appPermission("Venue List","add") ) && (
                                        <a  style={{cursor:'pointer'}} onClick={(e)=>{ this.props.addNewVenue() }} className={(this.state.classActive)?"all_blue_button":"all_blue_button disabled"}>Add New Site</a>
                                    )}
                                    {(appPermission("Venue List","add") && this.state.venuSettings) && (
                                        <a  style={{cursor:'pointer'}} style={{marginRight:'8px'}} onClick={(e)=>{ this.venuesFromPos(e)}} className={(this.state.classActive)?"all_blue_button":"all_blue_button disabled"}>Import Sites From POS</a>
                                    )}

                                </div>


                                <div className="cL_listing_tableInn venueTable_cells_setting">

                                    <div className="cL_listing_tableTitle">
                                        <div className="cL_listing_table_row">
                                            <div className="cL_listing_table_cell cell1">
                                                <strong><span><b><img onClick={(e)=>{this.changeOrder("created_at","desc")}} src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img onClick={(e)=>{this.changeOrder("created_at","asc")}} src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Date Added</strong>
                                            </div>
                                            <div className="cL_listing_table_cell cell2">
                                                <strong><span><b><img onClick={(e)=>{this.changeOrder("id","desc")}} src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img onClick={(e)=>{this.changeOrder("id","asc")}} src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Site ID</strong>
                                            </div>
                                            <div className="cL_listing_table_cell cell3">
                                                <strong><span><b><img onClick={(e)=>{this.changeOrder("venue_name","desc")}} src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img onClick={(e)=>{this.changeOrder("venue_name","asc")}} src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Site Name</strong>
                                            </div>
                                            <div className="cL_listing_table_cell cell4">
                                                <strong><span><b><img  src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Venue Location</strong>
                                            </div>
                                            <div className="cL_listing_table_cell cell1">
                                                <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Assign Categories</strong>
                                            </div>

                                            <div className="cL_listing_table_cell cell6">
                                                <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>&nbsp;</strong>
                                            </div>

                                        </div>

                                    </div>


                                    <ul>
                                        {this.state.listData.map(item =>
                                            <li key={item.venue_id}>
                                                {/*<a  style={{cursor:'pointer'}} title={(item.venue_id !== VenueID) ? "Enter this venue." : "Venue already selected"}>*/}
                                                <div className="listDataShowing">
                                                    <div className="cL_listing_table_row">
                                                        <div className="cL_listing_table_cell cell1"> <span className="cL_rowList_number">{item.created_at}</span> </div>
                                                        <div className="cL_listing_table_cell cell2">

                                                            <span className="cL_rowList_number">{item.venue_id}</span>
                                                        </div>
                                                        <div className="cL_listing_table_cell cell3">
                                                            <span className="cL_rowList_number">{item.venue_name}</span>
                                                        </div>
                                                        <div className="cL_listing_table_cell cell4">
                                                            <span className="cL_rowList_number">{item.address}</span>
                                                        </div>
                                                        <div className="cL_listing_table_cell cell1">

                                                    <span className="cL_rowList_number">

                                                        {(!this.state.venuSettings) && item.listAssignCat.map((value1,key1)=>{
                                                            return (
                                                                <strong key={key1} className="news_owner" >{value1.name}</strong>
                                                            )
                                                        })}
                                                    </span>
                                                        </div>

                                                        <div className="clEditDotes_cell cell6 cell6_image clearfix"> <span className="cL_rowList_number" style={{marginTop:'5px'}}>


                                                </span> <a className="cl_tableRow_editDotes" onClick={this.handleButtonsShow}  style={{cursor:'pointer'}}><i></i></a> </div>

                                                    </div>


                                                    <div className="cl_rowEdit_popOut">
                                                        <div className="cl_rowEdit_pop_table">
                                                            <div className="cl_rowEdit_popOut_tableRow">
                                                                {(item.venue_id != VenueID) && (
                                                                    <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1"> <a className=""  style={{cursor:'pointer'}} onClick={()=>{this.selectVenue(item)}}> <strong><i>&nbsp;</i>Enter this Site</strong></a> </div>
                                                                )}
                                                                {(appPermission("Venue List","edit")) && (
                                                                    <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1"> <a className="edit_icon"  style={{cursor:'pointer'}} onClick={()=>{this.editVenue(item.venue_id,item)}}> <strong><i>&nbsp;</i>Edit</strong></a> </div>
                                                                )}
                                                                {/*<div className="cl_rowEdit_popOut_tableRow_cell eidtCell3"> <a className="delete_icon"  style={{cursor:'pointer'}}><strong><i>&nbsp;</i>Delete</strong></a> </div>*/}

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/*</a>


                                        <div className="memberList_showDetail venue_showing ">

                                            <div className="venueShow_detail clearfix">
                                                <div className="venueShow_detail_img">
                                                    <img src="assets/images/milky_img.png" alt="#" />
                                                </div>

                                                <div className="venueShow_detail_text">
                                                    <h2>Milky Lane Rosebank</h2>
                                                    <small>FOOD &amp; BEVERAGES</small>
                                                </div>
                                            </div>
                                            <div className="venueList_showDetail_inner clearfix">
                                                <div className="memberList_showDetail_left venueId">
                                                    <ul>
                                                        <li>
                                                            <div className="memberNumber_status clearfix">
                                                                <div className="memberNumber_row">
                                                                    <label>Site ID</label>
                                                                    <span>{item.id}</span>
                                                                </div>

                                                                <div className="memberNumber_row">
                                                                    <label>Status</label>
                                                                    <span><i className="activeGreen">&nbsp;</i>Active</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="memberNumber_status clearfix">
                                                                <div className="memberNumber_row">
                                                                    <label>Email</label>
                                                                    <span><a href="#">{item.email}</a></span>
                                                                </div>

                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="memberNumber_status clearfix">
                                                                <div className="memberNumber_row">
                                                                    <label>Contact Number</label>
                                                                    <span>{item.mobile}</span>
                                                                </div>

                                                                <div className="memberNumber_row">
                                                                    <label>Owner</label>
                                                                    <span>{item.contactName}</span>
                                                                </div>
                                                            </div>
                                                        </li>

                                                    </ul>

                                                    <div className="mapDiv">
                                                        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d435521.40799479093!2d74.07127155121749!3d31.482635215534856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1522065244480" width="350" height="160" frameBorder="0" style={{border:'0'}} allowFullScreen></iframe>
                                                    </div>

                                                    <div className="adree_pin">
                                                        <p>{item.address}</p>
                                                    </div>

                                                </div>


                                                <div className="memberList_showDetail_right_outer">
                                                    <div className="memberList_showDetail_right">
                                                        <ul>
                                                            <li>
                                                                <div className="memberNumber_status clearfix">
                                                                    <div className="memberNumber_row">
                                                                        <label>Site Created</label>
                                                                        <span>{item.created_at}</span>
                                                                    </div>

                                                                    <div className="memberNumber_row">
                                                                        <label>&nbsp;</label>
                                                                        <span>12:13 </span>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="memberNumber_status oneColumn clearfix">
                                                                    <div className="memberNumber_row">
                                                                        <label>Total Campaigns</label>
                                                                        <span id={item.id +"_total_campaigns"}>123</span>
                                                                    </div>

                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="memberNumber_status oneColumn clearfix">
                                                                    <div className="memberNumber_row">
                                                                        <label>Active Campaigns</label>
                                                                        <span id={item.id+"_active_campaigns"}>10</span>
                                                                    </div>

                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="memberNumber_status oneColumn clearfix">
                                                                    <div className="memberNumber_row">
                                                                        <label>Number of beacons</label>
                                                                        <span id={item.id+"_total_beacons"}>23</span>
                                                                    </div>

                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <button className="deleteVenue">DELETE Site</button>
                                                    <button className="viewMemberInsight">EDIT Site</button>
                                                </div>


                                            </div>
                                        </div>   */}

                                            </li>

                                        )}

                                    </ul>
                                </div>


                                <div className="campLstng_paginaton_out">
                                    <div className="campLstng_paginaton_inn">
                                        <ReactPaginate previousLabel={""}
                                                       nextLabel={""}
                                                       nextLinkClassName={'campPagi_next'}
                                                       breakLabel={<a href="">...</a>}
                                                       breakClassName={"break-me"}
                                                       pageCount={this.state.pageCount}
                                                       marginPagesDisplayed={2}
                                                       pageRangeDisplayed={5}
                                                       previousLinkClassName={'campPagi_prev'}
                                                       onPageChange={this.handlePageClick}
                                                       activeClassName={"active"}/>
                                    </div>

                                </div>


                            </div>

                        </div>
                    </div>
                </div>
            );
        }

    }//..... end of render() .....//
}//..... end of VenueList.

VenueList.propTypes = {};

export default VenueList;