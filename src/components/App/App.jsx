/* eslint-disable no-debugger */
import React, { Component } from 'react';
import { Input, Spin } from 'antd';
import { debounce } from 'lodash';

import CardList from '../CardList';
import './App.css';

export default class App extends Component {
  state = { searchValue: null, loading: false };

  handleChangeValue = (event) => {
    const {
      target: { value },
    } = event;
    const trueValue = value.trim();

    this.setState({ searchValue: null });
    this.delayedSearch(trueValue);
  };

  handleLoadChange = (trigger = false) => {
    this.setState({ loading: trigger });
  };

  delayedSearch = debounce((trueValue) => {
    if (!trueValue) {
      return;
    }
    this.setState({ searchValue: trueValue, loading: true });
  }, 1000);

  render() {
    const { searchValue, loading } = this.state;
    const input = <SearchInput handleChangeValue={this.handleChangeValue} />;
    const loadingStatus = loading ? (
      <div className="spinnerWrapper">
        <Spin className="spinner" size="large" tip="Loading">
          <div className="content" />
        </Spin>
      </div>
    ) : null;
    const content = searchValue ? (
      <CardList searchValue={searchValue} loading={loading} handleLoadChange={this.handleLoadChange} />
    ) : null;
    return (
      <div className="wrapper">
        {input}
        {loadingStatus}
        {content}
      </div>
    );
  }
}

const SearchInput = (props) => {
  const { handleChangeValue } = props;
  return (
    <Input
      className="searchInput"
      placeholder="input search text"
      allowClear
      onChange={handleChangeValue}
      size="large"
    />
  );
};
