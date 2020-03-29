import React, {Component} from 'react';

export default class TopTabs extends Component {
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    shouldComponentUpdate(nextProps, nextState) {
        if( this.props.selectedCampaignType !== nextProps.selectedCampaignType)
            return true;

        return (this.props.selectedTab !== nextProps.selectedTab);
    }//..... end of shouldComponentUpdate() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {

        let tabNumber = 1;

        return (
            <div className="compaign_progressBar">
                <div className="creative_topCircle_bar">
                    <div className="countSeprator">&nbsp;</div>
                    <ul className="campaigns-builder-tabs">
                        { this.props.tabs.map((tab, index) =>
                            (this.props.selectedCampaignType === 'Gamification' && index === 1) ?
                                <List tabNumber={tabNumber} tab={'Games'} tabClicked={this.props.topTabClicked} highestVisitedTab={this.props.highestVisitedTab}
                                      selectedClass={this.props.selectedTab === tabNumber ? 'active' :
                                          (tabNumber < this.props.selectedTab ? (/*(this.props.segmentTypeSelected !== 'new' && tab === 'Segment Summary') ? 'disabled':*/'previous_active'): '')}
                                      key={tabNumber++} campaignType={this.props.selectedCampaignType} />
                             : ((this.props.selectedCampaignType !== 'Proximity' && index === 1) ? '':
                            <List tabNumber={tabNumber} tab={tab} tabClicked={this.props.topTabClicked} highestVisitedTab={this.props.highestVisitedTab}
                                  selectedClass={this.props.selectedTab === tabNumber ? 'active' :
                                      (tabNumber < this.props.selectedTab ? (/*(this.props.segmentTypeSelected !== 'new' && tab === 'Segment Summary') ? 'disabled':*/'previous_active'): '')}
                                  key={tabNumber++} campaignType={this.props.selectedCampaignType} />
                        )) }
                    </ul>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of TopTabs.

function List(props) {
    if(props.campaignType == "Set & Forget"){
        return (
            <li key={props.tabNumber}>
                <a className={"creative_topCircle_barBtn " + props.selectedClass + ( (props.tabNumber > props.highestVisitedTab || props.tabNumber == "2" || props.tabNumber == "3"  ) ? ' disabled' : '')} style={{cursor:'pointer'}} onClick={(e) => {props.tabClicked(props.tabNumber)}}>
                    <b>{props.tabNumber}</b>
                    <small>{props.tab}</small>
                </a>
            </li>
        );
    }else if(props.campaignType == "Virtual Voucher"){

        return (
            <li key={props.tabNumber} id={props.tabNumber} style={{display:(props.tabNumber ==2 || props.tabNumber ==3 ||props.tabNumber ==4 )?'none':''}}>
                <a className={"creative_topCircle_barBtn " + props.selectedClass + ( (props.tabNumber > props.highestVisitedTab || props.tabNumber == "2" || props.tabNumber == "3" || props.tabNumber == "4"  ) ? ' disabled' : '')} style={{cursor:'pointer'}} onClick={(e) => {props.tabClicked(props.tabNumber)}}>
                    <b>{(props.tabNumber == 5) ? 2 : (props.tabNumber == 6) ? 3 : props.tabNumber}</b>
                    <small>{props.tab}</small>
                </a>
            </li>
        );
    }else{
        return (
            <li key={props.tabNumber}>
                <a className={"creative_topCircle_barBtn " + props.selectedClass + (props.tabNumber > props.highestVisitedTab ? 'disabled' : '')} style={{cursor:'pointer'}} onClick={(e) => {props.tabClicked(props.tabNumber)}}>
                    <b>{props.tabNumber}</b>
                    <small>{props.tab}</small>
                </a>
            </li>
        );
    }


}//..... end of List() .....//