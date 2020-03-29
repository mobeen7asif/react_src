import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import {SketchPicker} from "react-color";
import ImageCropping from "../ImageCropping";

class AddEditQuickBoard extends Component {
    qb_typeTypeSpanRef = null; saveBoardButton = null;   BoardTitleRef = null; displayOrderRef = null; QucikBoardTypeSpanRef=null;
    canvas  = null;
    canvas2 = null;
    constructor(props) {
        super(props);
        this.state = {
            is_edit : 0,
            company_id : CompanyID,
            venue_id:VenueID,
            board_title: "",
            news_image:"",
            is_global:false,
            background_image:"",
            icon_image:"",
            color1:"#ffffff",
            color2:"#ffffff",
            color3:"#ffffff",
            quickBoardLevelText:"Select Level",
            qb_level_id:0,
            is_single:false,
            is_popupOpen:0,
            src  : "",
            src2 : "",
            qb_types:[],
            selected_qb_type:"",// type for quick board,
            display_order:1,
            qbLevels:[]
        };
    };//..... end of constructor() .....//



    validation = () => {
        if(this.state.board_title == "")
            this.saveBoardButton.classList.add("disabled");
        else
            this.saveBoardButton.classList.remove("disabled");
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//


    handleChangeComplete = (color, key) => {
        this.setState(()=>({ [key]: color.hex }));
    };

    closePopup = () => {
        this.props.changeQuickBoard("QuickBoard",0);
    };

    componentDidMount = () => {
        this.loadVideos();
        if(this.props.quickBoardData !=0){
            this.editBoard(this.props.quickBoardData);
        }else{

            $('.multi-select .arrow').html('&nbsp;');
        }
    };

    editBoard = (value) => {
        this.saveBoardButton.classList.remove("disabled");
        var icon_image = "";
        if(value.icon_image != "default.jpg"){
            icon_image = BaseUrl+"/news/"+value.icon_image;
        }else{
            $('#blah_icon').attr('src', '');
            $("#icon_image_upload_area").show();
            $("#remove_icon_button").hide();
            $('#fileToUpload_icon').val("");
            setTimeout(()=>{$("#blah_icon").hide();},100)
        }

        let background_image = "";
        if(value.background_image){
           background_image = BaseUrl+"/news/"+value.background_image;
        }else{
            $("#background_image_upload_area").show();
            $('#fileToUpload').val("");
        }

        this.setState(()=>(
            {
                is_edit     : value.id,
                board_title  : value.board_title,
                color1  : value.color1,
                color2  : value.color2,
                color3  : value.color3,
                display_order  :value.display_order,
                quickBoardLevelText  :value.level_name,
                qb_level_id  :value.level_order,
                selected_qb_type  :value.qb_type,
                background_image,
                icon_image,
            }
        ),()=>{
            this.QucikBoardTypeSpanRef.innerHTML    = value.level_name;
        });
    };


    componentWillUnmount = () => {
        $("body").find('#fileToUpload').off('change');
        $("body").find('#fileToUpload').unbind('change.mynamespace');
        $("body").find('#fileToUpload_icon').off('change');
        $("body").find('#fileToUpload_icon').unbind('change.mynamespace');
    };

    handleButtonsShow = (e) => {
        let li = e.target.closest('li');
        if (li.classList.contains('active_editMod')) {
            li.classList.remove('active_editMod');
        } else {
            Array.prototype.slice.call(e.target.closest('ul').querySelectorAll('li'))
                .map((ele) => ele.classList.remove('active_editMod'));
            li.classList.add('active_editMod');
        }//..... end if-else() .....//
    };

    loadVideos = () => {
        show_loader();
        axios.post(BaseUrl + '/api/qb-types')
            .then(res => {
                let types=[];
                if(res.data.qb_types.length > 0){
                    types = res.data.qb_types.filter((value,key)=>{
                            if(this.state.qb_level_id == 1){
                                if(value.type != "LOYALTY" && value.type !="CHARITY" && value.type !="STORE"){
                                    return true;
                                }
                            }else if(this.state.qb_level_id == 2){
                                if(value.type != "SHOPPING CENTERS"){
                                    return true;
                                }
                            }else{
                                return true;
                            }
                    });
                }
                this.setState(()=>({qb_types:types,qbLevels:res.data.qb_levels}));
                show_loader();
            }).catch((err) => {
            show_loader();
        });
    };

    handleChange = (obj) => {
        this.setState(()=>(obj),()=>{
            this.validation();
            if(this.state.display_order == 0){
                this.handleChange({display_order:1});
            }
        });
    };

    saveQuickBoard = () => {
        if (! this.canvas && this.state.src) {
            NotificationManager.warning("Please crop the background image.", 'Image Cropping!');
            return false;
        }//..... end if() .....//

        if (! this.canvas2 && this.state.src2) {
            NotificationManager.warning("Please crop the icon image.", 'Image Cropping!');
            return false;
        }//..... end if() .....//

        let data = new FormData();

        data.append('background_image', this.canvas ? this.canvas.toDataURL('image/jpeg') : null);
        data.append('icon_image', this.canvas2 ? this.canvas2.toDataURL('image/jpeg') : null);

        data.append('is_edit', this.state.is_edit);
        data.append('board_title', this.state.board_title);
        data.append('color1', this.state.color1);
        data.append('color2', this.state.color2);
        data.append('color3', this.state.color3);
        data.append('display_order', this.state.display_order);
        data.append('venue_id', VenueID);
        data.append('company_id', CompanyID);
        data.append('is_replace', 0);
        data.append('quickBoardLevelText', this.state.quickBoardLevelText);
        data.append('qb_level_id', this.state.qb_level_id);
        data.append('selected_qb_type', this.state.selected_qb_type);
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        show_loader();
        axios.post(BaseUrl + '/api/save-venue-videos',data,config)
            .then(res => {
                this.setState(()=>({
                    is_edit : 0,
                    board_title: "",
                    color1: "",
                    color2: "",
                    color3: "",
                    display_order : 1,
                    background_image: '',
                    icon_image: '',
                    src: '',
                    src2: ''
                }),()=>{
                    this.formReset();
                    this.closePopup();
                });
                show_loader();
                NotificationManager.success(res.data.message, 'Success');
                $('.tbl--row').removeClass('active_editMod');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while adding Quick Board.", 'Error');
        });
    };

    formReset = () => {
        $('#fileToUpload').val("");
        $('#blah').attr('src', '');
        $('#blah').hide();
        $("#background_image_upload_area").show();
        $("#remove_background_button").hide();
        $('#fileToUpload').val("");
        $("#icon_image_upload_area").show();
        $("#remove_icon_button").hide();
        $('#fileToUpload_icon').val("");
        this.QucikBoardTypeSpanRef.innerHTML="Select Level";
        $('#blah_icon').attr('src', '');
        $('#blah_icon').hide();
        this.setState(()=>({
            is_edit : 0,
            board_title: "",
            color1: "",
            color2: "",
            color3: "",
            is_popupOpen:0,
            display_order : 1,
            background_image: '',
            icon_image: '',
            src: '',
            src2: ''
        }),()=>{
            this.canvas = null;
            this.canvas2 = null;
        });
    };

    getBoardTypeId = (e) => {
        let index = e.target.selectedIndex;
        let optionElement = e.target.childNodes[index];
        let value =  optionElement.getAttribute('value');
        let cat_nam =  optionElement.getAttribute('cat_name');
        this.QucikBoardTypeSpanRef.innerHTML = cat_nam;
        this.setState(()=>({quickBoardLevelText:cat_nam,qb_level_id:value,selected_qb_type:0}),()=>{
            this.loadVideos();
            this.validation();

        });
    };

    getQuickBoardType = (e) => {
        let index = e.target.selectedIndex;
        let optionElement = e.target.childNodes[index];
        let value =  optionElement.getAttribute('value');
        this.qb_typeTypeSpanRef.innerHTML = value == 0 ? "Select Quick Board Type..." : value;
        this.setState(()=>({selected_qb_type:value}),()=>{
            this.validation();
        });
    };


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

    onSelectFile2 = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => this.handleChange({ src2: reader.result }));
            reader.readAsDataURL(e.target.files[0]);
        }//..... end if() .....//
    };//..... end of onSelectFile() .....//

    setCanvas2 = (canvas) => {
        this.canvas2 = canvas;
    };//..... end of setCanvas() .....//

    render() {
        return (
            <div>
                <div className="newVualt_container">
                    <div className="newVualt_container_detail">


                    </div>
                </div>

                <div className= "popups_outer addVideoPopup" style={{display:"block"}} >
                    <div className="popups_inner">
                        <div className="overley_popup" data-attr="addNewUser_popup" onClick={()=>{this.closePopup()}}>&nbsp;</div>
                        <div className="popupDiv2 largePopup">
                            <div className="popupDiv_detail">
                                <div className="popup_heading clearfix">
                                    <h3>Create New Board</h3>
                                    <a  style={{cursor:'pointer'}} onClick={()=>{this.closePopup()}} className="popupClose close_popup">&nbsp;</a>
                                </div>
                                <div className="beacon_popupDeatail"> <br /><br />
                                    <div className="add_categoryList_info2">
                                        <div className="newVualt_heading">
                                            <h3>Add Board</h3>
                                        </div>
                                        <div className="categoryInfo_container cms_nes_setting clearfix">
                                            <div className="uploadImg_section">
                                                <h4>Background image</h4>
                                                <div className="uploadImg_section_info">
                                                    <div className="uploadPlaceholder">
                                                        <div className="image_notify_upload_area" id="background_image_upload_area" style={{height:"160px", marginBottom: '0px'}}>
                                                            <input type="file" onChange={this.onSelectFile} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <ImageCropping src={this.state.src} setCanvas={this.setCanvas} image={this.state.background_image}
                                                               cropingDivStyle={{width: '100%', height: '125px', float: 'left'}}
                                                               previewStyle={{width: '100%', maxHeight: '350px'}}
                                                               previewImgStyle={{height: '192px',width:'192px'}}/>
                                            </div>
                                            <div className="addCategoryRight_section">
                                                <div className="addCategory_formSection portalNew_page">
                                                    <ul>
                                                        <li >
                                                            <div className="customPlaceholder_outer">
                                                                <h4>Level</h4>
                                                                <div className="customDropDwn_outer changeDropdon_color" style={{zIndex:"1",position:"relative"}}>
                                                                    <div className="customDropDown_placeholder">
                                                                        <span id="cat_value" cat-value="" ref={(ref)=>{this.QucikBoardTypeSpanRef = ref;}} >{this.state.quickBoardLevelText}</span>
                                                                        <select id="news_category_id" onChange={(e)=>{this.getBoardTypeId(e)}} >
                                                                            <option key={"ee-"+121} value="0" cat_name="Select Level">Select Level</option>
                                                                            {this.state.qbLevels.map((value,key)=>{
                                                                                return (
                                                                                    <option key={key} value={value.level_order} cat_name={value.level_name}>{value.level_name}</option>
                                                                                )
                                                                            })}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>

                                                        <li style={{width:"50%",display:"inline-block"}}>
                                                            <div className="customPlaceholder_outer">
                                                                <h4>Titles</h4>
                                                                <b className="req_tag">Required</b>
                                                                <div className="customPlaceholder">
                                                                    <input   name="board_title" id="board_title" ref={(ref)=>{this.BoardTitleRef = ref}} placeholder="Enter title ...." value={this.state.board_title} onChange={(e)=>this.handleChange({board_title:e.target.value})} type="text" />
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li style={{width:"50%",display:"inline-block",float:"right"}}>
                                                            <div className="customPlaceholder_outer">
                                                                <h4>Quick Board Type</h4>
                                                                <div className="customDropDwn_outer changeDropdon_color" style={{zIndex:"1",position:"relative"}}>
                                                                    <div className="customDropDown_placeholder">
                                                                        <span id="qb_type" cat-value="" ref={(ref)=>{this.qb_typeTypeSpanRef = ref;}} >{(this.state.selected_qb_type == "" || this.state.selected_qb_type == 0 ) ? "Select Quick Board Type..." : this.state.selected_qb_type}</span>
                                                                        <select id="news_category_id" onChange={(e)=>{this.getQuickBoardType(e)}} >
                                                                            <option key={"qb-"+1235} value="0" cat_name="0">Select Quick Board Type...</option>
                                                                            {this.state.qb_types.map((value,key)=>{
                                                                                return (
                                                                                    <option key={key} value={value.type} cat_name={value.type}>{value.type}</option>
                                                                                )
                                                                            })}

                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>

                                                        <li>
                                                            <div className="customPlaceholder_outer">
                                                                <h4>Icon</h4>
                                                                <b className="req_tag">&nbsp;</b>
                                                                <div className="uploadImg_section_info" style={{width:"200px",background:"whitesmoke", display: 'inline-block'}}>
                                                                    <div className="uploadPlaceholder">
                                                                        <div className="image_notify_upload_area" id="icon_image_upload_area" style={{height:"180px",width:"181px", marginBottom: '0px'}}>
                                                                            <input type="file" onChange={this.onSelectFile2} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <ImageCropping src={this.state.src2} setCanvas={this.setCanvas2} image={this.state.icon_image}
                                                                               cropingDivStyle={{width: '60%', height: '180px', float: 'left'}}
                                                                               previewStyle={{width: '40%', maxHeight: '350px', float: 'left'}}
                                                                               previewImgStyle={{height: '180px',width:'180px'}}
                                                                               mainWrapperStyle={{width: '70%', paddingTop: '20px', float: 'right', display: 'inline-block'}}/>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="customPlaceholder_outer">
                                                                <h4>Icon</h4>
                                                                <b className="req_tag"></b>
                                                                <div className="uploadImg_section_info" style={{display: 'inline-block'}}>
                                                                    <span style={{float: 'left', paddingRight: '36px'}}>
                                                                       <SketchPicker
                                                                           color={ this.state.color1 }
                                                                           onChangeComplete={ (color) => {this.handleChangeComplete(color, 'color1') }}
                                                                       />
                                                                    </span>
                                                                    <span style={{float: 'left', paddingRight: '36px'}}>
                                                                    <SketchPicker
                                                                        color={ this.state.color2 }
                                                                        onChangeComplete={ (color) => {this.handleChangeComplete(color, 'color2') }}
                                                                    />
                                                                    </span>
                                                                    <span style={{float: 'left', paddingRight: '36px'}}>
                                                                    <SketchPicker
                                                                        color={ this.state.color3 }
                                                                        onChangeComplete={ (color) => {this.handleChangeComplete(color, 'color3') }}
                                                                    />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="customPlaceholder_outer">

                                                                <h4>Order</h4>
                                                                <b className="req_tag">Required</b>
                                                                <div className="customPlaceholder">
                                                                    <input  maxLength="3"  name="display_order" className="numeric" id="display_order" ref={(ref)=>{this.displayOrderRef = ref}} placeholder="Enter title ...." value={this.state.display_order} onChange={(e)=>this.handleChange({display_order:e.target.value})} type="text" />
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="continueCancel place_beacon createUserButtons">
                                        <input className="disabled selecCompaignBttn save_news" value="SAVE" type="submit" ref={(ref)=>{this.saveBoardButton = ref;}} onClick={(e)=>{this.saveQuickBoard()}} />
                                        <a  style={{cursor:'pointer'}} className="close_popup" onClick={()=>{this.closePopup()}}>CANCEL</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddEditQuickBoard;