import React, {Component} from 'react';
import { DateRangePicker } from 'react-date-range';
import HeaderComponent from "../dashboard/sub_components/HeaderComponent";
import ReactPaginate from 'react-paginate';
import VoucherDetail from "../members/MemberProfile/components/vouchers/sub_components/VoucherDetail";
import {resetSegmentSearch} from "../../../redux/actions/CampaignBuilderActions";
import {NotificationManager} from "react-notifications";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import NoDataFound from "../../../_partials/NoDataFound";
import QRCode from 'qrcode.react';
class VoucherReport extends Component {
    rolePopup = null;
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    state = {
        headerList: [{"id": "1", "name": 'Voucher ID', 'filterName': '_id'}, {"id": "2", "name": 'Issue Date', 'filterName': 'dateadded'},
            {"id": "3", "name": 'Business', 'filterName': 'business_name','disable_sort': true}, {"id": "4", "name": 'Voucher Name', 'filterName': 'promotion_text','disable_sort': true},
            {"id": "5", "name": 'Value', 'filterName': 'voucher_amount', 'disable_sort': true}, {"id": "6", "name": "Status", "filterName": "voucher_status", 'disable_sort': true},{"id": "7", "name": "Email", "filterName": "persona_id", 'disable_sort': true},{"id": "8", "name": "Client Number", "filterName": "persona_id", 'disable_sort': true},{"id": "9", "name": "Revoke voucher", "filterName": "persona_id", 'disable_sort': false}],
        vouchers : [],
        totalVouchers: 0,
        offset: 0,
        perPage: 50,
        orderType: 'asc',
        filterSegment: 'dateadded',
        showAll : false,
        showListError : false,
        search : '',
        start_date : '',
        end_date : '',
        selection:{
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
            showSelectionPreview:true
        },
        showDatePicker : false,
        selectDate : false,
        disableData:false,
        voucherID:'',
        userID:'',
        deleteMember:0,
        voucher_name:'',
        qrcode:'',
        code:''
    };

    componentDidMount = () => {
        this.loadAllVouchers();
    };

    loadAllVouchers =() =>{
        show_loader(false);
        axios.post(BaseUrl + '/api/get-all-vouchers', {
            'company_id': CompanyID,
            'venue_id': VenueID,
            'pageSize': this.state.perPage,
            'search':this.state.search,
            'offSet': this.state.offset,
            'sorting': this.state.filterSegment,
            'sortingOrder': this.state.orderType,
            'start_date' : this.state.start_date,
            'end_date' : this.state.end_date,
            'voucher_id':this.props.voucher_id
        }).then(res => {
            if (res.data.status) {
                this.setState(()=>({
                    vouchers : res.data.data,
                    totalVouchers: res.data.count / this.state.perPage,
                    voucher_name: res.data.voucher_name
                }),()=>{
                    show_loader(true);
                })


            } else {

                show_loader(true);
                this.setState({showListError: true});
            }
        }).catch((err) => {

            show_loader(true);
            this.setState({showListError: true});
        });
    }//------ End of loadAllVouchers() ------//

    changeDateFormat = (data) => {
        if(data){
            return moment(data).format("DD/MM/YYYY");
        } else {
            return '';
        }
    };


    changeActiveStatus = (item) => {
        var changed_data = [];
        this.state.vouchers.map(function (obj) {
            if(obj.id === item.id){
                if(obj.active === true){
                    obj.active = false;
                } else {
                    obj.active = true;
                }
            }
            changed_data.push(obj);
        });
        this.setState({vouchers : changed_data});
    };

    changePageData = (data) => {
        this.setState({offset: Math.ceil(data.selected * this.state.perPage)}, () => this.loadAllVouchers());
    };


    addSearchResult = (e) => {
        var value= e.target.value;

        this.setState(() => ({
            search: value
        }), () => {
            this.loadAllVouchers();

        })

    };

    expandAll = (item) => {
        if(this.state.showAll){
            this.setState({showAll : false}, () => {this.getUpdatedVouchers()});
        }
        else {
            this.setState({showAll : true}, () => {this.getUpdatedVouchers()})
        }
    };
    dateInputClick = () => {
        this.setState({showDatePicker: true});
    };
    hideDatePicker = () => {
        this.setState({showDatePicker: false, selectDate: false, start_date : '', end_date : '',offset:0}, () => {this.loadAllVouchers()});
    };

    getUpdatedVouchers = () => {
        var changed_data = [];
        this.state.vouchers.map((obj) => {
            obj.active = this.state.showAll ===  true ? true : false;
            changed_data.push(obj);
        });
        this.setState({vouchers : changed_data});
    };

