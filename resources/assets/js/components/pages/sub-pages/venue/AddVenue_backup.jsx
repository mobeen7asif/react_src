import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NotificationManager} from "react-notifications";

class AddVenue extends Component {
    saveVenueBtn = null;
    constructor(props) {
        super(props);
        this.state = {
            is_edit    : 0,
            venue_location : "",
            venue_name : "",
            assign_shops : [],
            level : 0,
            soldiBussiness : [],
            bussinesStores : [],
            company_level  : [],
            assignShops    : [],
            selected_bussiness_id : 0,
            intitialAssignVenue : [],
            image:""
        };



    }//..... end of constructor() .....//

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
            }
            reader.readAsDataURL(input.files[0]);
        }
    };


    componentDidMount = () => {
        let $this = this;
        $("body").on("change","#fileToUpload",function(e){
            $this.readURL(this);
            $this.validation();
        });

        if( this.props.getEditVenueID != 0 ){
            this.saveVenueBtn.classList.add("disabled");
            let venueData = this.props.venueData;
            this.setState(()=>(
                {
                    is_edit    : venueData.venue_id,
                    venue_location : venueData.address,
                    venue_name : venueData.venue_name,
                    assign_shops : [],
                    level : venueData.level_id,
                    assignShops    : JSON.parse(venueData.venue_shops),
                    intitialAssignVenue: JSON.parse(venueData.venue_shops),
                    image:venueData.venue_image
                }
                ),
                ()=>{
                    $("#company_level").val(venueData.level_id);
                    $('#blah').show();
                    $('#blah').attr('src', this.state.image);
                }
            );

        }
        this.getSoldiBussiness();
    };//--- End of componentDidMount() ---//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    saveVenueData = () => {
        let image = $('#fileToUpload')[0].files[0];
        var data = new FormData();
        if(image !== undefined){
            data.append('image', $('#fileToUpload')[0].files[0]);
        }
        data.append('is_edit', this.state.is_edit);
        data.append('venue_location', this.state.venue_location);
        data.append('venue_name', this.state.venue_name);
        data.append('level', this.state.level);
        data.append('venue_id', VenueID);
        data.append('company_id', CompanyID);
        data.append('as_shops', JSON.stringify(this.state.assignShops));
        data.append('soldiBussiness', JSON.stringify(this.state.soldiBussiness));
        data.append('bussinesStores', JSON.stringify(this.state.bussinesStores));
        data.append('company_level', JSON.stringify(this.state.company_level));
        data.append('assignShops', JSON.stringify(this.state.assignShops));
        data.append('selected_bussiness_id', JSON.stringify(this.state.selected_bussiness_id));
        data.append('intitialAssignVenue', JSON.stringify(this.state.intitialAssignVenue));

        //{...this.state,as_shops:this.state.assignShops,venue_id:VenueID,company_id:CompanyID}

        show_loader();
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        axios.post(BaseUrl + '/api/save-venues',data,config)
            .then(res => {
                this.setState(()=>({
                    is_edit    : 0,
                    venue_name : "",
                    venue_location : "",
                    assign_shops : [],
                    level : 0,
                    bussinesStores : [],
                    assignShops    : []
                }));

                this.props.setEditVenue(0,[]);
                this.props.changeVenueTab("venue/venueList");
                show_loader();
                NotificationManager.success(res.data.message, 'Success');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while adding venue .", 'Error');
        });
    };

    handleChange = (obj) => {
      this.setState(()=>(obj),()=>{
          this.validation();
      });


    };

    validation = () => {

        if(this.state.venue_location == "" || this.state.venue_name == "" || this.state.assignShops.length == 0 || this.state.level == 0 ){
            this.saveVenueBtn.classList.add("disabled");
        }else{
            this.saveVenueBtn.classList.remove("disabled");
        }
    };


    getSoldiBussiness = () => {
        show_loader();
        axios.get(BaseUrl + '/api/get-soldi-business?company_id='+CompanyID)
            .then(res => {
                show_loader();
                this.setState(()=>({soldiBussiness: res.data.data,company_level:res.data.company_levels}));
            }).catch((err) => {
            NotificationManager.error("Error occurred while getting Bussiness .", 'Error');
            show_loader();
        });

    };

    getVenueStores = (e) => {
        let index = e.target.selectedIndex;
        let optionElement = e.target.childNodes[index];
        let api_key =  optionElement.getAttribute('api_key');
        let api_secret =  optionElement.getAttribute('api_secret');
        let selected_bussiness_id =  optionElement.getAttribute('value');
        if(api_key == 0){
            this.setState(()=>({bussinesStores: []}));
            return false;
        }
        show_loader();
        axios.post(BaseUrl + '/api/check-products',{api_key:api_key,secret:api_secret})
            .then(res => {
                show_loader();
                //---------   remove already assign shop from current loaded shops  --- //
                var bussinesStores = res.data.data;
                this.state.assignShops.map((value,key)=>{
                    bussinesStores = bussinesStores.filter(function(el) {
                        return el.business_id !== value.business_id;
                    });
                });
                //----- end of code  ----//
                this.setState(()=>({bussinesStores: bussinesStores,selected_bussiness_id:selected_bussiness_id}));


                //this.setState(()=>({bussinesStores: res.data.data}));
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while getting Bussiness Stores .", 'Error');
        });

    };

    assignShops = (value) => {
        var id = value.id;
        let bussinesStores = this.state.bussinesStores.filter(function(el) {
            return el.id !== id;
        });

        this.setState(prevState => ({
            assignShops: [...prevState.assignShops, value],bussinesStores:bussinesStores
        }),()=>{
            this.validation();
        });




    };

    removeShops = (value) => {
        var bussinessID = value.business_id;
        var assignShops = this.state.assignShops.filter(function(el) {
            return el.business_id !== bussinessID;
        });

        if(value.business_id === this.state.selected_bussiness_id){
            this.setState(prevState => ({
                bussinesStores: [...prevState.bussinesStores, value],assignShops:assignShops
            }),()=>{
                this.validation();
            });
        }else{
            this.setState(prevState => ({
                assignShops:assignShops
            }),()=>{
                this.validation();
            });
        }


    };

    getCompanyLevel = (e) =>{
        let index = e.target.selectedIndex;
        let optionElement = e.target.childNodes[index];
        let level =  optionElement.getAttribute('value');
        this.setState(()=>({level:level}),()=>{
            this.validation();
        });
    };

    refreshAssignVenues = () => {
        this.setState(()=>({assignShops: this.state.intitialAssignVenue}),()=>{
            this.validation();
        });
    };

    render() {
        return (
            <div>

                <div className="newVualt_container">
                    <div className="newVualt_container_detail">

                        <div className="newVualt_detail_outer">
                            <div className="newVualt_detail">

                                <div className="add_categoryList_info2">
                                    <div className="newVualt_heading">
                                        <h3>Create Venues</h3>
                                    </div>

                                    <div className="categoryInfo_container clearfix">

                                        <div className="uploadImg_section">
                                            <h4>Featured image</h4>

                                            <div className="uploadImg_section_info">
                                                <div className="uploadPlaceholder">
                                                    <img id="blah" style={{display:'none'}} />
                                                    <div className="image_notify_upload_area">
                                                        <input id="fileToUpload" name="image" type="file" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="addCategoryRight_section">
                                            <div className="addCategory_formSection portalNew_page">
                                                <ul>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Venue Name</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="customPlaceholder">
                                                                <input type="text" onChange={(e)=>this.handleChange({venue_name:e.target.value})} value={this.state.venue_name} placeholder="Placeholder" id="venue_name" name="venue_name"/>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Venue Location</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="customPlaceholder">
                                                                <input type="text" value={this.state.venue_location} onChange={(e)=>this.handleChange({venue_location:e.target.value})} placeholder="Placeholder" id="venue_location" name="vneue_location"/>
                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>POS Business</h4>
                                                            <div className="customPlaceholder" style={{width: '50%'}}>
                                                                <select id="list_business" onChange={(e)=>{this.getVenueStores(e)}}  name="list_business" style={{width:'100%'}}>
                                                                    <option defaultValue={0} api_key="0" api_secret = "0">Select Bussiness</option>
                                                                    {(this.state.soldiBussiness) && (
                                                                        this.state.soldiBussiness.map((value,key)=>{
                                                                            return (
                                                                                <option  key={key} api_key={value.api_key} api_secret={value.secret_key} value={value.business_id}> {value.business_name}</option>
                                                                            )
                                                                        })
                                                                    )}

                                                                </select>
                                                            </div>
                                                        </div>
                                                    </li>




                                                    <li>
                                                        <div className="customPlaceholder_outer">


                                                            <div className="dragable_sections clearfix">

                                                                <div className="dragable_sections_columns_outer">
                                                                    <h4>Unassigned Shops</h4>
                                                                    <p>Click on shop to assign it to this site.</p>
                                                                    <span className="dragBttn" onClick={()=>{this.refreshAssignVenues()}}>&nbsp;</span>
                                                                    <div className="dragable_sections_columns listDataColumns">
                                                                        <ul id="soldiBussinesStores">
                                                                            {this.state.bussinesStores && (
                                                                                this.state.bussinesStores.map((value,key)=>{
                                                                                    return (
                                                                                        <li key={key} api_key={value.business_api_key} bussiness_user={value.user_id} api_secret={value.business_secret} onClick={(e)=>{this.assignShops(value)}} className="checkBusiness" id={value.business_id}><a>{value.business_name}</a></li>
                                                                                    )
                                                                                })
                                                                            )}

                                                                        </ul>
                                                                    </div>
                                                                </div>

                                                                <div className="dragable_sections_columns_outer frDrag_column">
                                                                    <h4>Assigned Shops</h4>
                                                                    <p>Click on category to unassign it to this site.</p>

                                                                    <div className="dragable_sections_columns sortable" >
                                                                        <ul id="assigned_shops">
                                                                            {this.state.assignShops && (
                                                                                this.state.assignShops.map((value,key)=>{
                                                                                    return (
                                                                                        <li key={key} onClick={()=>{this.removeShops(value)}} api_key={value.business_api_key} bussiness_user={value.user_id} api_secret={value.business_secret}  className="unassignBussiness" id={value.business_id}><a>{value.business_name}</a></li>
                                                                                    )
                                                                                })
                                                                            )}

                                                                        </ul>
                                                                    </div>
                                                                </div>


                                                            </div>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Levels</h4>
                                                            <div className="customPlaceholder" style={{width: '50%'}}>
                                                                <select id="company_level" onChange={(e)=>{this.getCompanyLevel(e)}}>
                                                                    <option key={12002552} value="0">Select Level</option>
                                                                    {this.state.company_level && (
                                                                        this.state.company_level.map((value,key)=>{
                                                                            return (
                                                                                <option key={key} value={value.tree_id} >{value.level_name}</option>
                                                                            )
                                                                        })
                                                                    )}

                                                                </select>
                                                            </div>
                                                        </div>
                                                    </li>


                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>





                        <div className="backSave_buttons">
                            <ul>
                                <li><input value="SAVE" className={"disabled"} ref={(ref)=>{this.saveVenueBtn = ref}} id="save_venue_btn" type="submit" onClick={(e)=>{this.saveVenueData()}} /></li>
                            </ul>
                        </div>


                    </div>

                </div>
                
            </div>
        );
    }//..... end of render() .....//
}//..... end of AddVenue.

AddVenue.propTypes = {};

export default AddVenue;