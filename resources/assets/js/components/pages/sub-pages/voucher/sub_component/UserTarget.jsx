import React, {Component} from 'react';
import {connect} from 'react-redux';
import {selectVoucherDateToSave} from "../../../../redux/selectors/Selectors";
class UserTarget extends Component {
    render(){
       return (
           <div>
               <div className="dropSegmentation_section">
                   <div className="dropSegmentation_heading clearfix">
                       <h3>Target Users</h3>
                   </div>
                   <div className="stateSegmentation primary_voucher_setting">
                       <div className="venueIdentification_section">
                           <div className="venueIdentification_form">
                               <ul>
                                   <li>
                                       <div className="customInput_div">

                                           <div className="placeholder_radio_column"
                                                style={{width: '35%'}}>
                                               <div className="radio_button">
                                                   <input id="test_1" name="radio-group"
                                                          type="radio"
                                                          checked={this.props.target_user === 'new'}
                                                          value={this.props.target_user}
                                                          onChange={(e) => {
                                                              this.props.setKeyValueVoucher("target_user", 'new')

                                                          }}
                                                       // onChange={(e) => {this.setState({'target_user':'new'})}}
                                                   />
                                                   <label htmlFor="test_1">New users</label>
                                               </div>
                                           </div>
                                           <div className="placeholder_radio_column"
                                                style={{width: '35%'}}>
                                               <div className="radio_button">
                                                   <input id="test_2" name="radio-group"
                                                          type="radio"
                                                          value={this.props.target_user}
                                                          checked={this.props.target_user === 'new_prev'}
                                                          onChange={(e) => {
                                                              this.props.setKeyValueVoucher("target_user", 'new_prev')
                                                          }}
                                                       // onChange={(e) => {this.setState({'target_user':'new_prev'})}}
                                                   />
                                                   <label htmlFor="test_2">Previous and new
                                                       users</label>
                                               </div>
                                           </div>
                                       </div>
                                   </li>
                               </ul>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       )
    }
}
const mapStateToProps = (state) => ({
    ...state.voucherBuilder,

});
export default connect(mapStateToProps)(UserTarget);
