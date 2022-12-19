import React from "react";
import "../App.css";

const AUTH_URL = "http://localhost:5000/api/auth/login";

function Login() {
	return (
		<div className="login">
			<img src="http://localhost:3000/spotify-logo.jpg" alt="spotify-logo" />
			<a href={AUTH_URL}>LOGIN TO SPOTIFY</a>
		</div>
	);
}

export default Login;
