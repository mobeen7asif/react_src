import React, {Component} from 'react';
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import {find} from 'lodash';
import {NotificationManager} from "react-notifications";

class MerchantUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_enable: !!this.props.member._source.is_merchant,
            selectedBusinessList: []
        };
    }//..... end of constructor() .....//

    handleEnableSwitch = (e) => {
        this.setState((prevState) => ({is_enable: !prevState.is_enable}))
    };//..... end of handleEnableSwitch() .....//

    handleAddBusiness = (business) => {
        this.setState((prevState) => ({selectedBusinessList: [...prevState.selectedBusinessList, business]}))
    };//..... end of handleAddBusiness() ......//

    handleRemoveBusiness = (business) => {
        this.setState((prevState) => ({selectedBusinessList: prevState.selectedBusinessList.filter((b) => b.business_id != business.business_id)}));
    };//..... end of handleRemoveBusiness() .....//

    save = () => {
        show_loader();
        axios.post(`${BaseUrl}/api/upgrade-to-merchant`, {
            isMerchant:     this.state.is_enable,
            businessList:   this.state.selectedBusinessList,
            company_id:     CompanyID,
            venue_id:       VenueID,
            persona_id:     this.props.member._id,
            user_id:        this.props.member._source.persona_id
        }).then((response) => {
            show_loader(true);
            NotificationManager.success(response.data.message, 'Success');
            this.props.handleCloseMerchant();
            }).catch((e) => {
            show_loader(true);
            NotificationManager.error("Error occurred while saving record.", 'Error');
        });
    };//...... end of save() ......//

    componentDidMount() {
        this.loadMemberAssignedBusinesses();
    }//..... end of componentDidMount() .....//

    loadMemberAssignedBusinesses = () => {
        show_loader();
        axios.post(`${BaseUrl}/api/member-business-list`, {
            company_id: CompanyID,
            venue_id:   VenueID,
            user_id: this.props.member._source.persona_id
        }).then((response) => {
            show_loader(true);
            this.setState(() => ({selectedBusinessList: response.data.data}), () => {
                if (this.props.businessList.length <= 0)
                    this.props.loadBusinessList();
            });
        }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while getting member's businesses list.", 'Error');
        });
    };//..... end of loadBusinessList() .....//

    render() {
        return (
            <div className="popups_outer addCategory_popup" style={{display:"block"}}>
                <div className="popups_inner">
                    <div className="overley_popup close_popup" onClick={(e)=>{this.props.handleCloseMerchant()}}>&nbsp;</div>
                    <div className="popupDiv">
                        <div className="contentDetail" style={{padding: '30px 25px'}}>
                            <div className="autoContent">
                                <div className="compaigns_list_content">
                                    <div className="add_categoryList_info2">
                                        <div className="newVualt_heading">
                                            <h3>Upgrade User Account</h3>
                                        </div>
                                        <div className="categoryInfo_container clearfix">
                                            <div className="addCategoryRight_section" style={{width: '100%'}}>
                                                <div className=" portalNew_page">
                                                    <ul>
                                                        <li style={{paddingBottom: '10px'}}>
                                                            <label>Upgrade Account &nbsp;</label>
                                                            <ToggleSwitch checked={this.state.is_enable } onChange={(e)=> {this.handleEnableSwitch(e)}}/>
                                                            <span style={{fontWeight:'bold'}}> {this.state.is_enable ? "Merchant" : "Customer"}</span>
                                                        </li>
                                                        <li>
                                                            <div className="customPlaceholder_outer">
                                                                <div className="dragable_sections clearfix">
                                                                    <div className="dragable_sections_columns_outer">
                                                                        <h4>Unassigned Shops</h4>
                                                                        <p>Click on Shops to assign it to this Merchant.</p>
                                                                        <span className="dragBttn">&nbsp;</span>
                                                                        <div className="dragable_sections_columns">
                                                                            <ul id="unAssignedVenues">
                                                                                {this.props.businessList.map((business)=>{
                                                                                        return (!find(this.state.selectedBusinessList, function(o){return o.business_id == business.business_id;}) &&
                                                                                            <li key={business.business_id} className="checkBusiness" onClick={() => this.handleAddBusiness(business)}>
                                                                                                <a>{business.business_name}</a>
                                                                                            </li>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                    <div className="dragable_sections_columns_outer frDrag_column">
                                                                        <h4>Assigned Shops</h4>
                                                                        <p>Click on shops to unassign it to this  merchant.</p>
                                                                        <div className="dragable_sections_columns dropable_columns">
                                                                            <ul id="assignedVenues">
                                                                                {this.state.selectedBusinessList.map((business)=>{
                                                                                        return (
                                                                                            <li key={business.business_id} className="unassignBussiness" onClick={() => this.handleRemoveBusiness(business)}>
                                                                                                <a>{business.business_name}</a>
                                                                                            </li>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="continueCancel  listShops">
                                        <a  style={{cursor:'pointer'}} onClick={this.save}>Save</a>
                                        <a  style={{cursor:'pointer'}} className="close_popup" onClick={(e)=>{this.props.handleCloseMerchant()}}>CANCEL</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of MerchantUpdate.

export default MerchantUpdate;