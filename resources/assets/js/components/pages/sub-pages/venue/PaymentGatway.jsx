import React, {Component} from 'react';
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import {NotificationManager} from "react-notifications";

class PaymentGatway extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_enable : false
        };
    }//..... end of constructor() .....//

    componentDidMount = () => {
        axios.post(BaseUrl + '/api/get-payment-gateway',{venue_id: VenueID, company_id: CompanyID})
            .then(response => {
                if(response.data.status){
                   this.setState(()=>({is_enable: response.data.payment_gatway}));
                }
            }).catch((err) => {

        });
    };

    paymentStatusChanged = () => {
        this.setState((prevState)=>({is_enable:!prevState.is_enable}),()=>{
            axios.post(BaseUrl + '/api/update-payment-gatway',{...this.state, venue_id: VenueID, company_id: CompanyID})
                .then(response => {
                    if(response.status){
                        NotificationManager.success(response.data.message, 'success',1500);
                    }else{
                        NotificationManager.error('Error occurred while saving record.', 'error',1500);
                    }
                }).catch((err) => {
                NotificationManager.error("Error occurred while saving data.", 'Error',1500);
            });
        });
    };

    render() {
        return (
            <React.Fragment>
                <div className="dropSegmentation_section" id="payment_gatway" style={{display: 'none'}}>
                    <div className="dropSegmentation_heading clearfix">
                        <h3 style={{fontWeight: 'bold'}}>Payment Gateway Settings</h3>
                    </div>
                    <div className="venueInfo_div">
                        <div className="venueIdentification_section">
                            <div className="venueIdentification_form">
                                <ul>
                                    <li>
                                        <label>Payment Gateway</label>
                                        <ToggleSwitch
                                            checked={this.state.is_enable }
                                            onChange={(e)=> {this.paymentStatusChanged(e)}}
                                        />
                                        <span style={{fontWeight:'bold'}}> {this.state.is_enable ? "ON" : "OFF"}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of PaymentGatway.

export default PaymentGatway;