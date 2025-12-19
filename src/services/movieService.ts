import axios from "axios";
import type { Movie } from "../types/movie";

axios.defaults.baseURL = "https://api.themoviedb.org/3";

interface MovieHttpResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (
  title: string,
  page: number
): Promise<MovieHttpResponse> => {
  const { data } = await axios.get<MovieHttpResponse>("/search/movie", {
    params: {
      query: title,
      page,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });

  return data;
};
