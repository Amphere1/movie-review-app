import React, { useState, useRef } from "react";
import axios from "axios";

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounceTimer = useRef(null);

  const handleSearch = async (term) => {
    if (!term) return;

    setIsLoading(true);
    setError(null);

    try {
      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${term}`;

      const response = await axios.get(url);
      setSearchResults(response.data.results);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch search results. Please try again.");
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

  return (
    <div className="max-w-5xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search Movies"
            value={searchTerm}
            onChange={handleSearchDebounced}
            className="w-full sm:flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-600 bg-red-100 border border-red-300 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {searchResults.length > 0 &&
          !error &&
          searchResults.map((movie) => (
            <div
              key={movie.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-72 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{movie.title}</h3>
                <p className="text-sm text-gray-500">
                  {movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : "N/A"}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SearchForm;
