import React, {Component} from 'react';
import ReactCrop from "react-image-crop";

class ImageCropping extends Component {
    constructor(props) {
        super(props);

        if(props.aspect){
            this.state = {
                crop: {
                    aspect: props.aspect,
                    width:50
                }
            };
        }else{
            this.state = {
                crop: {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                }
            };
        }

    }//..... end of constructor() .....//

    onImageLoaded = (image, pixelCrop) => {
        this.imageRef = image;

        // Make the library regenerate aspect crops if loading new images.
        const { crop } = this.state;

        if (crop.aspect && crop.height && crop.width) {
            this.setState({
                crop: { ...crop, height: null },
            });
        } else {
            this.onCropComplete(crop, pixelCrop);
        }
    };


    onCropComplete = (crop, pixelCrop) => {
        this.makeClientCrop(crop, pixelCrop);
        if (this.props.onCropCompleted) //..... user custom function called after cropped.
            this.props.onCropCompleted();
    };

    onCropChange = crop => {
        this.setState({ crop });
    };

    async makeClientCrop(crop, pixelCrop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                pixelCrop,
                'newFile.jpeg',
            );
            this.setState({ croppedImageUrl });
        }
    }

    getCroppedImg(image, pixelCrop, fileName) {
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
        );

        this.props.setCanvas(canvas) ;
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                blob.name = fileName;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
            }, 'image/jpeg');
        });
    }

    render() {
        return (
            <div style={this.props.mainWrapperStyle || {width: '100%', paddingTop: '20px'}}>

                {this.props.src && (
                    <div style={this.props.cropingDivStyle}>
                        <ReactCrop
                            src={this.props.src}
                            crop={this.state.crop}
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                        />
                    </div>
                )}


                <div style={this.props.previewStyle}>
                    {(this.state.croppedImageUrl || this.props.image) &&
                        <img alt="Crop" style={this.props.previewImgStyle} src={this.state.croppedImageUrl ? this.state.croppedImageUrl : this.props.image} />}
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of ImageCropping.

export default ImageCropping;