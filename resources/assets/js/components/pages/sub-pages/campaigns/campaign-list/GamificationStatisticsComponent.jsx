import React, {Component} from 'react';

class GamificationStatisticsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            games: [],
            campaign_title: ''
        };
        this.headerList = [
            {"id": "1", "name": 'Title',       'filterName': 'title'},
            {"id": "2", "name": 'Start Date',  'filterName': 'start_date'},
            {"id": "3", "name": 'End Date',    'filterName': 'end_date'},
            {"id": "4", "name": 'Completion',  'filterName': 'completion'},
            {"id": "5", "name": 'In Progress', 'filterName': 'inProgress'},
            {"id": "6", "name": 'Action', 'filterName': 'action'},
        ];
    }//..... end of constructor() .....//

    componentDidMount() {
        this.loadGamesStatistics();
    }//..... end of componentDidMount() .....//

    loadGamesStatistics = () => {
        show_loader();
        axios.post(BaseUrl + '/api/gamification-campaign-statistics',{campaign_id: this.props.campaign_id})
            .then( response => {
                this.setState(() => ({games: response.data.games, campaign_title: response.data.campaign_title}));
                show_loader(true);
        }).catch((err) => {
            show_loader(true);
        });
    };//..... end of loadQuickBoards() .....//


    render() {
        return (
            <div className= "popups_outer addNewsCharity" style={{display:'block'}}>
                <div className="popups_inner">
                    <div className="overley_popup" data-attr="addNewUser_popup" onClick={()=>{this.props.handleGameStatisticsModel(0)}}>&nbsp;</div>
                    <div className="popupDiv2 largePopup">
                        <div className="popupDiv_detail">
                            <div className="popup_heading clearfix">
                                <h3>Game(s) Statistics</h3>
                            </div>
                            <div className="beacon_popupDeatail"> <br /><br />
                                <div className="add_categoryList_info2">
                                    <div className="newVualt_heading">
                                        <h3>{this.state.campaign_title} Campaign's Statistics</h3>
                                    </div>
                                    <div className="categoryInfo_container cms_nes_setting clearfix">

                                        <div className="cL_listing_tableOut memberTable">
                                            <div className="compaign_addNew clearfix">
                                                <h3>Game(s) List</h3>
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
                                                    {this.state.games.map(( item, index ) =>
                                                        <li key={item.id+"_"+index}>
                                                            <div className="listDataShowing">
                                                                <div className="cL_listing_table_row">

                                                                    <div className="cL_listing_table_cell cell1">
                                                                        <span className="cL_rowList_number">{item.title}</span>
                                                                    </div>
                                                                    <div className="cL_listing_table_cell cell1">
                                                                        <span className="cL_rowList_number">{item.start_date}</span>
                                                                    </div>
                                                                    <div className="cL_listing_table_cell cell1">
                                                                        <span className="cL_rowList_number">{item.end_date}</span>
                                                                    </div>
                                                                    <div className="clEditDotes_cell cell1">
                                                                        <span className="cL_rowList_number">{item.completion}</span>
                                                                    </div>
                                                                    <div className="clEditDotes_cell cell1">
                                                                        <span className="cL_rowList_number">{item.inProgress}</span>
                                                                    </div>
                                                                    <div className="cl_rowEdit_popOut cell5 clearfix" style={{right: '0%'}}>
                                                                        <div className="cl_rowEdit_pop_table">
                                                                            <div className="cl_rowEdit_popOut_tableRow">
                                                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                                                    <a className="duplicateIcon" href={item.url} target='_blank'>
                                                                                        <strong><i>&nbsp;</i>Download Report</strong>
                                                                                    </a>
                                                                                </div>
                                                                            </div>
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
                                                                            <div className="cL_listing_table_cell cell1  ">
                                                                                <strong> <span>&nbsp;</span>Start Date </strong>
                                                                            </div>
                                                                            <div className="cL_listing_table_cell cell1  ">
                                                                                <strong> <span>&nbsp;</span>End Date </strong>
                                                                            </div>
                                                                            <div className="cL_listing_table_cell cell2  ">
                                                                                <strong> <span>&nbsp;</span>Completion</strong>
                                                                            </div>
                                                                            <div className="cL_listing_table_cell cell2  ">
                                                                                <strong> <span>&nbsp;</span>Action</strong>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <ul>
                                                                        {item.missions.map((mission, index) => (
                                                                            <li key={mission.title}>
                                                                                <div className="listDataShowing" style={{padding: '14px 20px 14px 20px'}}>
                                                                                    <div className="cL_listing_table_row">
                                                                                        <div className="cL_listing_table_cell cell1  tieritemCell">
                                                                                            <span className="cL_rowList_number ">{mission.title}</span>
                                                                                        </div>
                                                                                        <div className="cL_listing_table_cell cell2  ">
                                                                                            <span className="cL_rowList_number ">{mission.start_date}</span>
                                                                                        </div>
                                                                                        <div className="cL_listing_table_cell cell3  ">
                                                                                            <span className="cL_rowList_number ">{mission.end_date}</span>
                                                                                        </div>
                                                                                        <div className="cL_listing_table_cell cell4  ">
                                                                                            <span className="cL_rowList_number" style={{textAlign: 'center'}}>{mission.completion}</span>
                                                                                        </div>
                                                                                        <div className="cl_rowEdit_popOut cell5 clearfix" style={{right: '0%'}}>
                                                                                            <div className="cl_rowEdit_pop_table">
                                                                                                <div className="cl_rowEdit_popOut_tableRow">
                                                                                                    <div className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                                                                        <a className="duplicateIcon" href={mission.url} target='_blank' title={'download report'}>
                                                                                                            <strong><i>&nbsp;</i>Download Report</strong>
                                                                                                        </a>
                                                                                                    </div>
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
                                <div className="continueCancel place_beacon createUserButtons">
                                    <a  style={{cursor:'pointer'}} className="close_popup" onClick={()=>{this.props.handleGameStatisticsModel(0)}}>CANCEL</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of GamificationStatisticsComponent.

export default GamificationStatisticsComponent;