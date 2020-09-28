const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const songSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  album: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
});

// Apply the uniqueValidator plugin to orderSchema.
songSchema.plugin(uniqueValidator, { type: "mongoose-unique-validator" });

const Song = mongoose.model("Song", songSchema);

module.exports = {
  Song,
};
