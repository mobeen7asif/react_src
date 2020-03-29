import React, {Component} from 'react';

class GamingSpendTime extends Component {
    slider = undefined;

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('Gaming_Spend_Time', 'value', value);
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
        let gamingSpendTimeSlider = $("#gamingSpendTimeSlider");

        gamingSpendTimeSlider.ionRangeSlider({
            type: "double",
            min: moment("2018-05-22 08:00", "YYYY-MM-DD HH:mm").format("x"),
            max: moment("2018-05-22 20:00", "YYYY-MM-DD HH:mm").format("x"),
            step: 1800000,                // 30 minutes in ms
            from: this.props.criteria.value ? moment(`2018-05-22 ${($this.props.criteria.value.split('-'))[0]}`, "YYYY-MM-DD HH:mm A").format("x") : null,
            to:   this.props.criteria.value ? moment(`2018-05-22 ${($this.props.criteria.value.split('-')).pop()}`, "YYYY-MM-DD HH:mm A").format("x") : null,
            prettify: function (num) {
                return moment(num).format('h:mm A');
            },
            onChange: function(data) {
                $this.setCriteriaValue(moment(data.from).format('h:mm A') + '-' + moment(data.to).format('h:mm A'));
            }
        });

        this.slider = gamingSpendTimeSlider.data("ionRangeSlider");
    };//..... end of initializeSlider() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Gaming Spend Time</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('Gaming_Spend_Time')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="gamingSpend_range">
                        <div className="yourSeg_age_rangeSlct">
                            <div>
                                <input type="text" className="weeklyRange_time rangeSlider" id='gamingSpendTimeSlider'/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of GamingSpendTime.

export default GamingSpendTime;