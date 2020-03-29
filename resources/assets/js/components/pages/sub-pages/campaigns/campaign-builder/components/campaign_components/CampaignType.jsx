import React, {Component} from 'react';
import {connect} from "react-redux";
import {setCampaignType} from '../../../../../../redux/actions/CampaignBuilderActions';

class CampaignType extends Component {
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <li>
                <div className="compaignType_detail setandForget">
                    <span id={this.props.cType.id} className={(this.props.cType.title === this.props.campaign.selectedCampaign) ? 'selecCompaignBttn': ''}>
                        <b className={this.props.cType.iconClass} onClick={(e)=> {this.props.dispatch(setCampaignType({selectedCampaign: this.props.cType.title}))}}>&nbsp;</b>
                    </span>
                    <h3 style={{paddingBottom:'12px',marginBottom:'15px'}}>{this.props.cType.title}</h3>
                    <p style={{paddingBottom:'46px',maxHeight:'160px',fontSize: '12px'}}>{this.props.cType.campaignDescription}</p>

                    <a style={{marginTop:'22px'}} className={(this.props.cType.title === this.props.campaign.selectedCampaign) ? 'selecCompaignBttn': ''}  style={{cursor:'pointer'}} onClick={(e)=> {this.props.dispatch(setCampaignType({selectedCampaign: this.props.cType.title}))}}>SELECT</a>

                </div>
            </li>
        );
    }//..... end of render() .....//
}//..... end of CampaignType.

const mapStateToProps = (state) => {
    return {campaign: state.campaignBuilder.campaign};
};
export default connect(mapStateToProps)(CampaignType);