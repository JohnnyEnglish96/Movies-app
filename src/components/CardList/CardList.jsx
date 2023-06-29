import React, { Component } from 'react';
import { Col, Row, Alert, Spin } from 'antd';

import Card from '../CardItem';
import getMovies from '../../Api';
import './CardList.css';

const ERROR_MESSAGE = 'Connection Timeout, please check your internet connection';
const IS_OFFLINE_MESSAGE = 'You are offline';

export default class CardList extends Component {
  state = { movies: [], loading: true, error: false, isOnline: true };
  keyIterator = 1;

  createMovies() {
    getMovies('return').then(
      (res) => {
        this.setState({ movies: res.results, loading: false, error: false });
      },
      (error) => {
        this.setState({ error: true, loading: false, errorText: error.toString() });
      }
    );
  }

  handleNetworkChange = () => {
    this.setState((prevState) => ({ isOnline: !prevState.isOnline }));
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
    if (currentState.isOnline !== prevState.isOnline) {
      if (navigator.onLine) {
        this.createMovies();
      } else {
        this.setState({
          error: true,
          loading: false,
          errorText: IS_OFFLINE_MESSAGE,
        });
      }
    }
  }

  createMoviesCards(movies) {
    return (
      <ul className="cardList">
        <Row gutter={[40, 40]}>
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
    const { movies, loading, error, errorText } = this.state;
    const errorStatus = error ? (
      <Alert className="errorStatus" message={ERROR_MESSAGE} description={errorText} type="error" showIcon />
    ) : null;
    const loadingStatus = loading ? <Spin className="loadingStatus" size="large"></Spin> : null;
    const content = !(loading || error) ? this.createMoviesCards(movies) : null;
    return (
      <>
        {loadingStatus}
        {errorStatus}
        {content}
      </>
    );
  }
}
