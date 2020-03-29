import {find} from "lodash";
import moment from "moment";

export const selectMessageBuilderObject = (messageBuilder, channel) => {
    return messageBuilder[channel];
};
export const selectPunchCardDataForSaving = (punchCard) => ({

    name:           punchCard.name,
    description:    punchCard.description,
    card_color:     punchCard.card_color,
    rule_on:        punchCard.redemption_type === 'category_product' ? punchCard.rule_on : '',
    category_id:    punchCard.redemption_type === 'category_product' && punchCard.category.cate_id      ? punchCard.category.cate_id : '',
    product_id:     punchCard.redemption_type === 'category_product' && punchCard.product.prd_id        ? (punchCard.variant.prd_id ? punchCard.variant.prd_id : punchCard.product.prd_id) : '',
    parent_id:      punchCard.redemption_type === 'category_product' && punchCard.variant.prd_id        ? punchCard.product.prd_id : 0,
    product_image:  punchCard.redemption_type === 'category_product' && punchCard.product.prd_image     ? punchCard.product.prd_image.image : '',
    category_name:  punchCard.redemption_type === 'category_product' && punchCard.category.cate_name    ? punchCard.category.cate_name : '',
    product_name:   punchCard.redemption_type === 'category_product' && punchCard.product.prd_name      ? punchCard.product.prd_name : '',
    business_id:    punchCard.business.business_id  ? punchCard.business.business_id : '',
    business_name:  punchCard.business.business_id  ? punchCard.business.business_name : '',
    business_images:punchCard.business.business_id  ? JSON.stringify(punchCard.business.business_image) : '',
    editId:         0,
    redemption_type:punchCard.redemption_type,
    frequency:      punchCard.redemption_type === 'transaction_value' ? punchCard.frequency : '',
    //condition:      punchCard.redemption_type === 'transaction_value' ? (punchCard.condition === true    ? 'AND' : 'OR') : '',
    transaction_threshold: punchCard.transaction_threshold,
    no_of_use: punchCard.no_of_use,
    group_name: punchCard.group_name,
    voucher_id: punchCard.voucher_id,


});

export const prepareEditData = (punchCard, businessList = []) => {
    return {
        name:            punchCard.name,
        description:     punchCard.description,
        card_color:      punchCard.card_color,
        rule_on:         punchCard.rule_on,
        business:        (punchCard.business_id == 0) ? {} :{business_id: punchCard.business_id,business_name:punchCard.business_name}, //business ? business : {business_id: punchCard.business_id},
        category:        {cate_id: punchCard.category_id, cate_name: punchCard.category_name},
        product:         {prd_id: punchCard.parent_id ? punchCard.parent_id : punchCard.product_id, prd_name: punchCard.product_name, prd_image: {image: punchCard.product_image}},
        variant:         {prd_id: punchCard.parent_id ? punchCard.product_id : 0},
        businesses:      punchCard.businesses,
        business_id:     punchCard.business_id,
        voucher_id:      punchCard.voucher_id,
        transaction_threshold: punchCard.transaction_threshold,
        no_of_use       : punchCard.no_of_use,
        redemption_type:punchCard.redemption_type,
        frequency:      punchCard.redemption_type === 'transaction_value' ? punchCard.frequency : '',

    };
};

export const setFrequencyTime = ($time) => {
    let t = moment();
    if ($time) {
        let ta = $time.split(':');
        t.hours(ta[0]);
        t.minutes(ta[1]);
    } else {
        t.hours('00');
        t.minutes('10');
    }//.... end if-else() .....//

    return t;
};

/**
 * Select Discount from message builder of the selected channel.
 * @param messageBuilder
 * @param currentChannel
 * @returns {number}
 */
export const selectDiscount = (messageBuilder, currentChannel) => {
    let msgBuilder = selectMessageBuilderObject(messageBuilder, currentChannel);
    return (msgBuilder.other.content && msgBuilder.other.content.discount ) ? msgBuilder.other.content.discount : 0;
};

