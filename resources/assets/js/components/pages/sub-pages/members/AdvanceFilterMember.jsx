import React, {Component} from 'react';
import {connect} from "react-redux";
import {findIndex} from 'lodash';
import {NotificationManager} from "react-notifications";
import {addNewSearchMemberValue, addNewSegmentValue} from "../../../redux/actions/CampaignBuilderActions";
import { Droppable } from 'react-drag-and-drop'
import DemographicCriteria
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/DemographicCriteria";
import MembershipCriteria
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriteria";
import GamingActivityCriteria
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/GamingActivityCriteria";
import PosActivityCriteria
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/PosActivityCriteria";
import VenueUtilizationCriteria
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/VenueUtilizationCriteria";
import MissionCriteria
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MissionCriteria";
import Gender
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/DemographicCriterias/Gender";
import AllUsers
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/DemographicCriterias/AllUsers";
import Age from "../campaigns/campaign-builder/components/segment_components/segment_builder/DemographicCriterias/Age";
import PostCode
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/DemographicCriterias/PostCode";
import MembershipType
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/MembershipType";
import MembershipStatus
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/MembershipStatus";
import PointBalance
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/PointBalance";
import RatingCard
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/RatingCard";
import MembershipJoinDate
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/MembershipJoinDate";
import MembershipExpiry
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/MembershipExpiry";
import MembershipNumber
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/MembershipNumber";
import GamingPlayer
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/GamingActivityCriterias/GamingPlayer";
import GamingTurnover
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/GamingActivityCriterias/GamingTurnover";
import GamingSpend
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/GamingActivityCriterias/GamingSpend";
import CancelCreditAmount
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/GamingActivityCriterias/CancelCreditAmount";
import RecentTickets
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/GamingActivityCriterias/RecentTickets";
import DrawWinner
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/GamingActivityCriterias/DrawWinner";
import GamingSpendTime
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/GamingActivityCriterias/GamingSpendTime";
import GamingSpendOn
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/GamingActivityCriterias/GamingSpendOn";
import PosSpendDate
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/PosActivityCriterias/PosSpendDate";
import PosLocation
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/PosActivityCriterias/PosLocation";
import PosSaleItem
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/PosActivityCriterias/PosSaleItem";
import PosSpendTime
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/PosActivityCriterias/PosSpendTime";
import VenueUtilization
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/VenueUtilizationCriterias/VenueUtilization";
import ScanQrCode
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MissionCriterias/ScanQrCode";
import State
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/DemographicCriterias/State";
import MemberList from "./MemberList";
import MemberJoinDate from "./MemberJoinDate";
import UserSignUp
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MissionCriterias/UserSignUp";
import UserLiveLocation
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MissionCriterias/UserLiveLocation";
import UserOptionalFields
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MissionCriterias/UserOptionalFields";
import VoucherExpiry
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/PromotionCriterias/VoucherExpiry";
import VoucherStatus
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/PromotionCriterias/VoucherStatus";
import PunchCardStatus
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/PromotionCriterias/PunchCardStatus";
import TokenNotUsed
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/PromotionCriterias/TokenNotUsed";
import TokenUsedInCharity
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/PromotionCriterias/TokenUsedInCharity";
import TokenUsed
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/PromotionCriterias/TokenUsed";
import LastLogin
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/LastLogin";
import RefferingUser
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/RefferingUser";
import RefferedUser
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/RefferedUser";
import EnterVenue
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/EnterVenue";
import BirthDay1
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/DemographicCriterias/BirthDay";
import CompletedSurvey
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/PromotionCriterias/CompletedSurvey";
import SeenVideo
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/PromotionCriterias/SeenVideo";
import CampaignTriggers
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/PromotionCriterias/CampaignTriggers";
import DefaultVenue
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/DefaultVenue";
import MemberGroup
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/PromotionCriterias/MemberGroup";
import UserSource
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/UserSource";
import LastTransaction
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/LastTransaction";
import TotalSpending
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/TotalSpending";
import SpenderPercentage
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/SpenderPercentage";
import PromotionCriteria
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/PromotionCriteria";

