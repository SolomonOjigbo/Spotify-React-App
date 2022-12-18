const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	spotifyID: { type: String, unique: true, required: true },
	displayName: { type: String, required: true },
	email: { type: String, required: true },
	profileURL: { type: String, required: true },
	favourites: { type: [String], default: [] },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
