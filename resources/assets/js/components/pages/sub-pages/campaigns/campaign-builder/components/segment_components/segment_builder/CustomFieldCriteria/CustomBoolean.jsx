import React, {Component} from 'react';
import {Scrollbars} from "react-custom-scrollbars";
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import {NotificationManager} from "react-notifications";

class CustomBoolean extends Component {

    state = {
        count_users: "",
        isvalue_true:false
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
        this.props.setCriteriaValue(this.props.component_name, 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        if (this.props.criteria.value.is_true){
            this.setState(()=>({isvalue_true:true}));
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

        this.setState((prevState)=>({isvalue_true:!prevState.isvalue_true}),()=>{
            let preVal = this.props.criteria.value;
            preVal.is_true = this.state.isvalue_true;
            this.setCriteriaValue(preVal);

        });

    };


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
                    <h3 className="capitalize"> {this.getLabelName(this.props.component_name)}</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria(this.props.component_name)}}>
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
                                                <label className="capitalize">{this.getLabelName(this.props.component_name)}</label>
                                                <ToggleSwitch

                                                    checked={this.state.isvalue_true }
                                                    onChange={(e)=> {this.referredStatusChanged(e)}}
                                                />
                                                <span style={{fontWeight:'bold'}}> {this.state.isvalue_true ? "True" : "False"}</span>
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

}//..... end of CustomBoolean.

export default CustomBoolean;