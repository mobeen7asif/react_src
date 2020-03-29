const defaultForm = () => ({
    criterias:         [],
});

const defaultState = {
    ...defaultForm(),
};
export default (state = defaultState , action) => {
    if(action.type === 'ADD_NEW_SEARCH_MEMBER_VALUE'){
        return {...state, criterias: [...action.new_search.criterias]};
        //return {...state, criterias: [...state.criterias, ...action.new_search.criterias]};

    } else if (action.type === 'RESET_MEMBER_SEARCH') {
        return {...state, criterias: []}
    } 
    else {
        return state;
    }
};