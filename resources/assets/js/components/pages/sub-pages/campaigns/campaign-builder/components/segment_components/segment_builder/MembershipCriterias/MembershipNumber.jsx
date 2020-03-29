import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

class MembershipNumber extends Component {
    customDropDownSpanRef = null;
    customDropDownShowRef = null;
    memberNumber = ['More Than', 'Less Than', 'Equal To', 'Not Equal To', 'Between'];
    state = {
        from: '',
        to: ''
    };

    setValueSelected = (value) => {
        let preVal = this.props.criteria.value;
        preVal.memberNumber = value;
        this.setCriteriaValue(preVal);

        this.customDropDownShowRef.style.display = 'none';
        this.customDropDownSpanRef.classList.remove('changeAero');
    };//..... end of setValueSelected() .....//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('membership_number', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        if (this.props.criteria.value.from)
            this.setState({from:this.props.criteria.value.from});

        if (this.props.criteria.value.to)
            this.setState({to:this.props.criteria.value.to});
    };//..... end of componentDidMount() .....//

    handleFromMemberIputs = (e) => {

            this.setState({
                from:  parseInt(e.target.value)
            });

            let preVal = this.props.criteria.value;
            preVal.from = parseInt(e.target.value);
            this.setCriteriaValue(preVal);
    };

    handleToMemberIputs = (e, i) => {
        this.setState({
                to:  parseInt(e.target.value)
            });

            let preVal = this.props.criteria.value;
            preVal.to = parseInt(e.target.value);
            this.setCriteriaValue(preVal);

    };//..... end of handleToIputs() ......//

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
                    <h3>Membership Number</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('membership_number')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Member Number is</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder">
                                <div className="placeHolderOuter clearfix">
                                    <div className="customDropDown">
                                        <span ref={ref => this.customDropDownSpanRef = ref} onClick={this.handleDropDownSpanClick}>{this.props.criteria.value.memberNumber ? this.props.criteria.value.memberNumber : 'Membership Number is'} </span>
                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                {
                                                    this.memberNumber.map((ms) => {
                                                        return <li key={ms} onClick={(e)=> {this.setValueSelected(ms)}}
                                                                   className={(this.props.criteria.value.memberNumber === ms) ? 'selectedItem' : ''}>{ms}</li>
                                                    })
                                                }
                                            </Scrollbars>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="memberNumbe">
                                <div className="numberFields clearfix">
                                    <input  type="text" placeholder="Enter here" className="numeric" style={{width:100+'%'}} value={this.state.from} onChange={(e) => {
                                        let value = e.target.value;
                                        if (value.match(/^\d*$/gm))
                                        this.handleFromMemberIputs(e)
                                    }}/>
                                </div>
                                <div className="number_to" style={{display: (this.props.criteria.value.memberNumber === 'Between' ? 'block' : 'none')}}>
                                    <label>to</label>
                                </div>
                                <div className="numberFields clearfix" style={{display: (this.props.criteria.value.memberNumber === 'Between' ? 'block' : 'none')}}>
                                    <input  type="text" placeholder="Enter here" className="numeric" style={{width:100+'%'}} value={this.state.to} onChange={(e) => {
                                        let value = e.target.value;
                                        if (value.match(/^\d*$/gm))
                                        this.handleToMemberIputs(e)
                                    }}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//

}//..... end of MembershipNumber.

export default MembershipNumber;