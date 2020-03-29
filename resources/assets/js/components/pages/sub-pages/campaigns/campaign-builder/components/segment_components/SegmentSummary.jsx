import React, {Component} from 'react';
import QuickOverview from "./segment_summary/QuickOverview";
import DemographicSummary from "./segment_summary/DemographicSummary";
import SegmentMembers from "./segment_summary/SegmentMembers";
import SegmentOptions from "./segment_summary/SegmentOptions";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {setSegmentUsers,addSegmentValue} from "../../../../../../redux/actions/CampaignBuilderActions";
import PostCode from "./segment_builder/DemographicCriterias/PostCode";

class SegmentSummary extends Component {

    componentDidMount = () => {
        show_loader();

        let criteria = this.props.segment.new_segment.criterias;




        if(!appPermission("ViewUsersFromOtherPostcode","view") && this.props.segment.new_segment.criterias != undefined){
            if(criteria[0].hasOwnProperty("postcode")) {
                StoreName = "";
                criteria[0].postcode = UserPostCode;
            }
            else {
                UserPostCode = 0;
                criteria[0].store_name = StoreName;
            }
            //criteria[0].store_name = StoreName;
        }

/*        if(!appPermission("ViewUsersFromOtherPostcode","view") && criteria[0].hasOwnProperty("postcode")){
            StoreName = "";
            criteria[0].postcode = UserPostCode;
        }else{
            UserPostCode = 0;
            criteria[0].store_name = StoreName;
        }*/


        axios.post(BaseUrl + '/api/build-segment-query', {
            segment         : criteria,//this.props.segment.new_segment.criterias,
            type            :    this.props.segment.type,
            selectedSegments: this.props.segment.segments,
            segment_type:   this.props.segment.new_segment.segment_type,
            company_id      : CompanyID,
            venue_id        : VenueID
        }).then((response) => {
                show_loader(true);
                this.setSegments(response.data);
            }).catch((err) => {
                show_loader(true);
                NotificationManager.error("Error occurred while getting segment details.", 'Error');
        });

        if(this.props.compaign.campaign.selectedCampaign  === "Gamification"){
            var segmentIds = [];
            this.props.compaign.segment.segments.forEach(item=>{
                if(!segmentIds.some(data=>{return data == item.id})){
                    segmentIds.push(item.id);
                }
            });
            axios.post(BaseUrl + '/api/get-all-segments', {
                segment         : JSON.stringify(segmentIds),
            }).then((response) => {
                let segment = {
                    segments: response.data.data,

                };

                this.props.dispatch(addSegmentValue(segment));
            }).catch((err) => {
                //show_loader(true);
                //NotificationManager.error("Error occurred while getting segment details.", 'Error');
            });
        }
    };//..... End of componentWillMount() .....//

    setSegments = (segments) => {
        this.props.dispatch(setSegmentUsers(segments))
    };//..... end of setSegments() .....//

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

                        <QuickOverview segment={this.props.segment}/>

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

                    <SegmentOptions {...this.props}/>

                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of SegmentSummary.

const mapStateToProps = (state) => {
    return {
        segment: state.campaignBuilder.segment,
        currentTab: state.campaignBuilder.selectedTab,
        segment_type: state.campaignBuilder.segment.segment_type,
        compaign: state.campaignBuilder,
    };
};

export default connect(mapStateToProps)(SegmentSummary);