import React, {Component} from 'react';
import ListAboutLoyalty from "./about_loyalty/ListAboutLoyalty";
import AddAboutLoyalty from "./about_loyalty/AddAboutLoyalty";

class AboutLoyalty extends Component {
    state = {
        selectedView: 'listing',
        aboutLoyalty: {}
    };

    addAboutLoyalty = (type = 'edit', aboutLoyalty = {}) => {
        this.setState(() => ({selectedView: type, aboutLoyalty}))
    };
    render() {
        return (
            this.state.selectedView === 'listing' ? <ListAboutLoyalty addAboutLoyalty={this.addAboutLoyalty}/> : <AddAboutLoyalty addAboutLoyalty={this.addAboutLoyalty} aboutLoyalty={this.state.aboutLoyalty}/>
        );
    }//..... end of render() .....//
}//..... end of AboutLoyalty.

AboutLoyalty.propTypes = {};

export default AboutLoyalty;