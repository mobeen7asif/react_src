import React from "react";

class NewSegmentValidator{
    validate = (newSegmentData) => {
        let result = true;

        if (newSegmentData.name === "" || newSegmentData.description === "")
            return false;

        if (newSegmentData.criterias && newSegmentData.criterias.length > 0) {
            newSegmentData.criterias.forEach((obj) => {
                result = result && this.detailValidator(obj);
            });
        } else {
            result = false;
        }//..... end if() .....//

        return result;
    };//..... end of validate() .....//

    detailValidator = (obj) => {

        let name = obj.name;
        //let fieldType = this.getFieldTypeByid(name);
        let fieldType = obj.hasOwnProperty("field_type") ? obj.field_type : "not_found_component";
        if(fieldType == "number")
            return !!(obj.value.number);

        if(fieldType == "text")
            return !!(obj.value.number);

        if(fieldType == "date")
            return this.validateCustomDate(obj.value);
        if(fieldType == "datetime")
            return this.validateCustomDate(obj.value);

        if(fieldType == "bollean")
            return true;

        if(fieldType == "dropdown")
            return !!((obj.value.hasOwnProperty("custom_drop_down") && obj.value.custom_drop_down.length > 0));


        switch (name) {
            case 'allUsers':
                return true;
            case 'gender':
                return !!(obj.value.length > 0);
                //return !!obj.value;
            case 'date_of_birth':
                return !!obj.value;
            case 'residential_address.state':
                return !!obj.value.length;
            case 'residential_address.postal_code':
                return !!obj.value.length;

            case 'membership_type_id':
                return !!obj.value.length;
            case 'membership_status':
                return !!obj.value;
            case 'point_balance':
                return this.validatePointBalance(obj.value);
            case 'rating_grade_id':
                return !!obj.value.length;
            case 'creation_datetime':
                return this.validateMembershipJoinDate(obj.value);
            case 'expiry_datetime':
                return this.validateMembershipExpiry(obj.value);
            case 'membership_number':
                return this.validateMembershipNumber(obj.value);
            case 'bulk_member_import':
                return !! obj.value;


            case 'gaming_player':
                return !! obj.value;
            case 'gaming_turnover':
                return this.validateGamingTurnOver(obj.value);
            case 'gaming_spend':
                return this.validateGamingSpend(obj.value);
            case 'cancel_credit_amount':
                return this.validateCancelCreditAmount(obj.value);
            case 'recent_tickets':
                return !!(obj.value.v1 && obj.value.v2);
            case 'last_updated_datetime':
                return !!(obj.value.v1 && obj.value.v2 /*&& obj.value.v3*/);
            case 'Gaming_Spend_Time':
                return !! obj.value;
            case 'Gaming_Spend_day':
                return !! obj.value;

            case 'pos_spend_date':
                return this.validatePosSpendDate(obj.value);
            case 'pos_location':
                return this.validatePosLocation(obj.value);
            case 'pos_sale_item':
                return !! obj.value.length;
            case 'POS_Spend_Time':
                return !! obj.value;

            case 'venue':
                return this.validateVenue(obj.value);
            case 'scan_qr_code':
                return !!(obj.value.qr_code && obj.value.interval >= 0);
            case 'user_sign_up':
                return true;
            case 'user_gps_detect':
                return !!(obj.value && obj.interval >= 0);
            case 'user_optional_field':
                return !!(obj.value);

            case 'voucher_expiry':
                return !!(obj.value.days && (obj.value.hasOwnProperty("vouchers") && obj.value.vouchers.length > 0) && obj.value.status);
            case 'reffered_user':
                return true;
            case 'voucher_status':
                return !!(obj.value.status && (obj.value.hasOwnProperty("vouchers") && obj.value.vouchers.length > 0));
            case 'punch_card_status':
                return !!(obj.value.status && (obj.value.hasOwnProperty("vouchers") && obj.value.vouchers.length > 0));
            case 'token_not_used':
                return !!(obj.value.hours);
            case 'token_used_in_charity':
                return !!(obj.value.status);
            case 'token_used':
                return !!(obj.value.tokens && obj.value.status);
            case 'last_login':
                return !!(obj.value.days && obj.value.status);
            case 'reffering_users':
                return !!(obj.value.count_users && obj.value.status);
            case 'enter_venue':
                return !!(obj.value.status && obj.value.venue_id > 0 && obj.value.days > 0);
            case 'birth_day':
                return this.validateBirthDay(obj.value);
            case 'completed_survey':
                return !!(obj.value.name);
            case 'seen_videos':
                return !!(obj.value.video_name);
            case 'campaign_triggers':
                return !!(obj.value.campaign_name && obj.value.campaign_id > 0 && obj.value.number_of_users);
            case 'default_venue':
                return !!(obj.value.venue_name);
            case 'member_group':
                return !!(obj.value.id);
            case 'user_source':
                return !!(obj.value.id);
            case 'last_transaction':
                return this.lastTransaction(obj.value);
            case 'total_spending':
                return !!(obj.value.amount > 0 && obj.value.status);
            case 'spender_percentage':
                return !!(obj.value.percentage);
            case 'average_basket_value':
                return !!(obj.value.amount > 0 && obj.value.status);
            case 'spender_percentage':
                return !!(obj.value.percentage);
            case 'postal_code':
                return !!(obj.value.postcode);
            case 'user_activity':
                return !!( (obj.value.hasOwnProperty("activity") && obj.value.activity.length > 0));
            case 'gap_map_users':
                return true;

            case 'target_users':
                return !!(obj.value.id);
            case 'user_region':
                return !!(obj.value.id);
            case 'transaction_amount':
                return !!(obj.value.amount > 0 && obj.value.status);
            case 'referral_user':
                return true;
            case 'venue_store_name':
                return !!(obj.value.listStores.length > 0);
            default:
                return false;
        }//..... end switch() .....//
    };//..... end of detailValidator() .....//

