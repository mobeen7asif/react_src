import React, {Component} from 'react';
import {Scrollbars} from "react-custom-scrollbars";
import MultiSelectReact from "multi-select-react";
class VoucherExpiry extends Component {
    customDropDownSpanRef = null;
    customDropDownShowRef = null;
    customDropDownSpanRef2 = null;
    customDropDownShowRef2 = null;
    enterVenue = ['Less than or equal', 'More than or equal'];
    constructor(props) {
        super(props);
        this.state = {
            days: "",
            listVouchers : [],
            listMultiSelectVouchers : [],
        };
    }//..... end of constructor() .....//

    setValueSelected = (value) => {
        let preVal = this.props.criteria.value;
        preVal.status = value;
        this.setCriteriaValue(preVal);

        this.customDropDownShowRef.style.display = 'none';
        this.customDropDownSpanRef.classList.remove('changeAero');
    };//..... end of setValueSelected() .....//

    handleDropDownSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRef.style.display =  (this.customDropDownShowRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanClick() .....//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('voucher_expiry', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        $('.arrow').html('&nbsp;');
        $('.arrow').addClass('set_width');

        if (this.props.criteria.value.days)
            this.setState({days:this.props.criteria.value.days});



        show_loader();
        axios.post(`${BaseUrl}/api/list-vouchers`,{
            venue_id            : VenueID
        }).then(res => {
            let listMultiSelectVouchers = res.data.data;
            this.setState(()=>({listVouchers: res.data.data}));
            show_loader(true);
            if (this.props.criteria.value.hasOwnProperty('vouchers') && this.props.criteria.value.vouchers.length > 0){
                listMultiSelectVouchers.forEach((value,key2)=> {
                    this.props.criteria.value.vouchers.forEach((val)=> {
                        if (value.id == val){
                            listMultiSelectVouchers[key2].value = true;
                        }

                    });
                });
            }
            this.setState(()=>({listMultiSelectVouchers:listMultiSelectVouchers}),()=>{

            });
        }).catch((err) => {
            show_loader(true);
        });
    };//..... end of componentDidMount() .....//

    handleFromIputs = (e) => {

            this.setState({
                days:  e.target.value
            });
            let preVal = this.props.criteria.value;
            preVal.days = e.target.value;
            this.setCriteriaValue(preVal);
    };



    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//





    optionClicked = (multiSelect) => {

        this.handleChange({ multiSelect });
    };//..... end of optionClicked() .....//

    selectedBadgeClicked = (multiSelect) => {
        console.log(multiSelect);
        this.handleChange({ multiSelect });
    };//..... end of selectedBadgeClicked() .....//

    handleChange = (obj) => {
        let vouchers = [];
        obj.multiSelect.forEach(function(value,key){

           if(value.value == true){
               vouchers.push(value.id);
           }

        });
        this.setState(()=>(obj));
        let preVal = this.props.criteria.value;
        preVal.vouchers = vouchers;
        this.setCriteriaValue(preVal);

    };//..... end of handleChange() .....//

    render() {
        const selectedOptionsStyles = {
            color: "#3c763d",
            backgroundColor: "#dff0d8"
        };
        const optionsListStyles = {
            backgroundColor: "#fcf8e3",
            color: "#8a6d3b"
        };
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Voucher Expiry</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('voucher_expiry')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>

                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Voucher listing is</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder" style={{width:"100%",float:"none"}}>
                                <div className="placeHolderOuter clearfix">
                                    <div className="customDropDown" style={{height:"auto"}}>

                                        <MultiSelectReact options={this.state.listMultiSelectVouchers} optionClicked={this.optionClicked} selectedBadgeClicked={this.selectedBadgeClicked}
                                                          selectedOptionsStyles={selectedOptionsStyles} optionsListStyles={optionsListStyles} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>



                <div className="stateSegmentation" style={{paddingTop:"0px"}}>
                    <div className="compaignDescription_outer clearfix">
                        <label>Voucher will be expiered in</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder">
                                <div className="placeHolderOuter clearfix">
                                    <div className="customDropDown">
                                        <span ref={ref => this.customDropDownSpanRef = ref} onClick={this.handleDropDownSpanClick}>{this.props.criteria.value.status ? this.props.criteria.value.status : 'Select Status'} </span>
                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                {
                                                    this.enterVenue.map((ms) => {
                                                        return <li key={ms} onClick={(e)=> {this.setValueSelected(ms)}}
                                                                   className={(this.props.criteria.value.status === ms) ? 'selectedItem' : ''}>{ms}</li>
                                                    })
                                                }
                                            </Scrollbars>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="memberNumbe">
                                <div className="numberFields clearfix">
                                    <input  type="text" placeholder="Days" className="numeric" style={{width:100+'%'}} value={this.state.days} onChange={(e) => {this.handleFromIputs(e)}}/>
                                </div>

                            </div>

                            <div className="memberNumbe">
                                <div className="numberFields clearfix">

                                </div>

                            </div>

                        </div>
                    </div>
                </div>







            </div>
        );
    }//..... end of render() .....//

}//..... end of VoucherExpiry.

export default VoucherExpiry;