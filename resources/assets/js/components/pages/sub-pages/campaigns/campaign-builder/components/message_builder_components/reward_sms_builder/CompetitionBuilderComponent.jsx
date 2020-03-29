import React, {Component} from 'react';
import {selectMessageBuilderObject} from "../../../../../../../redux/selectors/Selectors";
import {connect} from "react-redux";
import {Scrollbars} from "react-custom-scrollbars";
import {
    addMessageBuilderValue,
    setCompetitionsList, setIsCompetition
} from "../../../../../../../redux/actions/CampaignBuilderActions";
import {NotificationManager} from "react-notifications";

class CompetitionBuilderComponent extends Component {
    customDropDownOneSpanRef = null;
    customDropDownShowOneRef = null;

    setMessageValue = (key, value) => {
        if (key === 'entry_interval' || key === "max_entry") {
            if (isFinite(value)) {
                value = Math.ceil(value);
            } else {
                return false;
            }
        }//..... end if() .....//

        let other = {...this.props.messageBuilder.other};
        other.content[key] =  value;
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, other: {...other}}}));
    };//..... end of setMessageValue() .....//

    handleDropDownOneSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowOneRef.style.display =  this.customDropDownShowOneRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownOneSpanClick() .....//

    setCompetition = (cmpt) => {
        this.customDropDownShowOneRef.style.display = 'none';
        this.customDropDownOneSpanRef.classList.remove('changeAero');
        let other = {...this.props.messageBuilder.other};
        other.content['competition'] =  cmpt;
        other.content['character'] =  null;
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, other: {...other}}}));
        this.props.dispatch(setIsCompetition(1));
    };

    loadCompetitionList = () => {
        show_loader();
        axios.get(`${BaseUrl}/api/competitions-dropdown-list?venue_id=${VenueID}`).
        then((response) => {
            show_loader(true);
            this.props.dispatch(setCompetitionsList(response.data));
        }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while getting competitions list.", 'Error');
        });
    };//..... end of loadCompetitionList() .....//

    componentDidMount() {
        if (! this.props.messageBuilder.other.content.entry_interval)
            this.setMessageValue('entry_interval', (this.props.gameMissionTypeToCreate === 'game' || this.props.gameMissionTypeToCreate === 'game-outcome') ? 24 : 0);
        this.loadCompetitionList();
    }//..... end of componentDidMount() .....//

    render() {
        return (
            <div className="messageBuilder_outer ">
                <div className="messageBuilder_heading">
                    <h3>Competition</h3>
                    <p>Specify competition reward for your campaign and the period which it can be redeemed.</p>
                </div>
                <div className="pushNotification_section clearfix">
                    <div>
                        <div className="segment_heading segmentaxn_heading">
                            <h3>Select Reward</h3>
                        </div>
                        <div className="smsDetail_inner primary_voucher_setting">

                            <div className="dropSegmentation_section">
                                <div className="dropSegmentation_heading clearfix">
                                    <h3>Entry Into Competition</h3>
                                </div>
                                <div className="stateSegmentation primary_voucher_setting">
                                    <div className="venueIdentification_section">
                                        <div className="customDropDown">
                                            <span  ref={ref => this.customDropDownOneSpanRef = ref} onClick={this.handleDropDownOneSpanClick}> {this.props.messageBuilder.other.content.competition ? this.props.messageBuilder.other.content.competition.title : 'Select competition'}</span>
                                            <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowOneRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                                <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                    {this.props.competitionList.map((cmpt) => {
                                                        return (
                                                            <li key={'cmpt-'+cmpt.id} onClick={(e)=> {this.setCompetition(cmpt)}} className={this.props.messageBuilder.other.content.competition && this.props.messageBuilder.other.content.competition.id === cmpt.id ? "selectedItem" : ''}>{ cmpt.title }</li>
                                                        );
                                                    })}
                                                </Scrollbars>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {(this.props.gameMissionTypeToCreate === 'game' || this.props.gameMissionTypeToCreate === 'game-outcome') &&
                            <div>
                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Re-Entry Interval (Hours)</h3>
                                    </div>
                                    <div className="stateSegmentation primary_voucher_setting">
                                        <div className="venueIdentification_section">
                                            <div className="venueIdentification_form">
                                                <ul>
                                                    <li>
                                                        <div className="customInput_div">
                                                            <input placeholder="Interval in hours..." type="text" onChange={(e)=>{this.setMessageValue('entry_interval', e.target.value)}} value={this.props.messageBuilder.other.content.entry_interval ? this.props.messageBuilder.other.content.entry_interval : ''}/>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of CompetitionBuilderComponent.

const mapStateToProps = (state) => {
    return {
        messageBuilder  : selectMessageBuilderObject(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        currentChannel  : state.campaignBuilder.currentChannel,
        gameMissionTypeToCreate: state.campaignBuilder.gameMissionTypeToCreate,
        competitionList : state.campaignBuilder.competitionList,
    };
};
export default connect(mapStateToProps)(CompetitionBuilderComponent);