import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./components/HomePage";
import ArtistSearch from "./components/ArtistSearch/ArtistSearch";
import SpecificArtistPage from "./components/SpecificArtistPage/SpecificArtistPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
// import NotFoundRoute from "./components/NotFound/NotFoundRoute";


const App = () => {
  return (
    <>
    <AuthProvider>
      <Header />
      <Router>
          <Routes>
            {/* Every page we create needs to have a route so we can navigate to it */}
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<ArtistSearch />} />
            {/* `/artist/${artist?.id}` */}
            <Route path="/artist/:artistName/:id" element={<SpecificArtistPage />} />
            {/* <Route path="*" element={<NotFoundRoute />} /> */}
          </Routes>
      </Router>
    </AuthProvider>
    </>
  );
};

export default App;
