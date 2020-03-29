import React, {Component}   from 'react';
import { Scrollbars }       from 'react-custom-scrollbars';
import {findIndex}          from 'lodash';
import {NotificationManager} from "react-notifications";

export default class TemplateSegment extends Component {
    constructor(props) {
        super(props);
        this.state = {segments: {}};
        this.selectSegment  = this.selectSegment.bind(this);
        this.selectAll      = this.selectAll.bind(this);
        this.clearAll       = this.clearAll.bind(this);
        this.setSegments    = this.setSegments.bind(this);
    }//..... end of constructor() .....//

    componentDidMount() {
        show_loader();
        axios.get(BaseUrl + '/api/segment-list').then((response) => {
            this.setState({segments: response.data});
            show_loader();
        }).catch((err) => {
            show_loader();
            NotificationManager.error('Could not load Segments List.', 'Error');
            console.error(err);
        });//..... end of axios call .....//
    }//..... end of componentDidMount() .....//

    selectSegment(key, value) {
        let segments = this.props.segment.segments;
        let obj = {id: key, name: value};

        if (findIndex(segments,obj) !== -1) {
            segments = segments.filter((seg) => {
                return seg.id !== obj.id;
            })
        } else {
            segments.push(obj);
        }//..... end of if-else() .....//

        this.setSegments(segments);
    }//..... end of selectSegment() .....//

    selectAll() {
        let segments = Object.keys(this.state.segments).map((key) => {
           return {id: key, name: this.state.segments[key]};
        });
        this.setSegments(segments);
    }//..... end of selectAll() .....//

    clearAll() {
        this.setSegments([]);
    }//..... end of clearAll() .....//

    /**
     * Set selected segments.
     * @param segments
     */
    setSegments(segments) {
        this.props.setSegmentValue('segments', segments);
    }//..... end of setSegments() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="segment_tYpe">
                <div className="segment_tYpe_heading">
                    <h3>SEGMENT TEMPLATES</h3>
                </div>
                <div className="segment_tYpe_detail">
                    <div className="selectDescription">
                        <p>Select one or more saved segments</p>
                    </div>
                    <div className="newSegment_form">
                        <ul>
                            <li>
                                <div className="compaignDescription_outer singleSegment_section  clearfix">
                                    <label>Segments</label>
                                    <div className="tagsCompaigns_detail clearfix">
                                        <div className="tagsCompaigns_list">
                                            <div className="tagsCompaigns_listScroll tagsScroll" style={{maxHeight: '205px'}}>
                                                <ul className="">
                                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                        {Object.keys(this.state.segments).map((key) => {
                                                            return <li key={key} onClick={(e)=>{ this.selectSegment(key, this.state.segments[key]) }}  className={(findIndex(this.props.segment.segments, ['id',key]) !== -1) ? 'selectedItem':''}>{this.state.segments[key]}</li>
                                                        }) }
                                                    </Scrollbars>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="tagsSelected_tip">
                                            <div className="selected_tip">
                                                <i>TIP</i>
                                                <p>Use the Control (Ctrl on Windows) or Command (⌘ on Mac)key to select or unselect items.</p>
                                                <button onClick={this.selectAll}>SELECT ALL</button>
                                                <button onClick={this.clearAll}>CLEAR ALL</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="selectedTags">
                                        <label>Selected</label>
                                        <div className="showTags clearfix">
                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                {this.props.segment.segments.map((seg, key)=>{
                                                    return <a  style={{cursor:'pointer'}} key={key} onClick={(e) => {this.selectSegment(seg.id, seg.name)}}>{seg.name}<i>&nbsp;</i></a>
                                                })}
                                            </Scrollbars>
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
}//..... end of TemplateSegment.