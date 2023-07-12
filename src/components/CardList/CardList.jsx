import React, { Component } from 'react';
import { Alert, Pagination } from 'antd';

import CardItem from '../CardItem';
import getMovies, { getRatingMovies } from '../../services/getMovies';
import './CardList.css';

const ERROR_INTERNET_MESSAGE = 'Connection Timeout, please check your internet connection';
const ERROR_SEARCH_RESULT = 'The search has not given any results';
const ERROR_RATED_MOVIE_RESULT = 'There are no rated movies';

class CardList extends Component {
  state = {
    movies: [],
    error: false,
    isOnline: true,
    pageNum: 1,
    firstCall: false,
    noMovies: false,
    totalResults: 0,
    pageTrigger: false,
  };
  keyIterator = 1;

  getMovies = (pageNum = this.state.pageNum, pageTrigger = false) => {
    const { searchValue, handleLoadChange, guestId } = this.props;
    this.setState({ movies: [], error: false, noMovies: false });
    getMovies(searchValue, pageNum).then(
      (result) => {
        this.transformedMovies(result, guestId, pageTrigger, pageNum);
      },
      (error) => {
        handleLoadChange();
        this.setState({ movies: [], error: true, noMovies: true, errorText: error.message });
      }
    );
  };

  getRatingMovies = (pageTrigger = false, pageNum) => {
    const { guestId, handleLoadChange } = this.props;
    this.setState({ movies: [], error: false, noMovies: false });
    getRatingMovies(guestId, pageNum)
      .then((result) => {
        this.transformedMovies(result, guestId, pageTrigger, pageNum);
      })
      .catch((error) => {
        handleLoadChange();
        this.setState({ movies: [], error: true, noMovies: true, errorText: error.message });
      });
  };

  transformedMovies = (data, guestId, pageTrigger, pageNum) => {
    const { handleLoadChange } = this.props;
    if (!data.total_results) {
      handleLoadChange();
      this.setState({ noMovies: true, error: false });
    }
    let updatedMovies = [];

    data.results.forEach((item) => {
      const movie = {
        ...item,
        id: item.id,
        rating: item.rating,
      };
      updatedMovies.push(movie);
    });

    getRatingMovies(guestId, pageNum)
      .then((result) => {
        handleLoadChange();
        let updatedRatedMovies = [];
        result.results.forEach(({ id, rating }) => {
          const movie = {
            id,
            rating,
          };
          updatedRatedMovies.push(movie);
        });
        updatedRatedMovies.forEach((ratedMovie) => {
          updatedMovies.forEach((updatedMovie) => {
            if (ratedMovie.id === updatedMovie.id) {
              updatedMovie.rating = ratedMovie.rating;
            }
          });
        });
        this.setState({
          movies: updatedMovies,
          totalResults: data.total_results,
          pageTrigger: pageTrigger,
          error: false,
        });
      })
      .catch(() => this.setState({ movies: updatedMovies, totalResults: data.total_results, error: false }));
  };

  handleNetworkChange = () => {
    this.setState((prevState) => ({ isOnline: !prevState.isOnline }));
  };

  paginationClicked = (value) => {
    const { searchTub } = this.props;
    const { firstCall } = this.state;
    this.setState({ pageNum: value, pageTrigger: false });
    this.props.handleLoadChange(true);
    if (searchTub) {
      if (firstCall) {
        return;
      }
      this.setState({ firstCall: true });
      return this.getMovies(value);
    }
  };

  componentDidMount() {
    this.getMovies();
    window.addEventListener('online', this.handleNetworkChange);
    window.addEventListener('offline', this.handleNetworkChange);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleNetworkChange);
    window.removeEventListener('offline', this.handleNetworkChange);
  }

  componentDidUpdate(prevProps, prevState) {
    const currentState = this.state;
    const { searchTub } = this.props;
    if (prevState.pageNum !== currentState.pageNum) {
      if (!searchTub) {
        return this.getRatingMovies(false, currentState.pageNum);
      }
      this.getMovies(currentState.pageNum);
    }

    if (prevProps.searchTub !== this.props.searchTub) {
      if (!this.props.searchTub) {
        this.setState({ firstCall: false });
        this.getRatingMovies(true);
      } else {
        this.getMovies(1, true);
      }
    }

    if (currentState.isOnline !== prevState.isOnline) {
      if (navigator.onLine) {
        this.props.handleLoadChange(true);
        this.getMovies();
      } else {
        this.setState({
          error: true,
          errorText: ERROR_INTERNET_MESSAGE,
        });
      }
    }
  }

  createMoviesCards(movies) {
    return (
      <ul className="cardList">
        {movies.map((item) => {
          return (
            <CardItem
              key={this.keyIterator++}
              searchResult={item}
              handleRateChange={this.handleRateChange}
              baseImgUrl={'https://image.tmdb.org/t/p/original'}
            />
          );
        })}
      </ul>
    );
  }

  render() {
    const { movies, error, errorText, pageNum, totalResults, noMovies, pageTrigger } = this.state;
    const { loading, searchTub } = this.props;
    const errorStatus = error ? (
      <Alert className="errorStatus" message={'Error'} description={errorText} type="error" showIcon />
    ) : null;

    const noMoviesFound =
      noMovies && !error ? (
        <Alert
          showIcon
          type={'info'}
          className="error-message"
          message={searchTub ? ERROR_SEARCH_RESULT : ERROR_RATED_MOVIE_RESULT}
        />
      ) : null;

    const content = !error ? this.createMoviesCards(movies) : null;
    const pagination = !(loading || error || noMovies) ? (
      <PaginationView
        paginationClicked={this.paginationClicked}
        pageNum={pageNum}
        pageTrigger={pageTrigger}
        totalResults={totalResults}
      />
    ) : null;
    return (
      <>
        {errorStatus}
        {noMoviesFound}
        {content}
        {pagination}
      </>
    );
  }
}

const PaginationView = (props) => {
  const { paginationClicked, pageNum, totalResults, pageTrigger } = props;
  return (
    <Pagination
      className="block"
      current={pageTrigger ? 1 : pageNum}
      onChange={paginationClicked}
      showSizeChanger={false}
      showQuickJumper
      total={totalResults}
      pageSize={20}
    />
  );
};

export default CardList;