    validatePointBalance = (value) => {
        return (value.pv1 === 'Between') ?
            !!(value.pv1 && /*value.pv2 &&*/ value.v1 && value.v2) :
            !!(value.pv1 /*&& value.pv2*/ && value.v1);
    };//..... end of validatePointBalance() .....//

    validateMembershipJoinDate = (value) => {
        return (value.memberJoin === 'Between') ?
            !!(value.memberJoin && value.fromDate && value.toDate) :
            !!(value.memberJoin && value.fromDate);
    };//..... end of validateMembershipJoinDate() .....//

    validateCustomDate = (value) => {
        return (value.customDate === 'Between') ?
            !!(value.customDate && value.fromDate && value.toDate) :
            !!(value.customDate && value.fromDate);
    };//..... end of validateCustomDate() .....//



    validateBirthDay = (value) => {
        return (value.birthDayStatus === 'Between') ?
            !!(value.birthDayStatus && value.fromDate && value.toDate) :
            !!(value.birthDayStatus && value.fromDate);
    };//..... end of validateBirthDay() .....//



    validateMembershipExpiry = (value) => {
        return (value.memberExpire === 'Between') ?
            !!(value.memberExpire && value.fromDate && value.toDate) :
            !!(value.memberExpire && value.fromDate);
    };//..... end of validateMembershipExpiry() .....//

    validateMembershipNumber = (value) => {
        return value.memberNumber === "Between" ? !!(value.memberNumber && value.from && value.to) : !!(value.memberNumber && value.from);
    };//..... end of validateMembershipNumber() .....//

    validateGamingTurnOver = (value) => {
        return (value.gaming_turnover.condition === "Between" ? !!(value.gaming_turnover.condition && value.gaming_turnover.v1 && value.gaming_turnover.v2) :
            !! (value.gaming_turnover.condition && value.gaming_turnover.v1)) &&
            (value.transaction_date.condition === "Between" ?
                !! (value.transaction_date.condition && value.transaction_date.fromDate && value.transaction_date.toDate) :
                !!(value.transaction_date.condition && value.transaction_date.fromDate))
    };//..... end of validateGamingTurnOver() .....//

    validateGamingSpend = (value) => {
        return (value.gaming_spend.condition === "Between" ? !!(value.gaming_spend.condition && value.gaming_spend.v1 && value.gaming_spend.v2) :
            !! (value.gaming_spend.condition && value.gaming_spend.v1)) &&
            (value.transaction_date.condition === "Between" ?
                !! (value.transaction_date.condition && value.transaction_date.fromDate && value.transaction_date.toDate) :
                !!(value.transaction_date.condition && value.transaction_date.fromDate))
    };//..... end of validateGamingSpend() .....//

    validateCancelCreditAmount = (value) => {
        return (value.condition === "Between") ? !!(value.condition && value.fromDate && value.toDate && value.v1 && value.v2) :
            !!(value.condition && value.fromDate && value.v1);
    };//..... end of validateCancelCreditAmount() .....//

    validatePosSpendDate = (value) => {
        return (value.condition === 'Between') ? !!(value.condition && value.fromDate && value.toDate)
            : !!(value.condition && value.fromDate)
    };//..... end of validatePosSpendDate() .....//

    validatePosLocation = (value) => {
        return true;
    };//..... end of validatePosLocation() .....//

    validateVenue = (value) => {
        return !!(value.beacons.length && value.member && value.trigger && value.condition &&
            (value.condition === "Between" ? value.fromDate && value.toDate : value.fromDate))
    };//..... end of validateVenue() .....//


    lastTransaction = (value) => {
        return (value.transactionType === 'Between') ?
            !!(value.transactionType && value.fromDate && value.toDate) :
            !!(value.transactionType && value.fromDate);
    };//..... end of validateMembershipJoinDate() .....//

    getFieldTypeByid = (id) => {
        let memberCustomFields= JSON.parse(localStorage.getItem('memberCustomFields'));
        let field_name = memberCustomFields.filter((value)=>{
            return value.field_unique_id == id;
        });
        return field_name.length > 0 ? field_name[0].field_type : "";
    }


}//..... end of NewSegmentValidator.

export default NewSegmentValidator;