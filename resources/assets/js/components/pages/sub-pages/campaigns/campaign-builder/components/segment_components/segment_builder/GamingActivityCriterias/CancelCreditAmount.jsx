import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import DatePicker from 'react-datepicker';

class CancelCreditAmount extends Component {
    cancelCreditOn    = ['More Than', 'Less Than', 'Equal To', 'Not Equal To', 'Between'];
    customDropDownFirstSpanRef = null;
    customDropDownShowFirstRef = null;
    state = {
        fromDate: null,
        toDate: null,
        v1: Array(8),
        v2: Array(8)
    };

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('cancel_credit_amount', 'value', value);
    };//..... end of setCriteriaValue() .....//

    handleChangeStartDate = (date) => {
        this.setState({
            fromDate: date
        });

        let preVal = this.props.criteria.value;
        preVal.fromDate = date.format('YYYY-MM-DD');
        this.setCriteriaValue(preVal);
    };//..... end of handleChangeStartDate() .....//

    handleChangeEndDate = (date) => {
        this.setState({
            toDate: date
        });

        let preVal = this.props.criteria.value;
        preVal.toDate = date.format('YYYY-MM-DD');
        this.setCriteriaValue(preVal);
    };//..... end of handleChangeEndDate() .....//

    setValueSelected = (key, value) => {
        let preVal = this.props.criteria.value;
        preVal[key] = value;
        // preValue = {condition: 'between', v1: 2324, v2: 34435, fromDate: '', toDate: ''}

        if (value === 'Between') {
            preVal.toDate = null;
            this.setState({
                toDate: null
            });
        }//..... end if() .....//

        this.customDropDownShowFirstRef.style.display = 'none';
        this.customDropDownFirstSpanRef.classList.remove('changeAero');

        this.setCriteriaValue(preVal);
    };//..... end of setValueSelected() .....//

    setGamingSpendValue = (e, key, index) => {
        let value = e.target.value;
        if (! isNaN(value)) {
            this.setState((prevState) => {
                let preStV = prevState[key];
                preStV[index] = value;

                return {
                    [key] : preStV
                }
            }, () => {
                let preVal = this.props.criteria.value;
                preVal[key] = this.state[key].join('');
                this.setCriteriaValue(preVal);
            });
        }

        if (isNaN(value)) {
            let st = this.state[key];
            st[index] = '';
            this.setState({[key]: st})
        }//..... end if() ......//
    };//..... end of setGamingSpendValue() ......//

    componentDidMount = () => {
        this.initializeStateValues();
    };//..... end of componentDidMount() .....//

    initializeStateValues = () => {

        if (this.state.fromDate === null) {
            if (this.props.criteria.value.fromDate) {
                this.setState(() => ({
                    fromDate: moment(`${this.props.criteria.value.fromDate}`)
                }));
            }//..... end if() .....//
        }//...... end if() .....//

        if (this.state.toDate === null) {
            if (this.props.criteria.value.toDate) {
                this.setState(() => ({
                    toDate: moment(`${this.props.criteria.value.toDate}`)
                }));
            }//..... end if() .....//
        }//...... end if() .....//

        if (this.props.criteria.value.v1) {
            this.setState(() => {
                let v1 = Array(8);
                this.props.criteria.value.v1.split('').map((val,index) => {
                    v1[index] = val;
                });
                return {v1: v1};
            });
        }//..... end if() .....//

        if (this.props.criteria.value.v2) {
            this.setState(() => {
                let v2 = Array(8);
                this.props.criteria.value.v2.split('').map((val,index) => {
                    v2[index] = val;
                });
                return {v2: v2};
            });
        }//..... end if() .....//
    };//..... end of initializeStateValues() .....//

    handleDropDownSpanFirstClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowFirstRef.style.display =  (this.customDropDownShowFirstRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanFirstClick() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Cancel Credit Amount</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('cancel_credit_amount')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a></div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Cancel Credit Amount is</label>
                        <div className="expandPlaceholder drawWinner">
                            <div className="customDropDown">
                                <span onClick={this.handleDropDownSpanFirstClick} ref={ref => this.customDropDownFirstSpanRef = ref}> {this.props.criteria.value.condition ? this.props.criteria.value.condition : 'Cancel Credit Amount'}</span>
                                <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowFirstRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                        {
                                            this.cancelCreditOn.map((ptype) => {
                                                return <li key={ptype} onClick={(e)=> {this.setValueSelected('condition', ptype)}}>{ptype}</li>
                                            })
                                        }
                                    </Scrollbars>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="cancelcredit_amout clearfix">
                        <div className="cancelcredit_amout_values">
                            <label>Amount</label>
                            <div className="gammingValue_outer clearfix">
                                <small>$</small>
                                <div className="gamingAmount clearfix">
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v1[0] ? this.state.v1[0] : ''} onChange={(e)=>{ this.setGamingSpendValue(e, 'v1', 0)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v1[1] ? this.state.v1[1] : ''} onChange={(e)=>{ this.setGamingSpendValue(e, 'v1', 1)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v1[2] ? this.state.v1[2] : ''} onChange={(e)=>{ this.setGamingSpendValue(e, 'v1', 2)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v1[3] ? this.state.v1[3] : ''} onChange={(e)=>{ this.setGamingSpendValue(e, 'v1', 3)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v1[4] ? this.state.v1[4] : ''} onChange={(e)=>{ this.setGamingSpendValue(e, 'v1', 4)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v1[5] ? this.state.v1[5] : ''} onChange={(e)=>{ this.setGamingSpendValue(e, 'v1', 5)}}/>
                                </div>
                                <sub>,</sub>
                                <div className="gamingAmount lastAmount clearfix">
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v1[6] ? this.state.v1[6] : ''} onChange={(e)=>{ this.setGamingSpendValue(e, 'v1', 6)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v1[7] ? this.state.v1[7] : ''} onChange={(e)=>{ this.setGamingSpendValue(e, 'v1', 7)}}/>
                                </div>
                            </div>
                        </div>
                        <div className="transectionDatepicker">
                            <label>On</label>
                            <div className="datePicker clearfix">
                                <DatePicker selected={this.state.fromDate} dateFormat="DD MMM YYYY" minDate={moment()} onChange={this.handleChangeStartDate}/>
                            </div>
                        </div>
                    </div>
                    <div className="cancelcredit_amout clearfix" style={{display: (this.props.criteria.value.condition === "Between" ? 'block' : 'none')}}>
                        <div className="cancelcredit_amout_values">
                            <label>&nbsp;</label>
                            <div className="gammingValue_outer clearfix">
                                <small>$</small>
                                <div className="gamingAmount clearfix">
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v2[0] ? this.state.v2[0] : ''} onChange={(e)=>{ this.setGamingSpendValue(e, 'v2', 0)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v2[1] ? this.state.v2[1] : ''} onChange={(e)=>{ this.setGamingSpendValue(e, 'v2', 1)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v2[2] ? this.state.v2[2] : ''} onChange={(e)=>{ this.setGamingSpendValue(e, 'v2', 2)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v2[3] ? this.state.v2[3] : ''} onChange={(e)=>{ this.setGamingSpendValue(e, 'v2', 3)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v2[4] ? this.state.v2[4] : ''} onChange={(e)=>{ this.setGamingSpendValue(e, 'v2', 4)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v2[5] ? this.state.v2[5] : ''} onChange={(e)=>{ this.setGamingSpendValue(e, 'v2', 5)}}/>
                                </div>
                                <sub>,</sub>
                                <div className="gamingAmount lastAmount clearfix">
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v2[6] ? this.state.v2[6] : ''} onChange={(e)=>{ this.setGamingSpendValue(e, 'v2', 6)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v2[7] ? this.state.v2[7] : ''} onChange={(e)=>{ this.setGamingSpendValue(e, 'v2', 7)}}/>
                                </div>
                            </div>
                        </div>
                        <div className="transectionDatepicker">
                            <label>&nbsp;</label>
                            <div className="datePicker clearfix">
                                <DatePicker selected={this.state.toDate} dateFormat="DD MMM YYYY" minDate={this.state.fromDate} onChange={this.handleChangeEndDate}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of CancelCreditAmount.

export default CancelCreditAmount;