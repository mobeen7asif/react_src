import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MemberList from "./MemberList";
import MemberInsight from "./MemberInsight";

class Member extends Component {
    constructor(props) {
        super(props);
        this.state = {activeTab: 'memberList'};
        this.setActiveTab = this.setActiveTab.bind(this);
    }//..... end of constructor() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="autoContent">
                {/*<div className="compaignHeadigs">*/}
                    {/*<h1>My Members</h1>*/}
                    {/*<p>Search and view member details</p>*/}
                {/*</div>*/}


                <div className="compaigns_list_content">
                    <div className="compaigns_list_detail">
                        <div className="memberstabsBttns clearfix">
                            <ul>
                                {/*<li><a  style={{cursor:'pointer'}} onClick={e => {*/}
                                    {/*this.setActiveTab('memberList')*/}
                                {/*}} className={(this.state.activeTab !== 'memberList') ? 'memberActive' : ''}>MEMBER*/}
                                    {/*LIST</a></li>*/}
                                {/*<li><a  style={{cursor:'pointer'}} onClick={e => {*/}
                                    {/*this.setActiveTab('memberInsight')*/}
                                {/*}} className={(this.state.activeTab !== 'memberInsight') ? 'memberActive' : ''}>MEMBER*/}
                                    {/*INSIGHT</a></li>*/}
                            </ul>
                        </div>
                        {this.state.activeTab === 'memberList' ? <MemberList/> : <MemberInsight/>}
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//

    setActiveTab(tab) {
        this.setState({activeTab: tab});
    }//..... end of setActiveTab() ....//
}//..... end of Member.

Member.propTypes = {};

export default Member;