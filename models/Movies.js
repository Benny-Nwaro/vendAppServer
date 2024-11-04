const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MovieSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  size:{
    type: String
  },
  category:{
    type: String
  },
  price:{
    type: String
  },
  updated: {
    type: Date,
    default: Date.now(),
  },
});

const Movie = mongoose.model("Movie", MovieSchema);
module.exports = Movie;
