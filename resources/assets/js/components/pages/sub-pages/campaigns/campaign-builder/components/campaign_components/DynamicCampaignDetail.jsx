import React, {Component} from 'react';
import {forEach} from 'lodash';
import {connect} from "react-redux";
import { Scrollbars } from 'react-custom-scrollbars';
import TagsAutoSuggest from "../../../../../../_partials/TagsAutoSuggest";
import {NotificationManager} from "react-notifications";
import {addCampaignValue, addSuggestedTags} from "../../../../../../redux/actions/CampaignBuilderActions";

class DynamicCampaignDetail extends Component {

    currentTab  = this.props.currentTab;

    selectTag = (tag) => {
        let tags = this.props.campaign.tags;
        if (tags.indexOf(tag) > -1) {
            tags = tags.filter((etag) => {
                return etag !== tag;
            });
        } else {
            tags.push(tag);
        }//..... end if-else() .....//
        this.props.dispatch(addCampaignValue({tags: tags}));
    };//..... end of selectTag() .....//

    removeTag = (tag) => {
        let tags = this.props.campaign.tags.filter((etag) => {
            return etag !== tag;
        });
        this.props.dispatch(addCampaignValue({tags: tags}));
    };//..... end of removeTag() ....//

    loadTags = () => {
        show_loader();
        axios.get(BaseUrl + '/api/tags-list').then((response) => {
            show_loader(true);
            let tags = [];
            forEach(response.data, (tag) => {
                tags.push({id: tag.name, text: tag.name});
            });

            this.props.dispatch(addSuggestedTags(tags));
        }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while fetching Campaign Details.", 'Error');
        });
    };//..... end of loadTags() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div>
                <div className="compaign_segments">
                    <div className="segment_tYpe">
                        <div className="segment_tYpe_heading">
                            <h3>CAMPAIGN DETAILS</h3>
                        </div>
                        <div className="segment_tYpe_detail">
                            <div className="selectDescription">
                                <p>Name and describe your new campaign in a way that will make sense to other staff at your site. Your members will not see these details. Your description should describe exactly what you want to achieve from your campaign. You must complete both fields to continue.</p>
                            </div>
                            <div className="newSegment_form">
                                <ul>
                                    <li>
                                        <label>Campaign Name</label>
                                        <div className="segmentInput">
                                            <input type="text" id={'dynamicCampaignName'} placeholder="Campaign Name" onChange={(e)=>{this.props.dispatch(addCampaignValue({name: e.target.value}))}} value={this.props.campaign.name}/>
                                        </div>
                                    </li>
                                    <li>
                                        <label>Campaign Description</label>
                                        <div className="segmentInput segmentARea">
                                            <textarea style={{fontFamily: "'Roboto', sans-serif"}} placeholder="Campaign Description" id={'dynamicCampaignDescription'} onChange={(e)=>{this.props.dispatch(addCampaignValue({detail: e.target.value}))}} value={this.props.campaign.detail}></textarea>
                                        </div>
                                        {  /*  <div className="compaignDescription_outer clearfix">
                                            <div className="compaignDescription_column6">

                                            </div>
                                            <div className="compaignDescription_column6 compaignTags_discription">
                                                <label>Campaign Tags</label>
                                                <div className="tagsCompaigns_detail clearfix">
                                                    <div className="tagsCompaigns_list">
                                                        <TagsAutoSuggest selectTag={this.selectTag} suggestedTags={this.props.suggestedTags}/>
                                                    </div>
                                                </div>
                                                <div className="selectedTags">
                                                    <label>Selected</label>
                                                    <div className="showTags clearfix">
                                                        <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                            {this.props.campaign.tags.map((tag) => {
                                                                return <a  style={{cursor:'pointer'}} key={tag} onClick={(e) => {this.removeTag(tag)}}>{tag}<i>&nbsp;</i></a>
                                                            })}
                                                        </Scrollbars>
                                                    </div>
                                                </div>}
                                            </div>
                                        </div>*/}
                                    </li>
                                </ul>
                            </div>
                            {/*<div className={'trigger_amount clearfix'}>
                                <label>Stop this campaign if triggered X amount of time.</label>
                                <div className={'segmentInput'}>
                                    <input placeholder={'Leave blank for no limit'} type="number"  onChange={(e)=>{this.props.dispatch(addCampaignValue({trigger_amount: e.target.value}))}} value={this.props.campaign.trigger_amount}/>
                                </div>
                            </div>*/}
                            <div className={'trigger_amount clearfix'}>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="continueCancel">
                    <input type="submit" id={'dynamicCampaignContinueBtn'} value="CONTINUE" onClick={(e) => { this.props.setCurrentTab(++this.currentTab) }} className={(this.props.campaign.name === '' || this.props.campaign.detail === '') ? 'disabled selecCompaignBttn' : 'selecCompaignBttn'}/>
                    <a href="#">CANCEL</a>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of DynamicCampaignDetail.

const mapStateToProps = (state) => {
    return {
        campaign: state.campaignBuilder.campaign,
        currentTab: state.campaignBuilder.selectedTab,
        suggestedTags: state.campaignBuilder.suggestedTags
    };
};
export default connect(mapStateToProps)(DynamicCampaignDetail);