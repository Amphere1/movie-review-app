import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import MovieCard from './MovieCard';
import config from '../config';

const MovieList = ({ category }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('addedAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [retryCount, setRetryCount] = useState(0);
    const navigate = useNavigate();
    const axiosRef = useRef();

    // Create axios instance with interceptors
    useEffect(() => {
        const token = localStorage.getItem('movieReviewToken');        axiosRef.current = axios.create({
            baseURL: config.apiUrl,
            headers: { Authorization: `Bearer ${token}` }
        });

        // Add response interceptor for handling token expiration
        axiosRef.current.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('movieReviewToken');
                    localStorage.removeItem('username');
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );
    }, [navigate]);

    const fetchMovies = useCallback(async () => {
        if (!axiosRef.current) return;
        
        try {
            setLoading(true);
            setError(null);

            const response = await axiosRef.current.get(
                `/api/movielist/category/${category}`,
                { params: { sortBy, sortOrder } }
            );

            setMovies(response.data);
            setRetryCount(0); // Reset retry count on success
        } catch (err) {
            if (!navigator.onLine) {
                setError('No internet connection. Please check your network.');
            } else {
                setError(err.response?.data?.message || 'Failed to fetch movies');
                // Retry up to 3 times with exponential backoff
                if (retryCount < 3) {
                    const timeout = Math.pow(2, retryCount) * 1000;
                    setTimeout(() => {
                        setRetryCount(prev => prev + 1);
                    }, timeout);
                }
            }
        } finally {
            setLoading(false);
        }
    }, [category, sortBy, sortOrder, retryCount]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const handleMovieUpdate = useCallback(() => {
        fetchMovies();
    }, [fetchMovies]);

    const getCategoryTitle = useCallback(() => {
        switch (category) {
            case 'toWatch':
                return 'Watch Later';
            case 'watched':
                return 'Watched Movies';
            case 'favorite':
                return 'Favorite Movies';
            default:
                return 'Movies';
        }
    }, [category]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="loader w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                    <button
                        onClick={() => fetchMovies()}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-white">{getCategoryTitle()}</h2>
                <div className="flex flex-wrap gap-4">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-zinc-800 text-white rounded px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                        <option value="addedAt">Date Added</option>
                        <option value="title">Title</option>
                        {category === 'watched' && (
                            <>
                                <option value="watchedAt">Date Watched</option>
                                <option value="rating">Rating</option>
                            </>
                        )}
                    </select>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="bg-zinc-800 text-white rounded px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>

            {movies.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                    <p className="text-lg mb-4">No movies in this list yet.</p>
                    <Link 
                        to="/search" 
                        className="inline-block bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
                    >
                        Search Movies
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie.movieId}
                            movie={movie}
                            onUpdate={handleMovieUpdate}
                            inUserList={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default React.memo(MovieList);
