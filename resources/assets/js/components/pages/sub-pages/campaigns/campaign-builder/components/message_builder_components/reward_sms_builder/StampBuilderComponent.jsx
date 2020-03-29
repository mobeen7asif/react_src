import React, {Component} from 'react';
import {selectMessageBuilderObject} from "../../../../../../../redux/selectors/Selectors";
import {connect} from "react-redux";
import {Scrollbars} from "react-custom-scrollbars";
import {
    addMessageBuilderValue, addSegmentValue, setBusinessList,
    setCompetitionsList, setIsCompetition, setPunchData
} from "../../../../../../../redux/actions/CampaignBuilderActions";
import {NotificationManager} from "react-notifications";
import MultiSelectReact from "multi-select-react";
import {find} from "lodash";
import ToggleSwitch from "@trendmicro/react-toggle-switch";
class StampBuilderComponent extends Component {

    customDropDownOneSpanRef = null;
    customDropDownShowOneRef = null;
    state={
        is_refferd_user:false,
        is_transaction: (this.props.messageBuilder.other.content.hasOwnProperty('is_transaction') && this.props.messageBuilder.other.content.is_transaction) ? true : false,
    }

    loadPunchCardList = () => {
        show_loader();
        axios.get(`${BaseUrl}/api/get-all-stampcard/${CompanyID}`).
        then((response) => {
            show_loader(true);

            this.props.dispatch(setPunchData(response.data.data.map(b => {
                if (this.props.messageBuilder.other.content.punch_card)
                    if (find(this.props.messageBuilder.other.content.punch_card, function (o) {
                        return o.id === b.id
                    }))
                        b.value = true;

                return b;
            })));

        }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while getting competitions list.", 'Error');
        });
    };//..... end of loadCompetitionList() .....//

    componentDidMount() {
        var found = false;
       if(this.props.mainState.campaignBuilder.segment.segments.length>0){

               this.props.mainState.campaignBuilder.segment.segments.forEach(item => {
                   if(item.hasOwnProperty('criteria')) {
                       found = JSON.parse(item.criteria).some(data => {
                           return data.name === 'referral_user';
                       });

                   }
               });

           if(found){
               this.setState(() => ({is_refferd_user: true}), () => {
                   this.setMessageValue('is_transaction',(this.state.is_transaction)?1:0);
               });

           }


       }
        this.loadPunchCardList();
    }//..... end of componentDidMount() .....//

    selectedStamp = (punch) => {
        this.setMessageValue('punch_card', punch.filter(b => b.value));
        this.props.dispatch(setIsCompetition(0));
    };//..... end of selectedStamp() .....//

    setSelectedStamp = (punch) => {
        this.setMessageValue('punch_card', punch.filter(b => b.value));
        this.props.dispatch(setIsCompetition(0));
    };//..... end of setSelectedStamp() .....//

    setMessageValue = (key, value) => {
        let other = {...this.props.messageBuilder.other};
        other.content[key] = value;
        this.props.dispatch(addMessageBuilderValue({
            [this.props.currentChannel]: {
                ...this.props.messageBuilder,
                other: {...other}
            }
        }));
    };//..... end of setMessageValue() .....//

    showHideDate = (e) =>{
        var value = 0;

        this.setState((prevState)=>({is_transaction:!prevState.is_transaction}),()=>{
            if(this.state.is_transaction){

                value = 1;
            }else{

                value = 0;
            }

            this.setMessageValue('is_transaction',value);
        });

    }

    render() {
            const selectedOptionsStyles = {
                color: "#3c763d",
                backgroundColor: "#dff0d8"
            };
            const optionsListStyles = {
                backgroundColor: "#fcf8e3",
                color: "#8a6d3b"
            };

            return (
            <div className="messageBuilder_outer ">
                <div className="messageBuilder_heading">
                    <h3>Stamp Card</h3>
                    <p>Reward Stamp Card</p>
                </div>
                <div className="pushNotification_section clearfix">
                    <div>
                        <div className="segment_heading segmentaxn_heading">
                            <h3>Select Stamp Cards</h3>
                        </div>
                        <div className="smsDetail_inner primary_voucher_setting">

                            <div className="dropSegmentation_section">
                                <div className="dropSegmentation_heading clearfix">
                                    <h3>Stamp Card</h3>
                                </div>
                                <div className="stateSegmentation primary_voucher_setting">
                                    <div className="venueIdentification_section">

                                        <MultiSelectReact
                                            options={this.props.punchCardData}
                                            optionClicked={this.selectedStamp}
                                            selectedBadgeClicked={this.setSelectedStamp}
                                            selectedOptionsStyles={selectedOptionsStyles}
                                            optionsListStyles={optionsListStyles}
                                          />
                                    </div>
                                </div>
                            </div>
                            { (!this.state.is_refferd_user && <div className="dropSegmentation_section">
                                <div className="dropSegmentation_heading clearfix">
                                    <h3>Punch Count</h3>
                                </div>
                                <div className="stateSegmentation primary_voucher_setting">
                                    <div className="venueIdentification_section">
                                        <div className="venueIdentification_form">
                                            <ul>
                                                <li className="voucherDesc">
                                                    <div className="segmentInput ">
                                                        <input type="text" style={{width: '100%'}}
                                                               onChange={(e) => {
                                                                   let value = e.target.value;
                                                                   if (value.match(/^\d*$/gm))
                                                                       this.setMessageValue('punch_count',e.target.value);
                                                               }}
                                                               value={this.props.messageBuilder.other.content.punch_count ? this.props.messageBuilder.other.content.punch_count : ''}/>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )}
                            {(this.state.is_refferd_user &&
                                <div className="dropSegmentation_section">
                                    <div className="dropSegmentation_heading clearfix">
                                        <h3>Punch Count</h3>
                                    </div>
                                    <div className="stateSegmentation primary_voucher_setting">
                                        <div className="venueIdentification_section">
                                            <div className="venueIdentification_form">
                                               <div style={{width:'40%',float:'right'}}>
                                                   <label htmlFor="">Punch count for Referee</label>
                                                   <div className="segmentInput ">
                                                       <input type="text" style={{width: '100%'}}
                                                              onChange={(e) => {
                                                                  let value = e.target.value;
                                                                  if (value.match(/^\d*$/gm))
                                                                      this.setMessageValue('punch_count',e.target.value);
                                                              }}
                                                              value={this.props.messageBuilder.other.content.punch_count ? this.props.messageBuilder.other.content.punch_count : ''}/>
                                                   </div>
                                               </div>
                                                <div style={{width:'40%'}}>
                                                    <label htmlFor="">Punch count for Referred</label>
                                                    <div className="segmentInput ">
                                                        <input type="text" style={{width: '100%'}}
                                                               onChange={(e) => {
                                                                   let value = e.target.value;
                                                                   if (value.match(/^\d*$/gm))
                                                                       this.setMessageValue('punch_count_referred',e.target.value);
                                                               }}
                                                               value={this.props.messageBuilder.other.content.punch_count_referred ? this.props.messageBuilder.other.content.punch_count_referred : ''}/>
                                                    </div>
                                                </div>
                                                <br/><br/>

                                                <div style={{width:'40%'}}>
                                                    <label htmlFor="">Only if transacted!</label>
                                                    <div className="segmentInput ">
                                                        <ToggleSwitch

                                                            checked={this.state.is_transaction ? this.state.is_transaction : false}
                                                            onChange={(e)=> {this.showHideDate(e)}}
                                                        />
                                                        <span style={{fontWeight:'bold'}}> {(this.state.is_transaction)  ? "YES" : "NO"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            )}

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
        punchCardData : state.campaignBuilder.punchCardListData,
        mainState : state,
    };
};
export default connect(mapStateToProps)(StampBuilderComponent);