/**
 * Select discount type.
 * @param messageBuilder
 * @param currentChannel
 * @returns {string}
 */
export const selectDiscountType = (messageBuilder, currentChannel) => {
    let msgBuilder = selectMessageBuilderObject(messageBuilder, currentChannel);
    return msgBuilder.other.content && msgBuilder.other.content.discount_type ?  msgBuilder.other.content.discount_type : '';
};

/**
 * Set voucher start date.
 * @param messageBuilder
 * @param currentChannel
 * @returns {null}
 */
export const selectVoucherStartDate = (messageBuilder, currentChannel) => {
    let msgBuilder = selectMessageBuilderObject(messageBuilder, currentChannel);

    if (msgBuilder.other.content.voucher_start_date ) {
        let dateTime = (msgBuilder.other.content.voucher_start_date).split(' ');
        let startDate = (dateTime[0]).split('-');
        return moment(`${startDate[2]}-${startDate[1]}-${startDate[0]} ${dateTime[1]}`);
    } else {
        return null;
    }//.... end if() .....//
};

/**
 * Select Voucher End Date.
 * @param messageBuilder
 * @param currentChannel
 * @returns {null}
 */
export const selectVoucherEndDate = (messageBuilder, currentChannel) => {
    let msgBuilder = selectMessageBuilderObject(messageBuilder, currentChannel);
    if (msgBuilder.other.content.voucher_end_date) {
        let dateTime = (msgBuilder.other.content.voucher_end_date).split(' ');
        let endDate = (dateTime[0]).split('-');
        return moment(`${endDate[2]}-${endDate[1]}-${endDate[0]} ${dateTime[1]}`);
    } else {
        return null;
    }//.... end if() .....//
};

/**
 * Select Message.
 * @param messageBuilder
 * @param currentChannel
 * @returns {*}
 */
export const selectMessage = (messageBuilder, currentChannel) => {
    let msgBuilder = selectMessageBuilderObject(messageBuilder, currentChannel);
    return msgBuilder.message;
};

/**
 * Select Value Points
 * @param messageBuilder
 * @param currentChannel
 * @returns {number}
 */
export const selectValuePoints = (messageBuilder, currentChannel) => {
    let msgBuilder = selectMessageBuilderObject(messageBuilder, currentChannel);
    return msgBuilder.other.content.points ? msgBuilder.other.content.points["Value Points"] : 0;
};

/**
 * Select Value Points
 * @param messageBuilder
 * @param currentChannel
 * @returns {number}
 */
export const selectTokens = (messageBuilder, currentChannel) => {
    let msgBuilder = selectMessageBuilderObject(messageBuilder, currentChannel);
    return msgBuilder.other.content.tokens ? msgBuilder.other.content.tokens["tokens"] : 0;
};

/**
 * Select Status Points
 * @param messageBuilder
 * @param currentChannel
 * @returns {number}
 */
export const selectStatusPoints = (messageBuilder, currentChannel) => {
    let msgBuilder = selectMessageBuilderObject(messageBuilder, currentChannel);
    return msgBuilder.other.content.points ? msgBuilder.other.content.points["Status Points"] : 0;
};

/**
 * Select previous message builder if entered.
 * @param tmpMessageBuilder
 * @param currentChannel
 * @returns {*}
 */
export const selectTempMessageBuilder = (tmpMessageBuilder, currentChannel, messageBuilder) => {
    let msgBldr = selectMessageBuilderObject(messageBuilder, currentChannel);
    return tmpMessageBuilder.hasOwnProperty(currentChannel) ? tmpMessageBuilder[currentChannel][msgBldr.type] || {} : {};
};

/**
 * Function for Referral a friend
 * @param referral
 * @returns {{remarks: string, field1: number, company_id: number}}
 */
export const selectReferralDataSave = (referral) => ({
    referral_points:referral.referral_points,
    referred_points:referral.referred_points,
    remarks:JSON.stringify({'referral_points':referral.referral_points,'referred_points':referral.referred_points}),
    field1:VenueID,
    company_id:CompanyID,
    type:'referral',
    editId:0
});

