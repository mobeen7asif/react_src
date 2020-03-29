import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import 'react-datepicker/dist/react-datepicker.css';
import Grid from "../../Grid";
import AddEditNews from "./AddEditNews";

class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listNewsCategories  : [],
            listNews            : [],
            multiSelect         : [],
            offset              : 0,
            perPage             : PerPage,
            searchValue         : '',
            orderBy             : 'news_category_name',
            orderType           : 'asc',
            newsCategoryFilter  : 0,
            category_name       : '',
            listVenues          : [],
            listVenuesShops     : [],
            showAddEditModal    : false,
            recordToEdit        : {},
            deleteNews          : 0
        };
    }//..... end of constructor() .....//

    headerList = [
        {"id": "1", "name": 'Title',          'filterName': 'news_subject'},
        {"id": "2", "name": 'Type',           'filterName': 'news_type'},
        /*{"id": "3", "name": 'Quick Board',    'filterName': 'listBoards', htmlParser: true},*/
        {"id": "4", "name": 'Category',       'filterName': 'news_category_name', htmlParser: true},
        {"id": "5", "name": 'Start Date',     'filterName': 'start_date'},
        {"id": "5", "name": 'End Date',       'filterName': 'end_date'},
        {"id": "5", "name": 'News Type',      'filterName': 'isGlobal'},
    ];//..... end of headerList() .....//

    loadAllVenues = () => {
        show_loader();
        axios.get(`${BaseUrl}/api/get-venues-multiselect`)
            .then(res => {
                this.handleChange({listVenues: res.data.data});
                show_loader(true);
            }).catch((err) => {
            show_loader(true);
        });
    };//..... end of loadAllVenues() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    
    addNews = () => {
        this.handleShowAddEditModal(true);
    };//..... end of addNews() ......//

    handleShowAddEditModal = (status) => {
        this.setState({showAddEditModal: !!status});
        Array.prototype.slice.call(document.querySelectorAll('.grid--body > li'))
            .map((ele) => ele.classList.remove('active_editMod'));
        this.setState({recordToEdit: {}});

        this.state.multiSelect.forEach(function(value) {
            if (value.value == true)
                value.value = false;
        });
        document.body.style.overflow = 'auto';
        this.addNewsPopup.style.display = "none";
    };//..... end of handleShowAddEditModal() .....//

    componentDidMount = () => {
        this.loadNews();
        this.loadQuickBoards();
        this.loadAllVenues();
    };//..... end of componentDidMount() ...../

    handleButtonsShow = (e) => {
        let li = e.target.closest('li');
        if (li.classList.contains('active_editMod')) {
            li.classList.remove('active_editMod');
        } else {
            Array.prototype.slice.call(e.target.closest('ul').querySelectorAll('li'))
                .map((ele) => ele.classList.remove('active_editMod'));
            li.classList.add('active_editMod');
        }//..... end if-else() .....//
    };//..... end of handleButtonsShow() .....//

    loadNews = () => {
        show_loader();
        axios.post(`${BaseUrl}/api/get-venue-news`,{
            newsCategoryFilter  : this.state.newsCategoryFilter,
            order_by            : this.state.orderBy,
            orderData           : this.state.orderType,
            limit               : this.state.perPage,
            offset              : this.state.offset,
            nameSearch          : this.state.searchValue,company_id:
            CompanyID,
            venue_id            : VenueID
        }).then(res => {
            this.handleChange({listNews: res.data.data, listNewsCategories: res.data.newsCat, pageCount: (res.data.total)/this.state.perPage});
            show_loader(true);
        }).catch((err) => {
            show_loader(true);
        });
    };//..... end of loadNews() .....//

    loadQuickBoards = () => {
        show_loader();
        axios.post(BaseUrl + '/api/get-quick-board',{type:"NEWS"}).then(res => {
                this.handleChange({multiSelect:res.data.data});
                show_loader(true);
            }).catch((err) => {
            show_loader(true);
        });
    };//..... end of loadQuickBoards() .....//

    loadQuickBoard = (venue_id, shop_id) => {
        axios.post(BaseUrl + '/api/get-quick-board',{venue_id:venue_id,shop_id:shop_id}).then(res => {
            this.handleChange({multiSelect: venue_id == 0 ? [] : res.data.data});
            show_loader();
        }).catch((err) => {
            show_loader();
        });
    };//..... end of loadQuickBoard() .....//

    NewsCatFilter = (e) => {
        let index = e.target.selectedIndex;
        let optionElement = e.target.childNodes[index];
        let newsCategoryFilter =  optionElement.getAttribute('value');
        let category_name =  optionElement.getAttribute('cat_name');
        this.setState(()=>({newsCategoryFilter, category_name}),()=>{
            this.loadNews();
        });
    };//..... end of NewsCatFilter() .....//

    handleChange = (obj) => {
        this.setState(()=>(obj));
    };//..... end of handleChange() ......//

    deleteNews = (value) => {
        this.setState(() => ({deleteNews: value}));
    };//..... end of deleteNews() .....//

    handleCloseDeleteModal = () => {
        this.setState(() => ({deleteNews: 0}));
    };//..... end of handleCloseDeleteModal() .....//

    handleDelete = () => {
        let newsID = this.state.deleteNews;
        this.setState({deleteNews: 0});
        show_loader();
        axios.delete(`${BaseUrl}/api/delete-venue-news/${newsID}`)
            .then((response) => {
                show_loader();
                if (response.data.status === true){
                    NotificationManager.success(response.data.message, 'Success');
                    this.loadNews();
                } else
                    NotificationManager.error(response.data.message, 'Error');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDelete() .....//

    editNews = (value) => {
        this.setState(() => ({
            recordToEdit: value,
            showAddEditModal: true
        }));
    };//..... end of editNews() .....//

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        this.setState({offset: offset}, () => {
            this.loadNews();
        });
    };//..... end of handlePageClick() .....//

    enterPressed = (event) => {
        let code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.loadNews();
        }
    };//--- End of enterPressed() ----//

    handleFilterChange = (orderBy, orderType) => {
        this.setState({orderBy, orderType}, () => {
            this.loadNews();
        });
    };//..... end of handleFilterChange() .....//

    render() {
        return (
            <div>
                <div className="newVualt_container">
                    <div className="newVualt_container_detail">
                        <div className="newVualt_detail_outer">
                            <div className="newVualt_detail">
                                <div className="newVualt_heading_with_buttons clearfix">
                                    <div className="newVualt_heading">
                                        <h3>News</h3>
                                    </div>
                                    <div className="backSave_buttons ">
                                        <ul>
                                            <li>
                                                {(appPermission("News","add")) && (
                                                <a  style={{cursor:'pointer'}} className="selecBttn" onClick={this.addNews}>ADD NEWS</a>
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="listing_floating_row newFloatingRow clearfix">
                                    <div className="yearsDropdown">
                                        <div className="customDropDown_placeholder ">
                                            <span> {this.state.category_name || 'Category Filter'}</span>
                                            <select onChange={(e)=>{this.NewsCatFilter(e)}} >
                                                <option key="000222122" value="0" cat_name="Select Category">Select Category</option>
                                                {this.state.listNewsCategories && (
                                                    this.state.listNewsCategories.map((value,key)=>{
                                                        return (
                                                            <option key={key} value={value.news_category_id} cat_name={value.news_category_name}>{value.news_category_name}</option>
                                                        )
                                                    })
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid_searching clearfix">
                                        <ul>
                                            <li className="searching_li">
                                                <div className="searching clearfix">
                                                    <input type="text"  placeholder="Search " className="searchInput" onChange={(e)=>{this.handleChange({searchValue:e.target.value})}}   onKeyPress={this.enterPressed} />
                                                    <input type="submit" value=""  className="submitInput" onClick={(e)=>{this.loadNews();}} />
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <Grid headerList                    = {this.headerList}
                                      handleFilterChange            = {this.handleFilterChange}
                                      orderBy                       = {this.state.orderBy}
                                      orderType                     = {this.state.orderType}
                                      data                          = {this.state.listNews}
                                      editRecord                    = {(appPermission("News","edit")) ? this.editNews : false}
                                      addRecordToStateForDeletion   = {(appPermission("News","delete")) ? this.deleteNews : false}
                                      pageCount                     = {this.state.pageCount}
                                      handlePageClick               = {this.handlePageClick}
                                      deleteItemID                  = {this.state.deleteNews}
                                      handleCloseModal              = {this.handleCloseDeleteModal}
                                      deletePopupText               = {'News'}
                                      handleDeleteItem              = {this.handleDelete}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showAddEditModal &&
                <AddEditNews handleShowAddEditModal={this.handleShowAddEditModal} listNewsCategories={this.state.listNewsCategories}
                             listVenues={this.state.listVenues} loadQuickBoard={this.loadQuickBoard} quickboards={this.state.multiSelect}
                             recordToEdit={this.state.recordToEdit} loadNews={this.loadNews}/>}
            </div>
        );
    }
}

export default News;