    handleSelect = (ranges) => {
        const mySelection = (ranges.selection);
        this.setState({
            selection:mySelection,
            start_date : moment(mySelection.startDate).format("YYYY-MM-DD"),
            end_date : moment(mySelection.endDate).format("YYYY-MM-DD"),
            selectDate:true
        });
    };
    dateFilter = () => {
        if(!this.state.selectDate){
            NotificationManager.warning("Please select date", 'Missing Fields');
        } else {
            if(this.state.start_date !== '' || this.state.end_date !== ''){
                this.setState({offset:0}, () => {this.setState({showDatePicker: false, selectDate: true}, () => {this.loadAllVouchers();});});
            } else {
                this.setState({showDatePicker: false, selectDate: true}, () => {this.loadAllVouchers();});
            }
        }
    };

    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.loadAllVouchers();
        }
    };//--- End of enterPressed() ----//

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

    revokedUserVoucher = (vouchercode,userid)=>{

        this.setState((prevState)=>({disableData:!prevState.disableData,voucherID:vouchercode,userID:userid,deleteMember:1}),()=>{

        });

    }
    handleDelete = () =>{
        axios.post(BaseUrl + '/api/delete-user-vouchers',{voucherID:this.state.voucherID,userid:this.state.userID})
            .then(response => {
                if(response.status){
                    NotificationManager.success(response.data.message, 'success',1500);
                    this.setState((prevState)=>({disableData:!prevState.disableData,deleteMember: 0}),()=>{
                        this.loadAllVouchers()
                    });
                }else{
                    NotificationManager.error('Error occurred while saving record.', 'error',1500);
                }
            }).catch((err) => {
            NotificationManager.error("Error occurred while saving data.", 'Error',1500);
        });
    }
    handleCloseModal = () => {
        this.setState((prevState) => ({deleteMember: 0,disableData:!prevState.disableData}));
    };

    openPopup = (data,itemdata) => {

        this.rolePopup.style.display = "block";
        document.body.style.overflow = 'hidden';
        this.rolePopup.style.overflow = "auto";

    };
    closePopup = () => {
        document.body.style.overflow = 'auto';
        this.rolePopup.style.display = "none";
        this.setState(()=>({
            qrcode:'',
            code:''
        }))
    };
    generate = ()=>{
        this.setState(()=>({
            qrcode:'GBK-'+this.state.code
        }))
    }

    handleChange = (code) => {
        this.setState(()=>({
            code:code
        }));
    };
    render() {
        return (
            <div>
                <div className="categoryInfo_container clearfix">
                    <div >
                        <div className="edit_category_rightDetail removeHighlights">
                            <div className="e_transactions_main">
                                <div className="backSave_buttons ">
                                    <ul>
                                        <li>

                                            <a  style={{cursor:'pointer'}} className="selecBttn" onClick={()=>{this.openPopup('new','')}}>Generate Qrcode</a>

                                        </li>
                                    </ul>
                                </div>
                                <div className="searchCompaign clearfix">
                                    <div className="preloader3" style={{marginLeft: '-104px', marginTop: '0px', display: 'none'}}>&nbsp;</div>
                                    <input type="text" placeholder="Search " value={this.state.search}
                                           onChange={(e) => this.setState({search: e.target.value, offset: 0})}
                                           onKeyPress={this.enterPressed} className="copmpaignSearch_field" style={{'borderBottom': '1px solid lightgray'}}/>
                                    <input type="submit" value="" className="copmpaignIcon_field" onClick={() => this.addSearchResult()} />
                                </div>

                                <div className="e_transaction_list">
                                    <div className="e_all_trans_heading">
                                        <h4>{(this.state.voucher_name !='')?this.state.voucher_name:'Vouchers LIST'}</h4>
                                    </div>
                                    <div className="listing_floating_row clearfix">
                                        <div className="fieldIncremnt">
                                            <div className="quantity clearfix">
                                                <input
                                                    onChange={(e) => {
                                                        this.setState({
                                                            perPage: e.target.value,
                                                            offset: 0
                                                        }, () => {
                                                        });
                                                    }}
                                                    onKeyUp={(e)=>{
                                                        if(e.key === 'Enter') {
                                                            this.setState(()=>({randomKey: Math.floor(Math.random() * 11)}),()=>{
                                                                this.loadAllVouchers()
                                                            });

                                                        }
                                                    }}
                                                    min={5} step={5} max={100} value={this.state.perPage}
                                                    type="number" />
                                                <div className="quantity-nav">
                                                    <div
                                                        onClick={() => this.setState({
                                                            perPage: ((this.state.perPage) + (1)),
                                                            offset: 0
                                                        }, () => {
                                                            this.loadAllVouchers()
                                                        })}
                                                        className="quantity-button quantity-up"/>
                                                    <div
                                                        onClick={() => this.setState({
                                                            perPage: ((this.state.perPage) - (1)),
                                                            offset: 0
                                                        }, () => {
                                                            this.loadAllVouchers()
                                                        })}
                                                        className="quantity-button quantity-down"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="expand_button"><a onClick={this.expandAll}
                                                                          style={{cursor:'pointer','opacity':'1'}}>
                                            {this.state.showAll ? 'Collapse All' : 'Expand All'}</a></div>
                                        <div className="grid_searching clearfix date_range_changes">
                                            <input onFocus={this.dateInputClick}
                                                   placeholder=''
                                                   className="searchInput cursor_style" type="text" value={(this.state.selectDate)?(moment(this.state.selection.startDate).format('ll') + ' - ' + moment(this.state.selection.endDate).format('ll')):'Select Date'} readOnly/>
                                            <ul>
                                                <li className="searching_li">
                                                    <div className="searching clearfix" style={this.state.showDatePicker ? {display: 'block'} : {display: 'none'}}>
                                                        <DateRangePicker className="rdrDateRangeWrapper"
                                                                         ranges={[this.state.selection]}
                                                                         onChange={this.handleSelect}/>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>


                                        <div className="e_member_printBtns clearfix filter_btns" style={this.state.showDatePicker ? {display: 'block', 'marginTop':'-57px'} : {display: 'none'}}>
                                            <ul>
                                                <li><a  onClick={this.dateFilter}  href="javascript:void(0);">APPLY</a></li>
                                                <li><a onClick={this.hideDatePicker}  href="javascript:void(0);">CLEAR</a></li>
                                            </ul>
                                        </div>
                                    </div>

                                    {this.state.showListError ?
                                       <NoDataFound customMessage="Voucher"/>
                                        :
                                        <div ref={'printable_area'} className="category_list_outer trans_listing" id='printableArea'>
                                            <div className="cL_listing_tableInn longText">
                                                <HeaderComponent listData={this.state}
                                                                 onClick={(id, name) => this.setState({
                                                                     filterSegment: id,
                                                                     orderType: name
                                                                 }, () => this.loadAllVouchers())}/>

                                                <ul>
                                                    {
                                                        this.state.vouchers.map((item) => {
                                                            return <li key={item.id}>
                                                                <div className="e_transaction_accordion">
                                                                    <div
                                                                        className={item.active ? 'e_transaction_accordionTitle active' : 'e_transaction_accordionTitle'}>
                                                                        <div
                                                                            className="listDataShowing">
                                                                            <div className="cL_listing_table_row">
                                                                                <div  className="cL_listing_table_cell cell1"  onClick={() => {
                                                                                    this.changeActiveStatus(item)
                                                                                }}>
                                                                                           <span
                                                                                               className="cL_rowList_number">{item.voucher_code}</span>
                                                                                   {/* <span style={{ fontSize: '20px', marginRight: '10px'}} onClick={(e) => {this.props.navigate(null, `/qrcode/${btoa('GBK-'+item.voucher_code)}`)}}><i
                                                                                        className="fa fa-plus-square" style={{  marginRight: 'green'}}
                                                                                        aria-hidden="true"></i></span>*/}
                                                                                </div>
                                                                                <div
                                                                                    onClick={() => {
                                                                                        this.changeActiveStatus(item)
                                                                                    }}  className="cL_listing_table_cell cell2">
                                                                                           <span
                                                                                               className="cL_rowList_number">{this.changeDateFormat(item.created_at)}</span>
                                                                                </div>
                                                                                <div
                                                                                    onClick={() => {
                                                                                        this.changeActiveStatus(item)
                                                                                    }} className="cL_listing_table_cell cell3">
                                                                                           <span
                                                                                               className="cL_rowList_number">{(item.user_voucher.length>0)?((item.user_voucher[0].hasOwnProperty('business') ) ? (( JSON.parse(item.user_voucher[0].business).business_name != '' )?JSON.parse(item.user_voucher[0].business).business_name:'') : ''):''}</span>
                                                                                </div>
                                                                                <div
                                                                                    onClick={() => {
                                                                                        this.changeActiveStatus(item)
                                                                                    }} className="cL_listing_table_cell cell4">
                                                                                           <span
                                                                                               className="cL_rowList_number">{(item.user_voucher.length>0)?(item.user_voucher[0].hasOwnProperty('name') ? item.user_voucher[0].name : ''):''}</span>
                                                                                </div>
                                                                                <div
                                                                                    onClick={() => {
                                                                                        this.changeActiveStatus(item)
                                                                                    }} className="cL_listing_table_cell cell5">
                                                                                                        <span
                                                                                                            className="cL_rowList_number ">{(item.user_voucher.length>0)?((item.user_voucher[0].discount_type !=='Free')?item.user_voucher[0].amount+item.user_voucher[0].discount_type:item.user_voucher[0].discount_type):0}</span>

                                                                                </div>
                                                                                <div
                                                                                    onClick={() => {
                                                                                        this.changeActiveStatus(item)
                                                                                    }} className="cL_listing_table_cell cell6">
                                                                                           <span
                                                                                               className="cL_rowList_number padingLeft0"><i
                                                                                               className={item.voucher_status === 'Redeemed' || (item.voucher_status === 'Expired') || (item.voucher_status === 'Inactive') ? 'completed_voucher' : 'activeRedeemed'}>&nbsp;</i>{item.voucher_status}</span>
                                                                                </div>
                                                                                <div
                                                                                    onClick={() => {
                                                                                        this.changeActiveStatus(item)
                                                                                    }} className="cL_listing_table_cell cell3">
                                                                                           <span
                                                                                               className="cL_rowList_number ">{(item.users.length>0)?item.users[0].email:''}</span>
                                                                                </div>
                                                                                <div
                                                                                    onClick={() => {
                                                                                        this.changeActiveStatus(item)
                                                                                    }}className="cL_listing_table_cell cell3">
                                                                                           <span
                                                                                               className="cL_rowList_number">{(item.users.length>0)?item.users[0].client_customer_id:''}</span>

                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell3">
                                                                                           <span
                                                                                               className="cL_rowList_number">{(item.voucher_status == 'Active')? <a className={(this.state.disableData)?'btn-success disabled':'btn-success'} onClick={(e)=>{this.revokedUserVoucher(item.voucher_code,item.user_id)}}>Revoke Voucher</a>:''}</span>

                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </div>


                                                                    {item.active ?
                                                                        <VoucherDetail
                                                                            voucher={item} listProducts={true}/> : ''}

                                                                </div>


                                                            </li>
                                                        })
                                                    }

                                                </ul>
                                            </div>
                                        </div>
                                    }
                                    {this.state.showListError ? '' :
                                        <div className="campLstng_paginaton_out">
                                            <div className="campLstng_paginaton_inn">
                                                <ReactPaginate previousLabel={""} nextLabel={""}
                                                               nextLinkClassName={'campPagi_next'}
                                                               breakLabel={<a href="">...</a>}
                                                               breakClassName={"break-me"}
                                                               pageCount={this.state.totalVouchers}
                                                               marginPagesDisplayed={2}
                                                               pageRangeDisplayed={5}
                                                               previousLinkClassName={'campPagi_prev'}
                                                               onPageChange={this.changePageData}
                                                               activeClassName={"active"}/>
                                            </div>
                                        </div>
                                    }

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className= "popups_outer addRolePopup" ref={(ref)=>{this.rolePopup = ref}} style={{display:"none"}}>
                    <div className="popups_inner">
                        <div className="overley_popup close_role_popup" onClick={()=>{this.closePopup()}}></div>

                        <div className="popupDiv">
                            <div className="contentDetail" style={{padding:'30px'}}>

                                <div className="autoContent">
                                    <div className="compaigns_list_content">
                                        <div className="add_categoryList_info2">
                                            <div className="newVualt_heading">
                                                <h3>Generate Qrcode</h3>
                                            </div>

                                            <div className="categoryInfo_container clearfix">

                                                <div className="addCategoryRight_section">
                                                    <div className="addCategory_formSection portalNew_page">
                                                        <ul>
                                                            <li>
                                                                <div className="customPlaceholder_outer">
                                                                    <h4>Voucher Code</h4>
                                                                    <div className="customPlaceholder">
                                                                        <input type="text" value={this.state.code} onChange={(e)=>{this.handleChange(e.target.value)}} placeholder="Voucher Code" name="qrcode"/>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                {(this.state.qrcode !='') && (
                                                                    <QRCode size={400} value={this.state.qrcode} />
                                                                )}
                                                            </li>



                                                        </ul>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="continueCancel  listShops">
                                                <a  style={{cursor:'pointer'}} className={(this.state.code =='')?'disabled':''} onClick={this.generate}>Generate</a>
                                                <a  style={{cursor:'pointer'}} className="close_role_popup" onClick={()=>{this.closePopup()}}>CANCEL</a>
                                            </div>
                                        </div>

                                    </div>

                                </div>


                            </div>


                        </div>


                    </div>
                </div>
                <ConfirmationModal isOpen={!!this.state.deleteMember} handleCloseModal={this.handleCloseModal} text={'Voucher. You will not see this voucher.'} handleDeleteItem={this.handleDelete}/>
            </div>

        );
    }//..... end of render() .....//
}

export default VoucherReport;