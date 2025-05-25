import React, { useState } from 'react';
import api from '../services/api';

const MovieCard = ({ movie, onUpdate, inUserList }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);    const handleAddToList = async (category) => {
        setLoading(true);
        setError(null);
        try {
            await api.post('/api/movielist/add', {
                movieId: movie.id.toString(),
                title: movie.title,
                posterPath: movie.poster_path,
                category
            });
            if (onUpdate) onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add movie');
        } finally {
            setLoading(false);
        }
    };    const handleUpdateMovie = async (category) => {
        setLoading(true);
        setError(null);
        try {
            await api.patch(`/api/movielist/${movie.id}`, {
                category,
                rating: rating || undefined,
                review: review || undefined,
                tags: tags ? tags.split(',').map(t => t.trim()) : undefined
            });
            if (onUpdate) onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update movie');
        } finally {
            setLoading(false);
        }
    };    const handleRemoveFromList = async () => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/api/movielist/${movie.id}`);
            if (onUpdate) onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to remove movie');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-zinc-900 rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden">
            <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-72 object-cover cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            />
            <div className="p-4 text-white">
                <h3 className="text-lg font-semibold">{movie.title}</h3>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-400">
                        {movie.release_date
                            ? new Date(movie.release_date).getFullYear()
                            : "N/A"}
                    </p>
                    <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-sm">
                            {movie.vote_average?.toFixed(1) || "N/A"}
                        </span>
                    </div>
                </div>

                {isExpanded && (
                    <div className="mt-4 space-y-4">
                        {!inUserList ? (
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleAddToList('toWatch')}
                                    className="px-3 py-1 bg-blue-600 rounded-md text-sm hover:bg-blue-700"
                                    disabled={loading}
                                >
                                    Watch Later
                                </button>
                                <button
                                    onClick={() => handleAddToList('watched')}
                                    className="px-3 py-1 bg-green-600 rounded-md text-sm hover:bg-green-700"
                                    disabled={loading}
                                >
                                    Watched
                                </button>
                                <button
                                    onClick={() => handleAddToList('favorite')}
                                    className="px-3 py-1 bg-red-600 rounded-md text-sm hover:bg-red-700"
                                    disabled={loading}
                                >
                                    Favorite
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleUpdateMovie('toWatch')}
                                        className="px-3 py-1 bg-blue-600 rounded-md text-sm hover:bg-blue-700"
                                        disabled={loading}
                                    >
                                        Move to Watch Later
                                    </button>
                                    <button
                                        onClick={() => handleUpdateMovie('watched')}
                                        className="px-3 py-1 bg-green-600 rounded-md text-sm hover:bg-green-700"
                                        disabled={loading}
                                    >
                                        Mark as Watched
                                    </button>
                                    <button
                                        onClick={() => handleUpdateMovie('favorite')}
                                        className="px-3 py-1 bg-red-600 rounded-md text-sm hover:bg-red-700"
                                        disabled={loading}
                                    >
                                        Add to Favorites
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-sm mb-1">Rating</label>
                                        <select
                                            value={rating}
                                            onChange={(e) => setRating(Number(e.target.value))}
                                            className="w-full bg-zinc-800 rounded px-2 py-1"
                                        >
                                            <option value="0">Select rating</option>
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <option key={num} value={num}>{num} stars</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm mb-1">Review</label>
                                        <textarea
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                            className="w-full bg-zinc-800 rounded px-2 py-1"
                                            rows="2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm mb-1">Tags (comma-separated)</label>
                                        <input
                                            type="text"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            className="w-full bg-zinc-800 rounded px-2 py-1"
                                            placeholder="action, favorite, ..."
                                        />
                                    </div>

                                    <button
                                        onClick={handleRemoveFromList}
                                        className="w-full px-3 py-1 bg-red-600 rounded-md text-sm hover:bg-red-700"
                                        disabled={loading}
                                    >
                                        Remove from List
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="text-red-500 text-sm mt-2">
                                {error}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieCard;
