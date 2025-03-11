export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
    }
}

export const fetchMovies = async ({query, trending = false} : {
    query: string
    trending: boolean
}) => {
    const endpoint = trending
    ? `${TMDB_CONFIG.BASE_URL}/trending/movie/day?language=en-US`
        : query
            ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
            : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    })

    if (!response.ok) {
        // @ts-ignore
        throw new Error("Could not fetch movies from API", response.statusText);
    }

    const movies = await response.json();
    return movies.results;
}

export const fetchMovieDetails = async (movieId: string) : Promise<MovieDetails> => {
    try {
        const res = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`, {
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        })
        if (!res.ok) {
            throw new Error("Could not fetch movie details from API");
        }

        const movieDetails = await res.json();
        return movieDetails;
    } catch (err) {
        console.error(err)
        throw new Error("Could not fetch movie details from API")
    }
}

export const fetchRecommendedMovies = async (movieId: string) : Promise<MovieDetails> => {
    try {
        const res = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}/recommendations?language=en-US&page=1`, {
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        })

        if (!res.ok) {
            throw new Error("Could not fetch movie details from API")
        }
        const recommendedMovies = await res.json();
        return recommendedMovies.results;
    } catch (err) {
        console.error(err)
        throw new Error("Could not fetch movie details from API")
    }
}