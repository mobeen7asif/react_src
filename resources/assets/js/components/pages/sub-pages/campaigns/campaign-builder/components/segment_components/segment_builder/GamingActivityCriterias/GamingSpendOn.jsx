import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

class GamingSpendOn extends Component {
    customDropDownFirstSpanRef = null;
    customDropDownShowFirstRef = null;
    GamingSpendOn = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    setCriteriaValue = (value) => {
        this.customDropDownShowFirstRef.style.display = 'none';
        this.customDropDownFirstSpanRef.classList.remove('changeAero');
        this.props.setCriteriaValue('Gaming_Spend_day', 'value', value);
    };//..... end of setCriteriaValue() .....//

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
                    <h3>Gaming Spend Day</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('Gaming_Spend_day')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Gaming Spend On</label>
                        <div className="expandPlaceholder GamingSpendOn">
                            <div className="customDropDown">
                                <span onClick={this.handleDropDownSpanFirstClick} ref={ref => this.customDropDownFirstSpanRef = ref}> {this.props.criteria.value ? this.props.criteria.value : 'Gaming Spend Day'}</span>
                                <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowFirstRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                        {
                                            this.GamingSpendOn.map((ptype) => {
                                                return <li key={ptype} onClick={(e)=> {this.setCriteriaValue(ptype)}} className={this.props.criteria.value === ptype ? 'selectedItem' : ''}>{ptype}</li>
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
}//..... end of GamingSpendOn.

export default GamingSpendOn;