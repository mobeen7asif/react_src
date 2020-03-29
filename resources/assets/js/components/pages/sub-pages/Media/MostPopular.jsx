import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NotificationManager} from "react-notifications";

class MostPopular extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:true,
            categoryValue:""
        };
        this.mediaData = [];
        this.imageCategoryId = "";
        this.categoryID = "";
        this.categoryData = [];

    }//..... end of constructor() .....//

    cancelImage = () => {
        this.closepopup();
    };

    componentDidUpdate = (prevProps,prevState) => {
        if(this.props.searchValue !== prevProps.searchValue)
            this.loadMainData();
    };

    closepopup = () =>{
        document.querySelector(".addVenueImagePopup").style.display ='none';
    };

    setTriggers = (id,value) => {
        this.dropDownUlRef.style.display = 'none';
        this.dropDownLabelRef.classList.remove('changeAero');
        this.setState({categoryValue:value});
        this.dropDownLabelRef.setAttribute("data-value",id);
    };//..... end of setTriggers() ....//

    handleDropDownSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.dropDownUlRef.style.display = (this.dropDownUlRef.style.display === 'none') ? 'block' : 'none';

    };//..... end of handleDropDownSpanClick() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    deleteImage = (id) => {
        var r = confirm("Are you sure to delete image ?");
        if (r == true) {
            show_loader();
            axios.post(BaseUrl + '/api/delete-venue-image',{'image_id':id})
                .then(res => {
                    NotificationManager.success("Image Deleted successfully.", 'success',1500);
                    show_loader();
                    axios.post(BaseUrl + '/api/get-venue-images',{'venue_id':23020})
                        .then(res => {
                            this.mediaData = res.data.venue_images;
                            this.props.activeLink('most_popular');
                            this.setState({data:!this.state.data});

                        }).catch((err) => {
                    });
                }).catch((err) => {
                NotificationManager.error("Error Occurred While deleting record.", 'Error');
                show_loader();
            });
        } else {
            return false;

        }
    };

    editImage = (id) => {
        document.getElementById("blah_image_place").style.display = "block";
        let ele = document.querySelectorAll('.image_notify_upload_area');
        for(let i=0; i< ele.length; i++ ){
            ele[i].style.display = 'none';
        }
        document.getElementById("blah_image_place").setAttribute("src","");
        document.getElementById("edit_image_id").value = id;
        axios.post(BaseUrl + '/api/edit-venue-image',{'image_id':id})
            .then(res => {
                document.querySelector(".addVenueImagePopup").style.display ='block';
                document.getElementById("image_title").value = res.data.image_title;
                document.getElementById("image_categories_span").innerText = res.data.title;
                document.getElementById("image_categories_span").setAttribute("data-value",res.data.category_id);
                this.imageCategoryId = res.data.category_id;
                $(".image_tags_amp").find("ul").remove();
                $('.tag-editor').remove();
                $('#tags').tagEditor({
                    initialTags: res.data.tag,
                    delimiter: ', ',
                    placeholder: 'Enter tags ...'
                });
                const image = "https://generalstoragemax.s3.ap-southeast-2.amazonaws.com/generalstoragemax/"+res.data.path;
                document.getElementById("blah_image_place").setAttribute("src",image);
            }).catch((err) => {
            NotificationManager.error("Error occurred while getting selected venue data .", 'Error');
        });

    };


    componentDidMount = () => {
        axios.post(BaseUrl + '/api/get-image-categories',{'venue_id':23020,search:''})
            .then(res => {
                this.categoryData = res.data;
                this.setState({loadData:!this.state.loadData});
            }).catch((err) => {
            NotificationManager.error("Error occurred while getting image categories .", 'Error');
        });
        let $this = this;
        $this.loadMainData();

        $(document).on('change', 'div.image_notify_upload_area input:file', function () {
            $this.readURL(this);
        });
    };

    saveImageData = () => {
        let catID = document.getElementById("image_categories_span").getAttribute("data-value");
        this.categoryID = catID;
        var edit_image_id = document.getElementById("edit_image_id").value;
        var image_title = document.getElementById("image_title").value;
        var tag = $('#tags').tagEditor('getTags')[0].tags ;
        var venue_id = 23020;
        /*if($this.imageCategoryId == ''){
            alert("Select Image Category");return false;
        }*/
        if(image_title.trim() == ''){
            alert("Enter Image Title");return false;
        }


        if(tag == ""){
            alert("Enter Tags");return false;
        }
        let data = new FormData();
        if(edit_image_id == 0){
            var ext = $('#image').val().split('.').pop().toLowerCase();
            if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
                document.getElementById("blah_image_place").setAttribute("src","");
                document.getElementById("blah_image_place").style.display = "none";
                let elements = document.querySelectorAll('.image_notify_upload_area');
                for(let a=0; a< ele.length; a++ ){
                    elements[a].style.display = 'block';
                }
                return false;
            }
            data.append('image_title', image_title);
            data.append('tags', tag);
            data.append("select_venue", venue_id);
            data.append('image', $('#image')[0].files[0]);

        }else{
            data.append('image_title', image_title);
            data.append('tags', tag);
            data.append("select_venue", venue_id);
        }
        data.append('image_id', edit_image_id);
        data.append('category_id', this.categoryID);

        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        show_loader();
        axios.post(BaseUrl + '/api/save-media-image',data,config)
            .then(res => {
                document.getElementById("blah_image_place").style.display = "block";
                document.getElementById("image_title").value = "";
                document.getElementById("tags").value = "";
                document.getElementById("blah_image_place").setAttribute("src","");
                $('.tag-editor').remove();
                let ele = document.querySelectorAll('.image_notify_upload_area');
                for(let i=0; i< ele.length; i++ ){
                    ele[i].style.display = 'block';
                }
                document.getElementById("blah_image_place").style.display = "none";
                document.getElementById("image").value = "";
                this.imageCategoryId = "";
                this.closepopup();
                if(edit_image_id === 0){
                    NotificationManager.success("Image saved successfully", 'Success',1500);
                    this.categoryID = "";
                    show_loader();
                }else{
                    this.categoryID = "";
                    NotificationManager.success("Record updated successfully", 'Success',1500);
                    show_loader();
                }

                axios.post(BaseUrl + '/api/get-venue-images',{'venue_id':venue_id})
                    .then(res => {
                        this.mediaData = res.data.venue_images;
                        this.props.activeLink('most_popular');

                    }).catch((err) => {
                    NotificationManager.error("Error occurred while getting venue images .", 'Error');
                });
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error Occurred While saving record.", 'Error');
        });
    };

    loadMainData = () => {
        let venue_id = 23020;
        axios.post(BaseUrl + '/api/get-venue-images',{'venue_id':venue_id,search:this.props.searchValue})
            .then(res => {
                this.mediaData = res.data.venue_images;
                this.setState({data: !this.state.data});

            }).catch((err) => {
            NotificationManager.error("Error occurred while getting venue images .", 'Error');
        });
    };

     readURL = (input) => {
         var file;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            var img = new Image();
            reader.onload = function (e) {

                file = input.files[0];

                let ele = document.querySelectorAll('.image_notify_upload_area');
                for(let i=0; i< ele.length; i++ ){
                    ele[i].style.display = 'none';
                }
                //$('.image_notify_upload_area').hide();
                //$('#blah_image_place').show();
                document.getElementById("blah_image_place").style.display = "block";
                document.getElementById("blah_image_place").setAttribute("src",e.target.result);
                //$('#blah_image_place').attr('src', e.target.result);
                var image = new Image();
                image.src = e.target.result;
                image.onload = function () {
                    var height = this.height;
                    var width = this.width;
                    var maxWidth = 300;
                    var maxHeight = 900;
                    var ratioW = maxWidth / width;
                    var ratioH = maxHeight / height;
                    document.getElementById("blah_image_place").setAttribute("style","");
                    document.getElementById("blah_image_place").setAttribute("style","width:"+maxWidth+"; height:"+height * ratioW+"; display:block; margin:0px auto;");
                };
            }
            reader.readAsDataURL(input.files[0]);
        }
    };

    render() {
        return (
            <React.Fragment>
                <div className="media_galery_section">
                    <div className="media_galery_heading">
                        <h3>Most Popular</h3>
                    </div>

                    <div className="media_galery_listing">
                        <ul>
                            {this.mediaData.length > 0 && (
                                this.mediaData.map((value,key)=>{
                                    return (
                                        <li key={key}>
                                            <div className="media_galery_pic">
                                                <span><img src={"https://generalstoragemax.s3.ap-southeast-2.amazonaws.com/generalstoragemax/"+value.path} alt="#" /></span>
                                                <div className="media_galery_slide_info">
                                                    <label>{value.title}</label>
                                                    <div className="img_edit_delete">
                                                        <a  style={{cursor:'pointer'}} className='delete_image'  image_id={value.id} onClick={(e)=> {this.deleteImage(value.id);}} >Delete</a>
                                                        <a  style={{cursor:'pointer'}} className="edit_image"  image_id={value.id} onClick={(e)=>{this.editImage(value.id);}}>Edit</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                            )}


                        </ul>
                    </div>


                    <div className="showAll_bttn">
                        <a  style={{cursor:'pointer'}}>SHOW ALL</a>
                    </div>
                </div>



                <div className="popups_outer addPic_popup addVenueImagePopup">
                    <div className="popups_inner">
                        <div className="overley_popup"></div>

                        <div className="popupDiv">
                            <div className="popupDiv_detail">

                                <div className="popup_heading clearfix">
                                    <h3>UPLOAD IMAGE</h3>
                                    <a  style={{cursor:'pointer'}} className="popupClose cancel_popular_image" onClick={this.cancelImage}>&nbsp;</a>
                                </div>


                                <div className="beacon_popupDeatail">
                                    <div className="beacon_popup_form">
                                        <div className="popup_upload_img addImg_place">
                                            <div className="image_notify_upload_area">
                                                <input name="image" id="image" type="file" />
                                                <input name="edit_image_id" id="edit_image_id" defaultValue="0" type="hidden" />
                                            </div>
                                            <img id="blah_image_place" className="image_venue_all" style={{display:'none', height:'300px', width:'900px'}} />
                                        </div>


                                        <div className="venueIdentification_form">
                                            <ul>
                                                <li>
                                                    <label>Image Title</label>
                                                    <div className=""><input className="customInput_div"   id="image_title" placeholder="Place holder" type="text" /></div>
                                                </li>

                                                <li>
                                                    <div className="customDropDown">
                                                    <span id="image_categories_span" ref={(ref) => this.dropDownLabelRef = ref} data-value="" onClick={this.handleDropDownSpanClick}>
                                                        {this.state.categoryValue ? this.state.categoryValue : "Select Categorys" } </span>
                                                        <ul className="customDropDown_show customPlaceHolder compaign_saturation" ref={(ref) => this.dropDownUlRef = ref} id={"image_categories_optionsss"} style={{overflow:"auto",display:"none"}}>
                                                            {this.categoryData.length > 0 && (
                                                                this.categoryData.map((value,key)=>{
                                                                    return (
                                                                        <li onClick={(e)=> {this.setTriggers(value.id,value.title)}} className={"get_category_id"} key={value.id} defaultValue={value.id}> {value.title} </li>
                                                                    );
                                                                })
                                                            )}




                                                        </ul>
                                                    </div>
                                                </li>

                                                <li>
                                                    <label>Tags</label>
                                                    <div className="image_tags_amp">
                                                        <textarea id="tags" className="tag-editor-hidden-src"></textarea>
                                                        <small>Seprate tags with comma</small>
                                                    </div>

                                                </li>


                                            </ul>
                                        </div>
                                    </div>


                                    <div className="continueCancel place_beacon">
                                        <input value="SAVE" type="submit" id="save_image_data" onClick={(e)=>{this.saveImageData();}} />
                                        <a  style={{cursor:'pointer'}} className="cancel_popular_image" onClick={this.cancelImage}>CANCEL</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </React.Fragment>

        );
    }//..... end of render() .....//
}//..... end of MostPopular.

MostPopular.propTypes = {};

export default MostPopular;