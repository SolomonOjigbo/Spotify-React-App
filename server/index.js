require("dotenv").config();

const express = require("express");

const session = require("express-session");
const passport = require("passport");

const authRoute = require("./routes/auth");

const cors = require("cors");

const app = express();

const connection = require("./db");

connection();

app.use(cors());
app.use(express.json());

app.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24,
		},
	})
);

app.use("/api/auth", authRoute);
app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 8080;

app.listen(port, console.log(`Listening on port ${port}...`));

// const connectionParams
