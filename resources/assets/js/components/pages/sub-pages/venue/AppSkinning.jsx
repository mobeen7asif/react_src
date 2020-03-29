import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import {NotificationManager} from "react-notifications";

class AppSkinning extends Component {

    constructor(props) {
        super(props);
        this.state = {
            background: "",
        };
    }//..... end of constructor() .....//
    handleChangeComplete = (color) => {
        this.setState(()=>({ background: color.hex }));
    };

    saveAppSkinnig = () => {
        axios.post(BaseUrl + '/api/save-app-color',{...this.state, venue_id: VenueID, company_id: CompanyID})
            .then(response => {
                if(response.status){
                    NotificationManager.success(response.data.message, 'success',1500);
                }else{
                    NotificationManager.error('Error occurred while saving record.', 'error',1500);
                }
            }).catch((err) => {
            NotificationManager.error("Error occurred while getting loyalty data.", 'Error',1500);
        });
    };
    render() {
        return (
            <React.Fragment>
                <div className="dropSegmentation_section" id="app_skinning" style={{display: 'none'}}>

                    <div className="dropSegmentation_heading clearfix">
                        <h3 style={{fontWeight: 'bold'}}>Site App Skinnig</h3>
                    </div>

                    <div className="venueInfo_div">
                        <div className="venueIdentification_section">



                            <div className="venueIdentification_form">
                                <ul>
                                    <li>
                                        <label>App Color</label>
                                        <SketchPicker
                                            color={ this.state.background == "" ? this.props.venueData.app_color : this.state.background }
                                            onChangeComplete={ this.handleChangeComplete }
                                        />

                                        <div className="continueCancel" id="skinning_save_btn" style={{display: 'block',textAlign:'left',marginTop:'20px'}}>
                                            <input  className="selecCompaignBttn" onClick={()=>{this.saveAppSkinnig()}} type="submit" value="Save"  />
                                        </div>

                                    </li>
                                   
                                </ul>
                            </div>

                        </div>
                    </div>


                </div>
            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of AppSkinning.

AppSkinning.propTypes = {};

export default AppSkinning;