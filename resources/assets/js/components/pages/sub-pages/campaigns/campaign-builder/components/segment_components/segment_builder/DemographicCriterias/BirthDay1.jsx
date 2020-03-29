import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import { Scrollbars } from 'react-custom-scrollbars';

class BirthDay1 extends Component {
    state = {
        birthDate: null
    };

    handleChangeStartDate = (date) => {
        this.setState({
            birthDate: date
        });

        let preVal = this.props.criteria.value;
        preVal.birthDate = date.format('YYYY-MM-DD');//DD-MM-YYYY
        this.setCriteriaValue(preVal);
    };//..... end of handleChangeStartDate() .....//


    setValueSelected = (value) => {
        let preVal = this.props.criteria.value;
        preVal.birthDate = value;
        this.setCriteriaValue(preVal);
    };//..... end of setValueSelected() .....//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('birth_day', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        if (this.state.birthDate === null) {
            if (this.props.criteria.value.birthDate) {
                this.setState(() => ({
                    birthDate: moment(this.props.criteria.value.birthDate)
                }));
            }//..... end if() .....//
        }//...... end if() .....//


    };//..... end of componentDidMount() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Birthday <span style={{fontSize: '10px',marginLeft: '19px',fontStyle: 'italic', color: 'silver'}}>We are using Australian Eastern Standard Time (AEST), please set your time accordingly</span></h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('birth_day')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <div className="datePickerOuter clearfix">
                            <div className="datePickerLeft">
                                <strong>User birthday is</strong>
                                <div className="datePicker">
                                    <DatePicker
                                        selected={this.state.birthDate}
                                        onChange={this.handleChangeStartDate}
                                        dateFormat="DD MMM YYYY"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
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

export default BirthDay1;