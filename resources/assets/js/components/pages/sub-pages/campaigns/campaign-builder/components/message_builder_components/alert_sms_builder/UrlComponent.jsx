import React, {Component} from 'react';
import { Droppable } from 'react-drag-and-drop';
import {connect} from "react-redux";
import {selectMessageBuilderObject} from "../../../../../../../redux/selectors/Selectors";
import {addMessageBuilderValue} from "../../../../../../../redux/actions/CampaignBuilderActions";

class UrlComponent extends Component {

    setMessage = (message) => {
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, message}}));
    };//..... end of setMessage() .....//
    setVenueName = (message) => {

        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, venue_name:message}}));
    };//..... end of setVenueName() .....//
    onDrop = (data) => {
        let message = this.props.messageBuilder.message;

        message += "|"+data.tags+"|";

        this.setMessage(message);
    };//..... end of onDrop() .....//

    setUrl = (url) => {
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, other: {...this.props.messageBuilder.other, url}}}));
    };//..... end of setUrl() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="smsDetail_column">
                <div className="segment_heading segmentaxn_heading">
                    <h3>PRIMARY MESSAGE</h3>
                </div>
                <div className="smsDetail_inner">
                    <div className="newSegment_form">
                        <ul>
                            <li>
                                <label>SENDER</label>
                                <div className="segmentInput">
                                    <input placeholder={this.props.messageBuilder.venue_name} value={this.props.messageBuilder.venue_name} onChange={(e)=> {this.setVenueName(e.target.value)}} type="text" />
                                </div>
                            </li>

                            <li>
                                <label>WEBSITE NAME</label>
                                <div className="segmentInput segmentARea ng-scope ui-droppable" tags-droppable="">
                                    <Droppable types={['tags']} onDrop={this.onDrop.bind(this)}>
                                        <textarea placeholder="Type Here" value={this.props.messageBuilder.message} onChange={(e)=> {this.setMessage(e.target.value)}}></textarea>
                                    </Droppable>
                                </div>
                            </li>
                            <li>
                                <label>WEBSITE URL</label>
                                <div className="segmentInput">
                                    <input placeholder="http://www.startpage.com" type="text" value={this.props.messageBuilder.other.url} onChange={(e)=> {this.setUrl(e.target.value)}}/>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of UrlComponent.

const mapStateToProps = (state) => {
    return {
        messageBuilder  : selectMessageBuilderObject(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        currentChannel  : state.campaignBuilder.currentChannel
    };
};
export default connect(mapStateToProps)(UrlComponent);