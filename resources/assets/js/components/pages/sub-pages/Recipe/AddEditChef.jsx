import React, {Component} from 'react';
import CKEditor from "react-ckeditor-component";
import {NotificationManager} from "react-notifications";
import ImageCropping from "../ImageCropping";
import {find} from 'lodash';

class AddEditChef extends Component {
    canvas = null;

    constructor(props) {
        super(props);
        this.state = {
            is_edit             : 0,
            first_name          : '',
            last_name           : "",
            descriptions        : "",
            image               : '',
            src                 : "",
        };

    }//..... end of constructor() .....//

    loadEditData = () => {
        this.setState(() => ({
            is_edit         : this.props.recordToEdit.id,
            first_name      : this.props.recordToEdit.first_name,
            last_name      : this.props.recordToEdit.last_name,
            descriptions       : this.props.recordToEdit.descriptions,
            image           : BaseUrl+"/uploads/"+this.props.recordToEdit.image,
        }));
    };//..... end of loadEditData() .....//



    handleChange = (obj) => {
        this.setState(()=>(obj));
    };//..... end of handleChange() .....//


    onChangeNewsText = (evt) => {
        let descriptions = evt.editor.getData();
        this.handleChange({ descriptions });
    };//..... end of onChangeNewsText() .....//


    saveNews = () => {
        if (! this.canvas && this.state.src) {
            NotificationManager.warning("Please crop the image.", 'Image Cropping!');
            return false;
        }//..... end if() .....//
        show_loader();
        axios.post(BaseUrl + '/api/save-chef', {
            is_edit: this.state.is_edit,
            first_name: this.state.first_name,
            descriptions: this.state.descriptions,
            last_name: this.state.last_name,
            venue_id: VenueID,
            company_id: CompanyID,
            image: this.canvas ? this.canvas.toDataURL('image/jpeg') : null,
        }).then(res => {
            this.props.loadChef();
            this.props.handleShowAddEditModal(false);
            show_loader(true);
            NotificationManager.success("News saved Successfully!", 'Success');
        }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while saving News.", 'Error');
        });
    };//..... end of saveNews() .....//

    validate = () => {
        return true;
    };//..... end of validate() .....//

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => this.handleChange({ src: reader.result }));
            reader.readAsDataURL(e.target.files[0]);
        }//..... end if() .....//
    };//..... end of onSelectFile() .....//

    setCanvas = (canvas) => {
        this.canvas = canvas;
    };//..... end of setCanvas() .....//

    componentDidMount = () => {
        $('.arrow').html('&nbsp;');

        if (Object.keys(this.props.recordToEdit).length > 0)
            this.loadEditData();
    };//..... end of componentDidMount() ......//

    render() {
        return (
            <div className= "popups_outer addNewsPopup" style={{display:'block'}}>
                <div className="popups_inner">
                    <div className="overley_popup" data-attr="addNewUser_popup" onClick={()=>{this.props.handleShowAddEditModal(false)}}>&nbsp;</div>
                    <div className="popupDiv2 largePopup">
                        <div className="popupDiv_detail">
                            <div className="popup_heading clearfix">
                                <h3>Add/Edit Chef</h3>
                                <a  style={{cursor:'pointer'}} onClick={()=>{this.props.handleShowAddEditModal(false)}} className="popupClose close_popup">&nbsp;</a>
                            </div>
                            <div className="beacon_popupDeatail"> <br /><br />
                                <div className="add_categoryList_info2">
                                    <div className="newVualt_heading">
                                        <h3>Add/Edit Chef</h3>
                                    </div>
                                    <div className="categoryInfo_container cms_nes_setting clearfix">
                                        <div className="uploadImg_section">
                                            <h4>Chef image</h4>
                                            <div className="uploadImg_section_info">
                                                <div className="uploadPlaceholder" style={{height: '175px'}}>
                                                    <img id="blah" style={{display:'none'}} />
                                                    <div className="image_notify_upload_area" style={{height: 'auto', paddingTop: '0px', marginBotton: '0px', minHeight: '175px'}}>
                                                        <input type="file" onChange={this.onSelectFile} />
                                                    </div>
                                                </div>
                                            </div>
                                            <ImageCropping src={this.state.src} setCanvas={this.setCanvas} image={this.state.image}
                                                           cropingDivStyle={{width: '100%', height: '125px', float: 'left'}}
                                                           previewStyle={{width: '100%', maxHeight: '350px'}}
                                                           previewImgStyle={{height: '192px',width:"192px"}}/>
                                        </div>
                                        <div className="addCategoryRight_section">
                                            <div className="addCategory_formSection portalNew_page clearfix">
                                                <ul>

                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>First Name</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="customPlaceholder">
                                                                <input maxLength="26"  name="first_name" placeholder="Title..." value={this.state.first_name} onChange={(e)=>this.handleChange({first_name: e.target.value})} type="text" />
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li>

                                                        <div className="customPlaceholder_outer">
                                                            <h4>Last Name</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="customPlaceholder">
                                                                <input maxLength="26"  name="last_name" placeholder="Title..." value={this.state.last_name} onChange={(e)=>this.handleChange({last_name: e.target.value})} type="text" />
                                                            </div>
                                                        </div>

                                                    </li>

                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Chef Details</h4>
                                                            <CKEditor activeClass="p10" content={this.state.descriptions} events={{"change": this.onChangeNewsText}}/>
                                                        </div>
                                                    </li>


                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="continueCancel place_beacon createUserButtons">
                                    <input className={this.validate() ? "selecCompaignBttn save_news": "selecCompaignBttn save_news disabled"} value="SAVE" type="submit" onClick={(e)=>{this.saveNews()}} />
                                    <a  style={{cursor:'pointer'}} className="close_popup" onClick={()=>{this.props.handleShowAddEditModal(false)}}>CANCEL</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of AddEditNews.

export default AddEditChef;