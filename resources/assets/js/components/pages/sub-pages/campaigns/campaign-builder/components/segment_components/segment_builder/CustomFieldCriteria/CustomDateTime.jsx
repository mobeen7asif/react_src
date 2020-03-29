import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from "moment";

class CustomDateTime extends Component {

    customDate = ['On', 'Before', 'After', 'Between'];
    customDropDownSpanRef = null;
    customDropDownShowRef = null;
    state = {
        fromDate: null,
        toDate: null
    };

    componentDidMount = () => {

        if (this.state.fromDate === null) {
            if (this.props.criteria.value.fromDate) {
                this.setState(() => ({
                    //fromDate: moment(this.props.criteria.value.fromDate)
                    fromDate: moment(this.props.criteria.value.fromDate, "DD-MM-YYYY HH:mm")
                }));
            }//..... end if() .....//
        }//...... end if() .....//

        if (this.state.toDate === null) {
            if (this.props.criteria.value.toDate) {
                this.setState(() => ({
                    //toDate: moment(this.props.criteria.value.toDate)
                    toDate: moment(this.props.criteria.value.toDate, "DD-MM-YYYY HH:mm")
                }));
            }//..... end if() .....//
        }//...... end if() .....//
    };//..... end of componentDidMount() .....//

    handleChangeStartDate = (date) => {
        let date_value = moment(date,"YYYY-MM").format('DD-MM-YYYY HH:mm');
        if(date <= this.state.fromDate){
            this.setState((prevState) => ({
                fromDate: moment(date_value, "DD-MM-YYYY HH:mm")
            }));
        }else{
            this.setState((prevState) => ({
                fromDate: moment(date_value, "DD-MM-YYYY HH:mm")
                //end_date: date
            }));
        }

        let preVal = this.props.criteria.value;
        preVal.fromDate = date_value;//DD-MM-YYYY
        this.setCriteriaValue(preVal);

    };

    handleChangeEndDate = (date) => {
        let date_value = moment(date,"YYYY-MM").format('DD-MM-YYYY HH:mm');
        this.setState((prevState) => ({
            toDate:  moment(date_value, "DD-MM-YYYY HH:mm")
        }));
        let preVal = this.props.criteria.value;
        preVal.toDate = date_value;
        this.setCriteriaValue(preVal);

    };



    setValueSelected = (value) => {
        let preVal = this.props.criteria.value;
        preVal.customDate = value;
        preVal.toDate = null;
        this.setState({
            toDate: null
        });
        /*if (value === 'Between') {
            preVal.toDate = null;
            this.setState({
                toDate: null
            });
        }*/

        this.setCriteriaValue(preVal);

        this.customDropDownShowRef.style.display = 'none';
        this.customDropDownSpanRef.classList.remove('changeAero');
    };//..... end of setValueSelected() .....//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue(this.props.component_name, 'value', value);
    };//..... end of setCriteriaValue() .....//



    handleDropDownSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRef.style.display =  (this.customDropDownShowRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanClick() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//


    getLabelName = (segment_name) => {
        let memberCustomFields= JSON.parse(localStorage.getItem('all_custom_fields'));
        let field_name = memberCustomFields.filter((value)=>{
            return value.field_unique_id == segment_name;
        });
        return field_name.length > 0 ? this.removeUnderscore(field_name[0].field_label) : this.removeUnderscore(this.props.field_name)+"<span style='color:red;'>This field is no more available</span>";
    }

    removeUnderscore = (str) => str.replace(/_/g, " ");

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3 className="capitalize"> {this.getLabelName(this.props.component_name)} <span style={{fontSize: '10px',marginLeft: '19px',fontStyle: 'italic', color: 'silver'}}></span></h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria(this.props.component_name)}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label className="capitalize">{this.getLabelName(this.props.component_name)} </label>
                        <div className="placeHolderOuter expandPlaceholder clearfix">
                            <div className="customDropDown">
                                <span ref={ref => this.customDropDownSpanRef = ref} onClick={this.handleDropDownSpanClick}> {this.props.criteria.value.customDate ? this.props.criteria.value.customDate : 'Select Option'} </span>
                                <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                        {
                                            this.customDate.map((ms) => {
                                                return <li key={ms} onClick={(e)=> {this.setValueSelected(ms)}}
                                                           className={(this.props.criteria.value.customDate === ms) ? 'selectedItem' : ''}>{ms}</li>
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
                                    {/*<DatePicker selected={this.state.fromDate} dateFormat="DD MMM YYYY"  onChange={this.handleChangeStartDate}/>*/}
                                    <DatePicker showMonthDropdown showYearDropdown selected={this.state.fromDate} timeIntervals={10} dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm"   onChange={this.handleChangeStartDate}/>
                                </div>
                            </div>
                            <div className="datePickerLeft frDatePicker" style={{display: (this.props.criteria.value.customDate === 'Between' ? 'block' : 'none')}}>
                                <strong>And</strong>
                                <div className="datePicker">
                                    {/*<DatePicker selected={this.state.toDate} dateFormat="DD MMM YYYY" minDate={this.state.fromDate} onChange={this.handleChangeEndDate}/>*/}
                                    <DatePicker showMonthDropdown showYearDropdown  selected={this.state.toDate} dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm"  minDate={this.state.toDate} onChange={this.handleChangeEndDate}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of CustomDateTime.

export default CustomDateTime;