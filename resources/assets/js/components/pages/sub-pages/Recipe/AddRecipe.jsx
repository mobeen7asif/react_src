import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {NotificationManager} from "react-notifications";
import {find, trim} from 'lodash';
import TagsAutoSuggest from "../../../_partials/TagsAutoSuggest";
import {validateRecipeData} from "../../../utils/Validations";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";
import 'react-image-crop/dist/ReactCrop.css';
import ImageCropping from "../ImageCropping";
import MultiSelectReact from "multi-select-react";
import MaskedInput from 'react-maskedinput'

class AddRecipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:              '',
            description:        '',
            prep_time:          '',
            cook_time:          '',
            method:             '',
            serving:            '',
            offer_title:        '',
            offer_description:  '',
            offer_image:        '',
            image:              '',
            ingredient:         '',
            preparation:        '',
            category:           {},
            chef:           {},
            tags:               [],
            ingredients:        [],
            preparations:       [],
            categoriesList:     [],
            chefList:           [],
            suggestedTags:      [],
            editId:             0,
            is_featured:        false,
            start_date:         moment(),
            end_date:           moment(),
            defaultDate:        moment(),
            src:                null,
            quickboards:        [],
            aspectRatio:    0
        };
    }//..... end of constructor() .....//

    customDropDownBSpanRef      = null;
    chefDropDownBSpanRef      = null;
    customDropDownShowBRef      = null;
    chefDropDownShowBRef      = null;
    customDropDownASpanRef      = null;
    customDropDownShowARef      = null;
    customDropDownSSpanRef      = null;
    customDropDownShowSRef      = null;
    canvas                      = null;

    selectTag = (tag) => {
        let tags = this.state.tags;
        if (tags.indexOf(tag) > -1) {
            /*tags = tags.filter((etag) => {
             return etag !== tag;
             });*/
            return false;
        } else {
            tags.push(tag);
        }//..... end if-else() .....//
        this.setState({tags: tags});
    };//..... end of selectTag() .....//

    removeTag = (tag) => {
        let tags = this.state.tags.filter((etag) => {
            return etag !== tag;
        });
        this.setState({tags: tags});
    };//..... end of removeTag() ....//

    removeIngredient = (ing) => {
        let ingredients = this.state.ingredients.filter((eIng) => {
            return eIng.description !== ing.description;
        });
        this.setState({ingredients});
    };//..... end of removeIngredient() ....//

    removePreparation = (prep) => {
        let preparations = this.state.preparations.filter((ePrep) => {
            return ePrep.description !== prep.description;
        });
        this.setState({preparations});
    };//..... end of removePreparation() ....//

    saveData = () => {
        let selected_board = [];
        this.state.quickboards.map((value) => {
            if (value.value === true)
                selected_board.push(value.id);
        });//...... end if() .....//

        if (! this.canvas && this.state.src) {
            NotificationManager.warning("Please crop the image.", 'Image Cropping!');
            return false;
        }//..... end if() .....//

        if (validateRecipeData(this.state)) {
            NotificationManager.warning("Please fill all the required fields.", 'Missing Fields');
            return false;
        } else {
            show_loader();
            axios.post(BaseUrl + '/api/save-recipe', {
                title:          this.state.title,
                description:    this.state.description,
                prep_time:      this.state.prep_time,
                cook_time:      this.state.cook_time,
                method:         this.state.method,
                serving:        this.state.serving,
                image:          this.canvas ? this.canvas.toDataURL('image/jpeg') : null,
                category:       this.state.category,
                chef:           this.state.chef,
                tags:           this.state.tags,
                ingredients:    this.state.ingredients,
                preparations:   this.state.preparations,
                editId:         this.state.editId,
                is_featured:    this.state.is_featured,
                start_date:     moment(this.state.start_date,"YYYY-MM").format('YYYY-MM-DD'),
                end_date:       moment(this.state.end_date,"YYYY-MM").format('YYYY-MM-DD'),
                venue_id:       VenueID,
                selected_board
            }).then((response) => {
                show_loader(true);
                if (response.data.status) {
                    NotificationManager.success('Recipe saved successfully!', 'Success');
                    this.redirectToListing();
                } else {
                    NotificationManager.error(response.data.message, 'Error');
                }//..... end if-else() .....//
            }).catch((err)=> {
                show_loader(true);
                NotificationManager.error("Error occurred while saving recipe, please try later.", 'Error');
            });
        }//..... end if-else() .....//
    };//..... end of saveData() .....//

    handleDropDownBSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowBRef.style.display =  this.customDropDownShowBRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownBSpanClick() .....//

    handleChefDropDownBSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.chefDropDownShowBRef.style.display =  this.chefDropDownShowBRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownBSpanClick() .....//

    handleDropDownASpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowARef.style.display =  this.customDropDownShowARef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownASpanClick() .....//

    handleDropDownSSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowSRef.style.display =  this.customDropDownShowSRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownSSpanClick() .....//

    setCategory = (category) => {
        this.customDropDownShowBRef.style.display = 'none';
        this.customDropDownBSpanRef.classList.remove('changeAero');
        this.setState({category});
    };//..... end of setBusiness() .....//

    setChef = (chef) => {
        this.chefDropDownShowBRef.style.display = 'none';
        this.chefDropDownBSpanRef.classList.remove('changeAero');
        this.setState({chef});
    };//..... end of setBusiness() .....//

    removeFile = (key) => {
        axios.get(BaseUrl + '/api/remove-file/?file='+ this.state[key])
            .then((response) => {
                //
            }).catch((err)=> {
            //
        });
        this.setKeyValue(key, '');
    };//..... end of removeFile() ......//

    loadCategories = (loadEditConfig = false, recipe_id = 0) => {
        show_loader();
        axios.get(BaseUrl + '/api/recipe-category-list/'+recipe_id)
            .then((response) => {
                show_loader(true);
                if (response.data.status) {
                    let categoriesList = response.data.data;
                    let chefList = response.data.chefs;
                    this.setState((prevState) => {
                        return {
                            categoriesList,
                            chefList,
                            preparations    : recipe_id > 0 ? response.data.config.preparations : [],
                            ingredients     : recipe_id > 0 ? response.data.config.ingredients : [],
                            tags            : recipe_id > 0 ? response.data.config.tags : [],
                            category        : recipe_id > 0 ? find(categoriesList, prevState.category): '',
                            chef            : prevState.chef.id  ? find(chefList, prevState.chef): {}
                        };
                    });
                } else {
                    NotificationManager.warning("Could not get categories list.", 'No Data');
                }//..... end if-else() .....//
            }).catch((err)=> {
            show_loader(true);
            NotificationManager.error("Error occurred while fetching categories.", 'Error');
        });
    };//..... end of removeFile() ......//

    setKeyValue = (key, value) => {
        if (key === 'method') {
            this.customDropDownShowARef.style.display = 'none';
            this.customDropDownASpanRef.classList.remove('changeAero');
        } else if (key === 'serving') {
            this.customDropDownShowSRef.style.display = 'none';
            this.customDropDownSSpanRef.classList.remove('changeAero');
        } //..... end if() .....//

        this.setState({[key]: value});
    };//..... end of setKeyValue() .....//

    componentDidMount() {
        $('.arrow').html('&nbsp;');
        this.loadQuickBoards();
        if (Object.keys(this.props.editData).length > 0)
            this.loadEditData(this.props.editData);
        else
            this.loadCategories();
    };//..... end of componentDidMount() .....//

    loadEditData = ({id,title, description, prep_time, cook_time, method, serving, image, recipe_category_id,is_featured,start_date,end_date,selected_qb,chef_id}) => {

        (is_featured, start_date, prep_time);

        let startDate = (is_featured != 'No') ? moment(start_date,"DD-MM-YYYY") : moment();
        let endDate =   (is_featured != 'No') ? moment(end_date,"DD-MM-YYYY") : moment();


        this.setState(() => {
            return {title, description, prep_time, cook_time, method, serving, image, is_featured:is_featured,start_date:startDate,end_date:endDate, editId: id, category: {id: recipe_category_id},chef:{id:chef_id}};
        }, () => {
            this.loadCategories(true, id);
        });
    };//..... end of loadEditData() .....//

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

    redirectToListing = () => {
        this.props.changeMainTab('recipe');
    };//..... end of redirectToListing() ......//

    setIngredients = (e) => {
        if (e.key === 'Enter') {
            const str = trim(this.state.ingredient);
            let found = find(this.state.ingredients, function(o) { return o.description == str });

            this.setState((prevState) => {
                return {ingredients: str && !found ? prevState.ingredients.concat({description: prevState.ingredient}) : prevState.ingredients, ingredient: ''}
            });
        }//..... end if() .....//
    };//..... end of setIngredients() .....//

    setIngredientsOnBlur = (e) => {

        const str = trim(this.state.ingredient);
        let found = find(this.state.ingredients, function(o) { return o.description == str });

        this.setState((prevState) => {
            return {ingredients: str && !found ? prevState.ingredients.concat({description: prevState.ingredient}) : prevState.ingredients, ingredient: ''}
        });

    };//..... end of setIngredients() .....//

    setPreparations = (e) => {
        if (e.key === 'Enter') {
            const str = trim(this.state.preparation);
            let found = find(this.state.preparations, function(o) { return o.description == str });

            this.setState((prevState) => {
                return {preparations: str && !found ? prevState.preparations.concat({description: prevState.preparation}) : prevState.preparations, preparation: ''}
            });
        }//..... end if() .....//
    };//..... end of setPreparations() .....//

    setPreparationsOnBlur = (e) => {
        const str = trim(this.state.preparation);
        let found = find(this.state.preparations, function(o) { return o.description == str });

        this.setState((prevState) => {
            return {preparations: str && !found ? prevState.preparations.concat({description: prevState.preparation}) : prevState.preparations, preparation: ''}
        });
    };//..... end of setPreparations() .....//

    setPreparation = (e) => {
        let value = e.target.value;
        this.setState({preparation: value});
    };//..... end of setPreparation() .....//

    setIngredient = (e) => {
        let value = e.target.value;
        this.setState({ingredient: value});
    };//..... end of setIngredient() .....//

    is_featured = () => {
        this.setState((prevState)=>({is_featured: !prevState.is_featured}));
    };//..... end of is_featured() .....//

    handleDateChange = (date,key) => {
        this.setState(()=>({[key]: date}
        ),()=>{
            if(this.state.start_date > this.state.end_date){
                this.setState({end_date:this.state.start_date});
                return false;
            }
        });
    };

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
        axios.post(BaseUrl + '/api/get-quick-board',{type:"RECIPE"}).then(res => {
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

    _onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
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

        return (
            <div className="newVualt_container">
                <div className="newVualt_container_detail">

                    <div className="newVualt_detail_outer">
                        <div className="newVualt_detail">
                            <div className="newVualt_heading_with_buttons clearfix">
                                <div className="newVualt_heading">
                                    <h3>Add/Edit Recipe</h3>
                                </div>
                            </div>
                            <div className="categoryInfo_container clearfix ">
                                <div className="smsDetail_inner primary_voucher_setting">

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
                                                                <input placeholder="Title..." type="text" onChange={(e)=>{this.setKeyValue('title', e.target.value)}} value={this.state.title}/>
                                                            </div>
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
                                                                <textarea placeholder="Description..." onChange={(e)=>{this.setKeyValue('description', e.target.value)}} value={this.state.description}></textarea>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/*<div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Quick Board</h3>
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
                                    </div>*/}

                                    <div className="dropSegmentation_section" style={{height: '145px'}}>
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Is Feature Recipe</h3>
                                            <input type="checkbox" name="is_featured"  />
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li style={{marginTop: '20px'}}>
                                                            <div style={{marginTop: '-20px'}}>
                                                                 <span className="cL_rowList_number">
                                                                    Is Featured: <input type="checkbox" checked={(this.state.is_featured && this.state.is_featured!='No')?'checked':''} onChange={()=>{this.is_featured()}} />
                                                                </span>
                                                            </div>
                                                        </li>

                                                        {(this.state.is_featured && this.state.is_featured!='No')?

                                                        <li style={{display: this.state.is_featured ? 'block' : 'none',marginTop: '13px', marginLeft: '19px'}} id="dateRange">
                                                            <div className="customPlaceholder_outer">
                                                                <h4 style={{width: '22%',float: "left"}}>Start Date</h4>
                                                                <h4 style={{width: '78%',float: "left"}}>End Date</h4>

                                                            </div>
                                                            <span style={{float: 'left', paddingRight: '36px', height: '24px', padding: '5px 9px',marginRight: '30px', background: 'lightgray'}}>
                                                                    <DatePicker
                                                                        dateFormat="DD-MM-YYYY"
                                                                        placeholderText="select start date"
                                                                        peekNextMonth
                                                                        showMonthDropdown
                                                                        showYearDropdown
                                                                        dropdownMode="select"
                                                                        minDate={this.state.defaultDate}
                                                                        selected={this.state.start_date}
                                                                        onChange={(date) =>{this.handleDateChange(date, 'start_date')}}
                                                                    />
                                                                </span>

                                                            <span style={{float: 'left', paddingRight: '36px', height: '24px', padding: '5px 9px',marginRight: '30px', background: 'lightgray'}}>
                                                                    <DatePicker
                                                                        dateFormat="DD-MM-YYYY"
                                                                        placeholderText="select end date"
                                                                        peekNextMonth
                                                                        showMonthDropdown
                                                                        showYearDropdown
                                                                        dropdownMode="select"
                                                                        minDate={this.state.start_date}
                                                                        selected={this.state.end_date}
                                                                        onChange={(date) =>{this.handleDateChange(date, 'end_date')}}
                                                                    />
                                                                </span>
                                                        </li>:null}

                                                    </ul>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Preparation Time in Minutes</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input placeholder="Preparation time..." maxLength="3" name="prep_time" className="numeric" type="text" onChange={(e)=>{this.setKeyValue('prep_time', e.target.value)}} value={this.state.prep_time}/>
                                                                {/*<input  maxLength="3"  name="display_order" className="numeric" id="display_order"  placeholder="Enter title ...." value={this.state.prep_time} onChange={(e)=>{this.setKeyValue('prep_time', e.target.value)}} type="text" />
                                                                <MaskedInput mask="11 \: 11" name="prep_time" size="20" value={this.state.prep_time} onChange={this._onChange}/>*/}
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Cooking Time in Minutes</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input placeholder="Cooking time..." type="text" maxLength="3" className="numeric" onChange={(e)=>{this.setKeyValue('cook_time', e.target.value)}} value={this.state.cook_time}/>
                                                                {/*<MaskedInput mask="11 \: 11" name="cook_time" size="20" value={this.state.cook_time} onChange={this._onChange}/>*/}
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Preparation Method</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <div className="customDropDown">
                                                        <span  ref={ref => this.customDropDownASpanRef = ref} onClick={this.handleDropDownASpanClick}> {this.state.method ? this.state.method : 'Select Method'}</span>
                                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowARef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none',zIndex: '3'}} >
                                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                                {
                                                                    ['Beginner', 'Easy', 'Normal', 'Hard', 'Expert'].map((method) => {
                                                                        return <li key={method} onClick={(e)=> {this.setKeyValue('method', method)}} className={method === this.state.method ? 'selectedItem' : ''}>{method}</li>;
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
                                            <h3>Serving size</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <div className="customDropDown">
                                                        <span  ref={ref => this.customDropDownSSpanRef = ref} onClick={this.handleDropDownSSpanClick}> {this.state.serving ? this.state.serving : 'Select Serving size'}</span>
                                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowSRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none',zIndex: '3'}} >
                                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                                {
                                                                    (Array(10).fill(1).map((x, y) => x + y)).map((size) => {
                                                                        return <li key={size} onClick={(e)=> {this.setKeyValue('serving', size)}} className={size == this.state.serving ? 'selectedItem' : ''}>{size}</li>;
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
                                            <h3>Category</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <div className="customDropDown">
                                                        <span  ref={ref => this.customDropDownBSpanRef = ref} onClick={this.handleDropDownBSpanClick}> {this.state.category.title ? this.state.category.title : 'Select Category'}</span>
                                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowBRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none',zIndex: '3'}} >
                                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                                {
                                                                    this.state.categoriesList.map((category) => {
                                                                        return <li key={category.id} onClick={(e)=> {this.setCategory(category)}} className={this.state.category.id && category.id === this.state.category.id ? 'selectedItem' : ''}>{category.title}</li>;
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
                                            <h3>Select Chef</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <div className="customDropDown">
                                                        <span  ref={ref => this.chefDropDownBSpanRef = ref} onClick={this.handleChefDropDownBSpanClick}> {(this.state.chef && this.state.chef.first_name) ? this.state.chef.first_name+" "+this.state.chef.last_name : 'Select Chef'}</span>
                                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.chefDropDownShowBRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none',zIndex: '3'}} >
                                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                                {

                                                                    this.state.chefList.map((chef) => {
                                                                        return <li key={chef.id} onClick={(e)=> {this.setChef(chef)}} className={((this.state.chef && this.state.chef.id) && chef.id === this.state.chef.id) ? 'selectedItem' : ''}>{chef.first_name + " " + chef.last_name}</li>;
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
                                            <h3>Tags</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <div className="customDropDown">
                                                        <TagsAutoSuggest selectTag={this.selectTag} suggestedTags={this.state.suggestedTags}/>
                                                    </div>
                                                    <div className="customDropDown" style={{marginTop: '15px', height: 'auto'}}>
                                                        <div className="showTags clearfix">
                                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                                {this.state.tags.map((tag) => {
                                                                    return <a  style={{cursor:'pointer'}} key={tag} onClick={(e) => {this.removeTag(tag)}}>{tag}<i>&nbsp;</i></a>
                                                                })}
                                                            </Scrollbars>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Ingredients</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input placeholder="Ingredients..." type="text" onBlur={(e)=>{this.setIngredientsOnBlur(e, e.target.value)}} onKeyPress={(e)=>{this.setIngredients(e, e.target.value)}} onChange={this.setIngredient} value={this.state.ingredient} />
                                                            </div>
                                                        </li>
                                                    </ul>
                                                    <div className="customDropDown" style={{marginTop: '15px', height: 'auto'}}>
                                                        <div className="showTags clearfix">
                                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                                {this.state.ingredients.map((ing, key) => {
                                                                    return <a  style={{cursor:'pointer'}} key={key} onClick={(e) => {this.removeIngredient(ing)}}>{ing.description}<i>&nbsp;</i></a>
                                                                })}
                                                            </Scrollbars>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Preparations Description</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input placeholder="Preparations description..." type="text" onKeyPress={(e)=>{this.setPreparations(e, e.target.value)}} onBlur={(e)=>{this.setPreparationsOnBlur(e, e.target.value)}} onChange={this.setPreparation} value={this.state.preparation} />
                                                            </div>
                                                        </li>
                                                    </ul>
                                                    <div className="customDropDown" style={{marginTop: '15px', height: 'auto'}}>
                                                        <div className="showTags clearfix">
                                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                                {this.state.preparations.map((ing, key) => {
                                                                    return <a  style={{cursor:'pointer'}} key={key} onClick={(e) => {this.removePreparation(ing)}}>{ing.description}<i>&nbsp;</i></a>
                                                                })}
                                                            </Scrollbars>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Upload Recipe Image</h3>
                                        </div>
                                        <div className="stateSegmentation">

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
                                                </div>
                                                <ImageCropping key={new Date().toLocaleTimeString()} src={this.state.src} aspect={this.state.aspectRatio} setCanvas={this.setCanvas} image={this.state.image}
                                                               cropingDivStyle={{width: '50%', height: '400px', float: 'left'}}
                                                               previewStyle={{width: '45%', maxHeight: '350px', float: 'left', marginLeft: '30px'}}
                                                               previewImgStyle={{height: '300px',width:'300px'}}/>

                                            </div>

                                        </div>
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

    export default AddRecipe;