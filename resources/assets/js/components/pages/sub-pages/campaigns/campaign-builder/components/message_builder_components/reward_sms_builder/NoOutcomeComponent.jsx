import React, {Component} from 'react';
import {connect} from "react-redux";
import {addMessageBuilderValue} from "../../../../../../../redux/actions/CampaignBuilderActions";
import {
    selectMessage, selectMessageBuilderObject, selectTokens
} from "../../../../../../../redux/selectors/Selectors";

class NoOutcomeComponent extends Component {

    setMessage = (message) => {
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, message}}));
    };//..... end of setMessage() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//


    render() {
        return (
            <div className="messageBuilder_outer ">
                <div className="messageBuilder_heading">
                    <h3>No Outcome</h3>
                    <br/>
                    <p></p>
                </div>

            </div>
        );
    }//..... end of render() .....//
}//..... end of PointBuilderComponent.

const mapStateToProps = (state) => {
    return {
        messageBuilder  : selectMessageBuilderObject(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        currentChannel  : state.campaignBuilder.currentChannel,
        message         : selectMessage(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        tokens          : selectTokens(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
    };
};
export default connect(mapStateToProps)(NoOutcomeComponent);