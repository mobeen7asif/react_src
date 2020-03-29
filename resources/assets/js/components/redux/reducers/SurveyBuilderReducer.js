const defaultState = {
    title: '',
    description: '',
    tab: 'survey',
    edit_id: 0,
    question : '',
    answers: [],
    question_id: 0,
    json: ''
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_SURVEY_TITLE':
            return {...state, ...action};
        case 'SET_SURVEY_TAB':
            return {...state, ...action};
        case 'SET_EDIT_ID':
            return {...state,...action};
        case 'SET_QUESTION_ANSWERS':
            return {...state, question: action.question,answers: action.answers};
        case 'SET_EDIT_DATA':
            return {...state, question: action.question.question,answers: action.answers,edit_id: action.question.survey_id,question_id:action.question.id};
        case 'RESET_SURVEY_BUILDER':
            return {...state, question: '',answers: [],title: '',edit_id: 0,question_id:0};
        default:
            return state;
    }//...... end of switch() .....//
};