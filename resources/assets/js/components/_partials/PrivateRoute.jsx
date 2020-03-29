import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';

export default class PrivateRoute extends Component {

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    componentDidUpdate(){
        this.handleSpaceVisibility();
    }


    componentDidMount(){
        this.handleSpaceVisibility();
    }

    handleSpaceVisibility = () => {
        if (this.props.location.pathname === '/members') {
            $('.container_outer').addClass('outer_space');
        } else if (this.props.location.pathname.match(/profile/)) {
            $('.container_outer').addClass('outer_space');
        }
        else {
            $('.container_outer').removeClass('outer_space');
        }
    };

    render() {
        const {component: Component, ...rest} = this.props;
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        return (
                <Route {...rest}
                    render={props =>
                        isAuthenticated ? (
                            <Component {...props} />
                        ) : (
                            <Redirect to={{ pathname: "/login", state: { from: props.location }}}/>
                        )
                    }
                />
        );
    }//..... end of render() .....//
}//..... end of PrivateRoute.