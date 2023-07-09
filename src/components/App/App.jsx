/* eslint-disable no-debugger */
import React, { Component } from 'react';
import { Input, Spin, Tabs, Alert } from 'antd';
import { debounce } from 'lodash';

import CardList from '../CardList';
import { createGuestSession, makeRating, getGenresList } from '../../services/Api';
import { Provider } from '../../services/context/context';
import './App.css';

const GUEST_SESSION_ERROR_TEXT = 'failed to get guest sesion id';
const NO_GENRE_LIST_ERROR_TEXT = 'failed to get genre list';
const ERROR_RATED_MOVIE_RESULT = 'There are no rated movies';

const tabButtons = [
  {
    key: '1',
    label: 'Search',
  },
  {
    key: '2',
    label: 'Rated',
  },
];

export default class App extends Component {
  state = {
    guestId: null,
    searchValue: null,
    loading: false,
    searchTub: true,
    rated: false,
    error: false,
  };

  delayedSearch = debounce((trueValue) => {
    const { error } = this.state;
    if (!trueValue || error) {
      return;
    }
    this.setState({ searchValue: trueValue, loading: true });
  }, 1000);

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

  handleTabClicked = (event) => {
    const { searchValue } = this.state;
    const trigger = event === '2' ? false : true;
    if (!searchValue) {
      return this.setState({ searchTub: trigger, loading: false });
    }
    this.setState({ searchTub: trigger, loading: true });
  };

  handleRateChange = (guestId, value, id) => {
    makeRating(guestId, value, id).catch((error) => this.setState({ error: true, errorText: error.message }));
  };

  componentDidMount() {
    createGuestSession()
      .then((result) => {
        this.setState({ guestId: result.guest_session_id, error: false });
      })
      .catch((error) => this.setState({ error: true, errorText: `${error.message}, ${GUEST_SESSION_ERROR_TEXT}` }));
    getGenresList()
      .then((result) => {
        this.setState({ genreList: result.genres, error: false });
      })
      .catch((error) => this.setState({ error: true, errorText: `${error.message}, ${NO_GENRE_LIST_ERROR_TEXT}` }));
  }

  render() {
    const { searchValue, loading, searchTub, error, errorText, guestId } = this.state;
    const tabs = <Tabs defaultActiveKey="1" items={tabButtons} onChange={this.handleTabClicked} />;
    const input = searchTub ? (
      <SearchInput handleChangeValue={this.handleChangeValue} searchValue={searchValue} />
    ) : null;
    const errorStatus = error ? (
      <Alert className="errorStatus" message={'Error'} description={errorText} type="error" showIcon />
    ) : null;
    const loadingStatus = loading ? (
      <div className="spinnerWrapper">
        <Spin className="spinner" size="large" tip="Loading">
          <div className="content" />
        </Spin>
      </div>
    ) : null;
    const noRatedContent =
      !searchTub && !searchValue && !error ? (
        <Alert showIcon type={'info'} className="error-message" message={ERROR_RATED_MOVIE_RESULT} />
      ) : null;
    const content =
      searchValue && !error ? (
        <Provider value={{ state: this.state, handleRateChange: this.handleRateChange }}>
          <CardList
            searchValue={searchValue}
            loading={loading}
            searchTub={searchTub}
            guestId={guestId}
            handleLoadChange={this.handleLoadChange}
          />
        </Provider>
      ) : null;
    return (
      <div className="wrapper">
        {tabs}
        {input}
        {noRatedContent}
        {errorStatus}
        {loadingStatus}
        {content}
      </div>
    );
  }
}

const SearchInput = (props) => {
  const { handleChangeValue, searchValue } = props;
  return (
    <Input
      className="searchInput"
      placeholder="input search text"
      allowClear
      defaultValue={searchValue}
      onChange={handleChangeValue}
      size="large"
    />
  );
};
