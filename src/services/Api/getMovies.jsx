const baseGuestUrl = 'https://api.themoviedb.org/3/authentication/guest_session/new';
const baseGenresUrl = 'https://api.themoviedb.org/3/genre/movie/list';
const baseSearchUrl = 'https://api.themoviedb.org/3/search/movie';
const baseRateUrl = 'https://api.themoviedb.org/3/movie/';
const baseGetRatedMovies = 'https://api.themoviedb.org/3/guest_session/';
const api_key = '175ede1b914f63d9714bb7e7a7b11234';

const baseGetOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNzVlZGUxYjkxNGY2M2Q5NzE0YmI3ZTdhN2IxMTIzNCIsInN1YiI6IjY0OTk2Y2Q1YjM0NDA5MDEzOTg1M2JlZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O6706KTvrZuz9GS-QPCSx-yf4b2ZOsyeCmT4-9VdPKc',
  },
};

const createGuestSession = async () => {
  const response = await fetch(baseGuestUrl, baseGetOptions);
  if (!response.ok) throw new Error(`Response Error ${response.status}`);
  return await response.json();
};

const getGenresList = async () => {
  const response = await fetch(baseGenresUrl, baseGetOptions);
  if (!response.ok) throw new Error(`Response Error ${response.status}`);
  return await response.json();
};

const getMovies = async (search, pageNum) => {
  const searchParams = new URLSearchParams({
    query: search,
    include_adult: false,
    language: 'en-US',
    page: pageNum,
  }).toString();

  const response = await fetch(`${baseSearchUrl}?${searchParams}`, baseGetOptions);
  if (!response.ok) throw new Error(`Error status ${response.status}, unable to get movies`);
  return await response.json();
};

const makeRating = async (guest_session_id, starValue, movieId) => {
  const response = await fetch(
    `${baseRateUrl}${movieId}/rating?api_key=${api_key}&guest_session_id=${guest_session_id}`,
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: starValue }),
    }
  );
  if (!response.ok) throw new Error(`Response status: ${response.status}`);
};

const getRatingMovies = async (guest_session_id, pageNum = 1) => {
  const searchParams = new URLSearchParams({
    api_key: api_key,
    language: 'en-US',
    page: pageNum,
    sort_by: 'created_at.asc',
  }).toString();

  const response = await fetch(`${baseGetRatedMovies}${guest_session_id}/rated/movies?${searchParams}`, baseGetOptions);
  if (!response.ok) throw new Error(`Error status ${response.status}, unable to get rated movies`);
  return await response.json();
};

export { createGuestSession, makeRating, getRatingMovies, getGenresList };
export default getMovies;
