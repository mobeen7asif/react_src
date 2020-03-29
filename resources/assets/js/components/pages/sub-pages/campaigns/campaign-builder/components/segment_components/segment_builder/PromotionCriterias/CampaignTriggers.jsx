import React, {Component} from 'react';
import {Scrollbars} from "react-custom-scrollbars";

class CampaignTriggers extends Component {
    customDropDownSpanRef = null;
    customDropDownShowRef = null;
    customDropDownSpanRef2 = null;
    customDropDownShowRef2 = null;

    constructor(props) {
        super(props);
        this.state = {
            number_of_users: "",
            listCampaigns : []
        };
    }//..... end of constructor() .....//



    handleDropDownSpanClick = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRef.style.display =  (this.customDropDownShowRef.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanClick() .....//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('campaign_triggers', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        if (this.props.criteria.value.number_of_users)
            this.setState({number_of_users:this.props.criteria.value.number_of_users});

        show_loader();
        axios.post(`${BaseUrl}/api/get-active-campaigns`,{
            venue_id            : VenueID
        }).then(res => {
            this.setState(()=>({listCampaigns: res.data.data}));
            show_loader(true);
        }).catch((err) => {
            show_loader(true);
        });
    };//..... end of componentDidMount() .....//

    handleFromIputs = (e) => {
            this.setState({
                number_of_users:  parseInt(e.target.value)
            });
            let preVal = this.props.criteria.value;
            preVal.number_of_users = e.target.value;
            this.setCriteriaValue(preVal);
    };



    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    handleDropDownSpanClick2 = (e) => {
        e.target.classList.toggle('changeAero');
        this.customDropDownShowRef2.style.display =  (this.customDropDownShowRef2.style.display === 'none') ? 'block' : 'none';
    };//..... end of handleDropDownSpanClick() .....//

    setValueSelected2 = (value) => {
        let preVal = this.props.criteria.value;
        preVal.campaign_id = value.id;
        preVal.campaign_name = value.name;
        this.setCriteriaValue(preVal);

        this.customDropDownShowRef2.style.display = 'none';
        this.customDropDownSpanRef2.classList.remove('changeAero');
    };//..... end of setValueSelected() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Campaign Triggers</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('campaign_triggers')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>

                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Select triggered campaign:</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder" style={{width:"100%",float:"none"}}>
                                <div className="placeHolderOuter clearfix">
                                    <div className="customDropDown">
                                        <span ref={ref => this.customDropDownSpanRef2 = ref} onClick={this.handleDropDownSpanClick2} style={{backgroundPosition:"97% 17px"}}>{this.props.criteria.value.campaign_name ? this.props.criteria.value.campaign_name : 'Select Campaign'} </span>
                                        <ul className="customDropDown_show customPlaceHolder" ref={ref => this.customDropDownShowRef2 = ref} style={{marginBottom: '30px',marginTop: '-10px', maxHeight:'207px', display:'none'}} >
                                            <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                                { this.state.listCampaigns && (
                                                    this.state.listCampaigns.map((ms,key) => {
                                                        return <li key={key} onClick={(e)=> {this.setValueSelected2(ms)}}
                                                                   className={(this.props.criteria.value.campaign_id === ms.id) ? 'selectedItem' : ''}>{ms.name}</li>
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
                        <label>First <b style={{fontWeight:"bold",fontSize:"18px"}}>{this.state.number_of_users ? this.state.number_of_users : "x"}</b> users</label>
                        <div className="memberNumberOuter clearfix">
                             

                            <div className="memberNumbe" style={{float:"left"}}>
                                <div className="numberFields clearfix">
                                    <input  type="text" placeholder="First x users" className="numeric" style={{width:100+'%'}} value={this.state.number_of_users} onChange={(e) => {this.handleFromIputs(e)}}/>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>







            </div>
        );
    }//..... end of render() .....//

}//..... end of CampaignTriggers.

export default CampaignTriggers;