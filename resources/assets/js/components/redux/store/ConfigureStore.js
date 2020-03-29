import {createStore, combineReducers} from 'redux';
import CampaignBuilderReducer from '../reducers/CampaignBuilderReducer'
import PunchCardReducer from "../reducers/PunchCardReducer";
import GymReducer from "../reducers/GymReducer";
import RecipeOfferReducer from "../reducers/RecipeOfferReducer";
import ReferralReducer from "../reducers/ReferralReducer";
import SearchMemberReducer from "../reducers/SearchMemberReducer";
import headerVenueDropDownReducer from "../reducers/headerVenueDropDownReducer";
import SurveyBuilderReducer from "../reducers/SurveyBuilderReducer";
import VoucherReducer from "../reducers/VoucherReducer";


export default () => {
    return createStore(combineReducers({
        campaignBuilder : CampaignBuilderReducer,
        punchCard       : PunchCardReducer,
        gym             : GymReducer,
        recipeOffer     : RecipeOfferReducer,
        referralFriend  : ReferralReducer,
        searchMember     : SearchMemberReducer,
        headerVenueId     : headerVenueDropDownReducer, // new by zeshan
        surveyBuilder     : SurveyBuilderReducer,
        voucherBuilder     : VoucherReducer
    }),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        );
};