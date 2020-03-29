import React, {Component} from 'react';
import PropTypes from 'prop-types';

class PrimaryChannel extends Component {
    render() {
        return (
            <div>
                <li>
                    <div className="priorityOrder_listing_detail">
                        <div className="orderCount">
                            <label>1</label>
                        </div>
                        <div className="orderCount_icon">
                            <div className="chanel_icon">
                                <a  style={{cursor:'pointer'}} onDoubleClick= {(e)=>{ this.props.removeSelectedChannel(e, 'primary') }}>
                                                        <span className={this.props.targetChannels.primary.isEnabled ? 'primaryIcon' : ''}>
                                                        <b style={{background: (this.props.targetChannels.primary.icon) ? 'url(assets/images/'+ this.props.targetChannels.primary.icon+') center center no-repeat' : ''}} className={'channelsIcon'}>&nbsp;</b>
                                                        <i className="primaryIconi">&nbsp;</i></span>
                                </a>
                            </div>
                        </div>

                        <div className="priorityOrder_description clearfix">
                            <div className="orderLabels clearfix">
                                <label>{ this.props.targetChannels.primary.channel.toUpperCase() }</label>
                                <small>Channel 1</small>
                            </div>
                            <div className="order_percentValue">
                                <strong>{ this.props.targetChannels.primary.percentage }%</strong>
                            </div>
                        </div>
                    </div>
                </li>.
            </div>
        );
    }//..... end of render() .....//
}//..... end of PrimaryChannel.

PrimaryChannel.propTypes = {};

export default PrimaryChannel;