const express = require("express");
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const bp = require("./routes/api/bridgePay");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Conect to MongoDB
// mongoose
//   .connect(db)
//   .then(() => console.log("MongoDB Conected"))
//   .catch(err => console.log(err));


// Use Routes
app.use("/api/bp", bp);;

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server runing on port ${port}`));
