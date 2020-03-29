import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { SketchPicker } from 'react-color';
import {NotificationManager} from "react-notifications";
import {connect} from 'react-redux';
import MultiSelectReact from "multi-select-react";
import {
    resetPunchCardState,
    setBusiness,
    setEditData,
    setKeyValue,
    setDiscountTypeData
} from "../../../../redux/actions/PunchCardActions";
import {prepareEditData, selectPunchCardDataForSaving, setFrequencyTime} from "../../../../redux/selectors/Selectors";
import {validatePunchCardData} from "../../../../utils/Validations";
import 'rc-time-picker/assets/index.css';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import 'rc-tree/assets/index.css';
import ImageCropping from "../../ImageCropping";
import {find} from 'lodash';

class AddPunchCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            src: null,
            businessList : []
        };
    }//..... end of constructor() .....//

    customDropDownDiscountRef     = null;
    customDropDownDiscountOneRef  = null;
    canvas                        = null;

    savePunchCard = () => {
        if (! this.canvas && this.state.src) {
            NotificationManager.warning("Please crop the image.", 'Image Cropping!');
            return false;
        }//..... end if() .....//

        let image = this.canvas ? this.canvas.toDataURL('image/jpeg') : null;

        if (! image && ! this.props.image) {
            NotificationManager.warning("Please select the image.", 'Image Missing');
            return false;
        }//..... end if() .....//

        if (validatePunchCardData(this.props.dataToSave, this.state.businessList)) {
            NotificationManager.warning("Please fill all the required fields.", 'Missing Fields');
            return false;
        } else {
            show_loader();

            axios.post(BaseUrl + '/api/save-punch-card', {
                ...this.props.dataToSave,
                editId: Object.keys(this.props.punchCard).length > 0 ? this.props.punchCard.id : 0,
                image,
                venue_id: VenueID,
                company_id: CompanyID,
                businesses: JSON.stringify(this.state.businessList.filter(b => b.value && delete b.value))
            }).then((response) => {
                    show_loader(true);
                    NotificationManager.success('Stamp Card saved successfully!', 'Success');
                    this.redirectToListing();
                }).catch((err)=> {
                show_loader(true);
                NotificationManager.error("Error occurred while saving Stamp Card, please try later.", 'Error');
            });
        }//..... end if-else() .....//
    };//..... end of savePunchCard() .....//

    handleDropDownDiscountClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownDiscountOneRef.style.display =  this.customDropDownDiscountOneRef.style.display === 'none' ? 'block' : 'none';
    };//..... end of handleDropDownDiscountClick() .....//

    getBusinessList = (selectedBusinesses = []) => {
        show_loader();
        axios.get(BaseUrl + '/api/business-list?venue_id='+VenueID)
            .then((response) => {
                show_loader(true);
                if (response.data.status) {
                    this.setState(() => ({businessList: response.data.data.map(b => {
                            if (find(selectedBusinesses, function(o) {return o.id === b.id}))
                                b.value = true;
                            return b;
                        })}));
                } else {
                    NotificationManager.warning("Could not get businesses list.", 'No Data');
                }//..... end if-else() .....//
            }).catch((err)=> {
            show_loader(true);
            NotificationManager.error("Error occurred while fetching businesses.", 'Error');
        });
    };//..... end of getBusinessList() ......//


    setNumberValue = (key, value) => {
        if(this.props.discount_type == "%" && value > 100){
            return false;
        }
        this.props.dispatch(setKeyValue(key, value));
    };//..... end of setNumberValue() .....//

    componentDidMount() {
        $('.arrow').html('&nbsp;');
        if (Object.keys(this.props.punchCard).length > 0)
            this.loadEditData(this.props.punchCard);
        else {
            this.props.dispatch(resetPunchCardState());
        }
    };//..... end of componentDidMount() .....//

    handleColorChange = (color) => {
        this.setNumberValue('card_color', color.hex);
    };//..... end of handleColorChange() .....//

    setFilename = (fileName) => {
        this.setNumberValue('image', fileName);
    };//..... end of setFilename() .....//

    loadEditData = (punchCard) => {
        let selected_businesses = JSON.parse(punchCard.businesses);
         this.props.dispatch(setEditData(prepareEditData(punchCard, this.props.businessList)));
         this.getBusinessList(selected_businesses);
    };//..... end of loadEditData() .....//

    redirectToListing = () => {
        this.props.dispatch(resetPunchCardState());
        this.props.addPunchCard('listing');
    };

    setDiscountType = (data) =>{
        this.customDropDownDiscountOneRef.style.display = 'none';
        this.customDropDownDiscountRef.classList.remove('changeAero');
        this.props.dispatch(setDiscountTypeData(data));
    };//----- setDiscountType() ----//

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

    optionClicked = (businessList) => {
        this.setState({businessList});
    };//..... end of optionClicked() .....//

    selectedBadgeClicked = (businessList) => {
        this.setState({businessList});
    };//..... end of selectedBadgeClicked() .....//

    handleChange = (obj) => {
        this.setState(()=>(obj));
    };//..... end of handleChange() .....//

    checkValidIbs = (e) => {
        let value = e.target.value;
        if(value == "")
            value = 0;

        if (! isFinite(value))
            return false;

        if (value > 999)
            return false;

        if (value.length > 3)
            return false;

        this.setNumberValue('pos_ibs', value);
    }

    render() {
        const selectedOptionsStyles = {
            color: "#3c763d",
            backgroundColor: "#dff0d8"
        };
        const optionsListStyles = {
            backgroundColor: "#fcf8e3",
            color: "#8a6d3b"
        };
        return (
            <div className="newVualt_container">
                <div className="newVualt_container_detail">

                    <div className="newVualt_detail_outer">
                        <div className="newVualt_detail">
                            <div className="newVualt_heading_with_buttons clearfix">
                                <div className="newVualt_heading">
                                    <h3>Add/Edit Stamp Card</h3>
                                </div>
                            </div>
                            <div className="categoryInfo_container clearfix ">
                                <div className="smsDetail_inner primary_voucher_setting">

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Name</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input placeholder="name..." type="text"
                                                                       onChange={(e) => {
                                                                           this.setNumberValue('name', e.target.value)
                                                                       }} value={this.props.name}/>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Description</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li className="voucherDesc">
                                                            <div className="segmentInput ">
                                                                <textarea placeholder="description..."
                                                                          onChange={(e) => {
                                                                              this.setNumberValue('description', e.target.value)
                                                                          }} value={this.props.description}></textarea>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    {(IBS ==1) && (
                                        <div className="dropSegmentation_section">
                                            <div className="dropSegmentation_heading clearfix">
                                                <h3>IBS</h3>
                                            </div>
                                            <div className="stateSegmentation primary_voucher_setting">
                                                <div className="venueIdentification_section">
                                                    <div className="venueIdentification_form">
                                                        <ul>
                                                            <li>
                                                                <div className="customInput_div">
                                                                    <input placeholder="ibs..." type="text" onChange={(e)=>{
                                                                        let value = e.target.value;
                                                                        if (value.match(/^\d*$/gm))
                                                                            this.checkValidIbs(e);

                                                                    }} value={this.props.pos_ibs}/>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Discount Type</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="customDropDown">
                                                    <span ref={ref => this.customDropDownDiscountRef = ref}
                                                          onClick={this.handleDropDownDiscountClick}> {this.props.discount_type ? (this.props.discount_type == '$' ? 'Fixed' : 'Percentage') : 'Select discount type'}</span>
                                                    <ul className="customDropDown_show customPlaceHolder"
                                                        ref={ref => this.customDropDownDiscountOneRef = ref} style={{
                                                        marginBottom: '30px',
                                                        marginTop: '-10px',
                                                        maxHeight: '207px',
                                                        display: 'none'
                                                    }}>
                                                        <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>}
                                                                    renderThumbHorizontal={() => <div></div>}>
                                                            <li onClick={(e) => {
                                                                this.setDiscountType('%')
                                                            }}
                                                                className={this.props.discount_type === '%' ? "selectedItem" : ''}>Percentage
                                                            </li>
                                                            <li onClick={(e) => {
                                                                this.setDiscountType('$')
                                                            }}
                                                                className={this.props.discount_type === '$' ? "selectedItem" : ''}>Fixed
                                                            </li>
                                                        </Scrollbars>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Amount For Voucher</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input onChange={(e) => {
                                                                    let value = e.target.value;
                                                                    if (isFinite(value))
                                                                        this.setNumberValue('voucher_amount', value);
                                                                }} placeholder="Amount For Vouchers" type="text"
                                                                       value={this.props.voucher_amount ? this.props.voucher_amount : ''}/>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>No of Stamps</h3>
                                        </div>
                                        <div className="stateSegmentation primary_voucher_setting">
                                            <div className="venueIdentification_section">
                                                <div className="venueIdentification_form">
                                                    <ul>
                                                        <li>
                                                            <div className="customInput_div">
                                                                <input onChange={(e) => {
                                                                    let value = e.target.value;

                                                                    if (parseInt(value) != 0 && value.match(/^\d*$/gm))
                                                                        this.setNumberValue('no_of_use', value);
                                                                }} placeholder='No of Stamp(s)' type="text"
                                                                       value={this.props.no_of_use ? this.props.no_of_use : ''}/>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Stamp Card Color </h3>
                                        </div>
                                        <div className="stateSegmentation">
                                            <div className="compaignDescription_outer   clearfix">
                                                <div className="voucherDiscount">
                                                    <SketchPicker color={this.props.card_color}
                                                                  onChangeComplete={this.handleColorChange}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropSegmentation_section">
                                        <div className="dropSegmentation_heading clearfix">
                                            <h3>Upload Image</h3>
                                        </div>
                                        <div className="stateSegmentation">
                                            <div className="compaignDescription_outer   clearfix">
                                                <div className="importBulk">
                                                    <div
                                                        className="image_notify_upload_area image_notify_upload_area_area2"
                                                        style={{
                                                            border: '0px',
                                                            background: `url(${BaseUrl}/assets/images/bulkDrop.png) no-repeat center`,
                                                            backgroundSize: 'contain'
                                                        }}>
                                                        <input type="file" onChange={this.onSelectFile}/>
                                                    </div>
                                                </div>
                                                <ImageCropping src={this.state.src} setCanvas={this.setCanvas}
                                                               image={this.props.image}
                                                               cropingDivStyle={{
                                                                   width: '50%',
                                                                   height: '400px',
                                                                   float: 'left'
                                                               }}
                                                               previewStyle={{
                                                                   width: '45%',
                                                                   maxHeight: '350px',
                                                                   float: 'left',
                                                                   marginLeft: '30px'
                                                               }}
                                                               previewImgStyle={{height: '347px'}}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <br/>
                    <div className="continueCancel  listShops">
                        <a  style={{cursor:'pointer'}} className="" onClick={this.savePunchCard}>Save</a>
                        <a  style={{cursor:'pointer'}} className="close_punch_popup" onClick={() => {
                            this.redirectToListing()
                        }}>CANCEL</a>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of AddPunchCard.

const mapStateToProps = (state) => ({
    ...state.punchCard,
    dataToSave: selectPunchCardDataForSaving(state.punchCard),
    frq:        setFrequencyTime(state.punchCard.frequency)
});
export default connect(mapStateToProps)(AddPunchCard);