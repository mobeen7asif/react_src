import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import {validateMemberData} from "../../../../../utils/Validations";
import ReactGoogleMapLoader from "react-google-maps-loader";
import ReactGooglePlacesSuggest from "react-google-places-suggest";
import DatePicker from 'react-datepicker';
import ReactCodeInput from "react-code-input";
import { PrintTool } from "react-print-tool";
import moment from "moment/moment";
import { Scrollbars } from 'react-custom-scrollbars';
import {find} from 'lodash';
import {setRedemptionFrequency} from "../../../../../redux/actions/PunchCardActions";
import Switch from "react-toggle-switch";
import ImageCropping from "../../../ImageCropping";

const API_KEY = "AIzaSyDHH2WyrHbuChuvGc1zkbY3LwiODEF8zGI";

class BasicInformation extends Component {

    customDropDownOneSpanRef      = null;
    customDropDownShowOneRef      = null;
    customDropDownShowThreeRef    = null;
    customDropDownBSpanRef        = null;
    customDropDownShowBRef        = null;
    customDropDownThreeSpanRef    = null;
    customDropDownRedSpanRef      = null;
    customDropDownShowRedRef      = null;
    customDropDownVariantSpanRef  = null;
    customDropDownShowVariantRef  = null;
    customDropDownDiscountRef     = null;
    customDropDownDiscountOneRef  = null;


    memberTypeList = [
        {
            field: 'Staff',
            label: 'Staff'
        },
        {
            field: 'Student',
            label: 'Student'
        }
    ];

    state = {
        memberDetail : {},
        mobile_number : '',
        home_address_lat : 0.0,
        home_address_long : 0.0,
        home_address: '',
        address2: '',
        generateKey:12345,
        key : 'a',
        first_name: '',
        last_name: '',
        gender: '',
        date_of_birth: moment(),
        show_dob: false,
        user_postal_code: '',
        show_address_map: false,
        referral_code: '',
        response_status: false,
        member_type : '',
        switched : false,
        old_user: false,
        member_status: false,
        client_customer_id: '',
        store_name: "",
        company_info: {
            name: '',
            branch: '',
            phone: '',
            email: '',
            country: '',
            postal_code: '',
            address: '',
            lat: 0.0,
            long: 0.0,
            response_status: false
        },
        search: '',
        memberTypeList: [],
        price_id: '',
        city:"",
        state:"",
        country:""

    };

    constructor(props) {
        super(props);


    }//..... end of constructor() .....//

