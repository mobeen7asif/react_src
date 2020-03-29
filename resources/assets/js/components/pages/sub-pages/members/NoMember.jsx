import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MemberList from "./MemberList";
import MemberInsight from "./MemberInsight";

class NoMember extends Component {
    constructor(props) {
        super(props);

    }//..... end of constructor() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

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
                                                    src={BaseUrl+"/assets/images/nomember_icon.png"} alt="#"/></span>
                                                    <h1>No members currently availble</h1>
                                                    <p>View a list of your current and past members. You can search,
                                                        edit, and view
                                                        customer and segment reports depending type and status.</p>
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
}

NoMember.propTypes = {};

export default NoMember;