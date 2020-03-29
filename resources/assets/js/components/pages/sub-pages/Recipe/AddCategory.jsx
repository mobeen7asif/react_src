import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";

class AddCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:  '',
            editId: 0
        };
    }//..... end of constructor() .....//

    saveData = () => {
        if (this.state.title === '') {
            NotificationManager.warning("Please fill all the required fields.", 'Missing Fields');
            return false;
        } else {
            show_loader();
            axios.post(BaseUrl + '/api/save-recipe-category', {
                title:   this.state.title,
                editId:  this.state.editId
            }).then((response) => {
                show_loader(true);
                if (response.data.status) {
                    NotificationManager.success('Category saved successfully!', 'Success');
                    this.redirectToListing();
                } else {
                    NotificationManager.error(response.data.message, 'Error');
                }//..... end if-else() .....//
            }).catch((err)=> {
                show_loader(true);
                NotificationManager.error("Error occurred while saving category, please try later.", 'Error');
            });
        }//..... end if-else() .....//
    };//..... end of saveData() .....//

    setKeyValue = (key, value) => {
        this.setState({[key]: value});
    };//..... end of setKeyValue() .....//

    componentDidMount() {
        if (Object.keys(this.props.editData).length > 0)
            this.loadEditData(this.props.editData);
    };//..... end of componentDidMount() .....//

    loadEditData = ({id,title}) => {
        this.setState(() => {
            return {title, editId: id};
        });
    };//..... end of loadEditData() .....//

    redirectToListing = () => {
        this.props.changeMainTab('category');
    };//..... end of redirectToListing() ......//

    render() {
        return (
            <div className="newVualt_container">
                <div className="newVualt_container_detail">

                    <div className="newVualt_detail_outer">
                        <div className="newVualt_detail">
                            <div className="newVualt_heading_with_buttons clearfix">
                                <div className="newVualt_heading">
                                    <h3>Add/Edit Category</h3>
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

export default AddCategory;