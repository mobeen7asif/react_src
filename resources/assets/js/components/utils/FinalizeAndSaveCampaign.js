import {flatMap, forIn} from "lodash";

class FinalizeAndSaveCampaign {
    constructor(state) {
        this.state = state;
        this.campaignData = {};

        this.populateCampaignData();
    }//..... end of construct() .....//

    populateCampaignData() {
        var segmentFind= this.state.segment.segments.find(x => x.segment_type === 'Global')
        this.campaignData = {
            venue_id: (this.state.segment.new_segment.segment_type === "Global" || segmentFind)?0:VenueID,
            company_id: CompanyID,
            type: (this.state.campaign.selectedCampaign === 'Dynamic') ? 3 : (this.state.campaign.selectedCampaign === "Proximity" ? 2 : (this.state.campaign.selectedCampaign === 'Gamification' ? 4 : (this.state.campaign.selectedCampaign === 'Virtual Voucher' ? 5:1))),
            name: this.state.campaign.name,
            description: this.state.campaign.detail,
            trigger_amount: this.state.campaign.trigger_amount === 0 ? null : this.state.campaign.trigger_amount,
            target_type: this.state.campaign.trigger_type,
            target_value: (this.state.campaign.selectedCampaign === "Proximity" ? JSON.stringify(this.state.beaconsData) : this.state.campaign.trigger_value),
            action_type: this.state.trigger_type,
            action_value: (this.state.campaign.selectedCampaign === 'Gamification' && this.state.gameMissionTypeToCreate === 'list') ? JSON.stringify(this.state.games) : JSON.stringify(this.populateActionValue()),
            schedule_type: this.state.campaignSchedulerType,
            schedule_value: JSON.stringify(this.state.schedule),
            target_segments: flatMap(this.state.segment.segments,(o) => { return o.id; }).join(','),
            isEditMode: this.state.isEditMode,
            campaignID: this.state.isEditMode ? this.state.campaignID : 0,
            campaignTags: JSON.stringify(this.state.campaign.tags),
            tree_stucture:JSON.stringify({'selectKeys':this.state.checkedKeys,'treeData':this.state.treeData}),
            target_user:this.state.target_user,
            status: appPermission("Activate Campaigns","view") ? "Active" : "Deactivated",
            send_email: appPermission("Activate Campaigns","view") ? [] : getAclRoles("Admin")
        }//..... end of object.
    }//..... end of populateCampaignData() .....//

    populateActionValue() {
        let data = [];
        forIn(this.state.targetChannels, (value, key) => {// value: trg_chnl Object, key: channel name.
            if (value.isEnabled) {
                data.push({
                    name      : value.channel,
                    type      : key,
                    venue_name: this.state.messageBuilder[value.channel].venue_name,
                    value     : this.checkDiscountValue(this.state.messageBuilder[value.channel])
                });
            }//..... end if() .....//
        });//..... end forIn() .....//
        return data;
    }//..... end of populateActionValue() .....//

    save() {
        return axios.post(BaseUrl + '/api/save-campaign', this.campaignData)
    }//..... end of save() .....//
    
    checkDiscountValue(messageBuilder) {
        if (messageBuilder.other.content.discount) {
            let discount = messageBuilder.other.content.discount;
            messageBuilder.other.content.discount = discount.dInput1 ? discount.dInput1 : discount;
        }
        return messageBuilder;
    };

    get() {
        return this.campaignData;
    };
}//..... end of FinalizeAndSaveCampaign.

export default FinalizeAndSaveCampaign;

export const populateGameData = (campaignBuilder) => {
    let {action_type, action_value} = (new FinalizeAndSaveCampaign(campaignBuilder)).get();
    return {action_type, action_value};
};

export const populateGameMissionDate = (campaignBuilder) => {
    let {action_type, action_value, target_segments} = (new FinalizeAndSaveCampaign(campaignBuilder)).get();
    return {action_type, action_value, target_segments};
};