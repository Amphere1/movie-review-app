import mongoose from "mongoose";

const movieListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    movies: [{
        movieId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        posterPath: String,
        category: {
            type: String,
            enum: ['toWatch', 'watched', 'favorite'],
            default: 'toWatch',
            required: true
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} is not an integer value'
            }
        },
        review: {
            type: String,
            maxlength: 1000
        },
        addedAt: {
            type: Date,
            default: Date.now,
            required: true
        },
        watchedAt: {
            type: Date,
            validate: {
                validator: function(v) {
                    return !v || v instanceof Date;
                },
                message: props => `${props.value} is not a valid date!`
            }
        },
        tags: {
            type: [String],
            default: [],
            validate: {
                validator: function(v) {
                    return v.length <= 10; // Maximum 10 tags per movie
                },
                message: 'Cannot have more than 10 tags per movie'
            }
        }
    }]
});

// Index for faster queries
movieListSchema.index({ userId: 1, 'movies.movieId': 1 });

const MovieList = mongoose.model('MovieList', movieListSchema);

export default MovieList;
