import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NotificationManager} from "react-notifications";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import ReactPaginate from 'react-paginate';

class VenueCategory extends Component {
    categoryPopup = null; categoryCancel = null; saveCategoryButton = null;

    constructor(props) {
        super(props);
        this.state = {
            is_edit : 0,
            category_name : "",
            deleteVenueCategoryID : 0,
            category_description : "",
            category_image:"",
            listAllVenues           :[],
            listVenues           :[],
            assignedVenues       :[],
            listCategories       :[],
            offset: 0,
            perPage:PerPage,
            searchValue:'',
            order_by:'name',
            orderType:'asc',
        };
    }//..... end of constructor() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    componentDidMount = () => {
        let $this = this;
        $("body").on("change","#fileToUpload2",function(e){
            $this.readURL(this);
            $this.validation();
        });
      this.getCompanyVenues();
      this.getCategories();
    };

    validation = () => {
        if(this.state.category_name == "" || this.state.category_description == "" || this.state.assignedVenues.length ==0){
            this.saveCategoryButton.classList.add("disabled");
        }else{
            this.saveCategoryButton.classList.remove("disabled");
        }
    };

    readURL = (input) => {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                // $('.image_notify_upload_area').hide();
                $('#blah2').show();
                $('#blah2').attr('src', e.target.result);
                var image = new Image();
                image.src = e.target.result;
                image.onload = function () {
                    var maxWidth = 300;
                    var maxHeight = 150;
                    $('#blah2').css("height", maxHeight);
                    $('#blah2').css("width", maxWidth);
                    $('#blah2').attr('src', image.src);
                    $('#blah2').css("display", 'block');
                    $('#blah2').css("margin", 'auto');

                };

            }
            reader.readAsDataURL(input.files[0]);
        }
    };

    componentWillUnmount = () => {
        $("body").find('#fileToUpload2').off('change');
        $("body").find('#fileToUpload2').unbind('change.mynamespace');
    };

    handleChange = (obj) => {
        this.setState(()=>(obj),()=>{
            this.validation();
        });

    };

    getCompanyVenues = () => {
        show_loader();
        axios.post(BaseUrl + '/api/get-company-venues',{company_id: CompanyID})
            .then(res => {
                this.setState(()=>({listVenues:res.data.data,listAllVenues:res.data.data}));
                show_loader();
            }).catch((err) => {
            show_loader();
            /*NotificationManager.error("Error occurred while getting Bussiness Stores .", 'Error');*/
        });
    };

    getCategories = () => {
        show_loader();
        axios.post(BaseUrl + '/api/get-venue-category',{'order_by':this.state.order_by,'orderData':this.state.orderType,'limit': this.state.perPage, 'offset': this.state.offset,'nameSearch':this.state.searchValue,company_id: CompanyID})
            .then(res => {
                this.setState(()=>({listCategories:res.data.data,pageCount:(res.data.total)/this.state.perPage}));
                show_loader();
            }).catch((err) => {
            show_loader();
            /*NotificationManager.error("Error occurred while getting Bussiness Stores .", 'Error');*/
        });
    };

    addNewCategory = () => {
        this.getCompanyVenues();
        this.setState(()=>(
            this.state = {
                is_edit : 0,
                category_name : "",
                deleteVenueCategoryID : 0,
                category_description : "",
                assignedVenues       :[]

            }
        ),()=>{
            this.formReset();
            this.categoryPopup.style.display = "block";
            this.saveCategoryButton.classList.add("disabled");
        });

    };

    closePopup = () => {
        this.categoryPopup.style.display = "none";
        this.formReset();
    };

    saveCategory = () => {
        show_loader();
        let image = $('#fileToUpload2')[0].files[0];
        var data = new FormData();
        if(image !== undefined){
            data.append('image', $('#fileToUpload2')[0].files[0]);
        }
        data.append('is_edit', this.state.is_edit);
        data.append('category_name', this.state.category_name);
        data.append('category_description', this.state.category_description);
        data.append('assignedVenues', JSON.stringify(this.state.assignedVenues));
        data.append('venue_id', VenueID);
        data.append('company_id', CompanyID);

        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        axios.post(BaseUrl + '/api/save-venue-category',data,config)
            .then(res => {
                this.setState(()=>({
                    is_edit : 0,
                    category_name : "",
                    company_id    : CompanyID,
                    category_description : "",
                    assignedVenues       :[]
                }));
                this.getCategories();
                this.closePopup();
                this.formReset();
                show_loader();
                NotificationManager.success(res.data.message, 'Success');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while adding Category .", 'Error');
        });
    };

    formReset = () => {
        $('#fileToUpload2').val("");
        $('#blah2').attr('src', '');
        $('#blah2').hide();
    };

    assignVenues = (value) => {
        var id = value.id;
        let listVenues = this.state.listVenues.filter(function(el) {
            return el.id !== id;
        });
        this.setState(prevState => ({
            assignedVenues: [...prevState.assignedVenues, value],listVenues:listVenues
        }),()=>{
            this.validation();
        });
    };

    removeVenue = (value) => {
        var id = value.id;
        var assignVenues = this.state.assignedVenues.filter(function(el) {
            return el.id !== id;
        });
        this.setState(prevState => ({
            listVenues: [...prevState.listVenues, value],assignedVenues:assignVenues
        }),()=>{
            this.validation();
        });
    };

    refreshVenues =  () => {
        this.getCompanyVenues();
        this.setState(()=>({assignedVenues:[]}),()=>{
            this.validation();
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

    deleteVenueCategory = (value) => {
        this.setState(() => ({deleteVenueCategoryID: value.id}));
    };

    handleCloseModal = () => {
        this.setState(() => ({deleteVenueCategoryID: 0}));
    };

    handleDelete = () => {
        let venueCatID = this.state.deleteVenueCategoryID;
        this.setState({deleteVenueCategoryID: 0});
        show_loader();
        axios.delete(`${BaseUrl}/api/delete-venue-category/${venueCatID}`)
            .then((response) => {
                show_loader();
                if (response.data.status === true){
                    NotificationManager.success(response.data.message, 'Success');
                    this.getCategories();
                } else
                    NotificationManager.error(response.data.message, 'Error');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDelete() .....//

    editVenueCategory = (value) => {
        this.saveCategoryButton.classList.add("disabled");
        //---------   remove assign venue from list venues  --- //
        var listVenues = this.state.listAllVenues;
         value.listAssignVenues.map((value,key)=>{
             listVenues = listVenues.filter(function(el) {
                 return el.id !== value.id;
             });
         });
         //----- end of code  ----//

        this.setState(()=>(
            {
                is_edit        : value.id,
                assignedVenues : value.listAssignVenues,
                listVenues : listVenues,
                category_name : value.name,
                category_description : value.description,
                category_image : BaseUrl+"/venue_category/"+value.image


            }
            ),()=>{
            this.categoryPopup.style.display = "block";
            $('#blah2').show();
            $('#blah2').attr('src', this.state.category_image);

        });
    };

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        this.setState({offset: offset}, () => {
            this.getCategories();
        });
    };

    /**
     * search Segment
     * @param e
     */
    searchCategory = () => {
        this.getCategories();

    };//--- End of searchGridData()  ---//

    changeOrder = (orderField,order) => {
        this.setState((e)=>({order_by:orderField,orderType:order}),()=>{this.loadVenuesFromServer();});
    };

    setEditCategoryData = (category_id,item) => {
        this.props.setEditCategoryData(category_id,item,"venue/addVenue");

    };

    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.getCategories();
        }
    };//--- End of enterPressed() ----//


    render() {
        return (
            <div>
                <div className="compaignHeadigs">
                    <h1>Venue Categories</h1>
                </div>

                <div className="compaigns_list_content">
                    <div className="compaigns_list_detail">

                        <div className="cL_listing_tableOut memberTable">

                            <div className="compaign_select_search clearfix">


                                <div className="searchCompaign clearfix">
                                    <input type="text"  placeholder="Search Member" onChange={(e)=>{this.handleChange({searchValue:e.target.value})}} onKeyPress={this.enterPressed}  className="copmpaignSearch_field" />
                                    <input type="submit" style={{textIndent:"-99px"}}  className="copmpaignIcon_field" onClick={(e)=>{this.searchCategory()}}  />
                                </div>
                            </div>

                            <div className="compaign_addNew clearfix">
                                <h3>ALL Categories</h3>
                                {(appPermission("Venue Category","add")) && (
                                    <a  style={{cursor:'pointer'}} className="all_blue_button" onClick={(e)=>{ this.props.createNewCategory() }}>Add New Category</a>
                                )}
                            </div>
                            <div className="cL_listing_tableInn venueTable_cells_setting">

                                <div className="cL_listing_tableTitle">
                                    <div className="cL_listing_table_row">
                                        <div className="cL_listing_table_cell cell1">
                                            <strong><span><b><img  src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img  src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Image</strong>
                                        </div>
                                        <div className="cL_listing_table_cell cell2">
                                            <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img  src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Name</strong>
                                        </div>
                                        <div className="cL_listing_table_cell cell3">
                                            <strong><span><b><img  src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img  src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Descriptions</strong>
                                        </div>
                                    {/*    <div className="cL_listing_table_cell cell4">
                                            <strong><span><b><img  src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img  src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Assign Venues</strong>
                                        </div>
*/}
                                        <div className="cL_listing_table_cell cell6">
                                            <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Date Added</strong>
                                        </div>
                                    </div>

                                </div>


                                <ul>
                                    {this.state.listCategories && (
                                        this.state.listCategories.map((value,key)=>{
                                            return (
                                                <li key={key}>

                                                    <div className="listDataShowing">
                                                        <div className="cL_listing_table_row">
                                                            <div className="cL_listing_table_cell cell1 imgCol">
                                                                <span className="cL_rowList_number padingLeft0"><img src={BaseUrl+"/venue_category/"+value.image} alt="#" className="profile_img" /></span>
                                                            </div>
                                                            <div className="cL_listing_table_cell cell2">

                                                                <span className="cL_rowList_number">{value.name}</span>
                                                            </div>
                                                            <div className="cL_listing_table_cell cell3">
                                                                <span className="cL_rowList_number">{value.description}</span>
                                                            </div>

                                                      {/*      <div className="cL_listing_table_cell cell4">
                                                                <span className="cL_rowList_number">
                                                                    {(value.category_shops !="" || value.category_shops != NULL) && (

                                                                            JSON.parse(value.category_shops).map((value1,key1)=>{
                                                                                return (
                                                                                    <strong key={key1} className="news_owner" >{value1.business_name}</strong>
                                                                                )
                                                                            })

                                                                    )}


                                                                </span>
                                                            </div>

*/}
                                                            <div className="clEditDotes_cell cell6 clearfix"> <span className="cL_rowList_number" style={{marginTop:'5px'}}>{value.created_at}</span> <a className="cl_tableRow_editDotes" onClick={this.handleButtonsShow}  style={{cursor:'pointer'}}><i></i></a> </div>


                                                        </div>

                                                        <div className="cl_rowEdit_popOut">
                                                            <div className="cl_rowEdit_pop_table">
                                                                <div className="cl_rowEdit_popOut_tableRow">

                                                                    {/*<div className="cl_rowEdit_popOut_tableRow_cell eidtCell1"> <a className="edit_icon"  style={{cursor:'pointer'}} onClick={()=>{this.editVenueCategory(value)}}> <strong><i>&nbsp;</i>Edit</strong></a> </div>*/}
                                                                    {(appPermission("Venue Category","edit")) && (
                                                                    <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1"> <a className="edit_icon"  style={{cursor:'pointer'}} onClick={()=>{this.setEditCategoryData(value.id,value)}}> <strong><i>&nbsp;</i>Edit</strong></a> </div>
                                                                    )}
                                                                    {(appPermission("Venue Category","delete")) && (
                                                                        <div className="cl_rowEdit_popOut_tableRow_cell eidtCell3"> <a className="delete_icon"  style={{cursor:'pointer'}} onClick={()=>{this.deleteVenueCategory(value)}}><strong><i>&nbsp;</i>Delete</strong></a> </div>
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



                <div ref={(ref)=>(this.categoryPopup = ref)} className="popups_outer addCategory_popup" style={{display:"none"}}>
                    <div className="popups_inner">
                        <div className="overley_popup close_popup" onClick={(e)=>{this.closePopup()}}></div>

                        <div className="popupDiv">
                            <div className="contentDetail">

                                <div className="autoContent">
                                    <div className="compaigns_list_content">
                                        <div className="add_categoryList_info2">
                                            <div className="newVualt_heading">
                                                <h3>Create Shop Category</h3>
                                            </div>

                                            <div className="categoryInfo_container clearfix">
                                                <div className="uploadImg_section">
                                                    <h4>Featured image</h4>

                                                    <div className="uploadImg_section_info">
                                                        <div className="uploadPlaceholder">
                                                            <img id="blah2" style={{display:"none"}} />
                                                                <div className="image_notify_upload_area">
                                                                    <input id="fileToUpload2" name="image" type="file" />
                                                                </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="addCategoryRight_section">
                                                    <div className=" portalNew_page">
                                                        <ul>
                                                            <li>
                                                                <div className="customPlaceholder_outer">
                                                                    <h4>Title</h4>
                                                                    <b className="req_tag">Required</b>
                                                                    <div className="customPlaceholder">
                                                                        <input type="text" onChange={(e)=>this.handleChange({category_name:e.target.value})} value={this.state.category_name} placeholder="Category Name" id="category_name" name="category_name"/>
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
                                                             <textarea placeholder="Placeholder" value={this.state.category_description} onChange={(e)=>this.handleChange({category_description:e.target.value})} id="category_description" name="category_description"></textarea>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>


                                                            <li>
                                                                <div className="customPlaceholder_outer">


                                                                    <div className="dragable_sections clearfix">

                                                                        <div className="dragable_sections_columns_outer">
                                                                            <h4>Unassigned Venues</h4>
                                                                            <p>Click on Venues to assign it to this Shop Category.</p>
                                                                            <span className="dragBttn" onClick={(e)=>{this.refreshVenues()}}>&nbsp;</span>
                                                                            <div className="dragable_sections_columns">
                                                                                <ul id="unAssignedVenues">
                                                                                    {this.state.listVenues && (
                                                                                        this.state.listVenues.map((value,key)=>{
                                                                                            return (
                                                                                                <li key={key} value={value.venue_id} onClick={(e)=>{this.assignVenues(value)}} className="checkBusiness">
                                                                                                    <a>{value.venue_name}</a>
                                                                                                </li>
                                                                                            )
                                                                                        })
                                                                                    )}
                                                                                </ul>
                                                                            </div>
                                                                        </div>

                                                                        <div className="dragable_sections_columns_outer frDrag_column">
                                                                            <h4>Assigned Venues</h4>
                                                                            <p>Click on Venues to unassign it to this  Shop Category.</p>

                                                                            <div className="dragable_sections_columns dropable_columns">
                                                                                <ul id="assignedVenues">
                                                                                    {this.state.assignedVenues && (
                                                                                        this.state.assignedVenues.map((value,key)=>{
                                                                                            return (
                                                                                                <li key={key} onClick={(e)=>this.removeVenue(value)}  className="unassignBussiness" id={value.venue_id}><a>{value.venue_name}</a></li>
                                                                                            )
                                                                                        })
                                                                                    )}
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
                                                <a  style={{cursor:'pointer'}} ref={(ref)=>{this.saveCategoryButton = ref;}} className="disabled" id="saveCatData" onClick={(e)=>{this.saveCategory()}}>CONTINUE</a>
                                                <a  style={{cursor:'pointer'}} className="close_popup" onClick={(e)=>{this.closePopup()}}>CANCEL</a>
                                            </div>
                                    </div>

                                </div>


                            </div>


                        </div>


                    </div>
                </div>



                <ConfirmationModal isOpen={!!this.state.deleteVenueCategoryID} handleCloseModal={this.handleCloseModal} text={'News Category'} handleDeleteItem={this.handleDelete}/>



            </div>
        );
    }//..... end of render() .....//
}//..... end of VenueCategory.

VenueCategory.propTypes = {};

export default VenueCategory;