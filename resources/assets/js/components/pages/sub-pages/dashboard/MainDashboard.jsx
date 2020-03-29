import React, {Component} from 'react';
import ReportingPeriod from './sub_components/ReportingPeriod';
import TotalTransactions from './sub_components/TotalTransactions';
import OverallStats from './sub_components/OverallStats';
import TotalVoucherStats from './sub_components/TotalVoucherStats';
import TotalPointsLevels from './sub_components/TotalPointsLevels';
import MemberSplit from './sub_components/MemberSplit';
import GenderSplit from './sub_components/GenderSplit';
import PostalCodeAreas from './sub_components/PostalCodeAreas';
import StaffSales from './sub_components/StaffSales';
import ProductSold from './sub_components/ProductSold';
import BreakDown from "../members/MemberProfile/components/campaigns/sub_components/BreakDown";

import {NotificationManager} from "react-notifications";
import {Scrollbars} from "react-custom-scrollbars";
import {setBusinessList} from "../../../redux/actions/PunchCardActions";
import Select from 'react-select';
class MainDashboard extends Component {
    customDropDownBSpanRef        = null;
    customDropDownShowBRef        = null;
    constructor(props){
        super(props);
        this.state = {
            calender:{
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
                applyFilter : false,
                filterPeriod : 'week'
            },
            offset: 0,
            perPage: 5,
            sent_percentage : 0,
            business_name:"",
            business_id:0,
            api_key:0,
            secret_key:0,
            businessList:[],
            selectedOption:null
        };
    }
    componentDidMount = () => {
       this.loadBusinsess();
    };

    loadBusinsess = () => {

        axios.get(BaseUrl + '/api/get-soldi-business?company_id='+CompanyID)
            .then(res => {
                let business_name = "";
                let business_id = 0;
                let api_key = "";
                let secret_key= "";
                let businessObj={};
                if(res.data.data.length > 0){
                    business_name = res.data.data[0].business_name;
                    business_id = res.data.data[0].business_id;
                    api_key = res.data.data[0].api_key;
                    secret_key = res.data.data[0].secret_key;
                    businessObj.label=res.data.data[0].label
                    businessObj.value=res.data.data[0].value
                    businessObj.business_name=business_name
                    businessObj.business_id=business_id
                    businessObj.api_key=api_key
                    businessObj.secret_key=secret_key
                }

                this.setState((prevState) => ({
                    calender:{
                        ...prevState.calender,
                        showDatePicker: false,
                        selectDate: false,
                        applyFilter: true,
                        filterPeriod:'week',
                    },
                    businessList: res.data.data,api_key,secret_key,business_name,business_id,
                    selectedOption:businessObj
                }));
                //this.setState(()=>({businessList: res.data.data,api_key,secret_key,business_name,business_id}));
            }).catch((err) => {
                show_loader(true);
            //NotificationManager.error("Error occurred while getting Bussiness .", 'Error');
        });
    };


    handleSelect = (ranges) => {
        const mySelection = (ranges.selection);
        this.setState((prevState) => ({
            calender:{...prevState.calender,
            selection:mySelection,
            start_date : moment(mySelection.startDate).format("YYYY-MM-DD"),
            end_date : moment(mySelection.endDate).format("YYYY-MM-DD"),
            selectDate:true
            }
        }));
    };

    dateInputClick = () => {
        let show_date_picker = !this.state.calender.showDatePicker;
        if(show_date_picker) {
            this.setState((prevState) => ({
                calender:{...prevState.calender, showDatePicker: true}
            }));
        } else {
            this.setState((prevState) => ({
                calender:{
                    ...prevState.calender,
                    selection:{
                        startDate: new Date(),
                        endDate: new Date(),
                        key: 'selection',
                        showSelectionPreview:true
                    },
                    showDatePicker: false,
                    selectDate: false,
                    start_date : '',
                    end_date : '',
                    applyFilter: true,
                    filterPeriod:'week',

                }
            }));
        }
    };

    hideDatePicker = () => {
        this.setState((prevState) => ({
            calender:{
                ...prevState.calender,
                selection:{
                    startDate: new Date(),
                    endDate: new Date(),
                    key: 'selection',
                    showSelectionPreview:true
                },
                showDatePicker: false,
                selectDate: false,
                start_date : '',
                end_date : '',
                applyFilter: true,
                filterPeriod:'week',

            }
        }));
    };

    dateFilter = () => {
        if(this.state.start_date !== '' || this.state.end_date !== ''){
            this.setState((prevState) => ({
                calender:{
                    ...prevState.calender,
                    showDatePicker: false,
                    selectDate: true,
                    applyFilter: true,
                    filterPeriod:''
                }
            }));
        }
    };

