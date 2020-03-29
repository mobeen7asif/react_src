import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import DynamicCustomFields from "../venue/DynamicCustomFields";

class UploadMemberCsv extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData:"",
            fileExtention:"",

        };
    }//..... end of constructor() .....//

    saveData = () => {

        let formData = this.state.formData;
        if((this.state.fileExtention && this.state.fileExtention != "csv") || !formData){
            document.getElementById("fileToUpload").value = "";
            NotificationManager.error("Please select CSV file.", 'Error',5000);
            return false;
        }

        formData.append('name', "member");
        formData.append('venue_id', VenueID);
        formData.append('company_id', CompanyID);
        show_loader();
        document.getElementById("saveFile").style.display = "none";
        axios.post(BaseUrl + '/upload_csv', this.state.formData).then((response) => {
            if(response.data.status === true) {
                NotificationManager.success(response.data.message, 'Success',5000);
                this.setState(()=>({formData:"",fileExtention:""}));
            }else {
                NotificationManager.error(response.data.message, 'Error',5000);
                this.setState(()=>({formData:""}));
            }

            document.getElementById("fileToUpload").value = "";
            document.getElementById("saveFile").style.display = "block";


            show_loader(true);
        }).catch((err)=> {
            NotificationManager.error("Error occured", 'Error',5000);
            show_loader(true);
            this.setState(()=>({formData:""}));
            document.getElementById("saveFile").style.display = "block";
        });

    };//..... end of saveData() .....//



    componentDidMount() {


    };//..... end of componentDidMount() .....//


    handleChangeFile = (event) => {
        const file = event.target.files[0];
        let extention = file.name.split('.').pop().toLowerCase();
        console.log(extention);
        if(extention && extention != "csv"){
            document.getElementById("fileToUpload").value = "";
            NotificationManager.error("Invalid File. Please select CSV file.", 'Error',5000);
            return false;
        }

        let formData = new FormData();
        formData.append('file', file);
        this.setState(()=>({formData,fileExtention:extention}))
    }


    render() {
        return (
            <div className="newVualt_container">
                <div className="newVualt_container_detail">
                    <div className="newVualt_detail_outer">
                        <div className="newVualt_detail">
                            <div className="newVualt_heading_with_buttons clearfix">
                                <div className="newVualt_heading">
                                    <h3>Upload Member CSV</h3>
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
                                                                <input id="fileToUpload" placeholder="Title..." type="file" onChange={this.handleChangeFile} value={this.state.title}/>
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
                    <div className="continueCancel  listShops" id="saveFile">
                        <a  style={{cursor:'pointer'}} className="" onClick={this.saveData}>Save</a>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of AddMission.

export default UploadMemberCsv;