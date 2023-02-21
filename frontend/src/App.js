
import {React, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Flex } from '@chakra-ui/react';
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
import Currency from "./components/Currency";
import Locals from "./components/Locals";
import './App.css';


export default function App() {

  const [rate, setRate] = useState(1);
  const [currency, setCurrency] = useState('EUR');

  const SaveRate = (rateData) => {
    useEffect(() => {
     setRate(rateData);
    });
  } 

  const SaveCurrency  = (currData) => {
    useEffect(() => {
      setCurrency(currData);
    });
  }


console.log("From App: Currency is "+currency+" and rate is "+rate);

  return (
    <div>
      <NavbarChakra />
      <Flex alignItems={'center'} textAlign={'right'} justifyContent={'right'} position={'sticky'}top={'40px'}left={0} zIndex={55} bg={'#F0884F'} p={0.5}> 
        <Locals />
        <Currency saveRate={SaveRate} saveCurrency={SaveCurrency} />
      </Flex>
      <div>
      <Routes>
        <Route exact path="/" element={<Home />}>
        </Route>
        <Route path="/view" element={<CardsChakra curr={currency} rate={rate}/>}>
        </Route>
        <Route path="/details" element={<DetailsChakra curr={currency} rate={rate} />}>
        </Route>
        <Route path="/publish" element={<Publish curr={currency} rate={rate} />}>
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
        <Route path="/auctions" element={<AuctionsList curr={currency} rate={rate} />}>
        </Route>
        <Route path="/currency" element={<Currency />}>
        </Route>
      </Routes>
      </div>
      <FooterChakra />
    </div>
  );
}


