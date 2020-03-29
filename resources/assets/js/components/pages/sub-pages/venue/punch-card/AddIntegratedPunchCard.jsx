import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import {SketchPicker} from 'react-color';
import {NotificationManager} from "react-notifications";
import {find} from 'lodash';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import {connect} from 'react-redux';
import {
    resetPunchCardState,
    setBusiness,
    setBusinessList,
    setCategory,
    setCategoryList,
    setEditData,
    setKeyValue,
    setProduct,
    setProductList,
    setRedemptionCondition,
    setRedemptionFrequency,
    setRedemptionType,
    setVariant,
    setTreeList,
    setSelectedTreeKeys,
    setVarientsList,
    setSubModifiers,
    setVarientListData,
    setExpendedKeys,
    setFinalDataPunchCard, setProductTreeData, setDiscountTypeData
} from "../../../../redux/actions/PunchCardActions";
import {prepareEditData, selectPunchCardDataForSaving, setFrequencyTime} from "../../../../redux/selectors/Selectors";
import {validateIntegratedPunchCardData} from "../../../../utils/Validations";
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import ToggleSwitch from "@trendmicro/react-toggle-switch";
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import ImageCropping from "../../ImageCropping";
import {addEditCampaignData, setVoucherData} from "../../../../redux/actions/CampaignBuilderActions";

class AddIntegratedPunchCard extends Component {
    customDropDownOneSpanRef = null;
    customDropDownShowOneRef = null;
    customDropDownShowThreeRef = null;
    customDropDownBSpanRef = null;
    customDropDownShowBRef = null;
    customDropDownThreeSpanRef = null;
    customDropDownRedSpanRef = null;
    customDropDownShowRedRef = null;
    customDropDownVariantSpanRef = null;
    customDropDownShowVariantRef = null;
    customDropDownDiscountRef = null;
    customDropDownDiscountOneRef = null;
    customDropDownBTwoSpanRef=null;
    customDropDownShowTwoBRef=null;
    canvas = null;

    state = {
        isEdit: 0,
        src: null,
        group_id: 0,
        group_name: "",
        listGroups: [],
        group_shops: [],
        show_tree_view: true,
        autoExpandParent: true,
        treeExpandedKeys: [],
        is_basket: (this.props.basket_level == 1) ? true : false,
        company_id: CompanyID,
        expanded: [],
        checked: [],
        nodes: [{
            value: 'mars',
            label: 'Mars',
            children: [
                {value: 'phobos', label: 'Phobos'},
                {value: 'deimos', label: 'Deimos'},
            ],
        }],
    };

    savePunchCard = () => {

        if (validateIntegratedPunchCardData(this.props.dataToSave, this.props.variantList.length)) {
            NotificationManager.warning("Please fill all the required fields.", 'Missing Fields');
            return false;
        } else {
            show_loader();
            axios.post(BaseUrl + '/api/save-punch-card', {
                ...this.props.dataToSave,
                editId: Object.keys(this.props.punchCard).length > 0 ? this.props.punchCard.id : 0,
                venue_id: VenueID,
                company_id: this.state.company_id
            })
                .then((response) => {
                    show_loader(true);
                    NotificationManager.success('Stamp Card saved successfully!', 'Success');
                    this.redirectToListing();
                }).catch((err) => {
                show_loader(true);
                NotificationManager.error("Error occurred while saving stamp card, please try later.", 'Error');
            });
        }//..... end if-else() .....//
    };//..... end of savePunchCard() .....//

    handleDropDownOneSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowOneRef.style.display = this.customDropDownShowOneRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownOneSpanClick() .....//

    handleDropDownDiscountClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownDiscountOneRef.style.display = this.customDropDownDiscountOneRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownDiscountClick() .....//


    handleDropDownRedSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRedRef.style.display = this.customDropDownShowRedRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownRedSpanClick() .....//

    handleDropDownThreeSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowThreeRef.style.display = this.customDropDownShowThreeRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownThreeSpanClick() .....//

    handleDropDownVariantSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowVariantRef.style.display = this.customDropDownShowVariantRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownVariantSpanClick() .....//

    handleDropDownBSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowBRef.style.display = this.customDropDownShowBRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownBSpanClick() .....//

    setCategory = (category) => {
        this.customDropDownShowOneRef.style.display = 'none';
        this.customDropDownOneSpanRef.classList.remove('changeAero');
        this.props.dispatch(setCategory(category));
        this.getCategoryProductsList(category);
    };//..... end of setCategory() .....//

