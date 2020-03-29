import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MediaLinks from "./sub-pages/Media/MediaLinks";
import MostPopular from "./sub-pages/Media/MostPopular";
import ImageCategories from "./sub-pages/Media/ImageCategories";
import {NotificationManager} from "react-notifications";

class Media extends Component {
    dropDownLabelRef     = null;
    dropDownUlRef        = null;
    constructor(props) {
        super(props);
        this.state = {
            page:"most_popular",
            categoryValue:"",
            search:""
        };
        this.categoryData = [];


    }//..... end of constructor() .....//


    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    loadPage = () => {
        if(this.state.page=="most_popular")
            return <MostPopular  activeLink={this.activeLink} searchValue={this.state.search} />
        else
            return <ImageCategories />
    };


    activeLink = (value) => {
        this.setState({page:value});
    };
    addVenueImage = () => {
        $('.image_venue_all').hide();
        $('.image_notify_upload_area').show();
        document.getElementById("image_title").value = '';
        document.getElementById("tags").value = '';
        document.getElementById("image").value = '';
        document.querySelector(".addVenueImagePopup").style.display ='block';
        $('#blah_image_place').attr('src', '');
        $('#image_title').val("");
        $(".image_tags_amp").find("ul").remove();
        $('.tag-editor').remove();
        $('#tags').tagEditor({
            initialTags: [],
            delimiter: ', ',
            placeholder: 'Enter tags ...'
        });
    };

    handleSearch = (e) => {
      this.setState({search: e.target.value});
    };

    render(){

        return (
            <React.Fragment>
                <div className="contentDetail">

                    <div className="autoContent">

                        <div className="compaignHeadigs">
                            <h1>Image Libraries</h1>
                            <p>Choose one or more libraries to search</p>
                        </div>


                        <div className="media_container">

                            <div className="media_search">
                                <input type="search" className={"SearchBox"} defaultValue="" onChange={this.handleSearch} placeholder="Search" />
                            </div>
                            <MediaLinks pageName={ this.state.page } activeLink = {this.activeLink} addVenueImage={this.addVenueImage} />

                            {
                                this.loadPage()
                            }


                        </div>

                    </div>
                </div>







            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of Media.

Media.propTypes = {};

export default Media;