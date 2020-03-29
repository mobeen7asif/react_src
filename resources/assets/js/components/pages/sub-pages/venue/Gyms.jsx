import React, {Component} from 'react';
import GymsListing from "./gyms/GymsListing";
import AddGyms from "./gyms/AddGyms";


class Gyms extends Component {
    state = {
        selectedView: 'listing',
        gym: {}
    };

    addGym = (type = 'edit', gym = {}) => {
        this.setState(() => ({selectedView: type, gym}))
    };
    render() {
        return (
            this.state.selectedView === 'listing' ? 
                <GymsListing addGym={this.addGym}/> :
                <AddGyms addGym={this.addGym} gym={this.state.gym}/>
        );
    }//..... end of render() .....//
}//..... end of Class.

export default Gyms;