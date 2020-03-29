import React, {Component} from 'react';
import PropTypes from 'prop-types';

class GamingPlayer extends Component {

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('gaming_player', 'value', value);
    };//..... end of setCriteriaValue() .....//

    componentDidMount = () => {
        if (!this.props.criteria.value)
            this.setCriteriaValue('yes');
    };//..... end of componentDidMount() ......//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Gaming Player</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('gaming_player')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Member is Gaming Player </label>
                        <div className="gamming_bttnz">
                            <div className="addMember_removeMemberBttn clearfix">
                                <a  style={{cursor:'pointer'}} className={this.props.criteria.value === 'yes' ? 'selecmemberBttn' : ''} onClick={(e) => {this.setCriteriaValue('yes')}}>YES</a>
                                <a  style={{cursor:'pointer'}} className={this.props.criteria.value === 'no' ? 'selecmemberBttn' : ''} onClick={(e) => {this.setCriteriaValue('no')}}>NO</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of GamingPlayer.

GamingPlayer.propTypes = {};

export default GamingPlayer;