import React, {Component} from 'react';
import HeaderComponent from "../../members/sub_components/HeaderComponent";
import ReactPaginate from 'react-paginate';
import {addVoucherDefault, resetVoucherData, setVoucherBusiness} from "../../../../redux/actions/VoucherAction";
import Autocomplete from  'react-autocomplete';
import {NotificationManager} from "react-notifications";
import { Scrollbars } from 'react-custom-scrollbars';
import ToggleSwitch from "@trendmicro/react-toggle-switch";
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import DatePicker from 'react-datepicker';
import {connect} from 'react-redux';
import {selectVoucherDateToSave} from "../../../../redux/selectors/Selectors";
import NotFound from "../../../NotFound";
import NoDataFound from "../../../../_partials/NoDataFound";
class VoucherListing extends Component {
    perPage = PerPage;
    pageLoader = null;
    rolePopup=null
    state = {
        data: [],
        offset: 0,
        searchData: '',
        orderBy: 'created_at',
        orderType: 'desc',
        pageCount: 0,
        deletePunchCard: 0,
        headerList : [
            {"id": "1", "name": 'Name',         'filterName': 'name'},
            {"id": "2", "name": 'Discount Type',  'filterName': 'description'},
            {"id": "3", "name": 'Voucher Image',  'filterName': 'description'},
            {"id": "4", "name": 'Voucher Category',  'filterName': 'description'},
            {"id": "5", "name": 'Voucher Type',  'filterName': 'description'},
        ],
        showhide:false,
        searchValue:[],
        value:'',
        userdata:[],
        voucherData:{},
        voucherCategory: false
    };



    loadData = () => {
        show_loader();
        this.pageLoader.show();
        axios.post(BaseUrl + `/api/list-all-vouchers`, {
            'orderBy':      this.state.orderBy,
            'orderType':    this.state.orderType,
            'limit':        this.perPage,
            'offset':       this.state.offset,
            'search':       this.state.searchData,
            'venue_id':     VenueID,
            'company_id':   CompanyID
        }).then(res => {
            show_loader(true);
            if (res.data.status) {
                this.setState(()=>({
                    data: res.data.data,
                    pageCount: (res.data.total) / this.perPage,
                    showListError: false
                }));
                this.pageLoader.hide();
            } else {
                this.setState({showListError: true});
                this.pageLoader.hide();
            }
        }).catch((err) => {
            show_loader(true);
            this.setState({showListError: true});
            this.pageLoader.hide();
        });

    };//..... end of loadData() .....//

