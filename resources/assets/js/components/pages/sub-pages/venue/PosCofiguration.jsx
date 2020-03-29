import React, {Component} from 'react';
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import {NotificationManager} from "react-notifications";

class PosCofiguration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_enable : false,
            is_disable:false,
            is_integrated:false,
        };
    }//..... end of constructor() .....//
    componentDidMount = () => {
        axios.post(BaseUrl + '/api/get-payment-gateway',{venue_id: VenueID, company_id: CompanyID})
            .then(response => {
                if(response.data.status){
                    this.setState(()=>({is_enable: (parseInt(response.data.venue_data.ibs) ==1)?true:false,is_disable:true,is_integrated:(parseInt(response.data.venue_data.is_integrated) ==1)?true:false}));
                }
            }).catch((err) => {

        });
    };

    paymentStatusChanged = () => {

        this.setState((prevState)=>({is_enable:!prevState.is_enable}),()=>{
            IBS = (this.state.is_enable)?1:0;
            let userData = localStorage.getItem('userData');
            if (userData) {
                userData = JSON.parse(userData);
                if (userData.venue_id){

                    userData.ibs = IBS;

                    localStorage.setItem('userData', JSON.stringify(userData));
                }
            }
           axios.post(BaseUrl + '/api/update-pos-configuration',{type:'ibs',is_enable:this.state.is_enable, venue_id: VenueID, company_id: CompanyID})
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

    paymentIntegratedChanged = () => {

        this.setState((prevState)=>({is_integrated:!prevState.is_integrated}),()=>{
            INTEGRATED = (this.state.is_integrated)?1:0;
            let userData = localStorage.getItem('userData');
            if (userData) {
                userData = JSON.parse(userData);
                if (userData.venue_id){
                    userData.is_integrated = INTEGRATED;
                    localStorage.setItem('userData', JSON.stringify(userData));
                }
            }
            axios.post(BaseUrl + '/api/update-pos-configuration',{type:'voucher',is_integrated:this.state.is_integrated, venue_id: VenueID, company_id: CompanyID})
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
                <div className="dropSegmentation_section" id="pos_configuration" style={{display: 'none'}}>
                    <div className="dropSegmentation_heading clearfix">
                        <h3 style={{fontWeight: 'bold'}}>POS Configuration</h3>
                    </div>
                    <div className={(this.state.is_disable)?'venueInfo_div':'venueInfo_div disabled'}>
                        <div className="venueIdentification_section">
                            <div className='venueIdentification_form' >
                                <ul>
                                    <li>
                                        <label>IBS</label>
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
                    <div className={(this.state.is_disable)?'venueInfo_div':'venueInfo_div disabled'}>
                        <div className="venueIdentification_section">
                            <div className='venueIdentification_form' >
                                <ul>
                                    <li>
                                        <label>Integrated Vouchers</label>
                                        <ToggleSwitch

                                            checked={this.state.is_integrated }
                                            onChange={(e)=> {this.paymentIntegratedChanged(e)}}
                                        />
                                        <span style={{fontWeight:'bold'}}> {this.state.is_integrated ? "ON" : "OFF"}</span>
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

export default PosCofiguration;