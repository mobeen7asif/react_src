import React, {Component} from 'react';
import CompetitionListing from "./sub-pages/campaigns/competition/CompetitionListing";
import AddCompetition from "./sub-pages/campaigns/competition/AddCompetition";
import SurveyListing from "./sub-pages/campaigns/surveys/SurveyListing";
import AddSurvey from "./sub-pages/campaigns/surveys/AddSurvey";
import AddQuestionAnswer from "./sub-pages/campaigns/surveys/AddQuestionAnswer";
import {connect} from "react-redux";
import {resetSurveyBuilder} from "../redux/actions/SurveyBuilderActions";
class Survey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab : "survey",
            editData  : {},
        };
    }//..... end of constructor() .....//

    setEditRecord = (editData, tab) => {
        this.setState(()=>({editData, activeTab: tab}));
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    changeMainTab = (tab) => {
        this.setState({activeTab : tab, editData: {}});
        if(tab === 'survey') {
            this.props.dispatch(resetSurveyBuilder());
        }
    };

    loadActiveComponent = () => {
        switch (this.state.activeTab) {
            case "survey"  :
                return <SurveyListing changeMainTab={this.changeMainTab} setEditRecord={this.setEditRecord}/>;
            case 'add-survey':
                return <AddSurvey type={this.state.type} changeMainTab={this.changeMainTab}/>;
            case 'add-question-answer':
                return <AddQuestionAnswer changeMainTab={this.changeMainTab} setEditRecord={this.setEditRecord}/>;
            default :
                return "";
        }
    };//..... end of loadActiveComponent() .....//

    render() {
        return (
            <div>
                {
                    this.loadActiveComponent()
                }
                <div id="creatorElement"></div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of Competition.
const mapStateToProps = (state) => {
    return {survey: state.surveyBuilder};
};
export default connect(mapStateToProps)(Survey);