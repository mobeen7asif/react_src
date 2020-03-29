import React, {Component} from 'react';
import CKEditor from "react-ckeditor-component";
import {NotificationManager} from "react-notifications";
import {WithContext as ReactTags} from "react-tag-input";
const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];
class AddTermAndCondition extends Component {
    constructor(props){
        super(props);
        this.state = {
            description:'',
            tags:               [],
            type:'term_and_conditions',
            title:"Term And Condition",
            suggestions: []
        }
    }

    onChangeDescriptions = (evt) => {
        let description = evt.editor.getData();
        this.handleChange({description})
    };//..... end of onChangeDescriptions() .....//

    handleChange = (obj) => {
        this.setState(()=>(obj),()=>{
            this.validation();
        });
    };//..... end of handleChange() .....//

    validation = () => {
        if(this.state.description == "" || this.state.tags.length == 0)
            this.saveCategoryBtn.classList.add("disabled");
        else
            this.saveCategoryBtn.classList.remove("disabled");

    };//---- End of validation() ----//
    

    saveTermAndCondition = () =>{
        show_loader();
        axios.post(BaseUrl + '/api/save-term-condition',{...this.state,editId: Object.keys(this.props.aboutLoyalty).length > 0 ? this.props.aboutLoyalty.id : 0})
            .then(res => {
                show_loader();
                this.setState({vouchers:'',stampCard:''});
                NotificationManager.success(res.data.message, 'Success');
                this.props.addAboutTermAndCondition('listing');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while adding Contacts .", 'Error');
        });
    };//---- End of saveTermAndCondition() ----//
    componentDidMount = () =>{
        console.log(this.props.aboutLoyalty);
        if(this.props.aboutLoyalty.id)
            this.loadEditData();
        this.loadLocations();
    };

    loadLocations = () => {
        show_loader();
        axios.get(`${BaseUrl}/api/get-saved-locations`)
            .then(res => {
                // console.log(res.data.data);

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

    loadEditData = () =>{
        this.setState(()=>({
            description:this.props.aboutLoyalty.description,
            tags:this.props.aboutLoyalty.tags.split(","),
            editId:this.props.aboutLoyalty.id,
        }),()=>{
            this.validation();
            let location = [];
            this.state.tags.forEach(function (value,key) {
               location.push({id:value,text:value});
            });
            this.setState(()=>({tags:location}));
        });
    };

    setKeyValue = (key, value) => {
        this.setState(()=>({[key]: value}),()=>{
            this.validation();
        });

    };//..... end of setKeyValue() .....//

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

    handleDelete = (i) => {
        const { tags } = this.state;
        this.setState({
            tags: tags.filter((tag, index) => index !== i),
        }, () => {});

    }

    render() {
        const { tags, suggestions } = this.state;
        return (
            <div className="newVualt_container">
                <div className="newVualt_container_detail">

                    <div className="newVualt_detail_outer">
                        <div className="newVualt_detail">
                            <div className="newVualt_heading_with_buttons clearfix">
                                <div className="newVualt_heading">
                                    <h3>Add/Edit Term and Conditions</h3>
                                </div>
                            </div>
                            <div className="categoryInfo_container clearfix ">
                                <div className="smsDetail_inner primary_voucher_setting">

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Term And Conditions</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customPlaceholder_outer">
                                                                <h4>Descriptions</h4>
                                                                <CKEditor activeClass="p10" content={this.state.description} events={{"change": this.onChangeDescriptions}}/>
                                                            </div>
                                                        </li>

                                                        <li>
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
                                                        </li>

                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>



                                </div>
                            </div>
                        </div>
                    </div>

                    <br/>
                    <div className="continueCancel  listShops">
                        <a  style={{cursor:'pointer'}} ref={(ref)=>{this.saveCategoryBtn = ref;}} className="disabled selecCompaignBttn save_category" onClick={this.saveTermAndCondition}>Save</a>
                        <a  style={{cursor:'pointer'}} className="close_punch_popup selecCompaignBttn" onClick={() =>{this.props.addAboutTermAndCondition('listing');}}>CANCEL</a>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of addAboutTermAndCondition.

AddTermAndCondition.propTypes = {};

export default AddTermAndCondition;