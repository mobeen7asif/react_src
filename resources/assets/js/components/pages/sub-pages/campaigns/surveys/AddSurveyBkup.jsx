import React, {Component} from 'react';
import {resetSurveyBuilder, setSurveyTitle} from "../../../../redux/actions/SurveyBuilderActions";
import {connect} from "react-redux";
import {NotificationManager} from "react-notifications";
import moment from "moment/moment";

class AddSurvey extends Component {
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    nextTab = () => {
        if (this.props.survey.title === '' || this.props.survey.title === null) {
            NotificationManager.warning("Please fill all the required fields.", 'Missing Fields');
            return false;
        } else {
            show_loader();
            axios.post(BaseUrl + '/api/save-survey', {
                title: this.props.survey.title,
                edit_id: this.props.survey.edit_id
            }).then((response) => {
                show_loader(true);
                if (response.data.status) {
                    this.redirectToListing();
                } else {
                    NotificationManager.error(response.data.message, 'Error');
                }//..... end if-else() .....//
            }).catch((err)=> {
                show_loader(true);
                NotificationManager.error("Error occurred, please try later.", 'Error');
            });
        }//..... end if-else() .....//
    };

    componentWillUnmount = () => {
        this.props.dispatch(resetSurveyBuilder());
    };


    redirectToListing = () => {
        this.props.changeMainTab('survey');
    };//..... end of redirectToListing() ......//
    render() {
        return (
            <div className="newVualt_container">
                <div className="newVualt_container_detail">
                    <div className="newVualt_detail_outer">
                        <div className="newVualt_detail">
                            <div className="newVualt_heading_with_buttons clearfix">
                                <div className="newVualt_heading">
                                    <h3>{this.props.survey.edit_id === 0 ? 'Add Survey' : 'Edit Survey'}</h3>
                                </div>
                            </div>
                            <div className="categoryInfo_container clearfix ">
                                <div className="smsDetail_inner primary_voucher_setting">
                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Title</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input placeholder="Title" type="text" value={this.props.survey.title} onChange={(e)=>{this.props.dispatch(setSurveyTitle(e.target.value))}} />
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
                        <a  style={{cursor:'pointer'}} className="selecCompaignBttn" onClick={this.nextTab}>Continue</a>
                        <a  style={{cursor:'pointer'}} className="close_punch_popup selecCompaignBttn" onClick={() => {this.redirectToListing()}}>CANCEL</a>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of AddMission.
const mapStateToProps = (state) => {
    return {survey: state.surveyBuilder};
};
export default connect(mapStateToProps)(AddSurvey);