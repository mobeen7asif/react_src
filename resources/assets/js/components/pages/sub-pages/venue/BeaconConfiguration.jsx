import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NotificationManager} from "react-notifications";

class BeaconConfiguration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            venue_id : VenueID,
            gridData : true,
            nextLevel:0,
        };
        this.editVenueLevelID = 0;
        this.venueLevels = [];
        this.venueBeaconData = [];
        this.y_axes = 0;
        this.x_axes = 0;
    }//..... end of constructor() .....//

    addLevelPopup = () => {
        document.getElementById("addLevelPopup").style.display = 'block';
        if(this.venueLevels.length > 0){
            document.getElementById("level_show_0_tab").setAttribute("style","display:none !important;");
            document.getElementById("level_show_0_details").setAttribute("style","display:none !important;");
        }else{
            document.getElementById("level_show_0_tab").setAttribute("style","display:block !important;");
            document.getElementById("level_show_0_details").setAttribute("style","display:block !important;");
        }
    };

    closeModel = () => {
        document.getElementById("addLevelPopup").style.display = 'none';
    };

    addLevel = () => {
        this.editVenueLevelID = 0;
        document.getElementById("level_show_0_tab").style.display = "block";
        document.getElementById("level_show_0_details").style.display = "block";
        document.getElementById("level_0_tab").innerHTML = "New Level";
        $('.click_level').removeClass('levelActive');
        $("#level_0_tab").trigger("click");
        $('#floor_name_0').val("");
        $('#floor_number_0').val("");
        $('#edit_floor_image_0').attr('src', "");
        $('#display_level_0').hide();
        $('#upload_area_0').show();
        $("#fileToUpload_0").val("");
    };

    saveBeconData = () => {
        let becon_name = document.getElementById("becon_name").value;
        let becon_level_id = this.editVenueLevelID;
        let becon_type = document.getElementById("becon_type").value;
        let becon_uuid = document.getElementById("becon_uuid").value;
        let becon_major = document.getElementById("becon_major").value;
        let becon_minor = document.getElementById("becon_minor").value;
        let venue_id = VenueID;


        var becon_data = [];

        var count = 0;
        if (becon_name != "") {
            $("#becon_name").css({"border-color": "#ededed", "border-width": "1px", "border-style": "solid"});

        } else {
            $("#becon_name").css({"border-color": "#FD0004", "border-width": "1px", "border-style": "solid"});
            count++;
        }
        if (becon_type != "") {
            $("#becon_type").css({"border-color": "#ededed", "border-width": "1px", "border-style": "solid"});

        } else {
            $("#becon_type").css({"border-color": "#FD0004", "border-width": "1px", "border-style": "solid"});
            count++;
        }
        if (becon_uuid != "") {
            $("#becon_uuid").css({"border-color": "#ededed", "border-width": "1px", "border-style": "solid"});

        } else {
            $("#becon_uuid").css({"border-color": "#FD0004", "border-width": "1px", "border-style": "solid"});
            count++;
        }
        if (becon_major != "") {
            $("#becon_major").css({"border-color": "#ededed", "border-width": "1px", "border-style": "solid"});

        } else {
            $("#becon_major").css({"border-color": "#FD0004", "border-width": "1px", "border-style": "solid"});
            count++;
        }
        if (becon_minor != "") {
            $("#becon_minor").css({"border-color": "#ededed", "border-width": "1px", "border-style": "solid"});

        } else {
            $("#becon_minor").css({"border-color": "#FD0004", "border-width": "1px", "border-style": "solid"});
            count++;
        }

        if(this.x_axes == 0){
            alert("Please Place Beacon before saving !");
            return false;
        }

        becon_data = {
            venue_id: VenueID,
            becon_name: becon_name,
            becon_level_id: becon_level_id,
            becon_type: becon_type,
            becon_uuid: becon_uuid,
            becon_major: becon_major,
            becon_minor: becon_minor,
            x_coordinate: this.x_axes,
            y_coordinate: this.y_axes,
        };

        if (count == 0) {
            show_loader();
            axios.post(BaseUrl + '/api/add-beacon-in-venue', {dataArray: becon_data})
                .then(res => {
                    document.getElementById("becon_name").value ='';
                    //$this.editVenueLevelID = 0;
                    document.getElementById("becon_type").value = '';
                    document.getElementById("becon_uuid").value = '';
                    document.getElementById("becon_major").value = '';
                    document.getElementById("becon_minor").value = '';
                    this.x_axes = 0;
                    this.y_axes = 0;
                    document.getElementById("addBeacon_popup").style.display = "none";
                    this.getVenueLevels();
                    NotificationManager.success("Beacon Added successfully.", 'Success',1500);
                    show_loader();
                }).catch((err) => {
                NotificationManager.error("Error occurred while saving.", 'Error',1500);
                show_loader();
            });
        }
    };

    beaconImageEdit = () => {
        let x_axes = 0;
        $("#beacon-style-edit").css({"top": "0px", "left": "0px","display":"block"});
        var offset = $(this).offset();
        x_axes = e.pageX - offset.left;
        let y_axes = e.pageY - offset.top;
        var top_plus = 0;
        var left_plus = 0;
        top_plus =y_axes + 80;
        left_plus =x_axes+40;
        $("#beacon-style-edit").css({"top": top_plus+"px", "left": left_plus+"px"});
        y_axes = top_plus/251;
        x_axes =left_plus/700;
        this.x_axes = x_axes;
        this.y_axes = y_axes;
    };

    componentDidMount = () => {
        let $this = this;
        this.getVenueLevels();
        $(document).on('change', 'div.image_notify_upload_area input:file', function () {
            $this.readURLs(this, this.id);
        });

        $("body").on("click", ".backButton", function (e) {
            var value = $(".levelActive").attr("data-attr");
            $("[data-attr='" + value + "']").parent().prev().children().trigger("click");
        });

        let html = '';
        $("#image_place_1").prepend(html);

        $("body").on("click",".bea_div",function(e){
            $('#save_becon_btn').removeClass('disabled');
            let x_axes = 0;

            if($("#place_becon").hasClass("disabled")){

            }else{
                $("#beacon-style-add").css({"top": "0px", "left": "0px","display":"block"});
                var offset = $(this).offset();
                x_axes = e.pageX - offset.left;
                let y_axes = e.pageY - offset.top;
                var top_plus = 0;
                var left_plus = 0;
                top_plus =y_axes + 80;
                left_plus =x_axes+40;
                $("#beacon-style-add").css({"top": top_plus+"px", "left": left_plus+"px"});
                y_axes = top_plus/251;
                x_axes =left_plus/700;
                $this.x_axes = x_axes;
                $this.y_axes = y_axes;
            }

        });



        $("body").on("click",".view_beacon",function(e){
            var id = $(this).attr("data-value");
            $(".beacons_active_onclick").removeClass('currentBeacon');
            $("#beacons_place_listing_"+id).addClass('currentBeacon');

        });
    };



    cancelFloorPlan = (elem) => {
        var floor_id = elem.target.getAttribute("id");
        var ret = floor_id.split("_");
        var str2 = ret[3];
        $('#floor_' + str2).hide();
        $('#cancel_floor_edit_' + str2).hide();
        $('#upload_area_' + str2).hide();
        $('#edit_click_level_' + str2).show();
        $('#display_level_' + str2).show();
        document.getElementById("level_show_0_tab").style.display = "none";
        document.getElementById("level_show_0_details").style.display = "none";
        document.getElementById("floor_number_"+str2).classList.add("disabled");
        document.getElementById("floor_name_"+str2).classList.add("disabled");
    };

    getVenueLevels = () => {
        let $this = this;
        axios.post(BaseUrl + '/api/get-venue-levels',{venue_id:VenueID})
            .then(res => {
                this.venueLevels = res.data.levels;
                this.venueBeaconData = res.data.beacon_data;
                this.setState({gridData : !this.state.gridData,nextLevel: (res.data.beacon_data.length + 1)});
                if(this.editVenueLevelID ==0){
                    $('#list_venue_tabs li:first').find("a").trigger("click");
                }else{
                    $(".level_"+this.editVenueLevelID).trigger("click");
                }
                this.editVenueLevelID = 0;
                if(this.venueBeaconData.length > 0){
                    this.venueBeaconData.map((value,key)=>{
                         $("#image_place_"+value.level_id).find("span").remove();
                    });

                    this.venueBeaconData.map((value,key)=>{
                        var bec_x_position = (value.x_coordinate) * (1059);
                        bec_x_position =bec_x_position - 34;
                        if(bec_x_position > 500 ){
                            bec_x_position =(bec_x_position) + (30);
                        }
                        bec_x_position = bec_x_position + "px";
                        var bec_y_position = (value.y_coordinate) * (350);
                        bec_y_position = parseFloat(bec_y_position) + parseFloat(98);
                        bec_y_position = bec_y_position + "px";
                        let html_bec = '<span id="beacons_place_listing_'+value.id+'" class="beacon-style-on-main tooltip beacons_active_onclick" style="top:'+bec_y_position+'; left: '+bec_x_position+';"> <span class="tooltiptext">'+value.beacon_name+'<br />Acitive</span></span>';
                         $("#image_place_"+value.level_id).prepend(html_bec);
                    });

                }
            }).catch((err) => {
            NotificationManager.error("Error occurred while getting venue levels.", 'Error');
        });
    };

    readURLs = (input,id) => {
        var file_id  = id.split('_');
        var c_id       = file_id[1];
        var file_id  = 'display_level_'+file_id[1];
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#'+file_id).show();
                $('#upload_area_'+c_id).hide();
                $('#edit_floor_image_'+c_id).attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    };

    myFunction = (elem) => {
        let is_edit = this.editVenueLevelID;
        let $this = this;
        var floor_id = elem.target.getAttribute("id");
        var form_id = floor_id;
        var ret = form_id.split("_");
        var str2 = ret[1];
        var floor_name = $('#floor_name_' + str2).val();
        var floor_number = $('#floor_number_' + str2).val();
        var floor_data = [];
        var venue_id = VenueID;
        var data = new FormData();
        data.append('floor_name', floor_name);
        data.append('floor_number', floor_number);
        data.append('venue_level', str2);
        data.append('venue_id', venue_id);
        data.append('editVenueLevelID', this.editVenueLevelID);
        data.append('image', $('#fileToUpload_' + str2)[0].files[0]);

        var count = 0;
        if (floor_name != "") {
            $("#floor_name_" + str2).css({"border-color": "#ededed", "border-width": "1px", "border-style": "solid"});
        } else {
            $("#floor_name_" + str2).css({"border-color": "#FD0004", "border-width": "1px", "border-style": "solid"});
            count++;
        }
        if (floor_number != "" && $.isNumeric(floor_number)) {
            $("#floor_number_" + str2).css({"border-color": "#ededed", "border-width": "1px", "border-style": "solid"});
        } else {
            $("#floor_number_" + str2).css({"border-color": "#FD0004", "border-width": "1px", "border-style": "solid"});
            count++;
        }

        if(is_edit === 0){
            if ($('#fileToUpload_' + str2).val() != ''){
                $('#img_div_' + str2).css({"border": "none"});
            } else{
                $('#img_div_' + str2).css({"border-color": "#FD0004", "border-width": "1px", "border-style": "solid", "border-radius": "6px"});
                count++;
            }
        }

        if (count == 0) {
            show_loader();
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            axios.post(BaseUrl + '/api/save-venue-level',data,config)
                .then(res => {

                    if(this.editVenueLevelID !== 0){
                        let str2 = this.editVenueLevelID;
                        $('#floor_' + str2).hide();
                        $('#cancel_floor_edit_' + str2).hide();
                        $('#upload_area_' + str2).hide();
                        $('#edit_click_level_' + str2).show();
                        $('#display_level_' + str2).show();
                        $("#fileToUpload_"+str2).val("");
                        document.getElementById("floor_number_"+str2).classList.add("disabled");
                        document.getElementById("floor_name_"+str2).classList.add("disabled");
                        $(".level_"+str2).trigger("click");
                        NotificationManager.success("Venue level updated successfully.", 'Success',1500);
                        show_loader();
                    }else{
                        document.getElementById("level_show_0_tab").setAttribute("style","display:none !important;");
                        document.getElementById("level_show_0_details").setAttribute("style","display:none !important;");
                        document.getElementById("floor_name_0").value = "";
                        document.getElementById("floor_number_0").value = "";
                        document.getElementById("floor_number_0").value = "";
                        $("#fileToUpload_0").val("");
                        $('#edit_floor_image_0').attr('src', "");
                        $('#display_level_0').hide();
                        $('#img_div_0').show();
                        this.getVenueLevels();
                        NotificationManager.success("Venue level addedd successfully.", 'Success',1500);
                        show_loader();
                    }
                    this.editVenueLevelID = 0;

                }).catch((err) => {
                NotificationManager.error("Error Occurred while saving/updating.", 'Error');
                show_loader();
            });
        }else{
            $(".loader").hide();
        }
    };

    editVenueLevel = (elem) => {
        var floor_id = elem.target.getAttribute("id");
        var ret = floor_id.split("_");
        var str2 = ret[3];

        document.getElementById("floor_number_"+str2).classList.remove("disabled");
        document.getElementById("floor_name_"+str2).classList.remove("disabled");
        this.editVenueLevelID = str2;
        $('#floor_' + str2).show();
        $('#cancel_floor_edit_' + str2).show();
        $('#upload_area_' + str2).show();
        $('#edit_click_level_' + str2).hide();
        $('#display_level_' + str2).hide();
        $("#img_div_" + str2).show();
        $("#fileToUpload_" + str2).show();
    };

    deleteFloorPlan = (ele) => {
        let $this = this;
        let ret = ele.target.getAttribute("id").split("_");
        let del_floor_id = ret[2];
        if(del_floor_id == 0){
            document.getElementById("level_show_0_tab").setAttribute("style","display:none !important;");
            document.getElementById("level_show_0_details").setAttribute("style","display:none !important;");
            document.getElementById("floor_name_0").value = "";
            document.getElementById("floor_number_0").value = "";
            document.getElementById("floor_number_0").value = "";
            $("#fileToUpload_0").val("");
            $('#blah_0').attr('src', "");
            $('#blah_0').hide();
            $('#img_div_0').show();
            this.editVenueLevelID = 0;
            this.getVenueLevels();
        }else{
            show_loader();
            axios.post(BaseUrl + '/api/delete-venue-level',{del_level_id:del_floor_id, venue_id:VenueID})
                .then(res => {
                    this.getVenueLevels();
                    NotificationManager.success("Level Deleted successfully.", 'Success',1500);
                    show_loader();
                }).catch((err) => {
                NotificationManager.error("Error occured while deleting.", 'Error',1500);
                show_loader();
            });
        }
        return false;
    }

    addBeaconFunction = (elem) => {
        document.getElementById("addBeacon_popup").style.display = "block";
        document.getElementById("add_beacon_popup_btn").style.display = "block";
        let floor_level = elem.target.getAttribute("id");
        let image = document.getElementById("edit_floor_image_"+floor_level).getAttribute("src");
        this.editVenueLevelID = floor_level;
        document.getElementById("beaco_name_addCase").setAttribute("src",image);
        $('#becon_level_id').val(floor_level);
        $('#becon_level_id').val(floor_level);
        let venue_id = this.state.venue_id;
        axios.post(BaseUrl + '/api/get-floor-beacon',{floor_level:floor_level, venue_id:VenueID})
            .then(res => {
                $(".show-mutiple-beacons").find("span").remove();
                $(".show-mutiple-beacons").prepend('<span id="beacon-style-add" style="display: none;"></span>');
                 if(res.data.data.length > 0){

                     res.data.data.map((value,key)=>{

                         if(value.y_coordinate != 0 && value.x_coordinate != 0){
                             var add_bec_x_axis = (value.x_coordinate)*(700);
                             var add_bec_y_axis = (value.y_coordinate)*(251);
                             $('.show-mutiple-beacons').prepend('<span  class="beacon-style-on-main-add tooltip" style="top:'+add_bec_y_axis+'px; left: '+add_bec_x_axis+'px;"> <span class="tooltiptext">'+value.beacon_name+'<br>Active</span></span>');
                         }
                     });
                 }
            }).catch((err) => {
            NotificationManager.error("Error occurred while getting floor beacons.", 'Error');
        });
    };

    editBeaconData = (id) => {
        axios.post(BaseUrl + '/api/get-floor-beacons',{id:id})
            .then(res => {
               var result = res.data.data[0];
               let image_url = document.getElementById("edit_floor_image_"+result.level_id).getAttribute("src");
               document.getElementById("beacon_image_edit").setAttribute("src",image_url);
               document.getElementById("beacon_id").value  = result.id;
               document.getElementById("becon_name_edit").value  = result.beacon_name;
               document.getElementById("becon_type_edit").value  = result.beacon_type;
               document.getElementById("becon_uuid_edit").value  = result.uuid;
               document.getElementById("becon_major_edit").value = result.major;
               document.getElementById("becon_minor_edit").value = result.minor;
               this.x_axes = result.x_coordinate;
               this.y_axes = result.y_coordinate
               document.getElementById("editBeacon_popup").style.display = 'block';
               document.getElementById("edit_beacon_popup_btn").style.display = 'block';
                $(".place_beacon").show();
                $("#beacon-style-edit").show();
                $('#beacon_image_edit').css("pointer-events", "visible");
                $("#beacon-style-edit").find("span").remove();
                $(".show-mutiple-beacons").find("span").remove();
                if(result.y_coordinate != 0 && result.x_coordinate != 0){
                    let bfleft = (result.x_coordinate)*(700);
                    let bftop = (result.y_coordinate)*(251);
                    $("#beacon-style-edit").css({"top":bftop+"px", "left":bfleft+"px"});
                }
            }).catch((err) => {
            NotificationManager.error("Error occurred while getting floor beacons.", 'Error');
        });
    };

    updateBeaconData = () => {
        let $this = this;
        let data = {};
        data.beacon_id   = document.getElementById("beacon_id").value;
        data.beacon_name = document.getElementById("becon_name_edit").value;
        data.becon_type  = document.getElementById("becon_type_edit").value;
        data.uuid        = document.getElementById("becon_uuid_edit").value;
        data.major       = document.getElementById("becon_major_edit").value;
        data.minor       = document.getElementById("becon_minor_edit").value;
        data.x_coordinate =  this.x_axes;
        data.y_coordinate =  this.y_axes;
        show_loader();
        axios.post(BaseUrl + '/api/update-floor-beacons',data)
            .then(res => {
                this.x_axes = 0;
                this.y_axes = 0;
                document.getElementById("editBeacon_popup").style.display = 'none';
                document.getElementById("edit_beacon_popup_btn").style.display = 'none';
                this.setState({gridData: !this.state.gridData});
                this.getVenueLevels();
                NotificationManager.success("Beacon updated successfully.", 'Update Success',1500);
                show_loader();
            }).catch((err) => {
            NotificationManager.error("Error occurred while updating reocrd.", 'Update Error',1500);
            show_loader();
        });

    };

    deleteBeaconData = (id,venue_level) => {
        let $this = this;
        $(".cl_tableRow_editDotes").trigger("click");
        $("#beacons_place_listing_"+id).remove();
        show_loader();
        axios.post(BaseUrl + '/api/delete-beacon',{id:id})
            .then(res => {
                this.editVenueLevelID = venue_level;
                this.getVenueLevels();
                NotificationManager.success("Beacon Deleted successfully.", 'Success',1500);
                show_loader();
            }).catch((err) => {
            NotificationManager.error("Error occurred while deleting record.", 'Error',1500);
            show_loader();
        });
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    handleButtonsShow = (e) => {
        let li = e.target.closest('li');
        if (li.classList.contains('active_editMod')) {
            li.classList.remove('active_editMod');
        } else {
            Array.prototype.slice.call(e.target.closest('ul').querySelectorAll('li'))
                .map((ele) => ele.classList.remove('active_editMod'));
            li.classList.add('active_editMod');
        }//..... end if-else() .....//
    };

    render() {

        let is_hide = this.venueLevels.length > 0 ? "none" : "block";
        return (
            <React.Fragment>

                <div className="beaconConfig_outer" id="v_beaconConfig">

                    <div className="dropSegmentation_section">

                        <div className="dropSegmentation_heading clearfix">
                            <h3>Beacon Configuration</h3>
                        </div>

                        <div className="venueInfo_div">
                            <div className="venueIdentification_section">
                                <p>Set limits for the number of campaigns a member can receive and when they can receive them to minimise opt-outs.</p>
                            </div>
                        </div>


                    </div>


                    <div className="dropSegmentation_section">

                        <div className="dropSegmentation_heading clearfix">
                            <h3>Level 1</h3>
                        </div>

                        <div className="venueInfo_div ">
                            <div className="level_detail">
                                <div className="compaignDescription_outer message_delay    clearfix">

                                    <label>Floor Number</label>

                                    <div className="fieldIncremnt">
                                        <div className="quantity clearfix">
                                            <input min="1" step="1" defaultValue="1" type="number"  />
                                            <div className="quantity-nav">
                                                <div className="quantity-button quantity-up"></div>
                                                <div className="quantity-button quantity-down"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <label>Floor Name</label>

                                    <div className="customInput_div">
                                        <input  placeholder="Place holder" type="text" />
                                    </div>
                                </div>
                            </div>


                            <div className="buildMap">
                                <img src="assets/images/beaconConfig_img.png" alt="#" style={{ display:'block', width:'95%', margin:'auto'}} />
                            </div>
                            <br />
                            <div className="beacon_edit_delete">
                                <a  style={{cursor:'pointer'}}>EDIT </a>
                                <a  style={{cursor:'pointer'}}>DELETE </a>
                            </div>
                            <br />
                            <br />
                        </div>


                    </div>

                    <div className="addLevel">
                        <a  style={{cursor:'pointer'}} onClick={this.addLevelPopup}><i>&nbsp;</i>ADD LEVEL</a>
                    </div>

                </div>




                {/*start of add level popup*/}
                <div className="popups_outer" id="addLevelPopup">
                    <div className="popups_inner">
                        <div className="overley_popup" onClick={this.closeModel}></div>

                        <div className="popupDiv popupDiv_config">
                            <div className="popupDiv_detail">
                                <div className="levels_bttn">
                                    <ul id="list_venue_tabs" className="list_popup_tabs">
                                        { this.venueLevels.length > 0 && (

                                            this.venueLevels.map((value,key)=>{
                                                let activeClass = key ===0 ? "levelActive" : "";
                                                return (
                                                    <li key={key}><a  style={{cursor:'pointer'}} data-attr={"level_show_"+value.venue_level} className={"click_level "+activeClass+" level_"+value.venue_level} >LEVEL {key + 1}</a></li>
                                                );
                                            })
                                        )}

                                        <li id="level_show_0_tab"><a id={"level_0_tab"}  style={{cursor:'pointer'}} data-attr={"level_show_0"} className={"click_level levelActive level_0"} >LEVEL 1</a></li>
                                        <li ><a id="add_level" onClick={this.addLevel}  style={{cursor:'pointer'}}  ><em></em>Add Level</a></li>

                                    </ul>
                                </div>


                                {this.venueLevels.length > 0 && (
                                    this.venueLevels.map((value,key)=>{
                                        let hide = key === 0 ? "block" : "none";
                                        return (
                                            <div key={key} id={"level_show_"+value.venue_level+"_details"} className={"popupDiv_detail_inner level_show_"+value.venue_level+" floor_levels_"+value.venue_level+""} style={{display:hide}}>
                                                <div className="backBttn">
                                                    <a className="backButton"  style={{cursor:'pointer'}}>BACK</a>
                                                </div>

                                                <div className="addFloor_info clearfix">
                                                    <label>Floor Number</label>
                                                    <div className="floor_quaintity">
                                                        <div className="fieldIncremnt">
                                                            <div className="quantity clearfix">
                                                                <input  min="1" step="1" defaultValue={value.floor_number} name="floor_number[]" id={"floor_number_"+value.venue_level} className="floor_number_check disabled" type="tel" />
                                                                <div className="quantity-nav">
                                                                    <div className="quantity-button quantity-up"></div>
                                                                    <div className="quantity-button quantity-down"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="floorNameInput">
                                                        <input defaultValue={value.floor_name} placeholder="Floor number" className={"disabled"}  name="floor_name[]" id={"floor_name_"+value.venue_level} type="text" />
                                                    </div>
                                                    <button onClick={(e)=>{this.deleteFloorPlan(e)}} id={"delete_floor_"+value.venue_level} >DELETE LEVEL</button>
                                                </div>


                                                <div className="beacon_edit_delete" id={"display_level_"+value.venue_level}>

                                                    <div className="adRemove_removeMembrs_btn editFloorBtn" id={"edit_floor_"+value.venue_level}>
                                                        <input type="hidden" id={"img_level_name_"+value.venue_level} defaultValue={value.floor_plan } />
                                                            <div className="proxitrgrr_chosBeacon_bldngMap" id={"image_place_"+value.venue_level} style={{maxHeight:'350px',marginBottom: '20px'}}>

                                                                <span id={"outer_floor_image_"+value.venue_level}></span>
                                                                <img id={"edit_floor_image_"+value.venue_level} style={{maxHeight: '350px',minHeight: '350px',maxWidth: '1059px',minWidth: '1059px'}} src={BaseUrl+"/floor_plan/"+value.floor_plan} alt="#" />
                                                            </div>
                                                    </div>
                                                </div>


                                                <div className="buildMap"  style={{display:"none"}}>

                                                    <img id={"blah_"+value.venue_level} className="image_venue_all" src={BaseUrl+"/floor_plan/"+value.floor_plan} style={{width:'95%', margin:'auto',maxHeight: '350px', minHeight: '350px', maxWidth: '1059px', minWidth: '1059px'}} />

                                                </div>
                                                <div className="proxitrgrr_chosBeacon_bldngMap_out"><div id={"image_place_"+value.venue_level} className="floor_map_beacons" ></div></div>

                                                <div className="popup_upload_img" id={"upload_area_"+value.venue_level} style={{display:'none'}}>
                                                    <div id={"img_div_"+value.venue_level} className="image_notify_upload_area">
                                                        <input type="file" name="fileToUpload" id={"fileToUpload_"+value.venue_level} />
                                                    </div>
                                                </div>



                                                <br />
                                                <div className="beacon_edit_delete venueAcc_search_addVenue clearfix">
                                                    <ul className="custome_level_btns" id={"edit_floor_"+value.venue_level}>



                                                        <li>
                                                            <a  style={{cursor:'pointer'}} style={{display:"none"}}  id={"floor_"+value.venue_level} name={"add_floor_plan"+value.venue_level} onClick={(e)=>{this.myFunction(e)}}>Save Floor Plane </a>
                                                        </li>
                                                        <li>
                                                            <a  style={{cursor:'pointer'}} onClick={(e)=>{this.editVenueLevel(e)}}  id={"edit_click_level_"+value.venue_level} name="edit_floor_plan">Edit</a>
                                                        </li>

                                                        <li>
                                                            <a  style={{cursor:'pointer'}} style={{display:"none"}} onClick={(e)=>{this.cancelFloorPlan(e)}}  id={"cancel_floor_edit_"+value.venue_level} className="floor_plan" name="cancel_floor_edit">Cancel</a>
                                                        </li>
                                                        <li>
                                                            <a  style={{cursor:'pointer'}} onClick={(e)=>{this.addBeaconFunction(e)}} id={value.venue_level} className={"bec_addaction_btn_"+value.venue_level}>Add Beacons</a>
                                                        </li>

                                                    </ul>



                                                </div>




                                                <div className="beaconCinfig_list">
                                                    <div className="cL_listing_tableInn">

                                                        <div className="cL_listing_tableTitle">
                                                            <div className="cL_listing_table_row">
                                                                <div className="cL_listing_table_cell cell1">
                                                                    <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Beacon Name</strong>
                                                                </div>
                                                                <div className="cL_listing_table_cell cell2">
                                                                    <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Beacon Type</strong>
                                                                </div>
                                                                <div className="cL_listing_table_cell cell3">
                                                                    <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>UUID</strong>
                                                                </div>
                                                                <div className="cL_listing_table_cell cell4">
                                                                    <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Major</strong>
                                                                </div>
                                                                <div className="cL_listing_table_cell cell5">
                                                                    <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Minor</strong>
                                                                </div>
                                                                <div className="cL_listing_table_cell cell7">
                                                                    <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Status</strong>
                                                                </div>
                                                            </div>

                                                        </div>


                                                        <ul>

                                                            {this.venueBeaconData.length > 0 && (
                                                                this.venueBeaconData.map((value2,key2)=>{
                                                                    if(value.venue_level == value2.level_id){
                                                                        return (
                                                                            <li id={"beacon_number_"+value2.id} key={"key_"+key2}>
                                                                                <div className="cL_listing_table_row view_beacon"  data-value={value2.id}>
                                                                                    <div className="cL_listing_table_cell cell1"> <span className="cL_rowList_number">{value2.beacon_name}</span> </div>
                                                                                    <div className="cL_listing_table_cell cell2">

                                                                                        <span className="cL_rowList_number">{value2.beacon_type}</span>
                                                                                    </div>
                                                                                    <div className="cL_listing_table_cell cell3">
                                                                                        <span className="cL_rowList_number">{value2.uuid}</span>
                                                                                    </div>
                                                                                    <div className="cL_listing_table_cell cell4">
                                                                                        <span className="cL_rowList_number">{value2.major}</span>
                                                                                    </div>
                                                                                    <div className="cL_listing_table_cell cell5">
                                                                                        <span className="cL_rowList_number">{value2.minor}</span>
                                                                                    </div>

                                                                                    <div className="clEditDotes_cell cell7"> <span className="cL_rowList_number" style={{marginTop:'5px'}}>Active</span> <a className="cl_tableRow_editDotes"  style={{cursor:'pointer'}} onClick={this.handleButtonsShow}><i></i></a> </div>



                                                                                </div>
                                                                                <div className="cl_rowEdit_popOut">
                                                                                    <div className="cl_rowEdit_pop_table">
                                                                                        <div className="cl_rowEdit_popOut_tableRow">
                                                                                            <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1"> <a data-lavelid={value.venue_level} data-id={value2.id} className="cl_rowEdit_popOut_campaign_view"  style={{cursor:'pointer'}}> <strong><i>&nbsp;</i>View</strong></a> </div>
                                                                                            <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1"> <a onClick={(e)=>{this.editBeaconData(value2.id)}}  data-lavelid={value.venue_level} data-id={value2.id} className="edit_icon edit_beacon_data"  style={{cursor:'pointer'}}> <strong><i>&nbsp;</i>Edit</strong></a> </div>

                                                                                            <div className="cl_rowEdit_popOut_tableRow_cell eidtCell3"> <a onClick={(e)=>{this.deleteBeaconData(value2.id,value.venue_level)}} data-lavelid={value.venue_level} data-id={value2.id} className="delete_icon delete_beacon_data"  style={{cursor:'pointer'}}><strong><i>&nbsp;</i>Delete</strong></a> </div>

                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        );
                                                                    }
                                                                })
                                                            )}



                                                        </ul>
                                                    </div>
                                                </div>

                                            </div>
                                        );
                                    })
                                )}


                                <div id="level_show_0_details" className="popupDiv_detail_inner level_show_0 floor_levels_0" style={{display:'none'}}>
                                    <div className="backBttn">
                                        <a className="backButton"  style={{cursor:'pointer'}} onClick={this.closeModel}>BACK</a>
                                    </div>

                                    <div className="addFloor_info clearfix">
                                        <label>Floor Number</label>
                                        <div className="floor_quaintity">
                                            <div className="fieldIncremnt">
                                                <div className="quantity clearfix">
                                                    <input  min="1" step="1" defaultValue="1" name="floor_number[]" id="floor_number_0" className="floor_number_check" type="tel" />
                                                    <div className="quantity-nav">
                                                        <div className="quantity-button quantity-up"></div>
                                                        <div className="quantity-button quantity-down"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="floorNameInput">
                                            <input defaultValue="" placeholder="Floor number"  name="floor_name[]" id="floor_name_0" type="text" />
                                        </div>
                                        <button onClick={(e)=>{this.deleteFloorPlan(e)}} id={"delete_floor_0"}>DELETE LEVEL</button>
                                    </div>

                                    <div className="beacon_edit_delete" id="display_level_0">

                                        <div className="adRemove_removeMembrs_btn editFloorBtn" id="edit_floor_0">
                                            <input type="hidden" id={"img_level_name_0"} defaultValue="0" />
                                            <div className="proxitrgrr_chosBeacon_bldngMap" id={"image_place_0"} style={{maxHeight:'350px',marginBottom: '20px'}}>

                                                <span id={"outer_floor_image_0"}></span>
                                                <img id={"edit_floor_image_0"} style={{maxHeight: '350px',minHeight: '350px',maxWidth: '1059px',minWidth: '1059px'}}  alt="#" />
                                            </div>
                                        </div>
                                    </div>


                                    <div className="proxitrgrr_chosBeacon_bldngMap_out"><div id="image_place_0" className="floor_map_beacons" ></div></div>

                                    <div className="popup_upload_img" id={"upload_area_0"}>
                                        <div id="img_div_0" className="image_notify_upload_area">
                                            <input type="file" name="fileToUpload" id="fileToUpload_0" />
                                        </div>
                                    </div>



                                    <br />
                                    <div className="beacon_edit_delete venueAcc_search_addVenue clearfix">
                                        <ul className="custome_level_btns" id="edit_floor_0">
                                            <li>
                                                <a  style={{cursor:'pointer'}}  id="floor_0" name="add_floor_plan0" onClick={(e)=>{this.myFunction(e)}}>Save Floor Plane </a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="beaconCinfig_list">
                                        <div className="cL_listing_tableInn">

                                            <div className="cL_listing_tableTitle">
                                                <div className="cL_listing_table_row">
                                                    <div className="cL_listing_table_cell cell1">
                                                        <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Beacon Name</strong>
                                                    </div>
                                                    <div className="cL_listing_table_cell cell2">
                                                        <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Beacon Type</strong>
                                                    </div>
                                                    <div className="cL_listing_table_cell cell3">
                                                        <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>UUID</strong>
                                                    </div>
                                                    <div className="cL_listing_table_cell cell4">
                                                        <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Major</strong>
                                                    </div>
                                                    <div className="cL_listing_table_cell cell5">
                                                        <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Minor</strong>
                                                    </div>
                                                    <div className="cL_listing_table_cell cell7">
                                                        <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Status</strong>
                                                    </div>
                                                </div>

                                            </div>


                                            <ul>


                                                <li>
                                                    <div className="cL_listing_table_row">
                                                        <div className="cL_listing_table_cell cell1"> <span className="cL_rowList_number">Beacon Name Input</span> </div>
                                                        <div className="cL_listing_table_cell cell2">

                                                            <span className="cL_rowList_number">Estimote</span>
                                                        </div>
                                                        <div className="cL_listing_table_cell cell3">
                                                            <span className="cL_rowList_number">B9407F30-F5F8-466E-AFF9-25556B57FE6D</span>
                                                        </div>
                                                        <div className="cL_listing_table_cell cell4">
                                                            <span className="cL_rowList_number">1234567</span>
                                                        </div>
                                                        <div className="cL_listing_table_cell cell5">
                                                            <span className="cL_rowList_number">1234567</span>
                                                        </div>

                                                        <div className="clEditDotes_cell cell7 clearfix"> <span className="cL_rowList_number" style={{marginTop:'5px'}}>Active</span> <a className="cl_tableRow_editDotes"  style={{cursor:'pointer'}}><i></i></a> </div>



                                                    </div>
                                                    <div className="cl_rowEdit_popOut">
                                                        <div className="cl_rowEdit_pop_table">
                                                            <div className="cl_rowEdit_popOut_tableRow">
                                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1"> <a className="cl_rowEdit_popOut_campaign_view"  style={{cursor:'pointer'}}> <strong><i>&nbsp;</i>View</strong></a> </div>
                                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1"> <a className="edit_icon"  style={{cursor:'pointer'}}> <strong><i>&nbsp;</i>Edit</strong></a> </div>

                                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell3"> <a className="delete_icon"  style={{cursor:'pointer'}}><strong><i>&nbsp;</i>Delete</strong></a> </div>

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
                </div>
                {/*end of add level popup*/}





                {/*start of add beacon popup*/}
                <div className="popups_outer addBeacon_popup" id={"addBeacon_popup"} style={{display:'none'}}>
                    <div className="popups_inner">
                        <div className="overley_popup"></div>

                        <div className="popupDiv">
                            <div className="popupDiv_detail">

                                <div className="popup_heading clearfix">
                                    <h3>Add Beacon</h3>
                                    <a  style={{cursor:'pointer'}} data-attr="addBeacon_popup" className="popupClose">&nbsp;</a>
                                </div>


                                <div className="beacon_popupDeatail">
                                    <div className="beacon_popup_form">
                                        <div className="beacon_popup_img proxitrgrr_chosBeacon_bldngMap proxitrgrr_chosBeacon_bldngMap_1 bea_div" style={{maxHeight:'251px',maxWidth:'700px',minHeight:'251px',minWidth:'700px'}} >
                                            <span className="show-mutiple-beacons"></span> <span id="beacon-style-add" style={{display:'none'}} ></span>
                                            <img id="beaco_name_addCase" src="" alt="#" style={{minWidth: '100%', marginBottom:'13px', minHeight:'251px', height:'251px', pointerEvents:'none'}} />
                                        </div>


                                        <div className="venueIdentification_form" style={{marginTop:'11px'}}>
                                            <ul>
                                                <li>
                                                    <label>Beacon Name</label>
                                                    <input  defaultValue=""  type="hidden" id="becon_level_id" />
                                                    <div className="customInput_div"><input defaultValue="" id="becon_name" className="validate_entries" placeholder="Beacon Name" type="text" /></div>
                                                </li>

                                                <li>
                                                    <label>Beacon Type</label>
                                                    <div className="customInput_div"><input id="becon_type" className="validate_entries" defaultValue="" placeholder="Beacon Type" type="text" /></div>
                                                </li>
                                                <li>
                                                    <label>UUID</label>
                                                    <div className="customInput_div"><input id="becon_uuid" className="validate_entries" defaultValue="" placeholder="UUID" type="text" /></div>
                                                </li>
                                                <li>

                                                    <div className="major_minor_inputs clearfix">
                                                        <div className="major_minor_inputs_column">
                                                            <label>Major</label>
                                                            <div className="customInput_div"><input id="becon_major" className="validate_entries" defaultValue="" placeholder="Major" type="text" /></div>
                                                        </div>

                                                        <div className="major_minor_inputs_column">
                                                            <label>Minor</label>
                                                            <div className="customInput_div"><input defaultValue="" id="becon_minor" className="validate_entries" placeholder="Minor" type="text" /></div>
                                                        </div>
                                                    </div>


                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="continueCancel place_beacon" id={"add_beacon_popup_btn"} style={{display:"block"}}>
                                        <input defaultValue="SAVE" className="selecCompaignBttn" type="submit" onClick={this.saveBeconData} id="save_becon_data" />
                                        <a  style={{cursor:'pointer'}} id="place_becon">PLACE BEACON</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*end of add beacon popup*/}


                {/*start of edit beacon popup*/}
                <div className= "popups_outer editBeacon_popup" id={"editBeacon_popup"} style={{display:'none'}}>
                    <div className="popups_inner">
                        <div className="overley_popup"></div>

                        <div className="popupDiv">
                            <div className="popupDiv_detail">

                                <div className="popup_heading clearfix">
                                    <h3>Edit Beacon</h3>
                                    <a  style={{cursor:'pointer'}} data-attr="editBeacon_popup" className="popupClose">&nbsp;</a>
                                </div>


                                <div className="beacon_popupDeatail">
                                    <div className="beacon_popup_form">
                                        <div className="beacon_popup_img proxitrgrr_chosBeacon_bldngMap proxitrgrr_chosBeacon_bldngMap_1 edit_floor_beacons" style={{maxHeight:'251px',maxWidth:'700px',minHeight:'251px',minWidth:'700px'}} >
                                            <span className="show-mutiple-beacons"></span> <span id="beacon-style-edit" style={{display:'none'}}></span>
                                            <img id="beacon_image_edit" onClick={this.beaconImageEdit} src="" alt="#" style={{maxHeight:'251px',maxWidth:'700px',minHeight:'251px',minWidth:'700px'}} />
                                        </div>


                                        <div className="venueIdentification_form" style={{marginTop:'11px'}}>
                                            <ul>
                                                <li>

                                                    <label>Beacon Name</label>
                                                    <input  value=""  type="hidden" id="beacon_id" />
                                                    <div className="customInput_div"><input defaultValue="" id="becon_name_edit" className="validate_entries" placeholder="Beacon Name" type="text" /></div>
                                                </li>

                                                <li>
                                                    <label>Beacon Type</label>
                                                    <div className="customInput_div"><input id="becon_type_edit" className="validate_entries" defaultValue="" placeholder="Beacon Type" type="text" /></div>
                                                </li>
                                                <li>
                                                    <label>UUID</label>
                                                    <div className="customInput_div"><input id="becon_uuid_edit" className="validate_entries" defaultValue="" placeholder="UUID" type="text" /></div>
                                                </li>
                                                <li>

                                                    <div className="major_minor_inputs clearfix">
                                                        <div className="major_minor_inputs_column">
                                                            <label>Major</label>
                                                            <div className="customInput_div"><input id="becon_major_edit" className="validate_entries" defaultValue="" placeholder="Major" type="text" /></div>
                                                        </div>

                                                        <div className="major_minor_inputs_column">
                                                            <label>Minor</label>
                                                            <div className="customInput_div"><input defaultValue="" id="becon_minor_edit" className="validate_entries" placeholder="Minor" type="text" /></div>
                                                        </div>
                                                    </div>


                                                </li>
                                            </ul>
                                        </div>
                                    </div>


                                    <div className="continueCancel place_beacon" id={"edit_beacon_popup_btn"} style={{display:'block'}}>
                                        <input value="Update" className="selecCompaignBttn" type="submit" onClick={(e)=>{this.updateBeaconData()}} id="edit_becon_data" />
                                        <a  style={{cursor:'pointer'}} id="place_becon_edit">PLACE BEACON</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>


        );
    }//..... end of render() .....//


}//..... end of BeaconConfiguration.

BeaconConfiguration.propTypes = {};

export default BeaconConfiguration;