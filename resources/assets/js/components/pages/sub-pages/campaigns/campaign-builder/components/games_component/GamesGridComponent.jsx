import React, {Component} from 'react';
import {connect} from "react-redux";
import {
    addGameForEditing,
    addMissionForEditing,
    setDeleteMission,
    setGameData,
    setGameForAddingMission,
    setGameForAddingMoreOutCome,
    setGameForEditingOutCome,
    setGameMissionCreatingType,
    setMissionForAddingOutcome,
    setMissionForDuplication,
    setMissionForEditingOutcome,
    setSelectedTabs,
    setTriggerType
} from "../../../../../../redux/actions/CampaignBuilderActions";
import {NotificationManager} from "react-notifications";
import GameChannelType from "../channel_target_components/GameChannelType";
import {populateGameData} from "../../../../../../utils/FinalizeAndSaveCampaign";
import HeaderComponent from "../../../../dashboard/sub_components/HeaderComponent";

class GamesGridComponent extends Component {
    currentTab  = this.props.currentTab;
    state = {
        headerList:[{"id": "1", "name": 'Name', 'filterName': ''}, {"id": "2", "name": 'Action Type', 'filterName': ''},
            {"id": "3", "name": 'Edit', 'filterName': ''}],
        showHeader:false,
        outComeDetails:[],
        selectedGame: 0,
        missionOutComeDetails: [],
        selected_mission:0
    };

    headerList = [
        {"id": "1", "name": 'Title',       'filterName': 'title'},
        {"id": "2", "name": 'Start Date',  'filterName': 'start_date'},
        {"id": "3", "name": 'End Date',    'filterName': 'end_date'},
        {"id": "4", "name": 'Outcomes',    'filterName': 'Outcomes'}
    ];
    icons = { wifi: 'wifiIcon_white@2x.png', push: 'ap_white@2x.png', sms: 'smsIcon_white@2x.png', email: 'em_white@2x.png',
        survey: 'sr-1_white@2x.png', video_ad: 'vid_white@2x.png', web: 'wb_white@2x.png' };
    handleButtonsShow = (e) => {
        let li = e.target.closest('li');
        if (li.classList.contains('active_editMod')) {
            li.classList.remove('active_editMod');
            li.querySelector('div.cl_rowEdit_popOut').style.setProperty('right', '-22%');
        } else {
            Array.prototype.slice.call(e.target.closest('ul').querySelectorAll('li'))
                .map((ele) => ele.classList.remove('active_editMod'));
            li.classList.add('active_editMod');
            li.querySelector('div.cl_rowEdit_popOut').style.setProperty('right', '0%');
        }//..... end if-else() .....//
    };//..... end of handleButtonsShow() .....//

    addGameOutcome = (game) => {
        this.props.dispatch(setGameForAddingMoreOutCome(game));
    };//..... end of addGameOutcome() .....//

    editGameOutcome = (key,outcome1) => {
        let outcome = this.props.gamesList[this.state.selectedGame].outcomes[key];
        let game = this.props.gamesList[this.state.selectedGame];
        this.props.dispatch(setGameForEditingOutCome(game,key));
    };//..... end of editGameOutcome() .....//


    editMissionOutcome = (selected_outcome,value) => {
        console.log(selected_outcome);
        let game = this.props.gamesList[this.state.selectedGame];
        let mission = this.props.gamesList[this.state.selectedGame].missions[this.state.selected_mission];
        this.props.dispatch(setMissionForEditingOutcome(game,mission,selected_outcome,this.state.selected_mission,this.state.selectedGame));
    };

    addGameMission = (game) => {
        this.props.dispatch(setGameForAddingMission(game));
    };//..... end of addGameOutcome() ......//


    deleteMission = (game, mission) => {
        let missions = game.missions.filter((mi) => mi !== mission);
        game.missions = missions;
        this.props.dispatch(setDeleteMission(game));
    };//..... end of deleteMission() .....//

    addMissionOutcome = (game, mission) => {

        this.props.dispatch(setMissionForAddingOutcome(game, mission));
    };

    duplicateMission = (game, mission) => {
        this.props.dispatch(setMissionForDuplication(game, mission))
    };

