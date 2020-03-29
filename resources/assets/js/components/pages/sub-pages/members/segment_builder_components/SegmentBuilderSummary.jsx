import React, {Component} from 'react';
import SegmentBuilderOptions from "./SegmentBuilderOptions";
import QuickOverview from "../../campaigns/campaign-builder/components/segment_components/segment_summary/QuickOverview";
import DemographicSummary from "../../campaigns/campaign-builder/components/segment_components/segment_summary/DemographicSummary";
import SegmentMembers from "../../campaigns/campaign-builder/components/segment_components/segment_summary/SegmentMembers";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {setSegmentUsers} from "../../../../redux/actions/CampaignBuilderActions";

class SegmentBuilderSummary extends Component {

    componentWillMount = () => {
        let criteria = this.props.criterias;
        if(!appPermission("ViewUsersFromOtherPostcode","view")){
            criteria[0].postcode = UserPostCode;
        }
        show_loader();
        axios.post(BaseUrl + '/api/build-segment-query', {
            segment:        this.props.criterias,
            excluded_users: this.props.excluded_users,
            segment_type  : this.props.segment_type,
            venue_id:       VenueID,
            company_id:     CompanyID
        }).then((response) => {
            show_loader(true);
            this.props.dispatch(setSegmentUsers(response.data));
        }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Internal server error occurred", 'Error');
        });

    };//..... End of componentWillMount() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//



    render() {
        return (
            <div className="cL_listing_tableOut">
                <div className="segmentSummeryOuter">
                    <div className="segment_tYpe_heading">
                        <h3>Segment Summary</h3>
                    </div>
                    <div className="segmentSummery_detail">

                        <QuickOverview />

                        <DemographicSummary />

                    </div>
                </div>

                <div className="modifySegments">
                    <div className="segment_tYpe_heading">
                        <h3>Modify Segment Members</h3>
                    </div>

                    <SegmentMembers />

                </div>

                <div className="segmentsOptions clearfix">

                    <SegmentBuilderOptions {...this.props}/>

                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of SegmentBuilderSummary.

const mapStateToProps = (state) => {
    return {
        excluded_users: state.campaignBuilder.segment.segment_users.excluded_users,
        criterias: state.campaignBuilder.segment.new_segment.criterias,
        compaign: state.campaignBuilder,
        segment_type: state.campaignBuilder.segment.new_segment.segment_type,
    };
};

export default connect(mapStateToProps)(SegmentBuilderSummary);