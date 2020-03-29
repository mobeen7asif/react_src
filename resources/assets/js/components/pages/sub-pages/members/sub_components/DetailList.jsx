import React, {Component} from 'react';


class DetailList extends Component {
    state ={
        popupShow :false,
        segmentType:'',
        showPopupDetail:false
    };

    getSegmentData = (data,name) => {
        this.setState({segmentType:name,showPopupDetail:true});
        this.props.popupShow(name);
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="segmentList_showDetail" >
                <div className="segmentDetail_heading">
                    <h3>Segment Detail</h3>
                    <p> Segments in this list can be used for generating reports, campaigns and gaining insights into your business.</p>
                </div>
                <div className="segmentsOptions clearfix">
                    <ul>
                        <li>
                            <div className="segmentsOptions_detail">
                                    <span onClick={e => {this.getSegmentData(this.props.data,'segmentDemographic')}} className={(this.state.segmentType === 'segmentDemographic') ? 'choseSegmnt' : ''}>
                                        <b className="demographicIcon" >&nbsp;</b>
                                    </span>
                                <h3>Segment <br/>Demographics</h3>
                            </div>
                        </li>
                        <li>
                            <div className="segmentsOptions_detail">
                                <span onClick={e => {this.getSegmentData(this.props.data,'segmentMemberShip')}} className={(this.state.segmentType === 'segmentMemberShip') ? 'choseSegmnt' : ''}>
                                    <b className="memberShipIcon">&nbsp;</b>
                                </span>
                                <h3>Segment <br/>Membership</h3>
                            </div>
                        </li>
                        <li>
                            <div className="segmentsOptions_detail">
                                <span onClick={e => {this.getSegmentData(this.props.data,'segmentActivity')}} className={(this.state.segmentType === 'segmentActivity') ? 'choseSegmnt' : ''}>
                                    <b className="enter_machine">&nbsp;</b>
                                </span>
                                <h3>Segment Activity -<br/> Last 30 days</h3>
                            </div>
                        </li>
                        <li>
                            <div className="segmentsOptions_detail">
                                <span onClick={e => {this.getSegmentData(this.props.data,'segmentCommunication')}} className={(this.state.segmentType === 'segmentCommunication') ? 'choseSegmnt' : ''}>
                                    <b className="comunicationIcon">&nbsp;</b>
                                </span>
                                <h3>Available Communication<br/> Channels</h3>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of DetailList.

export default DetailList;