const { User } = require("../models/user");
const { Song } = require("../models/song");

const { ObjectID } = require("mongodb");

module.exports = {
  index: async (req, res, next) => {
    try {
      const users = await User.find({}).populate("favoriteSongs");

      res.status(200).json(users);
    } catch (e) {
      return res.status(500).json(err);
    }
  },
  getUser: async (req, res, next) => {
    const { userId } = req.params;

    if (!ObjectID.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    try {
      const user = await User.findById(userId).populate("favoriteSongs");
      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(404).json({ error: "Not found" });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
  postUser: async (req, res, next) => {
    const data = req.body;
    try {
      const newUser = new User(data);
      await newUser.save();

      return res.status(201).json(newUser);
    } catch (err) {
      return res.status(400).json({ error: "Bad request" });
    }
  },
  putUser: async (req, res, next) => {
    const { userId } = req.params;
    console.log(userId);
    if (!ObjectID.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    try {
      const prevUser = await User.findById(userId).populate("favoriteSongs");
      const newData = req.body;

      const newUser = new User(global.Object.assign(prevUser, newData));

      await newUser.validate(async (err) => {
        if (err) {
          return res.status(400).json({ error: "Bad request" });
        }

        await User.findByIdAndUpdate(userId, newData, {
          new: true,
        });
        return res.status(200).json({ updatedUser: newUser });
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
  deleteUser: async (req, res, next) => {
    const { userId } = req.params;

    if (!ObjectID.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res
        .status(400)
        .json({ error: "Bad request. The user was not founded" });
    }

    try {
      return res.status(200).json({ deletedUser: deletedUser });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
  getUserByMail: async (req, res, next) => {
    const { mail } = req.params;

    if (!mail) {
      return res.status(400).json({ status: 400, error: "Bad request" });
    }

    try {
      const user = await User.find({ mail: mail });
      if (user[0]) {
        return res.status(200).json(user[0]);
      } else {
        return res.status(404).json({ error: "Not found" });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
  addFavoriteSong: async (req, res, next) => {
    const { userId } = req.params;
    const { songId } = req.body;

    if (!ObjectID.isValid(userId) || !ObjectID.isValid(songId)) {
      return res
        .status(400)
        .json({ error: "Bad request. Invalid user id or song id" });
    }

    try {
      const prevUser = await User.findById(userId).populate("favoriteSongs");

      // If song was already in favorites
      const indexSong = prevUser.favoriteSongs.findIndex(
        (favoriteSong) => favoriteSong.id == songId
      );
      if (indexSong != -1) {
        return res.status(400).json({
          error: "Bad request. The song was already in your favorite songs",
        });
      }

      const song = await Song.findById(songId);
      const newData = prevUser;
      newData.favoriteSongs.push(song);

      const newUser = new User(global.Object.assign(prevUser, newData));

      await newUser.validate(async (err) => {
        if (err) {
          return res.status(400).json({ error: "Bad request" });
        }

        await User.findByIdAndUpdate(userId, newData, {
          new: true,
        });

        return res.status(200).json({ updatedUser: newUser });
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
  removeFavoriteSong: async (req, res, next) => {
    const { userId, songId } = req.params;

    if (!ObjectID.isValid(userId) || !ObjectID.isValid(songId)) {
      return res
        .status(400)
        .json({ error: "Bad request. Invalid user id or song id" });
    }

    try {
      const prevUser = await User.findById(userId);

      // If song was not in favorites
      const indexSong = prevUser.favoriteSongs.findIndex(
        (favoriteSongId) => favoriteSongId == songId
      );

      console.log(prevUser.favoriteSongs);
      if (indexSong == -1) {
        return res.status(400).json({
          error: "Bad request. The song was not in your favorite songs",
        });
      }
      const newData = prevUser;
      newData.favoriteSongs.splice(indexSong, 1);

      const newUser = new User(global.Object.assign(prevUser, newData));

      await newUser.validate(async (err) => {
        if (err) {
          return res.status(400).json({ error: "Bad request" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, newData, {
          new: true,
        }).populate("favoriteSongs");

        return res.status(200).json({ updatedUser: updatedUser });
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};
