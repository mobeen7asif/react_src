import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import MultiSelectReact from "multi-select-react";
import DatePicker from "react-datepicker/es/index";

class CustomMultiSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listVouchers : [],
            listMultiSelectVouchers : [],
            match_all:false

        };
    }//..... end of constructor() .....//

    componentDidMount = () => {
        $('.arrow').html('&nbsp;');
        $('.arrow').addClass('set_width');
        if ((this.props.criteria.value.hasOwnProperty("match_all") && this.props.criteria.value.match_all)) {
            this.setState(()=>({match_all: this.props.criteria.value.match_all}));
        }
        let listVouchers = this.getDropDownValue(this.props.component_name);

        if(typeof listVouchers == "string")
            listVouchers = JSON.parse(listVouchers);

        let listMultiSelectVouchers = listVouchers;


        this.setState(()=>({listVouchers: listVouchers}));

        if (this.props.criteria.value.hasOwnProperty('custom_drop_down') && this.props.criteria.value.custom_drop_down.length > 0){
            listMultiSelectVouchers.forEach((value,key2)=> {
                this.props.criteria.value.custom_drop_down.forEach((val)=> {
                    if (value.id == val){
                        listMultiSelectVouchers[key2].value = true;
                    }

                });
            });
        }

        this.setState(()=>({listMultiSelectVouchers:listMultiSelectVouchers}),()=>{

        });

    }


    setCriteriaValue = (value) => {
        this.props.setCriteriaValue(this.props.component_name, 'value', value);
    };//..... end of setCriteriaValue() .....//




    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    optionClicked = (multiSelect) => {
        this.handleChange({ multiSelect });
    };//..... end of optionClicked() .....//

    selectedBadgeClicked = (multiSelect) => {
        this.handleChange({ multiSelect });
    };//..... end of selectedBadgeClicked() .....//

    handleChange = (obj) => {
        let vouchers = [];
        obj.multiSelect.forEach(function(value,key){
            if(value.value == true){
                vouchers.push(value.id);
            }
        });
        this.setState(()=>(obj));
        let preVal = this.props.criteria.value;
        preVal.custom_drop_down = vouchers;
        this.setCriteriaValue(preVal);

    };//..... end of handleChange() .....//

    getLabelName = (segment_name) => {
        let memberCustomFields= JSON.parse(localStorage.getItem('all_custom_fields'));
        let field_name = memberCustomFields.filter((value)=>{
            return value.field_unique_id == segment_name;
        });
        return field_name.length > 0 ? this.removeUnderscore(field_name[0].field_label) : this.removeUnderscore(this.props.field_name);
    }

    getDropDownValue = (field_unique_id) => {
        let memberCustomFields= JSON.parse(localStorage.getItem('all_custom_fields'));
        let field_name = memberCustomFields.filter((value)=>{
            return value.field_unique_id == field_unique_id;
        });
        return field_name[0].drop_down_values;
    }



    removeUnderscore = (str) => str.replace(/_/g, " ");

    matchAllValue = (value) => {
        let newValue = !value;
        let preVal = this.props.criteria.value;
        preVal.match_all = newValue;
        this.setCriteriaValue(preVal);
        this.setState(()=>({match_all:newValue}));

    };//..... end of is_featured() .....//

    render() {
        const selectedOptionsStyles = {
            color: "#3c763d",
            backgroundColor: "#dff0d8"
        };
        const optionsListStyles = {
            backgroundColor: "#fcf8e3",
            color: "#8a6d3b"
        };
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3 className="capitalize"> {this.getLabelName(this.props.component_name)}</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria(this.props.component_name)}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>

                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">

                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder" style={{width:"100%",float:"none"}}>
                                <div className="placeHolderOuter clearfix">
                                    <div >
                                                            <span className="cL_rowList_number" style={{fontSize:'13px', fontWeight:'bold',float:"right"}}>
                                                               <input type="checkbox" checked={this.state.match_all} onClick={()=>{this.matchAllValue(this.state.match_all)}} /><span> Match all</span>
                                                            </span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/*<label className="capitalize">{this.getLabelName(this.props.component_name)} </label>*/}
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder" style={{width:"100%",float:"none"}}>
                                <div className="placeHolderOuter clearfix">
                                    <div className="customDropDown" style={{height:"auto"}}>

                                        <MultiSelectReact   options={this.state.listMultiSelectVouchers} optionClicked={this.optionClicked} selectedBadgeClicked={this.selectedBadgeClicked}
                                                                selectedOptionsStyles={selectedOptionsStyles} optionsListStyles={optionsListStyles} />


                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>



            </div>
        );
    }//..... end of render() .....//

}//..... end of CustomMultiSelect.

export default CustomMultiSelect;