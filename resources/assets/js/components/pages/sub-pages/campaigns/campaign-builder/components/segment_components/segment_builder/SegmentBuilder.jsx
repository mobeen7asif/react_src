import React, {Component} from 'react';
import {Droppable} from 'react-drag-and-drop'
import DemographicCriteria from "./DemographicCriteria";
import MembershipCriteria from "./MembershipCriteria";
import GamingActivityCriteria from "./GamingActivityCriteria";
import PosActivityCriteria from "./PosActivityCriteria";
import VenueUtilizationCriteria from "./VenueUtilizationCriteria";
import Gender from "./DemographicCriterias/Gender";
import {findIndex} from 'lodash';
import Age from "./DemographicCriterias/Age";
import State from "./DemographicCriterias/State";
import PostCode from "./DemographicCriterias/PostCode";
import MembershipType from "./MembershipCriterias/MembershipType";
import MembershipStatus from "./MembershipCriterias/MembershipStatus";
import PointBalance from "./MembershipCriterias/PointBalance";
import RatingCard from "./MembershipCriterias/RatingCard";
import MembershipJoinDate from "./MembershipCriterias/MembershipJoinDate";
import MembershipExpiry from "./MembershipCriterias/MembershipExpiry";
import MembershipNumber from "./MembershipCriterias/MembershipNumber";
import BulkMemberImport from "./MembershipCriterias/BulkMemberImport";
import GamingPlayer from "./GamingActivityCriterias/GamingPlayer";
import GamingTurnover from "./GamingActivityCriterias/GamingTurnover";
import GamingSpend from "./GamingActivityCriterias/GamingSpend";
import CancelCreditAmount from "./GamingActivityCriterias/CancelCreditAmount";
import RecentTickets from "./GamingActivityCriterias/RecentTickets";
import DrawWinner from "./GamingActivityCriterias/DrawWinner";
import GamingSpendTime from "./GamingActivityCriterias/GamingSpendTime";
import GamingSpendOn from "./GamingActivityCriterias/GamingSpendOn";
import PosSpendDate from "./PosActivityCriterias/PosSpendDate";
import PosLocation from "./PosActivityCriterias/PosLocation";
import PosSaleItem from "./PosActivityCriterias/PosSaleItem";
import PosSpendTime from "./PosActivityCriterias/PosSpendTime";
import VenueUtilization from "./VenueUtilizationCriterias/VenueUtilization";
import AllUsers from "./DemographicCriterias/AllUsers";
import {connect} from "react-redux";
import {addNewSegmentValue} from "../../../../../../../redux/actions/CampaignBuilderActions";
import ScanQrCode from "./MissionCriterias/ScanQrCode";
import MissionCriteria from "./MissionCriteria";
import UserSignUp from "./MissionCriterias/UserSignUp";
import UserLiveLocation from "./MissionCriterias/UserLiveLocation";
import UserOptionalFields from "./MissionCriterias/UserOptionalFields";
import PromotionCriteria from "./PromotionCriteria";
import VoucherExpiry from "./PromotionCriterias/VoucherExpiry";
import VoucherStatus from "./PromotionCriterias/VoucherStatus";
import TokenNotUsed from "./PromotionCriterias/TokenNotUsed";
import PunchCardStatus from "./PromotionCriterias/PunchCardStatus";
import TokenUsedInCharity from "./PromotionCriterias/TokenUsedInCharity";
import TokenUsed from "./PromotionCriterias/TokenUsed";
import LastLogin from "./MembershipCriterias/LastLogin";
import RefferingUser from "./MembershipCriterias/RefferingUser";
import EnterVenue from "./MembershipCriterias/EnterVenue";
import BirthDay1 from "./DemographicCriterias/BirthDay";
import DefaultVenue from "./MembershipCriterias/DefaultVenue";
import CompletedSurvey from "./PromotionCriterias/CompletedSurvey";
import SeenVideo from "./PromotionCriterias/SeenVideo";
import CampaignTriggers from "./PromotionCriterias/CampaignTriggers";
import MemberGroup from "./PromotionCriterias/MemberGroup";
import UserSource from "./MembershipCriterias/UserSource";
import RefferedUser from "./MembershipCriterias/RefferedUser";
import LastTransaction from "./MembershipCriterias/LastTransaction";
import TotalSpending from "./MembershipCriterias/TotalSpending";
import SpenderPercentage from "./MembershipCriterias/SpenderPercentage";

