const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
var path = require("path");
require('dotenv').config();
const userRouter = require("./router/userRouter");
const productRouter = require("./router/productRouter");
const cookieparser = require("cookie-parser");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieparser());

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database Connected");
    app.listen(8000);
  })
  .catch((err) => {
    console.log(err);
  });

var htmlpath = path.join(__dirname, "public");
app.use(express.static(htmlpath));

app.use("/user", userRouter);
app.use("/product", productRouter);


// const userRouter = require("./routers/userRouter");
// const todoRouter = require("./routers/todoRouter");
// const { protectRoute } = require("./controller/userController");
//   const todoRouter = require("")

// app.use("/user", userRouter);
// app.use(protectRoute);
// app.use("/todo", todoRouter);
