import React, {Component} from 'react';

export default class CampaignHeading extends Component {
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.selectedCampaignType !== nextProps.selectedCampaignType;
    }//..... end of shouldComponentUpdate() ......//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="compaignHeadigs">
                <h1 id="campaign_title">{ this.props.selectedCampaignType }</h1>
                <p>
                    {
                        (this.props.selectedCampaignType === 'SET & FORGET') ? 'Send a campaign to a member automatically based on an Event or Action. Ideal for Happy\n' +
                            'Birthday and New Status Level messages, and to reward members for reaching a nominated\n' +
                            'turnover target' :
                            ((this.props.selectedCampaignType === 'Proximity') ? 'Send a campaign to a member through the Pointme App based on their proximity to a nominated Beacon. Ideal for Welcome messages and exclusive App user Rewards.' :
                                ((this.props.selectedCampaignType === 'Dynamic') ? 'Send a campaign to a defined group of members at a specific TIME, either NOW or at a scheduled time in the FUTURE. Ideal to incentivise visitation or reward a new behaviour.':
                                    ((this.props.selectedCampaignType === 'Gamification') ? 'Send a campaign to a defined group of members at a specific TIME, either NOW or at a scheduled time in the FUTURE. Ideal to incentivise visitation or reward a new behaviour.' : 'Choose Your Campaign Type')))
                    }
                </p>
            </div>
        );
    }//..... end of render() .....//
}//..... end of CampaignHeading.