import React, {Component} from 'react';
import CompetitionListing from "./sub-pages/campaigns/competition/CompetitionListing";
import AddCompetition from "./sub-pages/campaigns/competition/AddCompetition";

class Competition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab : "competition",
            editData  : {},
            type:"",
        };
    }//..... end of constructor() .....//

    setEditRecord = (editData, tab,type) => {
        this.setState(()=>({editData, activeTab: tab,type:type}));
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    changeMainTab = (tab) => {
        this.setState({activeTab : tab, editData: {}});
    };

    loadActiveComponent = () => {
        switch (this.state.activeTab) {
            case "competition"  :
                return <CompetitionListing changeMainTab={this.changeMainTab} setEditRecord={this.setEditRecord}/>;
            case 'edit-competition':
                return <AddCompetition type={this.state.type} changeMainTab={this.changeMainTab} editData={this.state.editData}/>;
            default :
                return "";
        }
    };//..... end of loadActiveComponent() .....//

    render() {
        return (
            <div>
                {
                    this.loadActiveComponent()
                }
            </div>
        );
    }//..... end of render() .....//
}//..... end of Competition.

export default Competition;