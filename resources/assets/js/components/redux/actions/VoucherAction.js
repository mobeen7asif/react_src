export const addVoucherDefault = (key, value) => {
    return {type: 'SET_VOUCHER_KEY_VALUE',  obj: {[key]: value}};
};

export const setVoucherBusiness = (businessList) => {
    return {type: 'SET_VOUCHER_BUSINESS_LIST', businessList};
};
export const setFinalVoucherData= (data) => {
    return {type: 'SET_VOUCHER_DATA', data}
};

export const setCheckedKeys= (data) => {
    return {type: 'SET_VOUCHER_CHECKED_KEY', data}
};
export const resetVoucherData= () => {
    return {type: 'RESET_VOUCHER'}
};

export const setEditVoucherData = (voucher) => {
    return {type: 'SET_VOUCHER_EDIT_DATA', voucher};
};
