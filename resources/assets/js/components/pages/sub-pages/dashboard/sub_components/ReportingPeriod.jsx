import React, {Component} from 'react';
import { Calendar, DateRangePicker } from 'react-date-range';

class ReportingPeriod extends Component {

    render() {
        return (

            <React.Fragment>
                <div className="e_dashboard_taransRow clearfix drop_dwon_alignment">
                    <div className="yearsDropdown dateInputAdjust">
                        <div className="customDropDown_placeholder ">
                            <span>{(this.props.calender.selectDate)?(moment(this.props.calender.selection.startDate).format('ll') + ' - ' + moment(this.props.calender.selection.endDate).format('ll')):'Select Date'}</span>
                            <select onClick={this.props.dateInputClick} className="searchInput cursor_style">

                            </select>
                            {/*<input onFocus={this.dateInputClick}
                                   placeholder=''
                                   className="searchInput cursor_style" type="text" value={(this.props.calender.selectDate)?(moment(this.props.calender.selection.startDate).format('ll') + ' - ' + moment(this.props.calender.selection.endDate).format('ll')):'Select Date'} readOnly/>*/}
                        </div>
                    </div>
                    <div className="e_dashboard_taransRight">
                        <div className="e_dashboard_taransDate">
                            <div className="e_member_printBtns dashboard_calender_btns cursor_style_new filter_btns clearfix " style={this.props.calender.showDatePicker ? {display: 'block'} : {display: 'none'}}>
                                <ul>
                                    <li><a onClick={this.props.dateFilter} style={{width:"90px"}}  style={{cursor:'pointer'}}>APPLY</a></li>
                                    <li><a onClick={this.props.hideDatePicker} style={{width:"90px"}}    style={{cursor:'pointer'}}>CLEAR</a></li>
                                </ul>
                            </div>
                            <div style={this.props.calender.showDatePicker ? {display: 'block'} : {display: 'none'}}>
                                <DateRangePicker className="rdrDateRangeWrapper"
                                                 ranges={[this.props.calender.selection]}
                                                 onChange={this.props.handleSelect}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="clearfix"></div>
                <div className="members_dayMain" style={{'paddingBottom':'30px'}}>
                    <div className="members_dayInner">
                        <ul>
                            <li><a className={this.props.calender.filterPeriod === 'day' ? 'active' : ''} style={{cursor:'pointer'}} onClick={() => {this.props.changeFilter('day')}}>Day</a></li>
                            <li><a className={this.props.calender.filterPeriod === 'week' ? 'active' : ''} style={{cursor:'pointer'}} onClick={() => {this.props.changeFilter('week')}}>Week</a></li>
                            <li><a className={this.props.calender.filterPeriod === 'month' ? 'active' : ''} style={{cursor:'pointer'}} onClick={() => {this.props.changeFilter('month')}}>Month</a></li>
                            <li><a className={this.props.calender.filterPeriod === 'year' ? 'active' : ''} style={{cursor:'pointer'}} onClick={() => {this.props.changeFilter('year')}}>Year</a></li>
                        </ul>
                    </div>
                </div>
            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of DetailList.

export default ReportingPeriod;