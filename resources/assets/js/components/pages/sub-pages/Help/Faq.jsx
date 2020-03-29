import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NotificationManager} from "react-notifications";
import ReactHtmlParser, {processNodes, convertNodeToElement, htmlparser2} from 'react-html-parser';
import CKEditor from "react-ckeditor-component";
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import ReactSortable from 'react-sortablejs';

class Faq extends Component {
    state = {
        listFaqs: [],
        is_edit: 0,
        title: "",
        type: "faqs",
        description: "",
        faq_category_id: this.props.category_id,
        listSortedItems: [],
        order: [],
    };

    constructor(props) {
        super(props);

    }//..... end of constructor() .....//
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    componentDidMount = () => {
        this.getFaqs();
    };

    getFaqs = (value = '') => {

        axios.post(BaseUrl + '/api/faqs', {
            'search': value,
            venue_id: VenueID,
            company_id: CompanyID,
            faq_category_id: this.state.faq_category_id
        })
            .then(res => {
                this.setState({listFaqs: res.data.faq_page});
            }).catch((err) => {
        });
    };

    openPopup = () => {
        this.resetForm();
        this.FaqPopupRef.style.display = "block";
        this.saveCategoryBtn.classList.add("disabled");
    };

    closePopup = () => {
        this.FaqPopupRef.style.display = "none";
    };

    saveFaq = () => {
        show_loader();
        axios.post(BaseUrl + '/api/save-faqs', {...this.state, venue_id: VenueID, company_id: CompanyID, order_id: 0})
            .then(res => {
                this.setState(() => ({
                    is_edit: 0,
                    title: "",
                    description: "",

                }), () => {
                    this.closePopup();
                    this.getFaqs();
                });
                show_loader();
                NotificationManager.success(res.data.message, 'Success');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while adding Faq .", 'Error');
        });
    };

    editFaq = (value) => {
        this.setState(() => ({is_edit: value.id, title: value.title, description: value.description}), () => {
            this.FaqPopupRef.style.display = "block";
            this.saveCategoryBtn.classList.add("disabled");
        });
    };

    onChangeDescriptions = (evt) => {
        let description = evt.editor.getData();
        this.handleChange({description})
    };//..... end of onChangeDescriptions() .....//

    handleChange = (obj) => {
        this.setState(() => (obj), () => {
            this.validation();
        });
    };//..... end of handleChange() .....//

    validation = () => {
        if (this.state.title == "" || this.state.description == "")
            this.saveCategoryBtn.classList.add("disabled");
        else
            this.saveCategoryBtn.classList.remove("disabled");
    };

    resetForm = () => {
        this.setState(() => ({title: "", description: ""}));
    }


    deleteFaq = (id) => {
        show_loader();
        axios.post(BaseUrl + '/api/delete-faq', {faq_id: id})
            .then(res => {
                this.getFaqs();
                show_loader();
                NotificationManager.success(res.data.message, 'Success');
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while deleting Faq .", 'Error');
        });
    };

    onChangeOrder = (order, sortable, evt) => {
        var items = [];
        order.map((value) => {
            this.state.listFaqs.map((value2, key2) => {
                if (value2.id == value) {
                    items.push(value2);
                }
            });
        });

        this.setState(() => ({listFaqs: items, order}), () => {
            show_loader();
            axios.post(BaseUrl + '/api/save-updated-faqs', {
                updated_faqs: this.state.listFaqs,
                cat_id: this.props.category_id
            })
                .then(res => {
                    this.setState({order: []});
                    show_loader(true);
                }).catch((err) => {
                show_loader(true);
                NotificationManager.error("Error occurred while adding Order.", 'Error');
            });


        });
    };

