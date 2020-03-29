import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import {validateQuestionsData} from "../../../../utils/Validations";
import {connect} from "react-redux";
import {resetSurveyBuilder, setQuestionsArray} from "../../../../redux/actions/SurveyBuilderActions";

class AddQuestionAnswer extends Component {

    state = {
        question: '',
        key: 1,
        values: []
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidMount() {
        if(this.props.survey.question_id !== 0) {
            if(this.props.survey.answers.length === 0) {
                let temp = [];
                temp.push("");
                this.setState({values: temp,question: this.props.survey.question});
            }
            else {
                this.setState({values: this.props.survey.answers,question: this.props.survey.question});
            }
        } else {
            let temp = [];
            temp.push("");
            this.setState({values: temp});
        }
    };//..... end of componentDidMount() .....//

    componentWillUnmount = () => {
        this.props.dispatch(resetSurveyBuilder());
    };

    handleChange(i, event) {
        let values = [...this.state.values];
        values[i] = event.target.value;
        this.setState({ values },() => {this.props.dispatch(setQuestionsArray(this.props.survey.question,this.state.values));});
    }

    addClick(){
        this.setState(prevState => ({ values: [...prevState.values, '']}), () => {this.props.dispatch(setQuestionsArray(this.props.survey.question,this.state.values));});
    }

    removeClick(i){
        let values = [...this.state.values];
        values.splice(i,1);
        this.setState({ values }, () => {this.props.dispatch(setQuestionsArray(this.props.survey.question,this.state.values));});
    }

    createUI(){
        return this.state.values.map((el, i) =>
            <div className="answModifcation" key={i}>
                <h4>Answer {i+1}</h4>
                <div className="segmentInput">
                    <textarea value={el||''} autoFocus={el === ''  && this.props.survey.question !== '' ? true: false}   onChange={this.handleChange.bind(this, i)}/>
                </div>
                <input className="iconDeleted" type='button' value='remove' onClick={this.removeClick.bind(this, i)}/>
            </div>
        )
    }
    redirectToListing = () => {
        this.props.changeMainTab('survey');
    };//..... end of redirectToListing() ......//
    saveData = () => {
        if (!validateQuestionsData(this.props.survey.question,this.state.values)) {
            NotificationManager.warning("Please fill all the fields.", 'Missing Fields');
            return false;
        } else {
            show_loader();
            let  route = this.props.survey.question_id !== 0 ?  '/api/update-question-answers' : '/api/save-question-answers';
            axios.post(BaseUrl + route, {
                ...this.props.survey,
            })
                .then((response) => {
                    if(response.data.status) {
                        show_loader(true);
                        this.props.dispatch(resetSurveyBuilder());
                        NotificationManager.success('Question saved successfully!', 'Success');
                        this.redirectToListing();
                    } else {
                        show_loader(true);
                        NotificationManager.success('Something went wrong', 'Success');
                    }
                }).catch((err) => {
                show_loader(true);
                NotificationManager.error("Error occurred while saving question, please try later.", 'Error');
            });
        }

    };//---- End of saveReferralData() ----//
    render() {
        return (
            <div className="newVualt_container">
                <div className="newVualt_container_detail">

                    <div className="newVualt_detail_outer">
                        <div className="newVualt_detail">
                            <div className="newVualt_heading_with_buttons clearfix">
                                <div className="newVualt_heading">
                                    <h3>{this.props.survey.question_id !== 0 ? 'Edit Question/Answer' : 'Add Question/Asnwer'}</h3>
                                </div>
                            </div>
                            <div className="categoryInfo_container clearfix ">
                                <div className="smsDetail_inner answersSetting">

                                    <ul>
                                        <li><label>Question</label>
                                            <div className="segmentInput">
                                                <input autoFocus={true} type="text" value={this.props.survey.question} placeholder="" onChange={(e) => {this.props.dispatch(setQuestionsArray(e.target.value,this.state.values))}} />
                                            </div>
                                        </li>
                                        <li><label>Answers</label>

                                                {this.createUI()}
                                        </li>

                                        <input type='button' className="moreAnsw" value='Add More Answer' onClick={this.addClick.bind(this)}/>
                                    </ul>


                                </div>
                            </div>
                        </div>
                    </div>

                    <br/>
                    <div className="continueCancel  listShops">
                        <a  style={{cursor:'pointer'}} className="selecCompaignBttn" onClick={this.saveData}>Save</a>
                        <a  style={{cursor:'pointer'}} className="close_punch_popup selecCompaignBttn" onClick={this.redirectToListing}>CANCEL</a>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of AddMission.

const mapStateToProps = (state) => {
  return {survey: state.surveyBuilder};
};
export default connect(mapStateToProps)(AddQuestionAnswer);