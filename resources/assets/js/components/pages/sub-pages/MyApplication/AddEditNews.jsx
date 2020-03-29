import React, {Component} from 'react';
import MultiSelectReact from "multi-select-react";
import CKEditor from "react-ckeditor-component";
import DatePicker from 'react-datepicker';
import moment from "moment";
import {NotificationManager} from "react-notifications";
import ImageCropping from "../ImageCropping";
import {find} from 'lodash';
import 'react-datepicker/dist/react-datepicker.css';

class AddEditNews extends Component {
    canvas = null;
    addNewsPopup = null;
    constructor(props) {
        super(props);
        this.state = {
            SelectedNewsType    : "News",
            category_id         : 0,
            startDate           : moment(),
            endDate             : moment(),
            news_title          : '',
            video_link          : "",
            is_edit             : 0,
            news_text           : "",
            news_intro          : "",
            is_global           : false,
            multiSelect         : [],
            category_name       : '',
            venue_name          : '',
            image               : '',
            src                 : "",
            is_featured         :false,
            multi_select_venues: []
        };

        this.defaultDate = moment();
    }//..... end of constructor() .....//

    loadEditData = () => {
        let cateId = this.props.recordToEdit.news_category_id;
        let category = find(this.props.listNewsCategories, function(o){return o.news_category_id == cateId; });
        let multiselect = this.props.quickboards;

        let multi_select_venues = this.props.listVenues;

        this.props.recordToEdit.selected_board_news.forEach(function(value) {
            multiselect.forEach(function(val, index) {
                    if (value.board_id == val.id)
                        multiselect[index] = {...val, value: true}
            });
        });


        this.props.recordToEdit.selected_venues.forEach(function(value) {
            multi_select_venues.forEach(function(val, index) {
                if (value.venue_id == val.id)
                    multi_select_venues[index] = {...val, value: true}
            });
        });

        this.setState(() => ({
            is_edit         : this.props.recordToEdit.id,
            category_id     : this.props.recordToEdit.news_category_id,
            category_name   : category ? category.news_category_name : '',
            news_title      : this.props.recordToEdit.news_subject,
            news_text       : this.props.recordToEdit.news_desc,
            news_intro      : this.props.recordToEdit.news_web_detail,
            is_global       : (this.props.recordToEdit.is_global),
            image           : BaseUrl+"/news/"+this.props.recordToEdit.news_image,
            NewsTypeID      : this.props.recordToEdit.news_type,
            SelectedNewsType: this.props.recordToEdit.news_type,
            video_link      : this.props.recordToEdit.video_link,
            startDate       : moment(this.props.recordToEdit.start_date,"DD-MM-YYYY HH:mm"),
            endDate         : moment(this.props.recordToEdit.end_date,"DD-MM-YYYY HH:mm"),
            multiSelect     : multiselect,
            multi_select_venues  : multi_select_venues,
            is_featured     : this.props.recordToEdit.is_featured,
        }),()=>{
            this.hideQuickBoards();
        });
    };//..... end of loadEditData() .....//

    getNewsTypeId = (e) => {
        let index = e.target.selectedIndex;
        let optionElement = e.target.childNodes[index];
        let SelectedNewsType =  optionElement.getAttribute('value');
        this.handleChange({SelectedNewsType});
    };//..... end of getNewsTypeId() .....//

    getNewsCatId = (e) => {
        let index = e.target.selectedIndex;
        let optionElement = e.target.childNodes[index];
        let category_id =  optionElement.getAttribute('value');
        let category_name =  optionElement.getAttribute('cat_name');
        this.handleChange({category_id, category_name});
    };//..... end of getNewsCatId() .....//

    handleChange = (obj) => {
        this.setState(()=>(obj));
    };//..... end of handleChange() .....//

    optionClicked = (multiSelect) => {
        this.handleChange({ multiSelect });
    };//..... end of optionClicked() .....//

    selectedBadgeClicked = (multiSelect) => {
        this.handleChange({ multiSelect });
    };//..... end of selectedBadgeClicked() .....//


