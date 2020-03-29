import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import MultiSelectReact from "multi-select-react";

class PunchCardStatus extends Component {
    customDropDownSpanRef = null;
    customDropDownShowRef = null;
    customDropDownSpanRef2 = null;
    customDropDownShowRef2 = null;
    punchCardStatus = ['Completed', 'Not Completed'];

    constructor(props) {
        super(props);
        this.state = {
            listPunchCards : [],
            listMultiSelectVouchers:[]
        };
    }//..... end of constructor() .....//
    setValueSelected = (value) => {
        let preVal = this.props.criteria.value;
        preVal.status = value;
        this.setCriteriaValue(preVal);

        this.customDropDownShowRef.style.display = 'none';
        this.customDropDownSpanRef.classList.remove('changeAero');
    };//..... end of setValueSelected() .....//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('punch_card_status', 'value', value);

    };//..... end of setCriteriaValue() .....//



    handleDropDownSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRef.style.display =  (this.customDropDownShowRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanClick() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    componentDidMount = () => {
        /*show_loader();
        axios.post(`${BaseUrl}/api/list-punch-cards`,{
            venue_id            : VenueID
        }).then(res => {
            this.setState(()=>({listPunchCards: res.data.data}));
            show_loader(true);
        }).catch((err) => {
            show_loader(true);
        });
*/

        $('.arrow').html('&nbsp;');
        $('.arrow').addClass('set_width');

        show_loader();
        axios.post(`${BaseUrl}/api/list-punch-cards`,{
            venue_id            : VenueID
        }).then(res => {
            let listMultiSelectVouchers = res.data.data;
            this.setState(()=>({listPunchCards: res.data.data}));
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
                console.log(this.state.listMultiSelectVouchers)
            });
        }).catch((err) => {
            show_loader(true);
        });

    }

    handleDropDownSpanClick2 = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRef2.style.display =  (this.customDropDownShowRef2.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanClick() .....//

    setValueSelected2 = (value) => {
        let preVal = this.props.criteria.value;
        preVal.id = value.id;
        preVal.name = value.name;
        this.setCriteriaValue(preVal);

        this.customDropDownShowRef2.style.display = 'none';
        this.customDropDownSpanRef2.classList.remove('changeAero');
    };//..... end of setValueSelected() .....//
    optionClicked = (multiSelect) => {
        this.handleChange({ multiSelect });
    };//..... end of optionClicked() .....//

    selectedBadgeClicked = (multiSelect) => {
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
        console.log(preVal.vouchers)
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
                    <h3>Punch Card Status</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('punch_card_status')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>

                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>List Punch Cards</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder" style={{width:"100%",float:"none"}}>
                                <div className="placeHolderOuter clearfix">
                                    <div className="customDropDown" style={{height:"auto"}}>
                                        {/*<span ref={ref => this.customDropDownSpanRef2 = ref} onClick={this.handleDropDownSpanClick2} style={{backgroundPosition:"97% 17px"}}>{this.props.criteria.value.name ? this.props.criteria.value.name : 'Select Punch card'} </span>
                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowRef2 = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                { this.state.listPunchCards && (
                                                    this.state.listPunchCards.map((ms,key) => {
                                                        return <li key={key} onClick={(e)=> {this.setValueSelected2(ms)}}
                                                                   className={(this.props.criteria.value.name === ms.name) ? 'selectedItem' : ''}>{ms.name}</li>
                                                    })
                                                )


                                                }
                                            </Scrollbars>
                                        </ul>*/}

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
                        <label>Punch Card Status</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder">
                                <div className="placeHolderOuter clearfix">
                                    <div className="customDropDown">
                                        <span ref={ref => this.customDropDownSpanRef = ref} onClick={this.handleDropDownSpanClick}>{this.props.criteria.value.status ? this.props.criteria.value.status : 'Select Voucher Status'} </span>
                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                {
                                                    this.punchCardStatus.map((ms) => {
                                                        return <li key={ms} onClick={(e)=> {this.setValueSelected(ms)}}
                                                                   className={(this.props.criteria.value.status === ms) ? 'selectedItem' : ''}>{ms}</li>
                                                    })
                                                }
                                            </Scrollbars>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//

}//..... end of PunchCardStatus.

export default PunchCardStatus;