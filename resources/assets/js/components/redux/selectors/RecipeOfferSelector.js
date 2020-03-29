export const selectFormData = ({location = '', url = '', title = '', description = '', image = '', editId = 0, type = '', offerTypes = ['recipe', 'global'],
                                   recipeList = [], recipe_id = null,selected_venues=[]} = {}) => {
  return {location, url, title, description, image, editId, type, offerTypes, recipe_id, recipeList,
            dataToSave: {location, url, title, description, image, recipe_id, type, editId,selected_venues}};
};