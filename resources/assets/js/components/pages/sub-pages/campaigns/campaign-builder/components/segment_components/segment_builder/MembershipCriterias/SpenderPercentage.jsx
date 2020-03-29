import React, {Component} from 'react';
import {Scrollbars} from "react-custom-scrollbars";

class SpenderPercentage extends Component {
    customDropDownSpanRef = null;
    customDropDownShowRef = null;

    state = {
        percentage: "",
    };

    setValueSelected = (value) => {
        let preVal = this.props.criteria.value;
        this.setCriteriaValue(preVal);

        this.customDropDownShowRef.style.display = 'none';
        this.customDropDownSpanRef.classList.remove('changeAero');
    };//..... end of setValueSelected() .....//

    handleDropDownSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRef.style.display =  (this.customDropDownShowRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanClick() .....//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('spender_percentage', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        if (this.props.criteria.value.percentage)
            this.setState({percentage:this.props.criteria.value.percentage});
    };//..... end of componentDidMount() .....//

    handleFromIputs = (e) => {
        let value = e.target.value;

        if(value > 100)
            return false;

        if(value == 0)
            return false;

        this.setState({
            percentage:  e.target.value
        });
        let preVal = this.props.criteria.value;
        preVal.percentage = value;
        this.setCriteriaValue(preVal);
    };



    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Spender Percentage</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('spender_percentage')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>

                <div className="stateSegmentation" style={{paddingTop:"0px"}}>
                    <div className="compaignDescription_outer clearfix">
                        <label>Spender Percentage</label>
                        <div className="memberNumberOuter clearfix">


                            <div className="memberNumbe" style={{width: "13%",float:"left"}}>
                                <div className="numberFields clearfix">
                                    <input  type="text" placeholder="%" className="numeric" style={{width:100+'%'}} value={this.state.percentage} onChange={(e) => {this.handleFromIputs(e)}}/>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

            </div>
        );
    }//..... end of render() .....//

}//..... end of SpenderPercentage.

export default SpenderPercentage;