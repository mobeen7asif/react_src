import React, {Component} from 'react';
import ReactPaginate from 'react-paginate';
import {NotificationManager} from 'react-notifications';
import {connect} from "react-redux";
import {selectMessageBuilderObject} from "../../../../../../../redux/selectors/Selectors";
import {setSelectedEmailTemplate} from "../../../../../../../redux/actions/CampaignBuilderActions";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

class TemplatesComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data        : [],
            selectedPage: 0,
            totalRecords: 0,
            perPageCount: 12,
            EmailType   : 1,
            html        :"",
            preview_template_id        :0,
        };
    }//..... end of constructor() .....//

    handlePaginationClick = (data) => {
        this.setState((prevState) => ({selectedPage: data.selected}), () => {this.getTemplateList()});
    };//..... end of handlePaginationClick() .....//

    componentDidMount() {
        this.getTemplateList();
    }//..... end of componentDidMount() .....//

    selectTemplate = (e,template) => {
        let tag = e.target.tagName;
        if(tag === "BUTTON"){ return false; }
        this.props.dispatch(setSelectedEmailTemplate(template))
    };//..... end of selectTemplate() .....//

    getTemplateList() {
        show_loader();
        if(this.state.EmailType == 1){
            axios.get(`${BaseUrl}/api/list-email-templates?page=${this.state.selectedPage}&perPage=${this.state.perPageCount}`)
                .then((response) => {
                    show_loader();
                    if(response.data.status == true){
                        this.setState(() => ({
                            data: response.data.data,
                            totalRecords: response.data.totalRecords
                        }));
                    }

                }).catch(err => {
                show_loader();
                NotificationManager.error("Error occurred while getting Templates List.", 'Error');
            });

        }else{
            axios.get(`${BaseUrl}/api/email-templates-list?page=${this.state.selectedPage}&perPage=${this.state.perPageCount}`)
                .then((response) => {
                    show_loader();
                    if(response.data.status == true){
                        this.setState(() => ({
                            data: response.data.data,
                            totalRecords: response.data.totalRecords
                        }));
                    }
                }).catch(err => {
                show_loader();
                NotificationManager.error("Error occurred while getting Templates List.", 'Error');
            });
        }

    }//..... end of getTemplateList() ......//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    viewTemplate = (id) => {

        axios.get(`${BaseUrl}/api/get-template/${id}`)
            .then((response) => {

                if(response.data.status == true){
                    this.setState(()=>({html:response.data.html,preview_template_id:id}),()=>{
                        this.openPopup();
                    });
                }

            }).catch(err => {

            NotificationManager.error("Error occurred while getting Templates List.", 'Error');
        });
    };

    openPopup = () => {
        this.NewsCatPopup.style.display = "block";
    };

    closePopup = () => {
        this.NewsCatPopup.style.display = "none";
        this.setState(()=>({html:""}));
    };

    render() {
        return (
            <div className="messageBuilder_outer tempLibrary myClass">
                <div className="messageBuilder_heading">
                    <h3>Templates</h3>

                 {/*   <select onChange={(e)=>{this.getTemplate(e.target.value)}} style={{border:"1px solid lightgray",width:"200px",marginLeft:"974px",float:"left",marginTop:"10px",height:"27px"}}>
                        <option value="1">Decendra</option>
                        <option value="2">Engage</option>
                    </select>*/}
                </div>




                <div className="templateLibrary_listing">
                    <ul>
                        {
                            this.state.data.map((record) => (
                                <li key={record.id} onClick={(e)=>{ this.selectTemplate(e,record)}}>
                                    <div className={(this.props.messageBuilder.other.emailID.id === record.id) ? 'listHighlight templateLibrary_column': 'templateLibrary_column'}>
                                        <a  style={{cursor:'pointer'}}>
                                            {/*<img src={record.image} alt={record.name} />*/}
                                        </a>
                                        <div className="templateLibrary_text">
                                            <small>Date Created: {record.date}</small>
                                            <h4>{record.name}</h4>
                                            <p>{record.description} </p>

                                            <button onClick={()=>{this.viewTemplate(record.id)}}>View Template</button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <Pagination handlePaginationClick={this.handlePaginationClick} totalRecords={this.state.totalRecords} perPage={this.state.perPageCount}/>

                <div className= "popups_outer addNewsCategoryPopup" ref={(ref)=>{this.NewsCatPopup = ref}} style={{display: 'none'}}>

                    <div className="popups_inner">
                        <div className="overley_popup" data-attr="addNewUser_popup" onClick={()=>this.closePopup()}></div>
                        <div className="popupDiv3">
                            <div className="popupDiv_detail">
                                <div className="popup_heading clearfix">
                                    <h3>Email Preview</h3>
                                    <a href="javascript:void(0)" data-attr="addNewUser_popup" className="popupClose close_popup" onClick={()=>this.closePopup()}>&nbsp;</a>
                                </div>

                                <div className="beacon_popupDeatail3">
                                    <div className="beacon_popup_form">
                                        <div className="venueIdentification_form" style={{height:"calc(100vh - 100px)"}}>
                                            <ul style={{height:"100%"}}>
                                                <li style={{height:"100%"}} >
                                                    <iframe src={BaseUrl+"/list-email-view/"+this.state.preview_template_id+"?venue_id="+VenueID} frameBorder="0"
                                                            style={{overflow:"hidden",height:"",width:"100%"}}
                                                            width="100%"></iframe>

                                                </li>

                                            </ul>
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
}//..... end of TemplatesComponent.

function Pagination(props) {
    const totalRecords = parseInt(props.totalRecords) / parseInt(props.perPage);
    return (
        <div className="campLstng_paginaton_out">
            <div className="campLstng_paginaton_inn">
                <ReactPaginate previousLabel={""}
                               nextLabel={""}
                               nextLinkClassName={'campPagi_next'}
                               breakLabel={<a href="">...</a>}
                               breakClassName={"break-me"}
                               pageCount={totalRecords}
                               marginPagesDisplayed={2}
                               pageRangeDisplayed={5}
                               previousLinkClassName={'campPagi_prev'}
                               onPageChange={props.handlePaginationClick}
                               activeClassName={"active"}/>
            </div>
        </div>
    );
}//..... end of Pagination() ......//

const mapStateToProps = (state) => {
    return {
        messageBuilder  : selectMessageBuilderObject(state.campaignBuilder.messageBuilder, state.campaignBuilder.currentChannel),
        currentChannel  : state.campaignBuilder.currentChannel
    };
};
export default connect(mapStateToProps)(TemplatesComponent);