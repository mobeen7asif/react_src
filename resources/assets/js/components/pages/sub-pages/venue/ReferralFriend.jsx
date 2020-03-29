import React, {Component} from 'react';
import ListReferralFriend from "./referral-friend/ListReferralFriend";
import AddReferralFriend from "./referral-friend/AddReferralFriend";


class ReferralFriend extends Component {
    state = {
        selectedView: 'listing',
        referralFriend: {}
    };

    addReferralFriend = (type = 'edit', referralFriend = {}) => {
        this.setState(() => ({selectedView: type, referralFriend}))
    };
    render() {
        return (
            this.state.selectedView === 'listing' ? <ListReferralFriend addReferralFriend={this.addReferralFriend}/> : <AddReferralFriend addReferralFriend={this.addReferralFriend} referralFriend={this.state.referralFriend}/>
        );
    }//..... end of render() .....//
}//..... end of ReferralFriend.


export default ReferralFriend;