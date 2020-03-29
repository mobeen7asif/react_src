import React, {Component} from 'react';
import {connect} from 'react-redux';
import {addVoucherDefault,setEditVoucherData,setFinalVoucherData,setCheckedKeys,resetVoucherData} from "../../../../redux/actions/VoucherAction";
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
import RedirectBack from "./RedirectBack";

class AddIntegratedVoucher extends Component {

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
            this.setKeyValueVoucher('voucher_type','integrated');
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

    getBusinessCategoriesList = (business,check) => {

        show_loader();
        axios.post(BaseUrl + '/api/get-business-category', {business_id: business.business_id, api_key: business.api_key, secret: business.secret_key,company_id:CompanyID})
            .then((response) => {
                if (response.data.status) {

                    var data = response.data.data.map(items => {
                        return {
                            value: items.cate_id + "_" + this.randomString(10, "A"),
                            isParent: true,
                            label: items.cate_name,
                            isCategory: true,
                            voucher_plu_ids: items.voucher_plu_idd,
                            availType:'category',
                            children: items.cate_items.map(productItems => {
                                return {
                                    value: productItems.prd_id + "_" + this.randomString(23, "A"),
                                    label: productItems.prd_name,
                                    voucher_plu_ids: productItems.voucher_plu_idd,
                                    availType:'product',

                                }
                            })

                        }
                    });
                    if(check) {
                        this.setKeyValueVoucher('treeNode', data);
                        this.setKeyValueVoucher('voucher_avial_data', []);
                        this.setKeyValueVoucher('checkedKey', []);
                        this.setKeyValueVoucher('expandedKeys', []);
                    }
                } else {
                    //NotificationManager.warning("Could not get categories list.", 'No Data');
                }//..... end if-else() .....//
                show_loader(true);
            }).catch((err)=> {
            show_loader(true);
            NotificationManager.error("Error occurred while fetching business's category.", 'Error'+err);
        });
    };//..... end of removeFile() ......//

    randomString = (len, an) => {
        an = an && an.toLowerCase();
        var str = "", i = 0, min = an == "a" ? 10 : 0, max = an == "n" ? 10 : 62;
        for (; i++ < len;) {
            var r = Math.random() * (max - min) + min << 0;
            str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
        }
        return str;
    }
    onExpand =(expanded) =>{

        this.setKeyValueVoucher('expandedKeys', [...expanded]);
    }

    onCheck = (checkedKeys,treeNode) => {

        let datArray = this.props.voucher_avial_data;
        if (treeNode.isParent) {

            treeNode.children.forEach(val => {
                var keyValue = val.value.split('_');
                var found=false;
                found = datArray.some(function (el) {
                    return el.voucher_avail_type_id == keyValue[0];
                });
                if (!found) {

                    datArray.push({
                        voucher_avail_type_id: keyValue[0],
                        cat_product_name: val.label,
                        voucher_avail_type: val.availType,
                        voucher_plu_ids: val.voucher_plu_ids,
                    });
                } else {
                    datArray = datArray.filter(function (obj) {
                        return obj.voucher_avail_type_id != keyValue[0];
                    });
                    if(treeNode.checked) {
                        datArray.push({
                            voucher_avail_type_id: keyValue[0],
                            cat_product_name: val.label,
                            voucher_avail_type: val.availType,
                            voucher_plu_ids: val.voucher_plu_ids,
                        });
                    }

                }
            })
            this.setKeyValueVoucher('voucher_avial_data', datArray);
        } else {

            var keyValue = treeNode.value.split('_');
            var found = datArray.some(function (el) {
                return el.voucher_avail_type_id == keyValue[0];
            });

            if (!found) {

                treeNode.parent.children.forEach(item=> {
                    var foundValue = item.value.split('_');
                    if(foundValue[0] == keyValue[0]) {
                        datArray.push({
                            voucher_avail_type_id: keyValue[0],
                            cat_product_name: item.label,
                            voucher_avail_type: item.availType,
                            voucher_plu_ids: item.voucher_plu_ids,
                        });
                    }
                });


            } else {
                datArray = datArray.filter(function (obj) {
                    return obj.voucher_avail_type_id !=  keyValue[0];
                });

            }

        }
        this.props.dispatch(setFinalVoucherData(datArray));

        this.props.dispatch(setCheckedKeys(checkedKeys))

    };

    addBasketValue = (e) => {
        var value=false;

        if(!this.props.basket_level)
            value  = true;


        this.setKeyValueVoucher('basket_level',value);
    };//..... end of addBasketValue() .....//

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
       let voucherData =  prepareEditDataVoucher(voucher,this.props.businessList);
        this.props.dispatch(setEditVoucherData(voucherData));
    }
    render() {
        return (

            <div>
                <div className="messageBuilder_outer ">
                    <RedirectBack style={{marginTop:'10px'}} redirectToListing={this.redirectToListing} text='Voucher Builder'/>
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
                                    showDropDown={true}
                                />

                                {( Object.keys(this.props.business).length !== 0 && this.props.redemption_rule !=='Similar Products') &&(
                                    <div className="dropSegmentation_section" id="tree_view_data">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Basket Level</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className='venueIdentification_form'>
                                                    <div className='venueIdentification_form' >
                                                        <ul>
                                                            <li>
                                                                <label>Apply this voucher on whole basket?</label>
                                                                <ToggleSwitch

                                                                    checked={this.props.basket_level ? true : false}
                                                                    onChange={(e)=> {this.addBasketValue(e)}}
                                                                />
                                                                <span style={{fontWeight:'bold'}}> {this.props.basket_level ? "YES" : "NO"}</span>
                                                            </li>
                                                        </ul>


                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {(Object.keys(this.props.business).length !== 0) && (
                                    <div className="dropSegmentation_section" id="tree_view_data">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Tree View</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className='venueIdentification_form'>
                                                    <CheckboxTree
                                                        nodes={this.props.treeNode?this.props.treeNode:[]}
                                                        checked={this.props.checkedKey?this.props.checkedKey:[]}
                                                        expanded={this.props.expandedKeys?this.props.expandedKeys:[]}
                                                        onCheck={this.onCheck}
                                                        onExpand={this.onExpand}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                {/*   <div className="discount_value">
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
export default connect(mapStateToProps)(AddIntegratedVoucher);