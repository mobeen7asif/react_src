import React, {Component} from 'react';
import {Scrollbars} from "react-custom-scrollbars";
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import {NotificationManager} from "react-notifications";

class GapMap extends Component {
    enterVenue = ['Equal','Less than or equal', 'More than or equal'];
    state = {
        count_users: "",
        gap_map:false
    };

    setValueSelected = (value) => {
        let preVal = this.props.criteria.value;
        preVal.status = value;
        this.setCriteriaValue(preVal);

        this.customDropDownShowRef.style.display = 'none';
        this.customDropDownSpanRef.classList.remove('changeAero');
    };//..... end of setValueSelected() .....//

    handleDropDownSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRef.style.display =  (this.customDropDownShowRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanClick() .....//


    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('gap_map_users', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        if (this.props.criteria.value.is_refferd){
            this.setState(()=>({gap_map:true}));
        }

    };//..... end of componentDidMount() .....//

    handleFromIputs = (e) => {
        this.setState({
            count_users:  e.target.value
        });
        let preVal = this.props.criteria.value;
        preVal.count_users = e.target.value;
        this.setCriteriaValue(preVal);
    };



    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    referredStatusChanged = () => {

        this.setState((prevState)=>({gap_map:!prevState.gap_map}),()=>{
            let preVal = this.props.criteria.value;
            preVal.is_refferd = this.state.gap_map;
            this.setCriteriaValue(preVal);

        });

    };

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Gap Map users</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('gap_map_users')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>



                <div className="stateSegmentation" style={{paddingTop:"0px"}}>
                    <div className="compaignDescription_outer clearfix">
                        <label></label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder">
                                <div className="placeHolderOuter clearfix">
                                    <div className="">
                                        <ul>
                                            <li>
                                                <label>All Gap Map Users</label>

                                            </li>
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

}//..... end of GapMap.

export default GapMap;