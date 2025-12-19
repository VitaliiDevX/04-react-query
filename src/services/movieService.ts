import axios from "axios";
import type { Movie } from "../types/movie";

axios.defaults.baseURL = "https://api.themoviedb.org/3";

interface MovieHttpResponse {
  results: Movie[];
}

export const fetchMovies = async (title: string): Promise<Movie[]> => {
  const response = await axios.get<MovieHttpResponse>("/search/movie", {
    params: {
      query: title,
      language: "en-US",
      page: 1,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });

  return response.data.results;
};
