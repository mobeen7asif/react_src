import React, {Component} from 'react';
import HeaderComponent from "./HeaderComponent";
import {NotificationManager} from "react-notifications";
class ProductSold extends Component {

    state = {
        response_status : false,
        start_date : '',
        end_date : '',
        series : [],
        categories : [],
        products_data : [],
        products_exist: true,
        products_limit : 10,
        state_changed : false,
        sort_type: 'prd_name',
        sort_by: 'asc',
        headerList: [
            {"id": "1", "name": 'Sr #', 'filterName': 'prd_name', 'disable_sort': true},
            {"id": "2", "name": 'Item Name', 'filterName': 'prd_name'},
            {"id": "3", "name": 'Revenue', 'filterName': 'prd_revnue'},
            {"id": "4", "name": 'Items Sold', 'filterName': 'items_sold'}
        ]
    };

    componentDidMount = () => {
        // show_loader();
        this.preLoader = $("body").find('.preloader3');
       // this.getProductsData();
    };

    componentWillReceiveProps(props) {
        if((!props.dateHandler.showDatePicker && props.dateHandler.applyFilter)){
            this.setState(()=>({
                    start_date: props.dateHandler.start_date,
                    end_date: props.dateHandler.end_date
                }),
                () => {this.getProductsData();});
            // show_loader(true);
        }
    }

    getProductsData = () => {
        // show_loader();
        let url =  BaseUrl+'/api/soldi-products-data';

        axios.post(url,{
            'company_id': CompanyID,
            'venue_id': VenueID,
            'start_date': this.props.dateHandler.start_date,
            'end_date' : this.props.dateHandler.end_date,
            'filterby' : this.props.dateHandler.filterPeriod,
            'top_items' : this.state.products_limit,
            'sort_by' : this.state.sort_by,
            'sort_type' : this.state.sort_type,
            'api_key'   : this.props.api_key,
            'secret_key' : this.props.secret_key,
            'business_id' : this.props.business_id,
            'business_name': this.props.business_name
        }).then((response) => {
            if(response.data.status){

                this.setState({
                    products_data:response.data.data.ProductSoldData.TopProducts,
                    products_exist: response.data.data.ProductSoldData.TopProducts.length > 0 ? true : false
                })
                if(this.state.state_changed){
                    show_loader(true);
                }
            }else{
                // show_loader(true);
            }
        }).catch((err) => {

            // show_loader(true);
            NotificationManager.error("Internal Server error occurred.", 'Error');
        });

    };//..... end of getMemberStats() .....//*/

    handleChange(e){
        show_loader();

        var text = $("#myId2 option:selected").text();
        $("#myId2").prev('span').text(text);
        this.setState({
            products_limit: e.target.value,
            state_changed : true
        }, () => {this.getProductsData()})
    }

    sortProductsData(){
        show_loader();
        this.getProductsData();
    }

    render() {
        return (
            <div className="e_postalCode_area e_productSold_main">
                <div className="e_dboard_whiteBox">
                    <div className="columnHeading clearfix">
                        <label className="width_50">TOP Products Sold</label>
                        <div className="columnHeading_right clearfix">
                            <div className="selectCompaign">
                                <div className="customDropDown_placeholder "> <span>Select Top 10 Products</span>
                                    <select id = 'myId2' onChange = {this.handleChange.bind(this)}>
                                        <option value={10} >Select Top 10 Products</option>
                                        <option value = {15} >Select Top 15 Products</option>
                                        <option value = {20} >Select Top 20 Products</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="category_list_outer">
                        <div className="cL_listing_tableInn productTble_listingout memberTable_cells_product_listing">

                            {this.state.products_exist > 0 ?
                                <div>
                                <HeaderComponent listData={this.state} onClick={(id, name) => this.setState({
                                    sort_type: id,
                                    sort_by: name,
                                    state_changed : true
                                }, () => this.sortProductsData())}/>

                                <ul>
                                    {
                                        this.state.products_data.map((row, index) => (
                                            <li key = {index + 1}>
                                                <div className="listDataShowing">
                                                    <div className="cL_listing_table_row ">
                                                        <div className="customer_matrics_cell matrics_cell_1 ">
                                                            <label>{index + 1}</label>
                                                        </div>
                                                        <div className="cL_listing_table_cell  productCell_1"> <span className="cL_rowList_number padingLeft25"><img src={(row.prd_image)?row.prd_image:'images/defaultImage.png'} alt='' className="profile_img" />{row.prd_name}</span> </div>
                                                        <div className="cL_listing_table_cell  productCell_2"> <span className="cL_rowList_number">{row.prd_revnue}</span> </div>
                                                        <div className="cL_listing_table_cell  productCell_3"> <span className="cL_rowList_number">{row.items_sold}</span> </div>

                                                    </div>
                                                </div>
                                            </li>
                                        ))
                                    }

                                </ul>
                                </div>
                                :
                                <div className="data_notFound_detail">
                                    <div className="data_notFound_data">
                                        <span><img src="images/not_found_img.png" alt="#" /></span>
                                        <strong>Sorry, no data found</strong>
                                        <p>There is currently no data for the selected report</p>
                                    </div>
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of DetailList.

export default ProductSold;