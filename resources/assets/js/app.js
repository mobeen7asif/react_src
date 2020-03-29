import React from 'react';
import ReactDOM from "react-dom";
import ConfigureStore from "./components/redux/store/ConfigureStore";
import {Provider} from 'react-redux';
import Master from './components/Master';

/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */


//require('./components/Master');

const store = ConfigureStore();

let jsx = (
    <Provider store={store}>
        <Master/>
    </Provider>
);

if (document.getElementById('root')) {
    ReactDOM.render(jsx, document.getElementById('root'));
}