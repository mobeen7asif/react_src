import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from "react-html-parser";
import {NotificationManager} from "react-notifications";

class WinnersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            winnersList: []
        }
    }//..... end of constructor() .....//

    headerList =  [
        {"id": "1", "name": 'First Name',  'filterName': 'user_first_name'},
        {"id": "2", "name": 'Last Name',   'filterName': 'user_family_name'},
        {"id": "3", "name": 'Contact No',  'filterName': 'user_mobile'},
        {"id": "4", "name": 'Email',       'filterName': 'email'}
    ];

    componentDidMount() {
        this.getWinnersList();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.props.character_id && this.props.character_id != prevProps.character_id))
            this.getWinnersList();
    }

    getWinnersList = () => {
        show_loader();
        axios.post(BaseUrl + `/api/list-mission-characters-winners`, {
            mission_id: this.props.mission_id,
            character_id: this.props.character_id,
            type: this.props.type
        }).then(res => {
            this.setState(() => ({ winnersList: res.data.data }));
            show_loader(true);
        }).catch((err) => {
            NotificationManager.error("Error occurred while fetching winners.", 'Error');
            show_loader(true);
        });
    };//..... end of getWinnersList() .....//

    render() {
        return (
            <div className="dropSegmentation_section" style={{marginTop: '35px'}}>
                <div className="dropSegmentation_heading clearfix">
                    <h3 style={{color: 'green', fontWeight: 'bold'}}>Winners of { this.props.type } Draw: { this.props.title}</h3>
                </div>
                <div className="stateSegmentation primary_voucher_setting" style={{minHeight: '100px'}}>
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
                            {this.state.winnersList.map(( item, index ) =>
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
        );
    }//..... end of render() .....//
}//..... end of WinnersList.

WinnersList.propTypes = {};

export default WinnersList;