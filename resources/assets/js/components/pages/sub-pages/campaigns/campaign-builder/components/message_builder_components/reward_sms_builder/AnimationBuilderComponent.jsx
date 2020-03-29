import React, {Component} from 'react';
import {selectMessageBuilderObject} from "../../../../../../../redux/selectors/Selectors";
import {connect} from "react-redux";
import {Scrollbars} from "react-custom-scrollbars";
import {
    addMessageBuilderValue,
    setPetPacksList, setIsCompetition
} from "../../../../../../../redux/actions/CampaignBuilderActions";
import {NotificationManager} from "react-notifications";

class AnimationBuilderComponent extends Component {
    customDropDownOneSpanRef = null;
    customDropDownShowOneRef = null;
    customDropDownBSpanRef   = null;
    customDropDownShowBRef   = null;

    handleDropDownOneSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowOneRef.style.display =  this.customDropDownShowOneRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownOneSpanClick() .....//

    handleDropDownBSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowBRef.style.display =  this.customDropDownShowBRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownBSpanClick() .....//

    loadPetPackAnimationList = () => {
        show_loader();
        axios.get(`${BaseUrl}/api/petpack-animation-dropdown-list`).
        then((response) => {
            show_loader(true);
            this.props.dispatch(setPetPacksList(response.data));
        }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while getting petPack animations list.", 'Error');
        });
    };//..... end of loadPetPackAnimationList() .....//

    setCharacter = (pp) => {
        this.customDropDownShowBRef.style.display = 'none';
        this.customDropDownBSpanRef.classList.remove('changeAero');

        let other = {...this.props.messageBuilder.other};
        other.content['character'] =  pp;
        other.content['competition'] =  null;
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, other: {...other}}}));
        this.props.dispatch(setIsCompetition(0))
    };//..... end of setCharacter() .....//

    componentDidMount() {
            this.loadPetPackAnimationList();
    }//..... end of componentDidMount() .....//

    render() {
        return (
            <div className="messageBuilder_outer ">
                <div className="messageBuilder_heading">
                    <h3>Animation</h3>
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
                                    <h3>Pet Pack Animation</h3>
                                </div>
                                <div className="stateSegmentation primary_voucher_setting">
                                    <div className="venueIdentification_section">
                                        <div className="venueIdentification_form">
                                            <div className={'customDropDown'}  >
                                                <span  ref={ref => this.customDropDownBSpanRef = ref} onClick={this.handleDropDownBSpanClick}> {this.props.messageBuilder.other.content.character ? this.props.messageBuilder.other.content.character.title : 'Select Character'}</span>
                                                <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowBRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none',zIndex: '3'}} >
                                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                        {
                                                            this.props.petPackList.map((pp) => {
                                                                return <li key={pp.id} onClick={(e)=> {this.setCharacter(pp)}} className={this.props.messageBuilder.other.content.character && pp.id === this.props.messageBuilder.other.content.character.id ? 'selectedItem' : ''}>{pp.title}</li>;
                                                            })
                                                        }
                                                    </Scrollbars>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
        petPackList     : state.campaignBuilder.petPackList
    };
};
export default connect(mapStateToProps)(AnimationBuilderComponent);