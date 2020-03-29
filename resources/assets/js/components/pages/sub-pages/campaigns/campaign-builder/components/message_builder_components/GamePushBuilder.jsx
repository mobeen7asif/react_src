import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import {NotificationManager} from 'react-notifications';
import {connect} from "react-redux";
import {
    selectDiscount,
    selectDiscountType,
    selectMessageBuilderObject, selectVoucherEndDate, selectVoucherStartDate
} from "../../../../../../redux/selectors/Selectors";
import {addMessageBuilderValue, setBusinessList} from "../../../../../../redux/actions/CampaignBuilderActions";
import ImageCropping from "../../../../ImageCropping";

class GamePushBuilder extends Component {
    customDropDownOneSpanRef = null;
    customDropDownShowOneRef = null;
    customDropDownBSpanRef   = null;
    customDropDownShowBRef   = null;
    canvas                   = null;
    canvas2                  = null;

    state = {
        src : "",
        src2 : ""
    };

    setFilename = (fileName) => {
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, resource: fileName}}));
    };//..... end of setFilename() .....//

    setBadgeFilename = (fileName) => {
        let other = {...this.props.messageBuilder.other};
        other.content['badgeImage'] =  fileName;
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, other: {...other}}}));
    };//..... end of setBadgeFilename() .....//

    setMessageValue = (key, value) => {
        let other = {...this.props.messageBuilder.other};
        other.content[key] =  value;
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, other: {...other}}}));
    };//..... end of setMessageValue() .....//

    checkDiscountValue = (e) => {
        let value = parseFloat(e.target.value);
        if (this.props.discount_type === '%' && value > 100)
            return false;

        if (isFinite(value))
            this.setMessageValue('discount',value);
        else
            this.setMessageValue('discount','');

    };//..... end of checkDiscountValue() ......//

    componentWillMount = () => {
        if (this.props.business.length <= 0)
            this.loadBusinessList();
    };//..... end of componentWillMount() .....//

    handleChangeStartDate = (date) => {
        this.setVoucherValidDate('voucher_start_date', date);
    };//..... end of handleChangeStartDate() .....//

    handleChangeEndDate = (date) => {
        this.setVoucherValidDate('voucher_end_date', date);
    };//..... end of handleChangeEndDate() .....//

    setVoucherValidDate = (key, momentObj) => {
        let other = {...this.props.messageBuilder.other};
        other.content[key] =  momentObj.format('DD-MM-YYYY HH:mm');
        other.content['voucher_valid'] = 'between';
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, other: {...other}}}));
    };//..... end of setVoucherValidDate() .....//

    removeUploadedFile = () => {
        this.removeFile(this.props.messageBuilder.resource);
        this.setFilename("");
    };//..... end of removeUploadedFile() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    handleDropDownOneSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowOneRef.style.display =  this.customDropDownShowOneRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownOneSpanClick() .....//

    handleDropDownBSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowBRef.style.display =  this.customDropDownShowBRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownBSpanClick() .....//

    setDiscountType = (type) => {
        this.customDropDownShowOneRef.style.display = 'none';
        this.customDropDownOneSpanRef.classList.remove('changeAero');

        let other = {...this.props.messageBuilder.other};
        other.content['discount_type'] =  type;
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, other: {...other}}}));
    };

    loadBusinessList = () => {
        show_loader();
        axios.get(`${BaseUrl}/api/business-list`).
        then((response) => {
            show_loader(true);
            this.props.dispatch(setBusinessList(response.data.data));
        }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while getting businesses list.", 'Error');
        });
    };//..... end of loadBusinessList() .....//

    setBusiness = (business) => {
        this.customDropDownShowBRef.style.display = 'none';
        this.customDropDownBSpanRef.classList.remove('changeAero');

        this.setMessageValue('business', business);
    };//..... end of setBusiness() .....//

    removeFile = (fileName) => {
        axios.get(BaseUrl + '/api/remove-file/?file='+ fileName)
            .then((response) => {
               //
            }).catch((err)=> {
            //
        });
    };//..... end of removeFile() ......//

    removeBadgeUploadedFile = () => {
        this.removeFile(this.props.messageBuilder.other.content.badgeImage);
        this.setBadgeFilename("");
    };

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result }),
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };//..... end of onSelectFile() .....//

    setCanvas = (canvas) => {
        this.canvas = canvas;
    };//..... end of setCanvas() .....//

    populateImage = () => {
        this.setFilename(this.canvas ? this.canvas.toDataURL('image/jpeg') : '');
    };

    onSelectFile2 = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src2: reader.result }),
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };//..... end of onSelectFile() .....//

    setCanvas2 = (canvas) => {
        this.canvas2 = canvas;
    };//..... end of setCanvas() .....//

    populateImage2 = () => {
        this.setBadgeFilename(this.canvas2 ? this.canvas2.toDataURL('image/jpeg') : '');
    };

    render() {
        return (
            <React.Fragment>
                <div className="chooseMessageType">
                    <label>Choose your Message type for users.</label>
                    <div className="chooseMessageType_icons">
                        <div className="segmentsOptions clearfix">
                            <ul>
                                <li>
                                    <div className="segmentsOptions_detail">
                                        <span className={'choseSegmnt'}>
                                            <b className="voucher_icon">&nbsp;</b>
                                        </span>
                                        <h3>Voucher</h3>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="messageBuilder_outer ">
                    <div className="messageBuilder_heading">
                        <h3>Voucher Builder</h3>
                        <p>Specify voucher reward for your campaign and the period which it can be redeemed.</p>
                    </div>
                    <div className="pushNotification_section clearfix">
                        <div className="primary_voucher_column">
                            <div className="segment_heading segmentaxn_heading">
                                <h3>VOUCHER</h3>
                            </div>
                            <div className="smsDetail_inner primary_voucher_setting">
                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Discount Type</h3>
                                    </div>
                                    <div className="stateSegmentation primary_voucher_setting">
                                        <div className="venueIdentification_section">
                                            <div className="customDropDown">
                                                <span  ref={ref => this.customDropDownOneSpanRef = ref} onClick={this.handleDropDownOneSpanClick}> {this.props.discount_type ? (this.props.discount_type == Currency ? 'Fixed' : 'Percentage') : 'Select discount type'}</span>
                                                <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowOneRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                        <li onClick={(e)=> {this.setDiscountType('%')}} className={this.props.discount_type === '%' ? "selectedItem" : ''}>Percentage</li>
                                                        <li onClick={(e)=> {this.setDiscountType(Currency)}} className={this.props.discount_type === Currency ? "selectedItem" : ''}>Fixed</li>
                                                    </Scrollbars>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Voucher </h3>
                                    </div>
                                    <div className="stateSegmentation">
                                        <div className="compaignDescription_outer   clearfix">
                                            <div className="voucherDiscount">
                                                <label style={{float: 'left',
                                                    lineHeight: '50px',
                                                    marginRight: '10px'}}>I want to offer a voucher for</label>
                                                <div className="gammingDollar_outer" style={{    float: 'left',
                                                    display: 'block'}}>
                                                    {( this.props.messageBuilder.other.content.discount_type === Currency &&
                                                        <small>{this.props.messageBuilder.other.content.discount_type}</small>
                                                    )}
                                                </div>

                                                <div className="gammingValue_outer clearfix">
                                                    <div className="gamingAmount clearfix">
                                                        <input type="text" style={{width: '100%'}} onChange={(e)=>{ this.checkDiscountValue(e); }} value={this.props.discount} />
                                                    </div>
                                                    <small>{this.props.discount_type === "%" && this.props.discount_type}</small>
                                                </div>
                                                <label>discount on</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Date</h3>
                                        <div className="segmntClose">
                                            <a  style={{cursor:'pointer'}}>&nbsp;</a>
                                        </div>
                                    </div>

                                    <div className="stateSegmentation">
                                        <div className="compaignDescription_outer   clearfix">
                                            <label>Voucher is valid <span style={{fontSize: '10px',marginLeft: '19px',fontStyle: 'italic', color: 'silver'}}>We are using Australian Eastern Standard Time (AEST), please set your time accordingly</span></label>
                                            {/*<div className="placeHolderOuter expandPlaceholder clearfix">
                                                <div className="customDropDown">
                                                    <span>Between</span>
                                                    <ul className="customDropDown_show customPlaceHolder">
                                                        <li>Between</li>
                                                    </ul>
                                                </div>
                                            </div>*/}
                                            <div className="datePickerOuter clearfix">
                                                <div className="datePickerLeft">
                                                    <strong>From</strong>
                                                    <div className="datePicker">
                                                        <DatePicker selected={this.props.startDate} dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm" minDate={moment()} onChange={this.handleChangeStartDate}/>
                                                    </div>
                                                </div>
                                                <div className="datePickerLeft frDatePicker">
                                                    <strong>To</strong>
                                                    <div className="datePicker">
                                                        <DatePicker selected={this.props.endDate} dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm" minDate={this.props.startDate} onChange={this.handleChangeEndDate}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Promotional Text</h3>
                                    </div>
                                    <div className="stateSegmentation primary_voucher_setting">
                                        <div className="venueIdentification_section">
                                            <div className="venueIdentification_form">
                                                <ul>
                                                    <li className="voucherDesc">
                                                        <div className="segmentInput ">
                                                            <textarea placeholder="Promotional text" onChange={(e)=>{this.setMessageValue('promotion_text', e.target.value)}} value={this.props.messageBuilder.other.content.promotion_text ? this.props.messageBuilder.other.content.promotion_text : ''}></textarea>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>No of Uses</h3>
                                    </div>
                                    <div className="stateSegmentation primary_voucher_setting">
                                        <div className="venueIdentification_section">
                                            <div className="venueIdentification_form">
                                                <ul>
                                                    <li>
                                                        <div className="customInput_div">
                                                            <input onChange={(e) => {
                                                                let value = e.target.value;
                                                                if (value.match(/^\d*$/gm))
                                                                    this.setMessageValue('no_of_uses', value);
                                                            }} placeholder="No of uses" type="text" value={this.props.messageBuilder.other.content.no_of_uses ? this.props.messageBuilder.other.content.no_of_uses : '' }/>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Redeemable at</h3>
                                    </div>
                                    <div className="stateSegmentation primary_voucher_setting">
                                        <div className="venueIdentification_section">
                                            <div className="venueIdentification_form">
                                                <ul>
                                                    <li>
                                                        <div className="customInput_div">
                                                            <input placeholder="Redeemable at" type="text" onChange={(e)=>{this.setMessageValue('redeemable_at', e.target.value)}} value={this.props.messageBuilder.other.content.redeemable_at ? this.props.messageBuilder.other.content.redeemable_at : ''}/>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Terms &amp; Conditions</h3>
                                    </div>
                                    <div className="stateSegmentation primary_voucher_setting">
                                        <div className="venueIdentification_section">
                                            <div className="venueIdentification_form">
                                                <ul>
                                                    <li>
                                                        <div className="customInput_div">
                                                            <input onChange={(e)=>{this.setMessageValue('terms_and_condition', e.target.value)}} placeholder="Terms & condition" type="text" value={this.props.messageBuilder.other.content.terms_and_condition ? this.props.messageBuilder.other.content.terms_and_condition : ''}/>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Business</h3>
                                    </div>
                                    <div className="stateSegmentation primary_voucher_setting">
                                        <div className="venueIdentification_section">
                                            <div className="venueIdentification_form">
                                                <div className="customDropDown">
                                                    <span  ref={ref => this.customDropDownBSpanRef = ref} onClick={this.handleDropDownBSpanClick}> {this.props.messageBuilder.other.content.business ? this.props.messageBuilder.other.content.business.business_name : 'Select Business'}</span>
                                                    <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowBRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                                        <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                            {
                                                                this.props.business.map((business) => {
                                                                    return <li key={business.business_id} onClick={(e)=> {this.setBusiness(business)}} className={this.props.messageBuilder.other.content.business && business.business_id === this.props.messageBuilder.other.content.business.business_id ? 'selectedItem' : ''}>{business.business_name}</li>;
                                                                })
                                                            }
                                                        </Scrollbars>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Badge Name</h3>
                                    </div>
                                    <div className="stateSegmentation primary_voucher_setting">
                                        <div className="venueIdentification_section">
                                            <div className="venueIdentification_form">
                                                <ul>
                                                    <li>
                                                        <div className="customInput_div">
                                                            <input onChange={(e)=>{this.setMessageValue('badgeName', e.target.value)}} placeholder="Badge Name" type="text" value={this.props.messageBuilder.other.content.badgeName ? this.props.messageBuilder.other.content.badgeName : ''}/>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Badge Description</h3>
                                    </div>
                                    <div className="stateSegmentation primary_voucher_setting">
                                        <div className="venueIdentification_section">
                                            <div className="venueIdentification_form">
                                                <ul>
                                                    <li>
                                                        <div className="customInput_div">
                                                            <input onChange={(e)=>{this.setMessageValue('badgeDescription', e.target.value)}} placeholder="Badge Description" type="text" value={this.props.messageBuilder.other.content.badgeDescription ? this.props.messageBuilder.other.content.badgeDescription : ''}/>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Badge Image</h3>
                                    </div>
                                    <div className="stateSegmentation">
                                        <div className="compaignDescription_outer   clearfix">
                                            <div className="importBulk">
                                                <div className="image_notify_upload_area image_notify_upload_area_area1"  style={{border: '0px', background: `url(${BaseUrl}/assets/images/bulkDrop.png) no-repeat center`, backgroundSize: '100%'}}>
                                                    <input type="file" onChange={this.onSelectFile2} />
                                                </div>
                                            </div>
                                            <ImageCropping src={this.state.src2} setCanvas={this.setCanvas2} image={this.props.messageBuilder.other.content.badgeImage}
                                                           cropingDivStyle={{width: '50%', float: 'left'}}
                                                           previewStyle={{width: '45%', float: 'left', marginLeft: '30px'}}
                                                           previewImgStyle={{maxHeight: '208px'}}
                                                           onCropCompleted={this.populateImage2}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Upload Image</h3>
                                    </div>
                                    <div className="stateSegmentation">
                                        <div className="compaignDescription_outer   clearfix">
                                            <div className="importBulk">
                                                <div className="image_notify_upload_area image_notify_upload_area_area2" style={{border: '0px', background: `url(${BaseUrl}/assets/images/bulkDrop.png) no-repeat center`, backgroundSize: '100%'}}>
                                                    <input type="file" onChange={this.onSelectFile} />
                                                </div>
                                            </div>
                                            <ImageCropping src={this.state.src} setCanvas={this.setCanvas} image={this.props.messageBuilder.resource}
                                                           cropingDivStyle={{width: '50%', float: 'left'}}
                                                           previewStyle={{width: '45%', float: 'left', marginLeft: '30px'}}
                                                           previewImgStyle={{maxHeight: '208px'}}
                                                           onCropCompleted={this.populateImage}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="voucher_preview_section">
                            <div className="voucher_preview_detail">
                                <div className="voucher_picture">
                                <span>
                                    <img src={this.props.messageBuilder.resource ? (this.props.messageBuilder.resource.includes('data:image/jpeg;base64') ? this.props.messageBuilder.resource : BaseUrl+'/'+this.props.messageBuilder.resource) : "assets/images/templateList_img.png"} alt="#" />
                                </span>
                                </div>
                                <div className="discount_value">
                                <span>
                                    {(this.props.discount_type ===Currency &&
                                        <i style={{fontStyle: 'normal', fontSize: '39px', fontWeight: '700', lineHeight: '41px', color: '#617283'}}>{this.props.discount_type}</i>
                                    )}<b>{this.props.discount}{(this.props.discount_type ==='%' &&
                                    <i style={{fontStyle: "normal", fontSize: '37px', fontWeight: '700', lineHeight: '41px', color: 'rgb(97, 114, 131)'}}>{this.props.discount_type}</i>
                                )}</b>
                                    <small style={{display: 'block'}}>DISCOUNT</small>
                                </span>
                                </div>
                                <div className="discount_value_text">
                                    <h3>{(this.props.messageBuilder.other.content).voucher_name ? (this.props.messageBuilder.other.content).voucher_name : ""}</h3>
                                    <p>{(this.props.messageBuilder.other.content).voucher_description ? (this.props.messageBuilder.other.content).voucher_description : ""} </p>
                                    <div className="voucherCode_date">
                                        <div className="voucherCode_date_text">
                                            <label>NB2015MRT</label>
                                            <strong>VOUCHER CODE</strong>
                                        </div>
                                        <div className="voucherCode_date_text">
                                            <label>{this.props.endDate ? this.props.endDate.format('ddd, MMM D') : ''}</label>
                                            <strong>EXP DATE</strong>
                                        </div>
                                    </div>
                                </div>
                                <div className="dotted_seprater">
                                    <span>&nbsp;</span>
                                </div>
                                <div className="barcode_data">
                                <span>
                                    <img src="assets/images/barcodePic.png" alt="#"/>
                                </span>
                                    <button>REDEEM</button>
                                </div>
                            </div>
                        </div>
                        <div className="voucherPreview">Preview</div>
                    </div>
                </div>
            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of GamePushBuilder.

const mapStateToProps = (state) => {
    return {
        messageBuilder  : selectMessageBuilderObject(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        discount        : selectDiscount(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        discount_type   : selectDiscountType(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        currentChannel  : state.campaignBuilder.currentChannel,
        business        : state.campaignBuilder.businessList,
        startDate       : selectVoucherStartDate(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        endDate         : selectVoucherEndDate(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel)
    };
};
export default connect(mapStateToProps)(GamePushBuilder);