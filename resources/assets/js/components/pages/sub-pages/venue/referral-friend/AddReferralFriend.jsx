import React, {Component} from 'react';
import {find} from 'lodash';
import {connect} from 'react-redux';
import {resetReferralState, setReferralEditData, setReferralKeyValue} from "../../../../redux/actions/ReferralActions";
import {prepareEditData, prepareReferralEditData, selectReferralDataSave} from "../../../../redux/selectors/Selectors";
import {NotificationManager} from "react-notifications";
import {validateReferralData} from "../../../../utils/Validations";
import {resetPunchCardState, setEditData} from "../../../../redux/actions/PunchCardActions";

class AddReferralFriend extends Component {

    setKeyValue = (key, value) => {
        this.props.dispatch(setReferralKeyValue(key, value));
    };//---- end of setKeyValue() ----//

    saveReferralData = () => {
        if (validateReferralData(this.props.dataSaveReferral)) {
            NotificationManager.warning("Please fill all the required fields.", 'Missing Fields');
            return false;
        } else {
            show_loader();
            axios.post(BaseUrl + '/api/save-referral-coins', {
                ...this.props.dataSaveReferral,
                editId: Object.keys(this.props.referralFriend).length > 0 ? this.props.referralFriend.id : 0
            })
                .then((response) => {
                    show_loader(true);
                    NotificationManager.success('Referral Coins saved successfully!', 'Success');
                    this.redirectToListing();
                }).catch((err) => {
                show_loader(true);
                NotificationManager.error("Error occurred while saving referral coins, please try later.", 'Error');
            });
        }

    };//---- End of saveReferralData() ----//

    componentDidMount() {
        if (Object.keys(this.props.referralFriend).length > 0)
            this.loadEditData(this.props.referralFriend);
        else {
            this.props.dispatch(resetReferralState());
        }
    };//---- End of componentDidMount() ----//

    loadEditData = (referral) => {
        this.props.dispatch(setReferralEditData(prepareReferralEditData(referral)));
    };//---- End of loadEditData() ----//

    redirectToListing = () => {
        this.props.dispatch(resetReferralState());
        this.props.addReferralFriend('listing');
    };
    render() {
        return (
            <div className="newVualt_container">
                <div className="newVualt_container_detail">

                    <div className="newVualt_detail_outer">
                        <div className="newVualt_detail">
                            <div className="newVualt_heading_with_buttons clearfix">
                                <div className="newVualt_heading">
                                    <h3>Add/Edit Referral Settings</h3>
                                </div>
                            </div>
                            <div className="categoryInfo_container clearfix ">
                                <div className="smsDetail_inner primary_voucher_setting">

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Referee Coins</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input placeholder="Referee Coins..."
                                                                       onChange={(e) => {
                                                                           let value = e.target.value;

                                                                           if (parseInt(value) != 0 && value.match(/^\d*$/gm))
                                                                               this.setKeyValue('referral_points', value);
                                                                       }} value={this.props.referral_points}
                                                                       type="text"/>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Referred Coins</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input placeholder="Referred Coins..."
                                                                       onChange={(e) => {
                                                                           let value = e.target.value;

                                                                           if (parseInt(value) != 0 && value.match(/^\d*$/gm))
                                                                               this.setKeyValue('referred_points', value);
                                                                       }} value={this.props.referred_points}
                                                                       type="text"/>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <br/>
                    <div className="continueCancel  listShops">
                        <a  style={{cursor:'pointer'}} className="selecCompaignBttn" onClick={this.saveReferralData}>Save</a>
                        <a  style={{cursor:'pointer'}} className="close_punch_popup selecCompaignBttn">CANCEL</a>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of AddReferralFriend.


const mapStateToProps = (state) => ({
    ...state.referralFriend,
    dataSaveReferral:selectReferralDataSave(state.referralFriend),
});
export default connect(mapStateToProps)(AddReferralFriend);