    setRedemptionType = (redType) => {

        this.customDropDownShowRedRef.style.display = 'none';
        this.customDropDownRedSpanRef.classList.remove('changeAero');
        this.props.dispatch(setRedemptionType(redType));
        if (redType == "transaction_value")
            this.props.dispatch(setRedemptionFrequency("00:10"));

    };//..... end of setRedemptionType() .....//

    setProduct = (product) => {
        this.customDropDownShowThreeRef.style.display = 'none';
        this.customDropDownThreeSpanRef.classList.remove('changeAero');
        this.props.dispatch(setVariant({}));
        this.props.dispatch(setProduct(product));
    };

    setSelectedVariant = (variant) => {
        this.customDropDownShowVariantRef.style.display = 'none';
        this.customDropDownVariantSpanRef.classList.remove('changeAero');
        this.props.dispatch(setVariant(variant));
    };

    setBusiness = (business) => {
        this.customDropDownShowBRef.style.display = 'none';
        this.customDropDownBSpanRef.classList.remove('changeAero');
        this.props.dispatch(setBusiness(business));
        if (business.business_id !== 0) {
            this.getBusinessCategoriesListPunch(business,true);
        }
    };//..... end of setBusiness() .....//

    removeFile = () => {
        axios.get(BaseUrl + '/api/remove-file/?file=' + this.props.image)
            .then((response) => {
                //
            }).catch((err) => {
            //
        });
        this.setNumberValue('image', '');
    };//..... end of removeFile() ......//

