require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var morgan = require("morgan");

// Connected to database mongoose
const { mongoose } = require("./db/connect");
mongoose.Promise = global.Promise;

// Create app
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("common"));

// Middlewares
const songsRoutes = require("./src/routes/songs").Router;
const usersRoutes = require("./src/routes/users").Router;

// Require routes
app.use("/songs", songsRoutes);
app.use("/users", usersRoutes);

app.set("port", process.env.PORT || 4000);
const PORT = app.get("port");

// Listen to PORT
app.listen(PORT, () => {
  console.log(`Listening to the PORT: ${PORT}!`);
});
