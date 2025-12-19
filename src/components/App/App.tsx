import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import MovieGrid from "./../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

  const handleSearch = async (title: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setMovies([]);

      const movieList = await fetchMovies(title);

      if (movieList.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }

      setMovies(movieList);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (movie: Movie) => {
    setCurrentMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && <MovieGrid onSelect={openModal} movies={movies} />}
      {isModalOpen && currentMovie && (
        <MovieModal movie={currentMovie} onClose={closeModal} />
      )}
      <Toaster
        toastOptions={{
          error: {
            style: {
              background: "#ffffff",
              color: "#000000",
            },
            iconTheme: {
              primary: "#e53935",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </>
  );
}
