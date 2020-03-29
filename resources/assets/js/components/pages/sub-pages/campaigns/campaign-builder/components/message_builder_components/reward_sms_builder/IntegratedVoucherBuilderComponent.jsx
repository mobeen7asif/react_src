import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import {NotificationManager} from 'react-notifications';
import {connect} from "react-redux";
import {
    addMessageBuilderValue,
    setBusinessList,
    setAlertTreeData,
    setTreeStructure,
    setSelectArray,
    setCamapaignDefaultValue,
    resetTreeStructure
} from "../../../../../../../redux/actions/CampaignBuilderActions";
import {selectDiscount, selectDiscountType, selectMessageBuilderObject, selectVoucherEndDate, selectVoucherStartDate} from "../../../../../../../redux/selectors/Selectors";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import ImageCropping from "../../../../../ImageCropping";
import ToggleSwitch from "@trendmicro/react-toggle-switch";
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import {find} from 'lodash';
import {
    setExpendedKeys,
    setFinalDataPunchCard,
    setProductTreeData,
    setSelectedTreeKeys, setTreeList
} from "../../../../../../../redux/actions/PunchCardActions";
class IntegratedVoucherBuilderComponent extends Component {
    state = {
        chooseVoucherType:[{id:1,name:'category'},{id:2,name:'product'},{id:3,name:'variant'},{id:4,name:'anything'},{id:5,name:'modifier'}],
        minTime:'',
        treeData:[],
        categoryRule:false,
        dataArray:[],
        src : "",
        target_user: 'new',
        isDisabled: false,
        treeExpandedKeys:[],
        is_basket:(this.props.messageBuilder.other.content.hasOwnProperty('basket_level') && this.props.messageBuilder.other.content.basket_level) ? true : false,
        is_day: (this.props.messageBuilder.other.content.hasOwnProperty('isNumberOfDays') && this.props.messageBuilder.other.content.isNumberOfDays) ? true : false,
        billingType:(this.props.messageBuilder.other.content.hasOwnProperty('billingType')) ? this.props.messageBuilder.other.content.billingType : "Partially Settled",
        billingValues:[],
        billing_status:false,
        billingMessage:"",
    };

    dInput1 = null;
    canvas = null;
    customDropDownOneSpanRef = null;
    customDropDownShowOneRef = null;
    customDropDownBSpanRef   = null;
    customDropDownShowBRef   = null;

    componentDidMount() {
        this.getBillingStatus();
        this.setMessageValue('basket_level',this.state.is_basket);
        if(this.props.messageBuilder.other.content.hasOwnProperty('isNumberOfDays') && this.props.messageBuilder.other.content.isNumberOfDays){
            this.setState(()=>({is_day:true}),()=>{
                document.getElementById("show_number_of_days_integrated").style.display = "block";
                document.getElementById("show_start_end_date_integrated").style.display = "none";
                /*$("#show_number_of_days").show();
                $("#show_start_end_date").hide();*/
            });
        }else{
            this.setState(()=>({is_day:false}),()=>{
                document.getElementById("show_number_of_days_integrated").style.display = "none";
                document.getElementById("show_start_end_date_integrated").style.display = "block";

            });

        }

    };//..... end of componentDidMount() .....//

    showHideDate = () => {
        var value = 0;

        this.setState((prevState)=>({is_day:!prevState.is_day}),()=>{
            if(this.state.is_day){
                document.getElementById("show_number_of_days_integrated").style.display = "block";
                document.getElementById("show_start_end_date_integrated").style.display = "none";
                value = 1;
            }else{
                document.getElementById("show_number_of_days_integrated").style.display = "none";
                document.getElementById("show_start_end_date_integrated").style.display = "block";
                value = 0;
            }

            this.setMessageValue('isNumberOfDays',value);
        });
    };//..... end of showHideDate() .....//

    addBasketValue = (e) => {


        this.setState((prevState)=>({is_basket:!prevState.is_basket}),()=>{
            this.setMessageValue('basket_level',this.state.is_basket);
        });
    };//..... end of showHideDate() .....//

