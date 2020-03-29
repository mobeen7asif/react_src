import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NotificationManager} from "react-notifications";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

class VenueAccountUsers extends Component {
    userPopupRef = null;
    state = {
        listData : [],
        offset: 0,
        perPage:10,
        searchValue:'',
        order_by:'id',
        orderType:'desc',
        levels : ""
    };
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    loadCommentsFromServer = () => {
        show_loader();
        axios.post(BaseUrl + '/api/venue-users',{'venue_id':VenueID,'company_id':CompanyID,'order_by':this.state.order_by,'orderData':this.state.orderType,'limit': this.state.perPage, 'offset': this.state.offset,'nameSearch':this.state.searchValue})
            .then(res => {
                show_loader();
                this.setState(()=>({listData:res.data.data,pageCount:(res.data.total)/this.state.perPage,levels:res.data.levels}));
            }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while getting venue users.", 'Error',1500);
        });

    };

    /**
     * Handle Sorting change
     * @param fieldName
     * @param orderType
     */
    handleSortingOrder = (fieldName, orderType) => {
        this.setState(prevState => ({order_by: fieldName, orderType: orderType}), () => { this.loadCommentsFromServer(); });
    };

    addNewUser = () => {
        $(".addNewUser_popup").show();
        $(".createUserButtons").show();
        $("#first_name").val("");
        $("#last_name").val("");
        $("#email").val("");
        $("body, html").animate({
            scrollTop: 0
        }, 800);

    };

    saveVenueUser = () => {
        var user_level               = $("#select_level").val();
        var user_role_id               = $("#select_role").val();
        $('#first_name').prop("readonly", false);
        $('#last_name').prop("readonly", false);
        $('#email').prop("readonly", false);
        var first_name          = $("#first_name").val();
        var last_name           = $("#last_name").val();
        var email               = $("#email").val();
        var venue_name          = $("#account_id").val();

        var data = {
            venue_id    :VenueID,
            first_name  :first_name,
            last_name   :last_name,
            email       :email,
            venue_name  :venue_name,
            user_level  : user_level,
            user_role_id: user_role_id,
            company_id  :CompanyID
        };

        var count = 0;

        if (first_name !=""){
            $("#first_name").parent().css({"border-color": "#ededed", "border-width": "1px", "border-style": "solid"});

        }else {
            $("#first_name").parent().css({"border-color": "#FD0004", "border-width": "1px", "border-style": "solid"});
            count++;
        }
        if (last_name !=""){
            $("#last_name").parent().css({"border-color": "#ededed", "border-width": "1px", "border-style": "solid"});
        }else{
            $("#last_name").parent().css({"border-color": "#FD0004", "border-width": "1px", "border-style": "solid"});
            count++;
        }

        if (email !=""){
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            var res =  pattern.test(email);
            if(res)
            {
                $("#email").parent().css({"border-color": "#ededed", "border-width": "1px", "border-style": "solid"});
            } else {
                $("#email").parent().css({"border-color": "#FD0004", "border-width": "1px", "border-style": "solid"});
                count++;
            }
        }else{
            $("#email").parent().css({"border-color": "#FD0004", "border-width": "1px", "border-style": "solid"});
            count++;
        }


        if (count == 0){
            show_loader();
            axios.post(BaseUrl + '/api/create-venue-user',data)
                .then(res => {
                    show_loader(true);
                    if (res.data.message === "success") {
                        this.userPopupRef.style.display = "none";
                        NotificationManager.success("User created successfully.", 'Success',1500);
                    } else if (res.data.message ==="already_exist" ) {
                        NotificationManager.warning("User already exist.", 'Warning',1500);
                    } else {
                        NotificationManager.error("Error occurred while creating user.", 'Error',1500);
                    }

                }).catch((err) => {
                NotificationManager.error("Error occurred while saving.", 'Error',1500);
                show_loader(true);
            });
        }
    };
    cancelUserPopup = () => {
        this.userPopupRef.style.display = "none";
    };
    componentDidMount = () => {
        $("body").on("change","#select_level",function(e){
            var level_id  = $(this).val();
            show_loader();
            axios.post(BaseUrl + '/api/get-user-role',{level_id: level_id, company_id:CompanyID,venue_id:VenueID})
                .then(res => {
                    show_loader();
                    $("#select_role").html('');
                    var vhtml = "<option value=''>Select Role</option>";
                    $("#select_role").append(vhtml);
                    $.each(res.data,function(key,value){
                        var html = "<option value="+value.id+">"+value.name+"</option>";
                        $("#select_role").append(html);

                    });


                }).catch((err) => {
                show_loader();
                /*NotificationManager.error("Error occurred while getting Bussiness Stores .", 'Error');*/
            });


        });
        this.loadCommentsFromServer();

    };//--- End of componentDidMount() ---//

    componentWillUnmount = () => {
        $("body").find('#select_level').off('click');
        $("body").find('#select_level').unbind('click.mynamespace');
    };


    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        this.setState({offset: offset}, () => {
            this.loadCommentsFromServer();
        });
    };

    /**
     * search Segment
     * @param e
     */
    searchGridData = (e) => {
        this.setState({searchValue:e.target.value,offset: 0,perPage:this.state.perPage}, () => {
           // this.loadCommentsFromServer();
        });
    };//--- End of searchGridData()  ---//

    startSearchGridData = () => {
        this.loadCommentsFromServer();
    };//--- End of searchGridData()  ---//

    render() {
        return (
            <React.Fragment>
                    <div className="dropSegmentation_section" id="v_acc" >

                <div className="dropSegmentation_heading clearfix">
                    <h3>Site Accounts</h3>
                </div>

                <div className="venueInfo_div">
                    <div className="venueIdentification_section">
                        <p>Create Site user accounts.
                        </p>
                        <div className="venueAcc_information">
                            <div className="venueAcc_search_addVenue clearfix">
                                <div className="venueAcc_search">
                                    <div className="searchCompaign clearfix">
                                        <input  placeholder="Search Venue" defaultValue="" className="copmpaignSearch_field" onChange={this.searchGridData}  type="text" />
                                        <input  className="copmpaignIcon_field" onClick={this.startSearchGridData} style={{textIndent:"-99px"}} type="submit" />
                                    </div>
                                </div>
                                <a  style={{cursor:'pointer'}} onClick={this.addNewUser}  className="add_new_venue_user">Add New User</a>
                            </div>
                            <div className="accVenue_listing">
                                <div className="cL_listing_tableInn">
                                    <div className="cL_listing_tableTitle">
                                        <div className="cL_listing_table_row">
                                            <div className="cL_listing_table_cell cell1">
                                                <strong>
                                                    <span>
                                                        <b onClick={() => this.handleSortingOrder('first_name', 'asc')} className={(this.state.order_by === 'first_name' && this.state.orderType === 'asc') ? 'choseSegmnt' : ''}>
                                                            <img src={(this.state.order_by === 'first_name' && this.state.orderType === 'asc') ? 'assets/images/sortAerrow_top_active.png' : 'assets/images/sortAerrow_top.png'} alt="#"/>
                                                        </b>
                                                        <b onClick={() => this.handleSortingOrder('first_name', 'DESC')} className={(this.state.order_by === 'first_name' && this.state.orderType === 'DESC') ? 'choseSegmnt' : ''}>
                                                            <img src={(this.state.order_by === 'first_name' && this.state.orderType === 'DESC') ? 'assets/images/sortAerrow_bottom_active.png' : 'assets/images/sortAerrow_bottom.png'} alt="#"/>
                                                        </b>
                                                    </span>
                                                    First Name
                                                </strong>
                                            </div>

                                            <div className="cL_listing_table_cell cell2">
                                                <strong>
                                                    <span>
                                                        <b onClick={() => this.handleSortingOrder('last_name', 'asc')} className={(this.state.order_by === 'last_name' && this.state.orderType === 'asc') ? 'choseSegmnt' : ''}>
                                                            <img src={(this.state.order_by === 'last_name' && this.state.orderType === 'asc') ? 'assets/images/sortAerrow_top_active.png' : 'assets/images/sortAerrow_top.png'} alt="#"/>
                                                        </b>
                                                        <b onClick={() => this.handleSortingOrder('last_name', 'DESC')} className={(this.state.order_by === 'last_name' && this.state.orderType === 'DESC') ? 'choseSegmnt' : ''}>
                                                            <img src={(this.state.order_by === 'last_name' && this.state.orderType === 'DESC') ? 'assets/images/sortAerrow_bottom_active.png' : 'assets/images/sortAerrow_bottom.png'} alt="#"/>
                                                        </b>
                                                    </span>
                                                    Last Name
                                                </strong>
                                            </div>
                                            <div className="cL_listing_table_cell cell7">
                                                <strong>
                                                    <span>
                                                        <b onClick={() => this.handleSortingOrder('email', 'asc')} className={(this.state.order_by === 'email' && this.state.orderType === 'asc') ? 'choseSegmnt' : ''}>
                                                            <img src={(this.state.order_by === 'email' && this.state.orderType === 'asc') ? 'assets/images/sortAerrow_top_active.png' : 'assets/images/sortAerrow_top.png'} alt="#"/>
                                                        </b>
                                                        <b onClick={() => this.handleSortingOrder('email', 'DESC')} className={(this.state.order_by === 'email' && this.state.orderType === 'DESC') ? 'choseSegmnt' : ''}>
                                                            <img src={(this.state.order_by === 'email' && this.state.orderType === 'DESC') ? 'assets/images/sortAerrow_bottom_active.png' : 'assets/images/sortAerrow_bottom.png'} alt="#"/>
                                                        </b>
                                                    </span>
                                                    Email Address
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                    <ul>
                                        {this.state.listData.map((item,index) =>
                                                <li className="" key={index}>
                                                    <div className="cL_listing_table_row">
                                                        <div className="cL_listing_table_cell cell1"> <span className="cL_rowList_number">{item.first_name}</span> </div>
                                                        <div className="cL_listing_table_cell cell2">
                                                            <span className="cL_rowList_number">{item.last_name}</span>
                                                        </div>
                                                        <div className="clEditDotes_cell cell7 clearfix"> <span className="cL_rowList_number" style={{marginTop:'5px'}}><a  style={{cursor:'pointer'}}>{item.email}</a></span> <a className="cl_tableRow_editDotes_1"  style={{cursor:'pointer'}}><i></i></a> </div>
                                                    </div>
                                                    <div className="cl_rowEdit_popOut">
                                                        <div className="cl_rowEdit_pop_table">
                                                            <div className="cl_rowEdit_popOut_tableRow">
                                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1"> <a className="cl_rowEdit_popOut_campaign_view"  style={{cursor:'pointer'}}> <strong><i>&nbsp;</i>View</strong></a> </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                <div className = "popups_outer addNewUser_popup" ref={(ref)=>{this.userPopupRef = ref;}}>
                    <div className="popups_inner">
                        <div className="overley_popup" data-attr="addNewUser_popup"></div>
                        <div className="popupDiv2">
                            <div className="popupDiv_detail">
                                <div className="popup_heading clearfix">
                                    <h3>ADD NEW USER</h3>
                                    <a  style={{cursor:'pointer'}} data-attr="addNewUser_popup" className="popupClose">&nbsp;</a>
                                </div>
                                <div className="beacon_popupDeatail"> <br /><br />
                                    <div className="beacon_popup_form">
                                        <div className="venueIdentification_form">
                                            <ul>
                                                <li>
                                                    <label>First Name</label>
                                                    <div className="customInput_div"><input  id="first_name" placeholder="First Name" type="text" /></div>
                                                </li>
                                                <li>
                                                    <label>Last Name</label>
                                                    <div className="customInput_div"><input  id="last_name" placeholder="Last Name" type="text" /></div>
                                                </li>
                                                <li>
                                                    <label>Email</label>
                                                    <div className="customInput_div"><input  id="email" placeholder="Email" type="text" /></div>
                                                </li>
                                                <li>
                                                    <label>Levels</label>
                                                    <div className="customInput_div">
                                                        <select id="select_level">
                                                            <option value={0} >Select Level</option>
                                                            {ReactHtmlParser(this.state.levels)}
                                                        </select>
                                                    </div>
                                                </li>
                                                <li>
                                                    <label>Role</label>
                                                    <div className="customInput_div">
                                                        <select id="select_role"></select>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="continueCancel place_beacon createUserButtons">
                                        <input onClick={this.saveVenueUser} className="selecCompaignBttn save_venue_user" defaultValue="SAVE" type="submit" />
                                        <a  style={{cursor:'pointer'}} onClick={this.cancelUserPopup} id="cancel_user_popup">CANCEL</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of VenueAccountUsers.

VenueAccountUsers.propTypes = {};

export default VenueAccountUsers;