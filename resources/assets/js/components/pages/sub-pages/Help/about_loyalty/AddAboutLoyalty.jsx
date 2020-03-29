import React, {Component} from 'react';
import CKEditor from "react-ckeditor-component";
import {NotificationManager} from "react-notifications";

class AddAboutLoyalty extends Component {
    constructor(props){
        super(props);
        this.state = {
            field2:'',
            field3:'',
            type:'about_loyalty'
        }
    }

    onChangeDescriptions = (evt) => {
        let field2 = evt.editor.getData();
        this.handleChange({field2})
    };//..... end of onChangeDescriptions() .....//

    handleChange = (obj) => {
        this.setState(()=>(obj),()=>{
            this.validation();
        });
    };//..... end of handleChange() .....//

    validation = () => {
        if(this.state.field2 == "" || this.state.field3 == "" )
            this.saveCategoryBtn.classList.add("disabled");
        else
            this.saveCategoryBtn.classList.remove("disabled");
    };//---- End of validation() ----//

    onChangeStampCard = (evt) => {
        let field3 = evt.editor.getData();
        this.handleChange({field3})
    };//..... end of onChangeDescriptions() .....//

    aboutLoyaltySave = () =>{
        show_loader();
        axios.post(BaseUrl + '/api/save-about-loyalty',{...this.state,company_id:CompanyID,editId: Object.keys(this.props.aboutLoyalty).length > 0 ? this.props.aboutLoyalty.id : 0})
            .then(res => {
                show_loader();
                this.setState({vouchers:'',stampCard:''});
                NotificationManager.success(res.data.message, 'Success');
                this.props.addAboutLoyalty('listing');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while adding Contacts .", 'Error');
        });
    };//---- End of aboutLoyaltySave() ----//
    componentDidMount = () =>{
        if(this.props.aboutLoyalty.id)
            this.loadEditData();
    };

    loadEditData = () =>{
        this.setState(()=>({
            field2:this.props.aboutLoyalty.field2,
            field3:this.props.aboutLoyalty.field3
        }),()=>{
            this.validation();
        });
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
                                            <h3>About Loyalty</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customPlaceholder_outer">
                                                                <h4>Vouchers</h4>
                                                                <CKEditor activeClass="p10" content={this.state.field2} events={{"change": this.onChangeDescriptions}}/>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="customPlaceholder_outer">
                                                                <h4>Stamp Card</h4>
                                                                <CKEditor activeClass="p10" content={this.state.field3} events={{"change": this.onChangeStampCard}}/>
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
                        <a  style={{cursor:'pointer'}} ref={(ref)=>{this.saveCategoryBtn = ref;}} className="disabled selecCompaignBttn save_category" onClick={this.aboutLoyaltySave}>Save</a>
                        <a  style={{cursor:'pointer'}} className="close_punch_popup selecCompaignBttn" onClick={() =>{this.props.addAboutLoyalty('listing');}}>CANCEL</a>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of AddAboutLoyalty.

AddAboutLoyalty.propTypes = {};

export default AddAboutLoyalty;