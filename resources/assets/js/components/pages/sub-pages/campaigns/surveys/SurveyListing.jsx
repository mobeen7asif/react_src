import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import Grid from "../../../Grid";
import {setEditData, setEditId, setSurveyTitle} from "../../../../redux/actions/SurveyBuilderActions";
import {connect} from "react-redux";
import HeaderComponent from '../../members/sub_components/HeaderComponent';
import ReactPaginate from 'react-paginate';
import ConfirmationModal from "../../../../utils/ConfirmationModal";
import SurveyHeaderComponent from "./SurveyHeaderComponent";
import NoDataFound from "../../../../_partials/NoDataFound";


class SurveyListing extends Component {
    perPage = 10;
    pageLoader = null;
    state = {
        data            : [],
        searchData      : '',
        orderBy         : 'created_at',
        deleteRecord    : 0,
        selectedSurvey : {},
        editData        : {},
        showListError: false,
        offset: 0,
        perPage: 10,
        search: '',
        campaignType: '',
        filterSegment: 'created_at',
        orderType: 'DESC',
        pageCount: 0,
        deleteSurvey: 0,


        headerList : [
            {"id": "2", "name": 'Title',   'filterName': 'title'}/*,
            {"id": "3", "name": 'Questions',   'filterName': 'questions', 'disable_sort': true},*/
        ],
        questionsList: []

    };
    headerList = [{"id": "1", "name": 'ID', 'filterName': ''}, {"id": "2", "name": 'Question', 'filterName': ''},
        {"id": "3", "name": 'Edit', 'filterName': ''}];



    loadData = () => {
        this.pageLoader.show();
        axios.post(BaseUrl + `/api/surveys-list`, {
            'name': this.state.filterSegment,
            'limit': this.state.perPage,
            'offset': this.state.offset,
            'nameSearch': this.state.search,
            'orderType': this.state.orderType,
            'orderBy' : this.state.filterSegment
        }).then(res => {
            if (res.data.status) {
                this.setState((prevState) => ({
                    data: res.data.data,
                    pageCount: (res.data.total) / this.perPage,
                    selectedSurvey: 1
                }));
                this.pageLoader.hide();
            } else {
                this.pageLoader.hide();
                this.setState({showListError: true});
            }
            $('.cl_rowEdit_popOut').css('right', '-24% !important');
        }).catch((err) => {
            this.pageLoader.hide();
        });
    };//..... end of loadData() .....//

    componentDidMount = () => {
         this.pageLoader = $("body").find('.preloader3');
         this.loadData();
    };//..... end of componentDidMount() .....//



    /**
     * Sorting Survey
     * @param name
     * @param data
     */
    surveySorting = (name, data) => {
        this.setState({filterSegment: name, orderType: data}, () => {
            this.loadData();
        });
    };//--- End of

