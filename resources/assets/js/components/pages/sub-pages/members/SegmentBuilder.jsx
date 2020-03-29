import React, {Component} from 'react';
import NewSegment from "../campaigns/campaign-builder/components/segment_components/NewSegment";
import NewSegmentValidator from "../../../utils/NewSegmentValidator";
import SegmentBuilderSummary from "./segment_builder_components/SegmentBuilderSummary";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {addSegmentValue, clearSegment} from "../../../redux/actions/CampaignBuilderActions";

class SegmentBuilder extends Component {
    state = {
        step:1
    };

    newSegmentValidator = new NewSegmentValidator;

    validateSegmentData = () => {
        return this.newSegmentValidator.validate(this.props.segment.new_segment);
    };//..... end of validateSegmentData() .......//

    showSegmentSummary = () => {
        this.setState(() => ({step: 2}));
    };//..... end of showSegmentSummary() .....//

    clearSegment = () => {
        this.props.dispatch(clearSegment());
        this.setState(() => ({step: 1}));
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    componentDidMount = () => {
        this.props.dispatch(clearSegment());
        if (this.props.editSegmentId !== 0) {

            this.getAndPopulateSegmentEditData();
        }


    };//..... end of componentDidMount() .....//

    getAndPopulateSegmentEditData = () => {
        show_loader();
        axios.get(`${BaseUrl}/api/segment-detail/${this.props.editSegmentId}`)
            .then((response) => {
                show_loader(true);
                let segment = {
                    segments: [],
                        segment_users: {
                        excluded_users : response.data.excluded_user ? JSON.parse(response.data.excluded_user) : [],
                            included_users : response.data.included_user ? JSON.parse(response.data.included_user) : []
                    },
                    new_segment: {
                        name: response.data.name,
                            description: response.data.description,
                            criterias: JSON.parse(response.data.query_parameters)
                    }
                };

                this.props.dispatch(addSegmentValue(segment));
            }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while fetching Segment Details.", 'Error');
        });
    };//..... end of getAndPopulateSegmentEditData() .....//

    render() {
        const step = this.state.step;
        return (
            <div>
            {step === 1 ? (
                <div>
                    <div className={'compaign_segments'}>
                        <NewSegment />
                    </div>
                    <div className="continueCancel">
                        <input type="submit" value="CONTINUE" onClick={this.showSegmentSummary} className={(this.validateSegmentData()) ? 'selecCompaignBttn' : 'disabled selecCompaignBttn'}/>
                        <a  style={{cursor:'pointer'}} onClick={(e) => {this.props.setSegmentActiveTab('segmentList')}}>CANCEL</a>
                    </div>
                </div>
            ) : (
                <SegmentBuilderSummary {...this.props.segment} clearSegment={this.clearSegment} setSegmentActiveTab={this.props.setSegmentActiveTab} editSegmentId={this.props.editSegmentId}/>
            )}
            </div>
        );
    }//..... end of render() .....//
}//..... end of SegmentBuilder.

const mapStateToProps = (state) => {
    return {segment: state.campaignBuilder.segment,
        compaign:state.campaignBuilder
    };
};

export default connect(mapStateToProps)(SegmentBuilder);