import AverageBasketValue from "./MembershipCriterias/AverageBasketValue";
import PostCodeNew from "./DemographicCriterias/PostCodeNew";
import Activity from "./MembershipCriterias/Activity";
import GapMap from "./MembershipCriterias/GapMap";
import TargetUsers from "./MembershipCriterias/TargetUsers";
import Reagion from "./MembershipCriterias/Reagion";
import TransactionAmount from "./MissionCriterias/TransactionAmount";
import ReferralUsers from "./MissionCriterias/ReferralUsers";
import CustomNumber from "./CustomFieldCriteria/CustomNumber";
import CustomText from "./CustomFieldCriteria/CustomText";
import CustomDate from "./CustomFieldCriteria/CustomDate";
import MemberCustomFieldCriteria from "./MemberCustomFieldCriteria";
import CustomBoolean from "./CustomFieldCriteria/CustomBoolean";
import CustomDateTime from "./CustomFieldCriteria/CustomDateTime";
import CustomDropDown from "./CustomFieldCriteria/CustomDropDown";
import CustomMultiSelect from "./CustomFieldCriteria/CustomMultiSelect";
import {NotificationManager} from "react-notifications";
import StoreName from "./MembershipCriterias/StoreName";



class SegmentBuilder extends Component {

    constructor(props) {
        super(props);
        this.dropZone = React.createRef();
    }

    state = {
        data:[],
        venueFields: JSON.parse(localStorage.getItem('memberCustomFields')),
        user_form: JSON.parse(localStorage.getItem('user_form'))
    };


    componentDidMount = () => {

        $(".clickAccordian").click(function () {
            if (!$(this).hasClass('active')) {
                $(".segments_accordian ul li a").removeClass("active");
                $(this).addClass("active");
                $(".clickAccordian_show").stop().slideUp(500);
                $(this).parent(".segments_accordian ul li").find(".clickAccordian_show").stop().slideDown();
            } else {
                $(this).removeClass("active");
                $(this).parent(".segments_accordian ul li").find(".clickAccordian_show").stop().slideUp(500);
            }//..... end if() .....//
        });

        this.checkAndAddClassToDropZone();


    };//..... end of componentDidMount() .....//

    removeCriteria = (criteria,field_id="") => {
        let modifiedCriterias = this.props.segment.new_segment.criterias.filter((obj) => {
            return obj.name !== criteria;
        });

        this.props.dispatch(addNewSegmentValue({criterias: modifiedCriterias}));
        if(field_id)
            document.querySelector(`#${field_id}Criteria`).classList.remove('disableCriteria');
        else
            document.querySelector(`#${criteria.replace('.', '_')}Criteria`).classList.remove('disableCriteria');


    };//..... end of removeCriteria() .....//

    removeCriteriaWhileEditing = (criteria) => {
        let modifiedCriterias = this.props.segment.new_segment.criterias.filter((obj) => {
            return obj.name !== criteria;
        });

        this.props.dispatch(addNewSegmentValue({criterias: modifiedCriterias}));
    }

    componentDidUpdate = () => {
        this.checkAndAddClassToDropZone();

    };//..... end of componentDidUpdate() .....//

    checkAndAddClassToDropZone = () => {
        if ((!this.props.segment.new_segment.criterias) || (this.props.segment.new_segment.criterias && this.props.segment.new_segment.criterias.length === 0))
            this.dropZone.classList.add('image_notify_upload_area');
    };//..... end of checkAndAddClassToDropZone() .....//

    onDrop = (data) => {
        this.dropZone.classList.remove('image_notify_upload_area');
        this.addCriteria(data.tags);
    };//..... end of onDrop() .....//

