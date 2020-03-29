import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import DynamicCustomFields from "../venue/DynamicCustomFields";

class CustomCsvUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData:"",
            fileExtention:"",
            customFields:[],
            csvHeader:[],
            tableColumns:[],
            mappingFields:{},
            finalMappingFields:{},
            totalCount:0

        };
    }//..... end of constructor() .....//

    getTableColumns = () => {
        axios.get(BaseUrl + '/getTableColumns').then((response) => {
            this.setState(()=>({tableColumns:response.data.tableColumns}))
            show_loader(true);
        }).catch((err)=> {
            show_loader(true);

        });

    }





    componentDidMount = () => {
        this.getTableColumns();
        this.getCustomFields();
        document.getElementById("table_show").style.display = "none";
    };//..... end of componentDidMount() .....//


    handleChangeFile = (event) => {
        const file = event.target.files[0];
        let headers = this.CSVImportGetHeaders(file);

        let extention = file.name.split('.').pop().toLowerCase();

        if(extention && extention != "csv"){
            document.getElementById("fileToUpload").value = "";
            NotificationManager.error("Invalid File. Please select CSV file.", 'Error',5000);
            return false;
        }
        setTimeout(()=>{

        },1000)
        let formData = new FormData();
        formData.append('file', file);
        document.getElementById("counter_div").style.display = "none";
        document.getElementById("saveFile").style.display = "block";
        this.setState(()=>({formData,fileExtention:extention,totalCount: 0}))
    }

    CSVImportGetHeaders = (file) =>
    {
        // Get our CSV file from upload
        var file = file;

        // Instantiate a new FileReader
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend =  (evt) => {
            var data = evt.target.result;
            var byteLength = data.byteLength;
            var ui8a = new Uint8Array(data, 0);
            var headerString = '';
            // Iterate through each character in our Array
            for (var i = 0; i < byteLength; i++) {
                // Get the character for the current iteration
                var char = String.fromCharCode(ui8a[i]);

                // Check if the char is a new line
                if (char.match(/[^\r\n]+/g) !== null) {

                    // Not a new line so lets append it to our header string and keep processing
                    headerString += char;
                } else {
                    this.setState(()=>({csvHeader:headerString.split(',')}),()=>{
                        this.setDefaultMappingFields();
                    })
                    // We found a new line character, stop processing
                    break;
                }
            }

            // Split our header string into an array

            setTimeout(()=>{
                this.setState(()=>({csvHeader:headerString.split(',')}),()=>{
                    this.setDefaultMappingFields();
                })
            },1000)
        };


    }

    addMappings = (value,key) => {
        let mappingFields = {...this.state.mappingFields,[key]:value};

        this.setState(()=>({mappingFields:mappingFields}),()=>{
            this.getFinalMapping();
        });
    }

    uploadCsv = () => {

        let formData = this.state.formData;
        if((this.state.fileExtention && this.state.fileExtention != "csv") || !formData){
            document.getElementById("fileToUpload").value = "";
            NotificationManager.error("Please select CSV file.", 'Error',5000);
            return false;
        }

        if(Object.keys(this.state.finalMappingFields).length === 0 && this.state.finalMappingFields.constructor === Object){
            NotificationManager.error("Please add mapping for import.", 'Error',5000);
            return false;
        }
        formData.append('name', "name");
        formData.append('mappingFields', JSON.stringify(this.state.finalMappingFields));
        formData.append('venue_id', VenueID);
        formData.append('company_id', CompanyID);
        show_loader();
        this.getTotalCountOfUploadedRecords();
        document.getElementById("saveFile").style.display = "none";
        document.getElementById("table_show").style.display = "none";
        document.getElementById("counter_div").style.display = "block";
        axios.post(BaseUrl + '/custom_csv', this.state.formData).then((response) => {
            if(response.data.status == true) {
                NotificationManager.success(response.data.message, 'Success',5000);
                this.setState(()=>({formData:"",fileExtention:"",totalCount:response.data.count,csvHeader:[],finalMappingFields: {},mappingFields: {}}));
            }else {
                this.resetCsvCounter();
                NotificationManager.error("Error occured while uploading csv", 'Error',5000);
                this.setState(()=>({formData:""}));
            }
            document.getElementById("table_show").style.display = "inline-table";
            document.getElementById("fileToUpload").value = "";
            document.getElementById("saveFile").style.display = "none";


            show_loader(true);
        }).catch((err)=> {
            this.resetCsvCounter();
            NotificationManager.error("Error occured", 'Error',5000);
            show_loader(true);
            this.setState(()=>({formData:""}));
            document.getElementById("table_show").style.display = "inline-table";
            document.getElementById("saveFile").style.display = "block";
        });

    };//..... end of saveData() .....//

    getTotalCountOfUploadedRecords = () => {
        setTimeout(()=>{
            axios.post(BaseUrl + '/api/countTotalRecord', {}).then((response) => {
                if(response.data.status == "continue") {
                    if(this.state.totalCount != response.data.count)
                        this.setState(()=>({totalCount:response.data.count}));
                    this.getTotalCountOfUploadedRecords();
                }else{
                    this.setState(()=>({totalCount:response.data.count}));
                }
            }).catch((err)=> {
                this.resetCsvCounter();
            });

        },3000);

    }

    resetCsvCounter = () => {
        axios.post(BaseUrl + '/api/resetCsvCounter', {}).then((response) => {

        }).catch((err)=> {

        });
    }

    handleTableHeaders = (e,value) => {
        this.addMappings(e.target.value,value);
    }

    setDefaultMappingFields = () => {
        let obj = {};

        this.state.csvHeader.map((value,key)=>{
            obj[value]="none";
        });

        this.state.customFields.map((value,key)=>{
            obj[value+"__custom_fields"]="none";
        });

        this.setState(()=>({mappingFields:obj}),()=>{
            document.getElementById("table_show").style.display = "inline-table";
            this.getFinalMapping();
        })
    }

    getFinalMapping = () => {
        let final = {};
        let obj = this.state.mappingFields;
        Object.keys(obj).map((value,key)=>{
            if(obj[value] != "none")
                final[value] = obj[value];
        });
        this.setState(()=>({finalMappingFields: final}),()=>{
            //console.log("final mapping",this.state.finalMappingFields);
        })
    }

    getCustomFields = (segment_name) => {
        let memberCustomFields= JSON.parse(localStorage.getItem('memberCustomFields'));
        this.setState(()=>({customFields: memberCustomFields}));
    }


    render() {
        return (
            <div className="newVualt_container">
                <div className="newVualt_container_detail">
                    <div className="newVualt_detail_outer">
                        <div className="newVualt_detail">
                            <div className="newVualt_heading_with_buttons clearfix">
                                <div className="newVualt_heading" style={{width:"50%"}}>
                                    <h3>Upload User CSV <span style={{color:"red"}}>Under construction</span></h3>
                                </div>
                            </div>
                            <div className="categoryInfo_container clearfix ">
                                <div className="smsDetail_inner primary_voucher_setting">
                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>CSV File</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li style={{width: "50%",display: "inline-block" }}>
                                                            <div className="customInput_div">
                                                                <input id="fileToUpload" placeholder="Title..." type="file" onChange={this.handleChangeFile} value={this.state.title}/>
                                                            </div>
                                                        </li>
                                                        <li style={{width: "30%",display: "inline-block" }}>
                                                            <div id="counter_div" className="" style={{display:"none"}}>
                                                                <p style={{marginLeft:"87px"}}>Total <strong style={{fontSize:"24px"}}>{this.state.totalCount}</strong> records are dumped</p>
                                                            </div>
                                                        </li>
                                                        <li style={{width: "20%",display: "inline-block" }}>
                                                            <div className="continueCancel  listShops" id="saveFile" style={{display:"none"}}>
                                                                {/*<a  style={{cursor:'pointer'}} className="" onClick={()=>{this.uploadCsv()}}>Upload CSV</a>*/}
                                                            </div>
                                                        </li>

                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <hr />


                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <div className="compaignSaturation ">



                                                        <div style={{width:"50%",display:"inline-block",paddingLeft:"10px"}}>
                                                            <table style={{width:"100%"}} id="table_show">
                                                                <tr>
                                                                    <th style={{padding:"6px"}}>CSV Fields</th>
                                                                    <th style={{padding:"6px"}}>Table Fields</th>

                                                                </tr>
                                                                {this.state.csvHeader.map((value,key)=>{

                                                                    return (
                                                                        <tr key={"custom_key"+key}>

                                                                            <td style={{padding:"6px"}}>{value}</td>
                                                                            <td style={{padding:"6px"}}>
                                                                                <select className="customSelectBox" style={{border: "1px solid lightgray",width: "100%",height:"38px"}} onChange={(e)=>{this.handleTableHeaders(e,value)}} id="table_headers" >
                                                                                    <optgroup label="Table Fields">
                                                                                        <option key={5585432+key} value="none"  >None</option>
                                                                                        {this.state.tableColumns.map((value,key)=>{
                                                                                            if(value !="custom_fields"){
                                                                                                return(<option key={key} value={value} type="table"  >{value}</option>)
                                                                                            }
                                                                                        })}
                                                                                    </optgroup>
                                                                                    <optgroup label="Custom Fields">
                                                                                        {this.state.customFields.map((value,key)=>{
                                                                                            return (
                                                                                                <option key={key} value={value.field_name+"__custom_fields"}   >{value.field_name}</option>
                                                                                            )
                                                                                        })}

                                                                                    </optgroup>
                                                                                </select>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })}

                                                            </table>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>




                                </div>
                            </div>
                        </div>
                    </div>



                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of AddMission.

export default CustomCsvUpload;