import React, {Component} from 'react';
import PropTypes from 'prop-types';

class SegmentMemberShip extends Component {
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
                                Segment Membership report.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of SegmentMemberShip.

SegmentMemberShip.propTypes = {};

export default SegmentMemberShip;