import React, {Component} from 'react';


class CampaignDetail extends Component {

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


               <div className="e_transaction_accordionShow" style={this.props.campaign._source.active === true ? {display : 'block'} : {display : 'none'}}>
                   <div className="e_transaction_detial">
                       <div className="e_transaction_top">
                           <div className="e_authorisation clearfix">
                               <div className="e_authorisation_left">
                                   <div className="e_authorisation_list">
                                       <ul>
                                           <li>
                                               <div className="e_authorisation_inner clearfix">
                                                   <div className="e_authorisation_listLeft">
                                                       <div className="e_authorisation_text"> <span>Campaign Name</span> <strong>{this.props.campaign._source.campaign_name}</strong> </div>
                                                   </div>
                                                   <div className="e_authorisation_listRight">
                                                       <div className="e_authorisation_text"> <span>Campaign Status</span> <span className="cL_rowList_number padingLeft0" style={{color: '#617283'}}><i className={this.props.campaign._source.camp_status === 'Active' ? 'activeRedeemed' : 'completed_campaign'}>&nbsp;</i>{this.props.campaign._source.camp_status}</span> </div>
                                                   </div>
                                               </div>
                                           </li>
                                           <li>
                                               <div className="e_authorisation_inner clearfix">
                                                   <div className="e_authorisation_listLeft">
                                                       <div className="e_authorisation_text"> <span>Start Date</span> <strong>{this.props.campaign._source.start_date}</strong> </div>
                                                   </div>
                                                   <div className="e_authorisation_listRight">
                                                       <div className="e_authorisation_text"> <span>End Date</span> <strong>{this.props.campaign._source.end_date}</strong> </div>
                                                   </div>
                                               </div>
                                           </li>
                                           <li>
                                               <div className="e_authorisation_inner clearfix">
                                                   <div className="e_authorisation_listLeft">
                                                       <div className="e_authorisation_text"> <span>Campaign Type</span> <strong>{this.props.campaign._source.campaign_type}</strong> </div>
                                                   </div>
                                                   <div className="e_authorisation_listRight">
                                                       <div className="e_authorisation_text"> <span>Message Type</span> <strong className={'capital_text'}>{this.props.campaign._source.camp_action_type}</strong> </div>
                                                   </div>
                                               </div>
                                           </li>
                                           <li>
                                               <div className="e_authorisation_inner clearfix">
                                                   <div className="e_authorisation_listLeft">
                                                       <div className="e_authorisation_text"> <span>Platform</span> <strong>{this.props.campaign._source.camp_channel}</strong> </div>
                                                   </div>
                                                   <div className="e_authorisation_listRight">
                                                       <div className="e_authorisation_text"> <span>Converted</span> <strong>{this.props.campaign._source.member_name}</strong> </div>
                                                   </div>
                                               </div>
                                           </li>
                                       </ul>
                                   </div>
                                   <div className="e_authorisation_box">
                                       <div className="e_authorisation_list">
                                           <ul>
                                               <li>
                                                   <div className="e_authorisation_inner clearfix">
                                                       <div className="e_authorisation_listLeft">
                                                           <div className="e_campaign_sent clearfix"><small>Sent</small> <span><i className={this.props.campaign._source.is_send === 1 ? '' : "redBg"} ><img src={this.props.campaign._source.is_send === 1 ? BaseUrl+"/assets/images/checkWhite.png" : BaseUrl+"/assets/images/closeWhite.png"} alt="#" /></i></span></div>
                                                       </div>
                                                       <div className="e_authorisation_listRight">
                                                           <div className="e_campaign_sent clearfix"><small>Delivered</small> <span><i className={this.props.campaign._source.is_send === 1 ? '' : "redBg"}><img src={this.props.campaign._source.is_send === 1 ? BaseUrl+"/assets/images/checkWhite.png" : BaseUrl+"/assets/images/closeWhite.png"} alt="#" /></i></span></div>
                                                       </div>
                                                   </div>
                                               </li>
                                               <li>
                                                   <div className="e_authorisation_inner clearfix">
                                                       <div className="e_authorisation_listLeft">
                                                           <div className="e_campaign_sent clearfix"><small>Opened</small> <span><i className={this.props.campaign._source.is_send === 1 ? '' : "redBg"}><img src={this.props.campaign._source.is_send === 1 ? BaseUrl+"/assets/images/checkWhite.png" : BaseUrl+"/assets/images/closeWhite.png"} alt="#" /></i></span> </div>
                                                       </div>
                                                       <div className="e_authorisation_listRight">
                                                           <div className="e_campaign_sent clearfix"> <small>Clicked</small> <span><i className={this.props.campaign._source.is_send === 1 ? '' : "redBg"}><img src={this.props.campaign._source.is_send === 1 ? BaseUrl+"/assets/images/checkWhite.png" : BaseUrl+"/assets/images/closeWhite.png"} alt="#" /></i></span></div>
                                                       </div>
                                                   </div>
                                               </li>
                                               <li>
                                                   <div className="e_authorisation_inner clearfix">
                                                       <div className="e_authorisation_listLeft">
                                                           <div className="e_campaign_sent clearfix"><small>Converted</small> <span><i className={this.props.campaign._source.is_send === 1 ? '' : "redBg"}><img src={this.props.campaign._source.is_send === 1 ? BaseUrl+"/assets/images/checkWhite.png" : BaseUrl+"/assets/images/closeWhite.png"} alt="#" /></i></span></div>
                                                       </div>
                                                   </div>
                                               </li>
                                           </ul>
                                       </div>
                                   </div>
                               </div>
                               {/*<div className="e_authorisation_right">
                                   <div className="e_campaignMobile_img"> <span><img src={BaseUrl+"/assets/images/campaign_mobileImg.png"} alt="#" /></span> </div>
                               </div>*/}
                           </div>
                       </div>
                   </div>
               </div>
       );
    }//..... end of render() .....//
}//..... end of Member.

CampaignDetail.propTypes = {};

export default CampaignDetail;
