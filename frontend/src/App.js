
import {React, useState } from "react";
import { Route, Routes } from "react-router-dom";
import NavbarChakra from "./components/NavbarChakra";
import FooterChakra from "./components/FooterChakra";
import Publish from "./components/Publish";
import Home from "./components/HomeChakra";
import SignInChakra from "./components/SignInChakra";
import SignUpChakra from "./components/SignUpChakra";
import CardsChakra from "./components/CardsChakra";
import DetailsChakra from "./components/DetailsChakra";
import TandCChakra from "./components/TandCChakra";
import SellerChakra from "./components/SellerChakra";
import BuyerChakra from "./components/BuyerChakra";
import Profile from "./components/Profile";
import OperatorChakra from "./components/OperatorChakra";
import Email from "./components/Email";
import AuctionsList from "./components/AuctionsList";
import './App.css';


export default function App() {

  return (
    <div>
      <NavbarChakra />
      <div>
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
        <Route path="/seller" element={<SellerChakra />}>
        </Route>
        <Route path="/buyer" element={<BuyerChakra />}>
        </Route>
        <Route path="/profile" element={<Profile />}>
        </Route>
        <Route path="/operator" element={<OperatorChakra />}>
        </Route>
        <Route path="/email" element={<Email />}>
        </Route>
        <Route path="/auctions" element={<AuctionsList />}>
        </Route>
      </Routes>
      </div>
      <FooterChakra />
    </div>
  );
}


