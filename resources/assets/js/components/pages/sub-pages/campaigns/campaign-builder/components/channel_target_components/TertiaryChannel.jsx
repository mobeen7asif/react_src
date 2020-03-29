import React, {Component} from 'react';
import PropTypes from 'prop-types';

class TertiaryChannel extends Component {
    render() {
        return (
            <div>
                <li>
                    <div className="priorityOrder_listing_detail">
                        <div className="orderCount"><label>3</label></div>
                        <div className="orderCount_icon">
                            <div className="chanel_icon">
                                <a  style={{cursor:'pointer'}} onDoubleClick= {(e)=>{ this.props.removeSelectedChannel(e, 'tertiary') }} >
                                                        <span className={ this.props.targetChannels.tertiary.isEnabled ? 'tertiaryIcon' : '' }>
                                                        <b style={{ background: (this.props.targetChannels.tertiary.icon) ? 'url(assets/images/'+ this.props.targetChannels.tertiary.icon +') center center no-repeat' : ''}} className={'channelsIcon'}>&nbsp;</b>
                                                        <i className="tertiaryIconi">&nbsp;</i></span>
                                </a>
                            </div>
                        </div>
                        <div className="priorityOrder_description clearfix">
                            <div className="orderLabels clearfix">
                                <label>{ this.props.targetChannels.tertiary.channel.toUpperCase() }</label>
                                <small>Channel 3</small>
                            </div>
                            <div className="order_percentValue">
                                <strong>{ this.props.targetChannels.tertiary.percentage }%</strong>
                            </div>
                        </div>
                    </div>
                </li>
            </div>
        );
    }//..... end of render() .....//
}//..... end of TertiaryChannel.

TertiaryChannel.propTypes = {};

export default TertiaryChannel;