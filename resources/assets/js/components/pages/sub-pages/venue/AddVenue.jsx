import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import ImageCropping from "../ImageCropping";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";

const API_KEY = "AIzaSyAYASghdOLQGkvUqVC5XsHKwCdlZL6F1Cc";

class AddVenue extends Component {
    saveVenueBtn = null;
    canvas = null;

    constructor(props) {
        super(props);
        this.state = {

            is_edit: 0,
            venue_location: "",
            venue_name: "",
            assign_shops: [],
            address: '',
            level: 1,
            company_level: [],
            selected_bussiness_id: 0,
            image: "",
            listAllCategories: [],
            listCategories: [],
            assignedCategories: [],
            src: null,
            venueLatitude: '',
            venueLongitude: '',
            email: '',
            radius: '',
            search: ''

        };
    }//..... end of constructor() .....//

    componentWillMount = () => {

        if (!venueSettings) {


            this.getCategories();
            //this.getCompanyLevelData();
        }
    };

    componentWillUnmount = () => {
        $("body").find('#fileToUpload').off('change');
        $("body").find('#fileToUpload').unbind('change.mynamespace');
    };

    readURL = (input) => {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                // $('.image_notify_upload_area').hide();
                $('#blah').show();
                $('#blah').attr('src', e.target.result);
                var image = new Image();
                image.src = e.target.result;
                image.onload = function () {
                    var maxWidth = 300;
                    var maxHeight = 150;
                    $('#blah').css("height", maxHeight);
                    $('#blah').css("width", maxWidth);
                    $('#blah').attr('src', image.src);
                    $('#blah').css("display", 'block');
                    $('#blah').css("margin", 'auto');
                };
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    componentDidMount = () => {

        let $this = this;
        $("body").on("change", "#fileToUpload", function (e) {
            $this.readURL(this);
            $this.validation();
        });
        if (this.props.getEditVenueID != 0) {
            this.saveVenueBtn.classList.add("disabled");
            var venueData = this.props.venueData;


            //---------   remove assign venue from list venues  --- //
            setTimeout(() => {

                var listCategories = this.state.listAllCategories;
                if(!venueSettings) {
                    venueData.listAssignCat.map((value, key) => {
                        listCategories = listCategories.filter(function (el) {
                            return el.id !== value.id;
                        });
                    });
                }


                //----- end of code  ----//
                let venueLocation = (venueData.hasOwnProperty("additional_information") && (venueData.additional_information) && venueData.additional_information.length > 0) ? JSON.parse(venueData.additional_information): {venueLatitude:"",venueLongitude:"",radius:""};
                this.setState(() => ({
                        is_edit: venueData.venue_id,
                        venue_location: venueData.address,
                        venue_name: venueData.venue_name,
                        assignedCategories: venueData.listAssignCat,
                        listCategories: listCategories,
                        assign_shops: [],
                        level: venueData.level_id,
                        image: venueData.venue_image,
                        email: (venueData.email) ? venueData.email : '',
                        venueLatitude: (venueData.additional_information) ? venueLocation.venueLatitude : '',
                        venueLongitude: (venueData.additional_information) ? venueLocation.venueLongitude : '',
                        radius: (venueData.additional_information) ? venueLocation.radius : '',
                    }), () => {
                    alert(this.state.is_edit);
                        $("#company_level").val(venueData.level_id);
                        $('#blah').show();
                        $('#blah').attr('src', this.state.image);
                        $this.validation();

                    }
                );
            }, 2000);

        }



    };//--- End of componentDidMount() ---//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    saveVenueData = () => {
        if (!this.canvas && this.state.src) {
            NotificationManager.warning("Please crop the image.", 'Image Cropping!');
            return false;
        }//..... end if() .....//

        let data = new FormData();
        data.append('image', this.canvas ? this.canvas.toDataURL('image/jpeg') : null);

        data.append('is_edit', this.state.is_edit);
        data.append('venue_location',(this.state.venue_location)? this.state.venue_location:'');
        data.append('venue_name', this.state.venue_name);
        data.append('level', this.state.level);
        data.append('venue_id', VenueID);
        data.append('company_id', CompanyID);


        data.append('selected_bussiness_id', JSON.stringify(this.state.selected_bussiness_id));
        if(!venueSettings) {
            data.append('company_level', JSON.stringify(this.state.company_level));
            data.append('list_assign_categories', JSON.stringify(this.state.assignedCategories));
        }
        data.append('additional_information', JSON.stringify({
            'venueLatitude': this.state.venueLatitude,
            'venueLongitude': this.state.venueLongitude,
            'radius': this.state.radius
        }));
        data.append('email', this.state.email);
        show_loader();

        axios.post(BaseUrl + '/api/save-venues', data)
            .then(res => {
                this.setState(() => ({
                    is_edit: 0,
                    venue_name: "",
                    venue_location: "",
                    assign_shops: [],
                    level: 0,
                }));

                this.props.setEditVenue(0, []);
                this.props.changeVenueTab("venue/venueList");
                show_loader();
                NotificationManager.success(res.data.message, 'Success');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while adding site .", 'Error');
        });
    };

