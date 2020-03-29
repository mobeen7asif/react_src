import React, {Component} from 'react';
import PropTypes from 'prop-types';

class PosSpendTime extends Component {
    slider = undefined;
    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('POS_Spend_Time', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        if (!this.props.criteria.value)
            this.setCriteriaValue('8:00 AM-8:00 PM');

        this.initializeSlider();
    };//..... end of componentDidMount() .....//

    componentWillUnmount = () => {
        this.slider.destroy();
    };//..... end of componentWillUnmount() .....//

    initializeSlider = () => {
        let $this = this;
        let posSpendTimeSlider = $("#posSpendTimeSlider");

        posSpendTimeSlider.ionRangeSlider({
            type: "double",
            min: moment("2018-05-22 08:00", "YYYY-MM-DD HH:mm").format("x"),
            max: moment("2018-05-22 20:00", "YYYY-MM-DD HH:mm").format("x"),
            step: 1800000,                // 30 minutes in ms
            from: moment(`2018-05-22 ${(this.props.criteria.value.split('-'))[0]}`).format("x"),
            to: moment(`2018-05-22 ${(this.props.criteria.value.split('-'))[1]}`).format("x"),
            prettify: function (num) {
                moment.locale('en');
                return moment(num).format('h:mm A');
            },
            onChange: function(data) {
                $this.setCriteriaValue(moment(data.from).format('h:mm A') + '-' + moment(data.to).format('h:mm A'));
            }
        });

        this.slider = posSpendTimeSlider.data("ionRangeSlider");
    };//..... end of initializeSlider() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>POS Spend Time</h3>
                    <div className="segmntClose"  onClick={(e)=> {this.props.removeCriteria('POS_Spend_Time')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="poseSpend_time">
                        <div className="yourSeg_age_rangeSlct">
                            <div>
                                <input type="text" className="weeklyRange_time rangeSlider" id='posSpendTimeSlider'/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of PosSpendTime.

PosSpendTime.propTypes = {};

export default PosSpendTime;