    componentDidMount = () => {

        show_loader();
        axios.post(BaseUrl + '/api/member-details',{
            persona_id: this.props.persona_id,
            venue_id: VenueID,
            company_id: CompanyID,
        }).then((response) => {

            if (response.data.status) {
               let mobile_number = response.data.member.devices.mobile !== null || response.data.member.devices.mobile !== ''   ? response.data.member.devices.mobile.split(' ').join(''): '';
                var number = mobile_number;
                number = number.replace(/[^\d+]+/g, '');
                number = number.replace(/^00/, '+');
                if(!number.includes("+")){
                    number = "+"+number;
                }


                let memberType = response.data.member.member_type;
                setTimeout(()=>{

                    this.setState(()=>({
                        memberDetail : response.data.member,
                        mobile_number :number,
                        client_customer_id: response.data.member.client_customer_id,
                        home_address_lat : response.data.member.lat_long.lat,
                        home_address_long : response.data.member.lat_long.lng,
                        store_name : response.data.member.hasOwnProperty("business_name") ? response.data.member.business_name : "",
                        key : 'asdsa',
                        first_name: response.data.member.persona_fname,
                        last_name: response.data.member.persona_lname,
                        gender: response.data.member.gender,
                        date_of_birth: (response.data.member.hasOwnProperty('date_of_birth') && response.data.member.date_of_birth !== null && response.data.member.date_of_birth !== '') ? moment(response.data.member.date_of_birth): '',
                        show_dob: response.data.member.hasOwnProperty('date_of_birth') ? true: false,
                        user_postal_code: response.data.member.postal_code,
                        show_address_map: (response.data.member.lat_long.lat != 0 && response.data.member.lat_long.lng != 0) ? true : false,
                        home_address: response.data.member.address,
                        referral_code: response.data.member.referral_code,
                        member_type: memberType ? memberType : "Member",
                        memberTypeList : response.data.member_types,
                        response_status: true,
                        old_user: response.data.member.old_user,
                        member_status: response.data.member.member_status,
                        switched: response.data.member.status == "inactive" ? false : true ,
                        address2: (response.data.member.hasOwnProperty('residential_address') && response.data.member.residential_address.hasOwnProperty('residential_address_2')) ? response.data.member.residential_address.residential_address_2 : "" ,
                        city: (response.data.member.hasOwnProperty('residential_address') && response.data.member.residential_address.hasOwnProperty('suburb')) ? response.data.member.residential_address.suburb : "" ,
                        country: (response.data.member.hasOwnProperty('residential_address') && response.data.member.residential_address.hasOwnProperty('country')) ? response.data.member.residential_address.country : "" ,
                        state: (response.data.member.hasOwnProperty('residential_address') && response.data.member.residential_address.hasOwnProperty('state')) ? response.data.member.residential_address.state : "" ,

                    }),()=>{
                    });
                },500);
                //if(response.data.member.company_info) {
                    if(response.data.member.company_info && Object.keys(response.data.member.company_info).length > 0){
                    if(response.data.member.company_info){
                        this.setState({
                            company_info : {
                                name:  response.data.member.company_info.name,
                                branch: response.data.member.company_info.branch,
                                phone: response.data.member.company_info.phone != null ? response.data.member.company_info.phone.split(' ').join('') : '',
                                email:  response.data.member.company_info.email,
                                country:  response.data.member.company_info.country,
                                postal_code:  response.data.member.company_info.postal_code,
                                address: response.data.member.company_info.address,
                                lat: response.data.member.company_info.lat,
                                long: response.data.member.company_info.long,
                                response_status: true
                            }
                        }, () => {show_loader(true);})
                    }
                    else {
                        this.setState((prevState) => ({company_info:{...prevState.company_info,response_status:true}}));
                        // this.setState((prevState) => ({search: address,company_info:{...prevState.company_info,address}}));
                        show_loader(true);
                    }
                }
                else {
                    this.setState((prevState) => ({company_info:{...prevState.company_info,response_status:true}}));
                    show_loader(true);
                }
            }
            else {
                NotificationManager.error("Something went wrong with server", 'Error');
                show_loader(true);
            }
        }).catch((err) => {
            NotificationManager.error("Something went wrong with server", 'Error');
            show_loader(true);
        });
        setTimeout(()=>{

            $(".react-code-input > :first-child").attr("readonly",true);
            $(".react-code-input > :first-child").attr("disabled",true);
        },3000);

    };//..... end of componentDidMount() .....//


