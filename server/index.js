require("dotenv").config();

const express = require("express");

const cors = require("cors");

const app = express();

const connection = require("./db");

connection();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;

app.listen(port, console.log(`Listening on port ${port}...`));

// const connectionParams
