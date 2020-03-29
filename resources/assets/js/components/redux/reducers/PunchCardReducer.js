const defaultForm = () => ({
    name:           '',
    description:    '',
    business:       {},
    category:       {},
    product:        {},
    variant:        {},
    no_of_voucher:  '',
    no_of_use:      '',
    card_color:     '',
    image:          '',
    voucher_amount: '',
    rule_on:        '',
    redemption_type:'',
    frequency:      '',
    transaction_threshold: '',
    condition:      false,
    punch_card_data: [],
    tree_structure:{},
    discount_type : '$',
    group:          {},
    group_name:     '',
    pos_ibs        :    '',
    basket_level   : false,
    voucher_name:'',
    voucher_id :''
});

const defaultState = {
    businessList:   [],
    categoryList:   [],
    productList:    [],
    variantList:    [],
    treeStructure:  [],
    treeProductList:  [],
    selectedTree :  [],
    varientData :  [],
    ...defaultForm(),
    redemptionTypeList: [{field: 'category_product', label: 'Category/Product'}, {field: 'transaction_value', label: 'Transactions/Value'}],
    checkedKeys:[],
    expendedKeys:[],
    voucherList:[]
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_PUNCH_CARD_KEY_VALUE':
            return {...state, ...action.obj};
        case 'SET_PUNCH_CARD_BUSINESS':
            if (state.business.business_id == action.business.business_id){
                return {...state, business: action.business};
            }

            return {...state, business: action.business, category: {}, product: {}, variantList: [], variant: {}};
        case 'SET_PUNCH_CARD_CATEGORY':
            return {...state, category: action.category, product: {}, variantList: [], variant: {}};
        case 'SET_PUNCH_CARD_PRODUCT':
            return {...state, product: action.product, variantList: action.product.variants_array ? action.product.variants_array : []};
        case 'SET_PUNCH_CARD_VARIANT':
            return {...state, variant: action.variant};
        case 'SET_PUNCH_CARD_BUSINESS_LIST':
            return {...state, businessList: action.businessList};
        case 'SET_PUNCH_CARD_CATEGORY_LIST':
            return {...state, categoryList: action.categoryList};
        case 'SET_PUNCH_CARD_PRODUCT_LIST':
            return {...state, productList: action.productList};
        case 'SET_PUNCH_CARD_VARIANT_LIST':
            return {...state, variantList: action.variantList};
        case 'SET_PUNCH_CARD_EDIT_DATA':

            return {...state, ...action.punchCard};
        case 'RESET_PUNCH_CARD_STATE':
            return {...state, categoryList: [], productList: [],treeProductList:[],punch_card_data:[],subModifier:[],tree_structure:{},checkedKeys:[],varientData:[],selectedTree:[], ...defaultForm(),treeStructure:[]};
        case 'SET_REDEMPTION_TYPE':
            return {...state, redemption_type: action.redemption_type};
        case 'SET_REDEMPTION_FREQUENCY':
            return {...state, frequency: action.frequency};
        case 'SET_REDEMPTION_CONDITION':
            return {...state, condition: action.condition};
        case 'SET_STORE_DATA':
            return {...state, treeStructure: action.data};
        case 'SET_SUB_MODIFIERS':
            return {...state, subModifier: action.data};
        case 'SET_SUB_SELECTED':
            return {...state, checkedKeys: action.data};
        case 'SET_DATA_RULE_PUNCH':
            return {...state, punch_card_data: action.data};
        case 'SET_VARIENT_DATA':
            return {...state, varientData: action.data};

        case 'SET_EXPENDED_DATA':
            return {...state, expendedKeys: action.data};
        case 'SET_TREE_PRODUCT_DATA':
            return {...state, treeProductList: action.data};
            case 'SET_DISCOUNT_TYPE':
            return {...state, discount_type: action.data};

        case 'SET_PUNCH_CARD_GROUP':
            if (state.group.id == action.group.id)
                return {...state, group: action.group};
            return {...state, group: action.group, category: {}, product: {}, variantList: [], variant: {}};
        default:
            return state;
    }//..... end of switch() .....//
};