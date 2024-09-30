const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 8000;
//const MONGO_URL = process.env.MONGO_URL;
const { adminRouter } = require("./Routes/admin");
const { userRouter } = require("./Routes/user");
const { courseRouter } = require("./Routes/course");

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/login.html");
});
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/course", courseRouter);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: "true",
    useUnifiedTopology: "true",
  })
  .then(() => {
    console.log("database is connected successfully");
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
