import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import QRCode from "qrcode.react";

class PasswordComponent extends Component {
    rolePopup = null;
    dropDownLabelRef=null;
    showIcon=null;
    state = {
        password:'',
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidMount = () => {

    };//..... end of componentDidMount() .....//




    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    openPopup = (data,itemdata) => {

        this.rolePopup.style.display = "block";
        document.body.style.overflow = 'hidden';
        this.rolePopup.style.overflow = "auto";

    };
    closePopup = () => {
        document.body.style.overflow = 'auto';
        this.rolePopup.style.display = "none";
        this.setState(()=>({
            password:'',
        }))
    };
    handleChange = (password) => {
        this.setState(()=>({
            password:password
        }));
    };
    savePassword =()=>{
        show_loader();
        axios.post(BaseUrl + `/api/update-user-password`, {
            'password'      : this.state.password,
            'user_id'       : this.props.persona_id,
        }).then(res => {
            if (res.data.status) {
                show_loader(true);
                NotificationManager.success('Password Updated Successfully', 'Success');
                this.closePopup();
            } else {
                show_loader(true);
            }


        }).catch((err) => {
            show_loader(true);
        });

    }
    showPassword = () => {
        if(this.dropDownLabelRef.type =='password')
        {
            this.dropDownLabelRef.type = 'text';
            this.showIcon.className='fa fa-eye-slash'
        }
        else{
            this.dropDownLabelRef.type='password';
            this.showIcon.className='fa fa-eye'
        }


    }
    forgotPasswordByEmail = () =>{
        show_loader();
        axios.post(BaseUrl + `/api/user-forgot-password-email`, {
            'user_id'       : this.props.persona_id,
        }).then(res => {
            if (res.data.status) {
                show_loader(true);
                NotificationManager.success('Reset Password Email Sent Successfully', 'Success');
                this.closePopup();
            } else {
                show_loader(true);
            }


        }).catch((err) => {
            show_loader(true);
        });

    }
    render() {

        return (
            <div className="e_member_right">
                <div className="add_category_listing">
                    <ul>
                        <li>
                            <div className="add_categoryList_info addProduct_setting" id="printableArea">
                                <div className="newVualt_heading">
                                    <h3>Reset Password<a href="javascript:void(0);"></a></h3>
                                </div>
                                <div className="categoryInfo_container clearfix">
                                    <div className="addCategoryRight_section">
                                        <div className="edit_category_rightDetail removeHighlights">


                                            <div className="addCategory_formSection">

                                                <div className="e_member_printBtns clearfix" style={{marginLeft:'-50%'}}>
                                                    <ul>
                                                        <li>
                                                            <input type="submit" value="By Email" onClick={()=>{this.forgotPasswordByEmail()}} />
                                                        </li>
                                                        <li>
                                                            <input type="submit" value="Directly" onClick={()=>{this.openPopup('new','')}} />
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className= "popups_outer addRolePopup" ref={(ref)=>{this.rolePopup = ref}} style={{display:"none"}}>
                    <div className="popups_inner">
                        <div className="overley_popup close_role_popup" onClick={()=>{this.closePopup()}}></div>

                        <div className="popupDiv">
                            <div className="contentDetail" style={{padding:'30px'}}>

                                <div className="autoContent">
                                    <div className="compaigns_list_content">
                                        <div className="add_categoryList_info2">
                                            <div className="newVualt_heading">
                                                <h3>Password</h3>
                                            </div>

                                            <div className="categoryInfo_container clearfix">

                                                <div className="addCategoryRight_section">
                                                    <div className="addCategory_formSection portalNew_page">
                                                        <ul>
                                                            <li>
                                                                <div className="customPlaceholder_outer">
                                                                    <h4>New Password</h4>
                                                                    <div className="customPlaceholder">
                                                                        <input ref={(ref) => this.dropDownLabelRef = ref} type="password" value={this.state.password} onChange={(e)=>{this.handleChange(e.target.value)}} placeholder="Enter New Password" name="password"/>
                                                                        <span style={{
                                                                            width: '15px',
                                                                            height: '15px',
                                                                            position: 'absolute',
                                                                            bottom: '15px',
                                                                            right: '15px'
                                                                        }} ><i ref={(ref) => this.showIcon = ref} style={{fontSize:'14px',cursor:'pointer'}} className="fa fa-eye" onClick={this.showPassword}></i></span>
                                                                    </div>
                                                                </div>
                                                            </li>


                                                        </ul>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="continueCancel  listShops">
                                                <a  style={{cursor:'pointer'}} className={(this.state.password =='')?'disabled':''} onClick={this.savePassword}>SAVE</a>
                                                <a  style={{cursor:'pointer'}} className="close_role_popup" onClick={()=>{this.closePopup()}}>CANCEL</a>
                                            </div>
                                        </div>

                                    </div>

                                </div>


                            </div>


                        </div>


                    </div>
                </div>
                <div className="clearfix">
                    <div className="e_member_printBtns clearfix">
                        {/*<ul>
                            <li>
                                <input   type="submit" value="SUBMIT" onClick={this.updateMember} />
                            </li>
                        </ul>*/}
                    </div>
                </div>



            </div>
        );
    }//..... end of render() .....//
}//..... end of Member.

export default PasswordComponent;