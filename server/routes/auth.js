const express = require("express");
const SpotifyStrategy = require("passport-spotify").Strategy;
const passport = require("passport");
const session = require("express-session");
const User = require("../models/user");
const router = express.Router();

var callbackURL = process.env.BASE_URL + "/api/auth/callback";

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	});
});

passport.use(
	new SpotifyStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: callbackURL,
			proxy: true,
		},
		function (accessToken, refreshToken, expires_in, profile, done) {
			const id = profile.id;
			const displayName = profile.displayName;
			const email = profile._json.email;
			const profileURL = profile.profileUrl;

			console.log(id);
			console.log("accessToken:", accessToken);
			console.log("refreshToken:", refreshToken);

			process.nextTick(function () {
				User.findOne({
					spotifyID: profile.id,
				}).then((user) => {
					if (!user) {
						const spotifyUser = new User({
							spotifyID: id,
							displayName: displayName,
							email: email,
							profileURL: profileURL,
							accessToken: accessToken,
							refreshToken: refreshToken,
						});
						spotifyUser.save();
						return done(null, spotifyUser);
						// } else {
						// 	return done(null, user);
					}
				});
			});
		}
	)
);

router.get(
	"/login",
	passport.authenticate("spotify", {
		scope: ["user-read-email", "user-read-private"],
		showDialog: true,
	})
	// function (req, res) {
	// 	res.status(200).send({
	// 		message: "User authenticated successfully",
	// 	});
	// 	res.redirect("http://localhost:3000/");
	// }
);

router.get(
	"/callback",
	passport.authenticate("spotify", {
		failureRedirect: "http://localhost:3000/login",
	}),
	function (req, res) {
		res.redirect("http://localhost:3000/");
	}
);

router.get("/logout", function (req, res) {
	req.logout();
	res.redirect("http://localhost:3000/login");
});

module.exports = router;
