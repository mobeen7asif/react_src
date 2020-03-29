/*

export const validatePunchCardData = (punchCard) => {(punchCard);
    return (punchCard.name === "" || punchCard.description === "" || punchCard.voucher_amount === "" || punchCard.no_of_use === "" || punchCard.card_color === "" );
*/

/*export const validatePunchCardData = (punchCard, businessList = []) => {
    return (punchCard.name === "" || punchCard.description === ""  || punchCard.voucher_amount === "" || punchCard.no_of_use === "" || punchCard.card_color === ""
    || (businessList.filter(b => b.value)).length === 0) || ((businessList.filter(b => b.value)).length > 1 ? punchCard.group_name === "" : false);
};*/

export const validatePunchCardData = (punchCard, businessList = []) => {
    return (punchCard.name === "" || punchCard.description === ""  || punchCard.voucher_amount === "" || punchCard.no_of_use === "" || punchCard.card_color === "" || punchCard.discount_type ==="");
};

export const validateRecipeData = ({ title = "", description = "", prep_time = "", cook_time = "", method = "",chef="",
    serving = "", image = "", category = "", tags = "", ingredients = "", preparations = ""} = {}) => {
    return (title === "" || description === "" || prep_time === "" || cook_time === "" || method === "" ||
        serving === "" || /*image === "" || */category === "" || chef === "" || tags.length === 0 || ingredients.length === 0 ||
        preparations.length === 0 );
};

export const validateRecipeOfferData = ({ title = "", description = "", image = "", type = "", recipe_id} = {}) => {
    return ( title === "" || description === "" || /*image === "" ||*/ type === "" || (type === "recipe" && !recipe_id));
};

export const validateCharacterData = ({title = "", unique_title = ""} = {}) => {
    return (title === "" || unique_title === "");
};

export const validateReferralData = (referralFriend) => {
    return (referralFriend.referral_points === "" || referralFriend.referred_points === "");
};

export const validateCompetitionData = ({title = "", description = "", start_date = '', end_date = ''} = {}) => {
    return (title === "" || description === "" || start_date === "" ||
    end_date === "" || end_date === null);
};

export const validateIntegratedPunchCardData = (punchCard, variantsLength) => {
    let newPunchCard = (punchCard);
    return (newPunchCard.name === "" || newPunchCard.description === "" ||
        (
            newPunchCard.redemption_type === 'category_product' ? (
                newPunchCard.category_id === "" || (newPunchCard.rule_on === "product" ? newPunchCard.product_id === "" : false)
                || (variantsLength > 0 && newPunchCard.rule_on === "product" ? newPunchCard.parent_id === 0 : false)
                || newPunchCard.rule_on === ""
            ) : (
                newPunchCard.frequency === ""  || newPunchCard.transaction_threshold === ""//|| punchCard.condition === ""
            )
        ) || newPunchCard.voucher_id === "" || newPunchCard.card_color === "" || punchCard.no_of_use === "");
};

export const validateMemberData = (first_name,last_name) => {
    return (first_name === "" || last_name === "");
};

export const addMemberValidation = (first_name,last_name,email,phone,password) => {
    if(first_name === "") {
        return 'First Name is required';
    }
    else if (last_name === "") {
        return 'Last Name is required';
    }
    else if(email === "") {
        return 'Email is required';
    } else if(phone === "") {
        return "";
    }
    /*else if(password === "") {
        return 'Password is required';
    }*/
    else {
        return "";
    }

};
export const validateQuestionsData = (question,answers) => {
    if(question === '') {
        return false;
    }
    if(answers.length === 0) {
        return true;
    }
    else {
        answers.map(function (answer) {
            if(answer === '') {
                return false;
            }

        });
    }
    return true;

};