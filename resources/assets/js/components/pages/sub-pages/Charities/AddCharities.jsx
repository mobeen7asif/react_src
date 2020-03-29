import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import Grid from "../../Grid";
import CharityAddEditModel from "./CharityAddEditModel";
import EmptyPage from "../../EmptyPage";

class AddCharities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteCharity   :   0,
            listCharity     :   [],
            offset          :   0,
            perPage         :   PerPage,
            searchValue     :   '',
            orderBy         :   'id',
            orderType       :   'desc',
            editData        :   {},
            openAddEditModel:   0,
            subTotal        : 0
        };
    }//..... end of constructor() .....//

    headerList = [
        {"id": "1", "name": 'Name',          'filterName': 'charity_name'},
        {"id": "2", "name": 'Contact',       'filterName': 'contact_number'},
        {"id": "3", "name": 'Email',         'filterName': 'charity_email'},
        {"id": "4", "name": 'Address',       'filterName': 'charity_address'},
        {"id": "5", "name": 'Total Coins',   'filterName': 'coins_count'},
        /*{"id": "5", "name": 'Quick boards',   'filterName': 'listBoards'},*/
    ];

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    componentDidMount = () => {
        this.loadCharity();
    };//..... end of componentDidMount() .....//

    handleButtonsShow = (e) => {
        let li = e.target.closest('li');
        if (li.classList.contains('active_editMod')) {
            li.classList.remove('active_editMod');
        } else {
            Array.prototype.slice.call(e.target.closest('ul').querySelectorAll('li'))
                .map((ele) => ele.classList.remove('active_editMod'));
            li.classList.add('active_editMod');
        }//..... end if-else() .....//
    };//..... end of handleButtonsShow() ......//

    loadCharity = () => {
        show_loader();
        axios.post(BaseUrl + '/api/get-list-charity',{'order_by':this.state.order_by,'orderData':this.state.orderType,'limit': this.state.perPage, 'offset': this.state.offset,'nameSearch':this.state.searchValue,company_id: CompanyID,venue_id:VenueID})
            .then(res => {
                this.setState(()=>({listCharity:res.data.data,pageCount:(res.data.total)/this.state.perPage, subTotal: res.data.subTotal}));
                show_loader(true);
            }).catch((err) => {
                show_loader(true);
                NotificationManager.error("Error occurred while getting Charities list.", 'Error');
        });
    };//..... end of loadCharity() .....//

    handleChange = (obj) => {
        this.setState(()=>(obj));
    };//..... end of handleChange() ......//

    deleteCharity = (value) => {
        this.setState(() => ({deleteCharity: value}));
    };

    handleCloseDeleteModal = () => {
        this.setState(() => ({deleteCharity: 0}));
    };

    handleDelete = () => {
        show_loader();
        axios.delete(`${BaseUrl}/api/delete-charity/${this.state.deleteCharity}`).then((response) => {
                    show_loader(true);
                    if (response.data.status === true) {
                        this.setState({deleteCharity: 0});
                        NotificationManager.success(response.data.message, 'Success');
                        this.loadCharity();
                    } else
                        NotificationManager.error(response.data.message, 'Error');
            }).catch((err) => {
                    show_loader(true);
                    NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDelete() .....//

    editNews = (value) => {
        this.setState(() => ({editData: value, openAddEditModel: 1}));
    };

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        this.setState({offset: offset}, () => {
            this.loadCharity();
        });
    };

    searchNews = () => {
        this.loadCharity();
    };//--- End of searchGridData()  ---//

    enterPressed = (event) => {
        let code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.searchNews();
        }
    };//--- End of enterPressed() ----//

    handleFilterChange = (orderBy, orderType) => {
        this.setState({orderBy, orderType}, () => {
           // this.loadData();
        });
    };//--- End of () ---//

    closeAddEditModel = () => {
        this.setState(() => ({editData: [], openAddEditModel: 0}));
    };

    render() {
        if(!appPermission("Charities List","view")){
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
                                            <h3>Charities List</h3>
                                        </div>
                                        <div className="backSave_buttons ">
                                            <ul>
                                                <li>
                                                    {(appPermission("Charities List","add")) && (
                                                         <a  style={{cursor:'pointer'}} className={this.state.subTotal >= 3 ? 'disabled selecBttn' : "selecBttn"} onClick={()=>{this.setState({openAddEditModel: 1})}}>ADD Charity</a>
                                                    )}
                                                </li>
                                                <li>
                                                    <a className="selecBttn" href={BaseUrl+"/api/print-charity-report/"+VenueID} >Print</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="listing_floating_row newFloatingRow clearfix">
                                        <div className="grid_searching clearfix">
                                            <ul>
                                                <li className="searching_li">
                                                    <div className="searching clearfix">
                                                        <input type="text"  placeholder="Search..." className="searchInput" onKeyPress={this.enterPressed} onChange={(e)=>{this.handleChange({searchValue:e.target.value})}} />
                                                        <input type="submit" value=""  className="submitInput" onClick={(e)=>{this.searchNews()}} />
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <Grid headerList                    = {this.headerList}
                                          handleFilterChange            = {this.handleFilterChange}
                                          orderBy                       = {this.state.orderBy}
                                          orderType                     = {this.state.orderType}
                                          data                          = {this.state.listCharity}
                                          editRecord                    = {(appPermission("Charities List","edit")) ? this.editNews : false}
                                          addRecordToStateForDeletion   = {(appPermission("Charities List","delete")) ? this.deleteCharity : false}
                                          pageCount                     = {this.state.pageCount}
                                          handlePageClick               = {this.handlePageClick}
                                          deleteItemID                  = {this.state.deleteCharity}
                                          handleCloseModal              = {this.handleCloseDeleteModal}
                                          deletePopupText               = {'Charity'}
                                          handleDeleteItem              = {this.handleDelete}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {this.state.openAddEditModel > 0 &&  <CharityAddEditModel editData = {this.state.editData} closeAddEditModel={this.closeAddEditModel} loadCharity={this.loadCharity}/>}
                </div>
            );
        }

    }
}

export default AddCharities;