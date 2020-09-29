const { Song } = require("../models/song");

var ObjectID = require("mongodb").ObjectID;

module.exports = {
  index: async (req, res, next) => {
    const songs = await Song.find({});

    res.status(200).json(songs);
  },
  getSong: async (req, res, next) => {
    const { songId } = req.params;

    if (!ObjectID.isValid(songId)) {
      return res.status(400).json({ error: "Invalid song id" });
    }

    try {
      const song = await Song.findById(songId);
      if (song) {
        return res.status(200).json(song);
      } else {
        return res.status(404).json({ error: "Not found" });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
  postSong: async (req, res, next) => {
    try {
      const newSong = new Song(req.body);

      await newSong.save();

      return res.status(201).json(newSong);
    } catch (err) {
      return res.status(400).json({
        error: "Wrong request. Missing or wrong song data",
        details: err,
      });
    }
  },
  putSong: async (req, res, next) => {
    const { songId } = req.params;

    if (!ObjectID.isValid(songId)) {
      return res.status(400).json({ error: "Invalid song id" });
    }

    try {
      const prevSong = await Song.findById(songId);
      const newData = req.body;

      const newSong = new Song(global.Object.assign(prevSong, newData));

      await newSong.validate(async (err) => {
        if (err) {
          console.log("err ", err);
          return res.status(400).json({ flag: "Bad Request", details: err });
        }

        const updatedSong = await Song.findByIdAndUpdate(songId, newData, {
          new: true,
        });
        return res.status(200).json({ updatedSong: updatedSong });
      });
    } catch (err) {
      return res.status(404).json({ error: err.message });
    }
  },
  deleteSong: async (req, res, next) => {
    const { songId } = req.params;

    if (!ObjectID.isValid(songId)) {
      return res.status(400).json({ error: "Invalid song id" });
    }

    const deletedSong = await Song.findByIdAndDelete(songId);

    if (!deletedSong) {
      return res
        .status(400)
        .json({ error: "Bad request. The song was not founded" });
    }

    return res.status(200).json({ deletedSong: deletedSong });
  },
};
