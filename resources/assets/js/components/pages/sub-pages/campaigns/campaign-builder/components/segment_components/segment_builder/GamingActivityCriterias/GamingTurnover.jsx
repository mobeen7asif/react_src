import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import DatePicker from 'react-datepicker';

class GamingTurnover extends Component {
    customDropDownFirstSpanRef = null;
    customDropDownShowFirstRef = null;
    customDropDownSecondSpanRef = null;
    customDropDownShowSecondRef = null;
    trunover    = ['More Than', 'Less Than', 'Equal To', 'Not Equal To', 'Between'];
    transaction = ['On', 'Before', 'After', 'Between'];

    state = {
        fromDate: null,
        toDate: null,
        v1: Array(8),
        v2: Array(8)
    };

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('gaming_turnover', 'value', value);
    };//..... end of setCriteriaValue() .....//

    handleChangeStartDate = (date) => {
        this.setState({
            fromDate: date
        });

        let preVal = this.props.criteria.value;
        preVal.transaction_date.fromDate = date.format('YYYY-MM-DD');
        this.setCriteriaValue(preVal);
    };//..... end of handleChangeStartDate() .....//

    handleChangeEndDate = (date) => {
        this.setState({
            toDate: date
        });

        let preVal = this.props.criteria.value;
        preVal.transaction_date.toDate = date.format('YYYY-MM-DD');
        this.setCriteriaValue(preVal);
    };//..... end of handleChangeEndDate() .....//

    setValueSelected = (baseKey, key, value) => {
        let preVal = this.props.criteria.value;
        preVal[baseKey][key] = value;
        // preValue = {gaming_turnover: {condition: 'between', v1: 2324, v2: 34435}, transaction_date: {condition: '', fromDate: '', toDate: ''}}

        if (baseKey === 'transaction_date' && value === 'Between') {
            preVal.transaction_date.toDate = null;
            this.setState({
                toDate: null
            });
        }//..... end if() .....//

        if (baseKey === 'gaming_turnover') {
            this.customDropDownShowFirstRef.style.display = 'none';
            this.customDropDownFirstSpanRef.classList.remove('changeAero');
        } else {
            this.customDropDownShowSecondRef.style.display = 'none';
            this.customDropDownSecondSpanRef.classList.remove('changeAero');
        }//..... end if() .....//

        this.setCriteriaValue(preVal);
    };//..... end of setValueSelected() .....//

    setTurnoverValue = (e, key, index) => {
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
                preVal.gaming_turnover[key] = this.state[key].join('');
                this.setCriteriaValue(preVal);
            });
        }

        if (isNaN(value)) {
            let st = this.state[key];
            st[index] = '';
           this.setState({[key]: st})
        }//..... end if() ......//
    };//..... end of setTurnoverValue() ......//

    componentDidMount = () => {
        this.initializeStateValues();
    };//..... end of componentDidMount() .....//

    initializeStateValues = () => {
        if (this.state.fromDate === null) {
            if (this.props.criteria.value.transaction_date.fromDate) {
                this.setState(() => ({
                    fromDate: moment(`${this.props.criteria.value.transaction_date.fromDate}`)
                }));
            }//..... end if() .....//
        }//...... end if() .....//

        if (this.state.toDate === null) {
            if (this.props.criteria.value.transaction_date.toDate) {
                this.setState(() => ({
                    toDate: moment(`${this.props.criteria.value.transaction_date.toDate}`)
                }));
            }//..... end if() .....//
        }//...... end if() .....//

        if (this.props.criteria.value.gaming_turnover.v1) {
            this.setState((prevState) => {
                let v1 = Array(8);
                this.props.criteria.value.gaming_turnover.v1.split('').map((val, index) => {
                    v1[index] = val;
                });
                return {
                    v1: v1
                };
            });
        }//..... end if() .....//

        if (this.props.criteria.value.gaming_turnover.v2) {
            this.setState((prevState) => {
                let v2 = Array(8);
                this.props.criteria.value.gaming_turnover.v2.split('').map((val, index) => {
                    v2[index] = val;
                });
                return {
                    v2: v2
                };
            });
        }//..... end if() .....//
    };//..... end of initializeStateValues() ......//

    handleDropDownSpanFirstClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowFirstRef.style.display =  (this.customDropDownShowFirstRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanFirstClick() .....//

    handleDropDownSpanSecondClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowSecondRef.style.display =  (this.customDropDownShowSecondRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanSecondClick() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Gaming Turnover</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('gaming_turnover')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a></div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Gaming turnover is</label>
                        <div className="gammingTurnOuter clearfix">
                            <div className="gammingTurn_placeholder">
                                <div className="customDropDown">
                                    <span onClick={this.handleDropDownSpanFirstClick} ref={ref => this.customDropDownFirstSpanRef = ref}> {this.props.criteria.value.gaming_turnover.condition ? this.props.criteria.value.gaming_turnover.condition : 'Gaming Turnover'}</span>
                                    <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowFirstRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                        <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                            {
                                                this.trunover.map((ptype) => {
                                                    return <li key={ptype} onClick={(e)=> {this.setValueSelected('gaming_turnover', 'condition', ptype)}}>{ptype}</li>
                                                })
                                            }
                                        </Scrollbars>
                                    </ul>
                                </div>
                            </div>
                            <div className="gammingValue_outer clearfix">
                                <small>$</small>
                                <div className="gamingAmount clearfix">
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v1[0] ? this.state.v1[0] : ''} onChange={(e)=>{ this.setTurnoverValue(e, 'v1', 0)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v1[1] ? this.state.v1[1] : ''} onChange={(e)=>{ this.setTurnoverValue(e, 'v1', 1)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v1[2] ? this.state.v1[2] : ''} onChange={(e)=>{ this.setTurnoverValue(e, 'v1', 2)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v1[3] ? this.state.v1[3] : ''} onChange={(e)=>{ this.setTurnoverValue(e, 'v1', 3)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v1[4] ? this.state.v1[4] : ''} onChange={(e)=>{ this.setTurnoverValue(e, 'v1', 4)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v1[5] ? this.state.v1[5] : ''} onChange={(e)=>{ this.setTurnoverValue(e, 'v1', 5)}}/>
                                </div>
                                <sub>,</sub>
                                <div className="gamingAmount lastAmount clearfix">
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v1[6] ? this.state.v1[6] : ''} onChange={(e)=>{ this.setTurnoverValue(e, 'v1', 6)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v1[7] ? this.state.v1[7] : ''} onChange={(e)=>{ this.setTurnoverValue(e, 'v1', 7)}}/>
                                </div>
                            </div>
                        </div>
                        <div className="gammingTurnOuter clearfix"  style={{display: this.props.criteria.value.gaming_turnover.condition === 'Between' ? 'block' : 'none'}}>
                            <div className="gammingValue_outer clearfix">
                                <small>$</small>
                                <div className="gamingAmount clearfix">
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v2[0] ? this.state.v2[0] : ''} onChange={(e)=>{ this.setTurnoverValue(e, 'v2', 0)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v2[1] ? this.state.v2[1] : ''} onChange={(e)=>{ this.setTurnoverValue(e, 'v2', 1)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v2[2] ? this.state.v2[2] : ''} onChange={(e)=>{ this.setTurnoverValue(e, 'v2', 2)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v2[3] ? this.state.v2[3] : ''} onChange={(e)=>{ this.setTurnoverValue(e, 'v2', 3)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v2[4] ? this.state.v2[4] : ''} onChange={(e)=>{ this.setTurnoverValue(e, 'v2', 4)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v2[5] ? this.state.v2[5] : ''} onChange={(e)=>{ this.setTurnoverValue(e, 'v2', 5)}}/>
                                </div>
                                <sub>,</sub>
                                <div className="gamingAmount lastAmount clearfix">
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v2[6] ? this.state.v2[6] : ''} onChange={(e)=>{ this.setTurnoverValue(e, 'v2', 6)}}/>
                                    <input type="text" placeholder="1" maxLength="1"  value={this.state.v2[7] ? this.state.v2[7] : ''} onChange={(e)=>{ this.setTurnoverValue(e, 'v2', 7)}}/>
                                </div>
                            </div>
                        </div>
                        <label>And Transaction date is</label>
                        <div className="gammingTurnOuter clearfix">
                            <div className="gammingTurn_placeholder">
                                <div className="customDropDown">
                                    <span onClick={this.handleDropDownSpanSecondClick} ref={ref => this.customDropDownSecondSpanRef = ref}> {this.props.criteria.value.transaction_date.condition ? this.props.criteria.value.transaction_date.condition : 'Points of'}</span>
                                    <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowSecondRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                        <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                            {
                                                this.transaction.map((ptype) => {
                                                    return <li key={ptype} onClick={(e)=> {this.setValueSelected('transaction_date','condition', ptype)}}>{ptype}</li>
                                                })
                                            }
                                        </Scrollbars>
                                    </ul>
                                </div>
                            </div>
                            <div className="transectionDatepicker">
                                <div className="datePicker clearfix">
                                    <DatePicker selected={this.state.fromDate} dateFormat="DD MMM YYYY" minDate={moment()} onChange={this.handleChangeStartDate}/>
                                </div>
                            </div>
                        </div>
                        <div className="gammingTurnOuter clearfix" style={{display: this.props.criteria.value.transaction_date.condition === 'Between' ? 'block' : 'none'}}>
                            <div className="transectionDatepicker">
                                <div className="datePicker clearfix">
                                    <DatePicker selected={this.state.toDate} dateFormat="DD MMM YYYY" minDate={this.state.fromDate} onChange={this.handleChangeEndDate}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of GamingTurnover.

GamingTurnover.propTypes = {};

export default GamingTurnover;