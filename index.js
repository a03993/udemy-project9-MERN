// Import the express library
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const { auth } = require("./routes/index");

// connect to the database
mongoose
  .connect("mongodb://localhost:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", auth);

// routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
