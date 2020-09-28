const express = require("express");
const Router = express.Router();

const controller = require("../controllers/users");

Router.get("/", controller.index);

Router.get("/:userId", controller.getUser);

Router.post("/", controller.postUser);

Router.put("/:userId", controller.putUser);

Router.delete("/:userId", controller.deleteUser);

Router.post("/:userId", controller.addFavoriteSong);

Router.delete("/:userId/:songId", controller.removeFavoriteSong);

module.exports = {
  Router,
};