    optionClickedVenue = (multi_select_venues) => {
        this.handleChange({ multi_select_venues });
    };//..... end of optionClicked() .....//

    selectedBadgeClickedVenue = (multi_select_venues) => {
        this.handleChange({ multi_select_venues });
    };//..... end of selectedBadgeClicked() .....//

    onChangeNewsInto = (evt) => {
        let news_intro = evt.editor.getData();
        this.handleChange({news_intro})
    };//..... end of onChangeNewsInto() .....//

    onChangeNewsText = (evt) => {
        let news_text = evt.editor.getData();
        this.handleChange({ news_text });
    };//..... end of onChangeNewsText() .....//

    handleDateChange = (date, key) => {
        this.setState(() => ({[key]: date}), () => {
            if (this.state.startDate > this.state.endDate)
                this.setState({endDate:this.state.startDate});
        });
    };//..... end of handleDateChange() ......//

    saveNews = () => {
        if (! this.canvas && this.state.src) {
            NotificationManager.warning("Please crop the image.", 'Image Cropping!');
            return false;
        }//..... end if() .....//

        let startDate = moment(this.state.startDate,"YYYY-MM").format('YYYY-MM-DD HH:mm');
        let endDate = moment(this.state.endDate,"YYYY-MM").format('YYYY-MM-DD HH:mm');
        let list_selected_board = [];
        this.state.multiSelect.map((value) => {
            if (value.value === true)
                list_selected_board.push(value.id);
        });//...... end if() .....//


        let list_selected_venues = [];
        this.state.multi_select_venues.map((value) => {
            if (value.value === true)
                list_selected_venues.push(value.id);
        });//...... end if() .....//
        this.closePopup();
        show_loader();

        axios.post(BaseUrl + '/api/save-venue-news', {
            is_edit: this.state.is_edit,
            category_id: this.state.category_id,
            news_title: this.state.news_title,
            news_text: this.state.news_text,
            news_intro: this.state.news_intro,
            venue_id: VenueID,
            company_id: CompanyID,
            is_global: this.state.is_global,
            news_type_id: this.state.NewsTypeID,
            selected_news_type: this.state.SelectedNewsType,
            video_link: this.state.video_link,
            list_selected_board: list_selected_board,
            list_selected_venues: list_selected_venues,
            is_featured: this.state.is_featured,
            startDate,
            endDate,
            image: this.canvas ? this.canvas.toDataURL('image/jpeg') : null,
        }).then(res => {
               this.props.loadNews();
               this.props.handleShowAddEditModal(false);
                show_loader(true);
                NotificationManager.success("News saved Successfully!", 'Success');
            }).catch((err) => {
            show_loader(true);
            NotificationManager.error("Error occurred while saving News.", 'Error');
        });
    };//..... end of saveNews() .....//

    validate = () => {
        return (this.state.category_id && this.state.news_title && this.state.news_text && this.state.news_intro
            && ((this.state.SelectedNewsType === "News" || this.state.SelectedNewsType == "Events") ? this.state.startDate && this.state.endDate : true)
            && (this.state.SelectedNewsType === "Videos" && !this.state.video_link ? false : true)
        );
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

        document.body.style.overflow = 'hidden';
        this.addNewsPopup.style.display = "auto";
    };//..... end of componentDidMount() ......//

    is_featured = () => {
        this.setState((prevState)=>({is_featured: !prevState.is_featured}),()=>{
        });
    };//..... end of is_featured() .....//
    isGlobal = () => {
        this.setState((prevState)=>({is_global: !prevState.is_global}),()=>{
            this.hideQuickBoards();
        });
    };//..... end of is_featured() .....//

    hideQuickBoards = () => {
        if(this.state.is_global){

           // document.getElementById("quickBoards_id").style.display = "none";
            /*document.getElementById("multiVenues").style.display = "none";*/
            this.setState(()=>({multiSelect:[],multi_select_venues:[]}));
        }else{
           // document.getElementById("quickBoards_id").style.display = "inline-block";
            /*document.getElementById("multiVenues").style.display = "inline-block";*/
        }
    };

