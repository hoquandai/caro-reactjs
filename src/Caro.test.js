import React from 'react';
import ReactDOM from 'react-dom';
import Caro from './Caro';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Caro />, div);
  ReactDOM.unmountComponentAtNode(div);
});
