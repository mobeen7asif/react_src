import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import ReactPaginate from 'react-paginate';

class QuickBoardLevels extends Component {
    NewsCatPopup = null; saveCategoryBtn = null;
    constructor(props) {
        super(props);
        this.state = {
            is_edit : 0,
            deleteQbLevel:0,
            level_name : "",
            level_order : 1,
            listNewsCategories       :[],
            offset: 0,
            perPage:PerPage,
            searchValue:'',
            order_by:'level_name',
            orderType:'asc',
        };
    }//..... end of constructor() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    openPopup = () => {
        this.setState(()=>({is_edit : 0,level_name:"",level_order:1}),()=>{
            this.NewsCatPopup.style.display = "block";
            this.saveCategoryBtn.classList.add("disabled");
        },()=>{
            this.validation();
        });

    };

    validation = () => {
        if(this.state.level_name == "" || this.state.level_order == "")
            this.saveCategoryBtn.classList.add("disabled");
        else
            this.saveCategoryBtn.classList.remove("disabled");
    };

    closePopup = () => {
        this.NewsCatPopup.style.display = "none";
    };

    componentDidMount = () => {
        this.loadQuickBoardLevels();
    };

    loadQuickBoardLevels = () => {
        axios.post(BaseUrl + '/api/get-quick-board-levels',{'order_by':this.state.order_by,'orderData':this.state.orderType,'limit': this.state.perPage, 'offset': this.state.offset,'nameSearch':this.state.searchValue,company_id: CompanyID,venue_id:VenueID})
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

    SaveLevel = () => {
        show_loader();
        axios.post(BaseUrl + '/api/save-quick-board-level',{...this.state, venue_id: VenueID, company_id: CompanyID})
            .then(res => {
                if(res.data.status =="exist"){
                    NotificationManager.error(res.data.message, 'Error');
                    show_loader();
                    return false;
                }
                this.setState(()=>({
                    is_edit : 0,
                    level_name : "",
                    level_order : 1
                }),()=>{
                    this.closePopup();
                    this.loadQuickBoardLevels();
                });
                show_loader();
                NotificationManager.success(res.data.message, 'Success');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while adding Quick Board Level .", 'Error');
        });
    };

    deleteLevel = (id) => {
        this.setState(() => ({deleteQbLevel: id}));
    };

    handleCloseModal = () => {
        this.setState(() => ({deleteQbLevel: 0}));
    };

    handleDelete = () => {
        let newsCatID = this.state.deleteQbLevel;
        this.setState({deleteQbLevel: 0});
        show_loader();
        axios.delete(`${BaseUrl}/api/delete-qb-level/${newsCatID}`)
            .then((response) => {
                show_loader();
                if (response.data.status === true){
                    NotificationManager.success(response.data.message, 'Success');
                    this.loadQuickBoardLevels();
                } else
                    NotificationManager.error(response.data.message, 'Error');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDelete() .....//

    editLevel = (value) => {

        this.setState(()=>({is_edit : value.id,level_name:value.level_name,level_order:value.level_order}),()=>{
            this.NewsCatPopup.style.display = "block";
            this.saveCategoryBtn.classList.add("disabled");
        });
    };

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        this.setState({offset: offset}, () => {
            this.loadQuickBoardLevels();
        });
    };

    /**
     * search Segment
     * @param e
     */
    searchNewsCategory = () => {
        this.loadQuickBoardLevels();

    };//--- End of searchGridData()  ---//

    changeOrder = (orderField,order) => {
        this.setState((e)=>({order_by:orderField,orderType:order}),()=>{this.loadVenuesFromServer();});
    };

    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.loadQuickBoardLevels();
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
                                        <h3>Quick Board Levels</h3>
                                    </div>

                                    <div className="backSave_buttons">
                                        <ul>
                                            <li>
                                                {(appPermission("Quick Board Levels","add")) && (
                                                <a  style={{cursor:'pointer'}} className="selecBttn" onClick={()=>{this.openPopup()}}>ADD Quick Board Level</a>
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
                                                    {/*<input type="text"  placeholder="Search " className="searchInput" onChange={(e)=>{this.handleChange({searchValue:e.target.value})}}  onKeyPress={this.enterPressed} />
                                                    <input type="submit" value=""  className="submitInput" onClick={(e)=>{this.searchNewsCategory()}} />*/}
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
                                                       </b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Level Name</strong>
                                                </div>

                                                <div className="cL_listing_table_cell cell1">
                                                    <strong className=""><span><b>
                                                        <img src="images/sortAerrow_top.png" alt="#" />
                                                       </b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Level Order</strong>
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
                                                                            {value.level_name}
                                                                        </span>
                                                                    </div>

                                                                    <div className="cL_listing_table_cell cell1 ">
                                                                        <span className="cL_rowList_number">
                                                                            {value.level_order}
                                                                        </span>
                                                                    </div>


                                                                    <div className="clEditDotes_cell cell7 cell_span subCategoyCell clearfix"> <span className="cL_rowList_number padingLeft55" style={{marginTop:'5px'}}></span> <a className="cl_tableRow_editDotes" onClick={this.handleButtonsShow}  style={{cursor:'pointer'}}><i></i></a> </div>



                                                                </div>
                                                                <div className="cl_rowEdit_popOut">
                                                                    <div className="cl_rowEdit_pop_table">
                                                                        <div className="cl_rowEdit_popOut_tableRow">
                                                                            {(appPermission("Quick Board Levels","edit")) && (
                                                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1"> <a className="edit_icon"  style={{cursor:'pointer'}} onClick={()=>{this.editLevel(value)}}> <strong><i>&nbsp;</i>Edit</strong></a> </div>
                                                                            )}
                                                                            {(appPermission("Quick Board Levels","delete")) && (
                                                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell3"> <a className="delete_icon"  style={{cursor:'pointer'}} onClick={()=>{this.deleteLevel(value.id)}}><strong><i>&nbsp;</i>Delete</strong></a> </div>
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
                                    <h3>ADD NEW Level</h3>
                                    <a  style={{cursor:'pointer'}} data-attr="addNewUser_popup" className="popupClose close_popup" onClick={()=>this.closePopup()}>&nbsp;</a>
                                </div>


                                <div className="beacon_popupDeatail"> <br /><br />
                                    <div className="beacon_popup_form">

                                        <div className="venueIdentification_form">
                                            <ul>
                                                <li>
                                                    <label>Level Name</label>
                                                    <div className="customInput_div">
                                                        <input  defaultValue={this.state.level_name} onChange={(e)=>this.handleChange({level_name:e.target.value})} id="level_name"  placeholder="Level Name" type="text" />
                                                    </div>
                                                </li>

                                                <li>
                                                    <label>Level Order</label>
                                                    <div className="customInput_div">
                                                        <input value={this.state.level_order} onChange={(e)=>this.handleChange({level_order:e.target.value})} id="level_order"  placeholder="Level Order" type="text" />
                                                    </div>
                                                </li>

                                            </ul>
                                        </div>
                                    </div>
                                    <div className="continueCancel place_beacon createUserButtons">
                                        <input ref={(ref)=>{this.saveCategoryBtn = ref;}} className="disabled selecCompaignBttn save_category" value="SAVE" type="submit" onClick={(e)=>{this.SaveLevel()}} />
                                        <a  style={{cursor:'pointer'}} className="close_popup" onClick={()=>this.closePopup()}>CANCEL</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ConfirmationModal isOpen={!!this.state.deleteQbLevel} handleCloseModal={this.handleCloseModal} text={'Quick Board Level'} handleDeleteItem={this.handleDelete}/>
            </div>
        );
    }//..... end of render() .....//
}//..... end of Shop.

QuickBoardLevels.propTypes = {};

export default QuickBoardLevels;