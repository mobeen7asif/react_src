import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import * as Survey from "survey-react";
import "survey-creator/survey-creator.css";
import "survey-react/survey.css";

class AddQuestionAnswer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isCompleted: false,
            edit_id: '',
        };
    }//..... end of constructor() .....//

    onCompleteComponent = (survey, edit_id) => {

        this.setState({ isCompleted: true });

        // console.log(JSON.stringify(survey.data));
        console.log((survey.data));

        var surveyData = survey.data;

        // console.log(surveyData);
        show_loader();
        axios.post(BaseUrl + '/api/save-survey-answers', {
            data: surveyData,
            edit_id: edit_id
        }).then((response) => {
            show_loader(true);
            if (response.data.status) {
                this.redirectToListing();
                NotificationManager.success('Data saved successfully', 'Success');
            } else {
                NotificationManager.error(response.data.message, 'Error');
            }//..... end if-else() .....//
        }).catch((err)=> {
            show_loader(true);
            NotificationManager.error("Error occurred, please try later.", 'Error');
        });
    }

    redirectToListing = () => {
        this.props.changeMainTab('survey');
    };//..... end of redirectToListing() ......//

    render() {

        var edit_id = this.props.survey.edit_id;

        var surveyRender = !this.state.isCompleted ? (
            <Survey.Survey
                json={this.props.survey.json}
                showCompletedPage={false}
                onComplete={(e) => this.onCompleteComponent(e, edit_id)}
            />
        ) : null;
        var onCompleteComponent = this.state.isCompleted ? (
            <div>{/*The component after onComplete event*/}</div>
        ) : null;
        return (
            <div>
                {surveyRender}
                {onCompleteComponent}
            </div>
        );

    }//..... end of render() .....//
}//..... end of AddMission.

const mapStateToProps = (state) => {
    return {survey: state.surveyBuilder};
};
export default connect(mapStateToProps)(AddQuestionAnswer);