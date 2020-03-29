import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import DatePicker from 'react-datepicker';
import {find} from 'lodash';
import {NotificationManager} from "react-notifications";

class VenueUtilization extends Component {
    customDropDownOneSpanRef    = null;
    customDropDownShowOneRef    = null;
    customDropDownSecondSpanRef = null;
    customDropDownShowSecondRef = null;
    customDropDownThirdSpanRef  = null;
    customDropDownShowThirdRef  = null;
    memberDropDown              = ['Has', 'Has Not'];
    triggerDropDown             = ['Immediate', 'Near', 'Enter Region' , 'Exit Region', 'Dwell Time'];
    conditions                  = ['On', 'Before', 'After', 'Between'];
    state                       = { fromDate: null, toDate: null, beaconsData: [] };

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('venue', 'value', value);
    };//..... end of setCriteriaValue() .....//

    setValueSelected = (key, value) => {
        let preVal = this.props.criteria.value;

        if (key === 'beacons') {
            let beacons = preVal.beacons;
            if (find(beacons, value)) {
                beacons = beacons.filter((obj) => obj.id !== value.id)
            } else {
                beacons.push(value);
            }//..... end if-else() .....//

            preVal[key] = beacons;
        } else {
            preVal[key] = value;
        }//..... end if-else() .....//
        // preValue = {member:'', trigger: '', beacons: [], condition: '', fromDate: null, toDate: null}

        if (key === 'condition' && value === 'Between') {
            preVal.toDate = null;
            this.setState({
                toDate: null
            });
        }//..... end if() .....//

        switch (key) {
            case 'member':
                this.customDropDownShowOneRef.style.display = 'none';
                this.customDropDownOneSpanRef.classList.remove('changeAero');
                break;
            case 'trigger':
                this.customDropDownShowSecondRef.style.display = 'none';
                this.customDropDownSecondSpanRef.classList.remove('changeAero');
                break;
            case 'condition':
                this.customDropDownShowThirdRef.style.display = 'none';
                this.customDropDownThirdSpanRef.classList.remove('changeAero');
                break;
            default:
                break;
        }//..... end switch() .....//

        this.setCriteriaValue(preVal);
    };//..... end of setValueSelected() .....//

    handleChangeStartDate = (date) => {
        this.setState({
            fromDate: date
        });

        let preVal = this.props.criteria.value;
        preVal.fromDate = date.format('DD-MM-YYYY');
        this.setCriteriaValue(preVal);
    };//..... end of handleChangeStartDate() .....//

    handleChangeEndDate = (date) => {
        this.setState({
            toDate: date
        });

        let preVal = this.props.criteria.value;
        preVal.toDate = date.format('DD-MM-YYYY');
        this.setCriteriaValue(preVal);
    };//..... end of handleChangeEndDate() .....//

    selectAll = () => {
        let preVal = this.props.criteria.value;
        preVal.beacons = this.state.beaconsData;
        this.setCriteriaValue(preVal);
    };//..... end of selectAll() ......//

    clearAll = () => {
        let preVal = this.props.criteria.value;
        preVal.beacons = [];
        this.setCriteriaValue(preVal);
    };//..... end of clearAll() ......//

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

        //..... get beacons from backend server.
        show_loader();
        axios.get(BaseUrl+`/api/beacons-list/${VenueID}`). then((response) => {
            show_loader();
            this.setState(() => ({beaconsData: response.data}));
        }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while fetching Beacons List.", 'Error');
        });
    };//..... end of componentDidMount() .....//

    handleDropDownOneSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowOneRef.style.display =  this.customDropDownShowOneRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownOneSpanClick() .....//

    handleDropDownSecondSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowSecondRef.style.display =  this.customDropDownShowSecondRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownSecondSpanClick() .....//

    handleDropDownThirdSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowThirdRef.style.display =  this.customDropDownShowThirdRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownSecondSpanClick() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Venue Utilisation</h3>
                    <span style={{color: 'red'}}>This feature requires briefing.</span>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('venue')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <div className="placeHolderOuter clearfix">
                            <div className="placeHolderLeft">
                                <strong>Member</strong>
                                <div className="customDropDown">
                                    <span  ref={ref => this.customDropDownOneSpanRef = ref} onClick={this.handleDropDownOneSpanClick}> {this.props.criteria.value.member ? this.props.criteria.value.member : 'Member...'}</span>
                                    <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowOneRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                        <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                            {
                                                this.memberDropDown.map((ptype) => {
                                                    return <li key={ptype} onClick={(e)=> {this.setValueSelected('member',ptype)}}>{ptype}</li>
                                                })
                                            }
                                        </Scrollbars>
                                    </ul>
                                </div>
                            </div>
                            <div className="placeHolderLeft frPlaceholder">
                                <strong>Triggered</strong>
                                <div className="customDropDown">
                                    <span onClick={this.handleDropDownSecondSpanClick} ref={ref => this.customDropDownSecondSpanRef = ref}> {this.props.criteria.value.trigger ? this.props.criteria.value.trigger : 'Select Trigger'}</span>
                                    <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowSecondRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                        <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                            {
                                                this.triggerDropDown.map((ptype) => {
                                                    return <li key={ptype} onClick={(e)=> {this.setValueSelected('trigger', ptype)}}>{ptype}</li>
                                                })
                                            }
                                        </Scrollbars>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <label>Beacons</label>
                        <div className="tagsCompaigns_detail clearfix">
                            <div className="tagsCompaigns_list">
                                <div className="tagsCompaigns_listScroll tagsScroll">
                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                        <ul style={{height: '197px'}}>
                                            {this.state.beaconsData.map((obj) => {
                                                return <li key={obj.id} onClick={()=> this.setValueSelected('beacons', obj)} className={(find(this.props.criteria.value.beacons, obj)) ? 'selectedItem' : ''}>{obj.name}</li>;
                                            })}
                                        </ul>
                                    </Scrollbars>
                                </div>
                            </div>
                            <div className="tagsSelected_tip">
                                <div className="selected_tip">
                                    <i>TIP</i>
                                    <p>Use the Control (Ctrl on Windows) or Command (⌘ on Mac)key to select or unselect items.</p>
                                    <button onClick={this.selectAll}>SELECT ALL</button>
                                    <button onClick={this.clearAll}>CLEAR ALL</button>
                                </div>
                            </div>
                        </div>
                        <div className="placeHolderOuter expandPlaceholder clearfix">
                            <div className="customDropDown">
                                <span  onClick={this.handleDropDownThirdSpanClick} ref={ref => this.customDropDownThirdSpanRef = ref}> {this.props.criteria.value.condition ? this.props.criteria.value.condition : 'Trigger On'}</span>
                                <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowThirdRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                        {
                                            this.conditions.map((ptype) => {
                                                return <li key={ptype} onClick={(e)=> {this.setValueSelected('condition', ptype)}}>{ptype}</li>
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
                            <div className="datePickerLeft frDatePicker" style={{display: (this.props.criteria.value.condition === 'Between' ? 'block': 'none')}}>
                                <strong>And</strong>
                                <div className="datePicker">
                                    <DatePicker selected={this.state.toDate} dateFormat="DD MMM YYYY" minDate={this.state.fromDate} onChange={this.handleChangeEndDate}/>
                                </div>
                            </div>
                        </div>

                        <div className="selectedTags">
                            <label>Selected</label>
                            <div className="showTags clearfix">
                                <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                    <span>
                                        {this.props.criteria.value.beacons.map((obj) => {
                                            return <a  style={{cursor:'pointer'}} onClick={()=> this.setValueSelected('beacons',obj)} key={obj.id}>
                                                {obj.name}
                                                <i>&nbsp;</i>
                                            </a>
                                        })}
                                    </span>
                                </Scrollbars>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of VenueUtilization.

export default VenueUtilization;