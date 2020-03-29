import React, {Component} from 'react';
import PropTypes from 'prop-types';

class SegmentActivity extends Component {
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
                                Segment Activity Report.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of SegmentActivity.

SegmentActivity.propTypes = {};

export default SegmentActivity;