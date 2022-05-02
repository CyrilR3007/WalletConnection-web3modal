import "./Style/App.css";

import React from "react";
import Cards from "./Cards";
import Navigation from "./NavBar";

function App() {
	return (
		<div className="App">
			<Navigation />
			<Cards />
		</div>
	);
}

export default App;
