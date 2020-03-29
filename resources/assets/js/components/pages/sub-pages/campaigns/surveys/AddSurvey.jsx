import React, {Component} from 'react';
import {connect} from "react-redux";

import SurveyComponent from './SurveyComponent';


class AddSurvey extends Component {
    render(){
        return (
            <SurveyComponent data={this.props.survey} changeMainTab={this.props.changeMainTab} />
        );
    }
}

const mapStateToProps = (state) => {
    return {survey: state.surveyBuilder};
};
export default connect(mapStateToProps)(AddSurvey);