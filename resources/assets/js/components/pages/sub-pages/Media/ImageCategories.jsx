import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MediaLinks from "./MediaLinks";
import {NotificationManager} from "react-notifications";

class ImageCategories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadData:true
        };
        this.categoryData = [];
        this.addCategory = this.addCategory.bind(this);
        this.saveCategory = this.saveCategory.bind(this);
        this.cancelCategory = this.cancelCategory.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.getCategories();

    }//..... end of constructor() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    addCategory =() => {
        document.getElementById("category_id").value="0";
        document.getElementById("categoryPopup").style.display = "block";
        this.setState({loadDate:!this.state.loadData});
    };

    saveCategory = () => {
        var id = document.getElementById("category_id").value;
        var title = document.getElementById("category_title").value;
        if(title == ""){
            alert("Please enter title"); return false;
        }
        show_loader();
        axios.post(BaseUrl + '/api/save-image-categories',{id: id, title:title})
            .then(res => {
                this.categoryData = res.data;
                document.getElementById("category_id").value="0";
                document.getElementById("category_title").value="";
                document.getElementById("categoryPopup").style.display = "none";
                this.getCategories();
                NotificationManager.success("Category created successfully.", 'success',1500);
                show_loader();

            }).catch((err) => {
            NotificationManager.error("Error occurred while creating category .", 'success',1500);
            show_loader();
        });


    };

    cancelCategory = () => {
        document.getElementById("category_id").value="0";
        document.getElementById("category_title").value="";
        document.getElementById("categoryPopup").style.display = "none";

    };

    getCategories = () => {
        axios.post(BaseUrl + '/api/get-image-categories',{'venue_id':23020,search:$(".SearchBox").val().trim()})
            .then(res => {
                 this.categoryData = res.data;
                     this.setState({loadData:!this.state.loadData});
            }).catch((err) => {
            NotificationManager.error("Error occurred while getting image categories .", 'Error');
        });
    };

    componentDidMount = () => {
        let $this = this;
        $("body").on("keyup",".SearchBox",function (e) {
            $this.getCategories();
        });
    };
    componentWillUnmount = () => {
        $(".SearchBox").off("keyup");
        $(".customDropDown span").off("click");
        $(".customDropDown_show li").off("click");
    };




    render() {

        return (
            <React.Fragment>
                <div className="media_galery_section">
                    <div className="media_galery_heading">
                        <h3>Categories</h3>
                    </div>

                    <div className="media_category_listing">
                        <ul>
                            <li>
                                <div className="media_category_pic">
                                    <a   style={{cursor:'pointer'}} onClick={this.addCategory}>
                                        <img src={BaseUrl+"/assets/images/add_categoryImg@2x.png"} alt="#" />
                                    </a>
                                    <span>Add New Category</span>
                                </div>
                            </li>

                            {this.categoryData.length > 0 && (
                                this.categoryData.map((value,key)=>{
                                    return (
                                        <li key={key}>
                                            <div className="media_category_pic">
                                                <a  style={{cursor:'pointer'}}>
                                                    <img src={"https://generalstoragemax.s3.ap-southeast-2.amazonaws.com/generalstoragemax/"+value.path} alt="#" />
                                                </a>
                                                <span>{value.title}</span>
                                                <small>{value.total_categories} </small>
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

                <div className="popups_outer creatCategory_popup" id="categoryPopup"  style={{display:"none"}}>
                    <div className="popups_inner">
                        <div className="overley_popup"></div>

                        <div className="popupDiv">
                            <div className="popupDiv_detail">

                                <div className="popup_heading clearfix">
                                    <h3>UPLOAD IMAGE</h3>
                                    <a  style={{cursor:'pointer'}} className="popupClose" onClick={this.cancelCategory}>&nbsp;</a>
                                </div>


                                <div className="beacon_popupDeatail">
                                    <div className="addCategry_list_form ">
                                        <h4>Name of Category </h4>
                                        <div className="popupList_Scroll_list popupList_Scroll">
                                            <ul>
                                                <li>
                                                    <div className="add_category_data">
                                                        <input  type="hidden" id="category_id" defaultValue="0" />
                                                        <input  type="text" id="category_title" placeholder="Category Name Input" />
                                                        <a  style={{cursor:'pointer'}} className="addCatgry">&nbsp;</a>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                    </div>


                                    <div className="continueCancel place_beacon">
                                        <input defaultValue="SAVE" onClick={this.saveCategory}  />
                                            <a  style={{cursor:'pointer'}} onClick={this.cancelCategory}>CANCEL</a>
                                    </div>

                                </div>




                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of ImageCategories.

ImageCategories.propTypes = {};

export default ImageCategories;