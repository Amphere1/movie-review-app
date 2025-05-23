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
      const token = localStorage.getItem("movieReviewToken");
      console.log("Making search request with term:", term);

      const response = await axios.get(`http://localhost:5000/api/search`, {
        params: { q: term },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Search response:", response.data);

      if (response.data && response.data.results) {
        setSearchResults(response.data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8">
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
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 shadow">
          {error}
        </div>
      )}

      {/* Search Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {searchResults.length > 0 &&
          !error &&
          searchResults.map((movie) => (
            <div
              key={movie.id}
              className="bg-zinc-900 rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden"
            >
              <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-72 object-cover"
              />
              <div className="p-4 text-white">
                <h3 className="text-lg font-semibold">{movie.title}</h3>
                <p className="text-sm text-gray-400">
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
