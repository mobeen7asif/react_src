import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import PointStats from "./sub_components/PointStats";

import HeaderComponent from "../../../sub_components/HeaderComponent";
import ReactPaginate from 'react-paginate';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar } from 'react-date-range';
import { DateRangePicker } from 'react-date-range';
import { PrintTool } from "react-print-tool";


class PointLevels extends Component {

    state = {
        headerList: [{"id": "1", "name": 'Date', 'filterName': 'created_at'}, {"id": "2", "name": 'Order ID', 'filterName': 'order_id'},
            {"id": "3", "name": 'Points', 'filterName': 'value_points'},{"id": "3", "name": 'Business Name', 'filterName': '','disable_sort': true}],
        points : [],
        totalPoints: 0,
        offset: 1,
        perPage: 50,
        orderType: 'asc',
        filterSegment: 'created_at',
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
        selectDate : false//
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    componentDidMount = () => {
      this.loadPoints();
    };

    loadPoints = () => {
        // show_loader();
        // let url = BaseUrl + '/api/member-points?page='+this.state.offset;
        // axios.post(url, {
        //     'company_id': CompanyID,
        //     'venue_id': VenueID,
        //     'pageSize': this.state.perPage,
        //     'offSet': this.state.offset,
        //     'sorting': this.state.filterSegment,
        //     'sortingOrder': this.state.orderType,
        //     'persona_id' : this.props.persona_id,
        //     'start_date' : this.state.start_date,
        //     'end_date' : this.state.end_date
        // }).then(res => {
        //     if (res.data.status) {
        //         var data = [];
        //         res.data.points.data.map(function (item) {
        //             item.active = false;
        //             data.push(item);
        //         });
        //         this.setState({
        //             points: data,
        //             totalPoints: res.data.points.total / this.state.perPage,
        //             showListError: false,
        //         });
        //         show_loader(true);
        //     } else {
        //         show_loader(true);
        //         this.setState({showListError: true});
        //     }
        // }).catch((err) => {
        //     show_loader(true);
        //     this.setState({showListError: true});
        // })
    };

    changePageData = (data) => {
        this.setState({offset: data.selected+1}, () => this.loadPoints());
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
        this.state.points.map(function (obj) {
            if(obj._id === item._id){
                if(obj.active === true){
                    obj.active = false;
                } else {
                    obj.active = true;
                }
            }
            changed_data.push(obj);
        });
        this.setState({points : changed_data});
    };

    expandAll = (item) => {
        if(this.state.showAll){
            this.setState({showAll : false}, () => {this.getUpdatedPoints()});
        }
        else {
            this.setState({showAll : true}, () => {this.getUpdatedPoints()})
        }
    };

    getUpdatedPoints = () => {
        var changed_data = [];
        this.state.points.map((obj) => {
            obj.active = this.state.showAll ===  true ? true : false;
            changed_data.push(obj);
        });
        this.setState({points : changed_data});
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
                this.setState({offset:1}, () => {this.setState({showDatePicker: false, selectDate: true}, () => {this.loadPoints();});});
            } else {
                this.setState({showDatePicker: false, selectDate: true}, () => {this.loadPoints()();});
            }
        }
    };

    dateInputClick = () => {
        this.setState({showDatePicker: true});
    };

    hideDatePicker = () => {
        this.setState({showDatePicker: false, selectDate: false, start_date : '', end_date : '',offset:1}, () => {this.loadPoints()});
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
                                   <h3>Member / <a href="javascript:void(0);">Points and Level</a></h3>
                               </div>
                               <div className="categoryInfo_container clearfix">
                                   <div className="addCategoryRight_section">
                                       <div className="edit_category_rightDetail removeHighlights">
                                           <div className="e_transactions_main">


                                               <PointStats persona_id={this.props.persona_id}/>






                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </li>
                   </ul>
               </div>

               {
                   (!this.state.showListError &&  <div className="clearfix">
                       <div className="e_member_printBtns clearfix">
                           <ul>
                               <li><a href="javascript:void(0);">PRINT</a></li>
                           </ul>
                       </div>
                   </div>)
               }

           </div>


       );
    }//..... end of render() .....//
}//..... end of Member.

PointLevels.propTypes = {};

export default PointLevels;
