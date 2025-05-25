import React, { useState, useRef, useEffect } from "react";
import api from '../services/api';
import MovieCard from "./MovieCard";

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userMovieList, setUserMovieList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [yearFilter, setYearFilter] = useState("");

  const debounceTimer = useRef(null);

  useEffect(() => {
    // Fetch user's movie list
    const fetchUserMovies = async () => {
      try {
        const response = await api.get("/api/movielist");
        setUserMovieList(response.data);
      } catch (error) {
        console.error("Failed to fetch user movies:", error);
      }
    };

    // Fetch genres
    const fetchGenres = async () => {
      try {
        const response = await api.get("/api/search/genres");
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };

    fetchUserMovies();
    fetchGenres();
  }, []);

  const handleSearch = async (term) => {
    if (!term) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/api/search`, {
        params: {
          q: term,
          year: yearFilter,
          genres: selectedGenres.join(","),
          category: selectedCategory !== "all" ? selectedCategory : undefined,
        }
      });

      let results = response.data.results || [];

      // Filter results based on selected category if needed
      if (selectedCategory !== "all") {
        const userMovies = userMovieList.filter(
          (m) => m.category === selectedCategory
        );
        const userMovieIds = userMovies.map((m) => m.movieId);
        results = results.filter((movie) => userMovieIds.includes(movie.id.toString()));
      }

      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      if (error.response?.status === 401) {
        setError("Please login again to continue searching.");
        localStorage.removeItem("movieReviewToken");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to fetch search results. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchDebounced = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const handleMovieUpdate = () => {
    // Refresh user's movie list after updates
    const fetchUserMovies = async () => {
      try {
        const response = await api.get("/api/movielist");
        setUserMovieList(response.data);
      } catch (error) {
        console.error("Failed to fetch user movies:", error);
      }
    };
    fetchUserMovies();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          {/* Search input */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Search for movies..."
              value={searchTerm}
              onChange={handleSearchDebounced}
              className="w-full sm:flex-1 px-5 py-3 rounded-xl bg-zinc-900 text-white placeholder-gray-400 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md transition"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition duration-200 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="loader w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  Searching...
                </div>
              ) : (
                "Search"
              )}
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-zinc-900 rounded-xl">
            {/* Category Filter */}
            <div>
              <label className="block text-white text-sm mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-zinc-800 text-white rounded px-3 py-2"
              >
                <option value="all">All Movies</option>
                <option value="toWatch">To Watch</option>
                <option value="watched">Watched</option>
                <option value="favorite">Favorites</option>
              </select>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-white text-sm mb-2">Genres</label>
              <select
                multiple
                value={selectedGenres}
                onChange={(e) =>
                  setSelectedGenres(
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
                className="w-full bg-zinc-800 text-white rounded px-3 py-2"
              >
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-white text-sm mb-2">Release Year</label>
              <input
                type="number"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                placeholder="Enter year"
                className="w-full bg-zinc-800 text-white rounded px-3 py-2"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 shadow">
          {error}
        </div>
      )}

      {/* Search Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {searchResults.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onUpdate={handleMovieUpdate}
            inUserList={userMovieList.some(
              (m) => m.movieId === movie.id.toString()
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchForm;
