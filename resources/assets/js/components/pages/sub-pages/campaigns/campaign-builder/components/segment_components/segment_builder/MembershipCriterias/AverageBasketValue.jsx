import React, {Component} from 'react';
import {Scrollbars} from "react-custom-scrollbars";

class AverageBasketValue extends Component {
    customDropDownSpanRef = null;
    customDropDownShowRef = null;
    enterVenue = ['Equal', 'More than',"Less than"];
    state = {
        amount: "",
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
        this.props.setCriteriaValue('average_basket_value', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        if (this.props.criteria.value.amount)
            this.setState({amount:this.props.criteria.value.amount});
    };//..... end of componentDidMount() .....//

    handleFromIputs = (e) => {
        this.setState({
            amount:  e.target.value
        });
        let preVal = this.props.criteria.value;
        preVal.amount = e.target.value;
        this.setCriteriaValue(preVal);
    };



    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Average Basket Value</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('average_basket_value')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>

                <div className="stateSegmentation" style={{paddingTop:"0px"}}>
                    <div className="compaignDescription_outer clearfix">
                        <label>Average Basket Value</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder">
                                <div className="placeHolderOuter clearfix">
                                    <div className="customDropDown">
                                        <span ref={ref => this.customDropDownSpanRef = ref} onClick={this.handleDropDownSpanClick}>{this.props.criteria.value.status ? this.props.criteria.value.status : 'Select Type'} </span>
                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                {
                                                    this.enterVenue.map((ms) => {
                                                        return <li key={ms} onClick={(e)=> {this.setValueSelected(ms)}}
                                                                   className={(this.props.criteria.value.status === ms) ? 'selectedItem' : ''}>{ms}</li>
                                                    })
                                                }
                                            </Scrollbars>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="title_span" style={{width:"50px",float:"left",textAlign:"center"}}>
                                 <span style={{fontSize: "16px",fontWeight: "bold",lineHeight: "3em",display:"block"}}>
                                     {Currency}
                                 </span>

                            </div>

                            <div className="memberNumbe" style={{width:"51%"}}>
                                <div className="numberFields clearfix">
                                    <input  type="text" placeholder="amount" className="numeric" style={{width:100+'%'}} value={this.state.amount} onChange={(e) => {this.handleFromIputs(e)}}/>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

            </div>
        );
    }//..... end of render() .....//

}//..... end of AverageBasketValue.

export default AverageBasketValue;