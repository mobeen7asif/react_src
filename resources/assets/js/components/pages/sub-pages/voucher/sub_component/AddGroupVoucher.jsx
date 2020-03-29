import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import {Scrollbars} from 'react-custom-scrollbars';
import Autocomplete from 'react-autocomplete';
import {connect} from 'react-redux';
import {addVoucherDefault, resetVoucherData, setEditVoucherData} from "../../../../redux/actions/VoucherAction";
import MessageBuilderValidator from "../../../../utils/MessageBuilderValidator";
import {prepareEditDataVoucher, selectVoucherDateToSave} from "../../../../redux/selectors/Selectors";
import ListVouchers from "./ListVouchers";
import HeaderComponent from "../../dashboard/sub_components/HeaderComponent";
import UserTarget from "./UserTarget";
import RedirectBack from "./RedirectBack";

class AddGroupVoucher extends Component {
    saveCategoryBtn = null;
    canvas = null;
    messageBuilderValidator = new MessageBuilderValidator;
    state = {
        voucherData: [],
        value: '',
        showHeader:false,
        firstHundred:0,

    }

    componentWillUnmount = () => {

    };


    componentDidMount = () => {

        if (Object.keys(this.props.voucher).length > 0) {
            /* this.loadBusinessList();*/
            this.loadEditData(this.props.voucher);

        } else {
            this.props.dispatch(resetVoucherData());
            this.setKeyValueVoucher('voucher_type', 'group-voucher');
            this.loadVoucherData([]);
        }
    };//--- End of componentDidMount() ---//


