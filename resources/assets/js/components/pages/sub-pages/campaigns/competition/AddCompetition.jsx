import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import {validateCompetitionData} from "../../../../utils/Validations";
import moment from "moment";
import DatePicker from 'react-datepicker';

class AddCompetition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:          '',
            description:    '',
            editId:          0,
            start_date:   null,
            end_date:     null,
            is_unique_entry: false,
            key: 1
        };
    }//..... end of constructor() .....//

    saveData = () => {
        if (validateCompetitionData(this.state)) {
            NotificationManager.warning("Please fill all the required fields.", 'Missing Fields');
            return false;
        } else {
            show_loader();
            axios.post(BaseUrl + '/api/save-competition', {
                title:              this.state.title,
                description:        this.state.description,
                editId:             this.state.editId,
                start_date:         moment(this.state.start_date,"YYYY-MM").format('YYYY-MM-DD HH:mm:ss'),
                end_date:           moment(this.state.end_date,"YYYY-MM").format('YYYY-MM-DD HH:mm:ss'),
                is_unique_entry:    this.state.is_unique_entry,
                venue_id:           VenueID,
                company_id:         CompanyID,
                type:              this.props.type
            }).then((response) => {
                show_loader(true);
                if (response.data.status) {
                    NotificationManager.success(response.data.message, 'Success');
                    this.redirectToListing();
                } else {
                    NotificationManager.error(response.data.message, 'Error');
                }//..... end if-else() .....//
            }).catch((err)=> {
                show_loader(true);
                NotificationManager.error("Error occurred while saving competition, please try later.", 'Error');
            });
        }//..... end if-else() .....//
    };//..... end of saveData() .....//

    setKeyValue = (key, value) => {
        this.setState({[key]: value});
    };//..... end of setKeyValue() .....//

    componentDidMount() {
        if (Object.keys(this.props.editData).length > 0)
            this.loadEditData(this.props.editData);
       /* else {
            this.setState(() => ({start_date: moment()}));
        }*///..... end if() .....//
    };//..... end of componentDidMount() .....//

    loadEditData = ({id, title, description, is_unique_entry, start_date, end_date}) => {
        if (this.props.type === "edit") {
            this.setState(() => {
                return {title: title, description, is_unique_entry: !! is_unique_entry, editId: id, start_date:moment(start_date, "DD-MM-YYYY HH:mm:ss"),end_date:moment(end_date, "DD-MM-YYYY HH:mm:ss"), key: 2};
            });
        } else {
            this.setState(() => {
                return {title: title+" Copy", description, is_unique_entry: !! is_unique_entry, editId: id};
            });
        }
    };//..... end of loadEditData() .....//

    redirectToListing = () => {
        this.props.changeMainTab('competition');
    };//..... end of redirectToListing() ......//

    handleChange = (obj) => {
        this.setState(()=>(obj));
    };//..... end of handleChange() .....//


    handleChangeStartDate = (date) => {
        if(date <= this.state.end_date){
            this.setState((prevState) => ({
                start_date: date
            }));
        }else{
            this.setState((prevState) => ({
                start_date: date,
                end_date: date
            }));
        }

    };

    handleChangeEndDate = (date) => {
        this.setState((prevState) => ({
            end_date: date
        }));
    };


    handleCheckboxChange = (type) => {
        this.setState((prevState) => {
            return {[type]: !prevState[type]};
        });
    };//..... end of handleCheckboxChange() .....//

    render() {
        return (
            <div className="newVualt_container">
                <div className="newVualt_container_detail">
                    <div className="newVualt_detail_outer">
                        <div className="newVualt_detail">
                            <div className="newVualt_heading_with_buttons clearfix">
                                <div className="newVualt_heading">
                                    <h3>Add/Edit Competition</h3>
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
                                                                <textarea placeholder="Description..." onChange={(e)=>{this.setKeyValue('description', e.target.value)}} value={this.state.description}>&nbsp;</textarea>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Competition Start & End Dates</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting" style={{minHeight: '140px'}}>
                                            <div className="datePickerOuter clearfix" style={{float: 'left', width: '50%'}}>
                                                <div className="datePickerLeft" style={{width: '90%'}}>
                                                    <strong>Start Date</strong>
                                                    <div className="datePicker">
                                                        <DatePicker selected={this.state.start_date} dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm"  minDate={moment()} onChange={this.handleChangeStartDate}/>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="datePickerOuter clearfix" style={{float: 'left', width: '50%'}}>
                                                <div className="datePickerLeft" style={{width: '90%'}}>
                                                    <strong>End Date</strong>
                                                    <div className="datePicker">
                                                        <DatePicker selected={this.state.end_date} dateFormat="DD MMM YYYY HH:mm"  showTimeSelect timeFormat="HH:mm"  minDate={this.state.start_date} onChange={this.handleChangeEndDate}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Can a user enter into this competition multiple times ?</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <ul>
                                                    <li style={{marginTop: '20px'}}>
                                                        <div style={{ marginTop: '-20px'}}>
                                                           <span className="cL_rowList_number">
                                                               Allow multiple entries : <input type="checkbox" checked={this.state.is_unique_entry} onChange={() => this.handleCheckboxChange('is_unique_entry')}/>
                                                           </span>
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

                    <br/>
                    <div className="continueCancel  listShops">
                        <a  style={{cursor:'pointer'}} className="" onClick={this.saveData}>Save</a>
                        <a  style={{cursor:'pointer'}} className="close_punch_popup" onClick={() => {this.redirectToListing()}}>CANCEL</a>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of AddMission.

export default AddCompetition;