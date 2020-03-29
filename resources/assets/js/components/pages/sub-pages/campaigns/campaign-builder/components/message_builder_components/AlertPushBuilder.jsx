import React, {Component} from 'react';
import PropTypes from 'prop-types';

class AlertPushBuilder extends Component {
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div>
                This is AlertPushBuilder component.
            </div>
        );
    }//..... end of render() .....//
}//..... end of AlertPushBuilder.

AlertPushBuilder.propTypes = {};

export default AlertPushBuilder;