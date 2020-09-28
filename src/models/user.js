const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    unique: true,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  favoriteSongs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
});

// Apply the uniqueValidator plugin to UserSchema.
userSchema.plugin(uniqueValidator, { type: "mongoose-unique-validator" });

const User = model("User", userSchema);

module.exports = {
  User,
};
