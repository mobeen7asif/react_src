import React, {Component} from 'react';
import { Droppable } from 'react-drag-and-drop';
import {connect} from "react-redux";
import {selectMessageBuilderObject, selectTempMessageBuilder} from "../../../../../../../redux/selectors/Selectors";
import {addMessageBuilderValue} from "../../../../../../../redux/actions/CampaignBuilderActions";

class TextComponent extends Component {
    state = {counter: 0};

    setMessage = (message) => {
        /*if(this.props.currentChannel ==='sms') {
            if (message.length > 144)
                return false;
        }*/

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

    componentDidMount = () => {
        this.setCounter(this.props.messageBuilder.message.length);
    };//..... end of componentDidMount() .....//

    componentDidUpdate = () => {
        this.setCounter(this.props.messageBuilder.message.length);
    };//..... end of componentDidMount() .....//

    setCounter = (counter) => {
        this.setState((prevState) => {
            if (prevState.counter !== counter)
                return {counter};
        })
    };//..... end of setCounter() .....//

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
                                    <input placeholder={this.props.messageBuilder.venue_name} value={this.props.messageBuilder.venue_name} onChange={(e)=> {this.setVenueName(e.target.value)}} type="text"/>
                                </div>
                            </li>

                            <li>
                                <label>MESSAGE</label>
                                <div className="segmentInput segmentARea">
                                    <Droppable types={['tags']} onDrop={this.onDrop.bind(this)}>
                                        <textarea placeholder="Type Here" value={this.props.messageBuilder.message} onChange={(e)=> {this.setMessage(e.target.value)}}></textarea>
                                    </Droppable>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="charector_counters clearfix">
                        <small>Characters</small>
                        {(
                            this.props.currentChannel ==='sms' &&
                            <h4><b style={{color: this.state.counter > 144 ? "#f70202" : "#003a5d"}}>{this.state.counter}</b>/144</h4>
                        )}

                    </div>
                </div>
                <div className="unsubcribeMsg">
                    <label>Unsubscribe message</label>
                    <p>To opt-out send STOP to XXXXXXXXXX</p>
                    <div className="charector_counters clearfix">
                        <small>Estimated Messages</small>
                        <h4 className="perMember">{ Math.ceil(this.state.counter/144)}/ <i>per <br/>member</i></h4>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of TextComponent.

const mapStateToProps = (state) => {
    return {
        messageBuilder      : selectMessageBuilderObject(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        currentChannel      : state.campaignBuilder.currentChannel,
        tmpMessageBuilder   : selectTempMessageBuilder(state.campaignBuilder.tmpMessageBuilder, state.campaignBuilder.currentChannel, state.campaignBuilder.messageBuilder)
    };
};
export default connect(mapStateToProps)(TextComponent);