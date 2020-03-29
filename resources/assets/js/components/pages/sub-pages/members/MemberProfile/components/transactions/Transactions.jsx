import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";
import Listing from "./sub_components/Listing";
import GraphStats from "./sub_components/GraphStats";

class Transactions extends Component {

    state = {
        memberDetail : {},
        mobile_number : [],
        gender : '',
        home_address_lat : 0.0,
        home_address_long : 0.0,
        key : 'a'
    };

    constructor(props) {
        super(props);
    }//..... end of constructor() .....//



    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="e_member_right">
                <div className="add_category_listing">
                    <ul>
                        <li>
                            <div className="add_categoryList_info addProduct_setting">
                                <div className="newVualt_heading">
                                    <h3>Member / <a href="javascript:void(0);">Transactional</a></h3>
                                </div>
                                <div className="categoryInfo_container clearfix">
                                    <div className="addCategoryRight_section">
                                        <div className="edit_category_rightDetail removeHighlights">
                                            <div className="e_transactions_main">

                                                <GraphStats persona_id={this.props.persona_id}/>

                                                <Listing persona_id={this.props.persona_id}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

        );
    }//..... end of render() .....//
}//..... end of Member.

Transactions.propTypes = {};

export default Transactions;