    handleChange = (obj) => {
        this.setState(() => (obj), () => {
            this.validation();
        });
    };

    validation = () => {
        if (!venueSettings) {
            if (this.state.venue_location == "" || this.state.venue_name == "" || this.state.venueLongitude == '' || this.state.venueLatitude == '') {
                this.saveVenueBtn.classList.add("disabled");
            }else {
                this.saveVenueBtn.classList.remove("disabled");
            }
        }else{
            if (this.state.venue_location == "" || this.state.venue_name == "") {
                this.saveVenueBtn.classList.add("disabled");
            }else {
                this.saveVenueBtn.classList.remove("disabled");
            }
        }
    };

    getCategories = () => {
        show_loader();
        axios.post(BaseUrl + '/api/get-all-category', {company_id: CompanyID})
            .then(res => {
                this.setState(() => ({listCategories: res.data.data, listAllCategories: res.data.data}));
                show_loader();
            }).catch((err) => {
            show_loader();
            /*NotificationManager.error("Error occurred while getting Bussiness Stores .", 'Error');*/
        });
    };

    getCompanyLevelData = () => {
        show_loader();
        axios.get(BaseUrl + '/api/get-company-level?company_id=' + CompanyID)
            .then(res => {
                show_loader();
                this.setState(() => ({company_level: res.data.company_levels}));
            }).catch((err) => {
            NotificationManager.error("Error occurred while getting Bussiness .", 'Error');
            show_loader();
        });
    };

    getCompanyLevel = (e) => {
        let index = e.target.selectedIndex;
        let optionElement = e.target.childNodes[index];
        let level = optionElement.getAttribute('value');
        this.setState(() => ({level: level}), () => {
            this.validation();
        });
    };

    assignVenues = (value) => {
        var id = value.id;
        let listCategories = this.state.listCategories.filter(function (el) {
            return el.id !== id;
        });

        this.setState(prevState => ({
            assignedCategories: [...prevState.assignedCategories, value], listCategories: listCategories
        }), () => {
            this.validation();
        });
    };

    removeVenue = (value) => {
        var id = value.id;
        var assignVenues = this.state.assignedCategories.filter(function (el) {
            return el.id !== id;
        });
        this.setState(prevState => ({
            listCategories: [...prevState.listCategories, value], assignedCategories: assignVenues
        }), () => {
            this.validation();
        });
    };

