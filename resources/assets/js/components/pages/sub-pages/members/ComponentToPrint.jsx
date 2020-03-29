import React, {Component} from 'react';
import Member from "./Member";



class ComponentToPrint extends React.Component {
    render() {
        return (
            <div>{this.props.data}</div>

        );
    }
}

export default ComponentToPrint;