import React from 'react';

import * as Survey from "survey-react";
import * as SurveyCreator from "survey-creator";
import "survey-creator/survey-creator.css";
import "survey-react/survey.css";
import {NotificationManager} from "react-notifications";

class AddQuestionAnswer extends React.Component {

    /*event handling
     https://surveyjs.io/Documentation/Survey-Creator/#accesssurveys*/

    constructor(props) {
        super(props);
        this.state = {
            isCompleted: false,
            edit_id: ''
        };
        this.onCompleteComponent = this.onCompleteComponent.bind(this);
    }

    onCompleteComponent(survey) {
        // console.log(JSON.stringify(survey.data));
        console.log((survey.data));
        this.setState({ isCompleted: true });
    }

    redirectToListing = () => {
        this.props.changeMainTab('survey');
    };//..... end of redirectToListing() ......//

    render() {

        var surveyRender = null;
        var onCompleteComponent = this.state.isCompleted ? (
            <div>The component after onComplete event</div>
        ) : null;
        return (
            <div>
                {surveyRender}
                {onCompleteComponent}
            </div>
        );
    }
}

export default AddQuestionAnswer;
