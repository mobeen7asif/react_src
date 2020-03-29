import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {NotificationManager} from "react-notifications";
import {find} from 'lodash';
import {connect} from 'react-redux';
import {
    resetGymForm,
    setGymBusinessList,
    setGymEditData,
    setGymExcludedBusinessList,
    setGymKeyValue
} from "../../../../redux/actions/GymActions";

class AddGyms extends Component {
    customDropDownBSpanRef      = null;
    customDropDownShowBRef      = null;
    stateList = {NSW: 'NSW', ACT: 'ACT', QLD: 'QLD', TA: 'TA', NT: 'NT', SA: 'SA', VIC: 'VIC', WA: 'WA'};

    saveGym = () => {
        if (this.props.name === '' || this.props.state === '' || this.props.link === '') {
            NotificationManager.warning("Please fill all the required fields.", 'Missing Fields');
            return false;
        } else {
            show_loader();
            axios.post(BaseUrl + '/api/save-gym', {
                name:       this.props.name,
                state:      this.props.state,
                link:       this.props.link,
                editId:     Object.keys(this.props.gym).length > 0 ? this.props.gym.id : 0,
                exBusiness: this.props.excluded_business,
                CompanyID
            }).then((response) => {
                    show_loader(true);
                    NotificationManager.success('Gym saved successfully!', 'Success');
                    this.redirectToListing();
                }).catch((err)=> {
                show_loader(true);
                NotificationManager.error("Error occurred while saving gym, please try later.", 'Error');
            });
        }//..... end if-else() .....//
    };//..... end of saveGym() .....//

    handleDropDownBSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowBRef.style.display =  this.customDropDownShowBRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownBSpanClick() .....//

    setStateValue = (key, value) => {
        this.customDropDownShowBRef.style.display = 'none';
        this.customDropDownBSpanRef.classList.remove('changeAero');
        this.setKeyValue(key, value);
    };//..... end of setStateValue() .....//

    getBusinessList = () => {
        if (this.props.businessList.length > 0)
            return false;

        show_loader();
        axios.get(BaseUrl + '/api/business-list')
            .then((response) => {
                show_loader(true);
                if (response.data.status) {
                    this.props.dispatch(setGymBusinessList(response.data.data));
                } else {
                    NotificationManager.warning("Could not get businesses list.", 'No Data');
                }//..... end if-else() .....//
            }).catch((err)=> {
            show_loader(true);
            NotificationManager.error("Error occurred while fetching businesses.", 'Error');
        });
    };//..... end of removeFile() ......//

    setKeyValue = (key, value) => {
        this.props.dispatch(setGymKeyValue(key, value));
    };//..... end of setKeyValue() .....//

    componentDidMount() {
        if (Object.keys(this.props.gym).length > 0)
            this.loadEditData(this.props.gym);
    };

    loadEditData = (gym) => {
        this.props.dispatch(setGymEditData(gym));
        this.getBusinessList();
    };//..... end of loadEditData() .....//

    redirectToListing = () => {
        this.props.dispatch(resetGymForm());
        this.props.addGym('listing');
    };

    excludeBusiness = (business) => {
        this.props.dispatch(setGymExcludedBusinessList([business, ...this.props.excluded_business]));
    };

    includeBusiness = (business) => {
        let businessList = this.props.excluded_business.filter((b) => b.business_id !== business.business_id);
        this.props.dispatch(setGymExcludedBusinessList(businessList));
    };

    render() {
        return (
            <div className="newVualt_container">
                <div className="newVualt_container_detail">

                    <div className="newVualt_detail_outer">
                        <div className="newVualt_detail">
                            <div className="newVualt_heading_with_buttons clearfix">
                                <div className="newVualt_heading">
                                    <h3>New Gym</h3>
                                </div>
                            </div>
                            <div className="categoryInfo_container clearfix ">
                                <div className="smsDetail_inner primary_voucher_setting">

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Name</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input placeholder="Provide gym name" type="text" onChange={(e)=>{this.setKeyValue('name', e.target.value)}} value={this.props.name}/>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Link</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input placeholder="Provide gym link" type="text" onChange={(e)=>{this.setKeyValue('link', e.target.value)}} value={this.props.link}/>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>States</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <div className="customDropDown">
                                                        <span  ref={ref => this.customDropDownBSpanRef = ref} onClick={this.handleDropDownBSpanClick}> {this.props.state ? this.props.state : 'Select State'}</span>
                                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowBRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none',zIndex: '3'}} >
                                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                                {
                                                                    Object.keys(this.stateList).map((key) => {
                                                                        return <li key={key} onClick={(e)=> {this.setStateValue('state', key)}} className={this.props.state === this.stateList[key] ? 'selectedItem' : ''}>{key}</li>;
                                                                    })
                                                                }
                                                            </Scrollbars>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        Object.keys(this.props.gym).length > 0 && (
                                            <div className="dropSegmentation_section">
                                                <div className="dropSegmentation_heading clearfix">
                                                    <h3>Mapping Businesses/Shops</h3>
                                                </div>
                                                <div className="stateSegmentation primary_voucher_setting">
                                                    <div className="venueIdentification_section">
                                                        <div className="venueIdentification_form">
                                                            <div className="customPlaceholder_outer">
                                                                <div className="dragable_sections clearfix">
                                                                    <div className="dragable_sections_columns_outer">
                                                                        <h4>Assigned Shops</h4>
                                                                        <p>Click on shop to unassign it to this gym.</p>
                                                                        <span className="dragBttn">&nbsp;</span>
                                                                        <div className="dragable_sections_columns listDataColumns">
                                                                            <ul id="soldiBussinesStores">
                                                                                {this.props.businessList.map((value) => {
                                                                                    let business = find(this.props.excluded_business, (b) => {  return b.business_id == value.business_id;});
                                                                                    if (!business)
                                                                                        return <li key={value.business_id} onClick={() => { this.excludeBusiness(value) }} className="checkBusiness"><a>{value.business_name}</a></li>
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    </div>

                                                                    <div className="dragable_sections_columns_outer frDrag_column">
                                                                        <h4>Unassigned Shops</h4>
                                                                        <p>Click on shop to assign it to this gym.</p>
                                                                        <div className="dragable_sections_columns sortable" >
                                                                            <ul id="assigned_shops">
                                                                                {this.props.excluded_business.map((value) => (<li key={value.business_id} onClick={()=>{this.includeBusiness(value)}} className="unassignBussiness"><a>{value.business_name}</a></li>))}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="continueCancel  listShops">
                        <a  style={{cursor:'pointer'}} className="" onClick={this.saveGym}>Save</a>
                        <a  style={{cursor:'pointer'}} className="close_punch_popup" onClick={() => {this.redirectToListing()}}>CANCEL</a>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of AddGyms.

const mapStateToProps = (state) => ({...state.gym});
export default connect(mapStateToProps)(AddGyms);