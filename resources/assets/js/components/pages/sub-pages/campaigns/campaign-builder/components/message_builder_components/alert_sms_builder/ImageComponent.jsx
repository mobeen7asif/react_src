import React, {Component} from 'react';
import { Droppable } from 'react-drag-and-drop';
import {connect} from "react-redux";
import {selectMessageBuilderObject} from "../../../../../../../redux/selectors/Selectors";
import {addMessageBuilderValue} from "../../../../../../../redux/actions/CampaignBuilderActions";
import ImageCropping from "../../../../../ImageCropping";

class ImageComponent extends Component {

    state = {src : ""};
    canvas = null;

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

    populateImage = () => {
        this.setFilename(this.canvas ? this.canvas.toDataURL('image/jpeg') : '');
    };

    render() {

        return (
            <div className="smsDetail_column">
                <div className="segment_heading segmentaxn_heading">
                    <h3>PRIMARY MESSAGE</h3>
                </div>
                <div className="smsDetail_inner clearfix">
                    <div className="newSegment_form">
                        <ul>
                            <li>
                                <label>SENDER</label>
                                <div className="segmentInput">
                                    <input placeholder={this.props.messageBuilder.venue_name} value={this.props.messageBuilder.venue_name} onChange={(e)=>{this.setVenueName(e.target.value)}} type="text" />
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
                                <label>UPLOAD Image</label>
                                <div className="image_notify_upload_area" data-resource="" style={{ background: `url(${BaseUrl}/assets/images/imgUploadAreaBG.png) no-repeat center center`, backgroundSize: '100%'}}>
                                    <input type="file" onChange={this.onSelectFile} />
                                </div>
                                <ImageCropping src={this.state.src} setCanvas={this.setCanvas} image={this.props.messageBuilder.resource}
                                               cropingDivStyle={{width: '100%', height: '210px', marginBottom: '8px'}}
                                               previewStyle={{width: '100%'}}
                                               previewImgStyle={{}}
                                               mainWrapperStyle={{width: '100%', paddingTop: '20px'}}
                                               onCropCompleted={this.populateImage}
                                />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of ImageComponent.

const mapStateToProps = (state) => {
    return {
        messageBuilder  : selectMessageBuilderObject(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        currentChannel  : state.campaignBuilder.currentChannel
    };
};

export default connect(mapStateToProps)(ImageComponent);