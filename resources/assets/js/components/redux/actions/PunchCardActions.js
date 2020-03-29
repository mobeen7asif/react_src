export const setKeyValue = (key, value) => {
    return {type:'SET_PUNCH_CARD_KEY_VALUE', obj: {[key]: value}}
};

export const setBusiness = (business) => {
    return {type: 'SET_PUNCH_CARD_BUSINESS', business};
};

export const setCategory = (category) => {
    return {type: 'SET_PUNCH_CARD_CATEGORY', category};
};

export const setProduct = (product) => {
    return {type: 'SET_PUNCH_CARD_PRODUCT', product};
};

export const setVariant = (variant) => {
    return {type: 'SET_PUNCH_CARD_VARIANT', variant};
};

export const setBusinessList = (businessList) => {
    return {type: 'SET_PUNCH_CARD_BUSINESS_LIST', businessList};
};

export const setCategoryList = (categoryList) => {
    return {type: 'SET_PUNCH_CARD_CATEGORY_LIST', categoryList};
};

export const setProductList = (productList) => {
    return {type: 'SET_PUNCH_CARD_PRODUCT_LIST', productList};
};

export const setEditData = (punchCard) => {
    return {type: 'SET_PUNCH_CARD_EDIT_DATA', punchCard};
};

export const resetPunchCardState = () => {
    return {type: 'RESET_PUNCH_CARD_STATE'}
};

export const setRedemptionType = (redemption_type) => {
    return {type: 'SET_REDEMPTION_TYPE', redemption_type}
};

export const setRedemptionFrequency = (frequency) => {
    return {type: 'SET_REDEMPTION_FREQUENCY', frequency}
};
export const setRedemptionCondition = (condition) => {
    return {type: 'SET_REDEMPTION_CONDITION', condition}
};

export const setSubModifiers = (data) => {
    return {type: 'SET_SUB_MODIFIERS', data}
};

export const setVarientsList = (data) => {
    return {type: 'SET_PUNCH_CARD_VARIANT_LIST', data}
};
export const setSelectedTreeKeys = (data) => {
    return {type: 'SET_SUB_SELECTED', data}
};

export const setFinalDataPunchCard = (data) => {
    return {type: 'SET_DATA_RULE_PUNCH', data}
};

export const setTreeList = (data) => {
    return {type: 'SET_STORE_DATA', data};
};

export const setVarientListData = (data) => {
    return {type: 'SET_VARIENT_DATA', data};
};
export const setProductTreeData = (data) => {
    return {type: 'SET_TREE_PRODUCT_DATA', data};
};
export const setDiscountTypeData = (data) => {
    return {type: 'SET_DISCOUNT_TYPE', data};
};

export const setGroup = (group) => {
    return {type: 'SET_PUNCH_CARD_GROUP', group};
};

export const setExpendedKeys = (data) => {
    return {type: 'SET_EXPENDED_DATA', data}
};