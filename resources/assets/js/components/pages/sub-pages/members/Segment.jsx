import React, {Component} from 'react';
import SegmentList from "./SegmentList";
import SegmentBuilder from "./SegmentBuilder";

class Segment extends Component {

    state = {
        activeSegmentTab: 'segmentList',
        editSegmentId: 0
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    editSegment = (segmentId) => {
        this.setState(() => ({editSegmentId: segmentId}));
        this.setSegmentActiveTab('segmentBuilder');
    };//..... end of editSegment() .....//

    render() {
        return (
            <div className="autoContent">

                <div className="compaignHeadigs">
                    <h1>My Segments</h1>
                    <p>View, edit, add and manage your segments in the Segment List. Segments in this list can be used
                        for generating reports, campaigns and gaining insights into your business.</p>
                </div>

                <div className="compaigns_list_content">
                    <div className="compaigns_list_detail">
                        <div className="memberstabsBttns clearfix">
                            <ul>
                                <li><a  style={{cursor:'pointer'}} onClick={e => {
                                    this.setSegmentActiveTab('segmentList')
                                }} className={(this.state.activeSegmentTab !== 'segmentList') ? 'memberActive' : ''}>MY
                                    SEGMENTS</a>
                                </li>
                                {(appPermission("Segment List","add")) && (
                                    <li><a  style={{cursor:'pointer'}} onClick={e => {
                                        this.setSegmentActiveTab('segmentBuilder')
                                    }} className={(this.state.activeSegmentTab !== 'segmentBuilder') ? 'memberActive' : ''}>SEGMENT
                                        BUILDER</a>
                                    </li>
                                )}
                            </ul>
                        </div>
                        {this.state.activeSegmentTab === 'segmentList' ?
                            <SegmentList editSegment={this.editSegment}/> :
                            <SegmentBuilder  setSegmentActiveTab={this.setSegmentActiveTab} editSegmentId={this.state.editSegmentId}/>}
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//

    setSegmentActiveTab = (tab) => {
        if (this.state.activeSegmentTab === 'segmentBuilder' && tab !== 'segmentBuilder' && this.state.editSegmentId !== 0)
            this.setState(() => ({editSegmentId: 0}));

        this.setState({activeSegmentTab: tab});
    };//..... end of setSegmentActiveTab() .....//
}//..... end of Segment.

export default Segment;