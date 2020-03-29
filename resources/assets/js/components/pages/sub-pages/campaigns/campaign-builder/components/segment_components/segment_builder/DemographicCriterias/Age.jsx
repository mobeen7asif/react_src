import React, {Component} from 'react';
import {Scrollbars} from "react-custom-scrollbars";

class Age extends Component {
    slider = undefined;
    customDropDownSpanRef = null;
    customDropDownShowRef = null;
    rangeData = ['0-17', '18-24', '25-34', '35-44', '45-100'];
    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('date_of_birth', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        let $this = this;
        let ageRangeSliderDiv = $("#ageRangeSlider");
        ageRangeSliderDiv.ionRangeSlider({
            type: "double",
            min: 0,
            max: 100,
            from: (this.props.criteria.value.split('-'))[0],
            to: (this.props.criteria.value.split('-'))[1],
            grid: true,
            onChange: function (data) {
                $this.setCriteriaValue(data.from + '-' + data.to);
            }
        });

        this.slider = ageRangeSliderDiv.data("ionRangeSlider");
        /*let val = this.props.criteria.value.split('-');
        this.slider.update({
            from: parseInt(val[0]),
            to:   parseInt(val[1])
        });*/
    };//..... end of componentDidMount() .....//
    setValueSelected = (value) => {

        this.slider.update({
            from: (value.split('-'))[0],
            to: (value.split('-'))[1]
        });
        this.setCriteriaValue(value);

        this.customDropDownShowRef.style.display = 'none';
        this.customDropDownSpanRef.classList.remove('changeAero');
    };//..... end of setValueSelected() .....//
    componentWillUnmount = () => {
        this.slider.destroy();
    };//..... end of componentWillUnmount() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    handleDropDownSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRef.style.display = (this.customDropDownShowRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanClick() .....//
    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix"><h3>Age</h3>
                    <div className="segmntClose" onClick={(e) => {
                        this.props.removeCriteria('date_of_birth')
                    }}>
                        <a style={{cursor: 'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="Age_range">
                    <div className="Age_range_value clearfix">
                        <strong>{this.props.criteria.value}
                            <small>Age Range</small>
                        </strong>
                    </div>
                    <div className="age_rangeSlider">
                        <div className="yourSeg_age_rangeSlct dateRange">
                            <div>
                                <input type="text" className="weeklyRange_time rangeSlider" id='ageRangeSlider'/>
                            </div>
                        </div>
                        <div className="compaignDescription_outer clearfix">
                            <label>Select Range</label>
                        <div className="placeHolderOuter expandPlaceholder clearfix">

                            <div className="customDropDown">
                                <span ref={ref => this.customDropDownSpanRef = ref}
                                      onClick={this.handleDropDownSpanClick}> {this.props.criteria.value ? this.props.criteria.value : 'Select Age Range'} </span>
                                <ul className="customDropDown_show customPlaceHolder"
                                    ref={ref => this.customDropDownShowRef = ref} style={{
                                    marginBottom: '30px',
                                    marginTop: '-10px',
                                    maxHeight: '207px',
                                    display: 'none'
                                }}>
                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>}
                                                renderThumbHorizontal={() => <div></div>}>
                                        {
                                            this.rangeData.map((ms) => {
                                                return <li key={ms} onClick={(e) => {
                                                    this.setValueSelected(ms)
                                                }}
                                                           className={(this.props.criteria.value === ms) ? 'selectedItem' : ''}>{ms}</li>
                                            })
                                        }
                                    </Scrollbars>
                                </ul>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of Age.

export default Age;