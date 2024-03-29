import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

class TargetUsers extends Component {
    customDropDownSpanRef = null;
    customDropDownShowRef = null;
    constructor(props) {
        super(props);
        this.state = {
            TargetUsers : [{id:1,group_name:"Old Users"},{id:2,group_name:"New Users"}]
        };
    }//..... end of constructor() .....//



    setValueSelected = (value) => {
        let preVal = this.props.criteria.value;
        preVal.group_name = value.group_name;
        preVal.id = value.id;
        this.setCriteriaValue(preVal);

        this.customDropDownShowRef.style.display = 'none';
        this.customDropDownSpanRef.classList.remove('changeAero');
    };//..... end of setValueSelected() .....//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('target_users', 'value', value);
    };//..... end of setCriteriaValue() .....//



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
                    <h3>Target Users</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('target_users')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label></label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder">
                                <div className="placeHolderOuter clearfix">
                                    <div className="customDropDown">
                                        <span ref={ref => this.customDropDownSpanRef = ref} onClick={this.handleDropDownSpanClick}>{this.props.criteria.value.group_name ? this.props.criteria.value.group_name : 'Select Target Users'} </span>
                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                { this.state.TargetUsers && (
                                                    this.state.TargetUsers.map((ms,key) => {
                                                        return <li key={key} onClick={(e)=> {this.setValueSelected({group_name:ms.group_name,id:ms.id})}}
                                                                   className={(this.props.criteria.value.id === ms.id) ? 'selectedItem' : ''}>{ms.group_name}</li>
                                                    })
                                                )}
                                            </Scrollbars>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//

}//..... end of TargetUsers.

export default TargetUsers;