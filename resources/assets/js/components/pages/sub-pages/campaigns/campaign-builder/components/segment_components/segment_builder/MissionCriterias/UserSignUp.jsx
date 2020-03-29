import React, {Component} from 'react';
import ToggleSwitch from "@trendmicro/react-toggle-switch";
import {setCamapaignDefaultValue} from "../../../../../../../../redux/actions/CampaignBuilderActions";

class UserSignUp extends Component {
    state = {
        is_global: 'all_user'
    };
    componentDidMount =() =>{
        if (this.props.criteria.value){
            this.setState(()=>({is_global:this.props.criteria.value}));
        }else{
            this.props.setCriteriaValue('user_sign_up', 'value', this.state.is_global);
        }

    };
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    addNewValue = (value) => {
        let newValue = (value);
        this.setState(()=>({is_global:value}),()=>{
            this.props.setCriteriaValue('user_sign_up', 'value',newValue);
        });

    }//----- End of addNewValue() -----//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>User Sign Up</h3>
                </div>
                <div className="stateSegmentation primary_voucher_setting">
                    <div className="venueIdentification_section">
                        <div className="venueIdentification_form">
                            <ul>
                                <li>
                                    <div className="customInput_div">

                                        <div className="placeholder_radio_column" style={{width: '30%'}}>
                                            <div className="radio_button">
                                                <input id="test_1" name="radio-group" type="radio"
                                                       checked={this.state.is_global === 'all_user'} value={this.state.is_global}
                                                       onChange={(e) => { this.addNewValue('all_user')}}
                                                />
                                                <label htmlFor="test_1">All User</label>
                                            </div>
                                        </div>
                                        <div className="placeholder_radio_column" style={{width: '30%'}}>
                                            <div className="radio_button">
                                                <input id="test_2" name="radio-group" type="radio"  value={this.state.is_global}
                                                       checked={this.state.is_global === 'new_user'}
                                                       onChange={(e) => { this.addNewValue('new_user')}}

                                                />
                                                <label htmlFor="test_2">New User</label>
                                            </div>
                                        </div>
                                        <div className="placeholder_radio_column" style={{width: '30%'}}>
                                        <div className="radio_button">
                                            <input id="test_3" name="radio-group" type="radio"  value={this.state.is_global}
                                                   checked={this.state.is_global === 'old_user'}
                                                   onChange={(e) => { this.addNewValue('old_user')}}

                                            />
                                            <label htmlFor="test_3">Old User</label>
                                        </div>
                                    </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        );
    }//..... end of render() .....//

}//..... end of User Sign Up.


export default UserSignUp;