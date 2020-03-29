import React, {Component} from 'react';
import VoucherBuilderComponent from "./reward_sms_builder/VoucherBuilderComponent";
import PointBuilderComponent from "./reward_sms_builder/PointBuilderComponent";
import {connect} from "react-redux";
import {setRewardSmsBuilderType, setVoucherData} from "../../../../../../redux/actions/CampaignBuilderActions";
import {selectMessageBuilderObject} from "../../../../../../redux/selectors/Selectors";
import IntegratedVoucherBuilderComponent from "./reward_sms_builder/IntegratedVoucherBuilderComponent";
import TokenBuilderComponent from "./reward_sms_builder/TokenBuilderComponent";
import CompetitionBuilderComponent from "./reward_sms_builder/CompetitionBuilderComponent";
import AnimationBuilderComponent from "./reward_sms_builder/AnimationBuilderComponent";
import NoOutcomeComponent from "./reward_sms_builder/NoOutcomeComponent";
import StampBuilderComponent from "./reward_sms_builder/StampBuilderComponent";

class RewardSmsBuilder extends Component {
    componentDidMount = () => {

    };//.... end of componentDidMount() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    setBuilderType = (type) => {
        this.props.dispatch(setRewardSmsBuilderType(this.props.currentChannel, type));
    };

    componentWillUnmount = () =>{

       /* let userData = localStorage.getItem('userData');
        if (userData) {
            userData = JSON.parse(userData);
            if (userData.venue_id){

                INTEGRATED  = userData.is_integrated

            }
        }
        if(parseInt(INTEGRATED) ==0)
            this.setBuilderType('voucher');
        else
            this.setBuilderType('integrated-voucher');*/

    }


    render() {
        return (
            <React.Fragment>
                <div className="chooseMessageType">
                    <label>Choose your Message type for users.</label>
                    <div className="chooseMessageType_icons">
                        <div className="segmentsOptions clearfix">
                            <ul>
                                {(appPermission("OutcomeVoucher","view")) &&(
                                    <li>
                                        <div className="segmentsOptions_detail">
                                        <span className={this.props.messageBuilder.type === 'voucher' ? 'choseSegmnt' : ""}>
                                            <b className="voucher_icon" onClick={(e)=> {this.setBuilderType('voucher')}}>&nbsp;</b>
                                        </span>
                                            <h3>Voucher</h3>
                                        </div>
                                    </li>
                                )}
                       {/*       {(parseInt(INTEGRATED) ==1 && appPermission("OutcomeIntegratedVoucher","view")) &&(
                                <li>
                                    <div className="segmentsOptions_detail">
                                        <span className={this.props.messageBuilder.type === 'integrated-voucher' ? 'choseSegmnt' : ""}>
                                            <b className="voucher_icon" onClick={(e)=> {this.setBuilderType('integrated-voucher')}}>&nbsp;</b>
                                        </span>
                                        <h3>Integrated Voucher</h3>
                                    </div>
                                </li>
                                )}*/}

                                {(this.props.campaign.selectedCampaign !== "Virtual Voucher"  && appPermission("OutcomePoints","view")) && (
                                    <li>
                                        <div className="segmentsOptions_detail">
                                        <span className={this.props.messageBuilder.type === 'point' ? 'choseSegmnt' : ""}>
                                            <b className="point_icon" onClick={(e)=> {this.setBuilderType('point')}}>&nbsp;</b>
                                        </span>
                                            <h3>Points</h3>
                                        </div>
                                    </li>
                                )}

                                {((this.props.gameMissionTypeToCreate === 'mission-outcome' || this.props.gameMissionTypeToCreate === 'game' || this.props.gameMissionTypeToCreate === 'game-mission' || this.props.gameMissionTypeToCreate === 'game-outcome') && appPermission("OutcomeTokens","view")) && <li>
                                    <div className="segmentsOptions_detail">
                                        <span className={this.props.messageBuilder.type === 'token' ? 'choseSegmnt' : ""}>
                                            <b className="point_icon" onClick={(e)=> {this.setBuilderType('token')}}>&nbsp;</b>
                                        </span>
                                        <h3>Tokens</h3>
                                    </div>
                                </li>}

                                {((this.props.gameMissionTypeToCreate === 'game' || this.props.gameMissionTypeToCreate === 'game-outcome' || this.props.gameMissionTypeToCreate === 'mission-outcome' || this.props.gameMissionTypeToCreate === 'game-mission') && appPermission("OutcomeCompetition","view") ) && <li>
                                    <div className="segmentsOptions_detail">
                                        <span className={this.props.messageBuilder.type === 'competition' ? 'choseSegmnt' : ""}>
                                            <b className="point_icon" onClick={(e)=> {this.setBuilderType('competition')}}>&nbsp;</b>
                                        </span>
                                        <h3>Competition</h3>
                                    </div>
                                </li>}

                                {((this.props.gameMissionTypeToCreate === 'mission-outcome' || this.props.gameMissionTypeToCreate === 'game-mission') && appPermission("OutcomeAnimation","view")) && <li>
                                    <div className="segmentsOptions_detail">
                                        <span className={this.props.messageBuilder.type === 'animation' ? 'choseSegmnt' : ""}>
                                            <b className="point_icon" onClick={(e)=> {this.setBuilderType('animation')}}>&nbsp;</b>
                                        </span>
                                        <h3>Animation</h3>
                                    </div>
                                </li>}

                                {((this.props.gameMissionTypeToCreate === 'game' || this.props.gameMissionTypeToCreate === 'game-outcome') && appPermission("OutcomeNoOutcome","view")) && <li>
                                    <div className="segmentsOptions_detail">
                                        <span className={this.props.messageBuilder.type === 'nooutcome' ? 'choseSegmnt' : ""}>
                                            <b className="point_icon" onClick={(e)=> {this.setBuilderType('nooutcome')}}>&nbsp;</b>
                                        </span>
                                        <h3>No Outcome</h3>
                                    </div>
                                </li>}
                      {/*          <li>
                                    <div className="segmentsOptions_detail">
                                        <span className={this.props.messageBuilder.type === 'stamp-card' ? 'choseSegmnt' : ""}>
                                            <b className="point_icon" onClick={(e)=> {this.setBuilderType('stamp-card')}}>&nbsp;</b>
                                        </span>
                                        <h3>Stamp Card</h3>
                                    </div>
                                </li>*/}
                                {((this.props.gameMissionTypeToCreate === 'mission-outcome' || this.props.gameMissionTypeToCreate === 'game-mission') && appPermission("OutcomeAnimation","view")) && <li>
                                    <div className="segmentsOptions_detail">
                                        <span className={this.props.messageBuilder.type === 'stamp-card' ? 'choseSegmnt' : ""}>
                                            <b className="point_icon" onClick={(e)=> {this.setBuilderType('stamp-card')}}>&nbsp;</b>
                                        </span>
                                        <h3>Stamp Card</h3>
                                    </div>
                                </li>}

                            </ul>
                        </div>
                    </div>
                </div>

                { this.getComponent() }
            </React.Fragment>
        );
    }//..... end of render() .....//

    getComponent() {
        switch (this.props.messageBuilder.type) {
            case 'voucher':
                return <VoucherBuilderComponent/>;
            case 'integrated-voucher':
                return <IntegratedVoucherBuilderComponent/>;
            case 'point':
                return <PointBuilderComponent />;
            case 'token':
                return <TokenBuilderComponent />;
            case 'competition':
                return <CompetitionBuilderComponent />;
            case 'animation':
                return <AnimationBuilderComponent />;
            case 'nooutcome':
                return <NoOutcomeComponent/>;
            case 'stamp-card':
                return <StampBuilderComponent/>
            default:
                return 'Type Not Recognized.';
        }//..... end of switch() .....//
    }//..... end of getComponent() .....//
}//..... end of RewardSmsBuilder.

const mapStateToProps = (state) => {
    return {
        messageBuilder  : selectMessageBuilderObject(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        currentChannel  : state.campaignBuilder.currentChannel,
        gameMissionTypeToCreate: state.campaignBuilder.gameMissionTypeToCreate,
        campaign:   state.campaignBuilder.campaign
    };
};
export default connect(mapStateToProps)(RewardSmsBuilder);