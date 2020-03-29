import React, {Component} from 'react';
import TargetSummary from "./TargetSummary";
import {forOwn} from "lodash";
import { Draggable,Droppable } from 'react-drag-and-drop';
import PrimaryChannel from './PrimaryChannel';
import SecondayChannel from './SecondaryChannel';
import TertiaryChannel from './TertiaryChannel';

class TargetChannels extends Component {

    componentDidMount() {
        forOwn(this.props.targetChannels, (value, key) => {
            if (value.isEnabled === true) {
                $('body').find('.'+value.currentTarget).addClass('disabled');
            }//..... end if() .....//
        });//.... end of forOwn() .....//
    }//..... end of componentDidMount() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    onDrop=(data,e)=> {
        this.props.selectChannel(e, data.tags);
    };
    render() {
        return (
            <div className="segment_tYpe">
                <div className="segment_tYpe_heading">
                    <h3>TARGET CHANNELS</h3>
                </div>
                <div className="segment_tYpe_detail">
                    <div className="selectDescription">
                        <p>Select one or more target channels for your campaign by drag and drop them into
                            prioritised order. The order dictates how your member will receive the campaign.</p>
                    </div>
                    <div className="targetChanels clearfix">
                        <div className="segmentsSection_left">
                            <div className="segment_heading">
                                <h3>CHANNELS</h3>
                            </div>
                            <div className="chanelList">
                                <ul>


                                    {
                                        (appPermission("Target Chanel Application","view")) ?
                                        <li>
                                            <div className={(this.props.targetChannels.primary.channel === 'push' || this.props.targetChannels.secondary.channel === 'push' || this.props.targetChannels.quarternary.channel === 'push' || this.props.targetChannels.tertiary.channel === 'push') ? "chanel_icon push disabled" : "chanel_icon push"}>

                                                <a dusk='application' className="selectChanel" onDoubleClick={(e) => { this.props.selectChannel(e, 'push')}} >
                                                    <span>
                                                           <Draggable type="tags" data="push">
                                                        <b className="sms_icon" style={{background:'url(assets/images/ap@2x.png) center center no-repeat',backgroundSize:'36px auto'}}>&nbsp;</b>
                                                               </Draggable>
                                                    </span>
                                                    <small>Application</small>
                                                </a>

                                            </div>
                                        </li>

                                        :
                                        <li>
                                        <div className="chanel_icon disabled">

                                        <a dusk='application' className="selectChanel" onDoubleClick={(e) => { this.props.selectChannel(e, 'push')}} >
                                        <span>
                                        <Draggable type="tags" data="push">
                                        <b className="sms_icon" style={{background:'url(assets/images/ap@2x.png) center center no-repeat',backgroundSize:'36px auto'}}>&nbsp;</b>
                                        </Draggable>
                                        </span>
                                        <small>Application</small>
                                        </a>

                                        </div>
                                        </li>
                                    }

                                    {(appPermission("Target Chanel Email","view")) && (
                                    <li>
                                        <div className={(this.props.targetChannels.primary.channel === 'email' || this.props.targetChannels.secondary.channel === 'email' || this.props.targetChannels.quarternary.channel === 'email' || this.props.targetChannels.tertiary.channel === 'email') ? "chanel_icon email disabled" : "chanel_icon email"}>
                                            <a  style={{cursor:'pointer'}} onDoubleClick={(e) => { this.props.selectChannel(e, 'email') }} className="selectChanel">
                                                <span>
                                                     <Draggable type="tags" data="email">
                                                    <b className="sms_icon" style={{background: 'url(assets/images/em@2x.png) center center no-repeat',backgroundSize: '36px auto'}}>&nbsp;</b>
                                                            </Draggable>
                                                </span>
                                                <small>Email</small>
                                            </a>
                                        </div>
                                    </li>

                                    )}

                                    {(appPermission("Target Chanel Sms","view")) && (
                                        <li>
                                            <div className={(this.props.targetChannels.primary.channel === 'sms' || this.props.targetChannels.secondary.channel === 'sms' || this.props.targetChannels.quarternary.channel === 'sms' || this.props.targetChannels.tertiary.channel === 'sms') ? "chanel_icon sms disabled" : "chanel_icon sms"}>
                                                <a  style={{cursor:'pointer'}} onDoubleClick={(e) => { this.props.selectChannel(e, 'sms')}} className="selectChanel">
                                                    <span>
                                                         <Draggable type="tags" data="sms">
                                                        <b className="sms_icon">&nbsp;</b>
                                                         </Draggable>
                                                    </span>
                                                    <small>SMS</small>
                                                </a>
                                            </div>
                                        </li>
                                    )}
                                    {/* <li>

                                         <div class="chanel_icon">
                                             <a  style={{cursor:'pointer'}} ng-dblclick="selectChannel($event, 'survey')" class="selectChanel">
                                                 <span><b class="sms_icon" style="background:url(assets/images/sr-1@2x.png) center center no-repeat;background-size:36px auto"></b></span>
                                                 <small>Survey</small>
                                             </a>
                                         </div>
                                     </li>*/}
                                  {/*   <li>
                                         <div class="chanel_icon">
                                             <a  style={{cursor:'pointer'}} ng-dblclick="selectChannel($event, 'video_ad')" class="selectChanel">
                                                 <span><b class="sms_icon" style="background:url(assets/images/vid@2x.png) center center no-repeat;background-size:36px auto"></b></span>
                                                 <small>Video Ad</small>
                                             </a>
                                         </div>
                                     </li>*/}


                                    {(appPermission("Target Chanel Wifi","view")) && (
                                        <li>
                                            <div className="chanel_icon disabled">
                                                <a  style={{cursor:'pointer'}} ng-dblclick="selectChannel($event, 'wifi')" className="selectChanel">
                                                    <span>
                                                        <b className="sms_icon" style={{background: 'url(assets/images/wifiIcon_grey@2x.png) center center no-repeat',backgroundSize: '36px auto'}}>&nbsp;</b>
                                                    </span>
                                                    <small>WiFi</small>
                                                </a>
                                            </div>
                                        </li>
                                    )}

                                    {(appPermission("Target Chanel Web","view")) && (
                                        <li>
                                            <div className="chanel_icon disabled">
                                                <a  style={{cursor:'pointer'}} ng-dblclick="selectChannel($event, 'web')" className="selectChanel">
                                                    <span>
                                                        <b className="sms_icon" style={{background: 'url(assets/images/wb@2x.png) center center no-repeat',backgroundSize: '36px auto'}}>&nbsp;</b>
                                                    </span>
                                                    <small>Web</small>
                                                </a>
                                            </div>
                                        </li>
                                    )}

                                </ul>
                            </div>
                        </div>
                        <Droppable types={['tags']} onDrop={this.onDrop}>
                        <div className="segmentsSection_left priorityOrder_column">

                            <div className="segment_heading segmentaxn_heading">
                                <h3>PRIORITY ORDER</h3>
                            </div>

                            <div className="priorityOrder_listing">


                                <ul>

                                    {this.props.targetChannels.primary.channel !== '' && (
                                        <PrimaryChannel  targetChannels={this.props.targetChannels} segment={this.props.segment} selectChannel={this.selectChannel}
                                                         removeSelectedChannel={this.props.removeSelectedChannel}
                                                         segmentName={this.segmentName}/>
                                    )}

                                    {this.props.targetChannels.secondary.channel !== '' && (
                                        <SecondayChannel  targetChannels={this.props.targetChannels} segment={this.props.segment} selectChannel={this.selectChannel}
                                                         removeSelectedChannel={this.props.removeSelectedChannel}
                                                         segmentName={this.segmentName}/>
                                    )}

                                    {this.props.targetChannels.tertiary.channel !== '' && (
                                        <TertiaryChannel  targetChannels={this.props.targetChannels} segment={this.props.segment} selectChannel={this.selectChannel}
                                                          removeSelectedChannel={this.props.removeSelectedChannel}
                                                          segmentName={this.segmentName}/>
                                    )}
{/*


                                    <li>
                                        <div className="priorityOrder_listing_detail">
                                            <div className="orderCount">
                                                <label>4</label>
                                            </div>
                                            <div className="orderCount_icon">
                                                <div className="chanel_icon">
                                                    <a  style={{cursor:'pointer'}} onDoubleClick= {(e)=>{ this.props.removeSelectedChannel(e, 'quarternary') }} >
                                                        <span className={ this.props.targetChannels.quarternary.isEnabled ? 'quaterneryIcon' : '' }>
                                                            <b style={{ background: (this.props.targetChannels.quarternary.icon) ? 'url(assets/images/'+ this.props.targetChannels.quarternary.icon +') center center no-repeat' : ''}} className={'channelsIcon'}>&nbsp;</b>
                                                            <i className="quaterneryIconi">&nbsp;</i>
                                                        </span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="priorityOrder_description clearfix">
                                                <div className="orderLabels clearfix">
                                                    <label>{ this.props.targetChannels.quarternary.channel.toUpperCase() }</label>
                                                    <small>Quaternary</small>
                                                </div>
                                                <div className="order_percentValue">
                                                    <strong>{ this.props.targetChannels.quarternary.percentage }%</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </li>*/}
                                </ul>
                            </div>

                        </div>
                    </Droppable>
                    </div>

                    <TargetSummary totalMembers={this.props.totalMembers} totalPercentage={this.props.totalPercentage} segmentName={this.props.segmentName}
                                   chartData={this.props.chartData}/>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of TargetChannels.

export default TargetChannels;