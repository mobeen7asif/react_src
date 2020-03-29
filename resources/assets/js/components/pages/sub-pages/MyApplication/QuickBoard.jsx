import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import ReactSortable from 'react-sortablejs';

class QuickBoard extends Component {
    QuickBoardFilterSpan= null; saveBoardButton = null;
    constructor(props) {
        super(props);
        this.state = {
            company_id : CompanyID,
            venue_id:VenueID,
            deleteBoard:0,
            display_order:1,
            listBoard           :[],
            offset: 0,
            perPage:PerPage,
            searchValue:'',
            order_by:'news_category_name',
            orderType:'asc',
            newsCategoryFilter:0,
            display_order_numbers:[],
            listSortedItems:[],
            order: [],
            qbLevels: [],
            src  : "",
            src2 : "",
            SelectedBoardLevel:"Select Level",
            SelectedBoardLevelID:0
        };
    };//..... end of constructor() .....//

    validation = () => {
        if(this.state.board_title == "")
            this.saveBoardButton.classList.add("disabled");
        else
            this.saveBoardButton.classList.remove("disabled");
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    openVideoPopup = () => {
        this.props.changeQuickBoard("AddEditQuickBoard",0);
    };

    componentDidMount = () => {
        this.loadVideos();
        $('.multi-select .arrow').html('&nbsp;');
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

    loadVideos = () => {
        show_loader();
        axios.post(BaseUrl + '/api/get-venue-videos',{newsCategoryFilter : this.state.newsCategoryFilter,'order_by':this.state.order_by,'orderData':this.state.orderType,'limit': this.state.perPage, 'offset': this.state.offset,'nameSearch':this.state.searchValue,company_id: CompanyID,venue_id:VenueID})
            .then(res => {
                let orders = [];
                let new_order = 1;
                if(res.data.data.length > 0){
                    res.data.data.map((value,key)=>{
                        orders.push(value.display_order);
                        new_order = value.display_order;
                    });
                    new_order = (new_order) + (1);
                }
            this.setState(()=>({qbLevels: res.data.qb_levels ,listBoard:res.data.data,pageCount:(res.data.total)/this.state.perPage,display_order_numbers:orders,display_order:new_order}));
                show_loader();
            }).catch((err) => {
            show_loader();
        });
    };

    handleChange = (obj) => {
        this.setState(()=>(obj),()=>{
            this.validation();
            if(this.state.display_order == 0){
                this.handleChange({display_order:1});
            }
        });
    };

    deleteBoard = (value) => {
        this.setState(() => ({deleteBoard: value.id}));
    };

    handleCloseModal = () => {
        this.setState(() => ({deleteBoard: 0}));
    };

    handleDelete = () => {
        let newsID = this.state.deleteBoard;
        this.setState({deleteBoard: 0});
        show_loader();
        axios.delete(`${BaseUrl}/api/delete-venue-videos/${newsID}`)
            .then((response) => {
                show_loader();
                if (response.data.status === true){
                    NotificationManager.success(response.data.message, 'Success');
                    this.loadFilterGrid(this.QuickBoardFilterSpan.innerHTML);
                } else
                    NotificationManager.error(response.data.message, 'Error');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDelete() .....//

    editBoard = (value) => {
        this.props.changeQuickBoard("AddEditQuickBoard",value);
    };

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        this.setState({offset: offset}, () => {
            this.loadVideos();
        });
    };

    onChangeOrder = (order, sortable, evt) => {
        if(this.QuickBoardFilterSpan.innerHTML == "Select Board Type"){
            NotificationManager.warning("Please Select Level from Drop Down List.", 'Warning');
            return false;
        }
        var items = [];
        order.map((value)=>{
            this.state.listBoard.map((value2,key2)=>{
                if(value2.id == value ){
                    items.push(value2);
                }
            });
        });

        this.setState(()=>({listBoard:items, order}),()=>{});
    };

    QuickBoardGridFilter = (e) => {
        let index = e.target.selectedIndex;
        let optionElement = e.target.childNodes[index];
        let value =  optionElement.getAttribute('value');
        let cat_nam =  optionElement.getAttribute('cat_name');
        this.QuickBoardFilterSpan.innerHTML = cat_nam;

        if(value == 0){
            this.setState({order: [],SelectedBoardLevel:"Select Level"});
            this.loadVideos();
            return false;
        }
        this.setState(()=>({SelectedBoardLevel: cat_nam,SelectedBoardLevelID:value}),()=>{
            this.loadFilterGrid(cat_nam);
        });



    };

    loadFilterGrid = (cat_nam) => {
        show_loader();
        axios.post(BaseUrl + '/api/get-venue-videos',{newsCategoryFilter : this.state.newsCategoryFilter,'order_by':this.state.order_by,'orderData':this.state.orderType,'limit': this.state.perPage, 'offset': this.state.offset,'nameSearch':"",quickBoardFilter:this.state.SelectedBoardLevelID,company_id: CompanyID,venue_id:VenueID})
            .then(res => {
                let orders = [];
                let new_order = 1;
                if(res.data.data.length > 0){
                    res.data.data.map((value,key)=>{
                        orders.push(value.display_order);
                        new_order = value.display_order;
                    });
                    new_order = (new_order) + (1);
                }
                this.setState(()=>({listBoard:res.data.data,pageCount:(res.data.total)/this.state.perPage,display_order_numbers:orders,display_order:new_order}));
                show_loader();
                $('.tbl--row').removeClass('active_editMod');
            }).catch((err) => {
            show_loader();

            /*NotificationManager.error("Error occurred while getting Bussiness Stores .", 'Error');*/
        });
    };

    saveOrder = (e) => {
        e.preventDefault();
        show_loader();
        axios.post(BaseUrl + '/api/save-quickboard-orders',{order:this.state.order})
            .then(res => {
                this.setState({order: []});
                this.loadFilterGrid(this.QuickBoardFilterSpan.innerHTML);
                show_loader();
                NotificationManager.success(res.data.message, 'Success');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while adding Order.", 'Error');
        });

    };

    render() {
        return (
            <div>
                <div className="newVualt_container">
                    <div className="newVualt_container_detail">

                        <div className="newVualt_detail_outer">
                            <div className="newVualt_detail">
                                <div className="newVualt_heading_with_buttons clearfix">
                                    <div className="newVualt_heading">
                                        <h3>Quick Board </h3>
                                    </div>
                                    <div className="backSave_buttons ">
                                        <ul>
                                            <li>
                                                {(appPermission("Quick Board","add")) && (
                                                    <a  style={{cursor:'pointer'}} className="selecBttn" onClick={()=>{this.openVideoPopup()}}>ADD Board</a>
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="listing_floating_row newFloatingRow clearfix">
                                    <div className="yearsDropdown">
                                        <div className="customDropDown_placeholder ">
                                            <span ref={(ref)=>{this.QuickBoardFilterSpan = ref}}>Select Board Type</span>
                                            <select onChange={(e)=>{this.QuickBoardGridFilter(e)}} >
                                                <option key="000222122" value="0" cat_name="Select Level">Select Level</option>
                                                {this.state.qbLevels.map((value,key)=>{
                                                    return (
                                                        <option key={key} value={value.level_order} cat_name={value.level_name}>{value.level_name}</option>
                                                    )
                                                })}

                                            </select>
                                        </div>
                                    </div>

                                    <div className="backSave_buttons" style={{width: '20%',float: 'left', padding: 0}}>
                                        <ul id="saveOrder">
                                            <li>
                                                {(appPermission("Quick Board","edit")) && (
                                                    <a  style={{cursor:'pointer'}} className={this.state.order.length === 0  ? "selecBttn disabled" : "selecBttn"} onClick={this.saveOrder}>Save Order</a>
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="category_list_outer ">
                                    <div className="cL_listing_tableInn">
                                        <div className="cL_listing_tableTitle">
                                            <div className="cL_listing_table_row">
                                                <div className="cL_listing_table_cell cell1 imgCol   ">
                                                    <strong className="sortHidden"><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Title</strong>
                                                </div>
                                                <div className="cL_listing_table_cell cell1  ">
                                                    <strong className=""><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Background image</strong>
                                                </div>
                                                <div className="cL_listing_table_cell cell1  ">
                                                    <strong className=""><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Icon</strong>
                                                </div>
                                                <div className="cL_listing_table_cell cell1  ">
                                                    <strong className=""><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Background colors</strong>
                                                </div>
                                                <div className="cL_listing_table_cell cell1  ">
                                                    <strong className=""><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Quick Board Level</strong>
                                                </div>
                                                <div className="cL_listing_table_cell cell1  ">
                                                    <strong className=""><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Quick Board Type</strong>
                                                </div>
                                                <div className="cL_listing_table_cell cell7 ">
                                                    <strong className=""><span><b><img src="images/sortAerrow_top.png" alt="#" /></b><b><img src="images/sortAerrow_bottom.png" alt="#" /></b></span>Display Order</strong>
                                                </div>
                                            </div>
                                        </div>

                                        <ReactSortable tag="ul" onChange={(order, sortable, evt) => {this.onChangeOrder(order,sortable,evt);}}>
                                            {this.state.listBoard && (
                                                this.state.listBoard.map((value,key)=>{
                                                    return (
                                                        <li key={key} data-id={value.id} className={'tbl--row'}>
                                                            <div className="listDataShowing">
                                                                <div className="cL_listing_table_row news_col_setting">
                                                                    <div className="cL_listing_table_cell cell1  imgCol">
                                                                        <span className="cL_rowList_number padingLeft0">{value.board_title}</span>
                                                                    </div>
                                                                    <div className="cL_listing_table_cell cell1  ">
                                                                        {value.background_image && (
                                                                        <span className="cL_rowList_number " style={{background:"lightgray",padding:"4px",width:"68px"}}>
                                                                                <img src={BaseUrl+"/news/"+value.background_image} alt="#" className="profile_img" />
                                                                        </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="cL_listing_table_cell cell1  ">
                                                                            <span className="cL_rowList_number" style={{background:"lightgray",padding:"4px",width:"68px"}}>
                                                                                <img src={BaseUrl+"/news/"+value.icon_image} alt="#" className="profile_img" />

                                                                            </span>
                                                                    </div>
                                                                    <div className="cL_listing_table_cell cell1  ">
                                                                        <span className="cL_rowList_number ">
                                                                            <span style={{backgroundColor:value.color1, width:'15px',height:"15px", paddingRight:"16px",marginLeft:"2px"}}></span>
                                                                            <span style={{backgroundColor:value.color2, width:'15px',height:"15px", paddingRight:"16px",marginLeft:"2px"}}></span>
                                                                            <span style={{backgroundColor:value.color3, width:'15px',height:"15px", paddingRight:"16px",marginLeft:"2px"}}></span>
                                                                        </span>
                                                                    </div>
                                                                    <div className="cL_listing_table_cell cell1  ">
                                                                        <span className="cL_rowList_number ">
                                                                            {value.level_name}
                                                                        </span>
                                                                    </div>
                                                                    <div className="cL_listing_table_cell cell1  ">
                                                                        <span className="cL_rowList_number ">
                                                                            {value.qb_type}
                                                                        </span>
                                                                    </div>
                                                                    <div className="clEditDotes_cell cell_span cell7  clearfix"> <span className="cL_rowList_number padingLeft25" style={{marginTop:'7px'}}>{value.display_order}</span> <a className="cl_tableRow_editDotes"  style={{cursor:'pointer'}} onClick={this.handleButtonsShow}><i></i></a> </div>
                                                                </div>
                                                                <div className="cl_rowEdit_popOut">
                                                                    <div className="cl_rowEdit_pop_table">
                                                                        <div className="cl_rowEdit_popOut_tableRow">
                                                                            {(appPermission("Quick Board","edit")) && (
                                                                                 <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1"> <a className="edit_icon"  style={{cursor:'pointer'}} onClick={()=>{this.editBoard(value)}}> <strong><i>&nbsp;</i>Edit</strong></a> </div>
                                                                            )}
                                                                            {(appPermission("Quick Board","delete")) && (
                                                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell3"> <a className="delete_icon"  style={{cursor:'pointer'}} onClick={()=>{this.deleteBoard(value)}}><strong><i>&nbsp;</i>Delete</strong></a> </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )
                                                })
                                            )}
                                     </ReactSortable>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ConfirmationModal isOpen={!!this.state.deleteBoard} handleCloseModal={this.handleCloseModal} text={'Quick Board'} handleDeleteItem={this.handleDelete}/>
            </div>
        );
    }
}

export default QuickBoard;