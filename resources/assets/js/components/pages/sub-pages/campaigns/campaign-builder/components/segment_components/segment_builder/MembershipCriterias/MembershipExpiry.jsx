import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import { Scrollbars } from 'react-custom-scrollbars';

class MembershipExpiry extends Component {

    memberExpire = ['On', 'Before', 'After', 'Between'];
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
        preVal.memberExpire = value;

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
        this.props.setCriteriaValue('expiry_datetime', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        if (this.state.fromDate === null) {
            if (this.props.criteria.value.fromDate) {
                this.setState(() => ({
                    fromDate: moment(this.props.criteria.value.fromDate)
                }));
            }//..... end if() .....//
        }//...... end if() .....//

        if (this.state.toDate === null) {
            if (this.props.criteria.value.toDate) {
                this.setState(() => ({
                    fromDate: moment(this.props.criteria.value.toDate)
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
                    <h3>Membership Expiry Date</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('expiry_datetime')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Member expiry date is</label>
                        <div className="placeHolderOuter expandPlaceholder clearfix">
                            <div className="customDropDown">
                                <span onClick={this.handleDropDownSpanClick} ref={ref => this.customDropDownSpanRef = ref}> {this.props.criteria.value.memberExpire ? this.props.criteria.value.memberExpire : 'Membership Join'} </span>
                                <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                        {
                                            this.memberExpire.map((ms) => {
                                                return <li key={ms} onClick={(e)=> {this.setValueSelected(ms)}}
                                                           className={(this.props.criteria.value.memberExpire === ms) ? 'selectedItem' : ''}>{ms}</li>
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
                            <div className="datePickerLeft frDatePicker" style={{display: (this.props.criteria.value.memberExpire === 'Between' ? 'block' : 'none')}}>
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
}//..... end of MembershipExpiry.

export default MembershipExpiry;