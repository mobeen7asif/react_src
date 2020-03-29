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
import RedeemptionDetail from "./subcomponent/RedeemptionDetail";
import NoDataFound from "../../../_partials/NoDataFound";
class CampaignReporting extends Component{


    state = {
        headerList: [{"id": "1", "name": 'Date', 'filterName': 'timestamp'},
           {"id": "2", "name": 'Campaign Name', 'filterName': 'campaing_id'},
            {"id": "3", "name": 'User Name', 'filterName': 'user_id'},{"id": "4", "name": "Email", "filterName": "user_id"},{"id": "5", "name": 'Member ID', 'filterName': 'user_id'},{"id": "6", "name": 'Status', 'filterName': 'event'}],
       company_id:CompanyID,
        perPage:1,
        search:'',
        offset:0,
        sorting:'timestamp',
        orderType:'DESC',
        campaignData:[]
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidMount = () => {
        this.loadCampaignReport();
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    loadCampaignReport = ()=>{

        let url = BaseUrl + '/api/campaign-report';

        axios.post(url, {
            'company_id': CompanyID,
            'venue_id': VenueID,
            'pageSize': this.state.perPage,
            'search':this.state.search,
            'offSet': this.state.offset,
            'sorting': this.state.sorting,
            'sortingOrder': this.state.orderType,
        }).then(res => {
            if (res.data.status) {

                this.setState(() => ({
                    campaignData:res.data.data,
                    totalCampaigns: res.data.count / this.state.perPage,
                }), () => {
                })

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

    changeActiveStatus = (item) => {
        var changed_data = [];
        this.state.redemptionData.map(function (obj) {

            if(obj.id === item.id){
                if(obj.active === true){
                    obj.active = false;
                } else {
                    obj.active = true;
                }
            }
            changed_data.push(obj);
        });
        this.setState({redemptionData : changed_data});
    };

    changePageData = (data) => {
        this.setState({offset: Math.ceil(data.selected * this.state.perPage)}, () => this.loadCampaignReport());
    };

    changeDateFormat = (data) => {
        if(data){
            return moment(data).format("DD/MM/YYYY");
        } else {
            return '';
        }
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
            obj._source.active = this.state.showAll ===  true ? true : false;
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
            this.loadCampaignReport();

        })

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
    autoChecked = (e) => {
        this.setState((prevState)=>({autoChecked:!prevState.autoChecked}));
    };//..... end of handleMembersCap() .....//

    enterPressed = (event) => {
        var code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.loadCampaignReport();
        }
    };//--- End of enterPressed() ----//




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
                                <div className="searchCompaign clearfix">
                                    <div className="preloader3" style={{marginLeft: '-104px', marginTop: '0px', display: 'none'}}>&nbsp;</div>
                                    <input type="text" placeholder="Search " value={this.state.search}
                                           onChange={(e) => this.setState({search: e.target.value, offset: 0})}
                                           onKeyPress={this.enterPressed} className="copmpaignSearch_field" style={{'borderBottom': '1px solid lightgray'}}/>
                                    <input type="submit" value="" className="copmpaignIcon_field" onClick={() => this.addSearchResult()} />
                                </div>
                                <div className="e_transaction_list">
                                    <div className="e_all_trans_heading">
                                        <h4>Campaign Report</h4>
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
                                        <div style={{float:'right'}}>
                                            <select className="select-css">
                                                <option>This is a native select element</option>
                                                <option>Apples</option>
                                                <option>Bananas</option>
                                                <option>Grapes</option>
                                                <option>Oranges</option>
                                            </select>
                                        </div>
                                      {/*  <div className="expand_button"><a onClick={this.expandAll}
                                                                          style={{cursor:'pointer'}}>
                                            {this.state.showAll ? 'Collapse All' : 'Expand All'}</a></div>*/}
                                   {/*     <div className="grid_searching clearfix date_range_changes">
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
                                        </div>*/}
                                    </div>

                                    {this.state.showListError ?
                                      <NoDataFound customMessage="Redemption" />
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
                                                        this.state.campaignData.map((item) => {
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
                                                                                    className="cL_listing_table_cell cell1  ">
                                                                                           <span
                                                                                               className="cL_rowList_number ">{item.date_added}</span>
                                                                                </div>

                                                                                <div
                                                                                    className="cL_listing_table_cell cell2 " >
                                                                                           <span
                                                                                               className="cL_rowList_number ">{item.campaign_name}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell3  ">
                                                                                           <span
                                                                                               className="cL_rowList_number ">{item.user_name}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell4  " >
                                                                                           <span
                                                                                               className="cL_rowList_number ">{item.email}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell5 " >
                                                                                           <span
                                                                                               className="cL_rowList_number ">{item.membership_id}</span>
                                                                                </div>
                                                                                <div
                                                                                    className="cL_listing_table_cell cell6 " >
                                                                                           <span
                                                                                               className="cL_rowList_number ">{item.status}</span>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </div>

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
                                                               pageCount={this.state.totalCampaigns}
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
            </div>



        );
    }//..... end of render() .....//
}

export default CampaignReporting;