const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MovieListSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  updated: {
    type: Date,
    default: Date.now(),
  },
});

const MovieList = mongoose.model("MovieList", MovieListSchema);
module.exports = MovieList;
