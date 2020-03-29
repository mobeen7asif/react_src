import React, {Component} from 'react';
import VoucherListing from './sub_component/VoucherListing';
import AddIntegratedVoucher from './sub_component/AddIntegratedVoucher';
import AddVoucher from './sub_component/AddVoucher';
import {addVoucherDefault, setVoucherBusiness} from "../../../redux/actions/VoucherAction";
import {connect} from 'react-redux';
import GroupVoucher from "./GroupVoucher";
import AddGroupVoucher from "./sub_component/AddGroupVoucher";
class Voucher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedView: 'listing',
            voucher: {}
        };

    }

    componentDidMount = ()=> {

        if(this.props.businessList.length == 0)
            this.loadBusinessList();

        if(this.props.groups.length ==0)
            this.loadGroups()



    }

    addVoucher= (type = 'edit', voucher = {}) => {
        this.setKeyValueVoucher('voucher_type',type);
        this.setState(() => ({selectedView: type, voucher}));
    };

    addIntegratedVoucher = (type = 'integrated-voucher', voucher = {}) => {
        this.setKeyValueVoucher('voucher_type',type);
        this.setState(() => ({selectedView: type, voucher}));
    };
    addGroupVoucher = (type = 'group-voucher', voucher = {}) => {
        this.setKeyValueVoucher('voucher_type',type);
        this.setState(() => ({selectedView: type, voucher}));
    };
    loadBusinessList = () => {
        axios.get(`${BaseUrl}/api/business-list/${CompanyID}`).
        then((response) => {
            let data = response.data.data.map(item =>{
                    item.label = item.business_name;
                    item.id = item.business_id;
                    item.value =false;

                return item;
            })
         
            this.props.dispatch(setVoucherBusiness(response.data.data));
        }).catch((err) => {
        });
    };//..... end of loadBusinessList() .....//

    setKeyValueVoucher = (key,value) =>{
        this.props.dispatch(addVoucherDefault(key, value));
    }
    loadGroups = () =>{
        axios.post(`${BaseUrl}/api/get-all-groups`).
        then((response) => {
            this.setKeyValueVoucher('groups',response.data.data);
        }).catch((err) => {
        });
    }

    render() {
        return (
            (this.state.selectedView === 'listing') ? <VoucherListing addVoucher={this.addVoucher} addIntegratedVoucher={this.addIntegratedVoucher} addGroupVoucher={this.addGroupVoucher} navigate={this.props.navigate}/>
                : (this.state.selectedView === 'integrated-voucher' ? <AddIntegratedVoucher addVoucher={this.addVoucher}  voucher={this.state.voucher}/>
                : (this.state.selectedView === 'group-voucher'?<AddGroupVoucher  addVoucher={this.addVoucher}  voucher={this.state.voucher} />:<AddVoucher addVoucher={this.addVoucher} voucher={this.state.voucher}/>))
        );
    }//..... end of render() .....//
}//..... end of Class.
const mapStateToProps = (state) => ({
    ...state.voucherBuilder,

});
export default connect(mapStateToProps)(Voucher);
