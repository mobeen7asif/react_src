export default class MessageBuilderValidator {
    gameMissionTypeToCreate = '';

    validate(targetChannels, messageBuilder, triggerType, selectedCampaign = '', gameMissionTypeToCreate = '' ) {

        this.gameMissionTypeToCreate = gameMissionTypeToCreate;

        let result = true;
        Object.keys(targetChannels).forEach((key)=> {
            if (targetChannels[key].isEnabled === true) {
                if (triggerType === 'alert') {
                    result = result && this.validateAlertBuilder(targetChannels[key].channel, messageBuilder[targetChannels[key].channel]);
                } else if (triggerType === 'reward') {
                    result = result && this.validateRewardBuilder(targetChannels[key].channel, messageBuilder[targetChannels[key].channel], selectedCampaign);
                } else if(triggerType === 'game') {
                    result = result && this.validateGameBuilder(targetChannels[key].channel, messageBuilder[targetChannels[key].channel]);
                }//.... end of if-else() .....//
            }//..... end if() .....//
        });

        return result;
    }//..... end of validate() .....//

    validateRewardBuilder(channel, messageBuilder, selectedCampaign) {
        switch (channel) {
            case 'sms':
                return this.validateRewardSmsBuilder(messageBuilder, selectedCampaign);
            case 'push':
                //return this.validateRewardPushBuilder(messageBuilder);
                return this.validateRewardSmsBuilder(messageBuilder, selectedCampaign);
            case 'email':
                return this.validateRewardEmailBuilder(messageBuilder,selectedCampaign);
        }//..... end of switch() .....//
    }//..... end of validateRewardBuilder() .....//

    validateAlertBuilder(channel, messageBuilder) {
        switch (channel) {
            case 'sms':
                return this.validateAlertSmsBuilder(messageBuilder);
            case 'push':
                //return this.validateAlertPushBuilder(messageBuilder);
                return this.validateAlertSmsBuilder(messageBuilder);
            case 'email':
                return this.validateAlertEmailBuilder(messageBuilder);
        }//..... end of switch() .....//
    }//..... end of validateAlertBuilder() .....//

    validateGameBuilder(channel, messageBuilder) {
        switch (channel) {
            case 'sms':
                return this.validateGamePushBuilder(messageBuilder);
            case 'push':
                return this.validateGamePushBuilder(messageBuilder);
            case 'email':
                return this.validateAlertEmailBuilder(messageBuilder);
        }//..... end of switch() .....//
    };//..... end of validateGameBuilder() .....//

    validateRewardSmsBuilder(mBldr, selectedCampaign) {
        let content = mBldr.other.content;
        switch (mBldr.type) {
            case 'voucher':
                return this.validateVoucherPunchCard(mBldr, selectedCampaign);
            case 'integrated-voucher':
                return this.validateVoucherPunchCard(mBldr, selectedCampaign);
            case 'point':
                return !!(mBldr.message !== '' && content.length !== 0 && content.points && content.points !== '');
            case 'token':
                return !!(content.hasOwnProperty('tokens') && content.tokens.tokens !== '' && mBldr.message !== '');
            case 'competition':
                return !!(/*mBldr.other.content.max_entry >= 1 &&*/ mBldr.other.content.entry_interval >= 0 && mBldr.other.content.competition);
            case 'animation':
                return !!(mBldr.other.content.character);
            case 'nooutcome':
                return true;
            case 'stamp-card':
                if(content.hasOwnProperty('punch_count_referred')) {
                    return !!(content.hasOwnProperty('punch_card') && content.punch_card.length > 0 && content.hasOwnProperty('punch_count_referred') &&  content.punch_count_referred.length > 0 && content.hasOwnProperty('punch_count') && content.punch_count !== '');
                }else{
                    return !!(content.hasOwnProperty('punch_card') && content.punch_card.length > 0 && content.hasOwnProperty('punch_count') && content.punch_count !== '');
                }
            default:
                return false;
        }//..... end switch() .....//
    }//..... end of validateRewardSmsBuilder() .....//

    validateGamePushBuilder(mBldr) {
        let content = mBldr.other.content;
        return !!(mBldr.resource !== '' && Object.keys(content).length !== 0 && content.discount && content.discount_type && (typeof content.business === 'object' && Object.keys(content.business).length > 0)
            && content.voucher_end_date && content.voucher_start_date &&
            content.voucher_valid && content.badgeImage && content.promotion_text && content.no_of_uses && content.badgeDescription && content.badgeName);
    };//..... end of validateGamePushBuilder() .....//

    validateRewardPushBuilder(messageBuilder) {
        return true;
    }//..... end of validateRewardPushBuilder() .....//

    validateRewardEmailBuilder(mBldr,selectedCampaign) {
        switch (mBldr.type) {
            case 'template':
                return !!(Object.keys(mBldr.other.emailID).length > 0);
            case 'new_template':
                return true;
            case 'voucher':
                return this.validateVoucherPunchCard(mBldr, selectedCampaign);
            case 'integrated-voucher':
                return this.validateVoucherPunchCard(mBldr, selectedCampaign);
            default:
                return false;
        }//..... end switch() .....//
    }//..... end of validateRewardEmailBuilder() .....//

    validateAlertSmsBuilder(mBldr) {
        switch (mBldr.type) {
            case 'text':
                return !!(mBldr.message);
            case 'image':
            case 'video':
                return !!(mBldr.message && mBldr.resource);
            case 'url':
                return !!(mBldr.message && mBldr.other.url);
            case 'competition':
                return !!(/*mBldr.other.content.max_entry >= 1 &&*/ mBldr.other.content.entry_interval >= 0 && mBldr.other.content.competition);
            case 'animation':
                return !!(mBldr.other.content.character);
            case 'nooutcome':
                return true;
            default:
                return false;
        }//..... end switch() .....//
    }//..... end of validateAlertSmsBuilder() .....//

    validateAlertPushBuilder(mBldr) {

        return true;
    }//..... end of validateAlertPushBuilder() .....//

    validateAlertEmailBuilder(mBldr) {
        return !!(Object.keys(mBldr.other.emailID).length > 0);
        /*switch (mBldr.type) {
            case 'template':
                return !!(mBldr.other.emailID);
            case 'new_template':
                return true;
            default:
                return false;
        } */
    }//..... end of validateAlertEmailBuilder() .....//

    validateVoucherPunchCard(msgbuilder, selectedCampaign) {

        let content = msgbuilder.other.content;
        let billing = false;
        if(!BillingStatus)
            billing = true;

        if(msgbuilder.other.content.hasOwnProperty("billingFields")){
            let billingFields = msgbuilder.other.content.billingFields;
            let total = this.calculateTotal(billingFields);

            if(total !=100)
                billing = false;
            else
                billing = true;
        }

        return !!(billing && Object.keys(content).length !== 0 && content.voucher_id !='' && ((content.showDate)?((content.isNumberOfDays>0)?true:(billing && content.voucher_start_date !=null && content.voucher_start_date!='' && content.voucher_end_date !=null && content.voucher_end_date !='')):true));
    }//--- End of validateVoucherPunchCard() ---//

    validateVoucher(content )
    {
        let result = true;
        let billing = false;
        if(!BillingStatus)
            billing = true;

        if(content.hasOwnProperty("billingFields") && content.billingFields){

            let billingFields = (content.billingFields) ? content.billingFields : {};
            let total = this.calculateTotal(billingFields);

            if(total !=100)
                billing = false;
            else
                billing = true;
        }

        if(content.voucher_type =='integrated')
        result = !!((billing || !billing) && content.name != "" && content.discount_type !='' && ((content.discount_type =='Free')?true:(content.amount !='')) && ((content.pos_ibs) ?(content.pos_ibs !='' && content.pos_ibs.length ==3):true) && ((content.isNumberOfDays!='')?(content.isNumberOfDays):(content.start_date !=null && content.end_date !=null)) && content.image !=''
            && content.voucher_avial_data.length > 0 && content.promotion_text !='' && content.no_of_uses != "" && (Object.keys(content.business).length >0) && ((content.category =='Public Voucher')? (content.quantity >0):true) && content.redemption_rule !='');
        else if(content.voucher_type == 'group-voucher')
            result = !!(content.name != "" && content.voucher_avial_data.length > 0 );
        else
            result = !!((billing || !billing) && content.name != "" && content.discount_type !='' && ((content.discount_type =='Free')?true:(content.amount !='')) && ((content.pos_ibs)?(content.pos_ibs !='' && content.pos_ibs.length ==3):true) && ((content.isNumberOfDays!='')?(content.isNumberOfDays):(content.start_date !=null && content.end_date !=null)) && content.image !=''
                && content.promotion_text !='' && content.no_of_uses != "" && ((content.businessData).length >0) && ((content.category =='Public Voucher')? (content.quantity >0):true) && content.redemption_rule !='');

        return result;

    }//..... end of validate() .....//

    calculateTotal = (fields) => {
        let total = 0;
        Object.keys(fields).map((v,k)=>{
            total = (parseInt(total) + parseInt(fields[v]));
        });
        return parseInt(total);
    }


}//..... end of MessageBuilderValidator.