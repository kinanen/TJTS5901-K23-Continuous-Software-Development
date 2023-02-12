
import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import NavbarChakra from "./components/NavbarChakra";
import FooterChakra from "./components/FooterChakra";
import Publish from "./components/Publish";
import Home from "./components/HomeChakra";
import SignInChakra from "./components/SignInChakra";
import SignUpChakra from "./components/SignUpChakra";
import CardsChakra from "./components/CardsChakra";
import DetailsChakra from "./components/DetailsChakra";
import TandCChakra from "./components/TandCChakra";
import { Stack } from "@chakra-ui/react";
import './App.css';


export default function App() {
  return (
    <div>
      <NavbarChakra />
      <Routes>
        <Route exact path="/" element={<Home />}>
        </Route>
        <Route path="/view" element={<CardsChakra />}>
        </Route>
        <Route path="/details" element={<DetailsChakra />}>
        </Route>
        <Route path="/publish" element={<Publish />}>
        </Route>
        <Route path="/signin" element={<SignInChakra />}>
        </Route>
        <Route path="/signup" element={<SignUpChakra />}>
        </Route>
        <Route path="/tandc" element={<TandCChakra />}>
        </Route>
      </Routes>
      <FooterChakra />
    </div>
  );
}


