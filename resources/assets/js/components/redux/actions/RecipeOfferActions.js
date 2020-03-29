export const setByKeyValue = (key, value) => {
    return {'type': 'SET_RECIPE_OFFER_BY_KEY_VALE', value: {[key] : value}};
};

export const setRecipeOfferEditData = ({id = '', location = '', url, title = '', description = '', image = '', recipe_id, type} = {}) => {
    return {type: 'SET_RECIPE_OFFER_EDIT_DATA', value: {location, url, title, description, image, editId: id, type, recipe_id}};
};

export const resetRecipeOfferForm = () => {
    return {type: 'RESET_RECIPE_OFFER_FORM'};
};