const express = require("express");
const SpotifyStrategy = require("passport-spotify").Strategy;
const passport = require("passport");
const User = require("../models/user");
const router = express.Router();

var callbackURL = process.env.BASE_URL + process.env.PORT + "/auth/callback";

// passport.serializeUser(function (user, done) {
// 	done(null, user);
// });

// passport.deserializeUser(function (obj, done) {
// 	done(null, obj);
// });

passport.use(
	new SpotifyStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: callbackURL,
		},
		function (accessToken, refreshToken, expires_in, profile, done) {
			const spotifyID = profile.id;
			const displayName = profile.displayName;
			const email = profile._json.email;
			const profileURL = profile.profileUrl;

			console.log(spotifyID);

			process.nextTick(function () {
				User.findOne({
					spotifyID: spotifyID,
				}).then((currentUser) => {
					if (!currentUser) {
						const user = new User({
							spotifyID: spotifyID,
							displayName: displayName,
							email: email,
							profileURL: profileURL,
							accessToken,
							refreshToken,
						});
						user.save(function (err) {
							if (err) console.log(err);
							return done(err, user);
						});
					} else {
						console.log(currentUser);
					}
				});
			});
		}
	)
);

router.get(
	"/spotify",
	passport.authenticate("spotify", {
		scope: ["user-read-email", "user-read-private"],
		showDialog: true,
	}),
	function (req, res) {
		res.status(200).send({ message: "User authenticated successfully" });
	}
);

router.get(
	"/callback",
	passport.authenticate("spotify", {
		failureRedirect: "/login",
	}),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect("/");
	}
);

// router.get("/success", passport.authenticate("spotify"), (req, res) => {
// 	res.send("success");
// });

module.exports = router;
