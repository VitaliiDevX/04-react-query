import { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import MovieGrid from "./../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

export default function App() {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [movieTitle, setMovieTitle] = useState("");
  const [page, setPage] = useState(1);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["fetchMovies", movieTitle, page],
    queryFn: () => fetchMovies(movieTitle, page),
    enabled: movieTitle.trim().length > 0,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

  const handleSearch = async (title: string) => {
    setMovieTitle(title);
    setPage(1);
  };

  const openModal = (movie: Movie) => {
    setCurrentMovie(movie);
  };

  const closeModal = () => {
    setCurrentMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {data && data.results.length > 0 && (
        <MovieGrid onSelect={openModal} movies={data.results} />
      )}
      {currentMovie && <MovieModal movie={currentMovie} onClose={closeModal} />}
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
