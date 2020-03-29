import React, {Component} from 'react';
import PropTypes from 'prop-types';

class RewardPushBuilder extends Component {
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div>
                This is RewardPushBuilder component.
            </div>
        );
    }//..... end of render() .....//
}//..... end of RewardPushBuilder.

RewardPushBuilder.propTypes = {};

export default RewardPushBuilder;