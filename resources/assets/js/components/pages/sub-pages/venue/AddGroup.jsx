import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NotificationManager} from "react-notifications";
import ImageCropping from "../ImageCropping";

class AddGroup extends Component {
    saveCategoryBtn = null;
    canvas = null;
    constructor(props) {
        super(props);
        this.state = {
            is_edit    : 0,
            group_name : "",
            assign_shops : [],
            level : 0,
            soldiBussiness : [],
            bussinesStores : [],
            assignShops    : [],
            selected_bussiness_id : 0,
            intitialAssignVenue : [],
            image : "",
            src: null
        };
    }//..... end of constructor() .....//

    componentWillUnmount = () => {

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


        if( this.props.getEditGroupID != 0 ){
            this.saveCategoryBtn.classList.remove("disabled");
            let groupData = this.props.groupData;
            this.setState(()=>({
                is_edit    : groupData.id,
                group_name : groupData.group_name,
                assign_shops : [],
                assignShops     : JSON.parse(groupData.group_shops),
                intitialAssignVenue: JSON.parse(groupData.group_shops),
                image:groupData.image,
            }));

        }
        this.getSoldiBussiness();
    };//--- End of componentDidMount() ---//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    saveGroupData = () => {
        /*if (! this.canvas && this.state.src) {
            NotificationManager.warning("Please crop the image.", 'Image Cropping!');
            return false;
        }*/

        let data = new FormData();
        data.append('image', this.canvas ? this.canvas.toDataURL('image/jpeg') : null);

        data.append('is_edit', this.state.is_edit);
        data.append('group_name', this.state.group_name);
        data.append('level', this.state.level);
        data.append('venue_id', VenueID);
        data.append('company_id', CompanyID);
        data.append('as_shops', JSON.stringify(this.state.assignShops));
        data.append('soldiBussiness', JSON.stringify(this.state.soldiBussiness));
        data.append('bussinesStores', JSON.stringify(this.state.bussinesStores));
        data.append('assignShops', JSON.stringify(this.state.assignShops));
        data.append('selected_bussiness_id', JSON.stringify(this.state.selected_bussiness_id));
        data.append('intitialAssignVenue', JSON.stringify(this.state.intitialAssignVenue));

        //{...this.state,as_shops:this.state.assignShops,venue_id:VenueID,company_id:CompanyID}

        show_loader();
        axios.post(BaseUrl + '/api/save-group',data)
            .then(res => {
                this.setState(()=>({
                    is_edit    : 0,
                    group_name : "",
                    assign_shops : [],
                    level : 0,
                    bussinesStores : [],
                    assignShops    : []
                }));

                this.props.setEditGroupData(0,[]);
                this.props.changeVenueTab("manage/listGroups");
                show_loader();
                NotificationManager.success(res.data.message, 'Success');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while adding Group .", 'Error');
        });
    };

    handleChange = (obj) => {
        this.setState(()=>(obj),()=>{
            this.validation();
        });


    };

    validation = () => {
        if( this.state.group_name == "" || this.state.assignShops.length == 0 ){
            this.saveCategoryBtn.classList.add("disabled");
        }else{
            this.saveCategoryBtn.classList.remove("disabled");
        }
    };

    getSoldiBussiness = () => {
        show_loader();
        axios.get(BaseUrl + '/api/get-soldi-business?company_id='+CompanyID)
            .then(res => {
                show_loader();
                this.setState(()=>({soldiBussiness: res.data.data}));
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

    refreshAssignVenues = () => {
        this.setState(()=>({assignShops: this.state.intitialAssignVenue}),()=>{
            this.validation();
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

    setCanvas = (canvas) => {
        this.canvas = canvas;
    };//..... end of setCanvas() .....//

    render() {
        return (
            <div>

                <div className="newVualt_container">
                    <div className="newVualt_container_detail">
                        <div className="newVualt_detail_outer">
                            <div className="newVualt_detail">
                                <div className="add_categoryList_info2">
                                    <div className="newVualt_heading">
                                        <h3>Add New Group</h3>
                                    </div>
                                    <div className="categoryInfo_container clearfix">
                                        <div className="uploadImg_section">
                                            <h4>Featured image</h4>
                                            <div className="uploadImg_section_info">
                                                <div className="uploadPlaceholder">
                                                    <div className="image_notify_upload_area" style={{marginBottom: '0px', height: '138px'}}>
                                                        <input type="file" onChange={this.onSelectFile} />
                                                    </div>
                                                </div>
                                            </div>
                                            <ImageCropping src={this.state.src} setCanvas={this.setCanvas} image={this.state.image}
                                                           cropingDivStyle={{width: '100%', height: '125px', float: 'left'}}
                                                           previewStyle={{width: '100%', maxHeight: '350px'}}
                                                           previewImgStyle={{height: '192px',width:'192px'}}/>
                                        </div>

                                        <div className="addCategoryRight_section">
                                            <div className="addCategory_formSection portalNew_page">
                                                <ul>
                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Group Name</h4>
                                                            <b className="req_tag">Required</b>
                                                            <div className="customPlaceholder">
                                                                <input type="text" onChange={(e)=>this.handleChange({group_name:e.target.value})} value={this.state.group_name} placeholder="Placeholder" id="group_name" name="group_name"/>
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




                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>





                        <div className="backSave_buttons">
                            <ul>
                                <li><input value="SAVE" className={"disabled"} ref={(ref)=>{this.saveCategoryBtn = ref}} id="save_venue_btn" type="submit" onClick={(e)=>{this.saveGroupData()}} /></li>
                            </ul>
                        </div>


                    </div>

                </div>

            </div>
        );
    }//..... end of render() .....//
}//..... end of AddGroup.

AddGroup.propTypes = {};

export default AddGroup;