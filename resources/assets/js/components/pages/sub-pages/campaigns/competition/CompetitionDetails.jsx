import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import ReactHtmlParser from "react-html-parser";
import WinnersList from "./WinnersList";

class CompetitionDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            charactersList : [],
            is_big_draw: 0,
            selectedDraw: {},
            winners: 1
        };
    }//..... end of constructor() .....//

    headerList =  [
        {"id": "1", "name": 'Title',        'filterName': 'title'},
        {"id": "2", "name": 'Prize ($)',      'filterName': 'prize'},
        {"id": "3", "name": 'Start Date',  'filterName': 'start_date'},
        {"id": "4", "name": 'End Date',  'filterName': 'end_date'},
        {"id": "5", "name": 'Executed',      'filterName': 'is_executed_c'},
        {"id": "5", "name": 'Entries',      'filterName': 'entries'},
        {"id": "5", "name": 'Winner(s)',      'filterName': 'winners'},
    ];

    executeTheDraw = (type) => {
        show_loader();
        axios.post(`${BaseUrl}/api/execute-draw`, {
            type,
            mission_id: this.props.mission.id,
            character_id: this.state.selectedDraw.id,
            winners: this.state.winners
        }).then((response) => {
            show_loader(true);
            NotificationManager.success(response.data.message, 'Success');
            this.loadMissionCharacters();
            this.setState(() => ({selectedDraw: {}}));
            if (type == "mission")
                this.props.loadCompetitions();
        }).catch((e) => {
            show_loader(true);
            NotificationManager.error("Error occurred while executing draw.", 'Error');
        });
    };//...... end of save() ......//

    componentDidMount() {
        this.loadMissionCharacters();
    }//..... end of componentDidMount() .....//

    loadMissionCharacters = () => {
        show_loader();
        axios.post(BaseUrl + `/api/list-mission-characters`, {
            mission_id: this.props.mission.id
        }).then(res => {
            this.setState(() => ({ charactersList: res.data.data, is_big_draw: res.data.is_big_draw }));
            show_loader(true);
        }).catch((err) => {
            NotificationManager.error("Error occurred while fetching characters.", 'Error');
            show_loader(true);
        });
    };//..... end of loadMissionCharacters() .....//

    setWinners = (e) => {
        let value = e.target.value;
        if (isFinite(value))
            this.setState(() => ({winners: value}));
    };//..... end of setWinners() ......//

    executeSmallDraw = () => {
        if (this.state.winners < 1) {
            NotificationManager.error("Please enter no of winner(s) to declare.", 'Error');
            return false;
        }//..... end if() ......//

        this.executeTheDraw('draw');
    };//..... end of executeSmallDraw() .....//

    executeBigDraw = () => {
        if (this.state.winners < 1) {
            NotificationManager.error("Please enter no of winner(s) to declare.", 'Error');
            return false;
        }//..... end if() ......//

        this.executeTheDraw('mission');
    };//..... end of executeBigDraw() .....//

    render() {
        return (
            <div className="popups_outer addCategory_popup" style={{display:"block"}}>
                <div className="popups_inner">
                    <div className="overley_popup close_popup" onClick={(e)=>{this.props.handleCloseMissionDetailsWindow()}}>&nbsp;</div>
                    <div className="popupDiv">
                        <div className="contentDetail" style={{padding: '30px 25px'}}>
                            <div className="autoContent">
                                <div className="compaigns_list_content">
                                    <div className="add_categoryList_info2">
                                        <div className="newVualt_heading">
                                            <h3>Mission Details {this.props.mission.is_executed == 1 ? ": All draws are executed.": ''}</h3>
                                        </div>
                                        <div className="categoryInfo_container clearfix">
                                            <div className="addCategoryRight_section" style={{width: '100%'}}>
                                                <div className=" portalNew_page">

                                                    {this.props.mission.is_executed == 1 && <WinnersList type={'big'}  mission_id={this.props.mission.id} title={this.props.mission.title}/>}

                                                    {this.props.mission.is_executed == 0 && <div className="dropSegmentation_section">
                                                        <div className="dropSegmentation_heading clearfix">
                                                            <h3>Select and Execute The Draw</h3>
                                                        </div>
                                                        <div className="stateSegmentation primary_voucher_setting" style={{minHeight: '100px'}}>
                                                            <div className="datePickerOuter clearfix" style={{float: 'left', width: '50%'}}>
                                                                <div className="datePickerLeft" style={{width: '90%'}}>
                                                                    <strong>Selected Draw</strong>
                                                                    <div className="customInput_div">
                                                                        <input placeholder="Please click on character to select..." type="text" readOnly defaultValue={this.state.is_big_draw == 1 ? this.props.mission.title :this.state.selectedDraw.title}/>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="datePickerOuter clearfix" style={{float: 'left', width: '50%'}}>
                                                                <div className="datePickerLeft" style={{width: '90%'}}>
                                                                    <strong>Enter No of Winners</strong>
                                                                    <div className="customInput_div">
                                                                        <input placeholder="Enter no of winner..." type="text" value={this.state.winners} onChange={this.setWinners}/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>}
                                                    <div className="continueCancel  listShops" style={{paddingBottom: '13px'}}>
                                                        {this.state.is_big_draw == 0 && this.state.selectedDraw.isReadyToDraw == 1 &&
                                                        <a  style={{cursor:'pointer'}} onClick={this.executeSmallDraw}>Execute Draw</a>
                                                        }
                                                        {
                                                            this.state.is_big_draw == 1 && this.props.mission.is_executed == 0 &&
                                                            <a  style={{cursor:'pointer'}} onClick={this.executeBigDraw}>Execute Big Draw</a>
                                                        }
                                                    </div>

                                                    <div className="dropSegmentation_section" style={{marginTop: '35px'}}>
                                                        <div className="dropSegmentation_heading clearfix">
                                                            <h3>Small Draws of mission : <span style={{fontWeight: 'bold'}}>{ this.props.mission.title}</span></h3>
                                                        </div>
                                                        <div className="stateSegmentation primary_voucher_setting" style={{minHeight: '100px'}}>
                                                            <div className="cL_listing_tableInn segmentTable_cells_setting">
                                                                <div className="cL_listing_tableInn segmentTable_cells_setting">
                                                                    <div className="cL_listing_tableTitle">
                                                                        <div className="cL_listing_table_row">
                                                                            {this.headerList.map((item, index) =>
                                                                                    <div key={item.id+"__"+index} className={'cL_listing_table_cell cell' + item.id}>
                                                                                        <strong>
                                                                                            {item.name}
                                                                                        </strong>
                                                                                    </div>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <ul className={'grid--body'}>
                                                                        {this.state.charactersList.map(( item, index ) =>
                                                                            <li key={item.id+"_"+index} onClick={(e) => this.setState(() => ({selectedDraw: item}))}>
                                                                                <div className="listDataShowing">
                                                                                    <div className="cL_listing_table_row">

                                                                                        {this.headerList.map((header, key) =>{
                                                                                            if (key === (this.headerLength-1))
                                                                                                return (
                                                                                                    <div className="clEditDotes_cell cell5 clearfix" key={header.name+"_"+key+"_"+item.id}>
                                                                                                        <span className="cL_rowList_number">{item[header.filterName]}</span>
                                                                                                        {(this.props.editRecord || this.props.addRecordToStateForDeletion) &&
                                                                                                        <a className="cl_tableRow_editDotes"  style={{cursor:'pointer'}} tabIndex={'-1'} onClick={this.handleButtonsShow}><i>&nbsp;</i></a>
                                                                                                        }
                                                                                                    </div>
                                                                                                );

                                                                                            return (
                                                                                                <div className="cL_listing_table_cell cell1"  key={header.name+"_"+key+"_"+item.id}>
                                                                                                    <span className="cL_rowList_number">{header.hasOwnProperty('htmlParser') ? ReactHtmlParser(item[header.filterName]): item[header.filterName]}</span>
                                                                                                </div>
                                                                                            );

                                                                                        })
                                                                                        }

                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {this.state.selectedDraw.is_executed == 1 && <WinnersList mission_id={this.props.mission.id} title={this.state.selectedDraw.title} character_id={this.state.selectedDraw.id} type={'small'}/>}

                                    <br />
                                    <div className="continueCancel  listShops">
                                        <a  style={{cursor:'pointer'}} className="close_popup" onClick={(e)=>{this.props.handleCloseCompetitionDetailsWindow()}}>CANCEL</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of MerchantUpdate.

export default CompetitionDetails;