    closePopup = () => {
        document.body.style.overflow = 'auto';
        this.rolePopup.style.display = "none";
    };
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
            <div className= "popups_outer addNewsPopup" ref={(ref)=>{this.addNewsPopup = ref}} style={{display:'block',overflowY:"auto"}}>
                <div className="popups_inner">
                    <div className="overley_popup" data-attr="addNewUser_popup" onClick={()=>{this.props.handleShowAddEditModal(false);this.closePopup();}}>&nbsp;</div>
                    <div className="popupDiv2 largePopup">
                        <div className="popupDiv_detail">
                            <div className="popup_heading clearfix">
                                <h3>Add/Edit News</h3>
                                <a  style={{cursor:'pointer'}} onClick={()=>{this.props.handleShowAddEditModal(false); this.closePopup();}} className="popupClose close_popup">&nbsp;</a>
                            </div>
                            <div className="beacon_popupDeatail"> <br /><br />
                                <div className="add_categoryList_info2">
                                    <div className="newVualt_heading">
                                        <h3>Add/Edit News</h3>
                                    </div>
                                    <div className="categoryInfo_container cms_nes_setting clearfix">
                                        <div className="uploadImg_section">
                                            <h4>Featured image</h4>
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
                                                           previewImgStyle={{height: '192px',width:'192px'}}/>
                                        </div>
                                        <div className="addCategoryRight_section">
                                            <div className="addCategory_formSection portalNew_page clearfix">
                                                <ul>
                                                    <li style={{width:"50%",display:"inline-block",float:"left"}}>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Select News Type</h4>
                                                            <div className="customDropDwn_outer changeDropdon_color" style={{zIndex:"1",position:"relative"}}>
                                                                <div className="customDropDown_placeholder">
                                                                    <span id="cat_value">{this.state.SelectedNewsType}</span>
                                                                    <select id="news_category_id" onChange={(e)=>{this.getNewsTypeId(e)}} >
                                                                        <option key={123} value="News" cat_name="News">News</option>
                                                                        <option key={125} value="Events" cat_name="Events">Events</option>
                                                                        <option key={124} value="Videos" cat_name="Videos">Videos</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li style={{width:"50%",display:"inline-block",float:"right"}}>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Category</h4>
                                                            <div className="customDropDwn_outer changeDropdon_color" style={{zIndex:"1",position:"relative"}}>
                                                                <div className="customDropDown_placeholder">
                                                                    <span id="cat_value">{this.state.category_name ? this.state.category_name : 'Select Category'}</span>
                                                                    <select id="news_category_id" onChange={(e)=>{this.getNewsCatId(e)}}>
                                                                        <option key={985415} value="0" cat_name="Select Category">Select Category</option>
                                                                        {this.props.listNewsCategories && (
                                                                            this.props.listNewsCategories.map((value,key)=>{
                                                                                return (
                                                                                    <option key={key} value={value.news_category_id} cat_name={value.news_category_name}>{value.news_category_name}</option>
                                                                                )
                                                                            })
                                                                        )}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>


                                                    <li id="video_link_area" style={{display: this.state.SelectedNewsType == "Videos" ? 'block' : 'none'}}>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Video Link</h4>
                                                            <div className="edittor_column">
                                                                <div className="edittor_column_head">&nbsp;</div>
                                                                <div className="edittor_column_area">
                                                                    <textarea value={this.state.video_link} onChange={(e) => this.handleChange({video_link: e.target.value})} name="video_link" placeholder="Enter Video Link...">&nbsp;</textarea>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>


