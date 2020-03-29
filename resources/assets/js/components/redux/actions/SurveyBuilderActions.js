export const setSurveyTitle = (title, description, json) => {
    return {type: 'SET_SURVEY_TITLE', title, description, json};
};
export const setSurveyTab = (tab) => {
    return {type: 'SET_SURVEY_TAB', tab};
};
export const setEditId = (edit_id, description, json) => {
    return {type: 'SET_EDIT_ID', edit_id, description, json};
};

export const setQuestionsArray = (question,answers) => {
    return {type: 'SET_QUESTION_ANSWERS', question, answers};
};

export const setEditData = (question,answers) => {
    return {type: 'SET_EDIT_DATA',question,answers};
};



export const resetSurveyBuilder = () => {
    return {type: 'RESET_SURVEY_BUILDER'};
};


