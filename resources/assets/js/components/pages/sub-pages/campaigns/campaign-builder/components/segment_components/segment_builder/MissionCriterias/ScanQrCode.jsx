import React, {Component} from 'react';

class ScanQrCode extends Component {
    state = {
        qr_code : '',
        interval: 5
    };

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('scan_qr_code', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        if (this.props.criteria.value){
            this.setState({qr_code:this.props.criteria.value.qr_code,interval:this.props.criteria.value.interval});
        }

    };//..... end of componentDidMount() .....//

    handleFromIputs = (e) => {

        this.setState({
            qr_code:  e.target.value,
        });

        let preVal = this.props.criteria.value;
         preVal.qr_code = e.target.value;
         preVal.interval = this.state.interval;
        this.setCriteriaValue(preVal);
    };

    handleInterval = (e) => {

        this.setState({
            interval:  e.target.value
        });

        let preVal = this.props.criteria.value;
        preVal.interval = e.target.value;
        this.setCriteriaValue(preVal);
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Scan QR Code</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('scan_qr_code')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Scan QR Code is</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumbe">
                                <div className="numberFields clearfix">
                                    <input  type="text" placeholder="Enter qr code here" style={{width:100+'%'}} value={this.state.qr_code} onChange={(e) => {this.handleFromIputs(e)}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Interval in Minutes</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumbe">
                                <div className="numberFields clearfix">
                                    <input  type="text" placeholder="Interval" style={{width:100+'%'}} value={this.state.interval} onChange={(e) => {this.handleInterval(e)}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//

}//..... end of MembershipNumber.

export default ScanQrCode;