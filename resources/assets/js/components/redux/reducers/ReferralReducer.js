const defaultForm = () => ({
    referral_points:'',
    referred_points:''
});

const defaultState = {
    ...defaultForm(),
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_REFERRAL_KEY_VALUE':
            return {...state,...action.obj};
        case 'SET_REFERRAL_EDIT_DATA':
            return {...state,...action.referral};
        case 'RESET_REFERRAL_STATE':
            return {...state, ...defaultForm()};
        default:
            return state;
    }//..... end of switch() .....//
};