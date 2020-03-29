import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NotificationManager} from "react-notifications";
import VenueAccountUsers from "../venue/VenueAccountUsers";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import ReactPaginate from 'react-paginate';
import EmptyPage from "../../EmptyPage";

class NewsCategory extends Component {
    NewsCatPopup = null; categoryName = null; saveCategoryBtn = null;
    constructor(props) {
        super(props);
        this.state = {
            is_edit : 0,
            deleteNewsCategory:0,
            category_name : "",
            listNewsCategories       :[],
            offset: 0,
            perPage:PerPage,
            searchValue:'',
            order_by:'news_category_name',
            orderType:'asc',
        };
    }//..... end of constructor() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    openPopup = () => {
        this.setState(()=>({is_edit : 0,category_name:""}),()=>{
            this.NewsCatPopup.style.display = "block";
            this.categoryName.value = "";
            this.saveCategoryBtn.classList.add("disabled");
        },()=>{
            this.validation();
        });

    };

    validation = () => {
      if(this.state.category_name == "")
          this.saveCategoryBtn.classList.add("disabled");
      else
          this.saveCategoryBtn.classList.remove("disabled");
    };

    closePopup = () => {
        this.NewsCatPopup.style.display = "none";
    };

    componentDidMount = () => {
      this.loadNewsCategories();
    };

    loadNewsCategories = () => {
        axios.post(BaseUrl + '/api/get-news-category',{'order_by':this.state.order_by,'orderData':this.state.orderType,'limit': this.state.perPage, 'offset': this.state.offset,'nameSearch':this.state.searchValue,company_id: CompanyID,venue_id:VenueID})
            .then(res => {
                this.setState(()=>({listNewsCategories:res.data.data,pageCount:(res.data.total)/this.state.perPage}));
            }).catch((err) => {
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

    handleChange = (obj) => {
        this.setState(()=>(obj),()=>{
            this.validation();
        });

    };

    saveNewsCategory = () => {
        show_loader();
        axios.post(BaseUrl + '/api/save-news-category',{...this.state, venue_id: VenueID, company_id: CompanyID})
            .then(res => {
                this.categoryName.value = "";
                this.setState(()=>({
                    is_edit : 0,
                    category_name : ""
                }),()=>{
                    this.closePopup();
                    this.loadNewsCategories();
                });
                show_loader();
                NotificationManager.success(res.data.message, 'Success');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while adding News Category .", 'Error');
        });
    };

    deleteNewsCategory = (newsCategoryId) => {
        this.setState(() => ({deleteNewsCategory: newsCategoryId}));
    };

    handleCloseModal = () => {
        this.setState(() => ({deleteNewsCategory: 0}));
    };

    handleDelete = () => {
        let newsCatID = this.state.deleteNewsCategory;
        this.setState({deleteNewsCategory: 0});
        show_loader();
        axios.delete(`${BaseUrl}/api/delete-news-category/${newsCatID}`)
            .then((response) => {
                show_loader();
                if (response.data.status === true){
                    NotificationManager.success(response.data.message, 'Success');
                    this.loadNewsCategories();
                } else
                    NotificationManager.error(response.data.message, 'Error');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDelete() .....//

    editNewsCategory = (value) => {
        this.categoryName.value = value.news_category_name;
        this.setState(()=>({is_edit : value.news_category_id,category_name:value.news_category_name}),()=>{
            this.NewsCatPopup.style.display = "block";
            this.saveCategoryBtn.classList.add("disabled");
        });
    };

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        this.setState({offset: offset}, () => {
            this.loadNewsCategories();
        });
    };

    /**
     * search Segment
     * @param e
     */
    searchNewsCategory = () => {
        this.loadNewsCategories();

    };//--- End of searchGridData()  ---//

    changeOrder = (orderField,order) => {
        this.setState((e)=>({order_by:orderField,orderType:order}),()=>{this.loadVenuesFromServer();});
    };

    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.loadNewsCategories();
        }
    };//--- End of enterPressed() ----//

    render() {
        if(!appPermission("News Category","view")){
            return (
                <EmptyPage/>
            )
        }else{
            return (
                <div>
                    <div className="newVualt_container">
                        <div className="newVualt_container_detail">

                            <div className="newVualt_detail_outer">
                                <div className="newVualt_detail">
                                    <div className="newVualt_heading_with_buttons clearfix">
                                        <div className="newVualt_heading">
                                            <h3>News Categories</h3>
                                        </div>

                                        <div className="backSave_buttons">
                                            <ul>
                                                <li>
                                                    {(appPermission("News Category","add")) && (
                                                        <a  style={{cursor:'pointer'}} className="selecBttn" onClick={()=>{this.openPopup()}}>ADD Category</a>
                                                    )}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="listing_floating_row clearfix">

                                        <div className="grid_searching clearfix">
                                            <ul>
                                                <li>
                                                    <a  style={{cursor:'pointer'}}>&nbsp;</a>
                                                </li>
                                                <li>
                                                    <a  style={{cursor:'pointer'}} className="combined_shape">&nbsp;</a>
                                                </li>
                                                <li className="searching_li">
                                                    <div className="searching clearfix">
                                                        <input type="text"  placeholder="Search " className="searchInput" onChange={(e)=>{this.handleChange({searchValue:e.target.value})}}  onKeyPress={this.enterPressed} />
                                                        <input type="submit" value=""  className="submitInput" onClick={(e)=>{this.searchNewsCategory()}} />
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                    </div>



                                    <div className="category_list_outer">
                                        <div className="cL_listing_tableInn">

                                            <div className="cL_listing_tableTitle">
                                                <div className="cL_listing_table_row">
                                                    <div className="cL_listing_table_cell cell1">
                                                        <strong className=""><span><b>
                                                        <img src="images/sortAerrow_top.png" alt="#" />
                                                       </b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Category Name</strong>
                                                    </div>


                                                    <div className="cL_listing_table_cell cell7 subCategoyCell">
                                                        <strong className="sortHidden"><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span></strong>
                                                    </div>
                                                </div>

                                            </div>


                                            <ul>
                                                {this.state.listNewsCategories && (
                                                    this.state.listNewsCategories.map((value,key)=>{
                                                        return (
                                                            <li key={key}>
                                                                <div className="listDataShowing">
                                                                    <div className="cL_listing_table_row">
                                                                        <div className="cL_listing_table_cell cell1 ">
                                                                        <span className="cL_rowList_number">
                                                                            {value.news_category_name}
                                                                        </span>
                                                                        </div>


                                                                        <div className="clEditDotes_cell cell7_set cell7 subCategoyCell clearfix"> <span className="cL_rowList_number padingLeft55" style={{marginTop:'5px'}}></span> <a className="cl_tableRow_editDotes" onClick={this.handleButtonsShow}  style={{cursor:'pointer'}}><i></i></a> </div>



                                                                    </div>
                                                                    <div className="cl_rowEdit_popOut">
                                                                        <div className="cl_rowEdit_pop_table">
                                                                            <div className="cl_rowEdit_popOut_tableRow">
                                                                                {(appPermission("News Category","edit")) && (
                                                                                    <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1"> <a className="edit_icon"  style={{cursor:'pointer'}} onClick={()=>{this.editNewsCategory(value)}}> <strong><i>&nbsp;</i>Edit</strong></a> </div>
                                                                                )}
                                                                                {(appPermission("News Category","delete")) && (
                                                                                    <div className="cl_rowEdit_popOut_tableRow_cell eidtCell3"> <a className="delete_icon"  style={{cursor:'pointer'}} onClick={()=>{this.deleteNewsCategory(value.news_category_id)}}><strong><i>&nbsp;</i>Delete</strong></a> </div>
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

                    <div className= "popups_outer addNewsCategoryPopup" ref={(ref)=>{this.NewsCatPopup = ref}} style={{display: 'none'}}>
                        <div className="popups_inner">
                            <div className="overley_popup" data-attr="addNewUser_popup" onClick={()=>this.closePopup()}></div>

                            <div className="popupDiv2">
                                <div className="popupDiv_detail">

                                    <div className="popup_heading clearfix">
                                        <h3>ADD NEW Category</h3>
                                        <a  style={{cursor:'pointer'}} data-attr="addNewUser_popup" className="popupClose close_popup" onClick={()=>this.closePopup()}>&nbsp;</a>
                                    </div>


                                    <div className="beacon_popupDeatail"> <br /><br />
                                        <div className="beacon_popup_form">

                                            <div className="venueIdentification_form">
                                                <ul>
                                                    <li>
                                                        <label>Category Name</label>
                                                        <div className="customInput_div">
                                                            <input ref={(ref)=>{this.categoryName = ref}} defaultValue={this.state.category_name} onChange={(e)=>this.handleChange({category_name:e.target.value})} id="category_name"  placeholder="Category Name" type="text" />
                                                        </div>
                                                    </li>

                                                </ul>
                                            </div>
                                        </div>

                                        <div className="continueCancel place_beacon createUserButtons">
                                            <input ref={(ref)=>{this.saveCategoryBtn = ref;}} className="disabled selecCompaignBttn save_category" value="SAVE" type="submit" onClick={(e)=>{this.saveNewsCategory()}} />
                                            <a  style={{cursor:'pointer'}} className="close_popup" onClick={()=>this.closePopup()}>CANCEL</a>
                                        </div>

                                    </div>




                                </div>
                            </div>
                        </div>
                    </div>

                    <ConfirmationModal isOpen={!!this.state.deleteNewsCategory} handleCloseModal={this.handleCloseModal} text={'News Category'} handleDeleteItem={this.handleDelete}/>
                </div>
            );
        }

    }//..... end of render() .....//
}//..... end of Shop.

NewsCategory.propTypes = {};

export default NewsCategory;