    componentDidMount = () => {
        this.pageLoader = $("body").find('.preloader3');
        this.loadData();
    };//..... end of componentDidMount() .....//

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.perPage);
        this.setState({offset: offset}, () => {
            this.loadData();
        });
    };//..... end of handlePageClick() .....//

    /**
     * search Segment
     * @param e
     */
    searchData = (e) => {
        let searchData = e.target.value;
        this.setState({searchData, offset: 0, perPage: this.perPage});
    };//--- End of searchData()  ---//

    handleFilterChange = (orderBy, orderType) => {
        this.setState({orderBy, orderType}, () => {
            this.loadData();
        });
    };//--- End of () ---//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    deleteRecord = (id) => {
        this.setState(() => ({deletePunchCard: id}));
    };//..... end of deleteRecord() .....//

    handleCloseModal = () => {
        this.setState(() => ({deletePunchCard: 0}));
    };//..... end of handleCloseModal() .....//


    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.loadData();
        }
    };//--- End of enterPressed() ----//

    campaignSorting = (name, data) => {
        this.setState({filterSegment: name, orderType: data}, () => {
            this.loadData();
        });
    };//--- End of


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

    editRecord = (voucher) => {
        /*(punchCard);
        this.props.addIntegrated('integrated-edit', punchCard);*/

        if (voucher.voucher_type == "integrated")
            this.props.addVoucher('integrated-voucher', voucher);
        else if(voucher.voucher_type == 'group-voucher')
            this.props.addVoucher('group-voucher', voucher);
        else
            this.props.addVoucher('edit', voucher);
    };//..... end of editRecord() .....//

    deleteVoucher = (voucherid) =>{
        show_loader();
        axios.post(BaseUrl + `/api/delete-voucher`, {id: voucherid.id})
            .then(res => {
                show_loader(true);
                if (res.data.status) {
                    this.loadData();
                    NotificationManager.success(res.data.message, 'Success');
                } else {
                    NotificationManager.error(res.data.message, 'Error');
                }//..... end if-else() .....//
            }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    }
    openPopup = (item,condition) =>{
        this.rolePopup.style.display = "block";
        document.body.style.overflow = 'hidden';
        this.setState(()=>({voucherData:item,voucherCategory:condition}));
    }
    closePopup = () =>{
        document.body.style.overflow = 'auto';
        this.rolePopup.style.display = "none";
        this.setState(()=>({value:'',userdata:[],searchValue:[],voucherData:{}}));
        this.props.dispatch(resetVoucherData());
        var elems = document.querySelectorAll(".cL_listing_tableInn ul li");

        [].forEach.call(elems, function(el) {
            el.classList.remove("active_editMod");
        });
    }
    onSelect = (e,item) => {
        let value = e;
        let userID =item.id;
        var dataArray = this.state.userdata;
        var found = dataArray.some(function (el) {
            return el.id == item.id;
        });
        if(!found){
            dataArray.push({id:item.id,name:e})
        }
        this.setState(()=>({value,userdata:dataArray}));

    };

    onChange = (e) => {
        let value = e.target.value;
        this.setState(()=>({value:value}));
        axios.post(BaseUrl + '/api/get-user-data', {
            serchName: value
        }).then(res => {
            this.setState(()=>({searchValue:res.data.data}));
            show_loader(true);

        }).catch((err) => {
            show_loader(true);

        });
    };
    setKeyValueVoucher = (key, value) => {
        this.props.dispatch(addVoucherDefault(key, value));
    }
    removeUser =(id)=>{
        var dataArray = this.state.userdata;
        dataArray = dataArray.filter(function (obj) {
            return obj.id != id;
        });
        this.setState(()=>({userdata:dataArray}));
    }
    showHideDate = () => {

        var value=1;
        var isDay = false

        if(!this.props.is_day){
            isDay  = true;
            value = 1;
        }else{
            value =0;
        }
        if(isDay){
            this.setKeyValueVoucher('start_date',null);
            this.setKeyValueVoucher('end_date',null);
        }


        this.setKeyValueVoucher('is_day',isDay);
        this.setKeyValueVoucher('isNumberOfDays',value);
    };//..... end of showHideDate() .....//

    voucherStartDate = (date) => {
        this.setKeyValueVoucher('start_date', date);
    };//..... end of handleChangeStartDate() .....//

    voucherEndDate = (date) => {
        this.setKeyValueVoucher('end_date', date);
    };//..... end of handleChangeStartDate() .....//

    assignVoucher = () =>{
        show_loader();
        axios.post(BaseUrl + `/api/assign-voucher`, {voucherdata: this.state.voucherData,userdata:this.state.userdata,
            number_of_days:this.props.isNumberOfDays,start_date:this.props.start_date,end_date:this.props.end_date,
            company_id:CompanyID,
            quantity:this.props.quantity
        })
            .then(res => {
                show_loader(true);
                if (res.data.status) {

                    NotificationManager.success(res.data.message, 'Success');
                    this.closePopup();
                } else {
                    NotificationManager.error(res.data.message, 'Error');
                }//..... end if-else() .....//
            }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    }

    downloadCsv = (item) =>{

        window.open(
            `${BaseUrl}/api/download-voucher?id=${item.id}`,
            '_blank'
        );

    }
    render() {
        return (
            <div className="cL_listing_tableOut memberTable">

                <div className="compaign_select_search clearfix">
                    <div className="searchCompaign clearfix">
                        <div className="preloader3" style={{marginLeft: '-264px', marginTop: '0px', display: 'none'}}>&nbsp;</div>
                        <input type="text" value={this.state.searchData} placeholder="Search Voucher" className="copmpaignSearch_field" onKeyPress={this.enterPressed}  onChange={this.searchData}/>
                        <input type="submit" value="" className="copmpaignIcon_field" onClick={() => this.loadData()}/>
                    </div>
                </div>

                <div className="compaign_addNew clearfix">
                    <h3>Vouchers Listing</h3>
                    {
                        (INTEGRATED ==1) && (
                            <a className="all_blue_button" onClick={() => this.props.addIntegratedVoucher('integrated-voucher', {})}>Add Integrated Voucher</a>
                        )
                    }
                       <a className="all_blue_button" onClick={() => this.props.addGroupVoucher('group-voucher')} style={{marginRight: '10px'}}>Add Group Voucher</a>
                    {
                        (INTEGRATED ==0) && (
                            <a className="all_blue_button" onClick={this.props.addVoucher} style={{marginRight: '10px'}}>Add Voucher</a>
                        )
                    }



                </div>

                <div className="cL_listing_tableInn">
                    <HeaderComponent listData={this.state} onClick={(id, name) => this.campaignSorting(id, name)} />
                    <ul>
                        {(this.state.showListError)? <NoDataFound customMessage="Voucher" />
                            :this.state.data.map(item =>
                                <li key={item.id} className="cl_rowEdit_popOut4">
                                    <div className="cL_listing_table_row ">
                                        <div className="cL_listing_table_cell cell1">
                                            <span className="cL_rowList_number">{item.name}</span>

                                        </div>
                                        <div className="cL_listing_table_cell cell2">
                                            <span className="cL_rowList_number">{(item.discount_type !='Free')?((item.discount_type =='%')?item.amount+item.discount_type:item.discount_type+item.amount):(item.discount_type==0)?"":item.discount_type}</span>
                                        </div>
                                        <div className="cL_listing_table_cell cell3">
                                            <span className="cL_rowList_number">{(item.image)?<img style={{width: '50%'}} src={`${item.image}`}/>:<img style={{width: '20%'}} src="assets/images/dummyGroup.png"/>}</span>
                                        </div>
                                        <div className="cL_listing_table_cell cell4">
                                            <span className="cL_rowList_number" style={{marginTop: '5px', float:'left', textTransform:'capitalize'}}>{item.category}</span>
                                        </div>
                                        <div className="cL_listing_table_cell cell5">
                                            <span className="cL_rowList_number" style={{marginTop: '5px', float:'left', textTransform:'capitalize'}}>{item.voucher_type.replace(/[^a-zA-Z ]/g, " ")}</span>
                                            <a className="cl_tableRow_editDotes" onClick={this.handleButtonsShow}  style={{cursor:'pointer',float:'right', marginLeft:'85px'}}><i></i></a>
                                        </div>

                                    </div>
                                    <div className="cl_rowEdit_popOut">
                                        <div className="cl_rowEdit_pop_table">
                                            <div className="cl_rowEdit_popOut_tableRow">
                                                {
                                                    (item.category =='Public Voucher') && (
                                                        <div className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                            <a   style={{cursor:'pointer'}} onClick={()=>{this.openPopup(item,true)}}>
                                                                <strong><i>&nbsp;</i>
                                                                    Add More Quantity</strong>
                                                            </a>

                                                        </div>

                                                    )
                                                }
                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                    <a className="scheduleIcon"  style={{cursor:'pointer'}} onClick={()=>{this.downloadCsv(item)}}>
                                                        <strong><i>&nbsp;</i>Download Codes</strong>
                                                    </a>
                                                </div>
                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                    <a className="scheduleIcon"  style={{cursor:'pointer'}} onClick={(e) => {this.props.navigate(null, `/manage/voucher/${item.id}`)}}>
                                                        <strong><i>&nbsp;</i>
                                                            Report</strong>
                                                    </a>
                                                </div>

                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                    <a className="edit_icon"  style={{cursor:'pointer'}} onClick={(e) => {this.editRecord(item)}}>
                                                        <strong><i>&nbsp;</i>
                                                            {(!item.deleted_at)?'Edit/View':'View'}</strong>
                                                        </a>
                                                </div>
                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                    <a className="delete_icon"  style={{cursor:'pointer'}} onClick={(e) => {this.deleteVoucher(item)}}><strong><i>&nbsp;</i>Delete</strong></a>
                                                </div>

                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                    <a style={{cursor:'pointer'}} onClick={()=>{this.openPopup(item,false)}}>
                                                        <strong><i>&nbsp;</i>
                                                            Assign</strong>
                                                    </a>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )}
                    </ul>
                </div>

                <div className="campLstng_paginaton_out">
                    <div className="campLstng_paginaton_inn">
                        <ReactPaginate previousLabel={""} nextLabel={""} nextLinkClassName={'campPagi_next'} breakLabel={<a href="">...</a>}
                                       breakClassName={"break-me"} pageCount={this.state.pageCount} marginPagesDisplayed={2} pageRangeDisplayed={5}
                                       previousLinkClassName={'campPagi_prev'} onPageChange={this.changePages} activeClassName={"active"}/>
                    </div>
                </div>
                <div className= "popups_outer addRolePopup"  ref={(ref)=>{this.rolePopup = ref}} style={{display:"none",overflowY:' auto'}}>
                    <div className="popups_inner">
                        <div className="overley_popup close_role_popup" onClick={()=>{this.closePopup()}}></div>

                        <div className="popupDiv" style={{paddingBottom: '50px'}}>
                            <div className="contentDetail" style={{padding:'30px'}}>

                                <div className="autoContent">
                                    <div className="compaigns_list_content">
                                        <div className="add_categoryList_info2">
                                            <div className="newVualt_heading">
                                                <h3>{ (!this.state.voucherCategory)?'Assign Voucher':'Add More Quantity'}</h3>
                                            </div>

                                            <div className="categoryInfo_container clearfix">
                                                {
                                                    (!this.state.voucherCategory) &&(
                                                        <div className="numberFields numberFields_1 clearfix" style={{width:"100%"}}>
                                                            <div className="customPlaceholder_outer">
                                                                <h4 style={{'textAlign':'center'}}>Search User</h4>


                                                            </div>
                                                            <Autocomplete
                                                                getItemValue={(item) => item.label}
                                                                items={this.state.searchValue}
                                                                renderItem={(item, isHighlighted) =>
                                                                    <div key={item.id} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                                        {item.label}
                                                                    </div>
                                                                }
                                                                value={this.state.value}
                                                                onChange={(e)=>{this.onChange(e)}}
                                                                onSelect={this.onSelect}

                                                            />



                                                        </div>
                                                    )
                                                }

                                                <br/><br/>
                                                {
                                                    (!this.state.voucherCategory) &&(
                                                <table className="table table-bordered">
                                                    <thead>
                                                    <tr>
                                                        <th scope="col">User Name</th>
                                                        <th scope="col">Remove</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {this.state.userdata && (
                                                        this.state.userdata.map((item) => {
                                                            return (
                                                                <tr key={item.id}>
                                                                    <td>{item.name}</td>
                                                                    <td>
                                                                       <span style={{  fontSize: '20px'}} onClick={(e)=>{this.removeUser(item.id)}}><i  style={{color:'red'}}className="fa fa-minus-circle"></i></span>
                                                                    </td>

                                                                </tr>
                                                            )
                                                        })
                                                    )}


                                                    </tbody>
                                                </table>
                                                    )
                                                }
                                                {
                                                    (this.state.voucherCategory) && (
                                                        <div className="dropSegmentation_section">
                                                            <div className="dropSegmentation_heading clearfix">
                                                                <h3>Quantity</h3>
                                                            </div>
                                                            <div className='stateSegmentation primary_voucher_setting'>
                                                                <div className="venueIdentification_section">
                                                                    <div className="venueIdentification_form">
                                                                        <ul>
                                                                            <li>
                                                                                <div className="customInput_div">
                                                                                    <input onChange={(e) => {
                                                                                        let value = e.target.value;
                                                                                        if (value.match(/^\d*$/gm))
                                                                                            this.setKeyValueVoucher('quantity', value);
                                                                                    }} placeholder="Quantity" type="text" value={this.props.quantity ? this.props.quantity : '' }  />
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }

                                                <br/>
                                                <br/>


                                                <div className="dropSegmentation_section">
                                                    <div className="dropSegmentation_heading clearfix">
                                                        <h3>Date</h3>
                                                    </div>

                                                    <div className="stateSegmentation">
                                                        <div className="compaignDescription_outer   clearfix">
                                                            <label>Voucher is valid
                                                                <span style={{fontSize: '10px',marginLeft: '19px',fontStyle: 'italic', color: 'silver'}}>We are using Australian Eastern Standard Time (AEST), please set your time accordingly</span></label>

                                                            <div className='venueIdentification_form' >
                                                                <ul>
                                                                    <li>
                                                                        <label>Days</label>
                                                                        <ToggleSwitch

                                                                            checked={this.props.is_day ? true : false}
                                                                            onChange={(e)=> {this.showHideDate(e)}}
                                                                        />
                                                                        <span style={{fontWeight:'bold'}}> {this.props.is_day ? "ON" : "OFF"}</span>
                                                                    </li>
                                                                </ul>


                                                            </div>
                                                            <div className="voucherDiscount"   style={{display:(this.props.is_day)?'block':'none'}}>
                                                                <label style={{float: 'left',
                                                                    lineHeight: '50px',
                                                                    marginRight: '10px'}}>Expire after</label>


                                                                <div className="gammingValue_outer clearfix ">
                                                                    <div className="gamingAmount clearfix">
                                                                        <input type="text" style={{width: '100%'}} onChange={(e)=>{
                                                                            let value = e.target.value;
                                                                            if (value.match(/^\d*$/gm))
                                                                                this.setKeyValueVoucher('isNumberOfDays',value);
                                                                        }} value={this.props.isNumberOfDays?this.props.isNumberOfDays:1} />

                                                                    </div>
                                                                    <small></small>
                                                                </div>
                                                                <label>Days</label>
                                                            </div>


                                                            <div className="datePickerOuter clearfix" style={{display:(!this.props.is_day)?'block':'none'}}>
                                                                <div className="datePickerLeft">
                                                                    <strong>From</strong>
                                                                    <div className="datePicker">
                                                                        <DatePicker selected={this.props.start_date} dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm"  minDate={moment()} onChange={this.voucherStartDate}/>
                                                                    </div>
                                                                </div>
                                                                <div className="datePickerLeft frDatePicker">
                                                                    <strong>To</strong>
                                                                    <div className="datePicker">
                                                                        <DatePicker selected={this.props.end_date} dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm" minDate={this.props.start_date} onChange={this.voucherEndDate}/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="addCategoryRight_section">
                                                    <div className="addCategory_formSection portalNew_page">

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="continueCancel  listShops">
                                            <a  style={{cursor:'pointer'}}  onClick={this.assignVoucher} className={((!this.state.voucherCategory)?(this.state.userdata.length>0 && (this.props.is_day)?this.props.isNumberOfDays!='':(this.props.start_date && this.props.end_date)):(this.props.quantity>0 &&(this.props.is_day)?this.props.isNumberOfDays!='':(this.props.start_date && this.props.end_date)))?'':'disabled'}>{(!this.state.voucherCategory)?'Assign Voucher':'Add'}</a>
                                            <a  style={{cursor:'pointer'}} className="close_role_popup" onClick={()=>{this.closePopup()}}>CANCEL</a>
                                        </div>
                                    </div>

                                </div>


                            </div>


                        </div>


                    </div>
                </div>

            </div>
        );


    }//..... end of render() .....//

}//..... end of CampaignList.


const mapStateToProps = (state) => ({
    ...state.voucherBuilder
});
export default connect(mapStateToProps)(VoucherListing);