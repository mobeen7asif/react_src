import React, {Component} from 'react';
import {forEach} from 'lodash';
import TopTabs from "./components/TopTabs";

import CampaignHeading from "./components/CampaignHeading";
import SegmentTypes from "./components/SegmentTypes";
import CampaignDetails from "./components/CampaignDetails";
import SegmentSummary from "./components/segment_components/SegmentSummary";
import ChannelType from "./components/channel_target_components/ChannelType";
import ProximityTrigger from "./components/campaign_components/ProximityTrigger";
import MessageBuilder from "./components/MessageBuilder";
import SchedulingAndConfirmation from "./components/SchedulingAndConfirmation";
import FinalizeAndSaveCampaign, {
    populateGameData,
    populateGameMissionDate
} from "../../../../utils/FinalizeAndSaveCampaign";
import 'react-datepicker/dist/react-datepicker.css';
import {NotificationManager} from "react-notifications";
import {connect} from "react-redux";
import {
    addCampaignSchedulerType,
    addEditCampaignData,
    addSegmentValue,
    resetCampaignBuilder, setGameData, setGameMissionData, setMissionOutcome, setSegmentUsers,
    setSelectedTabs, setVoucherData
} from "../../../../redux/actions/CampaignBuilderActions";
import GameBuilderComponent from "./components/games_component/GameBuilderComponent";
import GameChannelType from "./components/channel_target_components/GameChannelType";

class CampaignBuilder extends Component {

    constructor(props) {
        super(props);
        moment.locale('en');
    }//..... end of constructor() .....//

    tabs = ['Campaign Type', 'Proximity Trigger', 'Segmentation', 'Segment Summary', 'Channel and Target', 'Message Builder', 'Scheduling & Confirmation'];
    icons = { wifi: 'wifiIcon_white@2x.png', push: 'ap_white@2x.png', sms: 'smsIcon_white@2x.png', email: 'em_white@2x.png',
                survey: 'sr-1_white@2x.png', video_ad: 'vid_white@2x.png', web: 'wb_white@2x.png' };

    /**
     * Handle top tab clicked event.
     * @param tabNumber
     */
    topTabClicked = (tabNumber) => {
        /*if (this.tabs[tabNumber] === 'Segment Summary' && Object.keys(this.props.segment.new_segment).length === 0) {
                return false;
        }*///..... end if() .....//

        this.props.dispatch(setSelectedTabs({
            selectedTab: tabNumber,
            highestVisitedTab: this.props.highestVisitedTab < tabNumber ? tabNumber : this.props.highestVisitedTab
        }));
    };//..... end of topTabClicked() .....//

    /**
     * Handle set tab event. when user click continue button in a view.
     * @param tab
     */
    setCurrentTab = (tab) => {
        /*if (this.getTabName() === 'Segmentation' && this.props.segment.type !== 'new') {
            ++tab;
        }*///..... end if() .....//

        this.props.dispatch(setSelectedTabs({
            selectedTab: tab,
            highestVisitedTab: this.props.highestVisitedTab < tab ? tab : this.props.highestVisitedTab
        }))
    };//..... end of setCurrentTab() .....//

