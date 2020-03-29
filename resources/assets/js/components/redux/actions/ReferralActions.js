export const setReferralKeyValue = (key, value) => {
    return {type:'SET_REFERRAL_KEY_VALUE', obj: {[key]: value}}
};

export const resetReferralState = () => {
    return {type: 'RESET_REFERRAL_STATE'}
};

export const setReferralEditData = (referral) => {
    return {type: 'SET_REFERRAL_EDIT_DATA', referral};
};