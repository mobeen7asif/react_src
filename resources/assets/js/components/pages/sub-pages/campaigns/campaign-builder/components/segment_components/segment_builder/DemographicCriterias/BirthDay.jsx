import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import { Scrollbars } from 'react-custom-scrollbars';

class BirthDay extends Component {

    birthDayStatus = ['Between', 'Greater Then', 'Smaller Than', 'Equals'];
    customDropDownSpanRef = null;
    customDropDownShowRef = null;
    state = {
        fromDate: null,
        toDate: null
    };

    handleChangeStartDate = (date) => {
        this.setState({
            fromDate: date
        });

        let preVal = this.props.criteria.value;
        preVal.fromDate = date.format('YYYY-MM-DD');//DD-MM-YYYY
        this.setCriteriaValue(preVal);
    };//..... end of handleChangeStartDate() .....//

    handleChangeEndDate = (date) => {
        this.setState({
            toDate: date
        });

        let preVal = this.props.criteria.value;
        preVal.toDate = date.format('YYYY-MM-DD');//DD-MM-YYYY
        this.setCriteriaValue(preVal);
    };//..... end of handleChangeEndDate() .....//

    setValueSelected = (value) => {
        let preVal = this.props.criteria.value;
        preVal.birthDayStatus = value;

        if (value === 'Between') {
            preVal.toDate = null;
            this.setState({
                toDate: null
            });
        }//..... end if() .....//

        this.setCriteriaValue(preVal);

        this.customDropDownShowRef.style.display = 'none';
        this.customDropDownSpanRef.classList.remove('changeAero');
    };//..... end of setValueSelected() .....//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('birth_day', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        if (this.state.fromDate == null) {
            if (this.props.criteria.value.fromDate) {
                this.setState(() => ({
                    fromDate: moment(this.props.criteria.value.fromDate)
                }));
            }//..... end if() .....//
        }//...... end if() .....//

        if (this.state.toDate == null) {
            if (this.props.criteria.value.toDate) {
                this.setState(() => ({
                    toDate: moment(this.props.criteria.value.toDate)
                }));
            }//..... end if() .....//
        }//...... end if() .....//
    };//..... end of componentDidMount() .....//

    handleDropDownSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRef.style.display =  (this.customDropDownShowRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanClick() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Birthday <span style={{fontSize: '10px',marginLeft: '19px',fontStyle: 'italic', color: 'silver'}}></span></h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('birth_day')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Birthday is</label>
                        <div className="placeHolderOuter expandPlaceholder clearfix">
                            <div className="customDropDown">
                                <span ref={ref => this.customDropDownSpanRef = ref} onClick={this.handleDropDownSpanClick}> {this.props.criteria.value.birthDayStatus ? this.props.criteria.value.birthDayStatus : 'Birthday is'} </span>
                                <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                        {
                                            this.birthDayStatus.map((ms) => {
                                                return <li key={ms} onClick={(e)=> {this.setValueSelected(ms)}}
                                                           className={(this.props.criteria.value.birthDayStatus === ms) ? 'selectedItem' : ''}>{ms}</li>
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
                                    <DatePicker
                                        selected={this.state.fromDate}
                                        dateFormat="DD MMM YYYY"
                                        onChange={this.handleChangeStartDate}
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown

                                    />
                                </div>
                            </div>
                            <div className="datePickerLeft frDatePicker" style={{display: (this.props.criteria.value.birthDayStatus === 'Between' ? 'block' : 'none')}}>
                                <strong>To</strong>
                                <div className="datePicker">
                                    <DatePicker
                                        selected={this.state.toDate}
                                        dateFormat="DD MMM YYYY"
                                        minDate={this.state.fromDate}
                                        onChange={this.handleChangeEndDate}
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown

                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of BirthDay.

export default BirthDay;