    saveCampaign = (e) => {
        show_loader();
        let fsc = new FinalizeAndSaveCampaign(this.props.campaignBuilder);
        fsc.save().then((response) => {
            show_loader(true);
            if (response.data.status === true) {
                NotificationManager.success(response.data.message, 'Success');
                this.props.dispatch(resetCampaignBuilder());
                this.props.navigate(null, '/campaigns');
            } else
                NotificationManager.error(response.data.message, 'Error');
        }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while saving campaign", 'Error');
        });
    };//..... end of saveCampaign() .....//

    componentDidMount = () => {
        this.props.dispatch(resetCampaignBuilder());

        if (this.props.editableId)
            this.getAndPopulateCampaignEditData(this.props.editableId);

        this.loadVoucherList();
    };//..... end of componentDidMount() .....//

    saveSegment = (isHidden, justNext = false) => {
        if (justNext) {
            let currentTab = this.props.selectedTab;
            this.setCurrentTab(++currentTab);
            return false;
        } //..... end if() ....//

        show_loader();
        axios.post(BaseUrl + '/api/save-segment',{
            new_segment   : this.props.segment.new_segment,
            query         : this.props.segment.segment_users.query,
            excluded_users: this.props.segment.segment_users.excluded_users,
            included_users: this.props.segment.segment_users.included_users,
            total_users   : this.props.segment.segment_users.total_users,
            editSegmentId : this.props.segment.segments.length > 0 ? this.props.segment.segments[0].id || 0 : 0,
            isHidden      : isHidden,
            venue_id      : VenueID,
            company_id    : CompanyID
        }).then((response) => {
            show_loader(true);
            if (response.data.status === false) {
                NotificationManager.error("Internal Server error occurred.", 'Error');
                return false;
            }//..... end if() ......//

            this.props.dispatch(addSegmentValue({segments: [{id: response.data.segment_details.id, name: response.data.segment_details.name,criteria: response.data.segment_details.query_parameters}]}));
            this.props.dispatch(setSegmentUsers(response.data.segment_users));
            let currentTab = this.props.selectedTab;
            this.setCurrentTab(++currentTab);
        }).catch((err) => {
            show_loader(true);
            if (isHidden === 1)
                NotificationManager.error("Error occurred while saving segment.", 'Error'+err);
            else
                NotificationManager.error("Internal Server error occurred.", 'Error'+err);
        });
    };//..... end of saveSegment() .....//

    getAndPopulateCampaignEditData = (id) => {
        show_loader();
        axios.get(`${BaseUrl}/api/campaign-detail/${id}`)
            .then((response) => {
                show_loader(true);

                if (response.data.type === "Gamification") {
                    let selectedSegments    = response.data.selectedSegments.map((segment) => ({id: `${segment.id}`, name: segment.name,segment_type:segment.type,criteria:segment.query_parameters}));
                    let campaign = {
                        segment: {type: 'saved', segments: selectedSegments, segment_users: {}, new_segment: {}},
                        campaign: {selectedCampaign: response.data.type, name: response.data.name, detail: response.data.description, trigger_type: response.data.target_type, trigger_value: response.data.target_value},
                        isEditMode: true,
                        campaignID: response.data.id,
                        campaignDeleted: response.data.deleted_at,
                        games: JSON.parse(response.data.action_value),
                        campaignSchedulerType: response.data.schedule_type,

                    };
                    this.props.dispatch(addEditCampaignData(campaign));

                } else {
                    let selectedSegments    = response.data.selectedSegments.map((segment) => ({id: `${segment.id}`, name: segment.name,segment_type:segment.type,criteria:segment.query_parameters}));
                    let actionValues        = JSON.parse(response.data.action_value);

                    let targetChannels      = this.props.campaignBuilder.targetChannels;
                    let messageBuilder      = this.props.campaignBuilder.messageBuilder;
                    let tags                = [];

                    forEach(actionValues, (value) => {
                        targetChannels[value.type].channel          = value.name;
                        targetChannels[value.type].icon             = this.icons[value.name];
                        targetChannels[value.type].currentTarget    = value.name;
                        targetChannels[value.type].isEnabled        = true;
                        messageBuilder[value.name]                  = value.value;
                        messageBuilder[value.name].venue_name       = value.venue_name;
                    });
                    forEach(response.data.tags, (tag) => {
                        tags.push(tag.name);
                    });

                    let treeData = JSON.parse(response.data.tree_stucture);


                    let campaign = {
                        campaign: {trigger_amount: response.data.trigger_amount,selectedCampaign: response.data.type, name: response.data.name, detail: response.data.description, trigger_type: response.data.target_type, trigger_value: response.data.target_value, tags: tags,selected_businesses: actionValues[0].value.other.content.business,isEditMode: true},
                        segment: {type: 'saved', segments: selectedSegments, segment_users: {}, new_segment: {}},
                        trigger_type: response.data.action_type,
                        campaignSchedulerType: response.data.schedule_type,
                        schedule: JSON.parse(response.data.schedule_value),
                        isEditMode: true,
                        campaignID: response.data.id,
                        beaconsData: JSON.parse(response.data.target_value),
                        checkedKeys:(treeData)?treeData.selectKeys:'',
                        selectedData:(actionValues[0].value.other.content.voucher_avial_data)?actionValues[0].value.other.content.voucher_avial_data:[],
                        campaignDeleted: response.data.deleted_at,
                    };

                    this.props.dispatch(addEditCampaignData(campaign));
                }//..... end if() ....//

                window.scrollTo(0, 310);
            }).catch((err) => { console.log(err);
            show_loader(true);
            NotificationManager.error("Error occurred while fetching Campaign Details.", 'Error');
        });
    };//..... end of getAndPopulateCampaignEditData() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    setGameToPool = () => {
        let gameValue = populateGameData(this.props.campaignBuilder);
        this.props.dispatch(setGameData(gameValue));
    };

    setGameMissionToPool = () => {
        let gameValue = populateGameMissionDate(this.props.campaignBuilder);
        this.props.dispatch(setGameMissionData(gameValue));
    };

    setMissionOutcome = () => {
        let gameValue = populateGameMissionDate(this.props.campaignBuilder);
        this.props.dispatch(setMissionOutcome(gameValue));
    };
    loadVoucherList = () => {
        axios.post(BaseUrl + `/api/list-all-vouchers`, {
            'orderBy':      'created_at',
            'orderType':    'desc',
            'company_id':   CompanyID,
            'category'  :'Public Voucher'
        }).then(res => {
            if (res.data.status) {
                var data = [];
                res.data.data.map((obj)=>{
                    if(obj.category !=='Public Voucher') {
                        data.push(obj)
                    }
                });
                this.props.dispatch(setVoucherData(data));
            } else {
                NotificationManager.error("Error .", 'Error');
            }
        }).catch((err) => {

            //NotificationManager.error("Error occurred while getting businesses list."+err, 'Error');
        });

    };//..... end of loadVoucherList() .....//
    render() {
        return (
            <div className="contentDetail">
                <div className="autoContent">

                    <CampaignHeading selectedCampaignType={this.props.campaign.selectedCampaign}/>

                    <div className="compaigns_list_content">
                        <div className="compaigns_list_detail">

                            <TopTabs selectedCampaignType={this.props.campaign.selectedCampaign}
                                     selectedTab={this.props.selectedTab}
                                     topTabClicked={this.topTabClicked} highestVisitedTab={this.props.highestVisitedTab}
                                     tabs={this.tabs}
                                     segmentTypeSelected={this.props.segment.type}/>

                            <div>
                                {this.getComponent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//

    getComponent = () => {
        if (this.props.selectedTab === 1) {
            return <CampaignDetails setCurrentTab={this.setCurrentTab}/>
        }else {
            switch (this.getTabName()) {
                case 'Segmentation':
                    return <SegmentTypes setCurrentTab={this.setCurrentTab} />;
                case 'Segment Summary':
                    return <SegmentSummary setCurrentTab={this.setCurrentTab} saveSegment={this.saveSegment}/>;
                case 'Channel and Target':
                    if (this.props.campaign.selectedCampaign === 'Gamification')
                        return <GameChannelType  setCurrentTab={this.setCurrentTab} icons={this.icons} isEditMode={this.props.isEditMode}/>;
                    else
                        return <ChannelType setCurrentTab={this.setCurrentTab} icons={this.icons} isEditMode={this.props.isEditMode}/>;
                case 'Proximity Trigger':
                    if (this.props.campaign.selectedCampaign === 'Gamification')
                    return <GameBuilderComponent setCurrentTab={this.setCurrentTab} saveCampaign={this.saveCampaign}/>;
                    else
                        return <ProximityTrigger setCurrentTab={this.setCurrentTab} isEditMode={this.props.isEditMode} />;
                case 'Message Builder':
                    return <MessageBuilder setCurrentTab={this.setCurrentTab} setMissionOutcome={this.setMissionOutcome} setGameToPool={this.setGameToPool}/>;
                case 'Scheduling & Confirmation':
                    return <SchedulingAndConfirmation saveCampaign={this.saveCampaign} setGameToPool={this.setGameToPool} setGameMissionToPool={this.setGameMissionToPool}/>;
                default:
                    return 'View Not Found.';

            }//..... end of switch() .....//
        }//.... end of outer-if() .....//
    };//..... end of getComponent() .....//

    /**
     * Get selected Tab Name.
     * @returns {string}
     */
    getTabName = () => {
        let tabNumber = this.props.selectedTab - 1;
        if (this.props.campaign.selectedCampaign !== 'Proximity' && this.props.campaign.selectedCampaign !== 'Gamification' && tabNumber >= 1)
            tabNumber += 1;
        return this.tabs[tabNumber];
    };//..... getTabName() .....//
}//..... end of CampaignBuilder.

const mapStateToProps = (state) => {
    return {
        campaign:           state.campaignBuilder.campaign,
        segment :           state.campaignBuilder.segment,
        campaignBuilder:    state.campaignBuilder,
        selectedTab:        state.campaignBuilder.selectedTab,
        highestVisitedTab:  state.campaignBuilder.highestVisitedTab,
        isEditMode:         state.campaignBuilder.isEditMode,
        campaignDeleted:    state.campaignBuilder.campaignDeleted
    };
};
export default connect(mapStateToProps)(CampaignBuilder);