import React, {Component,useRef} from 'react';
import {NotificationManager} from "react-notifications";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import {addMemberValidation, validateMemberData} from "../../../../../utils/Validations";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";
import DatePicker from 'react-datepicker';
import Switch from 'react-toggle-switch';
import { PrintTool } from "react-print-tool";
import moment from "moment/moment";
import ReactCodeInput from "react-code-input";
import PinInput from 'react-pin-input';
import "../../../../../../../../../node_modules/react-toggle-switch/dist/css/switch.min.css";
const API_KEY = "AIzaSyDHH2WyrHbuChuvGc1zkbY3LwiODEF8zGI";

class AddMember extends Component {

    state = {
        memberDetail : {},
        mobile_number : '+',
        generateKey:12345,
        home_address_lat : 0.0,
        home_address_long : 0.0,
        home_address: '',
        address2: '',
        key : 'a',
        first_name: '',
        last_name: '',
        gender: 'M',
        email: '',
        date_of_birth: moment(),
        show_dob: false,
        user_postal_code: '',
        show_address_map: false,
        switched: false,
        src: null,
        password: '',
        add_member: false,
        store_name: '',
        company_info: {
            name: '',
            branch: '',
            phone: '+',
            email: '',
            country: '',
            postal_code: '',
            address: '',
            lat: 0.0,
            long: 0.0,
        },
        search: '',
        city:"",
        state:"",
        country:""


    };
    initialState = {};


    constructor(props) {
        super(props);
        this.initialState = this.state;

    }//..... end of constructor() .....//

    componentDidMount = () => {
        let $this = this;
        $("body").on("change","#fileToUpload",function(e){
            $this.readURL(this);
        });

        setTimeout(()=>{

            $(".react-code-input > :first-child").attr("readonly",true);
            $(".react-code-input > :first-child").attr("disabled",true);
        },3000);
    };//..... end of componentDidMount() .....//