    validateGamesAndMission = () => {
        if (this.props.gamesList.length <= 0){
            NotificationManager.error("Please add at least one game to save.", 'Error');
            return false;
        }//..... end if() .....//

        let error = false;

        this.props.gamesList.forEach(function(game) {
            if (game.missions.length <= 0){
                NotificationManager.error("Please add at least one mission against each game to save.", 'Error');
                error = true;
                return false;
            } //..... end if() .....//
        });

        if (! error) {
            this.props.saveCampaign();
        }//..... end if() .....//
    };//..... end of validateGamesAndMission() .....//

    outComesDetails1 = (index,item) => {
        let outComeDetails = [];

        this.props.gamesList[index].outcomes.map((value,key) => {
           let action_value = value.action_value;
           if(typeof(value.action_value) == "string")
               action_value = JSON.parse(value.action_value);
              action_value.map((value2,key2)=>{
                  outComeDetails.push({action_type:value.action_type,name:value2.name,type:value2.type,message:value2.value.message});
              });
        });
        this.setState(()=>({outComeDetails:outComeDetails,selectedGame:index }),()=>{

        });
        document.getElementById("outComesPopup").style.display = "block";
    };

    outComesDetails = (index,item) => {
        let outComeDetails = [];

        this.props.gamesList[index].outcomes.map((value,key) => {
            let action_value = value.action_value;
            if(typeof(value.action_value) == "string")
                action_value = JSON.parse(value.action_value);
            outComeDetails.push({action_type:value.action_type});

        });
        this.setState(()=>({outComeDetails:outComeDetails,selectedGame:index }),()=>{

        });
        document.getElementById("outComesPopup").style.display = "block";
    };

    missionOutComesDetails = (game_index,mission_index) => {
        let outComeDetails = [];
        this.props.gamesList[game_index].missions[mission_index].outcomes.map((value,key) => {
            let action_value = value.action_value;
            if(typeof(value.action_value) == "string")
                action_value = JSON.parse(value.action_value);
            outComeDetails.push({action_type:value.action_type});

        });
        this.setState(()=>({missionOutComeDetails:outComeDetails,selectedGame: game_index,selected_mission: mission_index}),()=>{

        });
        document.getElementById("missionOutComesPopup").style.display = "block";
    };

    closePopup = () => {
        document.getElementById("outComesPopup").style.display = "none";
    };
    closeMissionPopup = () => {
        document.getElementById("missionOutComesPopup").style.display = "none";
    };

    editGame = (game) => {
        this.props.dispatch(addGameForEditing(game, 'game', 2));
    };

    editMission = (game, mission) => {
            console.log(mission);
        this.props.dispatch(addMissionForEditing(game, mission, 'game-mission', 2))
    };