                                                    {/*<li>

                                                    <li style={{marginTop: '20px'}}>
                                                        <div style={{marginTop: '20px', marginLeft:'-18px'}}>
                                                            <span className="cL_rowList_number" style={{fontSize:'13px', fontWeight:'bold'}}>
                                                                Is Global News: <input type="checkbox" checked={this.state.is_global} onChange={()=>{this.isGlobal()}} />
                                                            </span>
                                                        </div>
                                                    </li>

                                                    <li id="quickBoards_id">

                                                        <div className="customPlaceholder_outer">
                                                            <h4>Select Quick Boards (Optional)</h4>
                                                        </div>
                                                        <MultiSelectReact options={this.props.quickboards} optionClicked={this.optionClicked} selectedBadgeClicked={this.selectedBadgeClicked}
                                                            selectedOptionsStyles={selectedOptionsStyles} optionsListStyles={optionsListStyles} />
                                                    </li>*/}

                                                    {/*<li id="multiVenues" style={{width:"50%",display:"inline-block"}}>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Select Venue</h4>
                                                        </div>
                                                        <MultiSelectReact options={this.props.listVenues} optionClicked={this.optionClickedVenue} selectedBadgeClicked={this.selectedBadgeClickedVenue}
                                                                          selectedOptionsStyles={selectedOptionsStyles} optionsListStyles={optionsListStyles} />
                                                    </li>*/}

                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Title</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="customPlaceholder">
                                                                <input   name="news_title" placeholder="Title..." value={this.state.news_title} onChange={(e)=>this.handleChange({news_title: e.target.value})} type="text" />
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>News Introduction</h4>
                                                            <CKEditor activeClass="p10" content={this.state.news_intro} events={{"change": this.onChangeNewsInto}}/>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>News Details</h4>
                                                            <CKEditor activeClass="p10" content={this.state.news_text} events={{"change": this.onChangeNewsText}}/>
                                                        </div>
                                                    </li>

                                                    <li style={{marginTop: '20px'}}>
                                                        <div style={{marginTop: '20px', marginLeft:'-18px'}}>
                                                            <span className="cL_rowList_number" style={{fontSize:'13px', fontWeight:'bold'}}>
                                                                Is Feature News: <input type="checkbox" checked={this.state.is_featured} onChange={()=>{this.is_featured()}} />
                                                            </span>
                                                        </div>
                                                    </li>

                                                    <li id="listDatePickers" style={{display: (this.state.SelectedNewsType == "News" || this.state.SelectedNewsType == "Events" ) ? 'block' : 'none'}}>
                                                        <div className="customPlaceholder_outer">
                                                            <h4 style={{width: '22%',float: "left"}}>Start Date</h4>
                                                            <h4 style={{width: '78%',float: "left"}}>End Date</h4>
                                                        </div>
                                                        <span style={{float: 'left', paddingRight: '36px', height: '24px', padding: '5px 9px',marginRight: '30px', background: 'lightgray'}}>
                                                                    <DatePicker dateFormat="DD-MM-YYYY HH:mm" timeFormat="HH:mm" showTimeSelect placeholderText="select start date" peekNextMonth showMonthDropdown
                                                                        showYearDropdown dropdownMode="select" minDate={this.defaultDate} selected={this.state.startDate}
                                                                        onChange={(date) =>{this.handleDateChange(date, 'startDate')}}
                                                                    />
                                                        </span>

                                                        <span style={{float: 'left', paddingRight: '36px', height: '24px', padding: '5px', background: 'lightgray'}}>
                                                                    <DatePicker dateFormat="DD-MM-YYYY HH:mm" timeFormat="HH:mm" showTimeSelect placeholderText="select end date" peekNextMonth showMonthDropdown
                                                                        showYearDropdown dropdownMode="select" minDate={this.state.startDate} selected={this.state.endDate}
                                                                        onChange={(date) =>{this.handleDateChange(date, 'endDate')}}
                                                                    />;
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="continueCancel place_beacon createUserButtons">
                                    <input className={this.validate() ? "selecCompaignBttn save_news": "selecCompaignBttn save_news disabled"} value="SAVE" type="submit" onClick={(e)=>{this.saveNews()}} />
                                    <a  style={{cursor:'pointer'}} className="close_popup" onClick={()=>{this.props.handleShowAddEditModal(false);this.closePopup();}}>CANCEL</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of AddEditNews.

export default AddEditNews;