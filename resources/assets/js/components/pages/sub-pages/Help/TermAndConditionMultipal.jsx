import React, {Component} from 'react';
import ListTermAndCondition from "./term_and_condition/ListTermAndCondition";
import AddTermAndCondition from "./term_and_condition/AddTermAndCondition";


class TermAndConditionMultipal extends Component {
    state = {
        selectedView: 'listing',
        aboutLoyalty: {}
    };

    addAboutTermAndCondition = (type = 'edit', aboutLoyalty = {}) => {
        this.setState(() => ({selectedView: type, aboutLoyalty}))
    };
    render() {
        return (
            this.state.selectedView === 'listing' ? <ListTermAndCondition addAboutTermAndCondition={this.addAboutTermAndCondition}/> : <AddTermAndCondition addAboutTermAndCondition={this.addAboutTermAndCondition} aboutLoyalty={this.state.aboutLoyalty}/>
        );
    }//..... end of render() .....//
}//..... end of AboutLoyalty.

TermAndConditionMultipal.propTypes = {};

export default TermAndConditionMultipal;