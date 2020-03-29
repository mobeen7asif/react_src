import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";

class ProfileSideBar extends Component {


    state = {
        activeTab : 'basic_information',
        first_name : '',
        last_name : '',
        membership_id : '',
        join_date_in_days: 1,
        member_image: '',
        src: null,
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidMount = () => {

        let $this = this;
        $("body").on("change","#fileToUpload",function(e){
            $this.readURL(this);
        });

        this.changeTab(this.state.activeTab);
        axios.post(BaseUrl + '/api/member-details',{
            persona_id: this.props.persona_id,
            venue_id: VenueID,
            company_id: CompanyID
        }).then((response) => {
            this.setState(()=>({
                first_name : response.data.member.persona_fname,
                last_name : response.data.member.persona_lname,
                join_date_in_days : response.data.member.join_date_in_days,
                membership_id : response.data.member.membership_id,
                member_image : response.data.member.member_image
            }));
        }).catch((err) => {
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });
    };//..... end of componentDidMount() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    changeTab = (tab) => {
        this.setState({activeTab : tab},() => {this.props.sendActiveState(tab);});
    };

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result }),
            );
            reader.readAsDataURL(e.target.files[0]);
            let data = new FormData();
            var fileInput = document.getElementById('fileToUpload');
            var file = fileInput.files[0];
            data.append('user_image', file);
            data.append('user_id',this.props.persona_id);
            axios.post(BaseUrl+ '/api/upload-user-image',data).then((response) => {

            });
        }
    };//..... end of onSelectFile() .....//

    readURL = (input) => {
        if (input.files && input.files[0]) {
            if(input.files[0].size > 2100000) {
                NotificationManager.warning("Image size should be less than 2 MB", 'Warning');
                return false;
            };
            let reader = new FileReader();
            reader.onload = function (e) {
                $('#fileToDisplay').attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    };//..... end of readURL() .....//

    render() {
        return (
            <div className="e_member_left">
                <div className="edit_category_leftBar">
                    <div className="e_member_user">
                        <div className="edit_category_img setting_file">
                                            <span>
                                                <input id={'fileToUpload'} type="file" accept={'image/*'} onChange={this.onSelectFile} title={"Upload Image"} />
                                                <img id={'fileToDisplay'} src={this.state.member_image} alt="#" />
                                            </span>
                        </div>

                        <div className="e_member_userName"> <a  style={{cursor:'pointer'}}>{this.state.first_name+' '+this.state.last_name}</a> <span>{this.state.join_date_in_days} days as Member</span> <span> ID: {this.state.membership_id} </span></div>
                    </div>
                    <div className="left_navBar">
                        <ul>
                            <li className={this.state.activeTab === 'basic_information' ? 'navActive' : ''}><a onClick={(e) => {this.changeTab('basic_information')}}  style={{cursor:'pointer'}} className="e_userinfo_icon"><small>INFORMATION</small></a></li>
                            <li className={this.state.activeTab === 'password' ? 'navActive' : ''}><a onClick={(e) => {this.changeTab('password')}}  style={{cursor:'pointer'}} className="e_userinfo_icon"><small>PASSWORD</small></a></li>
                            <li className={this.state.activeTab === 'custom_fields' ? 'navActive' : ''}><a onClick={(e) => {this.changeTab('custom_fields')}}  style={{cursor:'pointer'}} className="e_userinfo_icon"><small>Custom Fields</small></a></li>
                            <li className={this.state.activeTab === 'member_communications' ? 'navActive' : ''}><a onClick={(e) => {this.changeTab('member_communications')}}  style={{cursor:'pointer'}} className="e_userinfo_icon"><small>Communications</small></a></li>
                            <li className={this.state.activeTab === 'member_stores' ? 'navActive' : ''}><a onClick={(e) => {this.changeTab('member_stores')}}  style={{cursor:'pointer'}} className="e_userinfo_icon"><small>Stores</small></a></li>
                            <li className={this.state.activeTab === 'segmentation' ? 'navActive' : ''}><a onClick={(e) => {this.changeTab('segmentation')}}  style={{cursor:'pointer'}} className="e_segnemt_icon"><small>SEGMENTATION</small></a></li>
                            <li className={this.state.activeTab === 'transactions' ? 'navActive' : ''}><a onClick={(e) => {this.changeTab('transactions')}} style={{cursor:'pointer'}} className="e_transaction_icon"><small>TRANSACTIONS</small></a></li>
                            <li><a  style={{cursor:'pointer'}} className="e_loyalty_icon"><small>LOYALTY</small></a>
                                <ul>
                                    <li className={this.state.activeTab === 'points_levels' ? 'navActive' : ''}><a onClick={(e) => {this.changeTab('points_levels')}}  style={{cursor:'pointer'}}><span>Points and Level</span></a></li>
                                    <li className={this.state.activeTab === 'gamification' ? 'navActive' : ''}><a onClick={(e) => {this.changeTab('gamification')}}  style={{cursor:'pointer'}}><span>Gamification</span></a></li>

                                    {/*<li><a  style={{cursor:'pointer'}}><span>Stamp Cards</span></a></li>*/}

                                    <li className={this.state.activeTab === 'stamp_cards' ? 'navActive' : ''}><a onClick={(e) => {this.changeTab('stamp_cards')}}  style={{cursor:'pointer'}}><span>Stamp Cards</span></a></li>
                                    <li className={this.state.activeTab === 'vouchers' ? 'navActive' : ''}><a onClick={(e) => {this.changeTab('vouchers')}}  style={{cursor:'pointer'}}><span>Vouchers</span></a></li>
                                </ul>
                            </li>
                            <li className={this.state.activeTab === 'campaigns' ? 'navActive' : ''}><a onClick={(e) => {this.changeTab('campaigns')}}  style={{cursor:'pointer'}} className="e_campaigns_icon"><small>Campaigns</small></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of Member.

ProfileSideBar.propTypes = {};

export default ProfileSideBar;