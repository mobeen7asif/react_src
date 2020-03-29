import React, {Component} from 'react';
import NewSegment from "./segment_components/NewSegment";
import SavedSegment from "./segment_components/SavedSegment";
import TemplateSegment from "./segment_components/TemplateSegment";
import NewSegmentValidator from "../../../../../utils/NewSegmentValidator";
import {connect} from "react-redux";
import {setGameMissionCreatingType, setSegmentType} from "../../../../../redux/actions/CampaignBuilderActions";

class SegmentTypes extends Component {
    currentTab = this.props.currentTab;
    newSegmentValidator = new NewSegmentValidator;

    validateSegmentData = () => {
        return ((this.props.segment.type === 'saved' || this.props.segment.type === 'template') && this.props.segment.segments.length > 0) ? true :
            ((this.props.segment.type === 'new') ? this.newSegmentValidator.validate(this.props.segment.new_segment) : false);
    };//..... end of validateSegmentData() .......//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div>
                <div className={'compaign_segments'}>
                    <div className="segment_tYpe">
                        <div className="segment_tYpe_heading">
                            <h3>SEGMENT TYPE</h3>
                        </div>
                        <div className="segment_tYpe_detail">
                            <div className="selectDescription">
                                <p>You can select one or more saved segments, or create a new segment for your campaign.</p>
                            </div>
                            <div className="segment_tYpe_columns">
                                <ul>

                                    {
                                        [
                                           /* { className: 'iconSegment',      title: 'Segment Templates', type: 'template' },*/
                                            { className: 'iconSegmentNew',   title: 'New Segment',       type: 'new'      },
                                            { className: 'iconSegmentSave',  title: 'Saved Segments',    type: 'saved'    }
                                        ].map(segmentType => {
                                          return <SegmentTypeList key={segmentType.title} dispatch={this.props.dispatch} segment={this.props.segment} CName={segmentType.className}  title={segmentType.title} type={segmentType.type}/>
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                    {
                        this.getComponent()
                    }
                </div>
                <div className="continueCancel">
                    <input type="submit" value="CONTINUE" onClick={(e) => {
                        this.props.setCurrentTab(++this.currentTab)
                    }} className={(this.validateSegmentData()) ? 'selecCompaignBttn' : 'disabled selecCompaignBttn'}/>
                    <a href="#" onClick={(e) => {
                        if (this.props.selectedCampaign === 'Gamification') {
                            e.preventDefault();
                            this.props.dispatch(setGameMissionCreatingType(''));
                        }
                    }
                    }>CANCEL</a>
                </div>
            </div>
        );
    }//..... end of render() .....//

    /**
     * Get Appropriate Component.
     * @returns {*}
     */
    getComponent() {
        switch (this.props.segment.type){
            case 'new':
                return <NewSegment />;
            case 'saved':
                return <SavedSegment />;
            case 'template':
                return <TemplateSegment segment={this.props.segment}  setSegmentValue={this.props.setSegmentValue}/>;
            default:
                return '';
        }//..... end of switch() .....//
    }//..... end of getComponent() .....//
}//..... end of SegmentTypes.

/**
 * Sub-component for listing segment types.
 * @param props
 * @returns {*}
 * @constructor
 */
function SegmentTypeList(props) {
    return (
        <li>
            <div className="compaignType_detail">
                <span className={props.segment.type === props.type ? 'selecCompaign' : ''}>
                    <b className={props.CName} onClick={(e)=> { props.dispatch(setSegmentType({type: props.type, segments: [], segment_users: {}, new_segment: {}})) }}>&nbsp;</b>
                </span>
                <h3>{props.title}</h3>
            </div>
        </li>
    );
}//..... end of SegmentTypeList() .....//

const mapStateToProps = (state) => {
    return {
        segment: state.campaignBuilder.segment,
        currentTab: state.campaignBuilder.selectedTab,
        selectedCampaign: state.campaignBuilder.campaign.selectedCampaign
    };
};

export default connect(mapStateToProps)(SegmentTypes);