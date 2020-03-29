import React, {Component} from 'react';
import { Draggable } from 'react-drag-and-drop'
import PropTypes from 'prop-types';
import {addMessageBuilderValue} from "../../../../../../../redux/actions/CampaignBuilderActions";

class TagsComponent extends Component {
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//
    state = {
        customFields : []
    }
    setMessage = (data) => {
        let message = this.props.messageBuilder.message;
        message += "|"+data+"|";

        if(this.props.currentChannel ==='sms') {
            if (message.length > 144)
                return false;
        }

        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, message}}));
    };//..... end of setMessage() .....//
    componentDidMount(){
        $(".clickAccordian").click(function() {
            $(".segments_accordian ul li a").removeClass("active");
            $(this).addClass("active");
            $(".clickAccordian_show").stop().slideUp(500);
            $(this).parent(".segments_accordian ul li").find(".clickAccordian_show").stop().slideDown();
        });
        this.getMemberCustomFields();
    }//..... end of componentDidMount() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    getMemberCustomFields = () => {
        let memberCustomFields= JSON.parse(localStorage.getItem('memberCustomFields'));
        this.setState(()=>({customFields:memberCustomFields}));
    }

    render() {
        return (
            <div className="tagsAccordian_column">
                <div className="segmentsSection_left">
                    <div className="segment_heading">
                        <h3>TAGS</h3>
                    </div>
                    <div className="segmentsAccordianList">
                        <div className="segments_accordian">
                            <div className="acordianSeprator">&nbsp;</div>
                            <ul>
                                <li>
                                    <a className="accordianIcons  clickAccordian"
                                        style={{cursor:'pointer'}}>
                                        <b>1</b>
                                        <small>Name</small>
                                    </a>
                                    <div className="showAccordian_data clickAccordian_show">
                                        <div className="dragAccordianData">
                                            <Draggable type="tags" data="NameTitle" onDoubleClick={(e) => {this.setMessage('NameTitle') }}><strong >Title</strong></Draggable>
                                            <Draggable type="tags" data="FirstName" onDoubleClick={(e) => {this.setMessage('FirstName') }}><strong >First name</strong></Draggable>
                                            <Draggable type="tags" data="LastName" onDoubleClick={(e) => {this.setMessage('LastName') }}><strong >Last name</strong></Draggable>
                                            <Draggable type="tags" data="MiddleInitial" onDoubleClick={(e) => {this.setMessage('MiddleInitial') }}><strong >Middle Initial</strong></Draggable>
                                            <Draggable type="tags" data="OtherName" onDoubleClick={(e) => {this.setMessage('OtherName') }}><strong >Other Name</strong></Draggable>
                                        </div>
                                    </div>
                                </li>

                                <li>
                                    <a className="accordianIcons  clickAccordian"
                                       style={{cursor:'pointer'}}>
                                        <b>1</b>
                                        <small>Custom Fields</small>
                                    </a>
                                    <div className="showAccordian_data clickAccordian_show">
                                        <div className="dragAccordianData">
                                            {this.state.customFields.map((value,key)=>{
                                                return (
                                                    <Draggable key={key} type="tags" data={'custom_'+value.search_name} onDoubleClick={(e) => {this.setMessage('custom_'+value.search_name) }}><strong className="capitalize">{value.field_label}</strong></Draggable>
                                                    )

                                            })}

                                        </div>
                                    </div>
                                </li>

                                <li>
                                    <a className="accordianIcons clickAccordian"  style={{cursor:'pointer'}}>
                                        <b>2</b>
                                        <small>Membership</small>
                                    </a>

                                    <div className="showAccordian_data clickAccordian_show">
                                        {/*<Draggable type="tags" data="Balance"  onDoubleClick={(e) => {this.setMessage('Balance') }}>
                                            <div className="dragAccordianData">
                                                <h4>Account Balance</h4>
                                            </div>
                                        </Draggable>*/}

                                        <Draggable type="tags" data="MembershipId"  onDoubleClick={(e) => {this.setMessage('MembershipId') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Membership Number</h4>
                                            </div>
                                        </Draggable>

                                        {/*<Draggable type="tags" data="ExpiryDatetime" onDoubleClick={(e) => {this.setMessage('ExpiryDatetime') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Expiry Date</h4>
                                            </div>
                                        </Draggable>*/}

                                        {/*<Draggable type="tags" data="Id" onDoubleClick={(e) => {this.setMessage('Id') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Member ID</h4>
                                            </div>
                                        </Draggable>*/}

                                        <Draggable type="tags" data="MembershipTypeId" onDoubleClick={(e) => {this.setMessage('MembershipTypeId') }}>
                                            <div className="dragAccordianData">
                                                <h4>Member Type</h4>
                                            </div>
                                        </Draggable>

                                        {/*<Draggable type="tags" data="Status" onDoubleClick={(e) => {this.setMessage('Status') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Patron Status</h4>
                                            </div>
                                        </Draggable>*/}

                                        {/*<Draggable type="tags" data="RatingGradeId" onDoubleClick={(e) => {this.setMessage('RatingGradeId') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Rating Grade</h4>
                                            </div>
                                        </Draggable>*/}

                                        {/*<Draggable type="tags" data="PointTypeId" onDoubleClick={(e) => {this.setMessage('PointTypeId') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Reward Point Type</h4>
                                            </div>
                                        </Draggable>*/}

                                        {/*<Draggable type="tags" data="TicketCount" onDoubleClick={(e) => {this.setMessage('TicketCount') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Number of Tickets</h4>
                                            </div>
                                        </Draggable>*/}

                                    </div>
                                </li>
                                <li>
                                    <a className="accordianIcons clickAccordian"
                                        style={{cursor:'pointer'}}>
                                        <b>3</b>
                                        <small>Contact Details</small>
                                    </a>

                                    <div className="showAccordian_data clickAccordian_show">
                                        <Draggable type="tags" data="Email" onDoubleClick={(e) => {this.setMessage('Email') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Email Address</h4>
                                            </div>
                                        </Draggable>
                                        <Draggable type="tags" data="HomeTelephone" onDoubleClick={(e) => {this.setMessage('HomeTelephone') }}>
                                            <div className="dragAccordianData">
                                                <h4>Home Number</h4>
                                            </div>
                                        </Draggable>
                                        <Draggable type="tags" data="Mobile" onDoubleClick={(e) => {this.setMessage('Mobile') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Mobile Number</h4>
                                            </div>
                                        </Draggable>

                                        {/*<Draggable type="tags" data="ContactOnEmail" onDoubleClick={(e) => {this.setMessage('ContactOnEmail') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Opted for Email</h4>
                                            </div>
                                        </Draggable>*/}

                                        {/*<Draggable type="tags" data="ContactOnMobile" onDoubleClick={(e) => {this.setMessage('ContactOnMobile') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Opted for SMS</h4>
                                            </div>
                                        </Draggable>*/}

                                        {/*<Draggable type="tags" data="ContactOnMail" onDoubleClick={(e) => {this.setMessage('ContactOnMail') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Opted for Mailing</h4>
                                            </div>
                                        </Draggable>*/}

                                        <Draggable type="tags" data="Country" onDoubleClick={(e) => {this.setMessage('Country') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Postal Country</h4>
                                            </div>
                                        </Draggable>

                                        {/*<Draggable type="tags" data="PostalCode" onDoubleClick={(e) => {this.setMessage('PostalCode') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Postal Post Code</h4>
                                            </div>
                                        </Draggable>*/}

                                        {/*<Draggable type="tags" data="Locality" onDoubleClick={(e) => {this.setMessage('Locality') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Postal Suburb</h4>
                                            </div>
                                        </Draggable>*/}

                                        {/*<Draggable type="tags" data="PostalAddress1" onDoubleClick={(e) => {this.setMessage('PostalAddress1') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Postal Street Name</h4>
                                            </div>
                                        </Draggable>*/}

                                        {/*<Draggable type="tags" data="ResPostalCode" onDoubleClick={(e) => {this.setMessage('ResPostalCode') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Residential Postcode</h4>
                                            </div>
                                        </Draggable>*/}


                                        {/*<Draggable type="tags" data="ResLocality" onDoubleClick={(e) => {this.setMessage('ResLocality') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Residential Suburb</h4>
                                            </div>
                                        </Draggable>*/}

                                        {/*<Draggable type="tags" data="ResStateProvince" onDoubleClick={(e) => {this.setMessage('ResStateProvince') }}>
                                            <div className="dragAccordianData">
                                                <h4>Residential State</h4>
                                            </div>
                                        </Draggable>*/}

                                        {/*<Draggable type="tags" data="ResAddress1" onDoubleClick={(e) => {this.setMessage('ResAddress1') }}>
                                            <div className="dragAccordianData">
                                                <h4>Residential Street Name</h4>
                                            </div>
                                        </Draggable>*/}

                                        {/*<Draggable type="tags" data="WorkTelephone" onDoubleClick={(e) => {this.setMessage('WorkTelephone') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Work Number</h4>
                                            </div>
                                        </Draggable>*/}
                                    </div>
                                </li>
                                <li>
                                    <a className="accordianIcons clickAccordian"  style={{cursor:'pointer'}}>
                                        <b>4</b>
                                        <small>Site</small>
                                    </a>

                                    <div className="showAccordian_data clickAccordian_show">
                                        <Draggable type="tags" data="VenueAddress" onDoubleClick={(e) => {this.setMessage('VenueAddress') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Site Address</h4>
                                            </div>
                                        </Draggable>
                                        <Draggable type="tags" data="VenueName" onDoubleClick={(e) => {this.setMessage('VenueName') }}>
                                            <div className="dragAccordianData">
                                                <h4>Site Name</h4>
                                            </div>
                                        </Draggable>
                                        <Draggable type="tags" data="VenuePhoneNo" onDoubleClick={(e) => {this.setMessage('VenuePhoneNo') }}>
                                            <div className="dragAccordianData">
                                                <h4>Site Phone Number</h4>
                                            </div>
                                        </Draggable>
                                    </div>
                                </li>
                                <li>
                                    <a className="accordianIcons clickAccordian"  style={{cursor:'pointer'}}>
                                        <b>5</b>
                                        <small>Activity</small>
                                    </a>

                                    <div className="showAccordian_data clickAccordian_show">
                                        <Draggable type="tags" data="LastVisit" onDoubleClick={(e) => {this.setMessage('LastVisit') }}>
                                            <div className="dragAccordianData">
                                                <h4>Last Visit</h4>
                                            </div>
                                        </Draggable>
                                        {/*<Draggable type="tags" data="LastKioskEntry" onDoubleClick={(e) => {this.setMessage('LastKioskEntry') }}>
                                            <div className="dragAccordianData">
                                                <h4>Last Kiosk Entry</h4>
                                            </div>
                                        </Draggable>*/}

                                        {/*<Draggable type="tags" data="LastGamePlay" onDoubleClick={(e) => {this.setMessage('LastGamePlay') }}>
                                            <div className="dragAccordianData">
                                                <h4>Last Game Play</h4>
                                            </div>
                                        </Draggable>*/}

                                        {/*<Draggable type="tags" data="LastPOSEntry" onDoubleClick={(e) => {this.setMessage('LastPOSEntry') }}>
                                            <div className="dragAccordianData">
                                                <h4>Last POS Spend</h4>
                                            </div>
                                        </Draggable>*/}

                                        <Draggable type="tags" data="CreationDatetime" onDoubleClick={(e) => {this.setMessage('CreationDatetime') }}>
                                            <div className="dragAccordianData">
                                                <h4>Join Date</h4>
                                            </div>
                                        </Draggable>
                                    </div>
                                </li>
                                {/*<li>
                                    <a className="accordianIcons clickAccordian"
                                        style={{cursor:'pointer'}}>
                                        <b>6</b>
                                        <small>Mycash</small>
                                    </a>
                                    <div className="showAccordian_data clickAccordian_show">
                                        <Draggable type="tags" data="MycashExpiry" onDoubleClick={(e) => {this.setMessage('MycashExpiry') }}>
                                            <div className="dragAccordianData">
                                                <h4>Mycash Expiry Date</h4>
                                            </div>
                                        </Draggable>
                                        <Draggable type="tags" data="MycashBalance" onDoubleClick={(e) => {this.setMessage('MycashBalance') }}>
                                            <div className="dragAccordianData">
                                                <h4>Mycash Balance</h4>
                                            </div>
                                        </Draggable>
                                    </div>
                                </li>*/}
                               {/* <li>
                                    <a className="accordianIcons clickAccordian"
                                        style={{cursor:'pointer'}}>
                                        <b>7</b>
                                        <small>Social Media</small>
                                    </a>
                                    <div className="showAccordian_data clickAccordian_show">
                                        <Draggable type="tags" data="twitter" onDoubleClick={(e) => {this.setMessage('twitter') }}>
                                            <div className="dragAccordianData">
                                                <h4>Twitter</h4>
                                            </div>
                                        </Draggable>
                                        <Draggable type="tags" data="facebook" onDoubleClick={(e) => {this.setMessage('facebook') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Facebook</h4>
                                            </div>
                                        </Draggable>
                                        <Draggable type="tags" data="instagram" onDoubleClick={(e) => {this.setMessage('instagram') }}>
                                            <div className="dragAccordianData">
                                                <h4 >Instagram</h4>
                                            </div>
                                        </Draggable>
                                    </div>
                                </li>*/}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of TagsComponent.

TagsComponent.propTypes = {};

export default TagsComponent;