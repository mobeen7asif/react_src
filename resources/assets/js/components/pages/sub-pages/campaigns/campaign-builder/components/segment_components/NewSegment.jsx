import React, {Component} from 'react';
import SegmentBuilder from "./segment_builder/SegmentBuilder";
import {connect} from "react-redux";
import {addNewSegmentValue} from "../../../../../../redux/actions/CampaignBuilderActions";
import ToggleSwitch from "@trendmicro/react-toggle-switch";

class NewSegment extends Component {
        state={
            is_global:false
        };
    setSegmentName = (e) => {
        this.props.dispatch(addNewSegmentValue({name: e.target.value}));
    };//..... end of setSegmentName() ......//

    componentDidMount() {
        this.getSegmentCritera();
        this.getCustomFieldOfVenue();

    }

    setSegmentDescription = (e) => {
        this.props.dispatch(addNewSegmentValue({description: e.target.value}));
    };//..... end of setSegmentDescription() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    updateGlobalSegment = () => {
        this.setState((prevState)=>({is_global:!prevState.is_global}),()=>{
           if(this.state.is_global)
               this.props.dispatch(addNewSegmentValue({segment_type: 'Global'}));
           else
               this.props.dispatch(addNewSegmentValue({segment_type: 'Normal'}));
        })
    };//..... end of showHideDate() .....//
    getSegmentCritera =()=>{
        show_loader();
        axios.get(BaseUrl + '/api/get-segment-data').then(res => {

            this.setState(() => ({data: res.data.data}));

            localStorage.setItem('segment_data', JSON.stringify(res.data.data));
            show_loader(true);

        }).catch((err) => {
            show_loader(true);

        });
    }
    checkSegmentCriteria =(type,field_name)=>{
            let  dataArray= JSON.parse(localStorage.getItem('segment_data'));

            let index = dataArray.findIndex(x => x.type === type)
            let jsonData = JSON.parse(dataArray[index].field2);
            let jsonInde = jsonData.findIndex(t=>t.name ===field_name);
            return jsonData[jsonInde].show;

    }
    checkWorking =(type,field_name) =>{
        let dataArray =  this.state.data;
        let index = dataArray.findIndex(x => x.type === type)
        let jsonData = JSON.parse(dataArray[index].field2);
        let jsonInde = jsonData.findIndex(t=>t.name ===field_name);
        return jsonData[jsonInde].show;
    }

    getCustomFieldOfVenue = () => {
        show_loader();
        axios.post(BaseUrl+'/api/getVenue',{venue_id:VenueID,company_id:CompanyID} ).then((arr)=>{
            if(arr.data){
                show_loader(true);
                let data = arr.data.data.custom_fields ? JSON.parse(arr.data.data.custom_fields) : [];
                let user_forms = arr.data.user_form ? arr.data.user_form : [];
                let all_custom_fields = arr.data.all_custom_fields ? arr.data.all_custom_fields : [];
                if(data.length == 0)
                    data = [{id:1,field_name:"",field_label:"",field_type:"text",segment_name:"",search_name:"",field_unique_id:"custom_field_member_1"}];

                localStorage.setItem('memberCustomFields', JSON.stringify(data));
                localStorage.setItem('user_form', JSON.stringify(user_forms));
                localStorage.setItem('all_custom_fields', JSON.stringify(all_custom_fields));

            }else{
                show_loader(true);
            }

        }).catch((err) => {
            show_loader();
        });
    }


    render() {
        return (
            <div>
                <div className="segment_tYpe_heading">
                    <h3>NEW SEGMENT</h3>
                </div>
                <div className="segment_tYpe_detail">
                    <div className="selectDescription">
                        <p>Give your segment a name that will be easy for other staff to understand. Once your segment is created you can view and analyse the segment in the My Venue and My Members sections</p>
                        <br />
                    </div>
                    <div className="newSegment_form">
                        <ul>
                            <li>
                                <label>Segment Name:</label>
                                <div className="segmentInput">
                                    <input placeholder="New segment name" onChange={this.setSegmentName} type="text" value={this.props.segment.new_segment.name ? this.props.segment.new_segment.name : ''}/>
                                </div>
                            </li>
                            <li>
                                <label>Segment Details:</label>
                                <div className="segmentInput segmentARea">
                                    <textarea style={{fontFamily: "'Roboto', sans-serif"}} placeholder="Segment description" onChange={this.setSegmentDescription} value={this.props.segment.new_segment.description ? this.props.segment.new_segment.description : ''}></textarea>
                                </div>
                            </li>
                            {(appPermission("GlobalSegment","view")) && (
                            <li>
                                <label>Is Segment is Global?</label>
                                <ToggleSwitch

                                    checked={this.state.is_global}
                                    onChange={(e)=> {this.updateGlobalSegment(e)}}
                                />
                                <span style={{fontWeight:'bold'}}> {this.state.is_global ? "ON" : "OFF"}</span>
                            </li>
                            )}
                        </ul>
                    </div>
                </div>

                {
                    this.props.segment.new_segment.name && this.props.segment.new_segment.description &&
                    <SegmentBuilder  checkSegmentCriteria={this.checkSegmentCriteria}/>
                }

            </div>
        );
    }//..... end of render() .....//
}//..... end of NewSegment.

const mapStateToProps = (state) => {
    return {segment: state.campaignBuilder.segment};
};

export default connect(mapStateToProps)(NewSegment);