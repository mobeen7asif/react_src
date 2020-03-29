import React, {Component} from 'react';
import CharactersListing from "./sub-pages/campaigns/character/CharactersListing";
import AddCharacter from "./sub-pages/campaigns/character/AddCharacter";

class Gamification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab : "character",
            editData  : {}
        };
    }//..... end of constructor() .....//

    setEditRecord = (editData, tab) => {
        this.setState(()=>({editData, activeTab: tab}));
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    changeMainTab = (tab) => {
        this.setState({activeTab : tab, editData: {}});
    };

    loadActiveComponent = () => {
        switch (this.state.activeTab) {
            case "character"  :
                return <CharactersListing changeMainTab={this.changeMainTab} setEditRecord={this.setEditRecord}/>;
            case 'edit-character':
                return <AddCharacter changeMainTab={this.changeMainTab} editData={this.state.editData}/>;
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
}//..... end of Gamification.

export default Gamification;