    /**
     *
     * @param data
     */
    changePages = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        this.setState({offset: offset}, () => {
            this.loadData();
        });
    };//--- End of changePages() ---//

    enterPressed = (event) => {
        let code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            this.loadData();
        }
    };//--- End of enterPressed() ----//

    handleButtonsShow = (e) => {
        let li = e.target.closest('li');
        if (li.classList.contains('active_editMod')) {
            li.classList.remove('active_editMod');
        } else {
            Array.prototype.slice.call(e.target.closest('ul').querySelectorAll('li'))
                .map((ele) => ele.classList.remove('active_editMod'));
            li.classList.add('active_editMod');
        }//..... end if-else() .....//
    };
    closePopup = () => {
        document.getElementById("outComesPopup").style.display = "none";
    };
    questionDetails = (item) => {
        this.setState({questionsList: item.questions});
        document.getElementById("outComesPopup").style.display = "block";
    };
    editQuestion = (question) => {
        let answers = [];
        question.answers.map(function (ans) {
            answers.push(ans.answer);
        });
        this.props.dispatch(setEditData(question,answers));
        this.props.changeMainTab('add-question-answer');
    };

    deleteSurvey = (survey) => {
            this.setState(() => ({deleteSurvey: survey.id}));
    };
    handleCloseModal = () => {
        this.setState(() => ({deleteSurvey: 0}));
    };

    handleDeleteSurvey = () => {
        let surveyId = this.state.deleteSurvey;
        this.setState({deleteSurvey: 0});
        show_loader();
        axios.post(`${BaseUrl}/api/delete-survey/${surveyId}`,{})
            .then((response) => {
                show_loader();
                if (response.data.status === true){
                    NotificationManager.success(response.data.message, 'Success');
                    this.loadData();
                } else
                    NotificationManager.error(response.data.message, 'Error');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDeleteSurvey() .....//































    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.perPage);
        this.setState({offset: offset}, () => {
            this.loadData();
        });
    };//..... end of handlePageClick() .....//

    /**
     * search Segment
     * @param e
     */
    searchData = (e) => {
        let searchData = e.target.value;
        this.setState({search: searchData, offset: 0, perPage: this.perPage});
    };//--- End of searchData()  ---//

    handleFilterChange = (orderBy, orderType) => {
        this.setState({orderBy, orderType}, () => {
            this.loadData();
        });
    };//--- End of () ---//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    editRecord = (survey) => {
        this.props.setEditRecord(survey,"edit-survey","edit");
    };//..... end of editRecord() .....//

    deleteRecord = (id) => {
        this.setState(() => ({deleteRecord: id}));
    };//..... end of deleteRecord() .....//



    handleDeleteRecord = () => {
        show_loader();
        axios.post(BaseUrl + `/api/delete-survey`, {id: this.state.deleteRecord, venue_id: VenueID, company_id: CompanyID})
            .then(res => {
                show_loader(true);
                if (res.data.status) {
                    this.setState(() => ({deleteRecord: 0}));
                    this.loadData();
                    NotificationManager.success(res.data.message, 'Success');
                } else {
                    NotificationManager.error(res.data.message, 'Error');
                }//..... end if-else() .....//
            }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of handleDeleteRecord() .....//


    handleThirdBtnClick = (selectedSurvey) => {
        this.props.dispatch(setEditId(selectedSurvey.id, selectedSurvey.description, selectedSurvey.json));
        this.props.setEditRecord(selectedSurvey, 'add-question-answer');
    };//..... end of handleThirdBtnClick() .....//

    handleCloseSurveyDetailsWindow = () => {
        this.setState(() => ({selectedSurvey : {}}))
    };//..... end of handleCloseSurveyDetailsWindow() .....//

    handleDownloadReport = (survey) => {
        var adminUserInfo = JSON.parse(localStorage.getItem('userData'));
        var user_id = adminUserInfo.user;
        var email   = adminUserInfo.email;
        var name    = adminUserInfo.first_name;
        // console.log(user_id, email, name);return false;
        window.open(
            BaseUrl+'/api/export-survey-stats?id='+survey.id+'&user_id='+user_id+'&name='+name+'&email='+email,
            '_blank'
        );
    };

    render() {
        return (
            <div className="cL_listing_tableOut memberTable">

                <div className="compaign_select_search clearfix">
                    <div className="searchCompaign clearfix">
                        <div className="preloader3" style={{marginLeft: '-120px', marginTop: '0px', display: 'none'}}>&nbsp;</div>
                        <input type="text" value={this.state.search} placeholder="Search Survey" className="copmpaignSearch_field" onKeyPress={this.enterPressed} onChange={this.searchData}/>
                        <input type="submit" value="" className="copmpaignIcon_field" onClick={() => this.loadData()}/>
                    </div>
                </div>

                <div className="compaign_addNew clearfix">
                    <h3>Survey List</h3>
                    {(appPermission("Surveys","add")) && (
                        <a className="all_blue_button" onClick={(e) =>
                        {this.props.changeMainTab('add-survey');
                        this.props.dispatch(setEditId(0, '', ''));}
                        }>Add Survey</a>
                    )}
                </div>


                <div className="cL_listing_tableInn">
                    <SurveyHeaderComponent listData={this.state} onClick={(id, name) => this.surveySorting(id, name)} />
                    <ul>
                        {(this.state.showListError)? <NoDataFound customMessage="Surveys"/>
                            :this.state.data.map(item =>
                                <li key={item.id}>
                                    <div className="cL_listing_table_row">
                                        <div className="cL_listing_table_cell cell2">
                                            <span className="cL_rowList_number">{item.title}</span>
                                        </div>

                                        <div className="clEditDotes_cell cell3_set cell7 ">
                                            {/*{
                                                item.questions.length === 0 ?
                                                    <span  style={{marginTop:'7px'}} className="cL_rowList_number">0</span>
                                                    :
                                                    <span style={{marginTop:'7px'}} title={'View Question'} className="cL_rowList_number"><a onClick={()=>{this.questionDetails(item)}}>{item.questions !== null ? item.questions.length : 0}</a></span>
                                            }*/}
                                            <a className="cl_tableRow_editDotes" onClick={this.handleButtonsShow}  style={{cursor:'pointer'}}><i></i></a>
                                        </div>
                                    </div>
                                    <div className="cl_rowEdit_popOut handleDownload">
                                        <div className="cl_rowEdit_pop_table">
                                            <div className="cl_rowEdit_popOut_tableRow">

                                                {(appPermission("Surveys","edit")) && (
                                                    <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1">
                                                        <a className="edit_icon"  style={{cursor:'pointer'}} onClick={(e) => {
                                                            this.props.dispatch(setEditId(item.id, item.description, item.json));
                                                            this.props.dispatch(setSurveyTitle(item.title, item.description, item.json));
                                                            this.props.changeMainTab('add-survey');
                                                        }}>
                                                            <strong><i>&nbsp;</i>
                                                                {'Edit'}</strong>
                                                        </a>
                                                    </div>
                                                )}

                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                    {/*<a className="duplicateIcon"  style={{cursor:'pointer'}} onClick={(e) => {this.handleThirdBtnClick(item)}}><strong><i>&nbsp;</i>+ QuestionTest</strong></a>*/}
                                                    <a className="duplicateIcon" target="_blank" href={"test-survey?id="+item.id}><strong><i>&nbsp;</i>Test</strong></a>
                                                </div>
                                                {(appPermission("Surveys","delete")) && (
                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell3">
                                                    <a className="delete_icon"  style={{cursor:'pointer'}} onClick={(e) => {this.deleteSurvey(item)}}><strong><i>&nbsp;</i>Delete</strong></a>
                                                </div>
                                                )}
                                                <div  className="cl_rowEdit_popOut_tableRow_cell eidtCell4">


                                                    <a className="scheduleIcon"  style={{cursor:'pointer'}} onClick={() => this.handleDownloadReport(item)}>
                                                        <strong><i>&nbsp;</i>{'Download'}</strong>
                                                    </a>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )}
                    </ul>
                </div>
                <div className="campLstng_paginaton_out">
                    <div className="campLstng_paginaton_inn">
                        <ReactPaginate previousLabel={""} nextLabel={""} nextLinkClassName={'campPagi_next'} breakLabel={<a href="">...</a>}
                                       breakClassName={"break-me"} pageCount={this.state.pageCount} marginPagesDisplayed={2} pageRangeDisplayed={5}
                                       previousLinkClassName={'campPagi_prev'} onPageChange={this.changePages} activeClassName={"active"}/>
                    </div>
                </div>


                <div className= "popups_outer outComesPopup" id="outComesPopup" style={{display:'none'}}>
                    <div className="popups_inner">
                        <div className="overley_popup" data-attr="addNewUser_popup" onClick={()=>{this.props.handleShowAddEditModal(false)}}>&nbsp;</div>
                        <div className="popupDiv2 popupDiv2Setting">
                            <div className="popupDiv_detail">
                                <div className="popup_heading clearfix">
                                    <h3>Questions List</h3>
                                    <a  style={{cursor:'pointer'}} onClick={()=>{this.closePopup()}} className="popupClose close_popup">&nbsp;</a>
                                </div>
                                <div className="beacon_popupDeatail"> <br /><br />
                                    <div className="add_categoryList_info2">
                                        <div className="categoryInfo_container cms_nes_setting clearfix">
                                            <div className="">
                                                <div className="cL_listing_tableInn memberTable_cells_setting memberTable_cells_settingFixes">
                                                    <div className="cL_listing_tableTitle">
                                                        <div className="cL_listing_table_row">
                                                            {this.headerList.map(item =>
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
                                                            (this.state.questionsList &&

                                                                this.state.questionsList.map((question) =>
                                                                    <li key={question.id}>
                                                                        <div className="cL_listing_table_row">
                                                                            <div className="cL_listing_table_cell cell1">
                                                                                    <span className="cL_rowList_number">
                                                                                        {question.id}
                                                                                    </span>
                                                                            </div>
                                                                            <div className="cL_listing_table_cell cell2">
                                                                                    <span className="cL_rowList_number">
                                                                                        {question.question}
                                                                                        </span>
                                                                            </div>
                                                                            <div className="cL_listing_table_cell cell3">
                                                                                <a className="edit_icon" onClick={() => this.editQuestion(question)}
                                                                                    style={{cursor:'pointer'}}
                                                                                   title="Edit Question"><strong><i>&nbsp;</i>Edit</strong></a>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                )
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

                <ConfirmationModal isOpen={!!this.state.deleteSurvey} handleCloseModal={this.handleCloseModal} text={'Survey'} handleDeleteItem={this.handleDeleteSurvey}/>

            </div>
        );
    }//..... end of render() .....//
}//..... end of SurveyListing.

const mapStateToProps = (state) => {
    return {survey: state.surveyBuilder};
};
export default connect(mapStateToProps)(SurveyListing);