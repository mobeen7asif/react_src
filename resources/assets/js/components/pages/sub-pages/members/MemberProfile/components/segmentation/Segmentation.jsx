import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import Demographic from "./sub_components/Demographic";
import { PrintTool } from "react-print-tool";

class Segmentation extends Component {

    state = {
        demographic : true,
        membership : false,
        gaming : false,
        pos : false,
        venue : false,
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidMount = () => {
    };//..... end of componentDidMount() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    demographicClick = () => {
        ((this.state.demographic)) ? this.setState({demographic : false}) : this.setState({demographic : true});
    };
    memberShipClick = () => {
        ((this.state.membership)) ? this.setState({membership : false}) : this.setState({membership : true});
    };
    gamingClick = () => {
        ((this.state.gaming)) ? this.setState({gaming : false}) : this.setState({gaming : true});
    };
    posClick = () => {
        ((this.state.pos)) ? this.setState({pos : false}) : this.setState({pos : true});
    };
    venueClick = () => {
        ((this.state.venue)) ? this.setState({venue : false}) : this.setState({venue : true});
    };

    printDiv = (divName) => {
        var hashid = "#"+ divName;
        var tagname =  $(hashid).prop("tagName").toLowerCase() ;
        var attributes = "";
        var attrs = document.getElementById(divName).attributes;
        $.each(attrs,function(i,elem){
            attributes +=  " "+  elem.name+" ='"+elem.value+"' " ;
        })
        var divToPrint= $(hashid).html() ;
        var head = "<html><head>"+ $("head").html() + "</head>" ;
        var allcontent = head + "<body  onload='window.focus(); window.print(); window.close()' >"+ "<" + tagname + attributes + ">" +  divToPrint + "</" + tagname + ">" +  "</body></html>"  ;
        var newWin=window.open('','Print-Window');
        newWin.document.open();
        newWin.document.write(allcontent);
        newWin.document.close();
    };

