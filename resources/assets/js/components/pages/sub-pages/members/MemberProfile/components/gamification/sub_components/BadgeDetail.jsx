import React, {Component} from 'react';


class BadgeDetail extends Component {

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

           <div className="e_transaction_accordionShow" style={this.props.badge._source.active === true ? {display : 'block'} : {display : 'none'}}>
               <div className="e_transaction_detial">
                   <div className="e_transaction_top">
                       <div
                           className="e_authorisation clearfix">
                           <div
                               className="e_authorisation_left">
                               <div
                                   className="e_authorisation_list">
                                   <ul>
                                       <li>
                                           <div
                                               className="e_authorisation_inner clearfix">
                                               <div
                                                   className="e_authorisation_listLeft width_33">
                                                   <div
                                                       className="e_authorisation_text">
                                                       <span>Badge Name</span>
                                                       <strong>{this.props.badge._source.badge_title}</strong>
                                                   </div>
                                               </div>
                                               <div
                                                   className="e_authorisation_listLeft width_33">
                                                   <div
                                                       className="e_authorisation_text">
                                                       <span>Date</span>
                                                       <strong>{this.changeDateFormat(this.props.badge._source.dateadded)}</strong>
                                                   </div>
                                               </div>
                                               <div
                                                   className="e_authorisation_listRight width_33">
                                                   <div
                                                       className="e_authorisation_text">
                                                       <span>Authorisation Time</span>
                                                       <strong>03:45:56
                                                           PM</strong>
                                                   </div>
                                               </div>
                                           </div>
                                       </li>
                                       <li>
                                           <div
                                               className="e_authorisation_inner clearfix">
                                               <div
                                                   className="e_authorisation_text">
                                                   <span>Badge Description</span>
                                                   <strong>{this.props.badge._source.badge_description} </strong>
                                               </div>
                                           </div>
                                       </li>
                                       <li>
                                           <div
                                               className="e_authorisation_inner clearfix">
                                               <div
                                                   className="e_authorisation_listLeft width_33">
                                                   <div
                                                       className="e_authorisation_text">
                                                       <span>Date Recieved</span>
                                                       <strong>{this.changeDateFormat(this.props.badge._source.dateadded)}</strong>
                                                   </div>
                                               </div>
                                               <div
                                                   className="e_authorisation_listLeft width_33">
                                                   <div
                                                       className="e_authorisation_text">
                                                       <span>Business </span>
                                                       <strong>ISPT</strong>
                                                   </div>
                                               </div>
                                               <div
                                                   className="e_authorisation_listRight width_33">
                                                   <div
                                                       className="e_authorisation_text">
                                                       <span>Store </span>
                                                       <strong>{this.props.badge._source.voucher_details.business_name}</strong>
                                                   </div>
                                               </div>
                                           </div>
                                       </li>
                                   </ul>
                               </div>
                           </div>
                           <div
                               className="e_authorisation_right">
                               <div
                                   className="badges_right_image">
                                                                                                <span><img
                                                                                                    src={this.props.badge._source.badge_image   }
                                                                                                    alt="#"/></span>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>


       );
    }//..... end of render() .....//
}//..... end of Member.

BadgeDetail.propTypes = {};

export default BadgeDetail;
