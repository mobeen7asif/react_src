import React from 'react';

import * as Survey from "survey-react";
import * as SurveyCreator from "survey-creator";
import "survey-creator/survey-creator.css";
import "survey-react/survey.css";
import {NotificationManager} from "react-notifications";

class SurveyComponent extends React.Component {

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

    componentDidMount(){
        /*console.log(this.props.data.edit_id);
        setTimeout(() => {
            console.log('Our data is fetched');
            this.setState({
                edit_id: this.props.data.edit_id
            })
            console.log(this.state.edit_id);
        }, 1000)*/
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

        // show survey creator form for the first time
        $('#creatorElement').show();

        // get edit_id
        var edit_id = this.props.data.edit_id;

        // create survey form
        // var creatorOptions = {showLogicTab: true};
        var creatorOptions = {};
        var creator = new SurveyCreator.SurveyCreator("creatorElement", creatorOptions);

        // load survey form with edit data
        creator.text = this.props.data.json;

        Survey.JsonObject.metaData.removeProperty("panelbase", "title")
        Survey.JsonObject.metaData.addProperty("panelbase", { name: "title:text", serializationProperty: "locTitle", isRequired: true });

        // save survey form
        creator.saveSurveyFunc =  () => {

            //save the survey JSON
            const data = (creator.text);

            show_loader();
            axios.post(BaseUrl + '/api/save-survey', {
                data: data,
                edit_id: edit_id
            }).then((response) => {
                show_loader(true);
                if (response.data.status) {
                    this.redirectToListing();

                    // hide survey creator form after saving
                    $('#creatorElement').hide();
                } else {
                    NotificationManager.error(response.data.message, 'Error');
                }//..... end if-else() .....//
            }).catch((err)=> {
                show_loader(true);
                NotificationManager.error("Error occurred, please try later.", 'Error');
            });
        }

        creator.onTestSurveyCreated.add(function(sender, options) {
            /*console.log(sender.text);
             options.survey.title = "You are testing survey at: " + new Date().toLocaleTimeString();*/
        });

        /*var surveyRender = !this.state.isCompleted ? (
            <Survey.Survey
                json={this.props.data.json}
                showCompletedPage={false}
                onComplete={this.onCompleteComponent}
            />
        ) : null;*/
        var surveyRender = edit_id > 0 ? (
            <Survey.Survey
                json={this.props.data.json}
                showCompletedPage={false}
                onComplete={this.onCompleteComponent}
            />
        ) : null;
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

export default SurveyComponent;
