import React, {Component} from 'react';
import {connect} from "react-redux";

class QuickOverview extends Component {

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    getSegmentName = () => {
        let name = this.props.segments.map((seg) => seg.name).join(', ');
        return this.props.type === 'saved' ? name : (this.props.name ? this.props.name : '');
    };//..... end of getSegmentName() .....//

    render() {
        return (
            <div className="quickPreview">
                <div className="segment_tYpe_heading">
                    <h3>QUICK OVERVIEW</h3>
                </div>

                <div className="quickPreview_detail adjustquickPreview clearfix">
                    <div className="nameSegment">
                        <strong>{this.getSegmentName()}</strong>
                        <p>Segment Name</p>
                    </div>
                    <div className="segmentSize clearfix">
                        <div className="segmentSize_icon">
                            <img src="assets/images/segmentSize_icon@2x.png" alt="#"/>
                        </div>
                        <div className="segmentSize_text">
                            <strong>{this.props.total_users ? this.props.total_users : 0}</strong>
                            <small>Segment Size</small>
                        </div>
                    </div>
                    <div className="addedSegmentd">
                        <p>You have added </p>
                        <strong>{this.props.type === "saved" ? this.props.segments.length : 1}</strong>
                        <p>segments to your campaign</p>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of QuickOverview.

const mapStateToProps = (state) => {
    return {
        total_users: state.campaignBuilder.segment.segment_users.total_users,
        name:        state.campaignBuilder.segment.new_segment.name,
        type:        state.campaignBuilder.segment.type,
        segments:    state.campaignBuilder.segment.segments,
    };
};

export default connect(mapStateToProps)(QuickOverview);