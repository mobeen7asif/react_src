import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    addVoucherDefault,
    setEditVoucherData,
    setFinalVoucherData,
    setCheckedKeys,
    resetVoucherData,
    setVoucherBusiness
} from "../../../../redux/actions/VoucherAction";
import ToggleSwitch from "@trendmicro/react-toggle-switch";
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';

import {NotificationManager} from "react-notifications";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import ImageCropping from "../../ImageCropping";
import MessageBuilderValidator from "../../../../utils/MessageBuilderValidator";
import {selectVoucherDateToSave,prepareEditDataVoucher} from "../../../../redux/selectors/Selectors";
import {setCamapaignDefaultValue} from "../../../../redux/actions/CampaignBuilderActions";
import UserTarget from "./UserTarget";
import VoucherComponents from "./VoucherComponents";
import {find} from "lodash";
import RedirectBack from "./RedirectBack";
class AddVoucher extends Component {

    canvas = null;

    messageBuilderValidator = new MessageBuilderValidator;
    state = {
        is_basket:false,
        src : "",
    };

    componentDidMount = () =>{
        if (Object.keys(this.props.voucher).length > 0) {
         this.loadEditData(this.props.voucher);

        } else {
            this.props.dispatch(resetVoucherData());
            this.setKeyValueVoucher('voucher_type','voucher');

        }

    }

    setKeyValueVoucher = (key,value) =>{
        this.props.dispatch(addVoucherDefault(key, value));
    }



    checkDiscountVoucherValue = (e) => {
        let value = parseFloat(e.target.value);

        if(value == "")
            value = 0;

        if (this.props.discount_type === '%' && value > 99)
            return false;
        if(isNaN(value))
            value = '';

        this.setKeyValueVoucher('amount',value);
    };//..... end of checkDiscountVoucherValue() ......//

    checkValidVoucherIbs = (e) => {
        let value = e.target.value;
        if(value == "")
            value = 0;

        if (! isFinite(value))
            return false;

        if (value > 999)
            return false;

        if (value.length > 3)
            return false;

        this.setKeyValueVoucher('pos_ibs',value);
    }//---- End of checkValidVoucherIbs() -----//

    showHideDate = () => {

        var value=1;
        var isDay = false

        if(!this.props.is_day){
            isDay  = true;
            value = 1;
        }else{
            value =0;
        }
        if(isDay){
            this.setKeyValueVoucher('start_date',null);
            this.setKeyValueVoucher('end_date',null);
        }


        this.setKeyValueVoucher('is_day',isDay);
        this.setKeyValueVoucher('isNumberOfDays',value);
    };//..... end of showHideDate() .....//
    populateImage = () => {
        this.setKeyValueVoucher('image',this.canvas ? this.canvas.toDataURL('image/jpeg') : '');
    };


