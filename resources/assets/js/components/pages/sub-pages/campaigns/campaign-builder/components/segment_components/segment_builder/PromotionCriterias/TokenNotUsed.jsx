import React, {Component} from 'react';

class TokenNotUsed extends Component {
    state = {
        hours: "",
    };

    setValueSelected = (value) => {
        let preVal = this.props.criteria.value;
        preVal.memberNumber = value;
        this.setCriteriaValue(preVal);
    };//..... end of setValueSelected() .....//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('token_not_used', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        if (this.props.criteria.value.hours)
            this.setState({hours:this.props.criteria.value.hours});
    };//..... end of componentDidMount() .....//

    handleFromIputs = (e) => {
        this.setState({
            hours:  e.target.value
        });
        let preVal = this.props.criteria.value;
        preVal.hours = e.target.value;
        this.setCriteriaValue(preVal);
    };



    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Token Not Used</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('token_not_used')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Token not used within</label>
                        <div className="memberNumberOuter clearfix">

                            <div className="memberNumbe">
                                <div className="numberFields clearfix">
                                    <input  type="text" placeholder="Hours" className="numeric" style={{width:100+'%'}} value={this.state.hours} onChange={(e) => {this.handleFromIputs(e)}}/>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//

}//..... end of VoucherExpiry.

export default TokenNotUsed;