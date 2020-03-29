import React, {Component} from 'react';
import PunchCardListing from "./punch-card/PunchCardListing";
import AddPunchCard from "./punch-card/AddPunchCard";
import AddIntegratedPunchCard from "./punch-card/AddIntegratedPunchCard";


class PunchCard extends Component {
    state = {
        selectedView: 'listing',
        punchCard: {}
    };

    addPunchCard = (type = 'edit', punchCard = {}) => {
        this.setState(() => ({selectedView: type, punchCard}));
    };

    addIntegrated = (type = 'integrated-edit', punchCard = {}) => {
        this.setState(() => ({selectedView: type, punchCard}));
    };

    render() {
        return (
            this.state.selectedView === 'listing' ? <PunchCardListing addPunchCard={this.addPunchCard} addIntegrated={this.addIntegrated}/>
            : (this.state.selectedView === 'integrated-edit' ? <AddIntegratedPunchCard addPunchCard={this.addPunchCard}  punchCard={this.state.punchCard}/>
            : <AddPunchCard addPunchCard={this.addPunchCard} punchCard={this.state.punchCard}/>)
        );
    }//..... end of render() .....//
}//..... end of Class.

export default PunchCard;