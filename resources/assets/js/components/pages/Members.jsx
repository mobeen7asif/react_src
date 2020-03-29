import React, {Component} from 'react';
import Member from "./sub-pages/members/Member";
import Segment from "./sub-pages/members/Segment";
import MemberStats from "./sub-pages/members/MemberStats";

class Members extends Component {
    constructor(props) {
        super(props);
        this.state = {currentTab: 'member'};
        this.setActiveTab = this.setActiveTab.bind(this);
    }//..... end of constructor() ....//
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    componentDidMount = () => {
        if(!(appPermission("Member List","view") == true) && (appPermission("Segment List","view") == true)){
            this.setState(()=>({currentTab:"segment"}));
        }
    }

    render() {
        return (
            <div>
                <MemberStats/>
                <div className="compaignstabsBttns clearfix">
                    <div className="tabs_bttn">
                        <ul>
                            {(appPermission("Member List","view")) && (
                            <li>
                                <a  style={{cursor:'pointer'}} onClick={e => {this.setActiveTab('member')}}   className={(this.state.currentTab === 'member') ? 'compaignsActive' : ''}>MEMBER</a>

                            </li>
                            )}
                            {(appPermission("Segment List","view")) && (
                            <li>
                                <a  style={{cursor:'pointer'}} onClick={e => {this.setActiveTab('segment')}}  className={(this.state.currentTab === 'segment') ? 'compaignsActive' : ''}>SEGMENT</a>
                            </li>
                            )}
                        </ul>

                </div>
                </div>
                <div className="contentDetail">
                    { (this.state.currentTab === 'member') ? <Member /> : <Segment /> }
                </div>
            </div>
        );
    }//..... end of render() .....//

    setActiveTab(tab) {
        this.setState({currentTab: tab});
    }//..... end of setActiveTab() .....//
}//..... end of members() .....//

export default Members;
