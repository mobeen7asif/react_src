import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SegmentDemographic from "./SegmentDemographic";
import SegmentMemberShip from "./SegmentMemberShip";
import SegmentActivity from "./SegmentActivity";
import SegmentCommunication from "./SegmentCommunication";

class PopupComponent extends Component {
    constructor(props) {
        super(props);
        // this.updatePopup = this.updatePopup.bind(this);
    }

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    updatePopup() {
        this.props.closePopup();
    }

    render() {
        return (
            <div className={(this.props.typeDetail.popupShow) ? "popups_outer showData" : "popups_outer"}>
                <div className="popups_inner">
                    <div className="overley_popup" onClick={e => {
                        this.updatePopup()
                    }}>&nbsp;</div>

                    <div className="popupDiv">
                        <div className="popupDiv_detail">
                            <div className="levels_bttn segmentsPopup_bttn">
                                <ul>
                                    <li><a  style={{cursor:'pointer'}}
                                           onClick={() => this.props.changeType('segmentDemographic')}
                                           className={(this.props.typeDetail.segmentType === 'segmentDemographic') ? "levelActive" : ''}>Segment
                                        Demographics</a></li>
                                    <li><a  style={{cursor:'pointer'}}
                                           onClick={() => this.props.changeType('segmentMemberShip')}
                                           className={(this.props.typeDetail.segmentType === 'segmentMemberShip') ? "levelActive" : ''}>Segment
                                        Membership</a></li>
                                    <li><a  style={{cursor:'pointer'}}
                                           onClick={() => this.props.changeType('segmentActivity')}
                                           className={(this.props.typeDetail.segmentType === 'segmentActivity') ? "levelActive" : ''}>Segment
                                        Activity - Last 30 days</a></li>
                                    <li><a  style={{cursor:'pointer'}}
                                           onClick={() => this.props.changeType('segmentCommunication')}
                                           className={(this.props.typeDetail.segmentType === 'segmentCommunication') ? "levelActive" : ''}>Available
                                        Communication Channels</a></li>
                                </ul>
                            </div>

                            {this.getSegmentComponents()}

                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//

    getSegmentComponents() {
        switch (this.props.typeDetail.segmentType) {
            case 'segmentDemographic':
                return <SegmentDemographic/>;
            case 'segmentMemberShip':
                return <SegmentMemberShip/>;
            case 'segmentActivity':
                return <SegmentActivity/>;
            case 'segmentCommunication':
                return <SegmentCommunication/>
            default :
                return '';


        }
    }
}//..... end of PopupComponent.

PopupComponent.propTypes = {};

export default PopupComponent;