    addCriteria = (criteria) => {

        let newSegment = this.props.segment.new_segment ? this.props.segment.new_segment : [];
        let newCriteria = this.setDefaultValue(criteria);

        if (criteria !== 'allUsers' && newSegment.criterias)
            newSegment.criterias.unshift(newCriteria);
        else
            newSegment.criterias = [newCriteria];

        this.props.dispatch(addNewSegmentValue({criterias: newSegment.criterias}));
        console.log(`${criteria.replace('.', '_')}Criteria`);
        document.querySelector(`#${criteria.replace('.', '_')}Criteria`).classList.add('disableCriteria');
    };//..... end of addCriteria() ......//

    setCriteriaValue = (criteria, name, value) => {

        let preCriterias = this.props.segment.new_segment.criterias ? this.props.segment.new_segment.criterias : [];

        let index = findIndex(preCriterias, (o) => o.name === criteria);
        if (index >= 0)
            preCriterias[index][name] = value;
        else {
            preCriterias.push({name: criteria, [name]: value});
        }//..... end if-else() .....//


        this.props.dispatch(addNewSegmentValue({criterias: preCriterias}));
    };//.....end of setCriteriaValue() .....//

    handleCriteriaDoubleClick = (criteria) => {

        this.dropZone.classList.remove('image_notify_upload_area');
        this.addCriteria(criteria);
    };//..... end of handleCriteriaDoubleClick() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <Droppable types={['tags']} onDrop={this.onDrop}>
                <div className="segment_tYpe">
                    <div className="segment_tYpe_heading">
                        <h3>SEGMENT BUILDER</h3>
                    </div>
                    <div className="segment_tYpe_detail">
                        <div className="selectDescription">
                            <p>Drag and drop or double click the fields you wish to use to create a new segment.</p>
                        </div>
                        <div className="segmentsBuilder_container clearfix">
                            <div className="segmentsSection_left">
                                <div className="segment_heading">
                                    <h3>SEGMENTS</h3>
                                </div>
                                <div className="segmentsAccordianList">
                                    <div className="segments_accordian">
                                        <div className="acordianSeprator">&nbsp;</div>
                                        <ul>
                                            {appPermission("SegmentDemographicCriteria","view") && (
                                                <DemographicCriteria
                                                    handleCriteriaDoubleClick={this.handleCriteriaDoubleClick}
                                                    criterias={this.props.segment.new_segment.criterias} checkSegmentCriteria={this.props.checkSegmentCriteria}/>
                                            )}

                                            {appPermission("SegmentMembershipCriteria","view") && (
                                                < MembershipCriteria
                                                    handleCriteriaDoubleClick={this.handleCriteriaDoubleClick}
                                                    criterias={this.props.segment.new_segment.criterias} checkSegmentCriteria={this.props.checkSegmentCriteria}/>
                                            )}

                                            {(this.state.venueFields.length > 0 && this.state.venueFields[0].field_name !="" && appPermission("SegmentCustomFieldCriteria","view")) && (
                                                <MemberCustomFieldCriteria
                                                    key={"custom_member_criteria_01"}
                                                    handleCriteriaDoubleClick={this.handleCriteriaDoubleClick}
                                                    criterias={this.props.segment.new_segment.criterias}
                                                    listSegments={this.state.venueFields}
                                                    segment_name="Custom Fields: Members"
                                                />
                                            )}

                                            {(this.state.user_form.length > 0  && appPermission("SegmentCustomFieldCriteria","view")) && (
                                                this.state.user_form.map((value,key)=>{

                                                    return (
                                                        <MemberCustomFieldCriteria
                                                            key={key+"_form"}
                                                            handleCriteriaDoubleClick={this.handleCriteriaDoubleClick}
                                                            criterias={this.props.segment.new_segment.criterias}
                                                            listSegments={value.custom_fields}
                                                            segment_name={"Custom Fields: "+value.field_label}
                                                        />
                                                    )
                                                })
                                            )}


                                            {(appPermission("SegmentPromotions","view") && appPermission("SegmentCustomFieldCriteria","view")) && (
                                                <PromotionCriteria
                                                    handleCriteriaDoubleClick={this.handleCriteriaDoubleClick}
                                                    criterias={this.props.segment.new_segment.criterias} checkSegmentCriteria={this.props.checkSegmentCriteria}/>
                                            )}



