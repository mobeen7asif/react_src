import React, {Component} from 'react';
import PropTypes from 'prop-types';

class TemplateBuilderComponent extends Component {
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div>
                This is TemplateBuilderComponent component.
            </div>
        );
    }//..... end of render() .....//
}//..... end of TemplateBuilderComponent.

TemplateBuilderComponent.propTypes = {};

export default TemplateBuilderComponent;