    render() {
        return (
            <div className="e_member_right">
                <div className="add_category_listing">
                    <ul>
                        <li>
                            <div className="add_categoryList_info addProduct_setting">
                                <div className="newVualt_heading">
                                    <h3>Member / <a href="javascript:void(0);">Segmentation</a></h3>
                                </div>
                                <div className="categoryInfo_container clearfix" id={'printableArea'}>
                                    <div className="addCategoryRight_section">
                                        <div className="edit_category_rightDetail removeHighlights">
                                            <div className="e_segment_accordion_out">
                                                <div className="e_segment_accordion_row" >
                                                    <div onClick={this.demographicClick} className={(this.state.demographic) ? 'e_segment_accordionTitle active' : 'e_segment_accordionTitle'}>
                                                        <div className="transection_list_title">
                                                            <b className="plusButton" />
                                                            <label>DEMOGRAPHIC Criteria</label>
                                                        </div>
                                                    </div>
                                                    <div className="e_segment_accordion_show" style={(this.state.demographic) ? {display: 'block'} : {display: 'none'}}>
                                                       <Demographic load_data={this.state.demographic} persona_id={this.props.persona_id}/>
                                                    </div>
                                                </div>
                                             {/*   <div className="e_segment_accordion_row" onClick={this.memberShipClick}>
                                                    <div className={(this.state.membership) ? 'e_segment_accordionTitle active' : 'e_segment_accordionTitle'}>
                                                        <div className="transection_list_title">
                                                            <b className="plusButton" />
                                                            <label>Membership Criteria</label>
                                                        </div>
                                                    </div>
                                                    <div className="e_segment_accordion_show" style={(this.state.membership) ? {display: 'block'} : {display: 'none'}}>
                                                        <div className="e_membership_main">
                                                            <div className="e_membership_listing">
                                                                <ul>
                                                                    <li>
                                                                        <div className="e_membership">
                                                                            <div className="e_membership_left">
                                                                                <div className="e_membership_text">
                                                                                    <span>Membership Type</span>
                                                                                    <strong>Membership Level Input</strong>
                                                                                </div>
                                                                            </div>
                                                                            <div className="e_membership_mid">
                                                                                <div className="e_membership_progress">
                                                                                    <div className="e_membership_progress progressGreen progressWidth_20"><span>80%</span></div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="e_membership_right">
                                                                                <div className="e_membership_text">
                                                                                    <strong>8 000 / 10 000</strong>
                                                                                    <span>Segment</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="e_membership">
                                                                            <div className="e_membership_left">
                                                                                <div className="e_membership_text">
                                                                                    <span>Membership Type</span>
                                                                                    <strong>Membership Level Input</strong>
                                                                                </div>
                                                                            </div>
                                                                            <div className="e_membership_mid">
                                                                                <div className="e_membership_progressOut">
                                                                                    <div className="e_membership_progress progressBlue progressWidth_50"><span>50%</span></div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="e_membership_right">
                                                                                <div className="e_membership_text">
                                                                                    <strong>5 000 / 10 000</strong>
                                                                                    <span>Segment</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="e_membership">
                                                                            <div className="e_membership_left">
                                                                                <div className="e_membership_text">
                                                                                    <span>Points Balance</span>
                                                                                    <strong>1 309 90 points</strong>
                                                                                </div>
                                                                            </div>
                                                                            <div className="e_membership_mid">
                                                                                <div className="e_membership_progress">
                                                                                    <div className="e_membership_progress progressSky progressWidth_40"><span>40%</span></div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="e_membership_right">
                                                                                <div className="e_membership_text">
                                                                                    <strong>4 000 / 10 000</strong>
                                                                                    <span>Segment</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="e_membership">
                                                                            <div className="e_membership_left">
                                                                                <div className="e_membership_text">
                                                                                    <span>Rating Card</span>
                                                                                    <strong>Rating Card Input</strong>
                                                                                </div>
                                                                            </div>
                                                                            <div className="e_membership_mid">
                                                                                <div className="e_membership_progress">
                                                                                    <div className="e_membership_progress progressGreen progressWidth_50"><span>50%</span></div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="e_membership_right">
                                                                                <div className="e_membership_text">
                                                                                    <strong>5 000 / 10 000</strong>
                                                                                    <span>Segment</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="e_membership">
                                                                            <div className="e_membership_left">
                                                                                <div className="e_membership_text">
                                                                                    <span>Membership Join Date</span>
                                                                                    <strong>11/01/2011</strong>
                                                                                </div>
                                                                            </div>
                                                                            <div className="e_membership_mid">
                                                                                <div className="e_membership_progressOut">
                                                                                    <div className="e_membership_progress progressBlue progressWidth_15"><span>15%</span></div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="e_membership_right">
                                                                                <div className="e_membership_text">
                                                                                    <strong>1 5000 / 10 000</strong>
                                                                                    <span>Segment</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="e_membership">
                                                                            <div className="e_membership_left">
                                                                                <div className="e_membership_text">
                                                                                    <span>Membership Expiry</span>
                                                                                    <strong>11/01/2021</strong>
                                                                                </div>
                                                                            </div>
                                                                            <div className="e_membership_mid">
                                                                                <div className="e_membership_progress">
                                                                                    <div className="e_membership_progress progressSky progressWidth_20"><span>20%</span></div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="e_membership_right">
                                                                                <div className="e_membership_text">
                                                                                    <strong>2 000 / 10 000</strong>
                                                                                    <span>Segment</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="e_membership">
                                                                            <div className="e_membership_left">
                                                                                <div className="e_membership_text">
                                                                                    <span>Membership Join Date</span>
                                                                                    <strong>11/01/2011</strong>
                                                                                </div>
                                                                            </div>
                                                                            <div className="e_membership_mid">
                                                                                <div className="e_membership_progress">
                                                                                    <div className="e_membership_progress progressGreen progressWidth_15"><span>15%</span></div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="e_membership_right">
                                                                                <div className="e_membership_text">
                                                                                    <strong>1 5000 / 10 000</strong>
                                                                                    <span>Segment</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="e_membership">
                                                                            <div className="e_membership_left">
                                                                                <div className="e_membership_text">
                                                                                    <span>Membership Expiry</span>
                                                                                    <strong>11/01/2021</strong>
                                                                                </div>
                                                                            </div>
                                                                            <div className="e_membership_mid">
                                                                                <div className="e_membership_progressOut">
                                                                                    <div className="e_membership_progress progressBlue progressWidth_20"><span>20%</span></div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="e_membership_right">
                                                                                <div className="e_membership_text">
                                                                                    <strong>2 000 / 10 000</strong>
                                                                                    <span>Segment</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>*/}
                                                {/*<div className="e_segment_accordion_row" onClick={this.gamingClick}>*/}
                                                    {/*<div className={(this.state.gaming) ? 'e_segment_accordionTitle active' : 'e_segment_accordionTitle'}>*/}
                                                        {/*<div className="transection_list_title">*/}
                                                            {/*<b className="plusButton" />*/}
                                                            {/*<label>Gaming Activity Criteria</label>*/}
                                                        {/*</div>*/}
                                                    {/*</div>*/}
                                                    {/*<div className="e_segment_accordion_show" style={(this.state.gaming) ? {display: 'block'} : {display: 'none'}}>*/}
                                                        {/*<div className="e_segmentdemographic">*/}
                                                            {/*<div className="cmDashboard_columns">*/}
                                                                {/*<ul>*/}
                                                                    {/*<li>*/}
                                                                        {/*<div className="column_dboard_widget2 clearfix">*/}
                                                                            {/*<div className="column_dboard_widgetDetail2">*/}
                                                                                {/*<div className="columnHeading">*/}
                                                                                    {/*<label>GENDER SPLIT</label>*/}
                                                                                {/*</div>*/}
                                                                                {/*<div className="averageSale_amountinfo">*/}
                                                                                    {/*<div className="segment_gender_header blueBg clearfix">*/}
                                                                                        {/*<div className="segment_gender_left">*/}
                                                                                            {/*<h4>Female</h4>*/}
                                                                                        {/*</div>*/}
                                                                                        {/*<div className="segment_gender_right">*/}
                                                                                            {/*<h4><b>8 500</b> / 10 000</h4>*/}
                                                                                            {/*<span>Gender Segment</span>*/}
                                                                                        {/*</div>*/}
                                                                                    {/*</div>*/}
                                                                                    {/*<div className="salveAmountGraph"> <img src={BaseUrl+"/assets/images/segment_gender_graph.png"} alt="#" style={{display: 'block', width: '100%'}} /> </div>*/}
                                                                                {/*</div>*/}
                                                                            {/*</div>*/}
                                                                        {/*</div>*/}
                                                                    {/*</li>*/}
                                                                    {/*<li>*/}
                                                                        {/*<div className="column_dboard_widget2 clearfix">*/}
                                                                            {/*<div className="column_dboard_widgetDetail2">*/}
                                                                                {/*<div className="columnHeading">*/}
                                                                                    {/*<label>AGE SPLIT</label>*/}
                                                                                {/*</div>*/}
                                                                                {/*<div className="averageSale_amountinfo">*/}
                                                                                    {/*<div className="segment_gender_header clearfix">*/}
                                                                                        {/*<div className="segment_gender_left">*/}
                                                                                            {/*<h1>38<span>YEARS <br />OLD</span></h1>*/}
                                                                                        {/*</div>*/}
                                                                                        {/*<div className="segment_gender_right">*/}
                                                                                            {/*<h4><b>1 500</b> / 10 000</h4>*/}
                                                                                            {/*<span>Age Segment</span>*/}
                                                                                        {/*</div>*/}
                                                                                    {/*</div>*/}
                                                                                    {/*<div className="salveAmountGraph"> <img src={BaseUrl+"/assets/images/segmrnt_gender_age.png"} alt="#" style={{display: 'block', width: '100%'}} /> </div>*/}
                                                                                {/*</div>*/}
                                                                            {/*</div>*/}
                                                                        {/*</div>*/}
                                                                    {/*</li>*/}
                                                                    {/*<li>*/}
                                                                        {/*<div className="column_dboard_widget2 clearfix">*/}
                                                                            {/*<div className="column_dboard_widgetDetail2">*/}
                                                                                {/*<div className="columnHeading">*/}
                                                                                    {/*<label>STATE</label>*/}
                                                                                {/*</div>*/}
                                                                                {/*<div className="averageSale_amountinfo">*/}
                                                                                    {/*<div className="segment_gender_header darkBlueBg blueBg clearfix">*/}
                                                                                        {/*<div className="segment_gender_left">*/}
                                                                                            {/*<div className="segment_state_main">*/}
                                                                                                {/*<div className="segment_state_left">*/}
                                                                                                    {/*<div className="segment_state_circle">*/}
                                                                                                        {/*<img src={BaseUrl+"/assets/images/segment_state_circle.png"} alt="#" style={{display: 'block'}} />*/}
                                                                                                    {/*</div>*/}
                                                                                                {/*</div>*/}
                                                                                                {/*<div className="segment_state_right">*/}
                                                                                                    {/*<span>NSW</span>*/}
                                                                                                {/*</div>*/}
                                                                                            {/*</div>*/}
                                                                                        {/*</div>*/}
                                                                                        {/*<div className="segment_gender_right">*/}
                                                                                            {/*<h4><b>5 000</b> / 10 000</h4>*/}
                                                                                            {/*<span>State Segment</span>*/}
                                                                                        {/*</div>*/}
                                                                                    {/*</div>*/}
                                                                                {/*</div>*/}
                                                                            {/*</div>*/}
                                                                        {/*</div>*/}
                                                                    {/*</li>*/}
                                                                    {/*<li>*/}
                                                                        {/*<div className="column_dboard_widget2 clearfix">*/}
                                                                            {/*<div className="column_dboard_widgetDetail2">*/}
                                                                                {/*<div className="columnHeading">*/}
                                                                                    {/*<label>STATE</label>*/}
                                                                                {/*</div>*/}
                                                                                {/*<div className="averageSale_amountinfo">*/}
                                                                                    {/*<div className="segment_gender_header clearfix">*/}
                                                                                        {/*<div className="segment_gender_left">*/}
                                                                                            {/*<div className="segment_state_main">*/}
                                                                                                {/*<div className="segment_state_left">*/}
                                                                                                    {/*<div className="segment_postal_circle">*/}
                                                                                                        {/*<img src={BaseUrl+"/assets/images/segment_postal_circle.png"} alt="#" style={{display: 'block'}} />*/}
                                                                                                    {/*</div>*/}
                                                                                                {/*</div>*/}
                                                                                                {/*<div className="segment_state_right">*/}
                                                                                                    {/*<span>NSW</span>*/}
                                                                                                {/*</div>*/}
                                                                                            {/*</div>*/}
                                                                                        {/*</div>*/}
                                                                                        {/*<div className="segment_gender_right">*/}
                                                                                            {/*<h4><b>5 000</b> / 10 000</h4>*/}
                                                                                            {/*<span>State Segment</span>*/}
                                                                                        {/*</div>*/}
                                                                                    {/*</div>*/}
                                                                                {/*</div>*/}
                                                                            {/*</div>*/}
                                                                        {/*</div>*/}
                                                                    {/*</li>*/}
                                                                {/*</ul>*/}
                                                            {/*</div>*/}
                                                        {/*</div>*/}
                                                    {/*</div>*/}
                                                {/*</div>*/}
                                                {/*<div className="e_segment_accordion_row" onClick={this.posClick}>*/}
                                                    {/*<div className={(this.state.pos) ? 'e_segment_accordionTitle active' : 'e_segment_accordionTitle'}>*/}
                                                        {/*<div className="transection_list_title">*/}
                                                            {/*<b className="plusButton" />*/}
                                                            {/*<label>POS Activity Criteria</label>*/}
                                                        {/*</div>*/}
                                                    {/*</div>*/}
                                                    {/*<div className="e_segment_accordion_show" style={(this.state.pos) ? {display: 'block'} : {display: 'none'}}>*/}
                                                        {/*<div className="e_segmentdemographic">*/}
                                                            {/*<div className="cmDashboard_columns">*/}
                                                                {/*<ul>*/}
                                                                    {/*<li>*/}
                                                                        {/*<div className="column_dboard_widget2 clearfix">*/}
                                                                            {/*<div className="column_dboard_widgetDetail2">*/}
                                                                                {/*<div className="columnHeading">*/}
                                                                                    {/*<label>GENDER SPLIT</label>*/}
                                                                                {/*</div>*/}
                                                                                {/*<div className="averageSale_amountinfo">*/}
                                                                                    {/*<div className="segment_gender_header blueBg clearfix">*/}
                                                                                        {/*<div className="segment_gender_left">*/}
                                                                                            {/*<h4>Female</h4>*/}
                                                                                        {/*</div>*/}
                                                                                        {/*<div className="segment_gender_right">*/}
                                                                                            {/*<h4><b>8 500</b> / 10 000</h4>*/}
                                                                                            {/*<span>Gender Segment</span>*/}
                                                                                        {/*</div>*/}
                                                                                    {/*</div>*/}
                                                                                    {/*<div className="salveAmountGraph"> <img src={BaseUrl+"/assets/images/segment_gender_graph.png"} alt="#" style={{display: 'block', width: '100%'}} /> </div>*/}
                                                                                {/*</div>*/}
                                                                            {/*</div>*/}
                                                                        {/*</div>*/}
                                                                    {/*</li>*/}
                                                                    {/*<li>*/}
                                                                        {/*<div className="column_dboard_widget2 clearfix">*/}
                                                                            {/*<div className="column_dboard_widgetDetail2">*/}
                                                                                {/*<div className="columnHeading">*/}
                                                                                    {/*<label>AGE SPLIT</label>*/}
                                                                                {/*</div>*/}
                                                                                {/*<div className="averageSale_amountinfo">*/}
                                                                                    {/*<div className="segment_gender_header clearfix">*/}
                                                                                        {/*<div className="segment_gender_left">*/}
                                                                                            {/*<h1>38<span>YEARS <br />OLD</span></h1>*/}
                                                                                        {/*</div>*/}
                                                                                        {/*<div className="segment_gender_right">*/}
                                                                                            {/*<h4><b>1 500</b> / 10 000</h4>*/}
                                                                                            {/*<span>Age Segment</span>*/}
                                                                                        {/*</div>*/}
                                                                                    {/*</div>*/}
                                                                                    {/*<div className="salveAmountGraph"> <img src={BaseUrl+"/assets/images/segmrnt_gender_age.png"} alt="#" style={{display: 'block', width: '100%'}} /> </div>*/}
                                                                                {/*</div>*/}
                                                                            {/*</div>*/}
                                                                        {/*</div>*/}
                                                                    {/*</li>*/}
                                                                    {/*<li>*/}
                                                                        {/*<div className="column_dboard_widget2 clearfix">*/}
                                                                            {/*<div className="column_dboard_widgetDetail2">*/}
                                                                                {/*<div className="columnHeading">*/}
                                                                                    {/*<label>STATE</label>*/}
                                                                                {/*</div>*/}
                                                                                {/*<div className="averageSale_amountinfo">*/}
                                                                                    {/*<div className="segment_gender_header darkBlueBg blueBg clearfix">*/}
                                                                                        {/*<div className="segment_gender_left">*/}
                                                                                            {/*<div className="segment_state_main">*/}
                                                                                                {/*<div className="segment_state_left">*/}
                                                                                                    {/*<div className="segment_state_circle">*/}
                                                                                                        {/*<img src={BaseUrl+"/assets/images/segment_state_circle.png"} alt="#" style={{display: 'block'}} />*/}
                                                                                                    {/*</div>*/}
                                                                                                {/*</div>*/}
                                                                                                {/*<div className="segment_state_right">*/}
                                                                                                    {/*<span>NSW</span>*/}
                                                                                                {/*</div>*/}
                                                                                            {/*</div>*/}
                                                                                        {/*</div>*/}
                                                                                        {/*<div className="segment_gender_right">*/}
                                                                                            {/*<h4><b>5 000</b> / 10 000</h4>*/}
                                                                                            {/*<span>State Segment</span>*/}
                                                                                        {/*</div>*/}
                                                                                    {/*</div>*/}
                                                                                {/*</div>*/}
                                                                            {/*</div>*/}
                                                                        {/*</div>*/}
                                                                    {/*</li>*/}
                                                                    {/*<li>*/}
                                                                        {/*<div className="column_dboard_widget2 clearfix">*/}
                                                                            {/*<div className="column_dboard_widgetDetail2">*/}
                                                                                {/*<div className="columnHeading">*/}
                                                                                    {/*<label>STATE</label>*/}
                                                                                {/*</div>*/}
                                                                                {/*<div className="averageSale_amountinfo">*/}
                                                                                    {/*<div className="segment_gender_header clearfix">*/}
                                                                                        {/*<div className="segment_gender_left">*/}
                                                                                            {/*<div className="segment_state_main">*/}
                                                                                                {/*<div className="segment_state_left">*/}
                                                                                                    {/*<div className="segment_postal_circle">*/}
                                                                                                        {/*<img src={BaseUrl+"/assets/images/segment_postal_circle.png"} alt="#" style={{display: 'block'}} />*/}
                                                                                                    {/*</div>*/}
                                                                                                {/*</div>*/}
                                                                                                {/*<div className="segment_state_right">*/}
                                                                                                    {/*<span>NSW</span>*/}
                                                                                                {/*</div>*/}
                                                                                            {/*</div>*/}
                                                                                        {/*</div>*/}
                                                                                        {/*<div className="segment_gender_right">*/}
                                                                                            {/*<h4><b>5 000</b> / 10 000</h4>*/}
                                                                                            {/*<span>State Segment</span>*/}
                                                                                        {/*</div>*/}
                                                                                    {/*</div>*/}
                                                                                {/*</div>*/}
                                                                            {/*</div>*/}
                                                                        {/*</div>*/}
                                                                    {/*</li>*/}
                                                                {/*</ul>*/}
                                                            {/*</div>*/}
                                                        {/*</div>*/}
                                                    {/*</div>*/}
                                                {/*</div>*/}
                                                {/*<div className="e_segment_accordion_row" onClick={this.venueClick}>*/}
                                                    {/*<div className={(this.state.venue) ? 'e_segment_accordionTitle active' : 'e_segment_accordionTitle'}>*/}
                                                        {/*<div className="transection_list_title">*/}
                                                            {/*<b className="plusButton" />*/}
                                                            {/*<label>Venue Utilisation Criteria</label>*/}
                                                        {/*</div>*/}
                                                    {/*</div>*/}
                                                    {/*<div className="e_segment_accordion_show" style={(this.state.venue) ? {display: 'block'} : {display: 'none'}}>*/}
                                                        {/*<div className="e_segmentdemographic">*/}
                                                            {/*<div className="cmDashboard_columns">*/}
                                                                {/*<ul>*/}
                                                                    {/*<li>*/}
                                                                        {/*<div className="column_dboard_widget2 clearfix">*/}
                                                                            {/*<div className="column_dboard_widgetDetail2">*/}
                                                                                {/*<div className="columnHeading">*/}
                                                                                    {/*<label>GENDER SPLIT</label>*/}
                                                                                {/*</div>*/}
                                                                                {/*<div className="averageSale_amountinfo">*/}
                                                                                    {/*<div className="segment_gender_header blueBg clearfix">*/}
                                                                                        {/*<div className="segment_gender_left">*/}
                                                                                            {/*<h4>Female</h4>*/}
                                                                                        {/*</div>*/}
                                                                                        {/*<div className="segment_gender_right">*/}
                                                                                            {/*<h4><b>8 500</b> / 10 000</h4>*/}
                                                                                            {/*<span>Gender Segment</span>*/}
                                                                                        {/*</div>*/}
                                                                                    {/*</div>*/}
                                                                                    {/*<div className="salveAmountGraph"> <img src={BaseUrl+"/assets/images/segment_gender_graph.png"} alt="#" style={{display: 'block', width: '100%'}} /> </div>*/}
                                                                                {/*</div>*/}
                                                                            {/*</div>*/}
                                                                        {/*</div>*/}
                                                                    {/*</li>*/}
                                                                    {/*<li>*/}
                                                                        {/*<div className="column_dboard_widget2 clearfix">*/}
                                                                            {/*<div className="column_dboard_widgetDetail2">*/}
                                                                                {/*<div className="columnHeading">*/}
                                                                                    {/*<label>AGE SPLIT</label>*/}
                                                                                {/*</div>*/}
                                                                                {/*<div className="averageSale_amountinfo">*/}
                                                                                    {/*<div className="segment_gender_header clearfix">*/}
                                                                                        {/*<div className="segment_gender_left">*/}
                                                                                            {/*<h1>38<span>YEARS <br />OLD</span></h1>*/}
                                                                                        {/*</div>*/}
                                                                                        {/*<div className="segment_gender_right">*/}
                                                                                            {/*<h4><b>1 500</b> / 10 000</h4>*/}
                                                                                            {/*<span>Age Segment</span>*/}
                                                                                        {/*</div>*/}
                                                                                    {/*</div>*/}
                                                                                    {/*<div className="salveAmountGraph"> <img src={BaseUrl+"/assets/images/segmrnt_gender_age.png"} alt="#" style={{display: 'block', width: '100%'}} /> </div>*/}
                                                                                {/*</div>*/}
                                                                            {/*</div>*/}
                                                                        {/*</div>*/}
                                                                    {/*</li>*/}
                                                                    {/*<li>*/}
                                                                        {/*<div className="column_dboard_widget2 clearfix">*/}
                                                                            {/*<div className="column_dboard_widgetDetail2">*/}
                                                                                {/*<div className="columnHeading">*/}
                                                                                    {/*<label>STATE</label>*/}
                                                                                {/*</div>*/}
                                                                                {/*<div className="averageSale_amountinfo">*/}
                                                                                    {/*<div className="segment_gender_header darkBlueBg blueBg clearfix">*/}
                                                                                        {/*<div className="segment_gender_left">*/}
                                                                                            {/*<div className="segment_state_main">*/}
                                                                                                {/*<div className="segment_state_left">*/}
                                                                                                    {/*<div className="segment_state_circle">*/}
                                                                                                        {/*<img src={BaseUrl+"/assets/images/segment_state_circle.png"} alt="#" style={{display: 'block'}} />*/}
                                                                                                    {/*</div>*/}
                                                                                                {/*</div>*/}
                                                                                                {/*<div className="segment_state_right">*/}
                                                                                                    {/*<span>NSW</span>*/}
                                                                                                {/*</div>*/}
                                                                                            {/*</div>*/}
                                                                                        {/*</div>*/}
                                                                                        {/*<div className="segment_gender_right">*/}
                                                                                            {/*<h4><b>5 000</b> / 10 000</h4>*/}
                                                                                            {/*<span>State Segment</span>*/}
                                                                                        {/*</div>*/}
                                                                                    {/*</div>*/}
                                                                                {/*</div>*/}
                                                                            {/*</div>*/}
                                                                        {/*</div>*/}
                                                                    {/*</li>*/}
                                                                    {/*<li>*/}
                                                                        {/*<div className="column_dboard_widget2 clearfix">*/}
                                                                            {/*<div className="column_dboard_widgetDetail2">*/}
                                                                                {/*<div className="columnHeading">*/}
                                                                                    {/*<label>STATE</label>*/}
                                                                                {/*</div>*/}
                                                                                {/*<div className="averageSale_amountinfo">*/}
                                                                                    {/*<div className="segment_gender_header clearfix">*/}
                                                                                        {/*<div className="segment_gender_left">*/}
                                                                                            {/*<div className="segment_state_main">*/}
                                                                                                {/*<div className="segment_state_left">*/}
                                                                                                    {/*<div className="segment_postal_circle">*/}
                                                                                                        {/*<img src={BaseUrl+"/assets/images/segment_postal_circle.png"} alt="#" style={{display: 'block'}} />*/}
                                                                                                    {/*</div>*/}
                                                                                                {/*</div>*/}
                                                                                                {/*<div className="segment_state_right">*/}
                                                                                                    {/*<span>NSW</span>*/}
                                                                                                {/*</div>*/}
                                                                                            {/*</div>*/}
                                                                                        {/*</div>*/}
                                                                                        {/*<div className="segment_gender_right">*/}
                                                                                            {/*<h4><b>5 000</b> / 10 000</h4>*/}
                                                                                            {/*<span>State Segment</span>*/}
                                                                                        {/*</div>*/}
                                                                                    {/*</div>*/}
                                                                                {/*</div>*/}
                                                                            {/*</div>*/}
                                                                        {/*</div>*/}
                                                                    {/*</li>*/}
                                                                {/*</ul>*/}
                                                            {/*</div>*/}
                                                        {/*</div>*/}
                                                    {/*</div>*/}
                                                {/*</div>*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="clearfix">
                    <div className="e_member_printBtns clearfix">
                        <ul>
                            <li><a href="javascript:void(0);" onClick={() => {this.printDiv('printableArea')}}>PRINT</a></li>
                        </ul>
                    </div>
                </div>
            </div>

        );
    }//..... end of render() .....//
}//..... end of Member.

Segmentation.propTypes = {};

export default Segmentation;