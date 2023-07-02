/* eslint-disable no-debugger */
import React, { Component } from 'react';
import { Col, Row, Alert, Pagination } from 'antd';

import Card from '../CardItem';
import getMovies from '../../Api';
import './CardList.css';

const ERROR_MESSAGE = 'Connection Timeout, please check your internet connection';
const ERROR_SEARCH_RESULT = 'The search has not given any results';

export default class CardList extends Component {
  state = { movies: [], error: false, isOnline: true, pageNum: 1 };
  keyIterator = 1;

  createMovies(pageNum = this.state.pageNum) {
    const { searchValue, handleLoadChange } = this.props;
    getMovies(searchValue, pageNum).then(
      (res) => {
        handleLoadChange();
        if (!res.total_results) {
          return this.setState({ error: true, errorText: ERROR_SEARCH_RESULT });
        }
        this.setState({ movies: res.results, totalResults: res.total_results, error: false });
      },
      (error) => {
        handleLoadChange();
        this.setState({ error: true, errorText: error.toString() });
      }
    );
  }
  handleNetworkChange = () => {
    this.setState((prevState) => ({ isOnline: !prevState.isOnline }));
  };

  paginationClicked = (value) => {
    this.setState({ pageNum: value, movies: [] });
    this.props.handleLoadChange(true);
  };

  componentDidMount() {
    this.createMovies();
    window.addEventListener('online', this.handleNetworkChange);
    window.addEventListener('offline', this.handleNetworkChange);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleNetworkChange);
    window.removeEventListener('offline', this.handleNetworkChange);
  }

  componentDidUpdate(prevProps, prevState) {
    const currentState = this.state;

    if (prevState.pageNum !== currentState.pageNum) {
      this.createMovies(currentState.pageNum);
    }

    if (currentState.isOnline !== prevState.isOnline) {
      if (navigator.onLine) {
        this.createMovies();
      } else {
        this.setState({
          error: true,
          errorText: ERROR_MESSAGE,
        });
      }
    }
  }

  createMoviesCards(movies) {
    return (
      <ul className="cardList">
        <Row gutter={[60, 30]}>
          {movies.map((item) => {
            return (
              <Col key={this.keyIterator++} span={12}>
                <Card searchResult={item} baseImgUrl={'https://image.tmdb.org/t/p/original'} />
              </Col>
            );
          })}
        </Row>
      </ul>
    );
  }

  render() {
    const { movies, error, errorText, pageNum, totalResults } = this.state;
    const { loading } = this.props;

    const errorStatus = error ? (
      <Alert className="errorStatus" message={'Error'} description={errorText} type="error" showIcon />
    ) : null;

    const content = !error ? this.createMoviesCards(movies) : null;
    const pagination = !(loading || error) ? (
      <PaginationView paginationClicked={this.paginationClicked} pageNum={pageNum} totalResults={totalResults} />
    ) : null;
    return (
      <>
        {errorStatus}
        {content}
        {pagination}
      </>
    );
  }
}

const PaginationView = (props) => {
  const { paginationClicked, pageNum, totalResults } = props;
  return (
    <Pagination
      className="block"
      current={pageNum}
      onChange={paginationClicked}
      showSizeChanger={false}
      showQuickJumper
      total={totalResults}
      pageSize={20}
    />
  );
};
