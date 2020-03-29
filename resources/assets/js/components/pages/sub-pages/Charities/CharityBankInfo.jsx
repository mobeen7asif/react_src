import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import {NotificationManager} from "react-notifications";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import ReactPaginate from 'react-paginate';
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';

class CharityBankInfo extends Component {
    saveCharityButtonRef = null; CharityPopupRef = null; AccNoRef = null; AccHolderRef = null; BankNameRef = null; AccInitialRef=null; BranchNameRef=null; CharityNameSpanRef=null;CharityIDRef=null;
    constructor(props) {
        super(props);
        this.state = {
            is_edit : 0,
            company_id : CompanyID,
            venue_id:VenueID,
            bank_name: "",
            deleteCharity:0,
            acc_holder_name : "",
            acc_number : "",
            branch_name : "",
            acc_initial : "",
            charity_image:"",
            charity_id:0,
            listBankInfo           :[],
            listAllCharities           :[],
            offset: 0,
            perPage:20,
            searchValue:'',
            order_by:'charity_id',
            orderType:'desc',
        };
    }//..... end of constructor() .....//

    validation = () => {
        if(this.state.bank_name == "" || this.state.charity_id == 0 || this.state.acc_holder_name == "" || this.state.acc_number == "" || this.state.branch_name == "" || this.state.acc_initial == "" )
            this.saveCharityButtonRef.classList.add("disabled");
        else
            this.saveCharityButtonRef.classList.remove("disabled");

    };
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    openNewsPopup = () => {
        this.setState(()=>({is_edit : 0,bank_name: "",acc_holder_name : "",acc_number : "",branch_name:"",acc_initial:"",charity_id:0}),()=>{
            this.formReset();
            this.CharityPopupRef.style.display = "block";
            this.saveCharityButtonRef.classList.add("disabled");
        });

    };

    closePopup = () => {
        this.CharityPopupRef.style.display = "none";
        this.formReset();
    };

    componentDidMount = () => {
        let $this = this;
        this.loadBankInfo();
        this.loadCharities();
    };