    refreshVenues = () => {
        this.getCategories();
        this.setState(() => ({assignedCategories: []}), () => {
        });
    };

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({src: reader.result}),
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };//..... end of onSelectFile() .....//

    setCanvas = (canvas) => {
        this.canvas = canvas;
    };//..... end of setCanvas() .....//

    handleInputChange(e) {

        this.setState({search: e.target.value, venue_location: e.target.value})
    }

    handleSelectSuggest(suggest, originalPrediction) {
        this.setState({
            search: "",
            venue_location: suggest.formatted_address,
            venueLatitude: suggest.geometry.location.lat(),
            venueLongitude: suggest.geometry.location.lng()
        })
    }

    render() {
        const {search, venue_location} = this.state;
        return (
            <div>
                <div className="newVualt_container">
                    <div className="newVualt_container_detail">
                        <div className="newVualt_detail_outer">
                            <div className="newVualt_detail">
                                <div className="add_categoryList_info2">
                                    <div className="newVualt_heading">
                                        <h3>{this.state.is_edit == 0 ? "Create" : "Edit"} Site</h3>
                                    </div>
                                    <div className="categoryInfo_container clearfix">
                                        <div className="uploadImg_section">
                                            <h4>Featured image</h4>
                                            <div className="uploadImg_section_info">
                                                <div className="uploadPlaceholder">
                                                    <div className="image_notify_upload_area"
                                                         style={{marginBottom: '0px', height: '138px'}}>
                                                        <input type="file" onChange={this.onSelectFile}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <ImageCropping src={this.state.src} setCanvas={this.setCanvas}
                                                           image={this.state.image}
                                                           cropingDivStyle={{
                                                               width: '100%',
                                                               height: '125px',
                                                               float: 'left'
                                                           }}
                                                           previewStyle={{width: '100%', maxHeight: '350px'}}
                                                           previewImgStyle={{height: '192px', width: '192px'}}/>
                                        </div>
                                        <div className="addCategoryRight_section">
                                            <div className="addCategory_formSection portalNew_page addCategory_new">
                                                <ul>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Site Name</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="customPlaceholder">
                                                                <input type="text"
                                                                       onChange={(e) => this.handleChange({venue_name: e.target.value})}
                                                                       value={this.state.venue_name}
                                                                       placeholder="Site Name..." id="venue_name"
                                                                       name="venue_name"/>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Site Location</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="customPlaceholder">
                                                                <ReactGoogleMapLoader
                                                                    params={{
                                                                        key: API_KEY,
                                                                        libraries: "places,geocode",
                                                                    }}
                                                                    render={googleMaps =>
                                                                        googleMaps && (

                                                                            <div>
                                                                                <ReactGooglePlacesSuggest
                                                                                    autocompletionRequest={{input: search}}
                                                                                    googleMaps={googleMaps}
                                                                                    onSelectSuggest={this.handleSelectSuggest.bind(this)}
                                                                                >
                                                                                    <input
                                                                                        type="text"
                                                                                        value={venue_location}
                                                                                        placeholder="Search a location"
                                                                                        onChange={this.handleInputChange.bind(this)}
                                                                                    />
                                                                                </ReactGooglePlacesSuggest>
                                                                            </div>)
                                                                    }
                                                                />


                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Site Latitude</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="customPlaceholder">
                                                                <input type="text" value={this.state.venueLatitude}
                                                                       placeholder="Site Latitude" id="venueLatitude"
                                                                       name="venueLatitude" readOnly/>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Site Longitude</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="customPlaceholder">
                                                                <input type="text" value={this.state.venueLongitude}
                                                                       placeholder="Site Longitude" id="venueLongitude"
                                                                       name="venueLongitude" readOnly/>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Site Radius</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="customPlaceholder">
                                                                <input type="text" value={this.state.radius}
                                                                       onChange={(e) => {
                                                                           let value = e.target.value;
                                                                           if (value.match(/^\d+(?:\.\d{0,2})?$/gm))
                                                                               this.handleChange({radius: value})
                                                                       }} placeholder="Site Radius" id="radius"
                                                                       name="radius"/>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Site Email</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="customPlaceholder">
                                                                <input type="text" value={this.state.email}
                                                                       onChange={(e) => this.handleChange({email: e.target.value})}
                                                                       placeholder="Site Email" id="email"
                                                                       name="email"/>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    {(!venueSettings) && (
                                                        <li>
                                                            <div className="customPlaceholder_outer">


                                                                <div className="dragable_sections clearfix">

                                                                    <div className="dragable_sections_columns_outer">
                                                                        <h4>Unassigned Cateogries</h4>
                                                                        <p>Click on Category to assign it to this
                                                                            Site.</p>
                                                                        <span className="dragBttn" onClick={(e) => {
                                                                            this.refreshVenues()
                                                                        }}>&nbsp;</span>
                                                                        <div className="dragable_sections_columns">
                                                                            <ul id="unassignedCategories">
                                                                                {this.state.listCategories && (
                                                                                    this.state.listCategories.map((value, key) => {
                                                                                        return (
                                                                                            <li key={key}
                                                                                                value={value.id}
                                                                                                onClick={(e) => {
                                                                                                    this.assignVenues(value)
                                                                                                }}
                                                                                                className="checkBusiness">
                                                                                                <a>{value.name}</a>
                                                                                            </li>
                                                                                        )
                                                                                    })
                                                                                )}
                                                                            </ul>
                                                                        </div>
                                                                    </div>

                                                                    <div
                                                                        className="dragable_sections_columns_outer frDrag_column">
                                                                        <h4>Assigned Categories</h4>
                                                                        <p>Click on Category to unassign it to this
                                                                            Site.</p>

                                                                        <div
                                                                            className="dragable_sections_columns dropable_columns">
                                                                            <ul id="assignedCategories">
                                                                                {this.state.assignedCategories && (
                                                                                    this.state.assignedCategories.map((value, key) => {
                                                                                        return (
                                                                                            <li key={key}
                                                                                                onClick={(e) => this.removeVenue(value)}
                                                                                                className="unassignBussiness"
                                                                                                id={value.id}>
                                                                                                <a>{value.name}</a></li>
                                                                                        )
                                                                                    })
                                                                                )}
                                                                            </ul>
                                                                        </div>
                                                                    </div>


                                                                </div>
                                                            </div>
                                                        </li>
                                                    )}




                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="backSave_buttons">
                            <ul>
                                <li><input value="SAVE" className={"disabled"} ref={(ref) => {
                                    this.saveVenueBtn = ref
                                }} id="save_venue_btn" type="submit" onClick={(e) => {
                                    this.saveVenueData()
                                }}/></li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        );
    }//..... end of render() .....//
}//..... end of AddVenue.

export default AddVenue;