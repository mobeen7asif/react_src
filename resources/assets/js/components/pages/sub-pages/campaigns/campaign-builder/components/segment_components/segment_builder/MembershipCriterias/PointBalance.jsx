import React, {Component} from 'react';
import {find} from "lodash";
import { Scrollbars } from 'react-custom-scrollbars';

class PointBalance extends Component {
    pointsType  = ['More Than', 'Less Than', 'Equal To', 'Not Equal To', 'Between'];
    pointsOf    = ['Test 1', 'Test 2', 'Test 3', 'Test 4', 'Test 5', 'Test 6', 'Test 7', 'Test 8'];
    customDropDownOneSpanRef    = null;
    customDropDownShowOneRef    = null;
    customDropDownSecondSpanRef = null;
    customDropDownShowSecondRef = null;

    setValueSelected = (key, value) => {
        let newSt = this.props.criteria.value;
        newSt[key] = value;
        this.setCriteriaValue(newSt);

        if (key === 'pv1') {
            this.customDropDownShowOneRef.style.display = 'none';
            this.customDropDownOneSpanRef.classList.remove('changeAero');
        } else {
            this.customDropDownShowSecondRef.style.display = 'none';
            this.customDropDownSecondSpanRef.classList.remove('changeAero');
        }//..... end if-else() ....//
    };//..... end of

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('point_balance', 'value', value);
    };//..... end of setCriteriaValue() .....//

    setPointValue = (e, key) => {
        let value = e.target.value;
        value = value.replace(/ /g,'');
        if (!isNaN(value) && value.length < 6) {
            value = value.replace(/\B(?=(\d{3})+(?!\d))/, " ");
            this.setValueSelected(key, value);
        }//..... end if() .....//
    };//..... end of setPointValue() .....//

    handleDropDownOneSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowOneRef.style.display =  this.customDropDownShowOneRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownOneSpanClick() .....//

    handleDropDownSecondSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowSecondRef.style.display =  this.customDropDownShowSecondRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownSecondSpanClick() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Points Balance</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('point_balance')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Member with a Balance of</label>
                        <div className="balancePoint_outer clearfix">
                            <div className="memberPlaceholder_point">
                                <div className="placeHolderOuter expandPlaceholder clearfix">
                                    <div className="customDropDown">
                                        <span ref={ref => this.customDropDownOneSpanRef = ref} onClick={this.handleDropDownOneSpanClick}> {this.props.criteria.value.pv1 ? this.props.criteria.value.pv1 : 'Points of'}</span>
                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowOneRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                {
                                                    this.pointsType.map((ptype) => {
                                                        return <li key={ptype} onClick={(e)=> {this.setValueSelected('pv1', ptype)}}>{ptype}</li>
                                                    })
                                                }
                                            </Scrollbars>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="poitBalance_div">
                                <input type="text" placeholder="91 988" value={this.props.criteria.value.v1} onChange={(e)=>{this.setPointValue(e,'v1')}}/>
                            </div>
                            {/*<div className="memberPlaceholder_point frBalance">
                                <div className="placeHolderOuter expandPlaceholder clearfix">
                                    <div className="customDropDown pointOfDropDown">
                                        <span onClick={this.handleDropDownSecondSpanClick} ref={ref => this.customDropDownSecondSpanRef = ref}> {this.props.criteria.value.pv2 ? this.props.criteria.value.pv2 : 'Points of'}</span>
                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowSecondRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                {
                                                    this.pointsOf.map((ptype) => {
                                                        return <li key={ptype} onClick={(e)=> {this.setValueSelected('pv2', ptype)}}>{ptype}</li>
                                                    })
                                                }
                                            </Scrollbars>
                                        </ul>
                                    </div>
                                </div>
                            </div>*/}
                        </div>
                    </div>
                    <div className="balancePoint_outer clearfix" style={{marginTop: '12px'}}>
                        <div className="memberPlaceholder_point">
                            <div className="placeHolderOuter clearfix">&nbsp;</div>
                        </div>
                        <div className="poitBalance_div" style={{display: (this.props.criteria.value.pv1 === 'Between' ? 'block' : 'none')}}>
                            <input type="text" placeholder="91 988" value={this.props.criteria.value.v2} onChange={(e)=>{this.setPointValue(e,'v2')}}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of PointBalance.

export default PointBalance;