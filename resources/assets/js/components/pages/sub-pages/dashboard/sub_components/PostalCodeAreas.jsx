import React, {Component} from 'react';


class PostalCodeAreas extends Component {
    /*state ={
        popupShow :false,
        segmentType:'',
        showPopupDetail:false
    };

    getSegmentData = (data,name) => {
        this.setState({segmentType:name,showPopupDetail:true});
        this.props.popupShow(name);
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//*/

    render() {
        return (
            <div className="e_postalCode_area">
                <div className="e_dboard_whiteBox">
                    <div className="columnHeading clearfix">
                        <label className="width_50">TOP POSTAL CODE AREAS</label>
                        <div className="columnHeading_right clearfix">
                            <div className="selectCompaign">
                                <div className="customDropDown_placeholder "> <span>Select Top 5 Customers</span>
                                    <select>
                                        <option>Select Top 5 Customers</option>
                                        <option>This Year2</option>
                                        <option>This Year3</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="category_list_outer">
                        <div className="cL_listing_tableInn productTble_listingout">
                            <div className="cL_listing_tableTitle">
                                <div className="cL_listing_table_row productTble_listing">
                                    <div className="cL_listing_table_cell matrics_cell_1 "> </div>
                                    <div className="cL_listing_table_cell productCell_1 "> <strong className="padingLeft30 sortHidden"><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Postal Code</strong> </div>
                                    <div className="cL_listing_table_cell  productCell_2 "> <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Male</strong> </div>
                                    <div className="cL_listing_table_cell  productCell_3 "> <strong><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Female</strong> </div>
                                    <div className="cL_listing_table_cell   productCell_4"> <strong className="sortHidden"><span style={{marginBottom: '10px', float: 'left'}}><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Other</strong> </div>
                                    <div className="cL_listing_table_cell   productCell_4"> <strong className="sortHidden"><span><b><img src="assets/images/sortAerrow_top.png" alt="#" /></b><b><img src="assets/images/sortAerrow_bottom.png" alt="#" /></b></span>Total</strong> </div>
                                </div>
                            </div>
                            <ul>
                                <li>
                                    <div className="listDataShowing">
                                        <div className="cL_listing_table_row">
                                            <div className="customer_matrics_cell matrics_cell_1 ">
                                                <label>1</label>
                                            </div>
                                            <div className="cL_listing_table_cell  productCell_1"> <span className="cL_rowList_number padingLeft25"><img src="assets/images/profile_img@2x.png" alt="#" className="profile_img" />Postal Code Input</span> </div>
                                            <div className="cL_listing_table_cell  productCell_2"> <span className="cL_rowList_number">34 567</span> </div>
                                            <div className="cL_listing_table_cell  productCell_3"> <span className="cL_rowList_number">34 567</span> </div>
                                            <div className="cL_listing_table_cell productCell_4"> <span className="cL_rowList_number">34 567</span> </div>
                                            <div className="cL_listing_table_cell productCell_4"> <span className="cL_rowList_number padingLeft25" style={{marginTop: '5px'}}><img src="assets/images/triangleHigh@2x.png" alt="#" />$00.00</span></div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="listDataShowing">
                                        <div className="cL_listing_table_row">
                                            <div className="customer_matrics_cell matrics_cell_1 ">
                                                <label>2</label>
                                            </div>
                                            <div className="cL_listing_table_cell  productCell_1"> <span className="cL_rowList_number padingLeft25"><img src="assets/images/profile_img@2x.png" alt="#" className="profile_img" />Postal Code Input</span> </div>
                                            <div className="cL_listing_table_cell  productCell_2"> <span className="cL_rowList_number">34 567</span> </div>
                                            <div className="cL_listing_table_cell  productCell_3"> <span className="cL_rowList_number">34 567</span> </div>
                                            <div className="cL_listing_table_cell productCell_4"> <span className="cL_rowList_number">34 567</span> </div>
                                            <div className="cL_listing_table_cell productCell_4"> <span className="cL_rowList_number padingLeft25" style={{marginTop: '5px'}}><img src="assets/images/triangleLow@2x.png" alt="#" />$00.00</span></div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="listDataShowing">
                                        <div className="cL_listing_table_row">
                                            <div className="customer_matrics_cell matrics_cell_1 ">
                                                <label>3</label>
                                            </div>
                                            <div className="cL_listing_table_cell  productCell_1"> <span className="cL_rowList_number padingLeft25"><img src="assets/images/profile_img@2x.png" alt="#" className="profile_img" />Postal Code Input</span> </div>
                                            <div className="cL_listing_table_cell  productCell_2"> <span className="cL_rowList_number">34 567</span> </div>
                                            <div className="cL_listing_table_cell  productCell_3"> <span className="cL_rowList_number">34 567</span> </div>
                                            <div className="cL_listing_table_cell productCell_4"> <span className="cL_rowList_number">34 567</span> </div>
                                            <div className="cL_listing_table_cell productCell_4"> <span className="cL_rowList_number padingLeft25" style={{marginTop: '5px'}}><img src="assets/images/triangleHigh@2x.png" alt="#" />$00.00</span></div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="listDataShowing">
                                        <div className="cL_listing_table_row">
                                            <div className="customer_matrics_cell matrics_cell_1 ">
                                                <label>4</label>
                                            </div>
                                            <div className="cL_listing_table_cell  productCell_1"> <span className="cL_rowList_number padingLeft25"><img src="assets/images/profile_img@2x.png" alt="#" className="profile_img" />Postal Code Input</span> </div>
                                            <div className="cL_listing_table_cell  productCell_2"> <span className="cL_rowList_number">34 567</span> </div>
                                            <div className="cL_listing_table_cell  productCell_3"> <span className="cL_rowList_number">34 567</span> </div>
                                            <div className="cL_listing_table_cell productCell_4"> <span className="cL_rowList_number">34 567</span> </div>
                                            <div className="cL_listing_table_cell productCell_4"> <span className="cL_rowList_number padingLeft25" style={{marginTop: '5px'}}><img src="assets/images/triangleLow@2x.png" alt="#" />$00.00</span></div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="listDataShowing">
                                        <div className="cL_listing_table_row">
                                            <div className="customer_matrics_cell matrics_cell_1 ">
                                                <label>5</label>
                                            </div>
                                            <div className="cL_listing_table_cell  productCell_1"> <span className="cL_rowList_number padingLeft25"><img src="assets/images/profile_img@2x.png" alt="#" className="profile_img" />Postal Code Input</span> </div>
                                            <div className="cL_listing_table_cell  productCell_2"> <span className="cL_rowList_number">34 567</span> </div>
                                            <div className="cL_listing_table_cell  productCell_3"> <span className="cL_rowList_number">34 567</span> </div>
                                            <div className="cL_listing_table_cell productCell_4"> <span className="cL_rowList_number">34 567</span> </div>
                                            <div className="cL_listing_table_cell productCell_4"> <span className="cL_rowList_number padingLeft25" style={{marginTop: '5px'}}><img src="assets/images/triangleHigh@2x.png" alt="#" />$00.00</span></div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of DetailList.

export default PostalCodeAreas;