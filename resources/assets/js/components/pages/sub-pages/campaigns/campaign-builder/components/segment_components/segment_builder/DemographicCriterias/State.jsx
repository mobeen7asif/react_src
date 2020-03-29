import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

class State extends Component {

    state = {
        states: [ "Australian Capital Territory", "New South Wales", "Northern Territory", "Queensland", "Tasmania", "Western Australia", "Victoria"]
    };

    selectAllStates = () => {
        this.setCriteriaValue(this.state.states);
    };//..... end of selectAllStates() ......//

    clearAllStates = () => {
        this.setCriteriaValue([]);
    };//..... end of clearAllStates() ......//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('residential_address.state', 'value', value);
    };//..... end of setCriteriaValue() .....//

    setStateValue = (state) => {
        let newStates = this.props.criteria.value;
        if (newStates.indexOf(state) === -1) {
            newStates.push(state);
        } else {
            newStates = this.props.criteria.value.filter((st) => st !== state);
        }//..... end if-else() .....//

        this.setCriteriaValue(newStates);
    };//..... end of setStateValue() ......//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix"><h3>State</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('residential_address.state')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a></div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>State</label>
                        <div className="tagsCompaigns_detail clearfix">
                            <div className="tagsCompaigns_list">
                                <div className="tagsCompaigns_listScroll">
                                    <div className="tagsCompaigns_listScroll" style={{textAlign: 'left'}}>
                                        <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                        <ul>
                                            {this.state.states.map((value) => {
                                                return <li key={value} onClick={()=> this.setStateValue(value)} className={(this.props.criteria.value.indexOf(value) !== -1) ? 'selectedItem' : ''}>{value}</li>;
                                            })}
                                        </ul>
                                        </Scrollbars>
                                    </div>
                                </div>
                            </div>
                            <div className="tagsSelected_tip">
                                <div className="selected_tip" style={{textAlign: 'left'}}>
                                    <i>TIP</i> <p>Use the Control (Ctrl on Windows) or Command (âŒ˜ on Mac)key to select or unselect items.</p>
                                    <button onClick={this.selectAllStates}>SELECT ALL</button>
                                    <button onClick={this.clearAllStates}>CLEAR ALL</button>
                                </div>
                            </div>
                        </div>
                        <div className="selectedTags"><label>Selected</label>
                            <div className="showTags clearfix">
                                <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                    <span>
                                        {this.props.criteria.value.map((value) => {
                                            return <a  style={{cursor:'pointer'}} onClick={()=> this.setStateValue(value)} key={value}>
                                                    {value}
                                                <i>&nbsp;</i>
                                            </a>
                                        })}
                                    </span>
                                </Scrollbars>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of State.

export default State;