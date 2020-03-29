import React, {Component} from 'react';
import PropTypes from 'prop-types';

class SecondaryChannel extends Component {
    render() {
        return (
            <div>
                <li>
                    <div className="priorityOrder_listing_detail">
                        <div className="orderCount">
                            <label>2</label>
                        </div>
                        <div className="orderCount_icon">
                            <div className="chanel_icon">
                                <a  style={{cursor:'pointer'}} onDoubleClick= {(e)=>{ this.props.removeSelectedChannel(e, 'secondary') }} >
                                                        <span className={ this.props.targetChannels.secondary.isEnabled ? 'secondryIcon' :'' }>
                                                        <b style={{ background: (this.props.targetChannels.secondary.icon) ? 'url(assets/images/'+ this.props.targetChannels.secondary.icon +') center center no-repeat' : '' }} className={'channelsIcon'}>&nbsp;</b>
                                                        <i className="secondryIconi">&nbsp;</i></span>
                                </a>
                            </div>
                        </div>
                        <div className="priorityOrder_description clearfix">
                            <div className="orderLabels clearfix">
                                <label>{ this.props.targetChannels.secondary.channel.toUpperCase() }</label>
                                <small>Channel 2</small>
                            </div>

                            <div className="order_percentValue">
                                <strong>{ this.props.targetChannels.secondary.percentage }%</strong>
                            </div>
                        </div>
                    </div>
                </li>
            </div>
        );
    }//..... end of render() .....//
}//..... end of SecondaryChannel.

SecondaryChannel.propTypes = {};

export default SecondaryChannel;