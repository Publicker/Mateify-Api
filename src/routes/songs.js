const express = require("express");
const Router = express.Router();

const controller = require("../controllers/songs");

Router.get("/", controller.index);

Router.post("/", controller.postSong);

Router.get("/:id", controller.getSong);

Router.put("/:id", controller.putSong);

Router.delete("/:id", controller.deleteSong);

module.exports = {
  Router,
};