import AverageBasketValue
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/AverageBasketValue";
import PostCodeNew
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/DemographicCriterias/PostCodeNew";
import Activity
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MembershipCriterias/Activity";
import MemberCustomFieldCriteria
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/MemberCustomFieldCriteria";
import CustomNumber
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/CustomFieldCriteria/CustomNumber";
import CustomText
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/CustomFieldCriteria/CustomText";
import CustomDate
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/CustomFieldCriteria/CustomDate";
import CustomBoolean
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/CustomFieldCriteria/CustomBoolean";
import CustomDateTime
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/CustomFieldCriteria/CustomDateTime";
import CustomMultiSelect
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/CustomFieldCriteria/CustomMultiSelect";
import CustomDropDown
    from "../campaigns/campaign-builder/components/segment_components/segment_builder/CustomFieldCriteria/CustomDropDown";



class AdvanceFilterMember extends Component {

    dropZone = null;

    state = {
        avg_spend: 0,
        avg_basket_size: 0,
        members_count: 0,
        new_members_count : 0,
        filter : 'day',
        venueFields: JSON.parse(localStorage.getItem('memberCustomFields')),
        user_form: JSON.parse(localStorage.getItem('user_form'))
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidMount = () => {
        $(".clickAccordian").click(function() {
            if (!$(this).hasClass('active')) {
                $(".segments_accordian ul li a").removeClass("active");
                $(this).addClass("active");
                $(".clickAccordian_show").stop().slideUp(500);
                $(this).parent(".segments_accordian ul li").find(".clickAccordian_show").stop().slideDown();
            } else {
                $(this).removeClass("active");
                $(this).parent(".segments_accordian ul li").find(".clickAccordian_show").stop().slideUp(500);
            }//..... end if() .....//
        });
        this.checkAndAddClassToDropZone();
        this.props.dispatch(addNewSearchMemberValue({criterias: []}));
    };

    removeCriteria = (criteria) => {
        let modifiedCriterias = this.props.member_search.criterias.filter((obj) => obj.name !== criteria);
        this.props.dispatch(addNewSearchMemberValue({criterias: modifiedCriterias}));
// document.querySelector(`#${criteria.replace('.','_')}Criteria`).classList.remove('disableCriteria');
    };//..... end of removeCriteria() .....//

    componentDidCatch = (error, info) => {

    };//...... end of componentDidCatch() .....//
    componentDidUpdate = () => {
        this.checkAndAddClassToDropZone();
    };//..... end of componentDidUpdate() .....//

    checkAndAddClassToDropZone = () => {
        if ((!this.props.member_search.criterias) || (this.props.member_search.criterias && this.props.member_search.criterias.length === 0))
            $("#segmentDropZone_id").addClass("image_notify_upload_area");//this.dropZone.classList.add('image_notify_upload_area');
    };//..... end of checkAndAddClassToDropZone() .....//

    onDrop = (data) => {
        this.dropZone.classList.remove('image_notify_upload_area');
        this.addCriteria(data.tags);
    };//..... end of onDrop() .....//

    handleCriteriaDoubleClick = (criteria) => {
        this.dropZone.classList.remove('image_notify_upload_area');
        this.addCriteria(criteria);
    };//..... end of handleCriteriaDoubleClick() .....//

    addCriteria = (criteria) => {
        let newSearch = this.props.member_search ? this.props.member_search : [];
        let newCriteria = this.setDefaultValue(criteria);

        if (criteria !== 'allUsers' && newSearch.criterias)
            newSearch.criterias.unshift(newCriteria);
        else
            newSearch.criterias = [newCriteria];
        this.props.dispatch(addNewSearchMemberValue({criterias: newSearch.criterias}));
        document.querySelector(`#${criteria.replace('.','_')}Criteria`).classList.add('disableCriteria');
    };//..... end of addCriteria() ......//

    setCriteriaValue = (criteria, name, value) => {
        let preCriterias = this.props.member_search.criterias ? this.props.member_search.criterias : [];

        let index = findIndex(preCriterias, (o)=> o.name === criteria);
        if (index >= 0)
            preCriterias[index][name] = value;
        else {
            preCriterias.push({name: criteria, [name] : value});
        }//..... end if-else() .....//
        this.props.dispatch(addNewSearchMemberValue({criterias: preCriterias}));
    };//.....end of setCriteriaValue() .....//

    getSpecifiedCriteria = (criteria) => {
        let fieldType = this.getFieldTypeByid(criteria.name);
        fieldType = criteria.hasOwnProperty("field_type") ? criteria.field_type : "not_found_component";


        if(criteria.field_type == "number"){
            return <CustomNumber key={criteria.name} field_name={criteria.field_name} criteria={criteria} component_name={criteria.name}  removeCriteria={this.removeCriteria}
                                 setCriteriaValue={this.setCriteriaValue}/>;
        }
        if(fieldType == "text"){
            return <CustomText key={criteria.name} field_name={criteria.field_name} criteria={criteria} component_name={criteria.name}  removeCriteria={this.removeCriteria}
                               setCriteriaValue={this.setCriteriaValue}/>;
        }
        if(fieldType == "date"){
            return <CustomDate key={criteria.name} field_name={criteria.field_name} criteria={criteria} component_name={criteria.name}  removeCriteria={this.removeCriteria}
                               setCriteriaValue={this.setCriteriaValue}/>;
        }
        if(fieldType == "bollean"){
            return <CustomBoolean key={criteria.name} field_name={criteria.field_name} criteria={criteria} component_name={criteria.name}  removeCriteria={this.removeCriteria}
                                  setCriteriaValue={this.setCriteriaValue}/>;
        }

        if(fieldType == "datetime"){
            return <CustomDateTime key={criteria.name} criteria={criteria} component_name={criteria.name}  removeCriteria={this.removeCriteria}
                                   setCriteriaValue={this.setCriteriaValue}/>;
        }

        if(fieldType == "dropdown"){
            let is_multiSelect = this.isMultiSelect(criteria.name);
            if(is_multiSelect == true){
                return <CustomMultiSelect key={criteria.name} criteria={criteria} is_multiSelect={is_multiSelect} component_name={criteria.name}  removeCriteria={this.removeCriteria}
                                          setCriteriaValue={this.setCriteriaValue}/>;
            }else{
                return <CustomDropDown key={criteria.name} criteria={criteria} is_multiSelect={is_multiSelect} component_name={criteria.name}  removeCriteria={this.removeCriteria}
                                       setCriteriaValue={this.setCriteriaValue}/>;
            }



        }

        switch (criteria.name) {
            case 'gender':
                return <Gender key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'allUsers':
                return <AllUsers key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'date_of_birth':
                return <Age key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'residential_address.state':
                return <State key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'residential_address.postal_code':
                return <PostCode key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'membership_type_id':
                return <MembershipType key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'membership_status':
                return <MembershipStatus key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'point_balance':
                return <PointBalance key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'rating_grade_id':
                return <RatingCard key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'creation_datetime':
                return <MemberJoinDate key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'expiry_datetime':
                return <MembershipExpiry key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'membership_number':
                return <MembershipNumber key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'bulk_member_import':
                return <BulkMemberImport key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;

            case 'gaming_player':
                return <GamingPlayer key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'gaming_turnover':
                return <GamingTurnover key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'gaming_spend':
                return <GamingSpend key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'cancel_credit_amount':
                return <CancelCreditAmount key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'recent_tickets':
                return <RecentTickets key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'last_updated_datetime':
                return <DrawWinner key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'Gaming_Spend_Time':
                return <GamingSpendTime key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'Gaming_Spend_day':
                return <GamingSpendOn key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;

            case 'pos_spend_date':
                return <PosSpendDate key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'pos_location':
                return <PosLocation key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'pos_sale_item':
                return <PosSaleItem key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'POS_Spend_Time':
                return <PosSpendTime key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;

            case 'venue':
                return <VenueUtilization key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;

            case 'scan_qr_code':
                return <ScanQrCode key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria} setCriteriaValue={this.setCriteriaValue}/>;
            case 'user_sign_up':
                return <UserSignUp key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                   setCriteriaValue={this.setCriteriaValue}/>;
            case 'user_gps_detect':
                return <UserLiveLocation key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                         setCriteriaValue={this.setCriteriaValue}/>;
            case 'user_optional_field':
                return <UserOptionalFields key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                           setCriteriaValue={this.setCriteriaValue}/>;
            case 'voucher_expiry':
                return <VoucherExpiry key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                      setCriteriaValue={this.setCriteriaValue}/>;
            case 'voucher_status':
                return <VoucherStatus key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                      setCriteriaValue={this.setCriteriaValue}/>;

            case 'punch_card_status':
                return <PunchCardStatus key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                        setCriteriaValue={this.setCriteriaValue}/>;

            case 'token_not_used':
                return <TokenNotUsed key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                     setCriteriaValue={this.setCriteriaValue}/>;

            case 'token_used_in_charity':
                return <TokenUsedInCharity key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                           setCriteriaValue={this.setCriteriaValue}/>;

            case 'token_used':
                return <TokenUsed key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                  setCriteriaValue={this.setCriteriaValue}/>;
            case 'last_login':
                return <LastLogin key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                  setCriteriaValue={this.setCriteriaValue}/>;
            case 'reffering_users':
                return <RefferingUser key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                      setCriteriaValue={this.setCriteriaValue}/>;

            case 'reffered_user':
                return <RefferedUser key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                     setCriteriaValue={this.setCriteriaValue}/>;
            case 'enter_venue':
                return <EnterVenue key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                   setCriteriaValue={this.setCriteriaValue}/>;
            case 'birth_day':
                return <BirthDay1 key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                  setCriteriaValue={this.setCriteriaValue}/>;
            case 'completed_survey':
                return <CompletedSurvey key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                        setCriteriaValue={this.setCriteriaValue}/>;

            case 'seen_videos':
                return <SeenVideo key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                  setCriteriaValue={this.setCriteriaValue}/>;
            case 'campaign_triggers':
                return <CampaignTriggers key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                         setCriteriaValue={this.setCriteriaValue}/>;
            case 'default_venue':
                return <DefaultVenue key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                     setCriteriaValue={this.setCriteriaValue}/>;
            case 'member_group':
                return <MemberGroup key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                    setCriteriaValue={this.setCriteriaValue}/>;
            case 'user_source':
                return <UserSource key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                   setCriteriaValue={this.setCriteriaValue}/>;
            case 'last_transaction':
                return <LastTransaction key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                        setCriteriaValue={this.setCriteriaValue}/>;
            case 'total_spending':
                return <TotalSpending key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                      setCriteriaValue={this.setCriteriaValue}/>;
            case 'spender_percentage':
                return <SpenderPercentage key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                          setCriteriaValue={this.setCriteriaValue}/>;


            case 'average_basket_value':
                return <AverageBasketValue key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}

                                           setCriteriaValue={this.setCriteriaValue}/>;
            case 'postal_code':
                return <PostCodeNew key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                    setCriteriaValue={this.setCriteriaValue}/>;
            case 'user_activity':
                return <Activity key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                 setCriteriaValue={this.setCriteriaValue}/>;
            case 'transaction_amount':
                return <Activity key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                 setCriteriaValue={this.setCriteriaValue}/>;
            default:
                return "Couldn't fetch the component.....";
        }//..... end switch() .....//
    };//..... end of getSpecifiedCriteria() .....//

    setDefaultValue = (criteria) => {
        let newCriteria = {name: criteria};
        let fieldType = this.getFieldTypeByid(criteria);
        let fieldName = this.getCustomFieldName(criteria);

        if(fieldType == "number"){
            newCriteria.value = {number: '',field_name:fieldName,field_type:fieldType};
            newCriteria.field_name = fieldName;
            newCriteria.field_type = fieldType;
            return newCriteria;
        }
        if(fieldType == "date"){
            newCriteria.value = {fromDate:null,toDate:null,customDate:null,field_name:fieldName,field_type:fieldType};
            newCriteria.field_name = fieldName;
            newCriteria.field_type = fieldType;
            return newCriteria;
        }

        if(fieldType == "datetime"){
            newCriteria.value = {fromDate:null,toDate:null,customDate:null,field_name:fieldName,field_type:fieldType};
            newCriteria.field_name = fieldName;
            newCriteria.field_type = fieldType;
            return newCriteria;
        }
        if(fieldType == "text"){
            newCriteria.value = {number: '',field_name:fieldName,field_type:fieldType};
            newCriteria.field_name = fieldName;
            newCriteria.field_type = fieldType;
            return newCriteria;
        }

        if(fieldType == "bollean"){
            newCriteria.value = {is_true: false,field_name:fieldName,field_type:fieldType};
            newCriteria.field_name = fieldName;
            newCriteria.field_type = fieldType;
            return newCriteria;
        }

        if(fieldType == "dropdown"){
            newCriteria.value = {custom_drop_down: [],field_name:fieldName,field_type:fieldType};
            newCriteria.field_name = fieldName;
            newCriteria.field_type = fieldType;
            return newCriteria;
        }


        switch (criteria) {
            case 'gender':
                newCriteria.value = 'male';
                break;
            case 'allUsers':
                newCriteria.value = 'allUsers';
                break;
            case 'date_of_birth':
                newCriteria.value = '20-50';
                break;

            case 'residential_address.postal_code':
            case 'membership_type_id':
            case 'rating_grade_id':
            case 'pos_sale_item':
            case 'residential_address.state':
                newCriteria.value = [];
                break;
            case 'bulk_member_import':
            case 'Gaming_Spend_Time':
            case 'POS_Spend_Time':
            case 'membership_status':
                newCriteria.value = '';
                break;
            case 'point_balance':
                newCriteria.value = {pv1: '', pv2: '', v1: '', v2: ''};
                break;
            case 'creation_datetime':
                newCriteria.value = {memberJoin: '', fromDate: null, toDate: null};
                break;
            case 'expiry_datetime':
                newCriteria.value = {memberExpire: '', fromDate: null, toDate: null};
                break;
            case 'membership_number':
                newCriteria.value = {memberNumber: '', from: null, to: null};
                break;
            case 'gaming_turnover':
                newCriteria.value = {gaming_turnover: {condition: '', v1: '', v2: ''}, transaction_date: {condition: '', fromDate: null, toDate: null}};
                break;
            case 'gaming_spend':
                newCriteria.value = {gaming_spend: {condition: '', v1: '', v2: ''}, transaction_date: {condition: '', fromDate: null, toDate: null}};
                break;
            case 'cancel_credit_amount':
                newCriteria.value = {condition: '', v1: null, v2: null, fromDate: '', toDate: ''};
                break;
            case 'recent_tickets':
                newCriteria.value = {v1: '', v2: ''};
                break;
            case 'last_updated_datetime':
                newCriteria.value = {v1: '', v2: '', v3: ''};
                break;
            case 'pos_location':
            case 'pos_spend_date':
                newCriteria.value = {condition: '', fromDate: null, toDate: null};
                break;
            case 'venue':
                newCriteria.value = {member:'', trigger: '', beacons: [], condition: '', fromDate: null, toDate: null};
                break;
            case 'scan_qr_code':
                newCriteria.value = {qr_code: ''};
                break;

            case 'voucher_expiry':
                newCriteria.value = {days: null,campaign_id: null,voucher_name: null,status:null,vouchers:[]};
                break;
            case 'voucher_status':
                newCriteria.value = {status: null,campaign_id: null,voucher_name: null,vouchers:[]};
                break;
            case 'punch_card_status':
                newCriteria.value = {status: null, id: null, name: null,vouchers:[]};
                break;
            case 'token_not_used':
                newCriteria.value = {hours: null};
                break;
            case 'token_used_in_charity':
                newCriteria.value = {status: null,charity_id:0};
                break;
            case 'token_used':
                newCriteria.value = {tokens: null,status:null};
                break;
            case 'last_login':
                newCriteria.value = {days: null,status:null};
                break;
            case 'reffering_users':
                newCriteria.value = {count_users: null,status:null};
                break;
            case 'enter_venue':
                newCriteria.value = {status: null, venue_id: null, name: null,days:null};
                break;

            case 'birth_day':
                newCriteria.value = {birthDayStatus: '', fromDate: null, toDate: null};
                break;
            case 'completed_survey':
                newCriteria.value = {name: null,survey_id:0};
                break;
            case 'seen_videos':
                newCriteria.value = {video_name: null,video_id:0};
                break;
            case 'campaign_triggers':
                newCriteria.value = {campaign_name: null,campaign_id:0,number_of_users:null};
                break;
            case 'default_venue':
                newCriteria.value = {venue_id: null,venue_name:0};
                break;
            case 'member_group':
                newCriteria.value = {id: null,group_name:0};
                break;
            case 'reffered_user':
                newCriteria.value = {is_refferd: false};
                break;
            case 'last_transaction':
                newCriteria.value = {transactionType: '', fromDate: null, toDate: null};
                break;
            case 'total_spending':
                newCriteria.value = {amount: null,status:null};
                break;

            case 'spender_percentage':
                newCriteria.value = {percentage: ''};
                break;

            case 'postal_code':
                newCriteria.value = {postcode: ''};
                break;
            case 'user_source':
                newCriteria.value = {id: null,group_name:0};
                break;
            case 'average_basket_value':
                newCriteria.value = {amount: null,status:null};
                break;
            case 'postal_code':
                newCriteria.value = {postcode: ''};
                break;
            case 'user_activity':
                newCriteria.value = {status:null};
                break;
            case 'transaction_amount':
                newCriteria.value = {amount: null};
                break;
        }//..... end switch() ......//

        return newCriteria;
    };//..... end of

    getCustomFieldName = (segment_name) => {
        let memberCustomFields= JSON.parse(localStorage.getItem('all_custom_fields'));
        let field_name = memberCustomFields.filter((value)=>{
            return value.field_unique_id == segment_name;
        });
        return field_name.length > 0 ? field_name[0].search_name : "";
    }

    getFieldTypeByid = (id) => {
        let memberCustomFields= JSON.parse(localStorage.getItem('all_custom_fields'));
        let field_name = memberCustomFields.filter((value)=>{
            return value.field_unique_id == id;
        });
        return field_name.length > 0 ? field_name[0].field_type : "";
    }

    isMultiSelect = (id) => {
        let memberCustomFields= JSON.parse(localStorage.getItem('all_custom_fields'));
        let field_name = memberCustomFields.filter((value)=>{
            return value.field_unique_id == id;
        });
        return field_name[0].is_multi_select;
    }

    checkSegmentCriteria =(type,field_name)=>{
        let  dataArray= JSON.parse(localStorage.getItem('segment_data'));
        console.log("dataArray",dataArray);

        let index = dataArray.findIndex(x => x.type === type)
        let jsonData = JSON.parse(dataArray[index].field2);
        let jsonInde = jsonData.findIndex(t=>t.name ===field_name);
        return jsonData[jsonInde].show;

    }


    render() {
        return (
            <div className="awesome">
                <Droppable types={['tags']} onDrop={this.onDrop}>
                    <div className="segment_tYpe">
                        <div className="segment_tYpe_detail">
                            <div id="adv_filter" className="segmentsBuilder_container clearfix advance_search_div" style={{'display': 'block'}}>
                                <div className="segmentsSection_left">
                                    <div className="segment_heading">
                                        <h3>FILTERS</h3>
                                    </div>
                                    <div className="segmentsAccordianList">
                                        <div className="segments_accordian">
                                            <div className="acordianSeprator">&nbsp;</div>
                                            <ul>
                                                <DemographicCriteria handleCriteriaDoubleClick={this.handleCriteriaDoubleClick} criterias={this.props.member_search.criterias} checkSegmentCriteria={this.checkSegmentCriteria} />
                                                <MembershipCriteria handleCriteriaDoubleClick={this.handleCriteriaDoubleClick} criterias={this.props.member_search.criterias} checkSegmentCriteria={this.checkSegmentCriteria} />

                                                {(this.state.venueFields.length > 0 && this.state.venueFields[0].field_name !="") && (
                                                    <MemberCustomFieldCriteria segment_name="Custom Fields: Members" handleCriteriaDoubleClick={this.handleCriteriaDoubleClick} listSegments={this.state.venueFields} criterias={this.props.member_search.criterias} checkSegmentCriteria={this.checkSegmentCriteria} />
                                                )}

                                                {this.state.user_form.length > 0 && (
                                                    this.state.user_form.map((value,key)=>{

                                                        return (
                                                            <MemberCustomFieldCriteria
                                                                key={key+"_form"}
                                                                handleCriteriaDoubleClick={this.handleCriteriaDoubleClick}
                                                                criterias={this.props.member_search.criterias}
                                                                listSegments={value.custom_fields}
                                                                segment_name={"Custom Fields: "+value.field_label}
                                                            />
                                                        )
                                                    })
                                                )}
                                                {/*<GamingActivityCriteria handleCriteriaDoubleClick={this.handleCriteriaDoubleClick} criterias={this.props.member_search.criterias} />*/}
                                                {/*<PosActivityCriteria handleCriteriaDoubleClick={this.handleCriteriaDoubleClick} criterias={this.props.member_search.criterias} />*/}
                                                {/*<VenueUtilizationCriteria handleCriteriaDoubleClick={this.handleCriteriaDoubleClick} criterias={this.props.member_search.criterias} />*/}
                                                <MissionCriteria handleCriteriaDoubleClick={this.handleCriteriaDoubleClick} criterias={this.props.member_search.criterias} checkSegmentCriteria={this.checkSegmentCriteria} />
                                                <PromotionCriteria handleCriteriaDoubleClick={this.handleCriteriaDoubleClick} criterias={this.props.member_search.criterias} checkSegmentCriteria={this.checkSegmentCriteria} />

                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="segmentsSection_right">
                                    <div className="segment_heading segmentaxn_heading">
                                        <h3>YOUR SEGMENTATION</h3>
                                    </div>
                                    <div className="segmentaxn_detail">
                                        <div className="segmentDropZone" id="segmentDropZone_id" ref={(ref) => {this.dropZone = ref;}}>
                                            {(this.props.member_search.criterias ? this.props.member_search.criterias : []).
                                            map((scrit) => {
                                                return this.getSpecifiedCriteria(scrit)
                                            })}
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </Droppable>
            </div>
        );
    }//..... end of render() .....//
}//..... end of Member.



const mapStateToProps = (state) => {
    return {member_search: state.searchMember};
};

export default connect(mapStateToProps)(AdvanceFilterMember);