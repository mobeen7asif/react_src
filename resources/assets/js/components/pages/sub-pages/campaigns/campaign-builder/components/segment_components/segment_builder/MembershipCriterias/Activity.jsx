import React, {Component} from 'react';
import {Scrollbars} from "react-custom-scrollbars";
import MultiSelectReact from "multi-select-react";
class Activity extends Component {
    customDropDownSpanRef = null;
    customDropDownShowRef = null;
    customDropDownSpanRef2 = null;
    customDropDownShowRef2 = null;
    //enterVenue = ['Less than or equal', 'More than or equal'];
    enterVenue = [{"id":"Active","label":"Active",value:false}, {"id":"Inactive","label":"Inactive",value:false},{"id":"Old","label":"Old",value:false}];
    constructor(props) {
        super(props);
        this.state = {
            days: "",
            listActivity : [],
            listMultiSelectActivity : [],
        };
    }//..... end of constructor() .....//

    setValueSelected = (value) => {
        let preVal = this.props.criteria.value;
        preVal.status = value;
        this.setCriteriaValue(preVal);

        this.customDropDownShowRef.style.display = 'none';
        this.customDropDownSpanRef.classList.remove('changeAero');
    };//..... end of setValueSelected() .....//

    handleDropDownSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRef.style.display =  (this.customDropDownShowRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanClick() .....//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('user_activity', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        $('.arrow').html('&nbsp;');
        $('.arrow').addClass('set_width');

        if (this.props.criteria.value.days)
            this.setState({days:this.props.criteria.value.days});


            let listMultiSelectActivity = this.enterVenue;
            this.setState(()=>({listActivity: this.enterVenue}));
            show_loader(true);
            if (this.props.criteria.value.hasOwnProperty('activity') && this.props.criteria.value.activity.length > 0){
                listMultiSelectActivity.forEach((value,key2)=> {
                    this.props.criteria.value.activity.forEach((val)=> {
                        if (value.id == val){
                            listMultiSelectActivity[key2].value = true;
                        }

                    });
                });
            }
            this.setState(()=>({listMultiSelectActivity:listMultiSelectActivity}),()=>{
                (this.state.listMultiSelectActivity)
            });

    };//..... end of componentDidMount() .....//




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
        let activity = [];
        obj.multiSelect.forEach(function(value,key){

            if(value.value == true){
                activity.push(value.id);
            }

        });
        this.setState(()=>(obj));
        let preVal = this.props.criteria.value;
        preVal.activity = activity;
        this.setCriteriaValue(preVal);

    };//..... end of handleChange() .....//

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
                    <h3>Activity</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('user_activity')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>

                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Acitvity Listing are</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder" style={{width:"100%",float:"none"}}>
                                <div className="placeHolderOuter clearfix">
                                    <div className="customDropDown" style={{height:"auto"}}>

                                        <MultiSelectReact options={this.state.listMultiSelectActivity} optionClicked={this.optionClicked} selectedBadgeClicked={this.selectedBadgeClicked}
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

}//..... end of Activity.

export default Activity;