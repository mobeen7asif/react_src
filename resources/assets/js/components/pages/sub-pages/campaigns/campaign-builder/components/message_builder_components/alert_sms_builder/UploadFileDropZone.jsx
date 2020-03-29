import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DropzoneComponent from 'react-dropzone-component';
import ReactDOMServer from 'react-dom/server';
import {NotificationManager} from "react-notifications";

class UploadFileDropZone extends Component {
    constructor(props) {
        super(props);
        this.fileName           = this.props.fileName;
        this.getComponentConfig = this.getComponentConfig.bind(this);
        this.getDsConfig        = this.getDsConfig.bind(this);
        this.getEventHandlers   = this.getEventHandlers.bind(this);
    }//..... end of constructor() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <DropzoneComponent config={this.getComponentConfig()} djsConfig={this.getDsConfig()} eventHandlers={this.getEventHandlers()}/>
        );
    }//..... end of render() .....//

    getDsConfig() {
        let accessToken = null;
        let userData = localStorage.getItem('userData');
        if (userData) {
            userData = JSON.parse(userData);
            if (Object.keys(userData).length > 0)
                accessToken = userData.access_token;
        }//..... end if() .....//

       return {
            addRemoveLinks: true,
           params   : {},
           acceptedFiles:this.props.acceptedFileTypes ? this.props.acceptedFileTypes : '*',
            previewTemplate: ReactDOMServer.renderToStaticMarkup (
                <div className="dz-preview dz-file-preview dz-previewDefaultHtml">
                    <div className="dz-details">
                        <img data-dz-thumbnail="true" className={'droppedImagePreview'} style={ (this.props.imageCss) ? this.props.imageCss : {width: '70%', marginLeft: '14%'}}/>
                    </div>
                    <div className="dz-progress"><span className="dz-upload" data-dz-uploadprogress="true"></span></div>
                    <div className="dz-error-message"><span data-dz-errormessage="true"></span></div>
                </div>),
           headers: {
               'Accept': 'application/json',
               'Authorization': 'Bearer '+ accessToken
           }
        };
    }//...... end of getDsConfig() ......//

    getComponentConfig() {
        return {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: false,
            uploadMultiple:false,
            dropzoneSelector: (this.props.dropZoneSelector) ? this.props.dropZoneSelector : '.image_notify_upload_area',
            postUrl: this.props.uploadsPath
        };
    }//..... end of getComponentConfig() .....//

    getEventHandlers() {
        let $this = this;

        return {
            element: null,
            init: function(dzObject) {
                    this.element = dzObject.element;
                },
            error: function(file) {
                document.querySelector('.dz-preview').remove();
                if ($this.props.defaultCss) {
                    Object.keys($this.props.defaultCss).map((key) => {
                        return this.element[key] = $this.props.defaultCss[key];
                    })
                } else {
                    this.element.style.background = 'url(../assets/images/imgUploadAreaBG.png) no-repeat center center';
                    this.element.style.backgroundSize = 'cover';
                }//..... end if() .....//

                $this.props.setFilename("");
                NotificationManager.error('File could not be uploaded.', 'Error');
                },
            addedfile: function(file) {
                show_loader();
                this.element.style.background = 'none';
            },

            removedfile: function(file) {
                show_loader();
                axios.get(BaseUrl + '/api/remove-file/?file='+ $this.props.fileName)
                    .then((response) => {
                        show_loader();
                        if ($this.props.defaultCss) {
                            Object.keys($this.props.defaultCss).map((key) => {
                                return this.element.style[key] = $this.props.defaultCss[key];
                            })
                        } else {
                            this.element.style.background = 'url(../assets/images/imgUploadAreaBG.png) no-repeat center center';
                            this.element.style.backgroundSize = 'cover';
                        }//..... end of if-else() .....//
                        $this.props.setFilename("");
                    }).catch((err)=> {
                    show_loader();
                    NotificationManager.error('File could not be removed.', 'Error');
                });
            },
            complete: function(file) {
                show_loader();
            },
            success: function(file, success) {
                if(success == "max_size"){
                    alert("Video size should be less then or equal 20MB.");
                    return false;
                }
                $this.props.setFilename(success);
                if ($this.props.previewStatus === false) {
                    $('.dz-previewDefaultHtml').remove();
                } else {
                    let type = ((file.type).split('/')).shift();
                    if (type === 'video') {
                        let videoDev = document.querySelector('div.dz-details');
                        videoDev.innerHTML = "";
                        videoDev.innerHTML = '<video controls class="video" width="266" src="' + (BaseUrl + '/' + success) + '"></video>';
                    }//..... end of success() .....//
                }
            }
        };
    }//..... end of getEventHandlers() .....//
}//..... end of UploadFileDropZone.

UploadFileDropZone.propTypes = {};

export default UploadFileDropZone;