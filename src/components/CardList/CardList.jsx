import React, { Component } from 'react';
import { Col, Row, Alert, Spin } from 'antd';

import Card from '../CardItem';
import getMovies from '../../Api';
import './CardList.css';

const ERROR_MESSAGE = 'Connection Timeout, please check your internet connection';

export default class CardList extends Component {
  state = { movies: [], loading: true, error: false };
  keyIterator = 1;

  componentDidMount() {
    getMovies('return').then(
      (res) => {
        this.setState({ movies: res.results, loading: false });
      },
      (error) => {
        this.setState({ error: true, loading: false, errorText: error.toString() });
      }
    );
  }

  createMoviesCards(movies) {
    return (
      <ul className="cardList">
        <Row gutter={[40, 40]}>
          {movies.map((item) => {
            return (
              <Col key={this.keyIterator++} span={12}>
                <Card searchResult={item} baseImgUrl={'https://image.tmdb.org/t/p/w500'} />
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
    const content = !(loading && error) ? this.createMoviesCards(movies) : null;
    return (
      <>
        {loadingStatus}
        {errorStatus}
        {content}
      </>
    );
  }
}
