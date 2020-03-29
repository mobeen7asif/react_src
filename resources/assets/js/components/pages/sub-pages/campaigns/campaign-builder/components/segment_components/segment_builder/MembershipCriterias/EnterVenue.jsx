import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

class EnterVenue extends Component {
    customDropDownSpanRef = null;
    customDropDownShowRef = null;
    customDropDownSpanRef2 = null;
    customDropDownShowRef2 = null;
    enterVenue = ['Visited', 'Not Visited'];

    constructor(props) {
        super(props);
        this.state = {
            listVenues : [],
            days           : ""
        };
    }//..... end of constructor() .....//
    setValueSelected = (value) => {
        let preVal = this.props.criteria.value;
        preVal.status = value;
        this.setCriteriaValue(preVal);

        this.customDropDownShowRef.style.display = 'none';
        this.customDropDownSpanRef.classList.remove('changeAero');
    };//..... end of setValueSelected() .....//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('enter_venue', 'value', value);

    };//..... end of setCriteriaValue() .....//



    handleDropDownSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRef.style.display =  (this.customDropDownShowRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanClick() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    componentDidMount = () => {
        if (this.props.criteria.value.days)
            this.setState({days:this.props.criteria.value.days});

        show_loader();
        axios.get(`${BaseUrl}/api/get-venues-multiselect`).then(res => {
            this.setState(()=>({listVenues: res.data.data}));
            show_loader(true);
        }).catch((err) => {
            show_loader(true);
        });

    }

    handleFromIputs = (e) => {
        this.setState({
            days:  e.target.value
        });
        let preVal = this.props.criteria.value;
        preVal.days = e.target.value;
        this.setCriteriaValue(preVal);
    };


    handleDropDownSpanClick2 = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRef2.style.display =  (this.customDropDownShowRef2.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanClick() .....//

    setValueSelected2 = (value) => {
        let preVal = this.props.criteria.value;
        preVal.venue_id = value.id;
        preVal.name = value.label;
        this.setCriteriaValue(preVal);

        this.customDropDownShowRef2.style.display = 'none';
        this.customDropDownSpanRef2.classList.remove('changeAero');
    };//..... end of setValueSelected() .....//


    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Site Visitation</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('enter_venue')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>

                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Select Site</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder" style={{width:"100%",float:"none"}}>
                                <div className="placeHolderOuter clearfix">
                                    <div className="customDropDown">
                                        <span ref={ref => this.customDropDownSpanRef2 = ref} onClick={this.handleDropDownSpanClick2} style={{backgroundPosition:"97% 17px"}}>{this.props.criteria.value.venue_id ? this.props.criteria.value.name : 'Select Site'} </span>
                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowRef2 = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                { this.state.listVenues && (
                                                    this.state.listVenues.map((ms,key) => {
                                                        return <li key={key} onClick={(e)=> {this.setValueSelected2(ms)}}
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

                <div className="stateSegmentation" style={{paddingTop:"0px"}}>
                    <div className="compaignDescription_outer clearfix">
                        <label>Status</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder">
                                <div className="placeHolderOuter clearfix">
                                    <div className="customDropDown">
                                        <span ref={ref => this.customDropDownSpanRef = ref} onClick={this.handleDropDownSpanClick}>{this.props.criteria.value.status ? this.props.criteria.value.status : 'Select Status'} </span>
                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowRef = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                {
                                                    this.enterVenue.map((ms) => {
                                                        return <li key={ms} onClick={(e)=> {this.setValueSelected(ms)}}
                                                                   className={(this.props.criteria.value.status === ms) ? 'selectedItem' : ''}>{ms}</li>
                                                    })
                                                }
                                            </Scrollbars>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="memberNumbe">
                                <div className="numberFields clearfix">
                                    <input  type="text" placeholder="Days" className="numeric" style={{width:100+'%'}} value={this.state.days} onChange={(e) => {this.handleFromIputs(e)}}/>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//

}//..... end of EnterVenue.

export default EnterVenue;