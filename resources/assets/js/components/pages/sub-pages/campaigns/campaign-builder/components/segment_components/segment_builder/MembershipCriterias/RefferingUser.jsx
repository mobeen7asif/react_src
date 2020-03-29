import React, {Component} from 'react';
import {Scrollbars} from "react-custom-scrollbars";

class RefferingUser extends Component {
    enterVenue = ['Equal','Less than or equal', 'More than or equal'];
    state = {
        count_users: "",
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
        this.props.setCriteriaValue('reffering_users', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        if (this.props.criteria.value.count_users)
            this.setState({count_users:this.props.criteria.value.count_users});
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

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Total referred users</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('reffering_users')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>



                <div className="stateSegmentation" style={{paddingTop:"0px"}}>
                    <div className="compaignDescription_outer clearfix">
                        <label>Number of people referred by user</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder">
                                <div className="placeHolderOuter clearfix">
                                    <div className="customDropDown">
                                        <span ref={ref => this.customDropDownSpanRef = ref} onClick={this.handleDropDownSpanClick}>{this.props.criteria.value.status ? this.props.criteria.value.status : 'Select Status'} </span>
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

                            <div className="memberNumbe">
                                <div className="numberFields clearfix">
                                    <input  type="text" placeholder="Users" className="numeric" style={{width:100+'%'}} value={this.state.count_users} onChange={(e) => {this.handleFromIputs(e)}}/>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>







            </div>
        );
    }//..... end of render() .....//

}//..... end of Referring user.

export default RefferingUser;