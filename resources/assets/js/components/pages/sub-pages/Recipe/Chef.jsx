import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import 'react-datepicker/dist/react-datepicker.css';
import Grid from "../../Grid";
import AddEditNews from "../MyApplication/AddEditNews";
import AddEditChef from "./AddEditChef";

class Chef extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listChef            : [],
            offset              : 0,
            perPage             : PerPage,
            searchValue         : '',
            orderBy             : 'news_category_name',
            orderType           : 'asc',
            category_name       : '',
            showAddEditModal    : false,
            recordToEdit        : {},
            deleteChef          : 0
        };
    }//..... end of constructor() .....//

    headerList = [
        {"id": "1", "name": 'First Name',          'filterName': 'first_name'},
        {"id": "2", "name": 'Last Name',           'filterName': 'last_name'},
        {"id": "3", "name": 'Descriptions',       'filterName': 'descriptions', htmlParser: true},
    ];//..... end of headerList() .....//


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


    };//..... end of handleShowAddEditModal() .....//

    componentDidMount = () => {
        this.loadChef();
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

    loadChef = () => {
        show_loader();
        axios.post(`${BaseUrl}/api/get-chef`,{
            order_by            : this.state.orderBy,
            orderData           : this.state.orderType,
            limit               : this.state.perPage,
            offset              : this.state.offset,
            searchValue         :this.state.searchValue
        }).then(res => {
            this.handleChange({listChef: res.data.data,  pageCount: (res.data.total)/this.state.perPage});
            show_loader(true);
        }).catch((err) => {
            show_loader(true);
        });
    };//..... end of loadChef() .....//



    handleChange = (obj) => {
        this.setState(()=>(obj));
    };//..... end of handleChange() ......//

    deleteChef = (value) => {
        this.setState(() => ({deleteChef: value}));
    };//..... end of deleteChef() .....//

    handleCloseDeleteModal = () => {
        this.setState(() => ({deleteChef: 0}));
    };//..... end of handleCloseDeleteModal() .....//

    handleDelete = () => {
        let chefID = this.state.deleteChef;
        this.setState({deleteChef: 0});
        show_loader();
        
        axios.delete(`${BaseUrl}/api/delete-chef/${chefID}`)
            .then((response) => {
                show_loader();
                if (response.data.status === true){
                    NotificationManager.success(response.data.message, 'Success');
                    this.loadChef();
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
            this.loadChef();
        });
    };//..... end of handlePageClick() .....//

    enterPressed = (event) => {
        let code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.loadChef();
        }
    };//--- End of enterPressed() ----//

    handleFilterChange = (orderBy, orderType) => {
        this.setState({orderBy, orderType}, () => {
            this.loadChef();
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
                                        <h3>Chef Registration</h3>
                                    </div>
                                    <div className="backSave_buttons ">
                                        <ul>
                                            <li>
                                                {(appPermission("Chef Registration","add")) && (
                                                    <a  style={{cursor:'pointer'}} className="selecBttn" onClick={this.addNews}>Add Chef</a>
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
                                                    <input type="text"  placeholder="Search " className="searchInput" onChange={(e)=>{this.handleChange({searchValue:e.target.value})}}   onKeyPress={this.enterPressed} />
                                                    <input type="submit" value=""  className="submitInput" onClick={(e)=>{this.loadChef();}} />
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <Grid headerList                    = {this.headerList}
                                      handleFilterChange            = {this.handleFilterChange}
                                      orderBy                       = {this.state.orderBy}
                                      orderType                     = {this.state.orderType}
                                      data                          = {this.state.listChef}
                                      editRecord                    = {(appPermission("Chef Registration","edit")) ? this.editNews : false}
                                      addRecordToStateForDeletion   = {(appPermission("Chef Registration","delete")) ? this.deleteChef : false}
                                      pageCount                     = {this.state.pageCount}
                                      handlePageClick               = {this.handlePageClick}
                                      deleteItemID                  = {this.state.deleteChef}
                                      handleCloseModal              = {this.handleCloseDeleteModal}
                                      deletePopupText               = {'Chef'}
                                      handleDeleteItem              = {this.handleDelete}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showAddEditModal &&
                <AddEditChef handleShowAddEditModal={this.handleShowAddEditModal}
                             recordToEdit={this.state.recordToEdit} loadChef={this.loadChef}/>}
            </div>
        );
    }
}

export default Chef;