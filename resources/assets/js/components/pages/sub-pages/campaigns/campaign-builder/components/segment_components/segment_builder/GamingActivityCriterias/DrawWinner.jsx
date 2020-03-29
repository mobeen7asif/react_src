import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

class DrawWinner extends Component {

    customDropDownFirstSpanRef = null;
    customDropDownShowFirstRef = null;
    duration = ["Days", "Weeks", "Months", "Years"];

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('last_updated_datetime', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    setValueSelected = (key, value) => {
        let preVal = this.props.criteria.value;
        preVal[key] = value; // preValue = {v1: 1, v2: 'week/days/year'}
        this.customDropDownShowFirstRef.style.display = 'none';
        this.customDropDownFirstSpanRef.classList.remove('changeAero');
        this.setCriteriaValue(preVal);
    };//..... end of setValueSelected() .....//

    quantityUp = () => {
        let preVal = this.props.criteria.value;
        let intVersion = parseInt(preVal.v1);
        preVal.v1  = (!isNaN(intVersion)) ? intVersion + 1 : 1;
        this.setCriteriaValue(preVal);
    };//..... end of quantityUp() ......//

    quantityDown = () => {
        let preVal = this.props.criteria.value;
        let intVersion = parseInt(preVal.v1);
        if ( intVersion > 0) {
            preVal.v1 = intVersion - 1;
            this.setCriteriaValue(preVal);
        }//..... end if() .....//
    };//..... end of quantityDown() ......//

    setQuantityValue = (e) => {
        let intVersion = parseInt(e.target.value);
        if (! isNaN(intVersion)) {
            this.setCriteriaValue(intVersion);
        }//..... end if() .....//
    };//..... end of setQuantityValue() .....//

    handleDropDownSpanFirstClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowFirstRef.style.display =  (this.customDropDownShowFirstRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanFirstClick() .....//

    render() {
        return (
            <div className="dropSegmentation_section recentTicketsMain">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Draw Winner</h3>
                    <div className="segmntClose"  onClick={(e)=> {this.props.removeCriteria('last_updated_datetime')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="recentTicket_detail clearfix">
                        <div className="recentTicket_incrimenter clearfix">
                            <label>Member was a draw winner in the last</label>
                            <div className="fieldIncremnt">
                                <div className="quantity clearfix">
                                    <input type="number" min="1" step="1" value={this.props.criteria.value.v1} onChange={this.setQuantityValue}/>
                                    <div className="quantity-nav">
                                        <div className="quantity-button quantity-up" onClick={this.quantityUp}>&nbsp;</div>
                                        <div className="quantity-button quantity-down" onClick={this.quantityDown}>&nbsp;</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="incrimentDay">
                            <div className="customDropDown">
                                <span onClick={this.handleDropDownSpanFirstClick} ref={ref => this.customDropDownFirstSpanRef = ref}> {this.props.criteria.value.v2 ? this.props.criteria.value.v2 : 'Draw Winner'}</span>
                                <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowFirstRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                        {
                                            this.duration.map((ptype) => {
                                                return <li key={ptype} onClick={(e)=> {this.setValueSelected('v2', ptype)}}>{ptype}</li>
                                            })
                                        }
                                    </Scrollbars>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of DrawWinner.

export default DrawWinner;