    render() {
        return (
            <React.Fragment>
                <div className="compaignHeadigs">
                    <h1>Frequently Asked Questions</h1>
                    <p>{this.props.category_name} FAQ’s</p>


                </div>
                <div className="media_container faqContainer">

                    <div className="backSave_buttons" style={{width: "96%"}}>
                        <ul>
                            <li>
                                {(appPermission("Faqs", "add")) && (
                                    <a  style={{cursor:'pointer'}} className="selecBttn" onClick={() => {
                                        this.openPopup()
                                    }}>Add Faq</a>
                                )}
                            </li>
                        </ul>
                    </div>


                    <div className="faq_description_section">

                        <div className="faq_description_detail">
                            <div className="faq_description_list">
                                <ReactSortable tag="ul" onChange={(order, sortable, evt) => {
                                    this.onChangeOrder(order, sortable, evt);
                                }}>
                                    {this.state.listFaqs.length > 0 && (
                                        this.state.listFaqs.map((value, key) => {
                                            return (
                                                <li key={key} data-id={value.id}>
                                                    <div className="faq_questions" style={{background: "lightgray"}}>
                                                        <div
                                                            className={key === 0 ? "faq_questions_head activeBar" : "faq_questions_head"}>
                                                            <div className="faq_questions_cell faq_cell1 rightBorder">
                                                                <strong>{key + 1}</strong>

                                                            </div>
                                                            <div className="faq_questions_cell faq_cell2">
                                                                <p>{value.title}</p>
                                                                {(appPermission("Faqs", "edit")) && (
                                                                    <a className="edit_icon" style={{
                                                                        float: "right",
                                                                        marginTop: "-25px",
                                                                        marginRight: '15px'
                                                                    }} onClick={() => {
                                                                        this.editFaq(value)
                                                                    }}></a>
                                                                )}
                                                                {(appPermission("Faqs", "delete")) && (
                                                                    <small className="delete_button" style={{
                                                                        marginRight: "-24px",
                                                                        marginTop: "2px"
                                                                    }} onClick={() => {
                                                                        this.deleteFaq(value.id)
                                                                    }}>&nbsp;</small>
                                                                )}
                                                            </div>

                                                            <small className="accordian_inactive click_acc"
                                                                   style={{marginRight: "20px"}}>&nbsp;</small>


                                                        </div>

                                                        <div className="faq_questions_show showfaq_data"
                                                             style={{display: key === 0 ? 'block' : ""}}>
                                                            {ReactHtmlParser(value.description)}
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    )}

                                </ReactSortable>

                            </div>

                        </div>

                    </div>

                    <div className="popups_outer addNewsCategoryPopup" ref={(ref) => {
                        this.FaqPopupRef = ref
                    }} style={{display: 'none'}}>
                        <div className="popups_inner">
                            <div className="overley_popup" data-attr="addNewUser_popup"
                                 onClick={() => this.closePopup()}></div>

                            <div className="popupDiv2" style={{width: "1024px", left: "33%"}}>
                                <div className="popupDiv_detail">

                                    <div className="popup_heading clearfix">
                                        <h3>ADD/Edit FAQ's</h3>
                                        <a  style={{cursor:'pointer'}} data-attr="addNewUser_popup"
                                           className="popupClose close_popup"
                                           onClick={() => this.closePopup()}>&nbsp;</a>
                                    </div>

                                    <div className="beacon_popupDeatail"><br/><br/>
                                        <div className="beacon_popup_form">

                                            <div className="venueIdentification_form">
                                                <ul>
                                                    <li>
                                                        <label>Title</label>
                                                        <div className="customInput_div">
                                                            <input value={this.state.title}
                                                                   onChange={(e) => this.handleChange({title: e.target.value})}
                                                                   id="title" placeholder="Title"/>
                                                        </div>
                                                    </li>

                                                    <li>
                                                        <div className="customPlaceholder_outer">
                                                            <h4>Description</h4>
                                                            <CKEditor activeClass="p10" content={this.state.description}
                                                                      events={{"change": this.onChangeDescriptions}}/>
                                                        </div>
                                                    </li>


                                                </ul>
                                            </div>
                                        </div>

                                        <div className="continueCancel place_beacon createUserButtons">
                                            <input ref={(ref) => {
                                                this.saveCategoryBtn = ref;
                                            }} className="disabled selecCompaignBttn save_category" defaultValue="Save"
                                                   onClick={(e) => {
                                                       this.saveFaq()
                                                   }}/>
                                            <a  style={{cursor:'pointer'}} className="close_popup"
                                               onClick={() => this.closePopup()}>CANCEL</a>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of Faq.

Faq.propTypes = {};

export default Faq;