    setCanvas = (canvas) => {
        this.canvas = canvas;
    };//..... end of setCanvas() .....//

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result }),
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };//..... end of onSelectFile() .....//

    backSpaceEnter = (e) =>{
        var code = e.keyCode || e.which;
        if(code === 8) { //13 is the enter keycode
            if(e.target.value ==''){
                this.setKeyValueVoucher('amount',0);
            }
        }
    }

    saveVoucherData = () =>{
        if (!this.canvas && this.state.src) {
            NotificationManager.warning("Please crop the image.", 'Image Cropping!');
            return false;
        }//..... end if() .....//

        let image = this.canvas ? this.canvas.toDataURL('image/jpeg') : null;

        if (!image && !this.props.image) {
            NotificationManager.warning("Please select the image.", 'Image Missing');
            return false;
        }//..... end if() .....//

        show_loader();
        axios.post(BaseUrl + '/api/save-voucher', {
            ...this.props.dataTosave,
            editId:this.props.id,
            image,
            company_id: CompanyID
        })
            .then((response) => {
                show_loader(true);
                NotificationManager.success('Voucher  saved successfully!', 'Success');
                this.redirectToListing();
            }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while saving punch card, please try later."+err, 'Error');
        });
    }

    redirectToListing = () => {
        this.props.dispatch(resetVoucherData());
        this.props.addVoucher('listing');
    };
    loadEditData = (voucher) =>{
        let voucherData =  prepareEditDataVoucher(voucher,this.props.businessList)

        this.props.dispatch(setEditVoucherData(voucherData));
            var busniessData = JSON.parse(voucher.business);
        this.props.dispatch(setVoucherBusiness(this.props.businessList.map(b => {
            if (busniessData)
                if (busniessData.some(function (el) {
                    return el.business_id == b.business_id;
                })){
                    b.value = true;
                }

            return b;
        })));
    }
    render() {
        return (
           <div>

               <div className="messageBuilder_outer ">
                   <RedirectBack  redirectToListing={this.redirectToListing} text='Voucher Builder'/>
                   <div className="pushNotification_section clearfix">
                       <div className="primary_voucher_column">
                           <div className="segment_heading segmentaxn_heading">
                               <h3>VOUCHER</h3>
                           </div>
                           <div className="smsDetail_inner primary_voucher_setting">
                               <VoucherComponents
                                   setKeyValueVoucher={this.setKeyValueVoucher}
                                   checkDiscountVoucherValue={this.checkDiscountVoucherValue}
                                   checkValidVoucherIbs={this.checkValidVoucherIbs}
                                   backSpaceEnter={this.backSpaceEnter}
                                   showHideDate={this.showHideDate}
                                   getBusinessCategoriesList={this.getBusinessCategoriesList}
                                   showDropDown={false}
                               />


                               <div className="dropSegmentation_section">
                                   <div className="dropSegmentation_heading clearfix">
                                       <h3>Upload Image</h3>
                                   </div>
                                   <div className="stateSegmentation">
                                       <div className="compaignDescription_outer   clearfix">
                                           <div className="importBulk">
                                               <div className="image_notify_upload_area image_notify_upload_area_area2" style={{border: '0px', background: `url(${BaseUrl}/assets/images/bulkDrop.png) no-repeat center`, backgroundSize: 'cover'}}>
                                                   <input type="file" onChange={this.onSelectFile} />
                                               </div>
                                           </div>

                                           <ImageCropping src={this.state.src} setCanvas={this.setCanvas} image={this.props.image}
                                                          cropingDivStyle={{width: '50%', float: 'left'}}
                                                          previewStyle={{width: '42%', float: 'left', marginLeft: '30px'}}
                                                          previewImgStyle={{maxHeight: '208px'}}
                                                          onCropCompleted={this.populateImage}/>
                                       </div>
                                   </div>
                               </div>
                               {
                                   ((this.props.id !=0) &&

                                       <UserTarget  setKeyValueVoucher={this.setKeyValueVoucher}/>

                                   )
                               }

                           </div>

                       </div>
                       <div className="voucher_preview_section">
                           <div className="voucher_preview_detail">
                               <div className="voucher_picture">
                                <span>
                                    <img src={this.props.image !='' ? (this.props.image.includes('data:image/jpeg;base64') ? this.props.image : BaseUrl+'/'+this.props.image) : "assets/images/templateList_img.png"} alt="#" />
                                </span>
                               </div>
                               {/* <div className="discount_value">
                                <span>

                                    {(this.props.discount_type ===Currency &&
                                        <i style={{fontStyle: 'normal', fontSize: '39px', fontWeight: '700', lineHeight: '41px', color: '#617283'}}>{this.props.discount_type} {this.props.amount}</i>
                                    )}
                                    <b>

                                    {( (this.props.discount_type ==='%' && this.props.amount <= 99) &&
                                        <i style={{fontStyle: "normal", fontSize: '37px', fontWeight: '700', lineHeight: '41px', color: 'rgb(97, 114, 131)'}}>{this.props.amount} {this.props.discount_type}</i>
                                    )}</b>
                                    {( ( (this.props.discount_type ==='%' && this.props.amount <= 99 ) || this.props.discount_type ===Currency ) &&
                                        <small style={{display: 'block'}}>DISCOUNT</small>
                                    )}

                                    {( (this.props.discount_type ==='Free') &&
                                        <b>Free</b>
                                    )}
                                </span>
                            </div>*/}
                               <div className="discount_value_text">
                                   <h3>{this.props.name}</h3>
                                   <p>{this.props.promotion_text} </p>
                                   <div className="voucherCode_date">
                                       <div className="voucherCode_date_text">
                                           <label>NB2015MRT</label>
                                           <strong>VOUCHER CODE</strong>
                                       </div>
                                       <div className="voucherCode_date_text">
                                           <label>{this.props.end_date ? this.props.end_date.format('ddd, MMM D') : ''}</label>
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
                   <div className="continueCancel  listShops">
                       <a  style={{cursor:'pointer'}} className={ this.messageBuilderValidator.validateVoucher(this.props.voucherBuilder) ? 'selecCompaignBttn' : 'disabled selecCompaignBttn'} onClick={this.saveVoucherData}>Save</a>
                       <a  style={{cursor:'pointer'}} className="close_punch_popup" onClick={this.redirectToListing} >CANCEL</a>
                   </div>
               </div>
           </div>
        );


    }//..... end of render() .....//

}//..... end of CampaignList.
const mapStateToProps = (state) => ({
    ...state.voucherBuilder,
    voucherBuilder: state.voucherBuilder,
    dataTosave:selectVoucherDateToSave(state.voucherBuilder)
});
export default connect(mapStateToProps)(AddVoucher);