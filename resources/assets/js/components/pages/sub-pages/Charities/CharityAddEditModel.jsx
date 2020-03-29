import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import ImageCropping from "../ImageCropping";
import MultiSelectReact from "multi-select-react";
import CKEditor from "react-ckeditor-component";
class CharityAddEditModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            charity_name    : "",
            charity_desc    : "",
            charity_intro   : "",
            image           : "",
            contact_number  : "",
            charity_email   : "",
            charity_address : "",
            src             : null,
            bg_src        : null,
            bg_image        : "",
            isEmailValid    : false,
            quickboards     : []
        };
    }//..... end of constructor() .....//

    canvas = null;
    Imagecanvas = null;

    componentDidMount() {
        $('.arrow').html('&nbsp;');
        this.loadQuickBoards();
        if (Object.keys(this.props.editData).length > 0){
            this.setState(() => ({...this.props.editData, image: this.props.editData.image,isEmailValid:true}));
        }

    }//..... end of componentDidMount() .....//

    selectedQuickBoard = ({selected_qb}) => {
        let multiselect = this.state.quickboards;
        selected_qb.forEach((value)=> {
            multiselect.forEach((val, index)=> {
                if (value.board_id == val.id)
                    multiselect[index] = {...val, value: true}
            });
            this.setState(()=>({multiselect:multiselect}));
        });
    };

    saveCharity = () => {
        let selected_board = [];
        this.state.quickboards.map((value) => {
            if (value.value === true)
                selected_board.push(value.id);
        });//...... end if() .....//

        if (!this.state.isEmailValid) {
            NotificationManager.error(`Please provide a valid email.`, 'Error');
            return false;
        }//..... end if() ....//

        if (! this.canvas && this.state.src && !this.Imagecanvas && this.state.bg_image ) {
            NotificationManager.warning("Please crop the image.", 'Image Cropping!');
            return false;
        }//..... end if() .....//

        show_loader();
        axios.post(BaseUrl + '/api/save-charity',{
            is_edit: this.state.id,
            charity_name: this.state.charity_name,
            charity_desc: this.state.charity_desc,
            charity_intro: this.state.charity_intro,
            charity_address: this.state.charity_address,
            image: this.canvas ? this.canvas.toDataURL('image/jpeg') : null,
            charity_email: this.state.charity_email,
            contact_number: this.state.contact_number,
            bg_image:  this.Imagecanvas ? this.Imagecanvas.toDataURL('image/jpeg') : null,
            venue_id: VenueID,
            company_id: CompanyID,
            charity_url:this.state.charity_url,
            selected_board
        }).then((res) => {
                show_loader(true);
                if (res.data.status === true) {
                    this.props.loadCharity();
                    this.props.closeAddEditModel();
                    NotificationManager.success("Charity saved Successfully", 'Success');
                } else {
                    NotificationManager.error(res.data.message, 'Error');
                }//..... end if-else() .....//
            }).catch((err) => {
                show_loader(true);
                NotificationManager.error("Internal Server error occurred while saving Charity.", 'Error');
        });
    };//..... end of saveCharity() .....//



    validate = () => {
        return (this.state.charity_name && this.state.charity_desc && this.state.charity_intro && this.state.contact_number && this.state.charity_email && this.state.charity_address && this.state.charity_url);
    };

    handleEmailChange = (e) => {
        this.setState({charity_email: e.target.value, isEmailValid: e.target.validity.valid});
    };//..... end of handleEmailChange() .....//


    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result }),
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };//..... end of onSelectFile() .....//

    onSelectBackGround = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ bg_src: reader.result }),
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };//..... end of onSelectFile() .....//

    setCanvas = (canvas) => {
        this.canvas = canvas;
    };//..... end of setCanvas() .....//

    setImageCanvas = (canvas) => {
        this.Imagecanvas = canvas;
    };//..... end of setCanvas() .....//

    loadQuickBoards = () => {
        show_loader();
        axios.post(BaseUrl + '/api/get-quick-board',{type:"CHARITY"}).then(res => {
            this.setState(()=>({quickboards:res.data.data}),()=>{
                if (Object.keys(this.props.editData).length > 0)
                    this.selectedQuickBoard(this.props.editData);
            });
            show_loader(true);
        }).catch((err) => {
            show_loader(true);
        });
    };//..... end of loadQuickBoards() .....//

    handleChange = (obj) => {
        this.setState(()=>(obj));
    };//..... end of handleChange() .....//

    optionClicked = (multiSelect) => {
        this.handleChange({ multiSelect });
    };//..... end of optionClicked() .....//

    selectedBadgeClicked = (multiSelect) => {
        this.handleChange({ multiSelect });
    };//..... end of selectedBadgeClicked() .....//

    onChangeintro = (evt) => {
        let intro = evt.editor.getData();
        this.handleChange({charity_intro:intro})
    };//..... end of onChangeDescriptions() .....//


    render() {
        const selectedOptionsStyles = {
            color: "#3c763d",
            backgroundColor: "#dff0d8"
        };
        const optionsListStyles = {
            backgroundColor: "#fcf8e3",
            color: "#8a6d3b"
        };
        return (
            <div className= "popups_outer addNewsCharity" style={{display:'block'}}>
                <div className="popups_inner">
                    <div className="overley_popup" data-attr="addNewUser_popup" onClick={()=>{this.props.closeAddEditModel()}}>&nbsp;</div>
                    <div className="popupDiv2 largePopup">
                        <div className="popupDiv_detail">
                            <div className="popup_heading clearfix">
                                <h3>Add/Edit Charity</h3>
                                <a  style={{cursor:'pointer'}} onClick={()=>{this.props.closeAddEditModel()}} className="popupClose close_popup">&nbsp;</a>
                            </div>
                            <div className="beacon_popupDeatail"> <br /><br />
                                <div className="add_categoryList_info2">
                                    <div className="newVualt_heading">
                                        <h3>Add Charity</h3>
                                    </div>
                                    <div className="categoryInfo_container cms_nes_setting clearfix">
                                        <div className="uploadImg_section">
                                            <h4>Featured image</h4>
                                            <div className="uploadImg_section_info">
                                                <div className="uploadPlaceholder">
                                                    <div className="image_notify_upload_area" style={{marginBottom: '0px', height: '150px'}}>
                                                        <input type="file" onChange={this.onSelectFile} />
                                                    </div>
                                                </div>
                                            </div>
                                            <ImageCropping src={this.state.src} setCanvas={this.setCanvas} image={this.state.image}
                                                           cropingDivStyle={{width: '100%', height: '125px', float: 'left'}}
                                                           previewStyle={{width: '100%', maxHeight: '350px'}}
                                                           previewImgStyle={{height: '192px',width:'192px'}}/>
                                        </div>

                                        <div className="addCategoryRight_section">
                                            <div className="addCategory_formSection portalNew_page">
                                                <ul>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Charity Name</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="customPlaceholder">
                                                                <input name="charity_name" id="charity_name" placeholder="Placeholder" value={this.state.charity_name} onChange={(e)=>this.handleChange({charity_name:e.target.value})} type="text" />
                                                            </div>
                                                        </div>
                                                    </li>

                                                    {/*<li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Select Quick Boards (Optional)</h4>
                                                        </div>
                                                        <MultiSelectReact options={this.state.quickboards} optionClicked={this.optionClicked} selectedBadgeClicked={this.selectedBadgeClicked}
                                                                          selectedOptionsStyles={selectedOptionsStyles} optionsListStyles={optionsListStyles} />
                                                    </li>*/}

                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Charity Introduction</h4>
                                                            <div className="edittor_column">
                                                                <div className="edittor_column_head">&nbsp;</div>
                                                                <div className="edittor_column_area">

                                                                    <CKEditor activeClass="p10" content={this.state.charity_intro} events={{"change": this.onChangeintro}} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Charity Descriptions</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="edittor_column">
                                                                <div className="edittor_column_head"></div>
                                                                <div className="edittor_column_area">
                                                                    <textarea id="charity_desc" value={this.state.charity_desc} onChange={(e)=>this.handleChange({charity_desc:e.target.value})} name="charity_desc" placeholder="Placeholder"></textarea>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Charity URL</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="customPlaceholder">
                                                                <input   name="charity_url" id="charity_url" placeholder="charity Url" value={this.state.charity_url} onChange={(e)=>this.handleChange({charity_url:e.target.value})} type="text" />
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Background Image</h4>
                                                            <b className="req_tag">&nbsp;</b>
                                                            <div className="uploadImg_section_info" style={{width:"200px",background:"whitesmoke", display: 'inline-block'}}>
                                                                <div className="uploadPlaceholder">
                                                                    <div className="image_notify_upload_area" id="icon_image_upload_area" style={{height:"180px",width:"181px", marginBottom: '0px'}}>
                                                                        <input type="file" onChange={this.onSelectBackGround} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <ImageCropping src={this.state.bg_src} setCanvas={this.setImageCanvas} image={this.state.bg_image}
                                                                           cropingDivStyle={{width: '60%', height: '180px', float: 'left'}}
                                                                           previewStyle={{width: '40%', maxHeight: '350px', float: 'left'}}
                                                                           previewImgStyle={{height: '180px',width:'180px'}}
                                                                           mainWrapperStyle={{width: '70%', paddingTop: '20px', float: 'right', display: 'inline-block'}}/>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Contact Number</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="customPlaceholder">
                                                                <input name="contact_number" id="contact_number" placeholder="Placeholder" value={this.state.contact_number} onChange={(e)=>this.handleChange({contact_number:e.target.value})} type="text" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Email</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="customPlaceholder">
                                                                <input   name="charity_email" placeholder="Email" value={this.state.charity_email} onChange={(e)=>this.handleEmailChange(e)} type="email" required='required' />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Address</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="edittor_column">
                                                                <div className="edittor_column_head"></div>
                                                                <div className="edittor_column_area">
                                                                    <textarea id="charity_address" value={this.state.charity_address} onChange={(e)=>this.handleChange({charity_address:e.target.value})} name="charity_address" placeholder="Placeholder"></textarea>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="continueCancel place_beacon createUserButtons">
                                    <input className={this.validate() ? "selecCompaignBttn save_news" : "disabled selecCompaignBttn save_news"} value="SAVE" type="submit" onClick={(e)=>{this.saveCharity()}} />
                                    <a  style={{cursor:'pointer'}} className="close_popup" onClick={()=>{this.props.closeAddEditModel()}}>CANCEL</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of CharityAddEditModel.

export default CharityAddEditModel;