const mongoose = require("mongoose");

module.exports = async () => {
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		await mongoose.connect(process.env.DB, connectionParams);
		console.log("connected to database sucessfully");
	} catch (error) {
		console.log("could not connect to database");
	}
};