    checkNumberOfDays = (e) => {
        let value = e.target.value;

        if (! isFinite(value))
            return false;
        if(value == "")
            value = 1;

        if (value == 0){
            value =1;
        }

        this.setMessageValue('isNumberOfDays',value);
    };//..... end of checkNumberOfDays() ......//

    setFilename = (fileName) => {
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, resource: fileName}}));
    };//..... end of setFilename() .....//

    setMessageValue = (key, value) => {
        let other = {...this.props.messageBuilder.other};
        other.content[key] =  value;
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, other: {...other}}}));
    };//..... end of setMessageValue() .....//

    checkDiscountValue = (e) => {
        let value = parseFloat(e.target.value);
        if(value == "")
            value = 0;

        if (this.props.discount_type === '%' && value > 99)
            return false;


        this.setMessageValue('discount',value);

    };//..... end of checkDiscountValue() ......//

    componentWillMount = () => {
        this.getBillingStatus();
        let userData = localStorage.getItem('userData');
        if (userData) {
            userData = JSON.parse(userData);
            if (userData.venue_id){

                IBS  = userData.ibs

            }
        }
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

    setVoucherRule =(data) =>{
        let other = {...this.props.messageBuilder.other};
        other.content['voucher_avail_type'] =  data.name;
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, other: {...other}}}));
        this.customDropDownVoucher.style.display = 'none';
        this.customDropDownVoucher.classList.remove('changeAero');
    };

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

    handleDropDownBVoucherClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownVoucher.style.display =  this.customDropDownVoucher.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownBVoucherClick() .....//

    setDiscountType = (type,discount_name) => {
        this.customDropDownShowOneRef.style.display = 'none';
        this.customDropDownOneSpanRef.classList.remove('changeAero');

        let other = {...this.props.messageBuilder.other};
        other.content['discount_type'] =  type;
        other.content['discount'] = 0;
        other.content['type'] = discount_name;
        /* if (type === '$')
             other.content['discount'] = 0;*/

        if(type === 'Free'){
            other.content['discount_type'] =  type;
            other.content['discount'] = 100;
        }

        /*if (type === '%' && other.content.discount <= 99)
            other.content['discount'] = 0;*/

        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, other: {...other}}}));
    };//..... end of setDiscountType() .....//

    loadBusinessList = () => {
        show_loader();
        axios.get(`${BaseUrl}/api/business-list/${CompanyID}`).
        then((response) => {
            show_loader(true);
            var business=null;


            if (this.props.editMode && this.props.messageBuilder.other.content.hasOwnProperty('business')) {
                business = find(response.data.data, (b) => {
                    return b.business_id === this.props.messageBuilder.other.content.business.business_id;
                });

            }

            this.props.dispatch(setBusinessList(response.data.data));

            if (business) {
                this.getBusinessCategoriesList(business,false);
            }
        }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while getting businesses list."+err, 'Error');
        });
    };//..... end of loadBusinessList() .....//

    setBusiness = (business,type) => {
        this.customDropDownShowBRef.style.display = 'none';
        this.customDropDownBSpanRef.classList.remove('changeAero');
        this.setState({btnGroupClasses:true});

        this.setMessageValue('business', business);
        if(type == "All"){
            return false;
        }

        this.getBusinessCategoriesList(business,true);
    };//..... end of setBusiness() .....//

    removeFile = (fileName) => {
        axios.get(BaseUrl + '/api/remove-file/?file='+ fileName)
            .then((response) => {
                //
            }).catch((err)=> {
            //
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
    }//---- Ed of randomString() ------//

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
                        let other = {...this.props.messageBuilder.other};
                        other.content['treeData'] = data;
                        this.props.dispatch(addMessageBuilderValue({
                            [this.props.currentChannel]: {
                                ...this.props.messageBuilder,
                                other: {...other}
                            }
                        }));
                        // this.props.dispatch(setTreeStructure(data));
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

    getCategoryProductsList = (treedata,category) => {
        axios.post(BaseUrl + '/api/get-category-products', {cat_id: category.props.eventKey})
            .then((response) => {
                show_loader(true);
                if (response.data.status) {
                    this.setState({productList:response.data.data});
                    let objData = response.data.data.map( function(item) {return {key:item.prd_id,name:item.prd_name,isParent:false,isCategory:false,isProduct:false,availType:'product',isDisabled:'1'}});
                    this.getNewTreeData(treedata, category.props.eventKey, objData,2);
                    this.props.dispatch(setTreeStructure(treedata));
                    //  this.setState({treeData:treedata});
                } else {
                    NotificationManager.warning("Could not get categories list.", 'No Data');
                }//..... end of if-else() .....//
            }).catch((err)=> {
            show_loader(true);
            NotificationManager.error("Error occurred while fetching category's products.", 'Error');
        });
    };//..... end of removeFile() ......//


    onExpand =(expanded) =>{
        let other = {...this.props.messageBuilder.other};
        other.content['expanded'] =  [...expanded];
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, other: {...other}}}));
    }

    onCheck = (checkedKeys,treeNode) => {

        if(treeNode.isParent){
            treeNode.children.forEach(val=>{
                var keyValue = val.value.split('_');
                var found = this.props.messageBuilder.other.content.selectedData.some(function (el) {
                    return el.voucher_avail_type_id === keyValue[0];
                });
                if (!found) {
                    let datArray = this.props.messageBuilder.other.content.selectedData;

                    datArray.push({
                        voucher_avail_type_id: keyValue[0],
                        cat_product_name: val.label,
                        voucher_avail_type: val.availType,
                        voucher_plu_ids: val.voucher_plu_ids,


                    });

                    this.setMessageValue('voucher_avial_data', datArray);
                    this.setMessageValue('selectedData', datArray);

                    //this.props.dispatch(setAlertTreeData(datArray));

                } else {
                    let data =   this.props.messageBuilder.other.content.selectedData;
                    data =   data.filter(function( obj ) {
                        return obj.voucher_avail_type_id !== keyValue[0];
                    });

                    if(treeNode.checked){
                        data.push({
                            voucher_avail_type_id: keyValue[0],
                            cat_product_name: val.label,
                            voucher_avail_type: val.availType,
                            voucher_plu_ids: val.voucher_plu_ids,


                        });

                    }
                    this.setMessageValue('voucher_avial_data', data);
                    this.setMessageValue('selectedData', data);
                    //this.props.dispatch(setAlertTreeData(data));

                }
            })
        }else{
            var keyValue = treeNode.value.split('_');
            var found = this.props.messageBuilder.other.content.selectedData.some(function (el) {
                return el.voucher_avail_type_id === keyValue[0];
            });

            if (!found) {
                let datArray = this.props.messageBuilder.other.content.selectedData;
                treeNode.parent.children.forEach(item=> {
                    if(item.value == treeNode.value) {
                        datArray.push({
                            voucher_avail_type_id: keyValue[0],
                            cat_product_name: item.label,
                            voucher_avail_type: item.availType,
                            voucher_plu_ids: item.voucher_plu_ids,
                        });
                    }
                });
                this.setMessageValue('voucher_avial_data', datArray);
                this.setMessageValue('selectedData', datArray);
                //this.props.dispatch(setAlertTreeData(datArray));

            } else {
                let data =   this.props.messageBuilder.other.content.selectedData;
                data =   data.filter(function( obj ) {
                    return obj.voucher_avail_type_id !== keyValue[0];
                });
                this.setMessageValue('voucher_avial_data', data);
                this.setMessageValue('selectedData', data);
            }


        }

        this.setMessageValue('checkedKeys', checkedKeys);
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

    checkValidIbs = (e) => {
        let value = e.target.value;
        if(value == "")
            value = 0;

        if (! isFinite(value))
            return false;

        if (value > 999)
            return false;

        if (value.length > 3)
            return false;

        this.setMessageValue('pos_ibs',value);
    }

    componentWillUnmount = () =>{
        let userData = localStorage.getItem('userData');
        if (userData) {
            userData = JSON.parse(userData);
            if (userData.venue_id){

                IBS  = userData.ibs

            }
        }

    }

    checkNumber = (e) => {
        let value = e.target.value;

        if (!isFinite(value))
            return false;

        return  true;


    };

    handlebillingType = (e, aspect) => {

        this.setState(()=>({
            billingType:aspect
        }),()=>{
            this.setMessageValue('billingType', aspect);
            this.setBillingValues();
        });
    }

    getBillingStatus = () => {
        let billingStatus = this.props.messageBuilder.other.content.hasOwnProperty('billingStatus') ? this.props.messageBuilder.other.content.billingStatus : false;
        let initial_billing_fields_type = this.props.messageBuilder.other.content.hasOwnProperty('billingType') ? this.props.messageBuilder.other.content.billingType : "Partially Settled";
        let initial_billing_fields = this.props.messageBuilder.other.content.hasOwnProperty('billingFields') ? this.props.messageBuilder.other.content.billingFields : {};
        var venue_id = VenueID;
        axios.post(BaseUrl + '/api/get-billing-settings', {venue_id: venue_id})
            .then(response => {


                let billing_status = (response.data.billingStatus == 1) ? true : false;
                BillingStatus = billing_status;

                let billingValues = response.data.billingFieldValues;
                let billingFields = {};
                billingValues.forEach((val,key)=>{

                    billingFields = {...billingFields,[val.label]:val.value};
                });

                this.setState(() => ({billing_status,billingType: initial_billing_fields_type}), () => {
                    billingFields = {...billingFields,...initial_billing_fields};
                    if(!billing_status){
                        return false;
                    }

                    this.setMessageValue('billingStatus', billing_status);

                    this.setMessageValue('billingType', initial_billing_fields_type);
                    this.setMessageValue('billingFields', billingFields);
                    this.setMessageValue('voucherFactor', 1);
                    this.fieldEnableDisabled(initial_billing_fields_type);
                    this.calculateTotal();
                    if(!(this.props.editMode)){
                        this.setDefaulValues();
                        this.setBillingValues();

                    }

                });




            }).catch((err) => {
            NotificationManager.error("Error occurred while getting charts data.", 'Error', 1500);

        });

    }

    setDefaulValues = () => {
        let fields = this.props.messageBuilder.other.content.billingFields;
        let totalFields = parseInt(Object.keys(fields).length);
        let values = parseInt(100 / totalFields);
        if(this.props.editMode == false){
            Object.keys(fields).map((v,k)=>{
                fields[v] = values;
            });
        }
        this.setMessageValue('billingFields', fields);
    }


    setBillingValues = (field_name="",value=0) => {
        if(value > 100)
            return false;

        let fields = this.props.messageBuilder.other.content.billingFields;
        let totals = 100;
        let totalFields = parseInt(Object.keys(fields).length);



        if(this.props.messageBuilder.other.content.billingType == "Partially Settled"){
            fields = this.props.messageBuilder.other.content.billingFields;
            if(field_name !="")
                fields[field_name] = value ? value : 0;


            this.fieldEnableDisabled("Partially Settled");

        }else if(this.props.messageBuilder.other.content.billingType == "Non-Settled"){
            fields = this.props.messageBuilder.other.content.billingFields;

            let values = 0;
            Object.keys(fields).map((v,k)=>{
                fields[v] = values;
            });
            fields['Franchise'] = 100;
            this.fieldEnableDisabled("Non-Settled");

        }else{
            fields = this.props.messageBuilder.other.content.billingFields;

            Object.keys(fields).map((v,k)=>{
                fields[v] = 0;
            });
            fields['Head Office'] = 100;
            this.fieldEnableDisabled("Fully Settled");
        }
        let total = this.calculateTotal();
        let voucherFactor = ((fields['Head Office'])/(100)).toFixed(2);
        this.setMessageValue('billingFields', fields);
        this.setMessageValue('voucherFactor', voucherFactor);
        if(total > 100)
            NotificationManager.error("Exceeding 100%.", 'Error', 1500);



    }

    fieldEnableDisabled = (type) => {
        let fields = this.props.messageBuilder.other.content.billingFields;
        if(type == "Partially Settled"){
            Object.keys(fields).map((v,k)=>{
                $("#"+this.convertSpaceToUnderscore(v)).removeClass("pointer_events");
            });
        }else if(type == "Non-Settled"){
            Object.keys(fields).map((v,k)=>{
                $("#"+this.convertSpaceToUnderscore(v)).addClass("pointer_events");
            });
        }else{
            Object.keys(fields).map((v,k)=>{
                $("#"+this.convertSpaceToUnderscore(v)).addClass("pointer_events");
            });
        }
    }
    convertSpaceToUnderscore = (str) => {

        if(str)
            return str.replace(/\s+/g, '_').toLowerCase();
        else
            return "";
    };

    calculateTotal = () => {
        let fields = this.props.messageBuilder.other.content.billingFields;
        let total = 0;
        Object.keys(fields).map((v,k)=>{
            total = (parseInt(total) + parseInt(fields[v]));
        });
        total = parseInt(total);
        if(total != 100)
            this.setState(()=>({billingMessage:"(Sum of all values must be 100.)"}));
        else
            this.setState(()=>({billingMessage:""}));

        return total;
    }

    render() {

        return (
            <div className="messageBuilder_outer ">
                <div className="messageBuilder_heading">
                    <h3>Voucher Builder <i style={{fontSize: '16px', color: '#ab5454'}}>{/*As this application doesn't support inventory, so campaign with this reward type will not be entertained.*/}</i></h3>
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
                                    <h3>Voucher Name</h3>
                                </div>
                                <div className="stateSegmentation primary_voucher_setting">
                                    <div className="venueIdentification_section">
                                        <div className="venueIdentification_form">
                                            <ul>
                                                <li>
                                                    <div className="customInput_div">
                                                        <input onChange={(e) => {
                                                            let value = e.target.value;
                                                            this.setMessageValue("voucher_name", value);
                                                        }} placeholder="Voucher Name" type="text"
                                                               value={this.props.messageBuilder.other.content.voucher_name ? this.props.messageBuilder.other.content.voucher_name : ''}/>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="dropSegmentation_section">
                                <div className="dropSegmentation_heading clearfix">
                                    <h3>Discount Type</h3>
                                </div>
                                <div className="stateSegmentation primary_voucher_setting">
                                    <div className="venueIdentification_section">
                                        <div className="customDropDown">
                                            <span  ref={ref => this.customDropDownOneSpanRef = ref} onClick={this.handleDropDownOneSpanClick}> {this.props.messageBuilder.other.content.discount_type ? (this.props.messageBuilder.other.content.discount_type == Currency ? 'Fixed' : (this.props.messageBuilder.other.content.discount_type == '%' &&(this.props.messageBuilder.other.content.discount <= '99')) ? "Percentage" : "Free") : 'Select discount type'}</span>
                                            <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowOneRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                                <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                    <li onClick={(e)=> {this.setDiscountType('%',"percentage")}} className={(this.props.messageBuilder.other.content.discount_type === '%') && (this.props.messageBuilder.other.content.discount <= '99') ? "selectedItem" : ''}>Percentage</li>
                                                    <li onClick={(e)=> {this.setDiscountType(Currency,"fixed")}} className={this.props.messageBuilder.other.content.discount_type === Currency ? "selectedItem" : ''}>Fixed</li>
                                                    <li onClick={(e)=> {this.setDiscountType('Free',"Free")}} className={(this.props.messageBuilder.other.content.discount_type === '%') && (this.props.messageBuilder.other.content.discount === '100') ? "selectedItem" : ''}>Free</li>
                                                </Scrollbars>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {((this.props.messageBuilder.other.content.discount_type === '%') && (this.props.messageBuilder.other.content.discount <= '99') || (this.props.messageBuilder.other.content.discount_type === Currency) ) && (
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
                                                    {( this.props.messageBuilder.other.content.discount_type == Currency &&
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
                            ) }


                            {(this.state.billing_status) && (
                                <div className="dropSegmentation_section" style={{overflow:"hidden",padding:"6px"}}>
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Billing <span style={{color:"red",fontSize: "12px",marginLeft:"20px"}}> <i>{this.state.billingMessage}</i> </span></h3>
                                    </div>
                                    <div className="stateSegmentation primary_voucher_setting">
                                        <div className="venueIdentification_section">
                                            <div className="venueIdentification_form">
                                                <ul>
                                                    <li>
                                                        <div className="customInput_div">
                                                            <div className="placeholder_radio_column" style={{width: '30%'}}>
                                                                <div className="radio_button">
                                                                    <input id="test_10" name="radio-group-voucher" type="radio"
                                                                           checked={this.state.billingType == "Partially Settled" ? 'checked' : ''}
                                                                           onChange={(e) => { this.handlebillingType(e, "Partially Settled") }}
                                                                    />
                                                                    <label htmlFor="test_10">Partially Settled</label>
                                                                </div>
                                                            </div><div className="placeholder_radio_column" style={{width: '30%'}}>
                                                            <div className="radio_button">
                                                                <input id="test_22" name="radio-group-voucher" type="radio"
                                                                       checked={this.state.billingType == "Fully Settled" ?'checked':''}
                                                                       onChange={(e) => { this.handlebillingType(e, "Fully Settled") }}
                                                                />
                                                                <label htmlFor="test_22">Fully Settled</label>
                                                            </div>
                                                        </div>
                                                            <div className="placeholder_radio_column" style={{width: '30%'}}>
                                                                <div className="radio_button">
                                                                    <input id="test_31" name="radio-group-voucher" type="radio"
                                                                           checked={this.state.billingType == "Non-Settled" ? 'checked':''}
                                                                           onChange={(e) => { this.handlebillingType(e, "Non-Settled") }}
                                                                    />
                                                                    <label htmlFor="test_31">Non-Settled</label>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {this.props.messageBuilder.other.content.hasOwnProperty("billingFields") && (
                                                            Object.keys(this.props.messageBuilder.other.content.billingFields).map((value,key)=>{
                                                                return (
                                                                    <div className="voucher_outer"  key={key}>
                                                                        <label style={{textAlign:"center"}}>{value}</label>
                                                                        <input id={this.convertSpaceToUnderscore(value)} className="voucher_inputs" onChange={(e) => {
                                                                            let val = e.target.value;
                                                                            let is_number = false;
                                                                            if (val.match(/^\d*$/gm))
                                                                                is_number = this.checkNumber(e);
                                                                            if(is_number)
                                                                                this.setBillingValues(value, val);
                                                                        }} placeholder={value} type="text"
                                                                               value={this.props.messageBuilder.other.content.billingFields[value]}/>
                                                                    </div>

                                                                )
                                                            })
                                                        )}

                                                    </li>

                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}





                            {(IBS ==1) && (
                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>IBS Adjustment Code</h3>
                                    </div>
                                    <div className="stateSegmentation primary_voucher_setting">
                                        <div className="venueIdentification_section">
                                            <div className="venueIdentification_form">
                                                <ul>
                                                    <li className="voucherDesc">
                                                        <div className="segmentInput ">
                                                            <input type="text" style={{width: '100%'}} onChange={(e)=>{
                                                                let value = e.target.value;
                                                                if (value.match(/^\d*$/gm))
                                                                    this.checkValidIbs(e);
                                                            }} value={this.props.messageBuilder.other.content.pos_ibs?this.props.messageBuilder.other.content.pos_ibs:''} />
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="dropSegmentation_section">
                                <div className="dropSegmentation_heading clearfix">
                                    <h3>Date</h3>
                                   {/* <div className="segmntClose">
                                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                                    </div>*/}
                                </div>

                                <div className="stateSegmentation">
                                    <div className="compaignDescription_outer   clearfix">
                                        <label>Voucher is valid
                                            <span style={{fontSize: '10px',marginLeft: '19px',fontStyle: 'italic', color: 'silver'}}>We are using Australian Eastern Standard Time (AEST), please set your time accordingly</span></label>
                                        {/*<div className="placeHolderOuter expandPlaceholder clearfix">
                                             <div className="customDropDown">
                                                 <span>Between</span>
                                                 <ul className="customDropDown_show customPlaceHolder">
                                                     <li>Between</li>
                                                 </ul>
                                             </div>
                                        </div>*/}

                                        <div className='venueIdentification_form' >
                                            <ul>
                                                <li>
                                                    <label>Days</label>
                                                    <ToggleSwitch

                                                        checked={this.state.is_day ? true : false}
                                                        onChange={(e)=> {this.showHideDate(e)}}
                                                    />
                                                    <span style={{fontWeight:'bold'}}> {this.state.is_day ? "ON" : "OFF"}</span>
                                                </li>
                                            </ul>


                                        </div>
                                        <div className="voucherDiscount" id="show_number_of_days_integrated" style={{display:"none"}}>
                                            <label style={{float: 'left',
                                                lineHeight: '50px',
                                                marginRight: '10px'}}>Expire after</label>


                                            <div className="gammingValue_outer clearfix">
                                                <div className="gamingAmount clearfix">
                                                    <input type="text" style={{width: '100%'}} onChange={(e)=>{
                                                        let value = e.target.value;
                                                        if (value.match(/^\d*$/gm))
                                                            this.checkNumberOfDays(e);
                                                    }} value={this.props.messageBuilder.other.content.isNumberOfDays?this.props.messageBuilder.other.content.isNumberOfDays:1} />

                                                </div>
                                                <small></small>
                                            </div>
                                            <label>Days</label>
                                        </div>


                                        <div className="datePickerOuter clearfix" id="show_start_end_date_integrated">
                                            <div className="datePickerLeft">
                                                <strong>From</strong>
                                                <div className="datePicker">
                                                    <DatePicker selected={this.props.startDate} dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm"  minDate={moment()} onChange={this.handleChangeStartDate}/>
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
                                    <h3>Business</h3>
                                </div>
                                <div className="stateSegmentation primary_voucher_setting">
                                    <div className="venueIdentification_section">
                                        <div className="venueIdentification_form">
                                            <div className='customDropDown'>
                                                <span  ref={ref => this.customDropDownBSpanRef = ref} onClick={this.handleDropDownBSpanClick}> {this.props.messageBuilder.other.content.business ? this.props.messageBuilder.other.content.business.business_name : 'Select Business'}</span>
                                                <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowBRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none',zIndex: '3'}} >
                                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                        {

                                                            this.props.business.map((business) => {
                                                                return <li key={business.business_id} onClick={(e)=> {this.setBusiness(business,"")}} className={this.props.messageBuilder.other.content.business && business.business_id === this.props.messageBuilder.other.content.business.business_id ? 'selectedItem' : ''}>{business.business_name}</li>;
                                                            })
                                                        }
                                                    </Scrollbars>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {(this.props.messageBuilder.other.content.business && this.props.messageBuilder.other.content.business.business_id != 0) &&(
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

                                                                checked={this.state.is_basket ? true : false}
                                                                onChange={(e)=> {this.addBasketValue(e)}}
                                                            />
                                                            <span style={{fontWeight:'bold'}}> {this.state.is_basket ? "ON" : "OFF"}</span>
                                                        </li>
                                                    </ul>


                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(this.props.messageBuilder.other.content.business && this.props.messageBuilder.other.content.business.business_id != 0) && (
                                <div className="dropSegmentation_section" id="tree_view_data">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Tree View</h3>
                                    </div>
                                    <div className="stateSegmentation primary_voucher_setting">
                                        <div className="venueIdentification_section">
                                            <div className='venueIdentification_form'>
                                                <CheckboxTree
                                                    nodes={this.props.messageBuilder.other.content.treeData?this.props.messageBuilder.other.content.treeData:[]}
                                                    checked={this.props.messageBuilder.other.content.checkedKeys?this.props.messageBuilder.other.content.checkedKeys:[]}
                                                    expanded={this.props.messageBuilder.other.content.expanded?this.props.messageBuilder.other.content.expanded:[]}
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

                                        <ImageCropping src={this.state.src} setCanvas={this.setCanvas} image={this.props.messageBuilder.resource}
                                                       cropingDivStyle={{width: '50%', float: 'left'}}
                                                       previewStyle={{width: '42%', float: 'left', marginLeft: '30px'}}
                                                       previewImgStyle={{maxHeight: '208px'}}
                                                       onCropCompleted={this.populateImage}/>
                                    </div>
                                </div>
                            </div>




                            {
                                (this.props.editMode &&

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

                                                                <div className="placeholder_radio_column" style={{width: '35%'}}>
                                                                    <div className="radio_button">
                                                                        <input id="test_1" name="radio-group" type="radio"
                                                                               checked={this.props.target_user === 'new'} value={this.props.target_user}
                                                                               onChange={(e) => { this.props.dispatch(setCamapaignDefaultValue("target_user",'new'));}}
                                                                        />
                                                                        <label htmlFor="test_1">New users</label>
                                                                    </div>
                                                                </div>
                                                                <div className="placeholder_radio_column" style={{width: '35%'}}>
                                                                    <div className="radio_button">
                                                                        <input id="test_2" name="radio-group" type="radio"  value={this.props.target_user}
                                                                               checked={this.props.target_user === 'new_prev'}
                                                                               onChange={(e) => { this.props.dispatch(setCamapaignDefaultValue("target_user",'new_prev'));}}

                                                                        />
                                                                        <label htmlFor="test_2">Previous and new users</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                )
                            }


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
                                        <i style={{fontStyle: 'normal', fontSize: '39px', fontWeight: '700', lineHeight: '41px', color: '#617283'}}>{this.props.discount_type} {this.props.discount}</i>
                                    )}
                                    <b>

                                    {( (this.props.discount_type ==='%' && this.props.discount <= 99) &&
                                        <i style={{fontStyle: "normal", fontSize: '37px', fontWeight: '700', lineHeight: '41px', color: 'rgb(97, 114, 131)'}}>{this.props.discount} {this.props.discount_type}</i>
                                    )}</b>
                                    {( ( (this.props.discount_type ==='%' && this.props.discount <= 99 ) || this.props.discount_type ===Currency ) &&
                                        <small style={{display: 'block'}}>DISCOUNT</small>
                                    )}

                                    {( (this.props.discount_type ==='%' && this.props.discount >= 100) &&
                                        <b>Free</b>
                                    )}
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
        );
    }//..... end of render() .....//
}//..... end of VoucherBuilderComponent.

const mapStateToProps = (state) => {
    return {
        messageBuilder  : selectMessageBuilderObject(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        discount        : selectDiscount(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        discount_type   : selectDiscountType(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        currentChannel  : state.campaignBuilder.currentChannel,
        business        : state.campaignBuilder.businessList,
        startDate       : selectVoucherStartDate(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        endDate         : selectVoucherEndDate(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        selectedData    : state.campaignBuilder.selectedData,
        treeData        : state.campaignBuilder.treeData,
        checkedKeys     : state.campaignBuilder.checkedKeys,
        editMode        : state.campaignBuilder.isEditMode,
        target_user        : state.campaignBuilder.target_user,
    };
};
export default connect(mapStateToProps)(IntegratedVoucherBuilderComponent);