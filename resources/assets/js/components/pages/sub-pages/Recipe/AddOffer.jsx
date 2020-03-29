import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import {validateRecipeOfferData} from "../../../utils/Validations";
import {Scrollbars} from "react-custom-scrollbars";
import {find} from 'lodash';
import {connect} from 'react-redux';
import {selectFormData} from "../../../redux/selectors/RecipeOfferSelector";
import {resetRecipeOfferForm, setByKeyValue, setRecipeOfferEditData} from "../../../redux/actions/RecipeOfferActions";
import ImageCropping from "../ImageCropping";
import MultiSelectReact from "multi-select-react";
import UploadFileDropZone from "../campaigns/campaign-builder/components/message_builder_components/alert_sms_builder/UploadFileDropZone";

import { WithContext as ReactTags } from 'react-tag-input';
const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class AddOffer extends Component {
    state = {
        src: null,
        quickboards:        [],
        listVenues : [],
        video: "",
        priority: 3,
        aspectRatio:    0,
        tags: [],
        suggestions: []
    };

    handleDelete = (i) => {
        const { tags } = this.state;
        this.setState({
            tags: tags.filter((tag, index) => index !== i),
        }, () => {this.setKeyValue('location',this.state.tags)});

    }

    handleAddition = (tag) => {
        this.setState(state => ({ tags: [...state.tags, tag] }) , () => {this.setKeyValue('location',this.state.tags)});
    }

    handleDrag = (tag, currPos, newPos) => {
        const tags = [...this.state.tags];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: newTags });
    }

    customDropDownBSpanRef      = null;
    customDropDownShowBRef      = null;
    customDropDownBSpanRefTwo   = null;
    customDropDownShowBRefTwo   = null;
    canvas                      = null;

    saveData = () => {

        if(! this.canvas && this.state.video == ""){
            NotificationManager.warning("Please Select Image or Video.", 'Image or Video');
            return false;
        }


        if (! this.canvas && this.state.src) {
            NotificationManager.warning("Please crop the image.", 'Image Cropping!');
            return false;
        }//..... end if() .....//

        if (this.props.dataToSave.url) {

            let string = this.props.dataToSave.url;

            let res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            if(!res){
                NotificationManager.warning("Please enter valid URL.", 'Invalid URL');
                return false;
            }
        }

        if (validateRecipeOfferData(this.props.dataToSave)) {

            NotificationManager.warning("Please fill all the required fields.", 'Missing Fields');
            return false;
        }

        else {
            show_loader();
            axios.post(BaseUrl + '/api/save-recipe-offer', {...this.props.dataToSave, image: this.canvas ? this.canvas.toDataURL('image/jpeg') : null , video_link: this.state.video, priority:this.state.priority, location:this.state.tags}).then((response) => {
                show_loader(true);
                if (response.data.status) {
                    NotificationManager.success('Offer saved successfully!', 'Success');
                    this.redirectToListing();
                } else {
                    NotificationManager.error(response.data.message, 'Error');
                }//..... end if-else() .....//
            }).catch((err)=> {
                show_loader(true);
                NotificationManager.error("Error occurred while saving offer, please try later.", 'Error');
            });
        }//..... end if-else() .....//
    };//..... end of saveData() .....//

    removeFile = (key) => {
        axios.get(BaseUrl + '/api/remove-file/?file='+ this.props[key])
            .then((response) => {
                //
            }).catch((err)=> {
            //
        });
        this.setKeyValue(key, '');
    };//..... end of removeFile() ......//

    setKeyValue = (key, value) => {
        this.props.dispatch(setByKeyValue(key, value))
    };//..... end of setKeyValue() .....//

    componentDidMount() {
        $('.arrow').html('&nbsp;');
        this.loadQuickBoards();
        this.loadLocations();


        $(".insightCamp_weightInn label input").click(function(e) {
            $(".insightCamp_weightOut ul li").removeClass("active");
            $(this).parents("li").addClass("active");
        });

        if(this.props.editData.priority){
            this.setState({
                priority:this.props.editData.priority
            })
        };

    };//..... end of componentDidMount() .....//


    redirectToListing = () => {
        this.props.dispatch(resetRecipeOfferForm());
        this.props.changeMainTab('offer');
    };//..... end of redirectToListing() ......//

    setType = (type) => {
        this.customDropDownShowBRef.style.display = 'none';
        this.customDropDownBSpanRef.classList.remove('changeAero');
        this.setKeyValue('type', type);
        if (type === 'recipe')
            this.getRecipeList();
    };//..... end of setType() .....//

    setRecipe = (recipe) => {
        this.customDropDownShowBRefTwo.style.display = 'none';
        this.customDropDownBSpanRefTwo.classList.remove('changeAero');
        this.setKeyValue('recipe_id', recipe.id);
    };//..... end of setType() .....//

    getRecipeList = () => {
        if (this.props.recipeList.length === 0) {
            show_loader();
            axios.get(BaseUrl + '/api/list-recipes-for-dropdown').then((response) => {
                show_loader(true);
                if (response.data.status) {
                    this.setKeyValue('recipeList', response.data.data);
                } else {
                    NotificationManager.error(response.data.message, 'Error');
                }//..... end if-else() .....//
            }).catch((err)=> {
                show_loader(true);
                NotificationManager.error("Error occurred while getting recipe list, please try later.", 'Error');
            });
        }//..... end if() .....//
    };//..... end of getRecipeList() .....//

    handleDropDownBSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowBRef.style.display =  this.customDropDownShowBRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownBSpanClick() .....//

    handleDropDownBSpanClickTwo = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowBRefTwo.style.display =  this.customDropDownShowBRefTwo.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownBSpanClick() .....//

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result }),
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };//..... end of onSelectFile() .....//

    setCanvas = (canvas) => {
        this.canvas = canvas;
    };//..... end of setCanvas() .....//

    loadQuickBoards = () => {
        show_loader();
        axios.get(`${BaseUrl}/api/get-venues-multiselect`)
            .then(res => {
                this.handleChange({quickboards: res.data.data});
                this.setState(()=>({listVenues:res.data.data}),()=>{
                    if (Object.keys(this.props.editData).length > 0) {
                        this.props.dispatch(setRecipeOfferEditData(this.props.editData));
                        let multi_select_venues = this.state.listVenues;
                        this.setState(()=>({video:this.props.editData.video_link}))

                        //-------- show selected venue in edit  -------//
                        this.props.editData.selected_venues.forEach(function(value) {
                            multi_select_venues.forEach(function(val, index) {
                                if (value.venue_id == val.id)
                                    multi_select_venues[index] = {...val, value: true}
                            });
                        });

                        if(this.props.editData.location){
                             let selectedLocationsArray = this.props.editData.location.split(',');
                             let selectedLocationsData = selectedLocationsArray.map((country) => {
                                 return {
                                     id: country,
                                     text: country
                                }
                             });
                             this.setState(()=>({tags:selectedLocationsData}));
                        }


                        //...... end of opration  .......//

                        //---- set selected board in array while editing record  -----//
                        let selected_board = [];
                        this.state.quickboards.map((value) => {
                            if (value.value === true)
                                selected_board.push(value.id);
                        });
                        this.setKeyValue("selected_venues",selected_board);
                        //-------- end of selected board in array while editing record  .....//

                        if (this.props.editData.type === 'recipe')
                            this.getRecipeList();
                    }//..... end if() .....//
                });
                show_loader(true);
            }).catch((err) => {
            show_loader(true);
        });
    };//..... end of loadQuickBoards() .....//

    loadLocations = () => {
        show_loader();
        axios.get(`${BaseUrl}/api/get-saved-locations`)
            .then(res => {
                // (res.data.data);

                let suggestionsData = res.data.data.map((country) => {
                    return {
                        id: country,
                        text: country
                    }
                });
                this.setState({suggestions:suggestionsData});
                show_loader(true);
            }).catch((err) => {
            show_loader(true);
        });
    };//..... end of loadLocations() .....//

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

    handleChange = (obj) => {
        this.setState(()=>(obj));
    };//..... end of handleChange() .....//

    optionClicked = (multiSelect) => {
        this.handleChange({ multiSelect });
        let selected_board = [];
        this.state.quickboards.map((value) => {
            if (value.value === true)
                selected_board.push(value.id);
        });//...... end if() .....//
       this.setKeyValue("selected_venues",selected_board);

    };//..... end of optionClicked() .....//

    selectedBadgeClicked = (multiSelect) => {
        this.handleChange({ multiSelect });

        let selected_board = [];
        this.state.quickboards.map((value) => {
            if (value.value === true)
                selected_board.push(value.id);
        });//...... end if() .....//
        this.setKeyValue("selected_venues",selected_board);
    };//..... end of selectedBadgeClicked() .....//


    setFilename = (fileName) => {
        this.setState(()=>({video:fileName}));
    };//..... end of setFilename() .....//


    removeUploadedFile = () => {
        this.removeFile(this.state.video);
        this.setFilename("");
    };//..... end of removeUploadedFile() .....//

    /*removeFile = (fileName) => {
        axios.get(BaseUrl + '/api/remove-file/?file='+ fileName)
            .then((response) => {
                //
            }).catch((err)=> {
            //
        });
    };//..... end of removeFile() ......//*/

    handlePriority = (priority) => {
        // (priority);
        this.setState({
            priority:priority
        })
    }

    handleAspectRatio = (e, aspect) => {
        // (aspect);
        this.setState({
            aspectRatio:aspect
        })
    }

    render() {
        const selectedOptionsStyles = {
            color: "#3c763d",
            backgroundColor: "#dff0d8"
        };
        const optionsListStyles = {
            backgroundColor: "#fcf8e3",
            color: "#8a6d3b"
        };

        const { tags, suggestions } = this.state;

        return (
            <div className="newVualt_container">
                <div className="newVualt_container_detail">

                    <div className="newVualt_detail_outer">
                        <div className="newVualt_detail">
                            <div className="newVualt_heading_with_buttons clearfix">
                                <div className="newVualt_heading">
                                    <h3>Add/Edit Offer</h3>
                                </div>
                            </div>
                            <div className="categoryInfo_container clearfix ">
                                <div className="smsDetail_inner primary_voucher_setting">

                                    {/*..........*/}
                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Zones</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                {/*<input placeholder="Location..." type="text" onChange={(e)=>{this.setKeyValue('title', e.target.value)}} value={this.props.title}/>*/}
                                                                <ReactTags tags={tags}
                                                                    suggestions={suggestions}
                                                                    handleDelete={this.handleDelete}
                                                                    handleAddition={this.handleAddition}
                                                                    handleDrag={this.handleDrag}
                                                                    delimiters={delimiters}
                                                                    placeholder={'Add Zones...'}
                                                                />
                                                                </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*..........*/}

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Title</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input placeholder="Title..." type="text" onChange={(e)=>{this.setKeyValue('title', e.target.value)}} value={this.props.title}/>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Offer Type</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <div className="customDropDown">
                                                        <span  ref={ref => this.customDropDownBSpanRef = ref} onClick={this.handleDropDownBSpanClick}> {this.props.type ? this.props.type : 'Select Type'}</span>
                                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowBRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none',zIndex: '3'}} >
                                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                                {
                                                                    this.props.offerTypes.map((type) => {
                                                                        return <li key={type} onClick={(e)=> {this.setType(type)}} className={this.props.type && type === this.props.type ? 'selectedItem' : ''}>{type}</li>;
                                                                    })
                                                                }
                                                            </Scrollbars>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>URL</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input placeholder="URL..." type="text" onChange={(e)=>{this.setKeyValue('url', e.target.value)}} value={this.props.url}/>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="dropSegmentation_section" style={{display: this.props.type === 'recipe' ? 'block' : 'none'}}>
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Select Recipe</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <div className="customDropDown">
                                                        <span  ref={ref => this.customDropDownBSpanRefTwo = ref} onClick={this.handleDropDownBSpanClickTwo}> {this.props.recipe_id ? this.props.recipeList.length > 0 && (find(this.props.recipeList, {id: this.props.recipe_id})).title : 'Select Recipe'}</span>
                                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowBRefTwo = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none',zIndex: '3'}} >
                                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                                {
                                                                    this.props.recipeList.map((recipe) => {
                                                                        return <li key={recipe.id} onClick={(e)=> {this.setRecipe(recipe)}} className={this.props.recipe_id && recipe.id === this.props.recipe_id ? 'selectedItem' : ''}>{recipe.title}</li>;
                                                                    })
                                                                }
                                                            </Scrollbars>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/*..........*/}
                                    <div className="dropSegmentation_section" style={{height: '145px'}}>
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Set Priority</h3>
                                        </div>


                                        <div className="insightCamp_weightOut">
                                            <ul className="clearfix">
                                                <li className= {this.props.editData.priority && this.props.editData.priority == 1 ? 'active':''}>
                                                    <div className="insightCamp_weightInn">
                                                        <em>Lowest</em>
                                                        <label><input name="priority" type="radio" onChange={() => this.handlePriority(1)} /> </label>
                                                    </div>
                                                </li>
                                                <li className= {this.props.editData.priority && this.props.editData.priority == 2 ? 'active':''}>
                                                    <div className="insightCamp_weightInn">
                                                        <em>Low</em>
                                                        <label><input name="priority" type="radio" onChange={() => this.handlePriority(2)} /> </label>
                                                    </div>
                                                </li>
                                                <li className= {this.props.editData.priority && this.props.editData.priority == 3 ? 'active':!this.props.editData.priority?'active':''}>
                                                    <div className="insightCamp_weightInn">
                                                        <em>Normal</em>
                                                        <label><input name="priority" type="radio" onChange={() => this.handlePriority(3)} /> </label>
                                                    </div>
                                                </li>
                                                <li className= {this.props.editData.priority && this.props.editData.priority == 4 ? 'active':''}>
                                                    <div className="insightCamp_weightInn">
                                                        <em>High</em>
                                                        <label><input name="priority" type="radio" onChange={() => this.handlePriority(4)} /> </label>
                                                    </div>
                                                </li>
                                                <li className= {this.props.editData.priority && this.props.editData.priority == 5 ? 'active':''}>
                                                    <div className="insightCamp_weightInn">
                                                        <em>Highest</em>
                                                        <label><input name="priority" type="radio" onChange={() => this.handlePriority(5)} /> </label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>


                                    </div>
                                    {/*..........*/}

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Sites</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>

                                                            <MultiSelectReact options={this.state.quickboards} optionClicked={this.optionClicked} selectedBadgeClicked={this.selectedBadgeClicked}
                                                                              selectedOptionsStyles={selectedOptionsStyles} optionsListStyles={optionsListStyles} />
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Description</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li className="voucherDesc">
                                                            <div className="segmentInput ">
                                                                <textarea placeholder="Description..." onChange={(e)=>{this.setKeyValue('description', e.target.value)}} value={this.props.description}></textarea>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Upload Offer Image</h3>
                                        </div>
                                        <div className="stateSegmentation" style={{padding:"25px 16px 44px"}}>

                                            <div className="dropSegmentation_section">
                                                <div className="dropSegmentation_heading clearfix">
                                                    <h3>Aspect Ratio</h3>
                                                </div>
                                                <div className="stateSegmentation primary_voucher_setting">
                                                    <div className="venueIdentification_section">
                                                        <div className="venueIdentification_form">
                                                            <ul>
                                                                <li>
                                                                    <div className="customInput_div">
                                                                        <div className="placeholder_radio_column" style={{width: '30%'}}>
                                                                            <div className="radio_button">
                                                                                <input id="test_0" name="radio-group" type="radio"
                                                                                       checked={this.state.aspectRatio == 0?'checked':''}
                                                                                       onChange={(e) => { this.handleAspectRatio(e, 0) }}
                                                                                />
                                                                                <label htmlFor="test_0">Custom</label>
                                                                            </div>
                                                                        </div><div className="placeholder_radio_column" style={{width: '30%'}}>
                                                                            <div className="radio_button">
                                                                                <input id="test_2" name="radio-group" type="radio"
                                                                                       checked={this.state.aspectRatio == 2?'checked':''}
                                                                                       onChange={(e) => { this.handleAspectRatio(e, 2/1) }}
                                                                                />
                                                                                <label htmlFor="test_2">2:1</label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="placeholder_radio_column" style={{width: '30%'}}>
                                                                            <div className="radio_button">
                                                                                <input id="test_1" name="radio-group" type="radio"
                                                                                       checked={this.state.aspectRatio == 1?'checked':''}
                                                                                       onChange={(e) => { this.handleAspectRatio(e, 1) }}
                                                                                />
                                                                                <label htmlFor="test_1">1:1</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="compaignDescription_outer   clearfix">
                                                <div className="importBulk">
                                                    <div className="image_notify_upload_area image_notify_upload_area_area2" style={{border: '0px', background: `url(${BaseUrl}/assets/images/bulkDrop.png) no-repeat center`, backgroundSize: 'contain'}}>
                                                        <input type="file" onChange={this.onSelectFile} />
                                                    </div>
                                                    <ImageCropping key={new Date().toLocaleTimeString()} aspect={this.state.aspectRatio}  src={this.state.src}  setCanvas={this.setCanvas} image={this.props.editData.image}
                                                                   cropingDivStyle={{width: '21%', height: '200px', float: 'left'}}
                                                                   previewStyle={{width: '45%', maxHeight: '350px', float: 'left', marginLeft: '30px',marginTop:'12px'}}
                                                                   previewImgStyle={{height: '230px'}}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section" style={{marginTop:"35px"}}>
                                        <ul>
                                            <li>
                                                <div className="dropSegmentation_heading clearfix">
                                                    <h3>Upload Video</h3>
                                                </div>
                                                <div className="image_notify_upload_area image_notify_upload_area1" data-resource="" style={{width:"98%", marginLeft:"5px",marginRight:"10px", marginTop:"10px", background: this.state.video ? 'none' : `rgba(0, 0, 0, 0) url(${BaseUrl}/assets/images/bulkDrop.png)  no-repeat scroll center center / contain`, backgroundSize: this.state.video ? 'cover' : '100%'}}>
                                                    <UploadFileDropZone imageCss="" dropZoneSelector={'.image_notify_upload_area1'} uploadsPath={BaseUrl + '/api/upload-file-recipe'} setFilename={this.setFilename}
                                                                        acceptedFileTypes={'video/*'} fileName={this.state.video}
                                                                        previewStatus={false}/>
                                                    {
                                                        this.state.video &&
                                                        (
                                                            <div
                                                                className="dz-preview dz-processing dz-image-preview dz-success dz-complete custom-Dz">
                                                                <div className="dz-details">
                                                                    <video controls className="video" width="230" height="230" src={BaseUrl+'/'+this.state.video} style={{width: "35%"}}></video>
                                                                </div>

                                                                <div className="dz-error-message">
                                                                    <span data-dz-errormessage="true"></span>
                                                                </div>
                                                                <a className="dz-remove ddZRemove"  style={{cursor:'pointer'}} data-dz-remove="" onClick={this.removeUploadedFile}>Remove file</a>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>

                    <br/>
                    <div className="continueCancel  listShops">
                        <a  style={{cursor:'pointer'}} className="" onClick={this.saveData}>Save</a>
                        <a  style={{cursor:'pointer'}} className="close_punch_popup" onClick={() => {this.redirectToListing()}}>CANCEL</a>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of AddPunchCard.

const mapStateToProps = (state)=> ({...selectFormData(state.recipeOffer)});
export default connect(mapStateToProps)(AddOffer);