import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

class PosLocation extends Component {
    posLocationCondition = ['On', 'Before', 'After', 'Between'];
    customDropDownFirstSpanRef = null;
    customDropDownShowFirstRef = null;

    setValueSelected = (value) => {
        let preVal = this.props.criteria.value;
        preVal.condition = value;
        // preValue = {condition: 'between', fromDate: 2324, toDate: 34435}

        if (value === 'Between') {
            preVal.toDate = null;
            this.setState({
                toDate: null
            });
        }//..... end if() .....//

        this.customDropDownShowFirstRef.style.display = 'none';
        this.customDropDownFirstSpanRef.classList.remove('changeAero');
        this.setCriteriaValue(preVal);
    };//..... end of setValueSelected() .....//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('pos_location', 'value', value);
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
                    <h3>POS Location</h3>
                    <span style={{color: 'red'}}>This feature requires briefing.</span>
                    <div className="segmntClose"  onClick={(e)=> {this.props.removeCriteria('pos_location')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Member has made a purchase at</label>
                        <div className="placeHolderOuter expandPlaceholder clearfix">
                            <div className="customDropDown">
                                <span onClick={this.handleDropDownSpanFirstClick} ref={ref => this.customDropDownFirstSpanRef = ref}> {this.props.criteria.value.condition ? this.props.criteria.value.condition : 'Pos Location'}</span>
                                <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowFirstRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                        {
                                            this.posLocationCondition.map((ptype) => {
                                                return <li key={ptype} onClick={(e)=> {this.setValueSelected(ptype)}}>{ptype}</li>
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
}//..... end of PosLocation.

export default PosLocation;