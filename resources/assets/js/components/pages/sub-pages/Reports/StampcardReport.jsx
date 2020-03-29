import React, {Component} from 'react';
import { DateRangePicker } from 'react-date-range';
import HeaderComponent from "../dashboard/sub_components/HeaderComponent";
import ReactPaginate from 'react-paginate';
import Autocomplete from  'react-autocomplete';
import StampCardDetail from "../members/MemberProfile/components/stamp_cards/sub_components/StampCardDetail";
import { Scrollbars } from 'react-custom-scrollbars';
import {NotificationManager} from "react-notifications";
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import NoDataFound from "../../../_partials/NoDataFound";
class StampcardReport extends Component{
    rolePopup = null;saveRoleButton = null;
    customDropDownSpanRef = null;
    customDropDownShowRef = null;

    state = {
        headerList: [{"id": "1", "name": 'Date', 'filterName': 'created_at'},
            {"id": "2", "name": 'Business', 'filterName': 'business_name', 'disable_sort': true}, {"id": "3", "name": 'Name', 'filterName': 'name'},
            {"id": "4", "name": 'Stamps', 'filterName': 'stamps', 'disable_sort': true},{"id": "5", "name": "Status", "filterName": "status", 'disable_sort': true},{"id": "6", "name": 'First Name', 'filterName': 'stamps', 'disable_sort': true},{"id": "7", "name": 'Last Name'},{"id": "8", "name": "Email", "filterName": "persona_id", 'disable_sort': true},{"id": "9", "name": "Client Number", "filterName": "persona_id", 'disable_sort': true},{"id": "10", "name": "Actions"}],
        stamp_cards : [],
        totalStampCards: 0,
        offset: 0,
        perPage: 50,
        orderType: 'asc',
        filterSegment: 'dateadded',
        showAll : false,
        showListError : false,
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
        randomKey: Math.floor(Math.random() * 11),
        search : '',
        stampassign:'',
        status: "",
        value:"",
        searchValue:[],
        punchCardData:[],
        stampcard:'',
        userID:'',
        stampid:'',
        autoChecked : false,
        disbaleBtn:true,
        company_id:CompanyID
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidMount = () => {
        this.loadStampCards();
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    loadStampCardData = ()=>{
        let url = BaseUrl + '/api/get-all-stampcard/'+CompanyID;

        axios.get(url).then(res => {
            if (res.data.status) {
                this.setState({
                    punchCardData:res.data.data
                });
                show_loader(true);
            } else {

                show_loader(true);
                this.setState({showListError: true});
            }
        }).catch((err) => {

            show_loader(true);
            this.setState({showListError: true});
        });
    }
    loadStampCards = () => {

        show_loader();
        let url = BaseUrl + '/api/get-all-stamps';

        axios.post(url, {
            'company_id': CompanyID,
            'venue_id': VenueID,
            'pageSize': this.state.perPage,
            'offSet': this.state.offset,
            'sorting': this.state.filterSegment,
            'search':this.state.search,
            'sortingOrder': this.state.orderType,
            'persona_id' : this.props.persona_id,
            'start_date' : this.state.start_date,
            'end_date' : this.state.end_date
        }).then(res => {

            if (res.data.status) {

                this.setState(()=>({
                    stamp_cards: res.data.data,
                    totalStampCards: res.data.count / this.state.perPage,
                    showListError: false,
                }));
                show_loader(true);
            } else {

                show_loader(true);
                this.setState({showListError: true});
            }
        }).catch((err) => {

            show_loader(true);
            this.setState({showListError: true});
        });
    };

    changePageData = (data) => {
        this.setState({offset: Math.ceil(data.selected * this.state.perPage)}, () => this.loadStampCards());
    };

    changeDateFormat = (data) => {
        if(data){
            return moment(data).format("DD/MM/YYYY");
        } else {
            return '';
        }
    };

    stampCardActiveStatus = (stampCard) => {
        if(stampCard.punch_card_count === stampCard.quantity){
            return 'Completed';
        }
        else {
            return 'Active';
        }
    };

    changeActiveStatus = (item) => {
        var changed_data = [];
        this.state.stamp_cards.map(function (obj) {
            if(obj.id === item.id){
                if(obj.active === true){
                    obj.active = false;
                } else {
                    obj.active = true;
                }
            }
            changed_data.push(obj);
        });
        this.setState({stamp_cards : changed_data});
    };

    expandAll = (item) => {
        if(this.state.showAll){
            this.setState({showAll : false}, () => {this.getUpdatedStampCards()});
        }
        else {
            this.setState({showAll : true}, () => {this.getUpdatedStampCards()})
        }
    };

    getUpdatedStampCards = () => {
        var changed_data = [];
        this.state.stamp_cards.map((obj) => {
            obj.active = this.state.showAll ===  true ? true : false;
            changed_data.push(obj);
        });
        this.setState({stamp_cards : changed_data});
    };
    handleSelect = (ranges) => {
        const mySelection = (ranges.selection);
        this.setState({
            selection:mySelection,
            start_date : moment(mySelection.startDate).format("YYYY-MM-DD"),
            end_date : moment(mySelection.endDate).format("YYYY-MM-DD"),
            selectDate : true
        });

    };
    dateFilter = () => {
        if(!this.state.selectDate){
            NotificationManager.warning("Please select date", 'Missing Fields');
        } else {
            if(this.state.start_date !== '' || this.state.end_date !== ''){
                this.setState({offset:0}, () => {this.setState({showDatePicker: false, selectDate: true}, () => {this.loadStampCards();});});
            } else {
                this.setState({showDatePicker: false, selectDate: true}, () => {this.loadStampCards()();});
            }
        }
    };

    dateInputClick = () => {
        this.setState({showDatePicker: true});
    };
    hideDatePicker = () => {
        this.setState({showDatePicker: false, selectDate: false, start_date : '', end_date : '',offset:0}, () => {this.loadStampCards()});
    };
    printDiv = (divName) => {
        PrintTool.printExistingElement("#"+divName);
    };


    addSearchResult = (e) => {
        var value= e.target.value;

        this.setState(() => ({
            search: value
        }), () => {
            this.loadStampCards();

        })

    };

    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.loadStampCards();
        }
    };//--- End of enterPressed() ----//


