import React, {Component} from 'react';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
class BreakDown extends Component {

    state = {
        voucher : {}
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidMount = () => {
    };

    changeDateFormat = (data) => {
        return moment(data*1000).format("DD/MM/YYYY");
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {

       return (

           <div className="e_transactionsValue_list">
               <div className="cmDashboard_columns">
                   <ul>
                       <li className="width_100">
                          {/* <div className="column_dboard_widget2 clearfix">
                               <div className="column_dboard_widgetDetail2">
                                   <div className="columnHeading">
                                       <label>{this.props.totalCampaings?'TOTAL CAMPAIGNS':'TOTAL CAMPAIGNS'}</label>
                                   </div>
                                   <div className="averageSale_amountinfo">
                                       <div className="segment_gender_header clearfix">
                                           <div className="breakdown_main">
                                               <div className="breakdown_listing">
                                                   <ul>
                                                       <li>
                                                           <div className="breakdown_inner">
                                                               <div className="breakdown_circle">
                                                                   <CircularProgressbar
                                                                       percentage={this.props.data}
                                                                       text={`${this.props.data}%`}
                                                                       strokeWidth={5}
                                                                   />
                                                               </div>
                                                               <div className="breakdown_text"> <span>SENT</span> </div>
                                                           </div>
                                                       </li>
                                                       <li>
                                                           <div className="breakdown_inner">
                                                               <CircularProgressbar
                                                                   percentage={this.props.data}
                                                                   text={`${this.props.data}%`}
                                                                   strokeWidth={5}
                                                               />
                                                               <div className="breakdown_text"> <span>DELIVERED</span> </div>
                                                           </div>
                                                       </li>
                                                       <li>
                                                           <div className="breakdown_inner">
                                                               <div className="breakdown_circle">
                                                                   <CircularProgressbar
                                                                       percentage={0}
                                                                       text={`${0}%`}
                                                                       strokeWidth={5}
                                                                   />
                                                               </div>
                                                               <div className="breakdown_text"> <span>OPENS</span> </div>
                                                           </div>
                                                       </li>
                                                       <li>
                                                           <div className="breakdown_inner">
                                                               <div className="breakdown_circle">
                                                                   <CircularProgressbar
                                                                       percentage={0}
                                                                       text={`${0}%`}
                                                                       strokeWidth={5}
                                                                   />
                                                               </div>
                                                               <div className="breakdown_text"> <span>CLICKS</span> </div>
                                                           </div>
                                                       </li>
                                                       <li>
                                                           <div className="breakdown_inner">
                                                               <div className="breakdown_circle">
                                                                   <CircularProgressbar
                                                                       percentage={0}
                                                                       text={`${0}%`}
                                                                       strokeWidth={5}
                                                                   />
                                                               </div>
                                                               <div className="breakdown_text"> <span>CONVERSIONS</span> </div>
                                                           </div>
                                                       </li>
                                                   </ul>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </div>*/}
                       </li>
                   </ul>
               </div>
           </div>


       );
    }//..... end of render() .....//
}//..... end of Member.

BreakDown.propTypes = {};

export default BreakDown;
