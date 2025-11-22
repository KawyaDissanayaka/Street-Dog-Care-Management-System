import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import DogsList from "./pages/DogsList";
import AddDog from "./pages/AddDog";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "10px", background: "#eee" }}>
        <Link to="/" style={{ marginRight: "15px" }}>Home</Link>
        <Link to="/dogs" style={{ marginRight: "15px" }}>Dogs List</Link>
        <Link to="/add-dog">Add Dog</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dogs" element={<DogsList />} />
        <Route path="/add-dog" element={<AddDog />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