    openPopup = (data,itemdata) => {

        if(data =='new') {
            $("#listRoles").html('');
            this.loadStampCardData();
            this.setState(() => ({
                stampassign: '',
                value: '',
                stampcard: '',
                stampid: '',
                userID: '',
                autoChecked: false,
                disbaleBtn:true,
                company_id:CompanyID
            }), () => {
                this.rolePopup.style.display = "block";

            });
        }else{
            this.setState(() => ({
                stampassign: '',
                value: itemdata.user.user_first_name+' '+itemdata.user.user_family_name,
                stampcard: itemdata.stamp[0].name,
                stampid:itemdata.stamp[0].id,
                userID: itemdata.user.user_id,
                autoChecked: (data =='add')?false:true,
                disbaleBtn:false,
                company_id:itemdata.stamp[0].company_id
            }), () => {
                this.rolePopup.style.display = "block";

            });
        }

    };

    closePopup = () => {
        this.rolePopup.style.display = "none";
    };


    onSelect = (e,item) => {
        let value = e;
       let userID =item.id;
        this.setState(()=>({value,userID}));

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

    handleDropDownSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRef.style.display = this.customDropDownShowRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownSpanClick() .....//

    setValueSelected = (value) => {

        this.setState(() => ({
            stampcard: value.label,
            stampid:value.id
        }), () => {


        });
        this.customDropDownShowRef.style.display = 'none';
        this.customDropDownSpanRef.classList.remove('changeAero');
    };//..... end of setValueSelected() ......//
    handleToStampCard = (e) => {
        let value = e.target.value;
        this.setState({
            stampassign: value
        });

    };//..... end of handleToIputs() ......//
    assignPunchCard = () =>{
        if(this.state.userID.length == 0){
            NotificationManager.error('Please select user', 'error',1500);
            return false;
        }
        if(this.state.stampid.length == 0){
            NotificationManager.error('Please select stampcard', 'error',1500);
            return false;
        }
        if(this.state.stampassign.length == 0){
            NotificationManager.error('Please provide stamps', 'error',1500);
            return false;
        }
        show_loader();
        let url = BaseUrl + '/api/assign-stamp-card';

        axios.post(url, {
            stampassign:this.state.stampassign,
            stampid:this.state.stampid,
             userID:this.state.userID,
            addStamps:this.state.autoChecked,
            company_id: this.state.company_id,
            notify:false,
            assign_through : 'Manual'
        }).then(res => {
            if (res.data.status) {
                this.rolePopup.style.display = "none";
                show_loader(true);
                this.loadStampCards();

            } else {

                show_loader(true);
                this.setState({showListError: true});
            }
        }).catch((err) => {

            show_loader(true);
            this.setState({showListError: true});
        });
    };
    autoChecked = (e) => {
        this.setState((prevState)=>({autoChecked:!prevState.autoChecked}));
    };//..... end of handleMembersCap() .....//
    render() {
        const selectionRange = {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        };
        return (
            <div>
                <div className="categoryInfo_container clearfix">
                    <div >
                        <div className="edit_category_rightDetail removeHighlights">
                            <div className="e_transactions_main">
                                <div className="backSave_buttons ">
                                    <ul>
                                        <li>

                                            <a  style={{cursor:'pointer'}} className="selecBttn" onClick={()=>{this.openPopup('new','')}}>Change Stamps</a>

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
                                        <h4>STAMP CARD LIST</h4>
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
                                                                this.loadStampCards()
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
                                                            this.loadStampCards()
                                                        })}
                                                        className="quantity-button quantity-up"/>
                                                    <div
                                                        onClick={() => this.setState({
                                                            perPage: ((this.state.perPage) - (1)),
                                                            offset: 0
                                                        }, () => {
                                                            this.loadStampCards()
                                                        })}
                                                        className="quantity-button quantity-down"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="expand_button"><a onClick={this.expandAll}
                                                                          style={{cursor:'pointer'}}>
                                            {this.state.showAll ? 'Collapse All' : 'Expand All'}</a></div>
                                        <div className="grid_searching clearfix date_range_changes">
                                            <input onFocus={this.dateInputClick}
                                                   placeholder=''
                                                   className="searchInput cursor_style" type="text" value={(this.state.selectDate)?(moment(this.state.selection.startDate).format('ll') + ' - ' + moment(this.state.selection.endDate).format('ll')):'Select Date'} readOnly/>

