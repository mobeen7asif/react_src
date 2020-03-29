import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import {validateMemberData} from "../../../../../utils/Validations";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";
import DatePicker from 'react-datepicker';
import ReactCodeInput from "react-code-input";
import { PrintTool } from "react-print-tool";
import moment from "moment/moment";
import { Scrollbars } from 'react-custom-scrollbars';
import {find} from 'lodash';
import {setRedemptionFrequency} from "../../../../../redux/actions/PunchCardActions";

import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import MultiSelectReact from "multi-select-react";


class MemberStores extends Component {
    state = {
        storeData : []
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidMount = () => {

        show_loader(true);
        show_loader();
        axios.post(BaseUrl + '/api/user-linked-to-store',{
            user_id: this.props.persona_id,
            venue_id: VenueID,
            company_id: CompanyID,
        }).then((response) => {
            if (response.data.status) {

                this.setState(()=>({storeData:response.data.data}),()=>{
                    show_loader(true);
                });
            }
            else {
                //NotificationManager.error("Something went wrong with server", 'Error');
                show_loader(true);
            }
        }).catch((err) => {
            //NotificationManager.error("Something went wrong with server", 'Error');
            show_loader(true);
        });
    };//..... end of componentDidMount() .....//




    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//










    render() {

        return (
            <div className="e_member_right">
                <div className="add_category_listing">
                    <ul>


                        <li>
                            <div className="add_categoryList_info addProduct_setting" id="printableArea" style={{height: "900px"}}>
                                <div className="newVualt_heading">
                                    <h3>User Stores<a href="javascript:void(0);"></a></h3>
                                </div>
                                <div className="categoryInfo_container clearfix" style={{height: "108px"}}>
                                    <div className="addCategoryRight_section">
                                        <div className="edit_category_rightDetail removeHighlights" style={{paddingBottom:"0px"}}>


                                            <div className="addCategory_formSection" style={{paddingBottom:"0px"}}>

                                                <ul>
                                                    <li>
                                                        <div className="customPlaceholder_outer">

                                                            <div className="">

                                                                <table>
                                                                    <thead>
                                                                    <tr>
                                                                        <th style={{padding: "8px",background:"lightGray"}}>Store Name</th>
                                                                        <th style={{padding: "8px",background:"lightGray"}}>Last Transaction Date</th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {this.state.storeData.length == 0 && (
                                                                        <tr>
                                                                            <td colSpan="2" style={{padding: "8px"}}><span style={{color:"red"}}>No Store Linked.</span></td>
                                                                        </tr>
                                                                    )}
                                                                    {this.state.storeData.map((value,key)=>(
                                                                        <tr>
                                                                            <td style={{padding: "8px"}}>{value.business_name}</td>
                                                                            <td style={{padding: "8px"}}>{value.lastTransactionDate}</td>
                                                                        </tr>
                                                                    ))}

                                                                    </tbody>
                                                                </table>

                                                            </div>
                                                        </div>
                                                    </li>




                                                </ul>
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
                        {/*<ul>
                            <li>
                                <input   type="submit" value="SUBMIT" onClick={this.updateMember} />
                            </li>
                        </ul>*/}
                    </div>
                </div>



            </div>
        );
    }//..... end of render() .....//
}//..... end of Member.

MemberStores.propTypes = {};

// export default MemberSubscriptionStatus;

export default MemberStores;