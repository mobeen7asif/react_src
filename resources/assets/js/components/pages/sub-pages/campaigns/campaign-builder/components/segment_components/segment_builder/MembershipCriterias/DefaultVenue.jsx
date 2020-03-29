import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

class DefaultVenue extends Component {
    customDropDownSpanRef = null;
    customDropDownShowRef = null;
    constructor(props) {
        super(props);
        this.state = {
            listVenues : []
        };
    }//..... end of constructor() .....//


    componentDidMount = () => {
        show_loader();
        axios.get(`${BaseUrl}/api/get-venues-multiselect`,{
            
        }).then(res => {
            this.setState(()=>({listVenues: res.data.data}));
            show_loader(true);
        }).catch((err) => {
            show_loader(true);
        });

    }
    setValueSelected = (value) => {
        let preVal = this.props.criteria.value;
        preVal.venue_name = value.label;
        preVal.venue_id = value.id;
        this.setCriteriaValue(preVal);

        this.customDropDownShowRef.style.display = 'none';
        this.customDropDownSpanRef.classList.remove('changeAero');
    };//..... end of setValueSelected() .....//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('default_venue', 'value', value);
    };//..... end of setCriteriaValue() .....//



    handleDropDownSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRef.style.display =  (this.customDropDownShowRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanClick() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Default Site</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('default_venue')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Select Default Site</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder">
                                <div className="placeHolderOuter clearfix">
                                    <div className="customDropDown">
                                        <span ref={ref => this.customDropDownSpanRef = ref} onClick={this.handleDropDownSpanClick}>{this.props.criteria.value.venue_id ? this.props.criteria.value.venue_name : 'Select Site'} </span>
                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                { this.state.listVenues && (
                                                    this.state.listVenues.map((ms,key) => {
                                                        return <li key={key} onClick={(e)=> {this.setValueSelected({label:ms.label,id:ms.id})}}
                                                                   className={(this.props.criteria.value.venue_id === ms.id) ? 'selectedItem' : ''}>{ms.label}</li>
                                                    })
                                                )


                                                }
                                            </Scrollbars>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//

}//..... end of DefaultVenue.

export default DefaultVenue;