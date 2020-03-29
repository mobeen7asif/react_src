import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NotificationManager} from "react-notifications";
import VenueAccountUsers from "../venue/VenueAccountUsers";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import ReactPaginate from 'react-paginate';

class AddCharityTiers extends Component {
    NewsCatPopup = null; saveCategoryBtn = null;
    constructor(props) {
        super(props);
        this.state = {
            is_edit         : 0,
            deleteTiers     : 0,
            tier_coins      : "",
            tier_name       : "",
            listTiers       : [],
            offset          : 0,
            perPage         : PerPage,
            searchValue     : '',
            order_by        : 'tier_name',
            orderType       : 'asc',
        };
    }//..... end of constructor() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    openPopup = () => {
        this.setState(()=>({is_edit : 0,tier_coins:"",tier_name:"",budget:""}),()=>{
            this.NewsCatPopup.style.display = "block";
            this.saveCategoryBtn.classList.add("disabled");
        },()=>{
            this.validation();
        });
    };

    validation = () => {
        if(this.state.tier_coins == "" || this.state.tier_name == "")
            this.saveCategoryBtn.classList.add("disabled");
        else
            this.saveCategoryBtn.classList.remove("disabled");
    };

    closePopup = () => {
        this.NewsCatPopup.style.display = "none";
    };

    componentDidMount = () => {
        this.loadTiers();
    };

    loadTiers = () => {
        axios.post(BaseUrl + '/api/list-tiers',{'order_by':this.state.order_by,'orderData':this.state.orderType,'limit': this.state.perPage, 'offset': this.state.offset,company_id: CompanyID,venue_id:VenueID})
            .then(res => {
                this.setState(()=>({listTiers:res.data.data}));
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

    saveTiers = () => {
        show_loader();
        axios.post(BaseUrl + '/api/save-charity-tiers',{...this.state, venue_id: VenueID})
            .then(res => {
                this.setState(()=>({
                    is_edit : 0,
                    tier_name : "",
                    budget : "",
                    tier_coins : ""
                }),()=>{
                    this.closePopup();
                    this.loadTiers();
                });
                show_loader();
                NotificationManager.success(res.data.message, 'Success');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while adding Tiers .", 'Error');
        });
    };

    deleteTiers = (newsCategoryId) => {
        this.setState(() => ({deleteTiers: newsCategoryId}));
    };

    handleCloseModal = () => {
        this.setState(() => ({deleteTiers: 0}));
    };

    handleDelete = () => {
        let tier_id = this.state.deleteTiers;
        this.setState({deleteTiers: 0});
        show_loader();
        axios.delete(`${BaseUrl}/api/delete-tier/${tier_id}`)
            .then((response) => {
                show_loader();
                if (response.data.status === true){
                    NotificationManager.success(response.data.message, 'Success');
                    this.loadTiers();
                } else
                    NotificationManager.error(response.data.message, 'Error');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDelete() .....//

    editTiers = (value) => {
        this.setState(()=>({is_edit : value.id,tier_coins:value.tier_coins,tier_name:value.tier_name,budget:value.budget}),()=>{
            this.NewsCatPopup.style.display = "block";
            this.saveCategoryBtn.classList.add("disabled");
        });
    };

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        this.setState({offset: offset}, () => {
            this.loadTiers();
        });
    };

    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.loadTiers();
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
                                        <h3>Charity Tiers</h3>
                                    </div>

                                    <div className="backSave_buttons">
                                        <ul>
                                            <li>
                                                {(appPermission("Tiers","add")) && (
                                                    <a  style={{cursor:'pointer'}} className="selecBttn" onClick={()=>{this.openPopup()}}>ADD TIER</a>
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
                                            {/*<li className="searching_li">
                                                <div className="searching clearfix">
                                                    <input type="text"  placeholder="Search " className="searchInput" onChange={(e)=>{this.handleChange({searchValue:e.target.value})}}  onKeyPress={this.enterPressed} />
                                                    <input type="submit" value=""  className="submitInput" onClick={(e)=>{this.searchTiers()}} />
                                                </div>
                                            </li>*/}
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
                                                       </b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Tier Name</strong>
                                                </div>

                                                <div className="cL_listing_table_cell cell1">
                                                    <strong className=""><span><b>
                                                        <img src="images/sortAerrow_top.png" alt="#" />
                                                       </b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Tier Coins</strong>
                                                </div>

                                                <div className="cL_listing_table_cell cell1">
                                                    <strong className=""><span><b>
                                                        <img src="images/sortAerrow_top.png" alt="#" />
                                                       </b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Budget</strong>
                                                </div>


                                                <div className="cL_listing_table_cell cell7 subCategoyCell">
                                                    <strong className="sortHidden"><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span></strong>
                                                </div>
                                            </div>

                                        </div>


                                        <ul>
                                            {this.state.listTiers && (
                                                this.state.listTiers.map((value,key)=>{
                                                    return (
                                                        <li key={key}>
                                                            <div className="listDataShowing">
                                                                <div className="cL_listing_table_row">
                                                                    <div className="cL_listing_table_cell cell1 ">
                                                                        <span className="cL_rowList_number">
                                                                            {value.tier_name}
                                                                        </span>
                                                                    </div>
                                                                    <div className="cL_listing_table_cell cell1 ">
                                                                        <span className="cL_rowList_number">
                                                                            {value.tier_coins}
                                                                        </span>
                                                                    </div>

                                                                    <div className="cL_listing_table_cell cell1 ">
                                                                        <span className="cL_rowList_number">
                                                                            {value.budget}
                                                                        </span>
                                                                    </div>
                                                                    <div className="clEditDotes_cell cell_span cell7 subCategoyCell clearfix"> <span className="cL_rowList_number padingLeft55" style={{marginTop:'5px'}}></span> <a className="cl_tableRow_editDotes" onClick={this.handleButtonsShow}  style={{cursor:'pointer'}}><i></i></a> </div>

                                                                </div>
                                                                <div className="cl_rowEdit_popOut">
                                                                    <div className="cl_rowEdit_pop_table">
                                                                        <div className="cl_rowEdit_popOut_tableRow">
                                                                            {(appPermission("Tiers","edit")) && (
                                                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1"> <a className="edit_icon"  style={{cursor:'pointer'}} onClick={()=>{this.editTiers(value)}}> <strong><i>&nbsp;</i>Edit</strong></a> </div>
                                                                            )}
                                                                            {(appPermission("Tiers","delete")) && (
                                                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell3"> <a className="delete_icon"  style={{cursor:'pointer'}} onClick={()=>{this.deleteTiers(value.id)}}><strong><i>&nbsp;</i>Delete</strong></a> </div>
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
                                    <h3>ADD NEW Tier</h3>
                                    <a  style={{cursor:'pointer'}} data-attr="addNewUser_popup" className="popupClose close_popup" onClick={()=>this.closePopup()}>&nbsp;</a>
                                </div>

                                <div className="beacon_popupDeatail"> <br /><br />
                                    <div className="beacon_popup_form">

                                        <div className="venueIdentification_form">
                                            <ul>
                                                <li>
                                                    <label>Tier Name</label>
                                                    <div className="customInput_div">
                                                        <input  value={this.state.tier_name} onChange={(e)=>this.handleChange({tier_name:e.target.value})} id="tier_name"  placeholder="Tier Name" />
                                                    </div>
                                                </li>
                                                
                                                <li>
                                                    <label>Tier Coins/Limit</label>
                                                    <div className="customInput_div">
                                                        <input type="number"  value={this.state.tier_coins} className="change" onChange={(e)=>this.handleChange({tier_coins:e.target.value})} id="tier_coins"  placeholder="Tier Points"  />
                                                    </div>
                                                </li>

                                                <li>
                                                    <label>Budget</label>
                                                    <div className="customInput_div">
                                                        <input type="number"  value={this.state.budget} className="change" onChange={(e)=>this.handleChange({budget:e.target.value})} id="budget"  placeholder="Budged..."  />
                                                    </div>
                                                </li>

                                            </ul>
                                        </div>
                                    </div>

                                    <div className="continueCancel place_beacon createUserButtons">
                                        <input ref={(ref)=>{this.saveCategoryBtn = ref;}} className="disabled selecCompaignBttn save_category"  defaultValue="Save"  onClick={(e)=>{this.saveTiers()}} />
                                        <a  style={{cursor:'pointer'}} className="close_popup" onClick={()=>this.closePopup()}>CANCEL</a>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <ConfirmationModal isOpen={!!this.state.deleteTiers} handleCloseModal={this.handleCloseModal} text={'Tiers'} handleDeleteItem={this.handleDelete}/>
            </div>
        );
    }//..... end of render() .....//
}//..... end of Shop.

AddCharityTiers.propTypes = {};

export default AddCharityTiers;