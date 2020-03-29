import React, {Component} from 'react';
import { Droppable } from 'react-drag-and-drop';
import UploadFileDropZone from "./UploadFileDropZone";
import {connect} from "react-redux";
import {selectMessageBuilderObject} from "../../../../../../../redux/selectors/Selectors";
import {addMessageBuilderValue} from "../../../../../../../redux/actions/CampaignBuilderActions";

class VideoComponent extends Component {
    setMessage = (message) => {
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, message}}));
    };//..... end of setMessage() .....//

    onDrop = (data) => {
        let message = this.props.messageBuilder.message;

        message += "|"+data.tags+"|";

        this.setMessage(message);
    };//..... end of onDrop() .....//

    setFilename = (fileName) => {
        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, resource: fileName}}));
    };//..... end of setFilename() .....//
    setVenueName = (message) => {

        this.props.dispatch(addMessageBuilderValue({[this.props.currentChannel]: {...this.props.messageBuilder, venue_name:message}}));
    };//..... end of setVenueName() .....//
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    removeUploadedFile = () => {
        this.removeFile(this.props.messageBuilder.resource);
        this.setFilename("");
    };//..... end of removeUploadedFile() .....//

    removeFile = (fileName) => {
        axios.get(BaseUrl + '/api/remove-file/?file='+ fileName)
            .then((response) => {
                //
            }).catch((err)=> {
            //
        });
    };//..... end of removeFile() ......//

    render() {
        return (
            <div className="smsDetail_column">
                <div className="segment_heading segmentaxn_heading">
                    <h3>PRIMARY MESSAGE</h3>
                </div>
                <div className="smsDetail_inner">
                    <div className="newSegment_form">
                        <ul>
                            <li>
                                <label>SENDER</label>
                                <div className="segmentInput">
                                    <input placeholder={this.props.messageBuilder.venue_name} value={this.props.messageBuilder.venue_name} onChange={(e)=> {this.setVenueName(e.target.value)}} type="text" />
                                </div>
                            </li>
                            <li>
                                <label>Subtitle</label>
                                <div className="segmentInput segmentARea subtitleArea">
                                    <Droppable types={['tags']} onDrop={this.onDrop.bind(this)}>
                                        <textarea placeholder="Type Here" value={this.props.messageBuilder.message} onChange={(e)=> {this.setMessage(e.target.value)}}></textarea>
                                    </Droppable>
                                </div>
                            </li>
                            <li>
                                <label>UPLOAD Video</label>
                                <div className="image_notify_upload_area" data-resource="" style={{ background: this.props.messageBuilder.resource ? 'none' : `url(${BaseUrl}/assets/images/imgUploadAreaBG.png) no-repeat center center`, backgroundSize: this.props.messageBuilder.resource ? 'cover' : '100%'}}>
                                    <UploadFileDropZone dropZoneSelector={'.image_notify_upload_area'} uploadsPath={BaseUrl + '/api/upload-file'} setFilename={this.setFilename}
                                                        acceptedFileTypes={'video/*'} fileName={this.props.messageBuilder.resource}
                                                        previewStatus={false}/>
                                    {
                                        this.props.messageBuilder.resource &&
                                        (
                                            <div
                                                className="dz-preview dz-processing dz-image-preview dz-success dz-complete custom-Dz">
                                                <div className="dz-details">
                                                    <video controls className="video" width="266" src={BaseUrl+'/'+this.props.messageBuilder.resource} style={{width: "100%"}}></video>
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
        );
    }//..... end of render() .....//
}//..... end of VideoComponent.

const mapStateToProps = (state) => {
    return {
        messageBuilder  : selectMessageBuilderObject(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        currentChannel  : state.campaignBuilder.currentChannel
    };
};
export default connect(mapStateToProps)(VideoComponent);