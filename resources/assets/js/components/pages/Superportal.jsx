import React, {Component} from 'react';

class Superportal extends Component {
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div>
                This url will be redirected to super portal in the future.
            </div>
        );
    }
}

Superportal.propTypes = {};

export default Superportal;
