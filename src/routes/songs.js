const express = require("express");
const Router = express.Router();

const controller = require("../controllers/songs");

Router.get("/", controller.index);

Router.post("/", controller.postSong);

Router.get("/:songId", controller.getSong);

Router.put("/:songId", controller.putSong);

Router.delete("/:songId", controller.deleteSong);

module.exports = {
  Router,
};
