const mongoose = require("mongoose");

(async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://user-password:${process.env.DB_PASS}@matea-test-cluster.yxkre.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
    );
    console.log("DB Connection successful.");
  } catch (err) {
    console.log("Connection Error: ", err);
  }
})();

module.exports = {
  mongoose,
};