                                            {/*  <GamingActivityCriteria handleCriteriaDoubleClick={this.handleCriteriaDoubleClick} criterias={this.props.segment.new_segment.criterias}/>
                                        <PosActivityCriteria handleCriteriaDoubleClick={this.handleCriteriaDoubleClick} criterias={this.props.segment.new_segment.criterias}/>
                                        <VenueUtilizationCriteria handleCriteriaDoubleClick={this.handleCriteriaDoubleClick} criterias={this.props.segment.new_segment.criterias}/>*/}
                                            {
                                                (this.props.selectedCampaign === 'Gamification') && (
                                                    <MissionCriteria
                                                        handleCriteriaDoubleClick={this.handleCriteriaDoubleClick}
                                                        criterias={this.props.segment.new_segment.criterias} checkSegmentCriteria={this.props.checkSegmentCriteria}/>
                                                )}

                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="segmentsSection_right">
                                <div className="segment_heading segmentaxn_heading">
                                    <h3>YOUR SEGMENTATION</h3>
                                </div>
                                <div className="segmentaxn_detail">

                                    <div className="segmentDropZone" ref={(ref) => {
                                        this.dropZone = ref;
                                        console.log(this.dropZone);
                                    }}>
                                        {(this.props.segment.new_segment.criterias ? this.props.segment.new_segment.criterias : []).map((scrit) => {
                                            return this.getSpecifiedCriteria(scrit)
                                        })}
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </Droppable>
        );
    }//..... end of render() .....//

    isCustomFieldExist = (segment_name) => {
        let memberCustomFields= JSON.parse(localStorage.getItem('memberCustomFields'));
        let field_name = memberCustomFields.filter((value)=>{
            return value.field_unique_id == segment_name;
        });
        if(field_name.length > 0){
            return true;
        }else{
            this.removeCriteriaWhileEditing(segment_name);
            return false;
        }

    }

    getSpecifiedCriteria = (criteria) => {

        let fieldType = this.getFieldTypeByid(criteria.name);
        fieldType = criteria.hasOwnProperty("field_type") ? criteria.field_type : "not_found_component";


        /*if(fieldType == "number" && this.isCustomFieldExist(criteria.name)){
            return <CustomNumber key={criteria.name} criteria={criteria} component_name={criteria.name}  removeCriteria={this.removeCriteria}
                                 setCriteriaValue={this.setCriteriaValue}/>;
        }*/

        if(criteria.field_type == "number"){
            return <CustomNumber key={criteria.name} field_name={criteria.field_name} criteria={criteria} component_name={criteria.name}  removeCriteria={this.removeCriteria}
                                 setCriteriaValue={this.setCriteriaValue}/>;
        }
        if(fieldType == "text"){
            return <CustomText key={criteria.name} field_name={criteria.field_name} criteria={criteria} component_name={criteria.name}  removeCriteria={this.removeCriteria}
                                 setCriteriaValue={this.setCriteriaValue}/>;
        }
        if(fieldType == "date"){
            return <CustomDate key={criteria.name} field_name={criteria.field_name} criteria={criteria} component_name={criteria.name}  removeCriteria={this.removeCriteria}
                                 setCriteriaValue={this.setCriteriaValue}/>;
        }
        if(fieldType == "bollean"){
            return <CustomBoolean key={criteria.name} field_name={criteria.field_name} criteria={criteria} component_name={criteria.name}  removeCriteria={this.removeCriteria}
                               setCriteriaValue={this.setCriteriaValue}/>;
        }

        if(fieldType == "datetime"){
            return <CustomDateTime key={criteria.name} criteria={criteria} component_name={criteria.name}  removeCriteria={this.removeCriteria}
                               setCriteriaValue={this.setCriteriaValue}/>;
        }

        if(fieldType == "dropdown"){
            let is_multiSelect = JSON.parse(this.isMultiSelect(criteria.name));

            if(is_multiSelect == true){
                return <CustomMultiSelect key={criteria.name} criteria={criteria} is_multiSelect={is_multiSelect} component_name={criteria.name}  removeCriteria={this.removeCriteria}
                                          setCriteriaValue={this.setCriteriaValue}/>;
            }else{
                return <CustomDropDown key={criteria.name} criteria={criteria} is_multiSelect={is_multiSelect} component_name={criteria.name}  removeCriteria={this.removeCriteria}
                                       setCriteriaValue={this.setCriteriaValue}/>;
            }



        }

        switch (criteria.name) {
            case 'gender':
                return <Gender key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                               setCriteriaValue={this.setCriteriaValue}/>;
            case 'allUsers':
                return <AllUsers key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                 setCriteriaValue={this.setCriteriaValue}/>;
            case 'date_of_birth':
                return <Age key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                            setCriteriaValue={this.setCriteriaValue}/>;
            case 'residential_address.state':
                return <State key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                              setCriteriaValue={this.setCriteriaValue}/>;
            case 'residential_address.postal_code':
                return <PostCode key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                 setCriteriaValue={this.setCriteriaValue}/>;
            case 'membership_type_id':
                return <MembershipType key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                       setCriteriaValue={this.setCriteriaValue}/>;
            case 'membership_status':
                return <MembershipStatus key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                         setCriteriaValue={this.setCriteriaValue}/>;
            case 'point_balance':
                return <PointBalance key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                     setCriteriaValue={this.setCriteriaValue}/>;
            case 'rating_grade_id':
                return <RatingCard key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                   setCriteriaValue={this.setCriteriaValue}/>;
            case 'creation_datetime':
                return <MembershipJoinDate key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                           setCriteriaValue={this.setCriteriaValue}/>;
            case 'expiry_datetime':
                return <MembershipExpiry key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                         setCriteriaValue={this.setCriteriaValue}/>;
            case 'membership_number':
                return <MembershipNumber key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                         setCriteriaValue={this.setCriteriaValue}/>;
            case 'bulk_member_import':
                return <BulkMemberImport key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                         setCriteriaValue={this.setCriteriaValue}/>;

            case 'gaming_player':
                return <GamingPlayer key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                     setCriteriaValue={this.setCriteriaValue}/>;
            case 'gaming_turnover':
                return <GamingTurnover key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                       setCriteriaValue={this.setCriteriaValue}/>;
            case 'gaming_spend':
                return <GamingSpend key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                    setCriteriaValue={this.setCriteriaValue}/>;
            case 'cancel_credit_amount':
                return <CancelCreditAmount key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                           setCriteriaValue={this.setCriteriaValue}/>;
            case 'recent_tickets':
                return <RecentTickets key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                      setCriteriaValue={this.setCriteriaValue}/>;
            case 'last_updated_datetime':
                return <DrawWinner key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                   setCriteriaValue={this.setCriteriaValue}/>;
            case 'Gaming_Spend_Time':
                return <GamingSpendTime key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                        setCriteriaValue={this.setCriteriaValue}/>;
            case 'Gaming_Spend_day':
                return <GamingSpendOn key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                      setCriteriaValue={this.setCriteriaValue}/>;

            case 'pos_spend_date':
                return <PosSpendDate key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                     setCriteriaValue={this.setCriteriaValue}/>;
            case 'pos_location':
                return <PosLocation key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                    setCriteriaValue={this.setCriteriaValue}/>;
            case 'pos_sale_item':
                return <PosSaleItem key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                    setCriteriaValue={this.setCriteriaValue}/>;
            case 'POS_Spend_Time':
                return <PosSpendTime key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                     setCriteriaValue={this.setCriteriaValue}/>;

            case 'venue':
                return <VenueUtilization key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                         setCriteriaValue={this.setCriteriaValue}/>;

            case 'scan_qr_code':
                return <ScanQrCode key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                   setCriteriaValue={this.setCriteriaValue}/>;
            case 'user_sign_up':
                return <UserSignUp key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                   setCriteriaValue={this.setCriteriaValue}/>;
            case 'user_gps_detect':
                return <UserLiveLocation key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                         setCriteriaValue={this.setCriteriaValue}/>;
            case 'user_optional_field':
                return <UserOptionalFields key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                           setCriteriaValue={this.setCriteriaValue}/>;

            case 'voucher_expiry':
                return <VoucherExpiry key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}

                                      setCriteriaValue={this.setCriteriaValue}/>;

            case 'voucher_status':
                return <VoucherStatus key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                      setCriteriaValue={this.setCriteriaValue}/>;

            case 'punch_card_status':
                return <PunchCardStatus key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}

                                        setCriteriaValue={this.setCriteriaValue}/>;

            case 'token_not_used':
                return <TokenNotUsed key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                     setCriteriaValue={this.setCriteriaValue}/>;

            case 'token_used_in_charity':
                return <TokenUsedInCharity key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                           setCriteriaValue={this.setCriteriaValue}/>;

            case 'token_used':
                return <TokenUsed key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                  setCriteriaValue={this.setCriteriaValue}/>;
            case 'last_login':
                return <LastLogin key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                  setCriteriaValue={this.setCriteriaValue}/>;
            case 'reffering_users':
                return <RefferingUser key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}

                                      setCriteriaValue={this.setCriteriaValue}/>;

            case 'reffered_user':
                return <RefferedUser key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                     setCriteriaValue={this.setCriteriaValue}/>;
            case 'enter_venue':
                return <EnterVenue key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                   setCriteriaValue={this.setCriteriaValue}/>;
            case 'birth_day':
                return <BirthDay1 key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                  setCriteriaValue={this.setCriteriaValue}/>;
            case 'completed_survey':
                return <CompletedSurvey key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}

                                        setCriteriaValue={this.setCriteriaValue}/>;

            case 'seen_videos':
                return <SeenVideo key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                  setCriteriaValue={this.setCriteriaValue}/>;
            case 'campaign_triggers':
                return <CampaignTriggers key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}

                                         setCriteriaValue={this.setCriteriaValue}/>;
            case 'default_venue':
                return <DefaultVenue key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                     setCriteriaValue={this.setCriteriaValue}/>;
            case 'member_group':
                return <MemberGroup key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                    setCriteriaValue={this.setCriteriaValue}/>;
            case 'user_source':
                return <UserSource key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                   setCriteriaValue={this.setCriteriaValue}/>;
            case 'last_transaction':
                return <LastTransaction key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                        setCriteriaValue={this.setCriteriaValue}/>;
            case 'total_spending':
                return <TotalSpending key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                      setCriteriaValue={this.setCriteriaValue}/>;
            case 'spender_percentage':
                return <SpenderPercentage key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                          setCriteriaValue={this.setCriteriaValue}/>;
            case 'average_basket_value':
                return <AverageBasketValue key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                           setCriteriaValue={this.setCriteriaValue}/>;
            case 'postal_code':
                return <PostCodeNew key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                    setCriteriaValue={this.setCriteriaValue}/>;
            case 'user_activity':
                return <Activity key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                 setCriteriaValue={this.setCriteriaValue}/>;

            case 'gap_map_users':
                return <GapMap key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                               setCriteriaValue={this.setCriteriaValue}/>;

            case 'target_users':
                return <TargetUsers key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                   setCriteriaValue={this.setCriteriaValue}/>;
            case 'user_region':
                return <Reagion key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                   setCriteriaValue={this.setCriteriaValue}/>;
            case 'transaction_amount':
                return <TransactionAmount key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                   setCriteriaValue={this.setCriteriaValue}/>;
            case 'referral_user':
                return <ReferralUsers key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                     setCriteriaValue={this.setCriteriaValue} />;
            case 'venue_store_name':
                return <StoreName key={criteria.name} criteria={criteria} removeCriteria={this.removeCriteria}
                                  setCriteriaValue={this.setCriteriaValue}/>;
            default:
                return "";
                //return "Couldn't fetch the component.....";
        }//..... end switch() .....//
    };//..... end of getSpecifiedCriteria() .....//

    setDefaultValue = (criteria) => {
        let newCriteria = {name: criteria};
        let fieldType = this.getFieldTypeByid(criteria);
        let fieldName = this.getCustomFieldName(criteria);

        if(fieldType == "number"){
            newCriteria.value = {number: '',field_name:fieldName,field_type:fieldType};
            newCriteria.field_name = fieldName;
            newCriteria.field_type = fieldType;
            return newCriteria;
        }
        if(fieldType == "date"){
            newCriteria.value = {fromDate:null,toDate:null,customDate:null,field_name:fieldName,field_type:fieldType};
            newCriteria.field_name = fieldName;
            newCriteria.field_type = fieldType;
            return newCriteria;
        }

        if(fieldType == "datetime"){
            newCriteria.value = {fromDate:null,toDate:null,customDate:null,field_name:fieldName,field_type:fieldType};
            newCriteria.field_name = fieldName;
            newCriteria.field_type = fieldType;
            return newCriteria;
        }
        if(fieldType == "text"){
            newCriteria.value = {number: '',field_name:fieldName,field_type:fieldType,match_all:false};
            newCriteria.field_name = fieldName;
            newCriteria.field_type = fieldType;
            return newCriteria;
        }

        if(fieldType == "bollean"){
            newCriteria.value = {is_true: false,field_name:fieldName,field_type:fieldType};
            newCriteria.field_name = fieldName;
            newCriteria.field_type = fieldType;
            return newCriteria;
        }
        if(fieldType == "dropdown"){
            newCriteria.value = {custom_drop_down: [],field_name:fieldName,field_type:fieldType,match_all:false};
            newCriteria.field_name = fieldName;
            newCriteria.field_type = fieldType;
            return newCriteria;
        }

        switch (criteria) {
            case 'gender':
                newCriteria.value = ['male'];
                break;
            case 'allUsers':
                newCriteria.value = 'allUsers';
                break;
            case 'date_of_birth':
                newCriteria.value = '25-34';
                break;

            case 'residential_address.postal_code':
            case 'membership_type_id':
            case 'rating_grade_id':
            case 'pos_sale_item':
            case 'residential_address.state':
                newCriteria.value = [];
                break;
            case 'bulk_member_import':
            case 'Gaming_Spend_Time':
            case 'POS_Spend_Time':
            case 'membership_status':
                newCriteria.value = '';
                break;
            case 'point_balance':
                newCriteria.value = {pv1: '', pv2: '', v1: '', v2: ''};
                break;
            case 'creation_datetime':
                newCriteria.value = {memberJoin: '', fromDate: null, toDate: null};
                break;
            case 'expiry_datetime':
                newCriteria.value = {memberExpire: '', fromDate: null, toDate: null};
                break;
            case 'membership_number':
                newCriteria.value = {memberNumber: '', from: null, to: null};
                break;
            case 'gaming_turnover':
                newCriteria.value = {
                    gaming_turnover: {condition: '', v1: '', v2: ''},
                    transaction_date: {condition: '', fromDate: null, toDate: null}
                };
                break;
            case 'gaming_spend':
                newCriteria.value = {
                    gaming_spend: {condition: '', v1: '', v2: ''},
                    transaction_date: {condition: '', fromDate: null, toDate: null}
                };
                break;
            case 'cancel_credit_amount':
                newCriteria.value = {condition: '', v1: null, v2: null, fromDate: '', toDate: ''};
                break;
            case 'recent_tickets':
                newCriteria.value = {v1: '', v2: ''};
                break;
            case 'last_updated_datetime':
                newCriteria.value = {v1: '', v2: '', v3: ''};
                break;
            case 'pos_location':
            case 'pos_spend_date':
                newCriteria.value = {condition: '', fromDate: null, toDate: null};
                break;
            case 'venue':
                newCriteria.value = {member: '', trigger: '', beacons: [], condition: '', fromDate: null, toDate: null};
                break;
            case 'scan_qr_code':
                newCriteria.value = {qr_code: ''};
                break;
            case 'user_sign_up':
                newCriteria.value = '';
                break;
            case 'user_gps_detect':
                newCriteria.value = '';
            case 'user_optional_field':
                newCriteria.value = '';
                break;
            case 'voucher_expiry':
                newCriteria.value = {days: null,campaign_id: null,voucher_name: null,status:null,vouchers:[]};
                break;
            case 'voucher_status':
                newCriteria.value = {status: null,campaign_id: null,voucher_name: null,vouchers:[]};
                break;
            case 'punch_card_status':
                newCriteria.value = {status: null, id: null, name: null,vouchers:[]};
                break;
            case 'token_not_used':
                newCriteria.value = {hours: null};
                break;
            case 'token_used_in_charity':
                newCriteria.value = {status: null,charity_id:0};
                break;
            case 'token_used':
                newCriteria.value = {tokens: null,status:null};
                break;
            case 'last_login':
                newCriteria.value = {days: null,status:null};
                break;
            case 'reffering_users':
                newCriteria.value = {count_users: null,status:null};
                break;
            case 'enter_venue':
                newCriteria.value = {status: null, venue_id: null, name: null,days:null};
                break;

            case 'birth_day':
                newCriteria.value = {birthDayStatus: '', fromDate: null, toDate: null};
                break;
            case 'completed_survey':
                newCriteria.value = {name: null,survey_id:0};
                break;
            case 'seen_videos':
                newCriteria.value = {video_name: null,video_id:0};
                break;
            case 'campaign_triggers':
                newCriteria.value = {campaign_name: null,campaign_id:0,number_of_users:null};
                break;
            case 'default_venue':
                newCriteria.value = {venue_id: null,venue_name:0};
                break;
            case 'member_group':
                newCriteria.value = {id: null,group_name:0};
                break;
            case 'reffered_user':
                newCriteria.value = {is_refferd: false};
                break;
            case 'last_transaction':
                newCriteria.value = {transactionType: '', fromDate: null, toDate: null};
                break;
            case 'total_spending':
                newCriteria.value = {amount: null,status:null};
                break;

            case 'spender_percentage':
                newCriteria.value = {percentage: ''};
                break;
            case 'user_source':
                newCriteria.value = {id: null,group_name:0};
                break;
            case 'average_basket_value':
                newCriteria.value = {amount: null,status:null};
                break;
            case 'postal_code':
                newCriteria.value = {postcode: ''};
                break;
            case 'user_activity':
                newCriteria.value = {activity:[]};
                break;


            case 'target_users':
                newCriteria.value = {id: null,group_name:0};
                break;
            case 'user_region':
                newCriteria.value = {id: null,group_name:0};
                break;
            case 'transaction_amount':
                newCriteria.value = {amount: null,status:null};
                break;

            case 'referral_user':
                newCriteria.value = '';
                break;
            case 'gap_map_users':
                newCriteria.value = {gap_map: true};
                break;
            case 'venue_store_name':
                newCriteria.value = {listStores: []};
                break;

        }//..... end switch() ......//



        return newCriteria;
    };//..... end of

    getCustomFieldName = (segment_name) => {
        let memberCustomFields= JSON.parse(localStorage.getItem('all_custom_fields'));
        let field_name = memberCustomFields.filter((value)=>{
            return value.field_unique_id == segment_name;
        });
        return field_name.length > 0 ? field_name[0].search_name : "";
    }

    getFieldTypeByid = (id) => {
        let memberCustomFields= JSON.parse(localStorage.getItem('all_custom_fields'));
        let field_name = memberCustomFields.filter((value)=>{
            return value.field_unique_id == id;
        });
        return field_name.length > 0 ? field_name[0].field_type : "";
    }


    isMultiSelect = (id) => {
            let memberCustomFields= JSON.parse(localStorage.getItem('all_custom_fields'));
            let field_name = memberCustomFields.filter((value)=>{
                return value.field_unique_id == id;
            });
            return field_name[0].is_multi_select;
        }



}//..... end of SegmentBuilder.



const mapStateToProps = (state) => {
    return {segment: state.campaignBuilder.segment,selectedCampaign: state.campaignBuilder.campaign.selectedCampaign};
};

export default connect(mapStateToProps)(SegmentBuilder);