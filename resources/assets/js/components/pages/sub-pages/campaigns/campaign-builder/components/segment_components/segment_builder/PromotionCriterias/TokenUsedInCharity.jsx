import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

class TokenUsedInCharity extends Component {
    customDropDownSpanRef = null;
    customDropDownShowRef = null;
    constructor(props) {
        super(props);
        this.state = {
            TokenUsedInCharity : []
        };
    }//..... end of constructor() .....//


    componentDidMount = () => {
        show_loader();
        axios.post(`${BaseUrl}/api/get-all-charities`,{
            venue_id            : VenueID
        }).then(res => {
            this.setState(()=>({TokenUsedInCharity: res.data.data}));
            show_loader(true);
        }).catch((err) => {
            show_loader(true);
        });

    }
    setValueSelected = (value) => {
        let preVal = this.props.criteria.value;
        preVal.status = value.name;
        preVal.charity_id = value.id;
        this.setCriteriaValue(preVal);

        this.customDropDownShowRef.style.display = 'none';
        this.customDropDownSpanRef.classList.remove('changeAero');
    };//..... end of setValueSelected() .....//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('token_used_in_charity', 'value', value);
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
                    <h3>Token Used in Charity</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('token_used_in_charity')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Charity organization listing is</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder">
                                <div className="placeHolderOuter clearfix">
                                    <div className="customDropDown">
                                        <span ref={ref => this.customDropDownSpanRef = ref} onClick={this.handleDropDownSpanClick}>{this.props.criteria.value.status ? this.props.criteria.value.status : 'Select Charity'} </span>
                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                { this.state.TokenUsedInCharity && (
                                                    this.state.TokenUsedInCharity.map((ms,key) => {
                                                        return <li key={key} onClick={(e)=> {this.setValueSelected({name:ms.charity_name,id:ms.id})}}
                                                                   className={(this.props.criteria.value.status === ms.charity_name) ? 'selectedItem' : ''}>{ms.charity_name}</li>
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

}//..... end of TokenUsedInCharity.

export default TokenUsedInCharity;