    componentDidMount() {
        $('.cl_rowEdit_popOut').css('right', '-22%');
    }
    render() {
            return (
                <div>
                    <div className="compaign_segments">
                        <div className="segment_tYpe">
                            <div className="segment_tYpe_heading">
                                <h3>Create Games and Missions</h3>
                            </div>
                            <div className="segment_tYpe_detail">
                                <div className="selectDescription">
                                    <p>Create Game(s) and At least one or multiple Mission(s) against each Game(s) and then finalize it and save.</p>
                                </div>
                                <div className="cL_listing_tableOut memberTable">
                                    <div className="compaign_addNew clearfix">
                                        <h3>Game(s) List</h3>
                                        {!this.props.campaignDeleted &&
                                            <a className="all_blue_button" onClick={() => this.props.dispatch(setGameMissionCreatingType('game'))}>Add Game</a>
                                        }
                                    </div>
                                    <div className="cL_listing_tableInn segmentTable_cells_setting">

                                        <div className="cL_listing_tableTitle">
                                            <div className="cL_listing_table_row">
                                                {this.headerList && this.headerList.map((item, index) =>
                                                        <div key={item.id+"__"+index} className={'cL_listing_table_cell cell' + item.id}>
                                                            <strong>
                                                <span>
                                                    <b onClick={() => false} className={''}>
                                                        <img src={'assets/images/sortAerrow_top.png'} alt="#"/>
                                                    </b>
                                                    <b onClick={() => false} className={''}>
                                                        <img src={'assets/images/sortAerrow_bottom.png'} alt="#"/>
                                                    </b>
                                                </span>
                                                                {item.name}
                                                            </strong>
                                                        </div>
                                                )}
                                            </div>
                                        </div>

                                        <ul className={'grid--body'}>
                                            {this.props.gamesList.map(( item, index ) =>
                                                <li key={item.id+"_"+index}>
                                                    <div className="listDataShowing">
                                                        <div className="cL_listing_table_row">

                                                            <div className='cL_listing_table_cell  cell1'>
                                                                <span className="cL_rowList_number">{item.title}</span>
                                                            </div>

                                                            <div className='cL_listing_table_cell  cell2'>
                                                                <span className="cL_rowList_number">{item.start_date}</span>
                                                            </div>
                                                            <div className='cL_listing_table_cell  cell3'>
                                                                <span className="cL_rowList_number">{item.end_date}</span>
                                                            </div>

                                                            <div className="clEditDotes_cell cell5">
                                                                <span className="cL_rowList_number"><a  style={{cursor:'pointer'}} onClick={()=>{this.outComesDetails(index,item)}}>{item.outcomes.length}</a></span>

                                                                <a className="cl_tableRow_editDotes"  style={{cursor:'pointer'}} tabIndex={'-1'} onClick={this.handleButtonsShow}><i>&nbsp;</i></a>
                                                            </div>

                                                        </div>

                                                        <div className="cl_rowEdit_popOut" style={{width:'22%'}}>
                                                            <div className="cl_rowEdit_pop_table">
                                                                <div className="cl_rowEdit_popOut_tableRow">
                                                                    {!this.props.campaignDeleted &&
                                                                    <div
                                                                        className="cl_rowEdit_popOut_tableRow_cell eidtCell1">
                                                                        <a className={"duplicateIcon"}
                                                                            style={{cursor:'pointer'}}
                                                                           onClick={() => this.addGameOutcome(item)}>
                                                                            <strong><i>&nbsp;</i>+ Outcomes</strong>
                                                                        </a>
                                                                    </div>
                                                                    }
                                                                    <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1">
                                                                        <a className={"edit_icon"}  style={{cursor:'pointer'}} onClick={() => this.editGame(item)}>
                                                                            <strong><i>&nbsp;</i>{(!this.props.campaignDeleted)?'Edit':'View'}</strong>
                                                                        </a>
                                                                    </div>
                                                                    {!this.props.campaignDeleted &&
                                                                    <div
                                                                        className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                                        <a className="scheduleIcon"
                                                                            style={{cursor:'pointer'}}
                                                                           onClick={() => this.addGameMission(item)}>
                                                                            <strong><i>&nbsp;</i>+ Missions</strong>
                                                                        </a>
                                                                    </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/************************** Sub table*********************************/}
                                                    <ul>
                                                        <li>
                                                            <div className="cL_listing_tableTitle">
                                                                <div className="cL_listing_table_row">
                                                                    <div
                                                                        className="cL_listing_table_cell cell1 tieritemCell  ">
                                                                        <strong> <span>&nbsp;</span>Mission Title </strong>
                                                                    </div>
                                                                    {(this.state.showHeader && <div className="cL_listing_table_cell cell1 ">
                                                                        <strong> <span>&nbsp;</span>Start Date </strong>
                                                                    </div>)}
                                                                    {(this.state.showHeader &&<div className="cL_listing_table_cell cell1  ">
                                                                        <strong> <span>&nbsp;</span>End Date </strong>
                                                                    </div>)}
                                                                    <div className="cL_listing_table_cell cell2  ">
                                                                        <strong> <span>&nbsp;</span>Outcomes</strong>
                                                                    </div>
                                                                    <div className="cL_listing_table_cell cell7 ">
                                                                        <strong className=""><span>&nbsp;</span>Actions</strong>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <ul>
                                                                {item.missions.map((mission, mission_index) => (
                                                                    <li key={mission.title} style={{height: '43px'}}>
                                                                        <div className="listDataShowing">
                                                                            <div className="cL_listing_table_row">
                                                                                <div className="cL_listing_table_cell cell1  tieritemCell">
                                                                                    <span className="cL_rowList_number ">{mission.title}</span>
                                                                                </div>
                                                                                <div className="cL_listing_table_cell cell1  ">
                                                                                    <span className="cL_rowList_number ">{mission.from_date}</span>
                                                                                </div>
                                                                                <div className="cL_listing_table_cell cell1  ">
                                                                                    <span className="cL_rowList_number ">{mission.end_date}</span>
                                                                                </div>
                                                                                <div className="cL_listing_table_cell cell1  ">
                                                                                    <span className="cL_rowList_number" style={{textAlign: 'center'}}><a  style={{cursor:'pointer'}} onClick={()=>{this.missionOutComesDetails(index, mission_index)}}>{mission.outcomes.length}</a></span>
                                                                                </div>
                                                                                <div className="cl_rowEdit_popOut1" style={{width:'20%'}}>
                                                                                    <div className="cl_rowEdit_pop_table">
                                                                                        <div className="cl_rowEdit_popOut_tableRow">
                                                                                            {!this.props.campaignDeleted &&
                                                                                            <div
                                                                                                className="cl_rowEdit_popOut_tableRow_cell eidtCell1">
                                                                                                <a className="scheduleIcon"
                                                                                                    style={{cursor:'pointer'}}
                                                                                                   title={'Add Outcome'}
                                                                                                   onClick={() => this.addMissionOutcome(item, mission)}>
                                                                                                    <strong><i>&nbsp;</i>+
                                                                                                        Outcomes</strong>
                                                                                                </a>
                                                                                            </div>
                                                                                            }
                                                                                            <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1">
                                                                                                <a className="edit_icon"  style={{cursor:'pointer'}} title={'Add Outcome'} onClick={() => this.editMission(item, mission)}>
                                                                                                    <strong><i>&nbsp;</i>{(!this.props.campaignDeleted)?'Edit':'View'}</strong>
                                                                                                </a>
                                                                                            </div>
                                                                                            {!this.props.campaignDeleted &&
                                                                                            <div
                                                                                                className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                                                                <a className="duplicateIcon"
                                                                                                    style={{cursor:'pointer'}}
                                                                                                   title={'Duplicate This Mission'}
                                                                                                   onClick={() => this.duplicateMission(item, mission)}>
                                                                                                    <strong><i>&nbsp;</i>Duplicate</strong>
                                                                                                </a>
                                                                                            </div>
                                                                                            }

                                                                                            {/*<div className="cl_rowEdit_popOut_tableRow_cell eidtCell3">
                                                                                            <a className="delete_icon"  style={{cursor:'pointer'}} onClick={() => this.deleteMission(item, mission)} title={'Delete Mission'}>
                                                                                                <strong><i>&nbsp;</i>Delete</strong>
                                                                                            </a>
                                                                                        </div>*/}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                    {/************************** End of Sub table*********************************/}
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="continueCancel">
                            {!this.props.campaignDeleted &&
                        <input type="submit" id={'dynamicCampaignContinueBtn'} value="Finalize and Save"
                               onClick={(e) => {
                                   {
                                       this.validateGamesAndMission()
                                   }
                               }} className={'selecCompaignBttn'}/>
                        }
                        <a href="#">CANCEL</a>
                    </div>


                    <div className= "popups_outer outComesPopup" id="outComesPopup" style={{display:'none'}}>
                        <div className="popups_inner">
                            <div className="overley_popup" data-attr="addNewUser_popup" onClick={()=>{this.props.handleShowAddEditModal(false)}}>&nbsp;</div>
                            <div className="popupDiv2">
                                <div className="popupDiv_detail">
                                    <div className="popup_heading clearfix">
                                        <h3>List OutComes</h3>
                                        <a  style={{cursor:'pointer'}} onClick={()=>{this.closePopup()}} className="popupClose close_popup">&nbsp;</a>
                                    </div>
                                    <div className="beacon_popupDeatail"> <br /><br />
                                        <div className="add_categoryList_info2">
                                            <div className="categoryInfo_container cms_nes_setting clearfix">
                                                <div className="">
                                                    <div className="cL_listing_tableInn memberTable_cells_setting memberTable_cells_settingFixes">
                                                        <div className="cL_listing_tableTitle">
                                                            <div className="cL_listing_table_row">
                                                                {this.state.headerList.map(item =>
                                                                        <div key={item.id} className={'cL_listing_table_cell cell' + item.id}>
                                                                            <strong>
                                                                                {item.name}
                                                                            </strong>
                                                                        </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <ul>
                                                            {
                                                                this.state.outComeDetails.map((value,key) =>
                                                                        <li key={key}>
                                                                            <div className="cL_listing_table_row">
                                                                                <div className="cL_listing_table_cell cell1">
                                                                                    <span className="cL_rowList_number">
                                                                                        {'Outcome '+(key+1)}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="cL_listing_table_cell cell2">
                                                                                    <span className="cL_rowList_number">
                                                                                        {value.action_type}
                                                                                        </span>
                                                                                </div>
                                                                                <div className="cL_listing_table_cell cell3">
                                                                                    <a className="edit_icon" onClick={() => this.editGameOutcome(key,value)}
                                                                                        style={{cursor:'pointer'}}
                                                                                       title="Edit Outcome"><strong><i>&nbsp;</i>Edit</strong></a>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                )
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="continueCancel place_beacon createUserButtons">

                                            <a  style={{cursor:'pointer'}} className="close_popup" onClick={()=>{this.closePopup()}} >CANCEL</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/************************** Mission Outcome details popup*********************************/}

                    <div className= "popups_outer outComesPopup" id="missionOutComesPopup" style={{display:'none'}}>
                        <div className="popups_inner">
                            <div className="overley_popup" data-attr="addNewUser_popup" onClick={()=>{this.props.handleShowAddEditModal(false)}}>&nbsp;</div>
                            <div className="popupDiv2">
                                <div className="popupDiv_detail">
                                    <div className="popup_heading clearfix">
                                        <h3>List OutComes</h3>
                                        <a  style={{cursor:'pointer'}} onClick={()=>{this.closeMissionPopup()}} className="popupClose close_popup">&nbsp;</a>
                                    </div>
                                    <div className="beacon_popupDeatail"> <br /><br />
                                        <div className="add_categoryList_info2">
                                            <div className="categoryInfo_container cms_nes_setting clearfix">

                                                <div className="">
                                                    <div className="cL_listing_tableInn memberTable_cells_setting memberTable_cells_settingFixes">
                                                        <div className="cL_listing_tableTitle">
                                                            <div className="cL_listing_table_row">
                                                                {this.state.headerList.map(item =>
                                                                    <div key={item.id} className={'cL_listing_table_cell cell' + item.id}>
                                                                        <strong>
                                                                            {item.name}
                                                                        </strong>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <ul>
                                                            {
                                                                this.state.missionOutComeDetails.map((value,key)=>
                                                                    <li key={key}>
                                                                        <div className="cL_listing_table_row">
                                                                            <div className="cL_listing_table_cell cell1">
                                                                                    <span className="cL_rowList_number">
                                                                                        {'Outcome '+(key+1)}
                                                                                    </span>
                                                                            </div>
                                                                            <div className="cL_listing_table_cell cell2">
                                                                                    <span className="cL_rowList_number">
                                                                                        {value.action_type}
                                                                                        </span>
                                                                            </div>
                                                                            <div className="cL_listing_table_cell cell3">
                                                                                <a className="edit_icon" onClick={() => this.editMissionOutcome(key,value)}
                                                                                    style={{cursor:'pointer'}}
                                                                                   title="Edit Outcome"><strong><i>&nbsp;</i>Edit</strong></a>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            }
                                                        </ul>
                                                    </div>


                                                </div>
                                            </div>
                                        </div>
                                        <div className="continueCancel place_beacon createUserButtons">

                                            <a  style={{cursor:'pointer'}} className="close_popup" onClick={()=>{this.closeMissionPopup()}} >CANCEL</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            );
    }//..... end of render() .....//
}//..... end of GamesGridComponent.

const mapStateToProps = (state) => {
    return {
        currentTab: state.campaignBuilder.selectedTab,
        gamesList: state.campaignBuilder.games,
        campaignBuilder:    state.campaignBuilder,
        campaignDeleted:    state.campaignBuilder.campaignDeleted
    };
};
export default connect(mapStateToProps)(GamesGridComponent);