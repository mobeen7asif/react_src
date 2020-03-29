import React from 'react';

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
        (this.props.data);
    }

    componentDidMount(){
        if(this.props.data.edit_id == 0){
            $("#svd-survey-settings button").trigger("click");
        }
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
        var creatorOptions = {
            questionTypes: ["text", "checkbox", "radiogroup", "dropdown", "comment", "rating", "imagepicker", "boolean", "html", "expression", "matrix", "multipletext", "panel"]
        };
        var creator = new SurveyCreator.SurveyCreator("creatorElement", creatorOptions);

        // load survey form with edit data
        creator.text = this.props.data.json;

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
                    NotificationManager.success('Survey added successfully', 'Success');
                } else {
                    NotificationManager.error(response.data.message, 'Error');
                }//..... end if-else() .....//
            }).catch((err)=> {
                show_loader(true);
                NotificationManager.error("Error occurred, please try later.", 'Error');
            });
        }

        return (
            <div>
                <link rel="stylesheet" href="https://unpkg.com/bootstrap@3.3.7/dist/css/bootstrap.min.css" />
                <link rel="stylesheet" href={BaseUrl + '/assets/css/survey_form_front_view.css'} />
            </div>
        );
    }
}

export default SurveyComponent;
