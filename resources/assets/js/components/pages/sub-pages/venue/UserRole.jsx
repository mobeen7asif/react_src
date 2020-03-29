import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import {NotificationManager} from "react-notifications";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import ReactPaginate from 'react-paginate';

class UserRole extends Component {
    rolePopup = null; saveRoleButton = null;
    constructor(props) {
        super(props);
        this.state = {
            is_edit:0,
            listRoles : [],
            company_levels: "",
            role_name : "",
            role_description : "",
            deleteRole : 0,
            assignRoles : [],
            offset: 0,
            perPage:20,
            searchValue:'',
            order_by:'name',
            orderType:'asc',

        };
    }//..... end of constructor() .....//

    validation = () => {
        var single_user_level = [];
        $('ul#listRoles li').each(function () {
            single_user_level.push($(this).attr("id"));
        });
        if(single_user_level.length == 0){
            this.saveRoleButton.classList.add("disabled");
            return false;
        }
        if(this.state.role_name == "" || this.state.role_description == "")
            this.saveRoleButton.classList.add("disabled");
        else
            this.saveRoleButton.classList.remove("disabled");
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    componentDidMount = () => {
        let $this = this;
        $("body").on("click",".list_levels",function(e){
            e.stopImmediatePropagation();
            var id = $(this).attr("id");
            var value = $(this).attr("value");
            $(this).css({'pointer-events':"none",'opacity':"0.2"});
            var html = '<li class="dragVenues removeLevels level4" id="'+id+'" value="'+value+'"><a>'+value+'</a></li>';
            $("#listRoles").append(html);
            $this.validation();
        });

        $("body").on("click",".removeLevels",function(e){
            e.stopImmediatePropagation();
            var id = $(this).attr("id");
            var value = $(this).attr("value");
            $(this).remove();
            $("#"+id).removeAttr("style");
            $this.validation();
        });
      this.getRoles();
    };



    componentWillUnmount = () => {
        $("body").find('.list_levels').off('click');
        $("body").find('.list_levels').unbind('click.mynamespace');
        $("body").find('.removeLevels').off('click');
        $("body").find('.removeLevels').unbind('click.mynamespace');

    };

    handleChange = (obj) => {
        this.setState(()=>(obj),()=>{
            this.validation();
        });
    };

    openPopup = () => {
        $(".list_levels").removeAttr("style");
        $("#listRoles").html('');
        this.saveRoleButton.classList.add("disabled");
        this.setState(()=>({is_edit : 0,role_name:"",role_description:""}),()=>{
            this.rolePopup.style.display = "block";
            this.validation();
        });

    };

    closePopup = () => {
        this.rolePopup.style.display = "none";
    };

    getRoles = () => {
        show_loader();
        axios.post(BaseUrl + '/api/get-users-roles',{'order_by':this.state.order_by,'orderData':this.state.orderType,'limit': this.state.perPage, 'offset': this.state.offset,'nameSearch':this.state.searchValue,company_id: CompanyID,venue_id:VenueID})
            .then(res => {

                this.setState(()=>({listRoles:res.data.roles , company_levels : res.data.roleCompanyLevels,pageCount:(res.data.total)/this.state.perPage}));
                show_loader();
            }).catch((err) => {
            show_loader();
            /*NotificationManager.error("Error occurred while getting Bussiness Stores .", 'Error');*/
        });
    };

    saveRoles = () => {
        var single_user_level = [];
        $('ul#listRoles li').each(function () {
            single_user_level.push($(this).attr("id"));
        });
        show_loader();
        axios.post(BaseUrl + '/api/save-users-roles',{is_edit:this.state.is_edit,single_user_level:single_user_level,description:this.state.role_description,name:this.state.role_name,company_id: CompanyID,venue_id:VenueID})
            .then(res => {
                this.setState(()=>({is_edit:0,role_name:"" , role_description : ""}));
                this.rolePopup.style.display = "none";
                NotificationManager.success(res.data.message, 'Success');
                this.getRoles();
                show_loader();
            }).catch((err) => {
            show_loader();
            /*NotificationManager.error("Error occurred while getting Bussiness Stores .", 'Error');*/
        });

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

    editUserRole = (value) => {
        this.saveRoleButton.classList.add("disabled");
        var assignLevels = value.role_levels;
        this.setState(()=>({is_edit:value.id,role_name : value.name,role_description : value.description}),()=>{
            $("#listRoles").html('');
            $(".list_levels").removeAttr("style");
            this.rolePopup.style.display = "block";
            $.each(value.role_levels,function(key,value){
                $("#"+value.tree_id).css({'pointer-events':"none",'opacity':"0.2"});
                var html = '<li class="dragVenues removeLevels level4" id="'+value.tree_id+'" value="'+value.level_name+'"><a>'+value.level_name+'</a></li>';
                $("#listRoles").append(html);

            });
        });

    };

    deleteRole = (roleID) => {
        this.setState(() => ({deleteRole: roleID}));
    };

    handleCloseModal = () => {
        this.setState(() => ({deleteRole: 0}));
    };

    handleDelete = () => {
        let roleID = this.state.deleteRole;
        this.setState({deleteRole: 0});
        show_loader();
        axios.delete(`${BaseUrl}/api/delete-user-role/${roleID}`)
            .then((response) => {
                show_loader();
                if (response.data.status === true){
                    NotificationManager.success(response.data.message, 'Success');
                    this.getRoles();
                } else
                    NotificationManager.error(response.data.message, 'Error');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDelete() .....//


    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        this.setState({offset: offset}, () => {
            this.getRoles();
        });
    };

    /**
     * search Segment
     * @param e
     */
    searchRole = () => {
            this.getRoles();

    };//--- End of searchGridData()  ---//

    changeOrder = (orderField,order) => {
        this.setState((e)=>({order_by:orderField,orderType:order}),()=>{this.loadVenuesFromServer();});
    };
    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.getRoles();
        }
    };//--- End of enterPressed() ----//
    render() {
        return (
            <div>
                <div className="newVualt_container">
                    <div className="newVualt_container_detail">

                        <div className="newVualt_detail_outer">
                            <div className="newVualt_detail">
                                <div className="newVualt_heading_with_buttons clearfix">
                                    <div className="newVualt_heading">
                                        <h3>Roles </h3>
                                    </div>

                                    <div className="backSave_buttons ">
                                        <ul>
                                            <li>
                                                {(appPermission("User Role","add")) && (
                                                    <a  style={{cursor:'pointer'}} className="selecBttn" onClick={()=>{this.openPopup()}}>ADD New Role</a>
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="listing_floating_row newFloatingRow clearfix">





                                    <div className="grid_searching clearfix">
                                        <ul>

                                            <li className="searching_li">
                                                <div className="searching clearfix">
                                                    <input type="text" value={this.state.searchValue} placeholder="Search " className="searchInput" onKeyPress={this.enterPressed}  onChange={(e)=>{this.handleChange({searchValue:e.target.value})}} />
                                                    <input type="submit" value=""  className="submitInput" onClick={()=>{this.searchRole()}} />
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                </div>



                                <div className="category_list_outer ">
                                    <div className="cL_listing_tableInn">

                                        <div className="cL_listing_tableTitle">
                                            <div className="cL_listing_table_row">

                                                <div className="cL_listing_table_cell cell1  ">
                                                    <strong className=""><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Name</strong>
                                                </div>
                                                <div className="cL_listing_table_cell cell1  ">
                                                    <strong className=""><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Descriptions</strong>
                                                </div>

                                                <div className="cL_listing_table_cell cell7 ">
                                                    <strong className=""><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Levels</strong>
                                                </div>
                                            </div>

                                        </div>


                                        <ul>
                                            {this.state.listRoles && (
                                                this.state.listRoles.map((value,key)=>{
                                                    return (
                                                        <li key={key}>
                                                            <div className="listDataShowing">
                                                                <div className="cL_listing_table_row news_col_setting">


                                                                    <div className="cL_listing_table_cell cell1  ">
                                                                            <span className="cL_rowList_number">
                                                                                {value.name}
                                                                            </span>
                                                                    </div>
                                                                    <div className="cL_listing_table_cell cell1  ">
                                                                        <span className="cL_rowList_number ">
                                                                            {value.description}
                                                                        </span>
                                                                    </div>

                                                                    <div className="clEditDotes_cell cell_span  cell7  clearfix"> <span className="cL_rowList_number padingLeft25" style={{marginTop:'7px'}}>
                                                                        { value.role_levels && (
                                                                            value.role_levels.map((value2,key2)=>{

                                                                                return (
                                                                                    <strong key={key2} className="news_owner">{value2 === null ? '' : value2.level_name}</strong>
                                                                                )
                                                                            })
                                                                        )}

                                                                    </span> <a className="cl_tableRow_editDotes"  style={{cursor:'pointer'}} onClick={this.handleButtonsShow}><i></i></a> </div>



                                                                </div>
                                                                <div className="cl_rowEdit_popOut">
                                                                    <div className="cl_rowEdit_pop_table">
                                                                        <div className="cl_rowEdit_popOut_tableRow">
                                                                            {(appPermission("User Role","edit")) && (
                                                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1"> <a className="edit_icon"  style={{cursor:'pointer'}}  tabIndex="-1" onClick={()=>{this.editUserRole(value)}} > <strong><i>&nbsp;</i>Edit</strong></a> </div>
                                                                            )}
                                                                            {(appPermission("User Role","delete")) && (
                                                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell3"> <a className="delete_icon"  style={{cursor:'pointer'}}  tabIndex="-1" onClick={()=>{this.deleteRole(value.id)}} ><strong><i>&nbsp;</i>Delete</strong></a> </div>
                                                                            )}

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </li>
                                                    )
                                                })
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

                </div>





                <div className= "popups_outer addRolePopup" ref={(ref)=>{this.rolePopup = ref}} style={{display:"none"}}>
                    <div className="popups_inner">
                        <div className="overley_popup close_role_popup" onClick={()=>{this.closePopup()}}></div>

                        <div className="popupDiv">
                            <div className="contentDetail" style={{padding:'30px'}}>

                                <div className="autoContent">
                                    <div className="compaigns_list_content">
                                        <div className="add_categoryList_info2">
                                            <div className="newVualt_heading">
                                                <h3>Create Role</h3>
                                            </div>

                                            <div className="categoryInfo_container clearfix">


                                                <div className="addCategoryRight_section">
                                                    <div className="addCategory_formSection portalNew_page">
                                                        <ul>
                                                            <li>
                                                                <div className="customPlaceholder_outer">
                                                                    <h4>Name</h4>
                                                                    <b className="req_tag">Required</b>
                                                                    <div className="customPlaceholder">
                                                                        <input type="text" value={this.state.role_name} onChange={(e)=>{this.handleChange({role_name:e.target.value})}} placeholder="Placeholder" id="role_name" name="role_name"/>
                                                                    </div>
                                                                </div>
                                                            </li>


                                                            <li>
                                                                <div className="customPlaceholder_outer">
                                                                    <h4>Description</h4>
                                                                    <b className="req_tag">Required</b>
                                                                    <div className="edittor_column">
                                                                        <div className="edittor_column_head"></div>

                                                                        <div className="edittor_column_area">
                                                    <textarea placeholder="Placeholder" onChange={(e)=>{this.handleChange({role_description:e.target.value})}} value={this.state.role_description} id="role_description"  name="role_description"></textarea>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>


                                                            <li>
                                                                <div className="customPlaceholder_outer">


                                                                    <div className="dragable_sections clearfix">

                                                                        <div className="dragable_sections_columns_outer">
                                                                            <h4>Unasigned Levels</h4>
                                                                            <p>Click on level to assign it to this role.</p>
                                                                            <span className="dragBttn">&nbsp;</span>
                                                                            <div className="dragable_sections_columns draggable_columns">
                                                                                <ul>

                                                                                    {ReactHtmlParser(this.state.company_levels)}

                                                                                </ul>
                                                                            </div>
                                                                        </div>

                                                                        <div className="dragable_sections_columns_outer frDrag_column">
                                                                            <h4>Assigned Levels</h4>
                                                                            <p>Click on level to unassign it to this role.</p>

                                                                            <div className="dragable_sections_columns dropable_columns">
                                                                                <ul id="listRoles">

                                                                                </ul>
                                                                            </div>
                                                                        </div>


                                                                    </div>
                                                                </div>
                                                            </li>


                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <br />
                                            <div className="continueCancel  listShops">
                                                <a  style={{cursor:'pointer'}}  id="saveRoleData" className={"disabled"} ref={(ref)=>{this.saveRoleButton = ref;}} onClick={(e)=>{this.saveRoles()}}>CONTINUE</a>
                                                <a  style={{cursor:'pointer'}} className="close_role_popup" onClick={()=>{this.closePopup()}}>CANCEL</a>
                                            </div>
                                    </div>

                                </div>


                            </div>


                        </div>


                    </div>
                </div>


                <ConfirmationModal isOpen={!!this.state.deleteRole} handleCloseModal={this.handleCloseModal} text={'User Role'} handleDeleteItem={this.handleDelete}/>
                
                
                
                
                
                
                
            </div>
        );
    }//..... end of render() .....//
}//..... end of UserRole.

UserRole.propTypes = {};

export default UserRole;