    getBusinessList = (business = {}) => {
        if (this.props.businessList.length > 0) {
            if (Object.keys(business).length > 0) {
                this.getBusinessCategoriesListPunch(business,false);
            }

            return false;
        }//..... end if() .....//

        show_loader();
        axios.get(BaseUrl + '/api/business-list/' + CompanyID)
            .then((response) => {
                show_loader(true);
                if (response.data.status) {
                    let business = null;
                    business = find(response.data.data, (b) => {
                        return b.business_id == this.props.business.business_id;
                    });

                    if (Object.keys(this.props.punchCard).length > 0)
                        business = find(response.data.data, (b) => {
                            return b.business_id == this.props.business.business_id;
                        });

                    this.props.dispatch(setBusinessList(response.data.data));
                    if (business) {
                        this.props.dispatch(setBusiness(business));
                        this.getBusinessCategoriesListPunch(business,false);
                    }
                } else {
                    NotificationManager.warning("Could not get businesses list.", 'No Data');
                }//..... end if-else() .....//
            }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while fetching businesses.", 'Error');
        });

    };//..... end of removeFile() ......//

    getBussinessOnEdit = (company_id) => {
        show_loader();
        axios.get(BaseUrl + '/api/business-list/' + company_id)
            .then((response) => {
                show_loader(true);
                if (response.data.status) {
                    let business = null;

                    if (Object.keys(this.props.punchCard).length > 0) {
                        business = find(response.data.data, (b) => {
                            return b.business_id == this.props.business.business_id;
                        });
                        this.setState(() => ({
                            isEdit: 1
                        }))
                    }
                    this.props.dispatch(setBusinessList(response.data.data));
                    if (business) {
                        this.props.dispatch(setBusiness(business));
                        this.getBusinessCategoriesListPunch(business,false);
                    }


                } else {
                    NotificationManager.warning("Could not get businesses list.", 'No Data');
                }//..... end if-else() .....//
            }).catch((err) => {
            show_loader(true);

            NotificationManager.error("Error occurred while fetching businesses.", 'Error');
        });
    };
    randomString = (len, an) => {
        an = an && an.toLowerCase();
        var str = "", i = 0, min = an == "a" ? 10 : 0, max = an == "n" ? 10 : 62;
        for (; i++ < len;) {
            var r = Math.random() * (max - min) + min << 0;
            str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
        }
        return str;
    }
    getBusinessCategoriesListPunch = (business,check) => {

        show_loader();
        axios.post(BaseUrl + '/api/get-business-category', {
            business_id: business.business_id,
            api_key: business.api_key,
            secret: business.secret_key,
            company_id: this.state.company_id
        })
            .then((response) => {
                show_loader(true);

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
                        this.props.dispatch(setTreeList(data));
                        this.props.dispatch(setExpendedKeys([]));
                        this.props.dispatch(setFinalDataPunchCard([]));
                    }
                } else {
                    NotificationManager.warning("Could not get categories list.", 'No Data');
                }//..... end if-else() .....//
            }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while fetching business's category." + err, 'Error');
        });
    };//..... end of removeFile() ......//


    addBasketValue = (e) => {


        this.setState((prevState) => ({is_basket: !prevState.is_basket}), () => {
            this.setNumberValue('basket_level', this.state.is_basket);
        });
    };//..... end of showHideDate() .....//

    setNumberValue = (key, value) => {
        this.props.dispatch(setKeyValue(key, value));
    };//..... end of setNumberValue() .....//

    componentDidMount() {
        this.loadData();

        let company_id = (Object.keys(this.props.punchCard).length > 0) ? this.props.punchCard.company_id : CompanyID;
        this.setState(() => ({company_id: company_id}), () => {

            this.getBussinessOnEdit(company_id);
        });


    };//..... end of componentDidMount() .....//

    loadData = () => {
        if (Object.keys(this.props.punchCard).length > 0) {
            this.loadEditData(this.props.punchCard);

        } else {
            this.props.dispatch(resetPunchCardState());
            this.getBusinessList({});
            this.loadVoucherList(CompanyID,'');
        }
    }

    handleColorChange = (color) => {
        this.setNumberValue('card_color', color.hex);
    };//..... end of handleColorChange() .....//

    setFilename = (fileName) => {
        this.setNumberValue('image', fileName);
    };//..... end of setFilename() .....//

    setRule = (rule) => {
        this.setNumberValue('rule_on', rule);
    };//..... end of setRule() .....//

    loadEditData = (punchCard) => {
        var punchData = prepareEditData(punchCard, this.props.businessList);
        this.props.dispatch(setEditData(punchData));
        this.loadVoucherList(punchCard.company_id,punchCard.voucher_id);
        if (this.props.punchCard.redemption_type == "transaction_value") {
            this.props.dispatch(setRedemptionFrequency(this.props.punchCard.frequency));
        }


    };//..... end of loadEditData() .....//

    redirectToListing = () => {
        this.props.dispatch(resetPunchCardState());
        this.props.addPunchCard('listing');
    };

    handleTransactionFrequencyChange = (value) => {
        if (value)
            this.props.dispatch(setRedemptionFrequency(`${value.hours()}:${value.minutes()}`))
    };//..... end of handleTransactionFrequencyChange() .....//

    handleConditionChange = () => {
        this.props.dispatch(setRedemptionCondition(!this.props.condition))
    };//..... end of handleConditionChange() .....//

    onCheck = (checkedKeys, treeNode) => {
        let datArray = this.props.punch_card_data;
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
            this.props.dispatch(setFinalDataPunchCard(datArray));
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
        this.props.dispatch(setFinalDataPunchCard(datArray));
        this.props.dispatch(setSelectedTreeKeys(checkedKeys));

    };

    onExpand =(expanded) =>{
        this.props.dispatch(setExpendedKeys([...expanded]));
    }

    setDiscountType = (data) => {
        this.customDropDownDiscountOneRef.style.display = 'none';
        this.customDropDownDiscountRef.classList.remove('changeAero');
        this.props.dispatch(setDiscountTypeData(data));
    };//----- setDiscountType() ----//

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({src: reader.result}),
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };//..... end of onSelectFile() .....//

    setCanvas = (canvas) => {
        this.canvas = canvas;
    };//..... end of setCanvas() .....//

    getGroupId = (e) => {
        let index = e.target.selectedIndex;
        let optionElement = e.target.childNodes[index];
        let group_id = optionElement.getAttribute('value');
        let group_name = optionElement.getAttribute('group_name');
        let group_shops = optionElement.getAttribute('group_shops');
        var shop_list = "";
        if (group_shops != "") {
            group_shops = JSON.parse(group_shops);
            group_shops.map((value, key) => {
                shop_list = shop_list + '<strong class="news_owner">' + value.business_name + '</strong>';
            });
        } else {
            group_shops = [];
        }

        document.getElementById("list_bussiness").innerHTML = shop_list;
        this.handleChange({group_id, group_name, group_shops});
    };//..... end of getNewsCatId() .....//

    handleChange = (obj) => {
        this.setState(() => (obj));
    };//..... end of handleChange() .....//

    checkValidIbs = (e) => {
        let value = e.target.value;
        if (value == "")
            value = 0;

        if (!isFinite(value))
            return false;

        if (value > 999)
            return false;

        if (value.length > 3)
            return false;

        this.setNumberValue('pos_ibs', value);
    }
    handleDropDownBSpanTwoClick =(e) =>{
        e.target.classList.toggle('changeAero');
        this.customDropDownBTwoSpanRef.style.display = this.customDropDownBTwoSpanRef.style.display === 'none' ? 'block' : 'none';
    }

    loadVoucherList = (company_id,voucher) => {
        show_loader();
        axios.post(BaseUrl + `/api/list-all-vouchers`, {
            'orderBy':      'created_at',
            'orderType':    'desc',
            'company_id':   (company_id !='')?company_id:CompanyID,
            'category'  :'Public Voucher'
        }).then(res => {
            show_loader(true);
            if (res.data.status) {
                var data = [];
                res.data.data.map((obj)=>{
                    if(obj.category !=='Public Voucher') {
                        data.push(obj)
                    }
                });
                this.setNumberValue('voucherList',data);
                if(voucher !==''){
                    var voucherdata = data.find( (item) => item.id ===  voucher);
                    this.setNumberValue('voucher_name',voucherdata.name);

                }
                //this.props.dispatch(setVoucherData(data));
            } else {
                NotificationManager.error("Error .", 'Error');
            }
        }).catch((err) => {
            show_loader(true);
            //NotificationManager.error("Error occurred while getting businesses list."+err, 'Error');
        });

    };//..... end of loadVoucherList() .....//

    setVoucher = (item) =>{
        this.customDropDownBTwoSpanRef.style.display = 'none';
        this.customDropDownShowTwoBRef.classList.remove('changeAero');

        this.setNumberValue('voucher_id',item.id);
        this.setNumberValue('voucher_name',item.name);
    }

    render() {

        return (
            <div className="newVualt_container">
                <div className="newVualt_container_detail">

                    <div className="newVualt_detail_outer">
                        <div className="newVualt_detail">
                            <div className="newVualt_heading_with_buttons clearfix">
                                <div className="newVualt_heading" style={{width: '100%'}}>
                                    <h3>Add/Edit Stamp Card {/*<i style={{color: 'red', fontSize: '12px'}}>This Stamp Card will not entertained, because this application don't support inventory.</i>*/}</h3>
                                </div>
                            </div>
                            <div className="categoryInfo_container clearfix ">
                                <div className="smsDetail_inner primary_voucher_setting">

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Name</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input placeholder="name..." type="text"
                                                                       onChange={(e) => {
                                                                           this.setNumberValue('name', e.target.value)
                                                                       }} value={this.props.name}/>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Description</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li className="voucherDesc">
                                                            <div className="segmentInput ">
                                                                <textarea placeholder="description..."
                                                                          onChange={(e) => {
                                                                              this.setNumberValue('description', e.target.value)
                                                                          }} value={this.props.description}></textarea>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Select Redemption's Type</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="customDropDown">
                                                    <span ref={ref => this.customDropDownRedSpanRef = ref}
                                                          onClick={this.handleDropDownRedSpanClick}> {this.props.redemption_type ? (find(this.props.redemptionTypeList, {field: this.props.redemption_type})).label : 'Select redemption type'}</span>
                                                    <ul className="customDropDown_show customPlaceHolder"
                                                        ref={ref => this.customDropDownShowRedRef = ref} style={{
                                                        marginBottom: '30px',
                                                        marginTop: '-10px',
                                                        maxHeight: '207px',
                                                        display: 'none'
                                                    }}>
                                                        <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>}
                                                                    renderThumbHorizontal={() => <div></div>}>
                                                            {
                                                                this.props.redemptionTypeList.map((redType) => {
                                                                    return <li key={redType.field} onClick={(e) => {
                                                                        this.setRedemptionType(redType.field)
                                                                    }}
                                                                               className={this.props.redemption_type && redType.field === this.props.redemption_type ? 'selectedItem' : ''}>{redType.label}</li>;
                                                                })
                                                            }
                                                        </Scrollbars>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section"
                                         style={{display: this.props.redemption_type === 'category_product' ? 'block' : 'none'}}>
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Rule For</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="radio_button">
                                                                <input name="optradio" type="radio"
                                                                       checked={!!(this.props.rule_on === 'category')}
                                                                       onChange={() => {
                                                                       }}/>
                                                                <label htmlFor="optradio" onClick={() => {
                                                                    this.setRule('category');
                                                                }}>Category</label>
                                                            </div>
                                                            <div className="radio_button" style={{marginTop: "5px"}}>
                                                                <input name="optradio" type="radio"
                                                                       checked={!!(this.props.rule_on === 'product')}
                                                                       onChange={() => {
                                                                       }}/>
                                                                <label htmlFor="optradio" onClick={() => {
                                                                    this.setRule('product')
                                                                }}>Product</label>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section"
                                         style={{display: this.props.redemption_type === 'transaction_value' ? 'block' : 'none'}}>
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Select Transaction Frequency</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <TimePicker defaultValue={'1:11'} value={this.props.frq}
                                                            showSecond={false}
                                                            onChange={this.handleTransactionFrequencyChange}
                                                            className="customInput_div custom--time-picker"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section " style={{display: this.props.redemption_type === 'category_product' ? 'block' : 'none'}}>
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Business</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <div className="customDropDown">
                                                        <span ref={ref => this.customDropDownBSpanRef = ref}
                                                              onClick={this.handleDropDownBSpanClick}> {this.props.business.business_name ? this.props.business.business_name : 'Select Business'}</span>
                                                        <ul className="customDropDown_show customPlaceHolder"
                                                            ref={ref => this.customDropDownShowBRef = ref} style={{
                                                            marginBottom: '30px',
                                                            marginTop: '-10px',
                                                            maxHeight: '207px',
                                                            display: 'none',
                                                            zIndex: '3'
                                                        }}>
                                                            <Scrollbars autoHeight
                                                                        renderTrackHorizontal={() => <div></div>}
                                                                        renderThumbHorizontal={() => <div></div>}>
                                                                {
                                                                    this.props.businessList.map((business) => {
                                                                        return <li key={business.business_id}
                                                                                   onClick={(e) => {
                                                                                       this.setBusiness(business)
                                                                                   }}
                                                                                   className={this.props.business && business.business_id == this.props.business.business_id ? 'selectedItem' : ''}>{business.business_name}</li>;
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
                                            <h3>Voucher</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <div className='customDropDown'>
                                                        <span  ref={ref => this.customDropDownShowTwoBRef= ref} onClick={this.handleDropDownBSpanTwoClick}> {this.props.voucher_name ? this.props.voucher_name : 'Select Voucher'}</span>
                                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownBTwoSpanRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none',zIndex: '3'}} >
                                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                                {

                                                                    this.props.voucherList.map((voucher) => {
                                                                        return <li key={voucher.id} onClick={(e)=> {this.setVoucher(voucher,"")}} className={ voucher.id === this.props.voucher_id ? 'selectedItem' : ''}>{(voucher.voucher_type!='group-voucher')?<a>{voucher.name}</a>:<a>{voucher.name}<a style={{marginLeft:"3%",color:'blue', fontWeight:'bold',textTransform:'uppercase'}}>Group Voucher</a></a>}</li>;
                                                                    })
                                                                }
                                                            </Scrollbars>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section"
                                         style={{display: this.props.redemption_type === 'category_product' ? 'block' : 'none'}}>
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Select Category</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="customDropDown">
                                                    <span ref={ref => this.customDropDownOneSpanRef = ref}
                                                          onClick={this.handleDropDownOneSpanClick}> {this.props.category.cate_name ? this.props.category.cate_name : 'Select category'}</span>
                                                    <ul className="customDropDown_show customPlaceHolder"
                                                        ref={ref => this.customDropDownShowOneRef = ref} style={{
                                                        marginBottom: '30px',
                                                        marginTop: '-10px',
                                                        maxHeight: '207px',
                                                        display: 'none'
                                                    }}>
                                                        <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>}
                                                                    renderThumbHorizontal={() => <div></div>}>
                                                            {
                                                                this.props.categoryList.map((category) => {
                                                                    return <li key={category.cate_id} onClick={(e) => {
                                                                        this.setCategory(category)
                                                                    }}
                                                                               className={this.props.category.cate_id && category.cate_id === this.props.category.cate_id ? 'selectedItem' : ''}>{category.cate_name}</li>;
                                                                })
                                                            }
                                                        </Scrollbars>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section"
                                         style={{display: this.props.redemption_type === 'category_product' && this.props.rule_on === 'product' ? 'block' : 'none'}}>
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Select Product</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="customDropDown">
                                                    <span ref={ref => this.customDropDownThreeSpanRef = ref}
                                                          onClick={this.handleDropDownThreeSpanClick}> {this.props.product.prd_name ? this.props.product.prd_name : 'Select product'}</span>
                                                    <ul className="customDropDown_show customPlaceHolder"
                                                        ref={ref => this.customDropDownShowThreeRef = ref} style={{
                                                        marginBottom: '30px',
                                                        marginTop: '-10px',
                                                        maxHeight: '207px',
                                                        display: 'none'
                                                    }}>
                                                        <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>}
                                                                    renderThumbHorizontal={() => <div></div>}>
                                                            {
                                                                this.props.productList.map((product) => {
                                                                    return <li key={product.prd_id} onClick={(e) => {
                                                                        this.setProduct(product)
                                                                    }}
                                                                               className={this.props.product.prd_id && product.prd_id === this.props.product.prd_id ? 'selectedItem' : ''}>{product.prd_name}</li>;
                                                                })
                                                            }
                                                        </Scrollbars>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section"
                                         style={{display: this.props.redemption_type === 'category_product' && this.props.rule_on === 'product' ? 'block' : 'none'}}>
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Select Variant</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="customDropDown">
                                                    <span ref={ref => this.customDropDownVariantSpanRef = ref}
                                                          onClick={this.handleDropDownVariantSpanClick}> {this.props.variant.prd_name ? this.props.variant.prd_name : 'Select variant'}</span>
                                                    <ul className="customDropDown_show customPlaceHolder"
                                                        ref={ref => this.customDropDownShowVariantRef = ref} style={{
                                                        marginBottom: '30px',
                                                        marginTop: '-10px',
                                                        maxHeight: '207px',
                                                        display: 'none'
                                                    }}>
                                                        <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>}
                                                                    renderThumbHorizontal={() => <div></div>}>
                                                            {
                                                                this.props.variantList.map((variant) => {
                                                                    return <li key={variant.prd_id} onClick={(e) => {
                                                                        this.setSelectedVariant(variant)
                                                                    }}
                                                                               className={this.props.variant.prd_id && variant.prd_id == this.props.variant.prd_id ? 'selectedItem' : ''}>{variant.prd_name}</li>;
                                                                })
                                                            }
                                                        </Scrollbars>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>




                                    <div className="dropSegmentation_section"
                                         style={{display: this.props.redemption_type === 'transaction_value' ? 'block' : 'none'}}>
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Transaction Threshold</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input onChange={(e) => {
                                                                    let value = e.target.value;

                                                                    if (parseInt(value) != 0 && value.match(/^\d*$/gm))
                                                                        this.setNumberValue('transaction_threshold', value);
                                                                }} placeholder="Transaction threshold" type="text"
                                                                       value={this.props.transaction_threshold ? this.props.transaction_threshold : ''}/>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/*<div className="dropSegmentation_section"  style={{display: this.props.redemption_type === 'transaction_value' ? 'block' : 'none'}}>
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Logical Operation Between Transaction Amount and Frequency</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <span>Condition </span>
                                                <ToggleSwitch checked={this.props.condition} onChange={(e)=> {this.handleConditionChange(e)}}/>
                                                <span style={{fontWeight:'bold'}}> {this.props.condition ? "AND" : "OR"}</span>
                                            </div>
                                        </div>
                                    </div>*/}
                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>{this.props.redemption_type === 'category_product' ? 'Number of products to be bought' : 'Number of transactions to be made'}</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input onChange={(e) => {
                                                                    let value = e.target.value;

                                                                    if (parseInt(value) != 0 && value.match(/^\d*$/gm))
                                                                        this.setNumberValue('no_of_use', value);
                                                                }}
                                                                       placeholder={this.props.redemption_type === 'category_product' ? 'Number of products to be bought' : 'Number of transactions to be made'}
                                                                       type="text"
                                                                       value={this.props.no_of_use ? this.props.no_of_use : ''}/>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Stamp Card Color </h3>
                                        </div>
                                        <div className="stateSegmentation">
                                            <div className="compaignDescription_outer   clearfix">
                                                <div className="voucherDiscount">
                                                    <SketchPicker
                                                        color={this.props.card_color}
                                                        onChangeComplete={this.handleColorChange}
                                                    />
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
                        <a  style={{cursor:'pointer'}} className="" onClick={this.savePunchCard}>Save</a>
                        <a  style={{cursor:'pointer'}} className="close_punch_popup" onClick={() => {
                            this.redirectToListing()
                        }}>CANCEL</a>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of AddPunchCard.

const mapStateToProps = (state) => ({
    ...state.punchCard,
    dataToSave: selectPunchCardDataForSaving(state.punchCard),
    frq: setFrequencyTime(state.punchCard.frequency)
});
export default connect(mapStateToProps)(AddIntegratedPunchCard);