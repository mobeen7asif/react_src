const defaultState = () => ({
    name: '',
    state: '',
    link: '',
    excluded_business: []
});

export default (state = {businessList: [], ...defaultState()}, actions) => {
    switch (actions.type) {
        case 'SET_GYM_KEY_VALUE':
            return {...state, ...actions.obj};
        case 'RESET_GYM_FORM':
            return {...state, ...defaultState()};
        case 'SET_GYM_EDIT_DATA':
            return {...state, ...actions.data};
        case 'SET_GYM_BUSINESS_LIST':
            return {...state, businessList: actions.businessList};
        case 'SET_GYM_EXCLUDED_BUSINESS':
            return {...state, excluded_business: actions.excluded_business};
        default:
            return state;
    }//..... end switch() .....//
};