    readURL = (input) => {
        if (input.files && input.files[0]) {
            if(input.files[0].size > 2100000) {
                NotificationManager.warning("Image size should be less than 2 MB", 'Warning');
                return false;
            };
            let reader = new FileReader();
            reader.onload = function (e) {
                $('#fileToDisplay').attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    };
    phone_number = '';
    company_number = '';
    addMember = () => {
        let error_message = addMemberValidation(this.state.first_name,this.state.last_name,this.state.email,this.state.mobile_number,this.state.password);
        if(error_message !== ""){
            NotificationManager.warning(error_message, 'Missing Fields');
            return false;
        } else {
            show_loader();
            let mobile = this.state.mobile_number;
            mobile = mobile.replace("+","00");

            this.setState({show_address_map: this.state.home_address == ''? false:true}, () => {

                let data = new FormData();
                var fileInput = document.getElementById('fileToUpload');
                var file = fileInput.files[0];
                data.append('user_image', file);
                data.append('first_name', this.state.first_name);
                data.append('last_name', this.state.last_name);
                data.append('gender', this.state.gender);
                data.append('company_info', JSON.stringify(this.state.company_info));
                data.append('dob', moment(this.state.date_of_birth._d).format('Y-MM-DD'));
                data.append('postal_code', this.state.user_postal_code);
                data.append('home_address_lat', this.state.home_address_lat);
                data.append('home_address_long', this.state.home_address_long);
                data.append('home_address', this.state.home_address);
                data.append('show_dob', this.state.show_dob);
                data.append('phone', mobile);
                data.append('venue_id', VenueID);
                data.append('company_id', CompanyID);
                data.append('member_status', this.state.switched);
                data.append('email', this.state.email);
                data.append('password',this.state.password);
                data.append('address2',this.state.address2);
                data.append('city',this.state.city);
                data.append('country',this.state.country);
                data.append('state',this.state.state);
                data.append('store_name',this.state.store_name)

                axios.post(BaseUrl + '/api/create-user', data).then((response) => {
                    if(response.data.status === true) {
                        this.setState(this.initialState);
                        $('#fileToDisplay').attr('src', BaseUrl+'/users/thumbs/user_avatar.png');
                        $('.react-code-input').find('input:text').val('');
                        this.setState(()=>({mobile_number:"+" ,generateKey:(this.state.generateKey)+5}));
                        this.company_number.clear();

                        NotificationManager.success('Member Added Successfully', 'Success');
                    }
                    else {
                        NotificationManager.error(response.data.message, 'Error');
                    }
                    show_loader(true);

                }).catch((err)=> {
                    console.log(err);
                    show_loader(true);
                    NotificationManager.error("Error occurred while adding member, please try later.", 'Error');
                });

            });
        }
    };//..... end of updateMember() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    onInfoWindowClose = () => {

    };


    onMarkerClick = () => {};

    handleSelectSuggestTest(suggest,originalPrediction) {
        let  updated_object = {
            address:suggest.formatted_address,
            lat: parseFloat(suggest.geometry.location.lat()),
            long: parseFloat(suggest.geometry.location.lng())
        };
        this.setState((prevState) => ({search: "",company_info:{...prevState.company_info, ...updated_object}}));
    }

    handleInputChangeTest(e) {
        let address = e.target.value;
        this.setState((prevState) => ({search: address,company_info:{...prevState.company_info,address}}));
        if(address.length < 1){
            this.setState((prevState) => ({company_info:{...prevState.company_info,lat:0.0,long:0.0}}));
        }
    }


    handleSelectSuggest(suggest,originalPrediction) {
        let  updated_object = {
            home_address:suggest.formatted_address,
            home_address_lat: parseFloat(suggest.geometry.location.lat()),
            home_address_long: parseFloat(suggest.geometry.location.lng()),
            search: ''
        };
        this.setState(updated_object);
    }

    handleInputChange(e) {
        let address = e.target.value;
        if(address.length < 1){
            this.setState({search: address, home_address: address,home_address_lat:0.0,home_address_long:0.0});
        } else {
            this.setState({search: address, home_address: address});
        }
    }


    printDiv = (divName) => {
        // let printContents = document.getElementById(divName).innerHTML;
        // let originalContents = document.body.innerHTML;
        // document.body.innerHTML = printContents;
        PrintTool.printExistingElement("#"+divName);
        //document.body.innerHTML = originalContents;
    };
    handleBirthChange = (date) => {
        console.log(date);
        this.setState({
            date_of_birth: date,
            show_dob:true
        });
    };//..... end of handleBirthChange() .....//

    handleOutput (string) {
        // Do something with the string
    }

    toggleSwitch = () => {
        this.setState(prevState => {
            return {
                switched: !prevState.switched
            };
        });
    };
    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result }),
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };//..... end of onSelectFile() .....//


    validatePhone = (val) => {

        var number = val;
        number = number.replace(/[^\d+]+/g, '');
        number = number.replace(/^00/, '+');

        this.setState(()=>({mobile_number: number}),()=>{
            let mob = this.state.mobile_number;

            if(mob == "+" || mob ==""){

                this.setState(()=>({generateKey:(this.state.generateKey)+5}));
                this.setState(()=>({mobile_number:"+"}))

            }
        });
    }


    render() {
        let member = this.state.memberDetail;
        const search = this.state.search;
        const address = this.state.company_info.address;

        return (
            <div className="containerSection">
                <div className="dayMatrics">
                    <div className="dayMatrics_inner"> </div>
                </div>
                <div className="tabs_bttn">
                    <ul>
                        <li><a  style={{cursor:'pointer'}} className="selectTb">ADD MEMBER</a></li>
                    </ul>
                </div>
                <div className="newVualt_container">
                    <div className="newVualt_container_detail">
                        <div className="e_member_main clearfix">



                            <div className="e_member_left">
                                <div className="edit_category_leftBar">
                                    <div className="e_member_user">
                                        <div className="edit_category_img setting_file">
                                            <span>
                                                <input id={'fileToUpload'} type="file" onChange={this.onSelectFile} title={"Upload Image"} />
                                                <img id={'fileToDisplay'} src={BaseUrl+'/users/thumbs/user_avatar.png'} alt="#" />
                                            </span>
                                        </div>
                                        <div className="e_member_userName"> <a href="javascript:void(0);">{this.state.first_name+' '+this.state.last_name}</a> </div>
                                    </div>
                                </div>
                            </div>


                            <div className="e_member_right">
                                <div className="add_category_listing">
                                    <ul>
                                        <li>
                                            <div className="add_categoryList_info addProduct_setting" id="printableArea">
                                                <div className="newVualt_heading">
                                                    <h3>Member / <a href="javascript:void(0);">Add</a></h3>
                                                </div>
                                                <div className="categoryInfo_container clearfix">
                                                    <div className="addCategoryRight_section">
                                                        <div className="edit_category_rightDetail removeHighlights">
                                                            <div className="addCategory_formSection">
                                                                <div className="e_memberInfo_heading settingMember clearfix">
                                                                    <h5>Personal Information</h5>
                                                                    <div className="memberBtn">
                                                                        <h4>Member Verification Status</h4>
                                                                        <Switch onClick={this.toggleSwitch} on={this.state.switched}/>
                                                                    </div>
                                                                </div>

                                                                <ul>
                                                                    <li>
                                                                        <div className="customPlaceholder_outer">
                                                                            <h4>First Name</h4>
                                                                            {/*<b className="req_tag">Required</b>*/}
                                                                            <div className="customPlaceholder">
                                                                                <input autoFocus={true}  value={this.state.first_name}  placeholder="First Name" type="text"
                                                                                        onChange={(e) => {this.setState({'first_name':e.target.value})}}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="customPlaceholder_outer">
                                                                            <h4>Last Name</h4>
                                                                            <div className="customPlaceholder">
                                                                                <input  value={this.state.last_name} placeholder="Last Name" type="text"
                                                                                        onChange={(e) => {this.setState({'last_name':e.target.value})}}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="customPlaceholder_outer">
                                                                            <h4>Gender</h4>
                                                                            <div className="placeholder_radio_outer genderChosen clearfix">
                                                                                <div className="placeholder_radio_column">
                                                                                    <div className="radio_button">
                                                                                        <input id="test_1" name="radio-group" type="radio"
                                                                                               checked={this.state.gender === 'M'}  value="M"
                                                                                               onChange={(e) => {this.setState({'gender':e.target.value})}}
                                                                                        />
                                                                                        <label htmlFor="test_1">Male</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="placeholder_radio_column">
                                                                                    <div className="radio_button">
                                                                                        <input id="test_2" name="radio-group" type="radio"  value="F"
                                                                                               checked={this.state.gender === 'F'}
                                                                                               onChange={(e) => {this.setState({'gender':e.target.value})}}
                                                                                        />
                                                                                        <label htmlFor="test_2">Female</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="placeholder_radio_column">
                                                                                    <div className="radio_button">
                                                                                        <input id="test_3" name="radio-group" type="radio"  value="O"
                                                                                               checked={this.state.gender === 'O'}
                                                                                               onChange={(e) => {this.setState({'gender':e.target.value})}}
                                                                                        />
                                                                                        <label htmlFor="test_3">Other</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </li>

                                                                    <li>
                                                                        {/*<div className="customPlaceholder_outer">
                                                                            <h4>Mobile Number</h4>
                                                                            <div className="numberPlaceholder place_holder_setting input_plugin">
                                                                                <PinInput
                                                                                    ref={(n) => this.phone_number=n}

                                                                                    length={14}
                                                                                    onChange={(value, index) => {
                                                                                        this.setState({'mobile_number':value})
                                                                                    }}
                                                                                    type="text"
                                                                                    onComplete={(value, index) => {}}
                                                                                />



                                                                            </div>
                                                                        </div>*/}

                                                                        <div className="customPlaceholder_outer">
                                                                            <h4>Mobile Number</h4>
                                                                            <div className="numberPlaceholder place_holder_setting" style={{width: '98.5%'}}>

                                                                                <ReactCodeInput key={this.state.generateKey}  pattern="/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im"  autoFocus={false}  value={(this.state.mobile_number) ? this.state.mobile_number : "+"  }  type='tel' fields={14} onChange={(val) => {

                                                                                    if(val == ""){
                                                                                        val = "+";
                                                                                    }

                                                                                    this.validatePhone(val);
                                                                                }} />
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="customPlaceholder_outer">
                                                                            <h4>Date of Birth</h4>
                                                                            <div className="customPlaceholder">
                                                                                {
                                                                                        <DatePicker selected={this.state.date_of_birth}  dateFormat="DD MMM YYYY"  maxDate={moment()} onChange={this.handleBirthChange}/>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="customPlaceholder_outer">
                                                                            <h4>Email</h4>
                                                                            <div className="customPlaceholder">
                                                                                <input  value={this.state.email} placeholder="Email" type="text"
                                                                                        onChange={(e) => {this.setState({'email':e.target.value})}}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="customPlaceholder_outer">
                                                                            <h4>Password</h4>
                                                                            <div className="customPlaceholder">
                                                                                <input  value={this.state.password} placeholder="Password" type="password"
                                                                                        onChange={(e) => {this.setState({'password':e.target.value})}}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </li>

                                                                    {
                                                                        INDEX_NAME == 'engage-swimart' ?
                                                                            <li>
                                                                                <div className="customPlaceholder_outer">
                                                                                    <h4>Store Name</h4>
                                                                                    <div className="customPlaceholder">
                                                                                        <input  value={this.state.store_name} placeholder="Store Name" type="text"
                                                                                                onChange={(e) => {this.setState({'store_name':e.target.value})}}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                            : <li></li>

                                                                    }
                                                                    <li>
                                                                        <div className="customPlaceholder_outer">
                                                                            <h4>&nbsp;</h4>
                                                                            {/*<b className="req_tag">Required</b>*/}

                                                                            <ReactGoogleMapLoader
                                                                                params={{
                                                                                    key:'AIzaSyDHH2WyrHbuChuvGc1zkbY3LwiODEF8zGI',
                                                                                    libraries: "places,geocode",
                                                                                }}
                                                                                render={googleMaps =>
                                                                                    googleMaps && (
                                                                                        <div>
                                                                                            <ReactGooglePlacesSuggest
                                                                                                autocompletionRequest={{ input: this.state.search }} googleMaps={googleMaps}
                                                                                                onSelectSuggest={this.handleSelectSuggest.bind(this)}
                                                                                            >
                                                                                                <div className="customPlaceholder_outer">
                                                                                                    <h4>Address</h4>
                                                                                                    <div className="customPlaceholder">
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            value={this.state.home_address}
                                                                                                            placeholder="Search a location"
                                                                                                            onChange={this.handleInputChange.bind(this)}
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>

                                                                                            </ReactGooglePlacesSuggest>
                                                                                        </div>)
                                                                                }
                                                                            />




                                                                            <div className="clearfix" style={{marginTop: '33px'}}>
                                                                                <h4>Address 2</h4>
                                                                                <div className="customPlaceholder">
                                                                                    <input  value = {this.state.address2}  placeholder="Address 2" type="text" onChange={(e) => {
                                                                                        this.setState({address2: e.target.value})}}/> />
                                                                                </div>
                                                                            </div>

                                                                            <div className="clearfix" style={{marginTop: '33px'}}>
                                                                                <h4>City</h4>
                                                                                <div className="customPlaceholder">
                                                                                    <input  placeholder="City" type="text" value={this.state.city}
                                                                                            onChange={(e) => {this.setState({'city':e.target.value})}}
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </li>
                                                                    <li className="spaceAdd">
                                                                        <div className="customPlaceholder_outer">
                                                                            <h4>&nbsp;</h4>
                                                                            <div className="map_place">

                                                                                {
                                                                                    (this.state.show_address_map) ?

                                                                                        <Map key={this.state.key} google={this.props.google} zoom={14}
                                                                                             initialCenter={{
                                                                                                 lat: (member) && this.state.home_address_lat,
                                                                                                 lng: (member) && this.state.home_address_long
                                                                                             }}>
                                                                                            <Marker onClick={this.onMarkerClick}
                                                                                                    name={'Current location'} />

                                                                                            <InfoWindow children={<div></div>} onClose={this.onInfoWindowClose}>

                                                                                            </InfoWindow>
                                                                                        </Map>
                                                                                        :
                                                                                        <img src={BaseUrl+"/assets/images/grey_map.png"} alt="#" />
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <br/>
                                                                    <br/>
                                                                    <br/>
                                                                    <br/>
                                                                    <br/>
                                                                    <div style={{marginTop: "18px"}}></div>




                                                                    <li>
                                                                        <div className="customPlaceholder_outer">
                                                                            <h4>State</h4>
                                                                            <div className="customPlaceholder">
                                                                                <input  placeholder="State" type="text" value={this.state.state}
                                                                                        onChange={(e) => {this.setState({'state':e.target.value})}}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </li>

                                                                    <li>
                                                                        <div className="customPlaceholder_outer">
                                                                            <h4>Postal Code</h4>
                                                                            <div className="customPlaceholder">
                                                                                <input  value = {this.state.user_postal_code}  placeholder="Post Code" type="text" onChange={(e) => {
                                                                                    this.setState({user_postal_code: e.target.value})}}/> />
                                                                            </div>
                                                                        </div>

                                                                    </li>

                                                                    <li>
                                                                        <div className="customPlaceholder_outer">
                                                                            <h4>County</h4>
                                                                            <div className="customPlaceholder">
                                                                                <input  placeholder="Country" type="text" value={this.state.country}
                                                                                        onChange={(e) => {this.setState({'country':e.target.value})}}
                                                                                />
                                                                            </div>
                                                                        </div>


                                                                    </li>




                                                                </ul>
                                                            </div>
                                                            <div className="addCategory_formSection">
                                                                <div className="e_memberInfo_heading">
                                                                    <h5>Company Information</h5>
                                                                </div>
                                                                <ul>
                                                                    <li>
                                                                        <div className="customPlaceholder_outer">
                                                                            <h4>Company Name</h4>
                                                                            <div className="customPlaceholder">
                                                                                <input  value={this.state.company_info.name} placeholder="Name" type="text"
                                                                                        onChange={(e) => {
                                                                                            let name = e.target.value;
                                                                                            this.setState((prevState) => ({company_info:{...prevState.company_info, name}}))}}/>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="customPlaceholder_outer">
                                                                            <h4>Branch</h4>
                                                                            <div className="customPlaceholder">
                                                                                <input  value={this.state.company_info.branch} placeholder="Branch Code" type="text"
                                                                                        onChange={(e) => {
                                                                                            let branch = e.target.value;
                                                                                            this.setState((prevState) => ({company_info:{...prevState.company_info, branch}}))}}/>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="customPlaceholder_outer">
                                                                            <h4>Phone Number</h4>
                                                                            <div className="numberPlaceholder place_holder_setting input_plugin">



                                                                                <PinInput
                                                                                    ref={(n) => this.company_number=n}
                                                                                    length={14}
                                                                                    onChange={(value, index) => {
                                                                                        this.setState((prevState) => {
                                                                                            return {
                                                                                                company_info: {...prevState.company_info, phone:value }
                                                                                            };
                                                                                        })
                                                                                    }}
                                                                                    type="numeric"
                                                                                    onComplete={(value, index) => {}}
                                                                                />

                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="customPlaceholder_outer">
                                                                            <h4>Email Address</h4>
                                                                            <div className="customPlaceholder">
                                                                                <input  value={this.state.company_info.email} placeholder="Email" type="text"
                                                                                        onChange={(e) => {
                                                                                            let email = e.target.value;
                                                                                            this.setState((prevState) => ({company_info:{...prevState.company_info, email}}))}}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </li>


                                                                    <li className="spaceAdd adressSection">
                                                                        <div className="customPlaceholder_outer">
                                                                            <div className="customPlaceholder">
                                                                                <input  value={this.state.company_info.country} placeholder="Country" type="text"
                                                                                        onChange={(e) => {
                                                                                            let country = e.target.value;
                                                                                            this.setState((prevState) => ({company_info:{...prevState.company_info, country}}))}}
                                                                                />
                                                                            </div>
                                                                            <div className="adressPostcode clearfix">
                                                                                <div className="customPlaceholder">
                                                                                    <input  value={this.state.company_info.postal_code} placeholder="Post Code" type="number"
                                                                                            onChange={(e) => {
                                                                                                let postal_code = e.target.value;
                                                                                                this.setState((prevState) => ({company_info:{...prevState.company_info, postal_code}}))}}
                                                                                    />


                                                                                </div>
                                                                            </div>

                                                                            <div className="customPlaceholder_outer" style={{paddingTop: '16px'}}>

                                                                                <div className="customPlaceholder">
                                                                                    <input
                                                                                        type="text"
                                                                                        value={this.state.company_info.address}
                                                                                        placeholder="Company Address"
                                                                                        onChange={(e) => {
                                                                                            let address = e.target.value;
                                                                                            this.setState((prevState) => ({company_info:{...prevState.company_info,address}}));

                                                                                        }} />
                                                                                </div>
                                                                            </div>


                                                                        </div>
                                                                    </li>






                                                                    {/* <li>

                                                    </li>*/}
                                                                    {/*<ReactGoogleMapLoader
                                                        params={{
                                                            key:'AIzaSyDHH2WyrHbuChuvGc1zkbY3LwiODEF8zGI',
                                                            libraries: "places,geocode",
                                                        }}
                                                        render={googleMaps =>
                                                            googleMaps && (
                                                                <div>
                                                                    <ReactGooglePlacesSuggest
                                                                        autocompletionRequest={{ input: this.state.search }} googleMaps={googleMaps}
                                                                        onSelectSuggest={this.handleSelectSuggest.bind(this)}
                                                                    >
                                                                        <li>
                                                                            <div className="customPlaceholder_outer">
                                                                                <h4>Address</h4>
                                                                                <div className="customPlaceholder">
                                                                                    <input
                                                                                           type="text"
                                                                                           value={this.state.company_info.address}
                                                                                           placeholder="Search a location"
                                                                                           onChange={this.handleInputChange.bind(this)}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    </ReactGooglePlacesSuggest>
                                                                </div>)
                                                        }
                                                    />*/}


                                                                    {/* <li className="spaceAdd">
                                                        <div className="customPlaceholder_outer">
                                                            <h4>&nbsp;</h4>
                                                            <div className="map_place">


                                                                <Map key={this.state.key} google={this.props.google} zoom={14}  center={{
                                                                    lat: this.state.company_info.lat,
                                                                    lng: this.state.company_info.long
                                                                }}>
                                                                    <Marker
                                                                        title={''}
                                                                        name={''}
                                                                        position={{ lat: this.state.company_info.lat, lng: this.state.company_info.long }} />

                                                                    <InfoWindow onClose={this.onInfoWindowClose}>
                                                                        <div>

                                                                        </div>
                                                                    </InfoWindow>
                                                                </Map>

                                                            </div>
                                                        </div>
                                                    </li>*/}



                                                                </ul>
                                                            </div>


                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="clearfix">
                                    <div className="e_member_printBtns clearfix">
                                        <ul>
                                            <li>
                                                <input   type="submit" value="SUBMIT" onClick={this.addMember} />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of Member.

AddMember.propTypes = {};

// export default BasicInformation;
export default GoogleApiWrapper({
    apiKey: ('AIzaSyDHH2WyrHbuChuvGc1zkbY3LwiODEF8zGI')
})(AddMember)