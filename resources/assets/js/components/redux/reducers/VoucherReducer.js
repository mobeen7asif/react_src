const defaultForm = () => ({
    name:'',
    discount_type:'',
    basket_level:false,
    isNumberOfDays:'',
    promotion_text:'',
    no_of_uses:'',
    business:{},
    businessData:[],
    voucher_avial_data:[],
    tree_structure:{},
    image:'',
    pos_ibs:'',
    amount:'',
    start_date:null,
    end_date:null,
    voucher_type:'integrated',
    target_user:'new',
    category:'',
    quantity:0,
    group_id:0,


    billingStatus:false,
    billingType:'Partially Settled',
    billingFields:{},
    voucherFactor:0,
    redemption_rule:'Standard',

});

const defaultState = {
    ...defaultForm(),
    businessList:[],
    treeNode:[],
    checkedKey:[],
    expandedKeys:[],
    is_day:false,
    id:0,
    voucher_data:[],
    voucherCategory:[{
        id:1,
        name:'Normal Voucher',
    },{
        id:2,
        name:'Public Voucher',
    },/*{
        id:3,
        name:'Static Voucher',
    }*/],
    is_group:false,
    groups:[],

};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_VOUCHER_KEY_VALUE':
            return {...state, ...action.obj};
        case 'SET_VOUCHER_BUSINESS_LIST':
            return {...state, businessList: action.businessList};
        case 'SET_VOUCHER_DATA':
            return {...state, voucher_avial_data: action.data};
            case 'SET_VOUCHER_CHECKED_KEY':
            return {...state, checkedKey: action.data};
        case 'RESET_VOUCHER':
            return {...state,id:0, is_day:false,treeNode: [],checkedKey:[],expandedKeys:[], ...defaultForm(),business:[],voucher_data:[],is_group:false};
        case 'SET_VOUCHER_EDIT_DATA':
            return {...state, ...action.voucher};
        default:
            return state;
    }//...... end of switch() .....//
};