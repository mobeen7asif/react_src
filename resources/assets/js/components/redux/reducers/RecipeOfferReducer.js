const defaultState = () => {
    return {
        location:              [],
        title:              '',
        description:        '',
        image:              '',
        editId:             0,
        type:               '',
        offerTypes: ['recipe', 'global'],
        recipeList:     [],
        recipe_id: null,
        selected_venues:[]
    };
};

export default (state = defaultState(), actions) => {
    switch (actions.type) {
        case 'SET_RECIPE_OFFER_BY_KEY_VALE':
            return {...state, ...actions.value};
        case 'SET_RECIPE_OFFER_EDIT_DATA':
            return {...state, ...actions.value};
        case 'RESET_RECIPE_OFFER_FORM':
            return {...state, ...defaultState()};
        default:
            return state;
    }//..... end switch() .....//
};