    componentWillUnmount = () => {

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

    loadBankInfo = () => {
        show_loader();
        axios.post(BaseUrl + '/api/get-charity-bankinfo',{'order_by':this.state.order_by,'orderData':this.state.orderType,'limit': this.state.perPage, 'offset': this.state.offset,'nameSearch':this.state.searchValue,company_id: CompanyID,venue_id:VenueID})
            .then(res => {
                this.setState(()=>({listBankInfo:res.data.data,pageCount:(res.data.total)/this.state.perPage}));
                show_loader();
            }).catch((err) => {
            show_loader();
            /*NotificationManager.error("Error occurred while getting Bussiness Stores .", 'Error');*/
        });
    };

    loadCharities = () => {
        show_loader();
        axios.post(BaseUrl + '/api/get-venue-charities',{company_id: CompanyID,venue_id:VenueID})
            .then(res => {
                this.setState(()=>({listAllCharities:res.data.data}));
                show_loader();
            }).catch((err) => {
            show_loader();
            /*NotificationManager.error("Error occurred while getting Bussiness Stores .", 'Error');*/
        });
    };

    handleChange = (obj) => {
        this.setState(()=>(obj),()=>{
            this.validation();
        });
    };

    saveNews = () => {
        var data = new FormData();
        data.append('is_edit', this.state.is_edit);
        data.append('bank_name', this.state.bank_name);
        data.append('acc_holder_name', this.state.acc_holder_name);
        data.append('acc_number', this.state.acc_number);
        data.append('branch_name', this.state.branch_name);
        data.append('acc_initial', this.state.acc_initial);
        data.append('charity_id', this.state.charity_id);
        data.append('venue_id', VenueID);
        data.append('company_id', CompanyID);

        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        show_loader();
        axios.post(BaseUrl + '/api/save-charity-bankinfo',data,config)
            .then(res => {
                this.setState(()=>({
                    is_edit : 0,
                    bank_name: "",
                    acc_holder_name : "",
                    acc_number : "",
                    branch_name : "",
                    acc_initial : "",
                    charity_id : 0,
                }),()=>{
                    this.formReset();
                    this.closePopup();
                });
                this.loadBankInfo();
                show_loader();
                NotificationManager.success("Charity added Successfully", 'Success');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while adding Charity.", 'Error');
        });
    };
    formReset = () => {
        this.AccNoRef.value = "";
        this.AccHolderRef.value = "";
        this.BankNameRef.value = "";
        this.AccInitialRef.value = "";
        this.BranchNameRef.value = "";
    };

    deleteCharity = (value) => {
        this.setState(() => ({deleteCharity: value.charity_bank_id}));
    };

    handleCloseModal = () => {
        this.setState(() => ({deleteCharity: 0}));
    };

    handleDelete = () => {
        let charityBankID = this.state.deleteCharity;
        this.setState({deleteCharity: 0});
        show_loader();
        axios.delete(`${BaseUrl}/api/delete-charityBankInfo/${charityBankID}`)
            .then((response) => {
                show_loader();
                if (response.data.status === true){
                    NotificationManager.success(response.data.message, 'Success');
                    this.loadBankInfo();
                } else
                    NotificationManager.error(response.data.message, 'Error');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDelete() .....//

    editNews = (value) => {
        this.saveCharityButtonRef.classList.add("disabled");
        this.setState(()=>(
            {
                is_edit     : value.charity_bank_id,
                bank_name  : value.bank_name,
                charity_id  : value.charity_id,
                acc_holder_name   : value.acc_holder_name,
                acc_number  : value.acc_number,
                branch_name  : value.branch_name,
                acc_initial  : value.acc_initial,
            }
        ),()=>{
            this.CharityNameSpanRef.innerHTML  = value.charity_name;
            this.CharityPopupRef.style.display   = "block";


        });
    };

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        this.setState({offset: offset}, () => {
            this.loadBankInfo();
        });
    };

    /**
     * search Segment
     * @param e
     */
    searchNews = () => {
        this.loadBankInfo();

    };//--- End of searchGridData()  ---//

    changeOrder = (orderField,order) => {
        this.setState((e)=>({order_by:orderField,orderType:order}),()=>{this.loadVenuesFromServer();});
    };

    getNewsCatId = (e) => {
        let index = e.target.selectedIndex;
        let optionElement = e.target.childNodes[index];
        let charity_id =  optionElement.getAttribute('value');
        let charity_name =  optionElement.getAttribute('charity_name');
        if(charity_id == 0){
            $("#is_global_toogle").hide();
        }else{
            $("#is_global_toogle").show();
        }
        this.CharityNameSpanRef.innerHTML = charity_name;
        this.setState(()=>({charity_id:charity_id}),()=>{
            this.validation();
        });
    };

    enterPressed = (event) => {
        let code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.searchNews();
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
                                        <h3>Charities Bank Informations </h3>
                                    </div>
                                    <div className="backSave_buttons ">
                                        <ul>
                                            <li><a  style={{cursor:'pointer'}} className="selecBttn" onClick={()=>{this.openNewsPopup()}}>ADD Bank Information's</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="listing_floating_row newFloatingRow clearfix">
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
                                                    <input type="text"  placeholder="Search " onKeyPress={this.enterPressed} className="searchInput" onChange={(e)=>{this.handleChange({searchValue:e.target.value})}} />
                                                    <input type="submit" value=""  className="submitInput" onClick={(e)=>{this.searchNews()}} />
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
                                                    <strong className=""><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Charity Name</strong>
                                                </div>
                                                <div className="cL_listing_table_cell cell1 imgCol   ">
                                                    <strong className=""><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Bank Name</strong>
                                                </div>
                                                <div className="cL_listing_table_cell cell1  ">
                                                    <strong className=""><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Acc Holder Name</strong>
                                                </div>
                                                <div className="cL_listing_table_cell cell1  ">
                                                    <strong className=""><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Account Number</strong>
                                                </div>
                                                <div className="cL_listing_table_cell cell1  ">
                                                    <strong className=""><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Branch Name</strong>
                                                </div>

                                                <div className="cL_listing_table_cell cell7 ">
                                                    <strong className=""><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Account Initial</strong>
                                                </div>
                                            </div>

                                        </div>


                                        <ul>

                                            {this.state.listBankInfo && (
                                                this.state.listBankInfo.map((value,key)=>{
                                                    return (
                                                        <li key={key}>
                                                            <div className="listDataShowing">
                                                                <div className="cL_listing_table_row news_col_setting">

                                                                    <div className="cL_listing_table_cell cell1  ">
                                                                        <span className="cL_rowList_number ">{value.charity_name}</span>
                                                                    </div>

                                                                    <div className="cL_listing_table_cell cell1  imgCol">
                                                                        <span className="cL_rowList_number padingLeft0">{value.bank_name}</span>
                                                                    </div>
                                                                    <div className="cL_listing_table_cell cell1  ">
                                                                        <span className="cL_rowList_number ">{value.acc_holder_name}</span>
                                                                    </div>
                                                                    <div className="cL_listing_table_cell cell1  ">
                                                                            <span className="cL_rowList_number">e
                                                                                {value.acc_number}
                                                                            </span>
                                                                    </div>
                                                                    <div className="cL_listing_table_cell cell1  ">
                                                                        <span className="cL_rowList_number ">{value.branch_name}</span>
                                                                    </div>

                                                                    <div className="clEditDotes_cell cell7  clearfix"> <span className="cL_rowList_number padingLeft25" style={{marginTop:'7px'}}>{value.acc_initial}</span> <a className="cl_tableRow_editDotes"  style={{cursor:'pointer'}} onClick={this.handleButtonsShow}><i></i></a> </div>



                                                                </div>
                                                                <div className="cl_rowEdit_popOut">
                                                                    <div className="cl_rowEdit_pop_table">
                                                                        <div className="cl_rowEdit_popOut_tableRow">

                                                                            <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1"> <a className="edit_icon"  style={{cursor:'pointer'}} onClick={()=>{this.editNews(value)}}> <strong><i>&nbsp;</i>Edit</strong></a> </div>
                                                                            <div className="cl_rowEdit_popOut_tableRow_cell eidtCell3"> <a className="delete_icon"  style={{cursor:'pointer'}} onClick={()=>{this.deleteCharity(value)}}><strong><i>&nbsp;</i>Delete</strong></a> </div>

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










                <div className= "popups_outer addNewsCharity" ref={(ref)=>{this.CharityPopupRef = ref;}} style={{display:'none'}}>
                    <div className="popups_inner">
                        <div className="overley_popup" data-attr="addNewUser_popup" onClick={()=>{this.closePopup()}}></div>

                        <div className="popupDiv2">
                            <div className="popupDiv_detail">

                                <div className="popup_heading clearfix">
                                    <h3>Add Charity Bank Information's</h3>
                                    <a  style={{cursor:'pointer'}} onClick={()=>{this.closePopup()}} className="popupClose close_popup">&nbsp;</a>
                                </div>


                                <div className="beacon_popupDeatail"> <br /><br />
                                    <div className="add_categoryList_info2">
                                        <div className="newVualt_heading">
                                            <h3>Add Bank Information's</h3>
                                        </div>



                                        <div className="categoryInfo_container cms_nes_setting clearfix">

                                            <div className="addCategoryRight_section2">
                                                <div className="addCategory_formSection portalNew_page">
                                                    <ul>
                                                        <li>

                                                            <div className="customPlaceholder_outer">
                                                                <h4>Charity Name</h4>
                                                                <div className="customDropDwn_outer changeDropdon_color">

                                                                    <div className="customDropDown_placeholder">
                                                                        <span id="cat_value" cat-value="" ref={(ref)=>{this.CharityNameSpanRef = ref;}} >Select Category</span>
                                                                        <select id="news_category_id" onChange={(e)=>{this.getNewsCatId(e)}} ref={(ref)=>{this.CharityIDRef = ref}}>
                                                                            <option key={985415} value="0" charity_name="Select Category">Select Charity</option>
                                                                            {this.state.listAllCharities && (
                                                                                this.state.listAllCharities.map((value,key)=>{
                                                                                    return (
                                                                                        <option key={key} value={value.charity_id} charity_name={value.charity_name}>{value.charity_name}</option>
                                                                                    )
                                                                                })
                                                                            )}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="customPlaceholder_outer">
                                                                <h4>Bank Name</h4>
                                                                <b className="req_tag">Required</b>
                                                                <div className="customPlaceholder">
                                                                    <input maxLength="26"  name="bank_name" id="bank_name" ref={(ref)=>{this.BankNameRef = ref}} placeholder="Enter Bank Name..." value={this.state.bank_name} onChange={(e)=>this.handleChange({bank_name:e.target.value})} type="text" />
                                                                </div>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="customPlaceholder_outer">
                                                                <h4>Account Holder Name</h4>
                                                                <b className="req_tag">Required</b>
                                                                <div className="customPlaceholder">
                                                                    <input maxLength="26"  type="text" id="acc_holder_name" ref={(ref)=>{this.AccHolderRef = ref}} value={this.state.acc_holder_name} onChange={(e)=>this.handleChange({acc_holder_name:e.target.value})} name="acc_holder_name" placeholder="Enter Account Holder Name..." />
                                                                </div>

                                                            </div>
                                                        </li>


                                                        <li>
                                                            <div className="customPlaceholder_outer">
                                                                <h4>Account Number</h4>
                                                                <b className="req_tag">Required</b>
                                                                <div className="customPlaceholder">
                                                                    <input maxLength="26"  id="acc_number" ref={(ref)=>{this.AccNoRef = ref}} value={this.state.acc_number} onChange={(e)=>this.handleChange({acc_number:e.target.value})} name="acc_number" placeholder="Enter Account Number..." />
                                                                </div>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="customPlaceholder_outer">
                                                                <h4>Branch Name</h4>
                                                                <b className="req_tag">Required</b>
                                                                <div className="customPlaceholder">
                                                                    <input maxLength="26"  id="branch_name" ref={(ref)=>{this.BranchNameRef = ref}} value={this.state.branch_name} onChange={(e)=>this.handleChange({branch_name:e.target.value})} name="branch_name" placeholder="Enter Branch Name..." />
                                                                </div>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="customPlaceholder_outer">
                                                                <h4>Acc Initial</h4>
                                                                <b className="req_tag">Required</b>
                                                                <div className="customPlaceholder">
                                                                    <input maxLength="26"  id="acc_initial" ref={(ref)=>{this.AccInitialRef = ref}} value={this.state.acc_initial} onChange={(e)=>this.handleChange({acc_initial:e.target.value})} name="acc_initial" placeholder="Enter Account initial..." />
                                                                </div>
                                                            </div>
                                                        </li>

                                                    </ul>
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                    <div className="continueCancel place_beacon createUserButtons">
                                        <input className="disabled selecCompaignBttn save_news" value="SAVE" type="submit" ref={(ref)=>{this.saveCharityButtonRef = ref;}} onClick={(e)=>{this.saveNews()}} />
                                        <a  style={{cursor:'pointer'}} className="close_popup" onClick={()=>{this.closePopup()}}>CANCEL</a>
                                    </div>

                                </div>




                            </div>
                        </div>
                    </div>
                </div>
                <ConfirmationModal isOpen={!!this.state.deleteCharity} handleCloseModal={this.handleCloseModal} text={'News Category'} handleDeleteItem={this.handleDelete}/>
            </div>
        );
    }
}

CharityBankInfo.propTypes = {};

export default CharityBankInfo;