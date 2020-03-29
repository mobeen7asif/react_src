import React, {Component} from 'react';
import {Scrollbars} from "react-custom-scrollbars";
import PostCode from "./PostCode";

class PostCodeNew extends Component {
    customDropDownSpanRef = null;
    customDropDownShowRef = null;

    state = {
        postcode: "",
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
        this.props.setCriteriaValue('postal_code', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {

        if(!appPermission("ViewUsersFromOtherPostcode","view")){
            let value = UserPostCode;
            this.setState({
                postcode:  UserPostCode
            });
            let preVal = this.props.criteria.value;
            preVal.postcode = value;
            this.setCriteriaValue(preVal);
        }

        if (this.props.criteria.value.postcode)
            this.setState({postcode:this.props.criteria.value.postcode});
    };//..... end of componentDidMount() .....//

    handleFromIputs = (e) => {
        var value = e.target.value;
        if(!appPermission("ViewUsersFromOtherPostcode","view")){
            value = UserPostCode;
        }
        this.setState({
            postcode:  value
        });
        let preVal = this.props.criteria.value;
        preVal.postcode = value;
        this.setCriteriaValue(preVal);
    };



    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Postcode</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('postal_code')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>

                <div className="stateSegmentation" style={{paddingTop:"0px"}}>
                    <div className="compaignDescription_outer clearfix">
                        <label></label>
                        <div className="memberNumberOuter clearfix">


                            <div className="memberNumbe" style={{width: "45%",float:"left"}}>
                                <div className="numberFields clearfix">
                                    <input  type="text" placeholder="Postcode" className="" style={{width:100+'%'}} value={this.state.postcode} onChange={(e) => {this.handleFromIputs(e)}}/>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

            </div>
        );
    }//..... end of render() .....//

}//..... end of PostCodeNew.

export default PostCodeNew;