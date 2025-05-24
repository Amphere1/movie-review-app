import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';

const MovieList = ({ category }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('addedAt');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchMovies();
    }, [category, sortBy, sortOrder]);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('movieReviewToken');
            if (!token) {
                setError('Please log in to view your movie list');
                return;
            }

            const response = await axios.get(
                `http://localhost:5000/api/movielist/category/${category}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { sortBy, sortOrder }
                }
            );

            setMovies(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch movies');
        } finally {
            setLoading(false);
        }
    };

    const handleMovieUpdate = () => {
        fetchMovies();
    };

    const getCategoryTitle = () => {
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
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="loader w-8 h-8 border-4 border-red-600 rounded-full"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{getCategoryTitle()}</h2>
                <div className="flex gap-4">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-zinc-800 text-white rounded px-3 py-2"
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
                        className="bg-zinc-800 text-white rounded px-3 py-2"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>

            {movies.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                    No movies in this list yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

export default MovieList;