/**
 * Function for prepare edit data for referral
 * @param referral
 * @returns {{referral_points: string, referred_points: string}}
 */
export const prepareReferralEditData = (referral) => {
    let defaultDa = JSON.parse(referral.remarks);
    return {
        referral_points:defaultDa.referral_points,
        referred_points:defaultDa.referred_points
    };
};

export const selectVoucherDateToSave = (voucher) => ({

    name                :   voucher.name,
    discount_type       :   voucher.discount_type,
    basket_level        :   voucher.basket_level,
    isNumberOfDays      :   voucher.isNumberOfDays,
    promotion_text      :   voucher.promotion_text,
    no_of_uses          :   voucher.no_of_uses,
    business            :   (Object.keys(voucher.business).length>0)?JSON.stringify(voucher.business):JSON.stringify(voucher.businessData),
    voucher_avial_data  :   JSON.stringify(voucher.voucher_avial_data),
    tree_structure      :   JSON.stringify({'selectedKeys':voucher.checkedKey, 'treeSelected':voucher.treeNode,'expended':voucher.expandedKeys}),
    image               :   voucher.image,
    pos_ibs             :   voucher.pos_ibs,
    amount              :   voucher.amount,
    start_date          :   voucher.start_date,
    end_date            :   voucher.end_date,
    voucher_type        :   voucher.voucher_type,
    target_user         :   voucher.target_user,
    category            :   (voucher.voucher_type =='group-voucher')?'Group Voucher':voucher.category,
    quantity            :   voucher.quantity,
    group_id            :   voucher.group_id,
    redemption_rule            :   voucher.redemption_rule,
    billingStatus            :   voucher.billingStatus,
    billingFields            :   JSON.stringify(voucher.billingFields),
    voucherFactor            :   voucher.voucherFactor,
    billingType            :   voucher.billingType,


});

export const prepareEditDataVoucher = (voucher, businessList = []) => {
    let defaultData = JSON.parse(voucher.tree_structure);

    return {
        name                    : voucher.name,
        discount_type           : (voucher.discount_type)?voucher.discount_type:'',
        basket_level            : (voucher.basket_level ==0)?false:true,
        isNumberOfDays          : (voucher.isNumberOfDays)?voucher.isNumberOfDays:'',
        promotion_text          : voucher.promotion_text,
        no_of_uses              : voucher.no_of_uses,
        business                : (voucher.voucher_type !='voucher')?JSON.parse(voucher.business):{},
        businessData            : (voucher.voucher_type !='voucher')?[]:JSON.parse(voucher.business),
        voucher_avial_data      : JSON.parse(voucher.voucher_avial_data),
        tree_structure          : defaultData,
        image                   : voucher.image,
        pos_ibs                 : voucher.pos_ibs,
        amount                  : voucher.amount,
        id                      : voucher.id,
        start_date              : dateConversion(voucher.start_date),
        end_date                : dateConversion(voucher.end_date),
        voucher_type            : voucher.voucher_type,
        treeNode                : defaultData.treeSelected,
        checkedKey              : defaultData.selectedKeys,
        expandedKeys            : defaultData.expended,
        is_day                  : (voucher.isNumberOfDays && parseInt(voucher.isNumberOfDays)>0)?true:false,
        target_user             : voucher.target_user,
        category                :   (voucher.voucher_type =='group-voucher')?'Group Voucher':voucher.category,
        quantity                :   voucher.quantity,
        group_id:       voucher.group_id,
        is_group:       (voucher.group_id >0)?true:false,
        redemption_rule           :   voucher.redemption_rule,
        billingStatus            :   voucher.billingStatus,
        billingFields            :   JSON.parse(voucher.billingFields),
        voucherFactor            :   voucher.voucherFactor,
        billingType            :   voucher.billingType,
    };
};

export const dateConversion = (date) => {

    if (date) {
        return moment(`${date}`);
    } else {
        return null;
    }//.... end if() .....//
};