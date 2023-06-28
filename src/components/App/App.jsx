import React, { Component } from 'react';

import CardList from '../CardList';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div className="wrapper">
        <CardList />
      </div>
    );
  }
}