    loadVoucherData = (voucherData) => {
        show_loader();
        axios.post(BaseUrl + '/api/get-vouchers-group', {
            company_id: CompanyID
        })
            .then((res) => {
                show_loader(true);
                if(voucherData.length == 0) {
                    this.setKeyValueVoucher('voucher_data', res.data.data);
                }else{
                    var changed_data = [];
                    var voucher_data = res.data.data
                     voucher_data.map(function (obj) {
                        var voucher = voucherData.find( (item) => item.id ===  obj.id );

                        if(typeof voucher!= "undefined" && voucher.id == obj.id){

                            obj.voucher_value = (voucher.voucher_value !='undefined')?voucher.voucher_value:0;
                            obj.showvalue = true;

                        }

                        changed_data.push(obj);
                    });

                    this.setKeyValueVoucher('voucher_data', changed_data);
                }
            }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while saving punch card, please try later." + err, 'Error');
        });
    }

    setKeyValueVoucher = (key, value) => {
        this.props.dispatch(addVoucherDefault(key, value));
    }


    recordSelected = (item) => {

        let datArray = this.props.voucher_avial_data;
        let voucherData = this.props.voucher_data;
        var changed_data = [];

        var found = datArray.some(function (el) {
            return el.id == item.id;
        });

        if (!found) {
            datArray.push(item);
            voucherData.map(function (obj) {
                if(obj.id === item.id){
                    obj.showvalue = true;
                                   }
                changed_data.push(obj)
            });
        } else {
            datArray = datArray.filter(function (obj) {
                return obj.id != item.id;
            });
            voucherData.map(function (obj) {
                if(obj.id === item.id){
                    obj.showvalue = false;

                }
                changed_data.push(obj)
            });
        }
        var total = 0;

        total = 100/(datArray.length);
        changed_data.forEach(obj=>{
            obj.voucher_value= Math.trunc(total);
        })
        datArray.forEach(obj=>{
            obj.voucher_value= Math.trunc(total);
        })

        this.setKeyValueVoucher('voucher_avial_data', datArray);
        this.setKeyValueVoucher('voucher_data', changed_data);
    }
    saveVoucherData = () => {
        show_loader();
        axios.post(BaseUrl + '/api/save-voucher', {
            ...this.props.dataTosave,
            editId: this.props.id,
            company_id: CompanyID
        })
            .then((response) => {
                show_loader(true);
                NotificationManager.success('Voucher  saved successfully!', 'Success');
                this.redirectToListing();
            }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while saving punch card, please try later." + err, 'Error');
        });
    }
    redirectToListing = () => {
        this.props.dispatch(resetVoucherData());
        this.props.addVoucher('listing');
    };

    loadEditData = (voucher) => {
        var voucherAvail = JSON.parse(voucher.voucher_avial_data);
        this.loadVoucherData(voucherAvail);
        let voucherData = prepareEditDataVoucher(voucher, this.props.businessList)
        this.props.dispatch(setEditVoucherData(voucherData));

    }

    addValue =(e,item) =>{

        let value = e.target.value;
            if(value >100){
                return false;
            }

        let datArray = this.props.voucher_avial_data;
        let voucherData = this.props.voucher_data;
        var changed_data = [];
        var newValues = [];

        var found = datArray.some(function (el) {
            return el.id == item.id;
        });
        if(found){

            voucherData.map(function (obj) {

                if(obj.id === item.id){
                    obj.voucher_value =Math.trunc(value);

                }

                changed_data.push(obj)
            });



            datArray.map(function (obj) {
                if(obj.id === item.id){
                    obj.voucher_value =value;

                }


                newValues.push(obj)
            });

            this.setKeyValueVoucher('voucher_avial_data', newValues);
            this.setKeyValueVoucher('voucher_data', voucherData);

        }

    }

    render() {
        return (
            <div>

                <div className="newVualt_container">
                    <div className="newVualt_container_detail">
                        <div className="newVualt_detail_outer">
                            <div className="newVualt_detail">
                                <div className="add_categoryList_info2">
                                    <RedirectBack style={{marginTop:'10px'}} redirectToListing={this.redirectToListing} text='Group Vouchers'/>
                                    <div className="categoryInfo_container clearfix">

                                        <div className="addCategoryRight_section">
                                            <div className="addCategory_formSection portalNew_page">
                                                <ul>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Group Name</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="customPlaceholder">
                                                                <input onChange={(e) => {
                                                                    let value = e.target.value;
                                                                    this.setKeyValueVoucher("name", value);
                                                                }} placeholder="Group Name" type="text"
                                                                       value={this.props.name ? this.props.name : ''}/>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <table className="table table-bordered">
                                                            <thead>
                                                            <tr>
                                                                <th scope="col"></th>
                                                                <th scope="col">Voucher Name</th>
                                                                <th scope="col">Weight</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {this.props.voucher_data && (

                                                                this.props.voucher_data.map((item) => {

                                                                    return (
                                                                            <tr key={item.id}>
                                                                                <td>
                                                                                    <input className="custom-checkbox"
                                                                                           type="checkbox"
                                                                                           style={{border: '1px solid black'}}
                                                                                           onChange={(e) => {
                                                                                               this.recordSelected(item)
                                                                                           }} checked={!!item.showvalue}/>
                                                                                </td>
                                                                                <td>{item.name}</td>
                                                                                <td>
                                                                                    {(item.showvalue)? <div className="customPlaceholder">
                                                                                        <input  placeholder="weight"
                                                                                               type="text" value={item.voucher_value} onChange={(e)=>{
                                                                                                   let value = e.target.value;
                                                                                            if (value.match(/^\d*$/gm))
                                                                                                   this.addValue(e,item)
                                                                                               }}/></div>:''}
                                                                                </td>

                                                                            </tr>

                                                                    )
                                                                })
                                                            )}


                                                            </tbody>
                                                        </table>
                                                    </li>

                                                    <li>
                                                        {
                                                            ((this.props.id != 0) &&

                                                                <UserTarget
                                                                    setKeyValueVoucher={this.setKeyValueVoucher}/>

                                                            )
                                                        }
                                                    </li>


                                                </ul>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                                <div className="continueCancel  listShops">
                                    <a style={{cursor: 'pointer'}}
                                       className={this.messageBuilderValidator.validateVoucher(this.props.voucherBuilder) ? 'selecCompaignBttn' : 'disabled selecCompaignBttn'}
                                       onClick={this.saveVoucherData}>Save</a>
                                    <a style={{cursor: 'pointer'}} className="close_punch_popup"
                                       onClick={this.redirectToListing}>CANCEL</a>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        );
    }//..... end of render() .....//
}//..... end of AddCategory.

const mapStateToProps = (state) => ({
    ...state.voucherBuilder,
    voucherBuilder: state.voucherBuilder,
    dataTosave: selectVoucherDateToSave(state.voucherBuilder)
});
export default connect(mapStateToProps)(AddGroupVoucher);

