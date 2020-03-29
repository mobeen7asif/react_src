import React, {Component} from 'react';
import {connect} from "react-redux";
import {clearSegment} from "../../../../../../../redux/actions/CampaignBuilderActions";

class SegmentOptions extends Component {
    currentTab = this.props.currentTab;
    state = {
        gap_map : true,
        export_as_email:false
    };
    exportSegment = () => {
        window.open(
            `${BaseUrl}/api/export-segment?esquery=${JSON.stringify(this.props.segment.segment_users.query)}&excluded_users=${JSON.stringify(this.props.segment.segment_users.excluded_users)}&company_id=${CompanyID}&venue_id=${VenueID}&segment_type=${this.props.segment.new_segment.segment_type}`,
            '_blank'
        );
    };//..... end of export segment() ......//

    clearSegment = () => {
        this.props.dispatch(clearSegment());
        this.props.setCurrentTab(--this.currentTab);
    };//..... end of clearSegment() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    componentDidMount = () => {
        let criteria = this.props.segment.new_segment.criterias;
        let segments = [];
        if(criteria == undefined){
            this.props.segment.segments.forEach(function(value,key){
                if(value.hasOwnProperty("query_parameters"))
                    segments.push(value.query_parameters[0]);
            });
        }else{
            segments = this.props.segment.new_segment.criterias;
        }
        if(segments.length == 1){
            segments.forEach((value,key)=> {
                if(value.name == "gap_map_users"){
                    this.setState(()=>({gap_map:false}));
                    return false;
                }
            });
        }

        segments.forEach((value,key)=> {
            if(value.name == "gap_map_users"){
                this.setState(()=>({export_as_email:true}));
                return false;
            }
        });

    };

    render() {
        return (
            <ul>
                {(this.props.segment.type !== 'saved' && <React.Fragment>
                <li>
                    <div className="segmentsOptions_detail">
                        <span>
                            <b style={{cursor:'pointer'}} onClick={this.clearSegment}>&nbsp;</b>
                        </span>
                        <h3>Clear Segment</h3>
                    </div>
                </li>
               {appPermission("Export Segment","view") && (
                    <li>
                        <div className="segmentsOptions_detail">
                            <span>
                                <b style={{cursor:'pointer'}} className="exportSegment" onClick={this.exportSegment}>&nbsp;</b>
                            </span>
                            <h3>Export Segment</h3>
                        </div>
                    </li>
               )}
                    {this.state.export_as_email == true && (
                        <li>
                            <div className="segmentsOptions_detail">
                            <span>
                                <b className="exportSegment" onClick={this.exportEmailSegment}>&nbsp;</b>
                            </span>
                                <h3>Export and Email</h3>
                            </div>
                        </li>

                    )}

               {(appPermission("CanContinueWithSegment","view") && this.state.gap_map == true) && (

                    <li>
                        <div className="segmentsOptions_detail">
                            <span>
                                <b style={{cursor:'pointer'}} className="saveSegment" onClick={() => {this.props.saveSegment(1)}}>&nbsp;</b>
                            </span>
                            <h3>Save Segment</h3>
                        </div>
                    </li>
               )}
               {(appPermission("CanContinueWithSegment","view") && this.state.gap_map == true) && (
                     <li>
                        <div className="segmentsOptions_detail">
                            <span>
                                <b style={{cursor:'pointer'}} onClick={() => {this.props.saveSegment(0)}}>&nbsp;</b>
                            </span>
                            <h3>Continue without saving</h3>
                        </div>
                    </li>
               )}

                </React.Fragment>)}
                {(this.props.segment.type === 'saved'  && this.state.gap_map == true) &&
                <li>
                    <div className="segmentsOptions_detail">
                        <span>
                            <b style={{cursor:'pointer'}} onClick={() => {this.props.saveSegment(null, true)}}>&nbsp;</b>
                        </span>
                        <h3>Continue</h3>
                    </div>
                </li>}
            </ul>
        );
    }//..... end of render() .....//
}//..... end of SegmentOptions.

const mapStateToProps = (state) => {
    return {segment: state.campaignBuilder.segment};
};

export default connect(mapStateToProps)(SegmentOptions);