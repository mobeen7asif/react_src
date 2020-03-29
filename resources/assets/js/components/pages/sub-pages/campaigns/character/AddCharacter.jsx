import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import {validateCharacterData} from "../../../../utils/Validations";
import ImageCropping from "../../ImageCropping";
import UploadFileDropZone
    from "../campaign-builder/components/message_builder_components/alert_sms_builder/UploadFileDropZone";

class AddCharacter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:          '',
            description:    '',
            unique_title:   '',
           /* gray_image:     '',
            color_image:    '',*/
            editId:          0,
         /*   src:          null,
            src2:         null,
            video:        null*/
        };
    }//..... end of constructor() .....//

   /* canvas  = null;
    canvas2  = null;*/

    saveData = () => {
        /*if (! this.canvas && this.state.src) {
            NotificationManager.warning("Please crop the image.", 'Image Cropping!');
            return false;
        }*///..... end if() .....//

        /*if (! this.canvas2 && this.state.src2) {
            NotificationManager.warning("Please crop the image.", 'Image Cropping!');
            return false;
        }*///..... end if() .....//

        /*if (! this.state.video) {
            NotificationManager.warning("Please select a video.", 'Video missing !');
            return false;
        }*///..... end if() .....//

        if (validateCharacterData(this.state)) {
            NotificationManager.warning("Please fill all the required fields.", 'Missing Fields');
            return false;
        } else {
            show_loader();
            axios.post(BaseUrl + '/api/save-character', {
                title:        this.state.title,
                description:  this.state.description,
                /*gray_image:   this.canvas ? this.canvas.toDataURL('image/jpeg') : null,
                color_image:  this.canvas2 ? this.canvas2.toDataURL('image/jpeg') : null,
                video:        this.state.video,*/
                unique_title: this.state.unique_title,
                editId:       this.state.editId,
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
                NotificationManager.error("Error occurred while saving character, please try later.", 'Error');
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

    loadEditData = ({id, title, description, unique_title}) => {
        this.setState(() => {
            return {title, description, unique_title, editId: id};
        });
    };//..... end of loadEditData() .....//

    redirectToListing = () => {
        this.props.changeMainTab('character');
    };//..... end of redirectToListing() ......//

    /*onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result }),
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };*///..... end of onSelectFile() .....//

    /*setCanvas = (canvas) => {
        this.canvas = canvas;
    };*///..... end of setCanvas() .....//

    /*onSelectFile2 = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src2: reader.result }),
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };*///..... end of onSelectFile() .....//

    /*setFilename3 = (video) => {
        this.setState({ video });
    };*/

    /*setCanvas2 = (canvas) => {
        this.canvas2 = canvas;
    };*///..... end of setCanvas() .....//

    handleChange = (obj) => {
        this.setState(()=>(obj));
    };//..... end of handleChange() .....//

    // removeUploadedFile = () => {
    //     axios.get(BaseUrl + '/api/remove-file/?file='+ this.state.video)
    //         .then((response) => {
    //             //
    //         }).catch((err)=> {
    //         //
    //     });
    //
    //     this.setFilename3('');
    // };//..... end of removeUploadedFile() .....//

    render() {
        return (
            <div className="newVualt_container">
                <div className="newVualt_container_detail">
                    <div className="newVualt_detail_outer">
                        <div className="newVualt_detail">
                            <div className="newVualt_heading_with_buttons clearfix">
                                <div className="newVualt_heading">
                                    <h3>Add/Edit Character</h3>
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
                                            <h3>Unique Name (Enter in small letters)</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input placeholder="Unique Name..." type="text" onChange={(e)=>{this.setKeyValue('unique_title', e.target.value)}} value={this.state.unique_title}/>
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

                                    {/*<div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Upload Gray Image</h3>
                                        </div>
                                        <div className="stateSegmentation">
                                            <div className="compaignDescription_outer   clearfix">
                                                <div className="importBulk">
                                                    <div className="image_notify_upload_area image_notify_upload_area_area2" style={{border: '0px', background: `url(${BaseUrl}/assets/images/bulkDrop.png) no-repeat center`, backgroundSize: 'contain'}}>
                                                        <input type="file" onChange={this.onSelectFile} />
                                                    </div>
                                                </div>
                                                <ImageCropping src={this.state.src} setCanvas={this.setCanvas} image={this.state.gray_image}
                                                               cropingDivStyle={{width: '50%', height: '400px', float: 'left'}}
                                                               previewStyle={{width: '45%', maxHeight: '350px', float: 'left', marginLeft: '30px'}}
                                                               previewImgStyle={{height: '347px'}}/>
                                            </div>
                                        </div>
                                    </div>*/}

                                    {/*<div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Upload Color Image</h3>
                                        </div>
                                        <div className="stateSegmentation">
                                            <div className="compaignDescription_outer   clearfix">
                                                <div className="importBulk">
                                                    <div className="image_notify_upload_area image_notify_upload_area_area2" style={{border: '0px', background: `url(${BaseUrl}/assets/images/bulkDrop.png) no-repeat center`, backgroundSize: 'contain'}}>
                                                        <input type="file" onChange={this.onSelectFile2} />
                                                    </div>
                                                </div>
                                                <ImageCropping src={this.state.src2} setCanvas={this.setCanvas2} image={this.state.color_image}
                                                               cropingDivStyle={{width: '50%', height: '400px', float: 'left'}}
                                                               previewStyle={{width: '45%', maxHeight: '350px', float: 'left', marginLeft: '30px'}}
                                                               previewImgStyle={{height: '347px'}}/>
                                            </div>
                                        </div>
                                    </div>*/}

                                    {/*<div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Upload Video</h3>
                                        </div>
                                        <div className="stateSegmentation">
                                            <div className="image_notify_upload_area image_notify_upload_area_area4" data-resource="" style={{ background: this.state.video ? 'none' : `url(${BaseUrl}/assets/images/bulkDrop.png) no-repeat center center`, backgroundSize: this.state.video ? 'cover' : '100%'}}>
                                                <UploadFileDropZone dropZoneSelector={'.image_notify_upload_area_area4'} uploadsPath={BaseUrl + '/api/upload-file'} setFilename={this.setFilename3}
                                                                    acceptedFileTypes={'video/*'} fileName={this.state.video}
                                                                    previewStatus={false}/>
                                                {
                                                    this.state.video &&
                                                    (
                                                        <div
                                                            className="dz-preview dz-processing dz-image-preview dz-success dz-complete custom-Dz">
                                                            <div className="dz-details">
                                                                <video controls className="video" width="266" src={BaseUrl+'/'+this.state.video} style={{width: "37%"}}></video>
                                                            </div>

                                                            <div className="dz-error-message">
                                                                <span data-dz-errormessage="true"></span>
                                                            </div>
                                                            <a className="dz-remove ddZRemove"  style={{cursor:'pointer'}} data-dz-remove="" onClick={this.removeUploadedFile}>Remove file</a>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>*/}

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
}//..... end of AddCharacter.

export default AddCharacter;