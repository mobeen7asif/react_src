import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import DatePicker from 'react-datepicker';

class PosSpendDate extends Component {
    posSpendCondition = ['On', 'Before', 'After', 'Between'];
    customDropDownFirstSpanRef = null;
    customDropDownShowFirstRef = null;
    state = {
        fromDate: null,
        toDate: null
    };

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('pos_spend_date', 'value', value);
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

    setValueSelected = (value) => {
        let preVal = this.props.criteria.value;
        preVal.condition = value;
        // preValue = {condition: 'between', fromDate: 2324, toDate: 34435}
        this.customDropDownShowFirstRef.style.display = 'none';
        this.customDropDownFirstSpanRef.classList.remove('changeAero');

        this.setCriteriaValue(preVal);
    };//..... end of setValueSelected() .....//

    componentDidMount = () => {
        if (this.state.fromDate === null) {
            if (this.props.criteria.value.fromDate) {
                let fromDate = this.props.criteria.value.fromDate.split('-');
                this.setState(() => ({
                    fromDate: moment(`${fromDate[2]}-${fromDate[1]}-${fromDate[0]}`)
                }));
            }//..... end if() .....//
        }//...... end if() .....//

        if (this.state.toDate === null) {
            if (this.props.criteria.value.toDate) {
                let toDate = this.props.criteria.value.toDate.split('-');
                this.setState(() => ({
                    toDate: moment(`${toDate[2]}-${toDate[1]}-${toDate[0]}`)
                }));
            }//..... end if() .....//
        }//...... end if() .....//
    };//..... end of componentDidMount() .....//

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
                    <h3>POS Spend Date <span style={{fontSize: '10px',marginLeft: '19px',fontStyle: 'italic', color: 'silver'}}>We are using Australian Eastern Standard Time (AEST), please set your time accordingly</span></h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('pos_spend_date')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Last POS spend date is</label>
                        <div className="placeHolderOuter expandPlaceholder clearfix">
                            <div className="customDropDown">
                                <span onClick={this.handleDropDownSpanFirstClick} ref={ref => this.customDropDownFirstSpanRef = ref}> {this.props.criteria.value.condition ? this.props.criteria.value.condition : 'Pos Spend Date'}</span>
                                <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowFirstRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                        {
                                            this.posSpendCondition.map((ptype) => {
                                                return <li key={ptype} onClick={(e)=> {this.setValueSelected(ptype)}}>{ptype}</li>
                                            })
                                        }
                                    </Scrollbars>
                                </ul>
                            </div>
                        </div>
                        <div className="datePickerOuter clearfix">
                            <div className="datePickerLeft">
                                <strong>From</strong>
                                <div className="datePicker">
                                    <DatePicker selected={this.state.fromDate} dateFormat="DD MMM YYYY" minDate={moment()} onChange={this.handleChangeStartDate}/>
                                </div>
                            </div>
                            <div className="datePickerLeft frDatePicker" style={{display: (this.props.criteria.value.condition === 'Between' ? 'block' : 'none')}}>
                                <strong>And</strong>
                                <div className="datePicker">
                                    <DatePicker selected={this.state.toDate} dateFormat="DD MMM YYYY" minDate={this.state.fromDate} onChange={this.handleChangeEndDate}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of PosSpendDate.

export default PosSpendDate;