                                            <ul>
                                                <li className="searching_li">
                                                    <div className="searching clearfix" style={this.state.showDatePicker ? {display: 'block'} : {display: 'none'}}>
                                                        <DateRangePicker className='"rdrDateRangeWrapper"'
                                                                         ranges={[this.state.selection]}
                                                                         onChange={this.handleSelect}/>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="e_member_printBtns clearfix filter_btns" style={this.state.showDatePicker ? {display: 'block'} : {display: 'none'}}>
                                            <ul>
                                                <li><a onClick={this.dateFilter} className="" href="javascript:void(0);">APPLY</a></li>
                                                <li><a onClick={this.hideDatePicker} className="" href="javascript:void(0);">CLEAR</a></li>
                                            </ul>
                                        </div>
                                    </div>

                                    {this.state.showListError ?
                                      <NoDataFound customMessage='Stamp Report'/>
                                        :
                                        <div className="category_list_outer trans_listing" id='printableArea'>
                                            <div className="cL_listing_tableInn longText">
                                                <HeaderComponent listData={this.state}
                                                                 onClick={(id, name) => this.setState({
                                                                     filterSegment: id,
                                                                     orderType: name
                                                                 }, () => this.loadStampCards())}/>

                                                <ul>
                                                    {
                                                        this.state.stamp_cards.map((item) => {
                                                            return <li key={item.id}>
                                                                <div
                                                                    className="e_transaction_accordion"
                                                                >
                                                                    <div
                                                                        className={item.active ? 'e_transaction_accordionTitle active' : 'e_transaction_accordionTitle'}>
                                                                        <div
                                                                            className="listDataShowing">
                                                                            <div
                                                                                 className="cL_listing_table_row">
                                                                                <div
                                                                                    className="cL_listing_table_cell cell1  " onClick={() => {
                                                                                    this.changeActiveStatus(item)
                                                                                }}>
                                                                                           <span
                                                                                               className="cL_rowList_number ">{item.created_at}</span>
                                                                                </div>

                                                                                <div
                                                                                    className="cL_listing_table_cell cell2  " onClick={() => {
                                                                                    this.changeActiveStatus(item)
                                                                                }}>
                                                                                           <span
                                                                                               className="cL_rowList_number ">{(item.hasOwnProperty("stamp") && item.stamp.length>0) ? ((item.stamp[0].hasOwnProperty("business") && (Object.keys(JSON.parse(item.stamp[0].business)).length !=0))?JSON.parse(item.stamp[0].business).business_name:'') : ''}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell3  " onClick={() => {
                                                                                    this.changeActiveStatus(item)
                                                                                }}>
                                                                                           <span
                                                                                               className="cL_rowList_number ">{(item.hasOwnProperty("stamp") && item.stamp.length>0) ?item.stamp[0].name:''}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell4  " onClick={() => {
                                                                                    this.changeActiveStatus(item)
                                                                                }}>
                                                                                           <span
                                                                                               className="cL_rowList_number ">{item.available_stamp}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell5  " onClick={() => {
                                                                                    this.changeActiveStatus(item)
                                                                                }}>
                                                                                           <span
                                                                                               className="cL_rowList_number padingLeft0"><i
                                                                                               className={'activeRedeemed'}>&nbsp;</i>{'Active'}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell6  " onClick={() => {
                                                                                    this.changeActiveStatus(item)
                                                                                }}>
                                                                                           <span
                                                                                               className="cL_rowList_number ">{(item.user)?item.user.user_first_name:''}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell3  " onClick={() => {
                                                                                    this.changeActiveStatus(item)
                                                                                }}>
                                                                                           <span
                                                                                               className="cL_rowList_number ">{(item.user)?item.user.user_family_name:''}</span>
                                                                                </div>

                                                                                <div
                                                                                    className="cL_listing_table_cell cell3 " onClick={() => {
                                                                                    this.changeActiveStatus(item)
                                                                                }}>
                                                                                           <span
                                                                                               className="cL_rowList_number ">{(item.user)?item.user.email:''}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell3" onClick={() => {
                                                                                    this.changeActiveStatus(item)
                                                                                }}>
                                                                                           <span
                                                                                               className="cL_rowList_number ">{(item.user)?item.user.client_customer_id:''}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell3">
                                                                                           <span className="cL_rowList_number ">
                                                                                               <span style={{  fontSize: '20px', marginRight: '10px'}}><i className="fa fa-plus-circle" aria-hidden="true" style={{color:'green'}} onClick={()=>{this.openPopup('add',item)}}></i></span>
                                                                                               <span style={{  fontSize: '20px'}}><i className="fa fa-minus-circle" aria-hidden="true" style={{color:'red'}} onClick={()=>{this.openPopup('minus',item)}}></i></span></span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {item.active ?
                                                                        <StampCardDetail
                                                                            stamp={item} showReport={true}/> : ''}

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
                                                <ReactPaginate key={this.state.randomKey} previousLabel={""} nextLabel={""}
                                                               nextLinkClassName={'campPagi_next'}
                                                               breakLabel={<a href="">...</a>}
                                                               breakClassName={"break-me"}
                                                               pageCount={this.state.totalStampCards}
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
                            <div className= "popups_outer addRolePopup" ref={(ref)=>{this.rolePopup = ref}} style={{display:"none"}}>
                                <div className="popups_inner">
                                    <div className="overley_popup close_role_popup" onClick={()=>{this.closePopup()}}></div>

                                    <div className="popupDiv">
                                        <div className="contentDetail" style={{padding:'30px'}}>

                                            <div className="autoContent">
                                                <div className="compaigns_list_content">
                                                    <div className="add_categoryList_info2">
                                                        <div className="newVualt_heading">
                                                            <h3>Change Stamps</h3>
                                                        </div>

                                                        <div className="categoryInfo_container clearfix">

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
                                                            <br/><br/>
                                                            <div className="compaignDescription_outer clearfix">
                                                                <label>Punch Card</label>
                                                                <div className="placeHolderOuter expandPlaceholder clearfix">
                                                                    <div className="customDropDown">
                                                                        <span onClick={this.handleDropDownSpanClick} ref={ref => this.customDropDownSpanRef = ref}> {this.state.stampcard ? this.state.stampcard : 'Select Punch Card'}</span>
                                                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                                                {
                                                                                    this.state.punchCardData.map((ms) => {
                                                                                        return <li key={ms.id} onClick={(e)=> {this.setValueSelected(ms)}}
                                                                                                   className={(this.state.stampcard === ms.label) ? 'selectedItem' : ''}>{ms.label}</li>
                                                                                    })
                                                                                }
                                                                            </Scrollbars>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <br/>
                                                            <br/>
                                                            <div>
                                                                <div className="customPlaceholder_outer1">
                                                                    <h4>Add/Minus stamps</h4>

                                                                    <div className="mycustom_placeholder1">
                                                                        <span style={{fontWeight:'bold'}}></span><ToggleSwitch
                                                                        checked={this.state.autoChecked}
                                                                        onChange={(e)=> {(!this.state.disbaleBtn)?'':this.autoChecked(e)}}
                                                                        disabled={!this.state.disbaleBtn}
                                                                    />
                                                                        <span style={{fontWeight:'bold'}}> {this.state.autoChecked ? "MINUS" : "ADD"}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="customPlaceholder_outer1">
                                                                    <h4>No Of Stamps</h4>

                                                                    <div className="mycustom_placeholder" >
                                                                        <input type="text" style={{width: '100%'}}
                                                                               onChange={(e) => {
                                                                                   let value = e.target.value;
                                                                                   if (value.match(/^\d*$/gm))
                                                                                       this.handleToStampCard(e)
                                                                               }}
                                                                               value={this.state.stampassign}/>
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
                                                        <a  style={{cursor:'pointer'}}  onClick={this.assignPunchCard}>Save</a>
                                                        <a  style={{cursor:'pointer'}} className="close_role_popup" onClick={()=>{this.closePopup()}}>CANCEL</a>
                                                    </div>
                                                </div>

                                            </div>


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
}

export default StampcardReport;