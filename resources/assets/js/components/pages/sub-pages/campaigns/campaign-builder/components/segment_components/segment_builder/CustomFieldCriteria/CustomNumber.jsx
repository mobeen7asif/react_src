import React, {Component} from 'react';
import {Scrollbars} from "react-custom-scrollbars";

class CustomNumber extends Component {

    state = {
        number: "",
    };


    setCriteriaValue = (value) => {
        this.props.setCriteriaValue(this.props.component_name, 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        if (this.props.criteria.value.number)
            this.setState({number:this.props.criteria.value.number});
    };//..... end of componentDidMount() .....//

    handleFromIputs = (e) => {
        var value = e.target.value;

        if (value.match(/^\d*$/gm))
            value = value;
        else
            return false;

        this.setState({
            number:  value
        });
        let preVal = this.props.criteria.value;
        preVal.number = value;
        this.setCriteriaValue(preVal);
    };





    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    removeUnderscore = (str) => str.replace(/_/g, " ");

    getLabelName = (segment_name) => {
        let memberCustomFields= JSON.parse(localStorage.getItem('all_custom_fields'));
        let field_name = memberCustomFields.filter((value)=>{
            return value.field_unique_id == segment_name;
        });
        return field_name.length > 0 ? this.removeUnderscore(field_name[0].field_label) : this.removeUnderscore(this.props.field_name);
    }

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


                            <div className="memberNumbe" style={{width: "45%",float:"left"}}>
                                <div className="numberFields clearfix">
                                    <input  type="text" placeholder={this.getLabelName(this.props.component_name)} className="capitalize" style={{width:100+'%'}} value={this.state.number} onChange={(e) => {this.handleFromIputs(e)}}/>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

            </div>
        );
    }//..... end of render() .....//

}//..... end of CustomNumber.

export default CustomNumber;