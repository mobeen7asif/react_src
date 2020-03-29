import React, {Component} from 'react';
import PropTypes from 'prop-types';

class PointMeSkin extends Component {
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    render() {
        return (
            <div>
                This is PointMeSkin component. <b style={{color:"red",fontSize:"18px"}}>This page requires creative designs</b>
            </div>
        );
    }//..... end of render() .....//
}//..... end of PointMeSkin.

PointMeSkin.propTypes = {};

export default PointMeSkin;