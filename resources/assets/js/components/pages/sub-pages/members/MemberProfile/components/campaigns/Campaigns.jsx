import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import HeaderComponent from "../../../sub_components/HeaderComponent";

import ReactPaginate from 'react-paginate';
import { Calendar } from 'react-date-range';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import Graph from "./sub_components/Graph";
import BreakDown from "./sub_components/BreakDown";
import CampaignDetail from "./sub_components/CampaignDetail";
import { PrintTool } from "react-print-tool";
import NoDataFound from "../../../../../../_partials/NoDataFound";

class Campaigns extends Component {

    state = {
        headerList: [{"id": "1", "name": 'Date', 'filterName': 'date_added'}, {"id": "2", "name": 'Campaign Name', 'filterName': 'date_added','disable_sort': true},
            {"id": "3", "name": 'Campaign Type', 'filterName': 'date_added','disable_sort': true}, {"id": "4", "name": 'Message Type', 'filterName': 'date_added'},
            {"id": "5", "name": 'Campaign Status', 'filterName': 'date_added','disable_sort': true}],
        campaigns : [],
        totalCampaigns: 0,
        offset: 0,
        perPage: 50,
        orderType: 'desc',
        filterSegment: 'date_added',
        showAll : false,
        showListError : false,
        start_date : '',
        end_date : '',
        sent_percentage : 0,
        selection:{
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
            showSelectionPreview:true
        },
        showDatePicker : false,
        selectDate : false,
        randomKey: Math.floor(Math.random() * 11)
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidMount = () => {
        this.loadCampaigns()
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//


    loadCampaigns = () => {
        show_loader();
        let url = BaseUrl + '/api/member-campaigns';
        axios.post(url, {
            'company_id': CompanyID,
            'venue_id': VenueID,
            'pageSize': this.state.perPage,
            'offSet': this.state.offset,
            'sorting': this.state.filterSegment,
            'sortingOrder': this.state.orderType,
            'persona_id' : this.props.persona_id,
            'start_date' : this.state.start_date,
            'end_date' : this.state.end_date
        }).then(res => {
            if (res.data.status) {
                var data = [];
                if(res.data.listData.length>0) {
                    res.data.listData.hits.hits.map(function (item) {
                        item._source.active = false;
                        data.push(item);
                    });

                    this.setState({
                        campaigns: data,
                        totalCampaigns: res.data.listData.hits.total / this.state.perPage,
                        showListError: res.data.listData.hits.hits.length > 0 ? false : true,
                        sent_percentage: res.data.listData.sent_camps
                    });
                }
                show_loader(true);
            } else {
                show_loader(true);
                this.setState({showListError: true});
            }
        }).catch((err) => {
            show_loader(true);
            this.setState({showListError: true});
            NotificationManager.error("Error occurred while Badges"+err, 'Error');
        });
    };

    changePageData = (data) => {
        this.setState({offset: Math.ceil(data.selected * this.state.perPage)}, () => this.loadCampaigns());
    };

    changeDateFormat = (data) => {
        if(data){
            return moment(data).format("DD/MM/YYYY");
        } else {
            return '';
        }
    };

    changeActiveStatus = (item) => {
        var changed_data = [];
        this.state.campaigns.map(function (obj) {
            if(obj._id === item._id){
                if(obj._source.active === true){
                    obj._source.active = false;
                } else {
                    obj._source.active = true;
                }
            }
            changed_data.push(obj);
        });
        this.setState({campaigns : changed_data});
    };

    expandAll = (item) => {
        if(this.state.showAll){
            this.setState({showAll : false}, () => {this.getUpdatedBadges()});
        }
        else {
            this.setState({showAll : true}, () => {this.getUpdatedBadges()})
        }
    };

    getUpdatedBadges = () => {
        var changed_data = [];
        this.state.campaigns.map((obj) => {
            obj._source.active = this.state.showAll ===  true ? true : false;
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
    dateInputClick = () => {
        this.setState({showDatePicker: true});
    };
    dateFilter = () => {
        if(!this.state.selectDate){
            NotificationManager.warning("Please select date", 'Missing Fields');
        } else {
            if (this.state.start_date !== '' || this.state.end_date !== '') {
                this.setState({offset: 0}, () => {
                    this.setState({showDatePicker: false, selectDate: true}, () => {
                        this.loadCampaigns();
                    });
                });
            } else {
                this.setState({showDatePicker: false, selectDate: true}, () => {
                    this.loadCampaigns()();
                });
            }
        }
    };

    hideDatePicker = () => {
        this.setState({showDatePicker: false, selectDate: false, start_date : '', end_date : '',offset:0}, () => {this.loadCampaigns()});
    };
    printDiv = (divName) => {
        PrintTool.printExistingElement("#"+divName);
    };

    render() {
        return (

            <div className="e_member_right">
                <div className="add_category_listing">
                    <ul>
                        <li>
                            <div className="add_categoryList_info addProduct_setting">
                                <div className="newVualt_heading">
                                    <h3>Member / <a href="javascript:void(0);">Campaigns</a></h3>
                                </div>
                                <div className="categoryInfo_container clearfix">
                                    <div className="addCategoryRight_section">
                                        <div className="edit_category_rightDetail removeHighlights">
                                            <div className="e_transactions_main">

                                              <Graph persona_id={this.props.persona_id}/>

                                                <BreakDown data={this.state.sent_percentage}/>

                                                <div className="e_transaction_list">
                                                    <div className="e_all_trans_heading">
                                                        <h4>CAMPAIGN LIST</h4>
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
                                                                                this.loadCampaigns()
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
                                                                            this.loadCampaigns()
                                                                        })}
                                                                        className="quantity-button quantity-up"/>
                                                                    <div
                                                                        onClick={() => this.setState({
                                                                            perPage: ((this.state.perPage) - (1)),
                                                                            offset: 0
                                                                        }, () => {
                                                                            this.loadCampaigns()
                                                                        })}
                                                                        className="quantity-button quantity-down"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="expand_button" onClick={this.expandAll}><a  style={{cursor:'pointer'}}>
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
                                                        <div className="e_member_printBtns clearfix filter_btns" style={this.state.showDatePicker ? {display: 'block'} : {display: 'none'}}>
                                                            <ul>
                                                                <li><a onClick={this.dateFilter}  href="javascript:void(0);">APPLY</a></li>
                                                                <li><a onClick={this.hideDatePicker}  href="javascript:void(0);">CLEAR</a></li>
                                                            </ul>
                                                        </div>


                                                    </div>

                                                    { this.state.showListError || this.state.campaigns.length ==0 ?
                                                        <NoDataFound customMessage="Campaign"/>
                                                        :
                                                        <div className="category_list_outer trans_listing" id='printableArea'>
                                                            <div className="cL_listing_tableInn">
                                                                <HeaderComponent listData={this.state}
                                                                                 onClick={(id, name) => this.setState({
                                                                                     filterSegment: id,
                                                                                     orderType: name
                                                                                 }, () => this.loadCampaigns())}/>
                                                                <ul>
                                                                    {
                                                                        this.state.campaigns && (
                                                                            this.state.campaigns.map((campaign) => {
                                                                                return <li key={campaign._id}>
                                                                                    <div
                                                                                        className="e_transaction_accordion">
                                                                                        <div
                                                                                            className={campaign._source.active ? 'e_transaction_accordionTitle active' : 'e_transaction_accordionTitle'}>
                                                                                            <div
                                                                                                className="listDataShowing">
                                                                                                <div onClick={() => {
                                                                                                    this.changeActiveStatus(campaign)
                                                                                                }}
                                                                                                    className="cL_listing_table_row">
                                                                                                    <div
                                                                                                        className="cL_listing_table_cell cell1">
                                                                                        <span
                                                                                            className="cL_rowList_number ">{this.changeDateFormat(campaign._source.date_added)}</span>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="cL_listing_table_cell cell2">
                                                                                        <span
                                                                                            className="cL_rowList_number ">{campaign._source.campaign_name}</span>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="cL_listing_table_cell cell3">
                                                                                        <span
                                                                                            className="cL_rowList_number ">{campaign._source.campaign_type}</span>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="cL_listing_table_cell cell4">
                                                                                        <span
                                                                                            className="cL_rowList_number padingLeft25 capital_text"
                                                                                            style={{marginTop: '7px'}}>{campaign._source.camp_action_type}</span>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="cL_listing_table_cell cell5  ">
                                                                                           <span
                                                                                               className="cL_rowList_number padingLeft0"><i
                                                                                               className={campaign._source.camp_status === 'Active' ? 'activeRedeemed' : 'completed_campaign'}>&nbsp;</i>{campaign._source.camp_status}</span>
                                                                                                    </div>
                                                                                                </div>

                                                                                            </div>
                                                                                        </div>


                                                                                        {campaign._source.active ?
                                                                                            <CampaignDetail
                                                                                                campaign={campaign}/> : ''}

                                                                                    </div>
                                                                                </li>
                                                                            })
                                                                        )
                                                                    }
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    }

                                                    { this.state.showListError ? '' :
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
                        </li>
                    </ul>
                </div>
                <div className="clearfix">
                    <div className="e_member_printBtns clearfix">
                        <ul>
                            <li><a href="javascript:void(0);" onClick={() => {this.printDiv('printableArea')}}>PRINT</a></li>
                        </ul>
                    </div>
                </div>
            </div>

        );
    }//..... end of render() .....//
}//..... end of Member.

Campaigns.propTypes = {};

export default Campaigns;
