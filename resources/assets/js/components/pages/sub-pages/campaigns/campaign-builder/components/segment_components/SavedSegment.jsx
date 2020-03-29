import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {findIndex, find} from "lodash";
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {
    addSavedSegment,
    addSavedSegmentListForCampaignBuilder
} from "../../../../../../redux/actions/CampaignBuilderActions";


class SavedSegment extends Component {

    componentDidMount = () => {
            this.loadSegments();
    };//..... end of componentDidMount() .....//

    loadSegments = () => {
        show_loader();
        axios.get(BaseUrl + `/api/segment-list/${CompanyID}/${VenueID}`).then((response) => {

            this.props.dispatch(addSavedSegmentListForCampaignBuilder(response.data));
            show_loader(true);
        }).catch((err) => {
            show_loader(true);
            NotificationManager.error('Could not load Segments List.', 'Error');
        });//..... end of axios call .....//
    };//..... end of loadSegments() .....//


    selectSegment = (key, value) => {
        let segments = this.props.segment.segments;
        axios.get(BaseUrl + `/api/getsegment-type/${CompanyID}/${key}`).then((response) => {
            let obj = {id: key, name: value,segment_type:response.data.type,criteria:response.data.query_parameters};

            if (findIndex(segments,obj) !== -1) {
                segments = segments.filter((seg) => {
                    return seg.id !== obj.id;
                })
            } else {
                segments.push(obj);
            }//..... end of if-else() .....//

            this.setSegments(segments);
        }).catch((err) => {

        });

    };//..... end of selectSegment() .....//

    selectAll = () => {
        let segments = Object.keys(this.props.savedSegmentsList).map((key) => {
            return {id: key, name: this.props.savedSegmentsList[key]};
        });
        this.setSegments(segments);
    };//..... end of selectAll() .....//

    clearAll = () => {
        this.setSegments([]);
    };//..... end of clearAll() .....//

    /**
     * Set selected segments.
     * @param segments
     */
    setSegments = (segments) => {

        this.props.dispatch(addSavedSegment({segments: segments}));

    };//..... end of setSegments() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="segment_tYpe">
                <div className="segment_tYpe_heading">
                    <h3>SAVED SEGMENT</h3>
                </div>
                <div className="segment_tYpe_detail">
                    <div className="selectDescription">
                        <p>Choose one or more pre-existing segments.</p>
                    </div>
                    <div className="newSegment_form">
                        <ul>
                            <li>
                                <div className="compaignDescription_outer adjustSave_segment  clearfix">
                                    <div className="tagsCompaigns_detail clearfix">
                                        <div className="tagsCompaigns_list">
                                            <small>Use the Control (on Windows) or Command (on Mac) key to select or deselect<br /> multiple segments.
                                                <img src={`${BaseUrl}/images/sync-icon.png`} alt="" style={{width: '17px', display: 'inline-block', marginTop: '-2px', cursor: 'progress'}} onClick={(e) => {this.loadSegments()}} title={'Refresh Segments list'}/>
                                            </small>
                                            <div className="tagsCompaigns_listScroll tagsScroll" style={{maxHeight: '205px'}}>
                                                <ul className="">
                                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                        {Object.keys(this.props.savedSegmentsList).map((key) => {
                                                            return <li key={key} onClick={(e)=>{ this.selectSegment(key, this.props.savedSegmentsList[key]) }}  className={(findIndex(this.props.segment.segments, ['id',key]) !== -1) ? 'selectedItem savedSegment':'savedSegment'}>{this.props.savedSegmentsList[key]}</li>
                                                        }) }
                                                    </Scrollbars>
                                                </ul>
                                            </div>
                                            <div className="selected_tip">
                                                <button onClick={this.selectAll}>SELECT ALL</button>
                                                <button onClick={this.clearAll}>CLEAR ALL</button>
                                            </div>
                                        </div>
                                        <div className="tagsSelected_tip">
                                            <div className="selectedTags">
                                                <label>Selected {this.props.segment.segments.length <= 0 && (<span style={{color:"red",marginLeft:"10px",fontSize:"small" }}> (Please select segment)</span>)}</label>
                                                <div className="showTags clearfix">
                                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                        {this.props.segment.segments.map((seg, key)=>{
                                                            return <a  style={{cursor:'pointer'}} key={key} onClick={(e) => {this.selectSegment(seg.id, seg.name)}}>{seg.name || this.props.savedSegmentsList[seg.id]}<i>&nbsp;</i></a>
                                                        })}
                                                    </Scrollbars>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of SavedSegment.

const mapStateToProps = (state) => {
    return {
        segment: state.campaignBuilder.segment,
        savedSegmentsList: state.campaignBuilder.savedSegmentsList
    };
};
export default connect(mapStateToProps)(SavedSegment);