    changeFilter = (filterPeriod) => {
        // console.log(filterPeriod);

        this.setState((prevState) => ({
            calender:{
                ...prevState.calender,
                showDatePicker: false,
                selectDate: false,
                start_date : '',
                end_date : '',
                applyFilter: true,
                filterPeriod:filterPeriod
            }
        }))
    };//...... end of changeFilter() .....//


    setBusiness = (business) => {
        this.customDropDownShowBRef.style.display = 'none';
        this.customDropDownBSpanRef.classList.remove('changeAero');
        this.setState(()=>({api_key:business.api_key,secret_key:business.secret_key,business_name:business.business_name,business_id:business.business_id}));
    };//..... end of setBusiness() .....//

    handleDropDownBSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowBRef.style.display =  this.customDropDownShowBRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownBSpanClick() .....//

    handleChange =(selectedOption)=> {
        this.setState(
            ()=>({api_key:selectedOption.api_key,secret_key:selectedOption.secret_key,business_name:selectedOption.business_name,business_id:selectedOption.business_id,selectedOption}),

            () => {}
        );
    };
    render() {

        return (
            <div className="e_dashboard_content" style={{'padding':"0px"}}>
                <div className="dashboardcontainer">
                    <div className="searchSection">
                        <div className="searchSection_bar">
                            <input type="text" defaultValue placeholder="Search" />
                        </div>
                    </div>
                    <div className="e_dashboard_main">

                        {/*Reporting Period*/}
                        <div id='test'></div>

                        <div className="stateSegmentation primary_voucher_setting bussiness_allign">
                            <div className="venueIdentification_section">
                                <div className="venueIdentification_form">
                                    <Select
                                        value={this.state.selectedOption}
                                        onChange={this.handleChange}
                                        options={this.state.businessList}
                                    />
                                </div>
                            </div>
                        </div>

                            <ReportingPeriod
                                calender = {this.state.calender}
                                handleSelect = {this.handleSelect}
                                dateInputClick = {this.dateInputClick}
                                hideDatePicker = {this.hideDatePicker}
                                dateFilter = {this.dateFilter}
                                changeFilter = {this.changeFilter}
                            />


                        {(appPermission("Dashboard Transaction Data","view")) && (
                            <div>
                                <TotalTransactions dateHandler = {this.state.calender} api_key={this.state.api_key} secret_key={this.state.secret_key} business_id={this.state.business_id} business_name={this.state.business_name} />
                                <OverallStats dateHandler = {this.state.calender} api_key={this.state.api_key} secret_key={this.state.secret_key} business_id={this.state.business_id} business_name={this.state.business_name} />
                                <TotalVoucherStats dateHandler = {this.state.calender} api_key={this.state.api_key} secret_key={this.state.secret_key} business_id={this.state.business_id} business_name={this.state.business_name} />
                            </div>
                        )}



                        {/*TotalTransactions*/}


                        {/*OverallStats*/}


                        {/*TotalCampaigns*/}
                        {/*<BreakDown data={this.state.sent_percentage} totalCampaings={true} />*/}

                        {/*TotalVoucherStats*/}


                        {/*TotalPointsLevels*/}
                        {/*<TotalPointsLevels/>*/}

                        {/*member/gender*/}
                        <div className="e_genderSplit_main">
                            <div className="e_dboard_campaign">
                                <div className="cmDashboard_columns">
                                    <ul>
                                        MemberSplit
                                        <MemberSplit dateHandler = {this.state.calender} api_key={this.state.api_key} secret_key={this.state.secret_key} business_id={this.state.business_id} business_name={this.state.business_name} />

                                        GenderSplit
                                        <GenderSplit dateHandler = {this.state.calender} api_key={this.state.api_key} secret_key={this.state.secret_key} business_id={this.state.business_id} business_name={this.state.business_name} />
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/*PostalCodeAreas*/}
                        {/*<PostalCodeAreas />*/}

                        {/*StaffSales*/}
                        {/*<StaffSales dateHandler = {this.state.calender} api_key={this.state.api_key} secret_key={this.state.secret_key} business_id={this.state.business_id} />*/}

                        {/*ProductSold*/}
                        {(appPermission("Dashboard Transaction Data","view")) && (
                            <ProductSold dateHandler = {this.state.calender} api_key={this.state.api_key} secret_key={this.state.secret_key} business_id={this.state.business_id} business_name={this.state.business_name} />
                        )}


                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//


}//..... end of Venue.

export default MainDashboard;