import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import UploadFileDropZone from "./alert_sms_builder/UploadFileDropZone";
import {findIndex, forIn} from "lodash";
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import {NotificationManager} from 'react-notifications';

class GameSmsBuilder extends Component {
    state = {
        products: {},
        filterProducts: {},
        startDate: null,
        endDate:  null,
    };

    dInput1 = null;
    dInput3 = null;
    dInput2 = null;

    setFilename = (fileName) => {
        let obj = this.props.messageBuilder[this.props.currentChannel];
        obj.resource = fileName;
        this.props.saveToMessageBuilder(obj);
    };//..... end of setFilename() .....//

    setMessageValue = (key, value) => {
        let obj = this.props.messageBuilder[this.props.currentChannel];
        if (!obj.other.content)
            obj.other.content = {};

        obj.other.content[key] =  value;
        this.props.saveToMessageBuilder(obj);
    };//..... end of setMessageValue() .....//

    checkDiscountValue = (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value))
            e.target.value = '';

        this.setMessageValue('discount', (this.dInput1.value + this.dInput2.value + this.dInput3.value))
    };//..... end of checkDiscountValue() ......//

    componentWillMount = () => {
        this.getProducts();
    };//..... end of componentWillMount() .....//

    getProducts = () => {
        if (Object.keys(this.state.products).length > 0)
            return false;

        show_loader();
        axios.get(`${BaseUrl}/api/products-list`).
        then((response) => {
            show_loader();
            this.setState(() => ({
                products        : response.data,
                filterProducts  : response.data
            }));
        }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while getting products list.", 'Error');
        });

        if ( !this.props.messageBuilder[this.props.currentChannel].other.content.products )
            this.props.messageBuilder[this.props.currentChannel].other.content.products = [];
    };//..... end of getProducts() .....//

    selectProduct = (key, value) => {
        let productsList = this.props.messageBuilder[this.props.currentChannel].other.content.products;

        let findObj = {id: key, name: value};

        if (findIndex(productsList,findObj) !== -1) {
            productsList = productsList.filter((prd) => {
                return prd.id !== findObj.id;
            })
        } else {
            productsList.push(findObj);
        }//..... end of if-else() .....//

        this.setMessageValue('products', productsList);
    };//..... end of selectProduct() .....//

    selectAll = () => {
        let products = Object.keys(this.state.products).map((key) => {
            return {id: key, name: this.state.products[key]};
        });
        this.setMessageValue('products', products);
    };//..... end of selectAll() .....//

    clearAll = () => {
        this.setMessageValue('products', []);
    };//..... end of clearAll() .....//

    filterProducts = (title) => {
        let prds = (title) ? {} : this.state.products;
        forIn(this.state.products, (value, key) => {
            if ((value.toLowerCase()).indexOf(title.toLowerCase()) > -1) {
                prds[key] = value;
            }//..... end if() .....//
        });

        this.setState(() => ({filterProducts: prds}));
    };//..... end of filterProducts() .....//

    handleChangeStartDate = (date) => {
        this.setState({
            startDate: date
        });

        this.setVoucherValidDate('voucher_start_date', date);
    };//..... end of handleChangeStartDate() .....//

    handleChangeEndDate = (date) => {
        this.setState({
            endDate: date
        });

        this.setVoucherValidDate('voucher_end_date', date);
    };//..... end of handleChangeEndDate() .....//

    setVoucherValidDate = (key, momentObj) => {
        let obj = this.props.messageBuilder[this.props.currentChannel];
        if (!obj.other.content)
            obj.other.content = {};

        obj.other.content[key] =  momentObj.format('DD-MM-YYYY HH:mm');
        obj.other.content['voucher_valid'] = 'between';
        this.props.saveToMessageBuilder(obj);
    };//..... end of setVoucherValidDate() .....//

    showImage = () => {
        $('.image_notify_upload_area').append(`
        <div class="dz-preview dz-processing dz-image-preview dz-success dz-complete custom-Dz">
            <div class="dz-details">
                <img data-dz-thumbnail="true" class="droppedImagePreview" alt="#" src='${BaseUrl}/${this.props.messageBuilder[this.props.currentChannel].resource}' style="width: 147px; margin-left: 36% !important; height: 110px; margin-top: -26px;">
            </div>
           
            <div class="dz-error-message">
                <span data-dz-errormessage="true"></span>
            </div>
            <a class="dz-remove ddZRemove" href="javascript:undefined;" data-dz-remove="">Remove file</a>
        </div>
        `).css('background','none');

        document.querySelector('.ddZRemove').addEventListener('click', () => {
            document.querySelector('.custom-Dz').remove();
            let dz = document.querySelector('.image_notify_upload_area');
            dz.style.background = `url(${BaseUrl}/assets/images/bulkDrop.png) no-repeat center`;
            dz.style.backgroundSize = '100%';
            this.setFilename("");
        });
    };//..... end of showImage() .....//

    componentDidMount = () => {
        if (this.props.messageBuilder[this.props.currentChannel].other.content.discount) {
            let discount = this.props.messageBuilder[this.props.currentChannel].other.content.discount;
            this.dInput1.value = discount[0] ? discount[0] : '';
            this.dInput2.value = discount[1] ? discount[1] : '';
            this.dInput3.value = discount[2] ? discount[2] : '';
        }//.... end if() .....//

        if (this.props.messageBuilder[this.props.currentChannel].other.content.voucher_start_date) {
            let dateTime = (this.props.messageBuilder[this.props.currentChannel].other.content.voucher_start_date).split(' ');
            let startDate = (dateTime[0]).split('-');
            this.setState({startDate: moment(`${startDate[2]}-${startDate[1]}-${startDate[0]} ${dateTime[1]}`)});
        }//.... end if() .....//

        if (this.props.messageBuilder[this.props.currentChannel].other.content.voucher_end_date) {
            let dateTime = (this.props.messageBuilder[this.props.currentChannel].other.content.voucher_end_date).split(' ');
            let endDate = (dateTime[0]).split('-');
            this.setState({endDate: moment(`${endDate[2]}-${endDate[1]}-${endDate[0]} ${dateTime[1]}`)});
        }//.... end if() .....//

        if (this.props.messageBuilder[this.props.currentChannel].resource !== '')
            this.showImage();
    };//..... end of componentDidMount() ....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

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
                                <h3>PRIMARY VOUCHER</h3>
                            </div>
                            <div className="smsDetail_inner primary_voucher_setting">
                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Voucher </h3>
                                    </div>
                                    <div className="stateSegmentation">
                                        <div className="compaignDescription_outer   clearfix">
                                            <div className="voucherDiscount">
                                                <label>I want to offer a voucher for</label>
                                                <div className="gammingValue_outer clearfix">
                                                    <div className="gamingAmount clearfix">
                                                        <input type="text" maxLength="1" style={{width: '33%'}} onChange={(e)=>{ this.checkDiscountValue(e); }} ref={(inputRef) => {this.dInput1 = inputRef}} />
                                                        <input type="text" maxLength="1" style={{width: '33%'}} onChange={(e)=>{ this.checkDiscountValue(e); }} ref={(inputRef) => {this.dInput2 = inputRef}}/>
                                                        <input type="text" maxLength="1" style={{width: '33%'}} onChange={(e)=>{ this.checkDiscountValue(e); }} ref={(inputRef) => {this.dInput3 = inputRef}}/>
                                                    </div>
                                                    <small>%</small>
                                                </div>
                                                <label>discount on</label>
                                            </div>

                                            <div className="tagsCompaigns_detail clearfix">
                                                <div className="tagsCompaigns_list">
                                                    <div className="postcodeSearch">
                                                        <input onChange={(e) => {this.filterProducts(e.target.value)}} placeholder="Search " className="copmpaignSearch_field" type="text"/>
                                                        <input value="" className="copmpaignIcon_field" type="submit"/>
                                                    </div>

                                                    <div className="tagsCompaigns_listScroll tagsScroll" style={{'maxHeight': '205px'}}>
                                                        <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                            <ul className="">
                                                                {
                                                                    Object.keys(this.state.filterProducts).map((index) => {
                                                                        return <li key={index} onClick={(e)=> {this.selectProduct(index, this.state.products[index])}}  className={(findIndex(this.props.messageBuilder[this.props.currentChannel].other.content.products, ['id',index]) !== -1) ? 'selectedItem':''} >{this.state.products[index]}</li>
                                                                    })
                                                                }
                                                            </ul>
                                                        </Scrollbars>
                                                    </div>
                                                </div>

                                                <div className="tagsSelected_tip">
                                                    <div className="selected_tip">
                                                        <i>TIP</i>
                                                        <p>Use the Control (Ctrl on Windows) or Command (⌘ on Mac)key to
                                                            select or unselect items.</p>
                                                        <button onClick={this.selectAll}>SELECT ALL</button>
                                                        <button onClick={this.clearAll}>CLEAR ALL</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="selectedTags">
                                                <label>Selected</label>
                                                <div className="showTags clearfix">
                                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                        {this.props.messageBuilder[this.props.currentChannel].other.content.products.map((prd, key)=>{
                                                            return <a  style={{cursor:'pointer'}} key={prd.id} onClick={(e) => {this.selectProduct(prd.id, prd.name)}}>{prd.name}<i>&nbsp;</i></a>
                                                        })}
                                                    </Scrollbars>
                                                </div>
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
                                            <label>Voucher is valid</label>
                                            <div className="placeHolderOuter expandPlaceholder clearfix">
                                                <div className="customDropDown">
                                                    <span>Between</span>
                                                    <ul className="customDropDown_show customPlaceHolder">
                                                        <li>Between</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="datePickerOuter clearfix">
                                                <div className="datePickerLeft">
                                                    <strong>From</strong>
                                                    <div className="datePicker">
                                                        <DatePicker selected={this.state.startDate} dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm" minDate={moment()} onChange={this.handleChangeStartDate}/>
                                                    </div>
                                                </div>
                                                <div className="datePickerLeft frDatePicker">
                                                    <strong>To</strong>
                                                    <div className="datePicker">
                                                        <DatePicker selected={this.state.endDate} dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm" minDate={this.state.startDate} onChange={this.handleChangeEndDate}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Voucher Name</h3>
                                    </div>
                                    <div className="stateSegmentation primary_voucher_setting">
                                        <div className="venueIdentification_section">
                                            <div className="venueIdentification_form">
                                                <ul>
                                                    <li>
                                                        <div className="customInput_div">
                                                            <input onChange={(e)=>{ this.setMessageValue('voucher_name', e.target.value)}} placeholder="Voucher name" type="text" value={this.props.messageBuilder[this.props.currentChannel].other.content.voucher_name ? this.props.messageBuilder[this.props.currentChannel].other.content.voucher_name : '' }/>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Voucher Description</h3>
                                    </div>
                                    <div className="stateSegmentation primary_voucher_setting">
                                        <div className="venueIdentification_section">
                                            <div className="venueIdentification_form">
                                                <ul>
                                                    <li className="voucherDesc">
                                                        <div className="segmentInput ">
                                                            <textarea placeholder="Voucher Description" onChange={(e)=>{this.setMessageValue('voucher_description', e.target.value)}} value={this.props.messageBuilder[this.props.currentChannel].other.content.voucher_description ? this.props.messageBuilder[this.props.currentChannel].other.content.voucher_description : ''}></textarea>
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
                                                            <input placeholder="Redeemable at" type="text" onChange={(e)=>{this.setMessageValue('redeemable_at', e.target.value)}} value={this.props.messageBuilder[this.props.currentChannel].other.content.redeemable_at ? this.props.messageBuilder[this.props.currentChannel].other.content.redeemable_at : ''}/>
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
                                                            <input onChange={(e)=>{this.setMessageValue('terms_and_condition', e.target.value)}} placeholder="Terms & condition" type="text" value={this.props.messageBuilder[this.props.currentChannel].other.content.terms_and_condition ? this.props.messageBuilder[this.props.currentChannel].other.content.terms_and_condition : ''}/>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
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
                                                <div className="image_notify_upload_area">
                                                    <UploadFileDropZone dropZoneSelector={'.image_notify_upload_area'} uploadsPath={BaseUrl + '/api/upload-file'} setFilename={this.setFilename}
                                                                        acceptedFileTypes={'image/jpeg,image/png,image/gif,image/jpg'} fileName={this.props.messageBuilder[this.props.currentChannel].resource}
                                                                        imageCss={{width: '147px', 'marginLeft': '36% !important', height: '110px', marginTop: '-26px'}}
                                                                        defaultCss={{background: `url(${BaseUrl}/assets/images/bulkDrop.png) no-repeat center`, backgroundSize: '100%'}}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="voucher_preview_section">
                            <div className="voucher_preview_detail">
                                <div className="voucher_picture">
                                <span>
                                    <img src={this.props.messageBuilder[this.props.currentChannel].resource ? BaseUrl+'/'+this.props.messageBuilder[this.props.currentChannel].resource : "assets/images/templateList_img.png"} alt="#" />
                                </span>
                                </div>
                                <div className="discount_value">
                                <span>
                                    <b>{(this.props.messageBuilder[this.props.currentChannel].other.content).discount ? (this.props.messageBuilder[this.props.currentChannel].other.content).discount : 0}<i>%</i></b>
                                    <small style={{display: 'block'}}>DISCOUNT</small>
                                </span>
                                </div>
                                <div className="discount_value_text">
                                    <h3>{(this.props.messageBuilder[this.props.currentChannel].other.content).voucher_name ? (this.props.messageBuilder[this.props.currentChannel].other.content).voucher_name : ""}</h3>
                                    <p>{(this.props.messageBuilder[this.props.currentChannel].other.content).voucher_description ? (this.props.messageBuilder[this.props.currentChannel].other.content).voucher_description : ""} </p>
                                    <div className="voucherCode_date">
                                        <div className="voucherCode_date_text">
                                            <label>NB2015MRT</label>
                                            <strong>VOUCHER CODE</strong>
                                        </div>
                                        <div className="voucherCode_date_text">
                                            <label>{this.state.endDate ? this.state.endDate.format('ddd, MMM D') : ''}</label>
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
}//..... end of GameSmsBuilder.

export default GameSmsBuilder;