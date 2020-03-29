import React, {Component} from 'react';
import TemplatesComponent from "./alert_email_builder/TemplatesComponent";
import TemplateBuilderComponent from "./alert_email_builder/TemplateBuilderComponent";
import {connect} from "react-redux";
import {selectMessageBuilderObject} from "../../../../../../redux/selectors/Selectors";
import {setEmailBuilderType} from "../../../../../../redux/actions/CampaignBuilderActions";
import VoucherBuilderComponent from "./reward_sms_builder/VoucherBuilderComponent";
import IntegratedVoucherBuilderComponent from "./reward_sms_builder/IntegratedVoucherBuilderComponent";

class AlertEmailBuilder extends Component {

    setEmailType = (type) => {
        this.props.dispatch(setEmailBuilderType(type))
    };//..... end of setEmailType() .....//

    componentDidMount() {
        if (this.props.messageBuilder.type === '')
            this.setEmailType('template');
    }//.... end of componentDidMount() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <React.Fragment>
                <div className="chooseMessageType">
                    <label>Choose your Message type for users.</label>
                    <div className="chooseMessageType_icons">
                        <div className="segmentsOptions clearfix">
                            <ul>
                                <li>
                                    <div className="segmentsOptions_detail">
                                        <span
                                            className={this.props.messageBuilder.type === 'template' ? 'choseSegmnt' : ''}>
                                            <b className="useTemplate" onClick={(e) => {
                                                this.setEmailType('template');
                                            }}>&nbsp;</b>
                                        </span>
                                        <h3>Use a template</h3>
                                    </div>
                                </li>

                                <li>
                                    <div className="segmentsOptions_detail">
                                        <span
                                            className={this.props.messageBuilder.type === 'voucher' ? 'choseSegmnt' : ""}>
                                            <b className="voucher_icon" onClick={(e) => {
                                                this.setEmailType('voucher')
                                            }}>&nbsp;</b>
                                        </span>
                                        <h3>Voucher</h3>
                                    </div>
                                </li>


                                {/*<li>
                                    <div className="segmentsOptions_detail">
                                        <span className={ this.props.messageBuilder.type === 'new_template' ? 'choseSegmnt' : ''}>
                                            <b className="creatDesign" onClick={(e) => {this.setEmailType('new_template');}}>&nbsp;</b>
                                        </span>
                                        <h3>Create a design</h3>
                                    </div>
                                </li>*/}
                            </ul>
                        </div>
                    </div>
                </div>

                {this.getComponent()}
            </React.Fragment>
        );
    }//..... end of render() .....//

    getComponent = () => {
        switch (this.props.messageBuilder.type) {
            case 'template':
                return <TemplatesComponent/>;
            case 'new_template':
                return <TemplateBuilderComponent/>;
            case 'voucher':
                return <VoucherBuilderComponent/>
            case 'integrated-voucher':
                return <IntegratedVoucherBuilderComponent/>
            default:
                return 'Not Found !';
        }//.... end of switch() .....//
    };//..... end of getComponent() .....//
}//..... end of AlertEmailBuilder.

const mapStateToProps = (state) => {
    return {
        messageBuilder: selectMessageBuilderObject(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        currentChannel: state.campaignBuilder.currentChannel,
        triggerType: state.campaignBuilder.trigger_type,
    };
};
export default connect(mapStateToProps)(AlertEmailBuilder);