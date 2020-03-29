import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import MultiSelectReact from "multi-select-react";

class CustomDropDown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listVouchers : [],
            listMultiSelectVouchers : []

        };
    }//..... end of constructor() .....//

    componentDidMount = () => {
        $('.arrow').html('&nbsp;');
        $('.arrow').addClass('set_width');

        let listVouchers = this.getDropDownValue(this.props.component_name);
        if(typeof listVouchers == "string")
            listVouchers = JSON.parse(listVouchers);


        /*console.log(listVouchers);
        if(typeof listVouchers == "string")
            listVouchers = JSON.parse(listVouchers);*/



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
        console.log(preVal.vouchers)
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
                        <label className="capitalize">{this.getLabelName(this.props.component_name)} </label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder" style={{width:"100%",float:"none"}}>
                                <div className="placeHolderOuter clearfix">
                                    <div className="customDropDown" style={{height:"auto"}}>

                                            <MultiSelectReact   options={this.state.listMultiSelectVouchers} optionClicked={this.optionClicked} selectedBadgeClicked={this.selectedBadgeClicked}
                                                              isSingleSelect={true}     selectedOptionsStyles={selectedOptionsStyles} optionsListStyles={optionsListStyles} />


                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>



            </div>
        );
    }//..... end of render() .....//

}//..... end of CustomDropDown.

export default CustomDropDown;