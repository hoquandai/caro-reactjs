import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Caro from './Caro';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Caro />, document.getElementById('root'));

// If you want your Caro to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
