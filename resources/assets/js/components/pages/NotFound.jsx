import React, {Component} from 'react';
import PropTypes from 'prop-types';
import News from "./sub-pages/MyApplication/News";
import NewsCategory from "./sub-pages/MyApplication/NewsCategory";
import QuickBoard from "./sub-pages/MyApplication/QuickBoard";
import AddEditQuickBoard from "./sub-pages/MyApplication/AddEditQuickBoard";
import QuickBoardLevels from "./sub-pages/MyApplication/QuickBoardLevels";
class NotFound extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMenu :"NewsCategory",
            quickBoardData:0
        };
    }//..... end of constructor() .....//





    render() {
        return (
            <div className="e_member_content">
                <div className="containerSection">
                    <div className="searchSection">
                        <div className="searchSection_bar">

                        </div>
                    </div>
                    <div className="nomember_auto">
                        <div className="newVualt_container_detail">
                            <div className="newVualt_detail_outer addShaddowBox">
                                <div className="nomember_main">
                                    <div className="nomember_table">
                                        <div className="nomember_tableCell">
                                            <div className="nomember_inner">
                                                <div className="nomember_detail"><span><img
                                                    src={BaseUrl+"/assets/images/popup_close@2x.png"} alt="#"/></span>
                                                    <h1>Page not found</h1>
                                                    <p>The page you are looking for is not found.</p>
                                                    {/*<div className="backSave_buttons">*/}
                                                    {/*<ul>*/}
                                                    {/*<li><a  style={{cursor:'pointer'}} className="selecBttn">ADD*/}
                                                    {/*MEMBER</a></li>*/}
                                                    {/*</ul>*/}
                                                    {/*</div>*/}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of MyApplication.

NotFound.propTypes = {};

export default NotFound;