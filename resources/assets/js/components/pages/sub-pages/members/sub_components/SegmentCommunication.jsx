import React, {Component} from 'react';
import PropTypes from 'prop-types';

class SegmentCommunication extends Component {
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="popupDiv_segments">
                <div className="popupDiv_segments_detail">
                    <div className="dashborad_column clearfix">
                        <div className="column6_db">
                            <div>
                                Segment Communication Report.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of SegmentCommunication.

SegmentCommunication.propTypes = {};

export default SegmentCommunication;