    updateMember = () => {
        if(validateMemberData(this.state.first_name,this.state.last_name,this.state.gender)){
            NotificationManager.warning("Name field is required", 'Missing Fields');
            return false;
        } else {
            show_loader();
            let mobile = this.state.mobile_number;
            mobile = mobile.replace("+","00");
            this.setState({show_address_map: this.state.home_address == ''? false:true})
            axios.post(BaseUrl + '/api/update-member-profile', {
                user_id: this.props.persona_id,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                gender: this.state.gender,
                company_info: this.state.company_info,
                date_of_birth: moment(this.state.date_of_birth._d).format('Y-MM-DD'),
                user_postal_code: this.state.user_postal_code,
                home_address_lat: this.state.home_address_lat,
                home_address_long: this.state.home_address_long,
                home_address: this.state.home_address,
                show_dob: this.state.show_dob,
                mobile_number: mobile,
                referral_code: this.state.referral_code,
                member_type : this.state.member_type,
                address2 : this.state.address2,
                city : this.state.city,
                country : this.state.country,
                state : this.state.state,
                price_id : this.state.price_id,
                company_id : CompanyID,
                member_status : this.state.switched == 0 ? false : true,
                store_name : this.state.store_name
            }).then((response) => {
                show_loader(true);
                NotificationManager.success('Member Updated Successfully', 'Success');
            }).catch((err)=> {
                show_loader(true);
                NotificationManager.error("Error occurred while updating member, please try later.", 'Error');
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
        this.setState({
            date_of_birth: date,
            show_dob:true
        });
    };//..... end of handleBirthChange() .....//

    setMemberType = (memberType,priceId) => {

        this.customDropDownShowRedRef.style.display = 'none';
        this.customDropDownRedSpanRef.classList.remove('changeAero');
        this.setState((prevState)=>({member_type:(prevState.member_type == memberType)?'':memberType}),()=>{
            this.setState({price_id: priceId});
        });


    };//..... end of setRedemptionType() .....//

    handleDropDownRedSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRedRef.style.display =  this.customDropDownShowRedRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownRedSpanClick() .....//

    setGender = (input_value) => {
        if(input_value == this.state.gender) {
            this.setState({gender: ''});
        } else {
            this.setState({gender: input_value});
        }
    };
    toggleSwitch = () => {
        this.setState(prevState => {
            return {
                switched: !prevState.switched,

            };
        });
    };

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
            <div className="e_member_right">
                <div className="add_category_listing">
                    <ul>
                        <li>
                            <div className="add_categoryList_info addProduct_setting" id="printableArea">
                                <div className="newVualt_heading">
                                    <h3>Member / <a href="javascript:void(0);">Information</a>

                                    <strong style={{float: 'right'}}>Member Number: {this.state.client_customer_id == "" ? '-' : this.state.client_customer_id} </strong>
                                    </h3>
                                </div>
                                <div className="categoryInfo_container clearfix">
                                    <div className="addCategoryRight_section">
                                        <div className="edit_category_rightDetail removeHighlights">
                                            <div className="addCategory_formSection">
                                                <div className="e_memberInfo_heading settingMember">
                                                    <h5>Personal Information</h5>
                                                    {
                                                        //this.state.old_user == 0 ?
                                                            <div className="memberBtn">
                                                                <h4>Member Verification Status</h4>
                                                                <Switch onClick={this.toggleSwitch} on={this.state.switched}/>
                                                            </div>
                                                            //f: ''
                                                    }

                                                </div>
                                                <ul>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>First Name</h4>
                                                            {/*<b className="req_tag">Required</b>*/}
                                                            <div className="customPlaceholder">
                                                                <input autoFocus={true}   value={this.state.first_name}  placeholder="Placeholder" type="text"
                                                                       onChange={(e) => {this.setState({'first_name':e.target.value})}}
                                                                />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Last Name</h4>
                                                            <div className="customPlaceholder">
                                                                <input  value={this.state.last_name} placeholder="Placeholder" type="text"
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
                                                                               onClick={(e) => {
                                                                                   this.setGender(e.target.value);}
                                                                               }
                                                                        />
                                                                        <label htmlFor="test_1">Male</label>
                                                                    </div>
                                                                </div>
                                                                <div className="placeholder_radio_column">
                                                                    <div className="radio_button">
                                                                        <input id="test_2" name="radio-group" type="radio"  value="F"
                                                                               checked={this.state.gender === 'F'}
                                                                               onClick={(e) => {
                                                                                   this.setGender(e.target.value);}
                                                                               }
                                                                        />
                                                                        <label htmlFor="test_2">Female</label>
                                                                    </div>
                                                                </div>
                                                                <div className="placeholder_radio_column">
                                                                    <div className="radio_button">
                                                                        <input id="test_3" name="radio-group" type="radio"  value="O"
                                                                               checked={this.state.gender === 'O'}
                                                                               onClick={(e) => {
                                                                                   this.setGender(e.target.value);}
                                                                               }
                                                                        />
                                                                        <label htmlFor="test_3">Other</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    {this.state.response_status?
                                                        <li>
                                                            <div className="customPlaceholder_outer">
                                                                <h4>Mobile Number</h4>
                                                                <div className="numberPlaceholder place_holder_setting" style={{width: '98.5%'}}>

                                                                    <ReactCodeInput key={this.state.generateKey}  pattern="/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im"  autoFocus={false}  value={(this.state.mobile_number) ? this.state.mobile_number : "+"  }  type='tel' fields={14} onChange={(val) => {

                                                                        if(val == ""){
                                                                            val = "+";
                                                                            $(".react-code-input > :first-child").val("+");
                                                                        }

                                                                        this.validatePhone(val);
                                                                    }} />
                                                                </div>
                                                            </div>
                                                        </li>:
                                                        <li>
                                                            <div className="customPlaceholder_outer">
                                                                <h4>Mobile Number</h4>
                                                                <div className="numberPlaceholder place_holder_setting" style={{width: '98.5%'}}>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    }
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Date of Birth</h4>
                                                            <div className="customPlaceholder">
                                                                {
                                                                    this.state.show_dob ?
                                                                        <DatePicker selected={this.state.date_of_birth != "" ? this.state.date_of_birth : ""} dateFormat="DD MMM YYYY"  maxDate={moment()} onChange={this.handleBirthChange}/>
                                                                        :
                                                                        <DatePicker dateFormat="DD MMM YYYY"  maxDate={moment()} onChange={this.handleBirthChange}/>
                                                                }

                                                                />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Email</h4>
                                                            <div className="customPlaceholder" style={{background:"lightgray"}}>
                                                                <input readonly="readonly"  value={(!_.isEmpty(member)) ? member.emails.personal_emails : ''} placeholder="Email" type="text" readOnly />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Referral</h4>
                                                            <div className="customPlaceholder">
                                                                <input  placeholder="Referral" type="text" value={this.state.referral_code}
                                                                        onChange={(e) => {this.setState({'referral_code':e.target.value})}}
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

                                                    {(appPermission("MemberGroup","view")) && (
                                                        <div className="dropSegmentation_section">
                                                            <div className="dropSegmentation_heading clearfix">
                                                                <h3>Select Member Type</h3>
                                                            </div>
                                                            <div className="stateSegmentation primary_voucher_setting">
                                                                <div className="venueIdentification_section">
                                                                    <div className="customDropDown">
                                                                        {
                                                                            this.state.member_type == 'Customer' ?
                                                                                <span  ref={ref => this.customDropDownRedSpanRef = ref} onClick={this.handleDropDownRedSpanClick}>{'Select member type'}</span>
                                                                                :
                                                                                <span  ref={ref => this.customDropDownRedSpanRef = ref} onClick={this.handleDropDownRedSpanClick}> {this.state.member_type ? (find(this.state.memberTypeList, {label: this.state.member_type})).label : 'Select member type'}</span>
                                                                        }

                                                                        <ul className="customDropDown_show customPlaceHolder drop" ref={ref => this.customDropDownShowRedRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none',marginLeft: '0px'}} >
                                                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                                                {
                                                                                    this.state.memberTypeList.map((redType) => {
                                                                                        return <li key={redType.label} onClick={(e)=> {this.setMemberType(redType.label,redType.field)}} className={this.state.member_type && redType.label === this.state.member_type ? 'selectedItem' : ''}>{redType.label}</li>;
                                                                                    })
                                                                                }
                                                                            </Scrollbars>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}





                                                </ul>
                                            </div>

                                            {(appPermission("MemberProfileCompanyInfo","view")) && (
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
                                                        {
                                                            this.state.company_info.response_status ?
                                                                <li>
                                                                    <div className="customPlaceholder_outer">
                                                                        <h4>Phone Number</h4>
                                                                        <div className="numberPlaceholder place_holder_setting"
                                                                             style={{width: '98.5%'}}>
                                                                            <ReactCodeInput autoFocus={false}
                                                                                            value={this.state.company_info.phone}
                                                                                            type='text' fields={14}

                                                                                            onChange={(val) => {
                                                                                                this.setState((prevState) => {
                                                                                                    return {
                                                                                                        company_info: {
                                                                                                            ...prevState.company_info,
                                                                                                            phone: val
                                                                                                        }
                                                                                                    };
                                                                                                })
                                                                                            }}/>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                                : <li>
                                                                    <div className="customPlaceholder_outer">
                                                                        <h4>Phone Number</h4>
                                                                        <div className="numberPlaceholder place_holder_setting"
                                                                             style={{width: '98.5%'}}>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                        }
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
                                            )}

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
                            <li><a href="javascript:void(0);" onClick={() => {this.printDiv('printableArea')}}>PRINT</a></li>
                            <li>
                                <input   type="submit" value="SUBMIT" onClick={this.updateMember} />
                            </li>
                        </ul>
                    </div>
                </div>



            </div>
        );
    }//..... end of render() .....//
}//..... end of Member.

BasicInformation.propTypes = {};

// export default BasicInformation;
export default GoogleApiWrapper({
    apiKey: ('AIzaSyDHH2WyrHbuChuvGc1zkbY3LwiODEF8zGI')
})(BasicInformation)