import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import {clearSegment} from "../../../../redux/actions/CampaignBuilderActions";
import {connect} from "react-redux";

class SegmentBuilderOptions extends Component {
    state = {
        savingStatus: false
    };

    saveSegment = (isHidden) => {
        show_loader();
        axios.post(BaseUrl + '/api/save-segment',{
            new_segment   : this.props.new_segment,
            query         : this.props.query,
            excluded_users: this.props.excluded_users,
            included_users: this.props.included_users,
            segment_type: this.props.new_segment.segment_type,
            total_users   : this.props.total_users,
            isHidden      : isHidden,
            venue_id      : VenueID,
            company_id    : CompanyID,
            editSegmentId : this.props.editSegmentId
        }).then((response) => {
            show_loader(true);

            if (response.data.status === false) {
                NotificationManager.error("Internal Server error occurred.", 'Error');
                return false;
            }//..... end if() ......//

            NotificationManager.success(response.data.message, 'Success');
            this.props.dispatch(clearSegment());

            this.props.setSegmentActiveTab('segmentList')
        }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while saving segment", 'Error');
        });
    };//..... end of saveSegment() .....//

    exportSegment = () => {
        window.open(
            `${BaseUrl}/api/export-segment?esquery=${JSON.stringify(this.props.query)}
                &excluded_users=${JSON.stringify(this.props.excluded_users)}&company_id=${CompanyID}&venue_id=${VenueID}&segment_type=${this.props.new_segment.segment_type}`,
            '_blank'
        );
    };//..... end of export segment() ......//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <ul>
                <li>
                    <div className="segmentsOptions_detail">
                        <span className={(this.state.savingStatus) ? 'disabled' : ''}>
                            <b  style={{cursor:'pointer'}} onClick={this.props.clearSegment}>&nbsp;</b>
                        </span>
                        <h3>Clear Segment</h3>
                    </div>
                </li>
                {appPermission("Export Segment","view") && (
                <li>
                    <div className="segmentsOptions_detail">
                        <span className={(this.state.savingStatus) ? 'disabled' : ''}>
                            <b style={{cursor:'pointer'}} className="exportSegment" onClick={this.exportSegment}>&nbsp;</b>
                        </span>
                        <h3>Export Segment</h3>
                    </div>
                </li>
                )}
                <li>
                    <div className="segmentsOptions_detail">
                        <span className={(this.state.savingStatus) ? 'disabled' : ''}>
                            <b style={{cursor:'pointer'}} className="saveSegment" onClick={() => {this.saveSegment(1)}}>&nbsp;</b>
                        </span>
                        <h3>Save Segment</h3>
                    </div>
                </li>
            </ul>
        );
    }//..... end of render() .....//
}//..... end of SegmentBuilderOptions.

const mapStateToProps = (state) => {
    return {
        new_segment:    state.campaignBuilder.segment.new_segment,
        query:          state.campaignBuilder.segment.segment_users.query,
        excluded_users: state.campaignBuilder.segment.segment_users.excluded_users,
        included_users: state.campaignBuilder.segment.segment_users.included_users,
        total_users:    state.campaignBuilder.segment.segment_users.total_users,
        segment_type:    state.campaignBuilder.segment.segment_type,
    };
};

export default connect(mapStateToProps)(SegmentBuilderOptions);