export const setGymKeyValue = (key, value) => {
    return {type: 'SET_GYM_KEY_VALUE', obj: {[key]: value}};
};

export const resetGymForm = () => ({type: 'RESET_GYM_FORM'});

export const setGymEditData = ({name, state, link, excluded_business}) => ({type: 'SET_GYM_EDIT_DATA', data: {name, state, link, excluded_business}});

export const setGymBusinessList = (businessList) => ({type: 'SET_GYM_BUSINESS_LIST', businessList});

export const setGymExcludedBusinessList = (excluded_business) => ({type: 'SET_GYM_EXCLUDED_BUSINESS', excluded_business});