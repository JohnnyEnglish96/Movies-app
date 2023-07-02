const getMovies = async (search, pageNum) => {
  const baseSearchUrl = 'https://api.themoviedb.org/3/search/movie';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNzVlZGUxYjkxNGY2M2Q5NzE0YmI3ZTdhN2IxMTIzNCIsInN1YiI6IjY0OTk2Y2Q1YjM0NDA5MDEzOTg1M2JlZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O6706KTvrZuz9GS-QPCSx-yf4b2ZOsyeCmT4-9VdPKc',
    },
  };
  const searchParams = new URLSearchParams({
    query: search,
    include_adult: false,
    language: 'en-US',
    page: pageNum,
  }).toString();

  const response = await fetch(`${baseSearchUrl}?${searchParams}`, options);
  if (!response.ok) {
    throw new Error(`response Error ${response.status}`);
  }
  return await response.json();
};

export default getMovies;
