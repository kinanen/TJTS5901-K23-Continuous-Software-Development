import { VStack, Select, FormControl, FormLabel, Stack, Button, HStack } from '@chakra-ui/react';
import {React, useState, useEffect, useRef} from 'react';
import CardChakra from './CardChakra';
import Currency from './Currency';
import img3 from '../images/hammer.jpg'
//import emailjs from '@emailjs/browser';
import { useTranslation } from 'react-i18next';

import axios from 'axios';
const baseUrl = '/api/items';

// these should be read from the database, as json?
// then map all instances with below details, which will bse sent as props to collection page

function CardsChakra(props) {
    const {t} = useTranslation();
    const [itemList, setItemList] = useState([]);
    //const [currencyList, setCurrencyList] = useState([]);

    /* const [currency, setCurrency] = useState('EUR');
    const currencyUpdate = (event) => setCurrency(event.target.value);
    const [rate, setRate] = useState(1); */
    

    useEffect(() => {
        const listItems = async () => {
            await axios.get(`${baseUrl}/active`)
            .then(response => setItemList(response.data));
        }
        listItems();
    }, []);

    //console.log("From CardsChakra: Currency is "+props.curr+" and rate is "+props.rate);

    /* const findExchangeRates = async () => {
        console.log("nyt kokeillaan kursseja");
        const response = await axios.get("https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?startPeriod=2009-05-01&endPeriod=2009-05-31");
        console.log(response.data);
        return response.data;
    }  */

    /* useEffect(() => {
        const findExchangeRates = async () => {
            await axios.get("https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D..EUR.SP00.A?startPeriod=2023-01-01&lastNObservations=1&format=jsondata")
            .then(response => setCurrencyList(response.data));
        }
        findExchangeRates();
    },[]); */

    /* let currLegend = [
    {index:100, key:"EUR", name:"Euro"},{index:0, key:"AUD", name:"Australian dollar"},
    {index:1, key:"BGN", name:"Bulgarian lev"},{index:2, key:"BRL", name:"Brazilian real"},
    {index:3, key:"CAD", name:"Canadian dollar"},{index:4, key:"CHF", name:"Swiss franc"},
    {index:5, key:"CNY", name:"Chinese yuan renminbi"},{index:6, key:"CZK", name:"Czech koruna"},
    {index:7, key:"DKK", name:"Danish krone"},{index:8, key:"GBP", name:"Pound sterling"},
    {index:9, key:"HKD", name:"Hong Kong dollar"},{index:10, key:"HUF", name:"Hungarian forint"},
    {index:11, key:"IDR", name:"Indonesian rupiah"},{index:12, key:"ILS", name:"Israeli shekel"},
    {index:13, key:"INR", name:"Indian rupee"},{index:14, key:"ISK", name:"Icelandic krona"},
    {index:15, key:"JPY", name:"Japanese yen"},{index:16, key:"KRW", name:"South Korean won"},
    {index:17, key:"MXN", name:"Mexican peso"},{index:18, key:"MYR", name:"Malaysian ringgit"},
    {index:19, key:"NOK", name:"Norwegian krone"},{index:20, key:"NZD", name:"New Zealand dollar"},
    {index:21, key:"PHP", name:"Philippine peso"},{index:22, key:"PLN", name:"Polish zloty"},
    {index:23, key:"RON", name:"Romanian leu"},{index:24, key:"SEK", name:"Swedish krona"},
    {index:25, key:"SGD", name:"Singapore dollar"},{index:26, key:"THB", name:"Thai baht"},
    {index:27, key:"TRY", name:"Turkish lira"},{index:28, key:"USD", name:"US dollar"},
    {index:29, key:"ZAR", name:"South African rand"}]; */

    /* let currLegendMap = new Map();
    let index = 0;
    for (let arvo of currLegend) {
        currLegendMap.set(index, arvo.key);
        index += 1;
    }
    console.log(currLegendMap);

    let ratesMap = new Map();
    if (currencyList.dataSets == null) {
    } else {
        let series = currencyList.dataSets[0].series;
        const entries = Object.entries(series);
        //console.log(entries);
        
        ratesMap.set(0, 1); // set EUR as first as it does not come from ECB
        let indexRate = 1;
        for (let arvo of entries) {
            ratesMap.set(indexRate, arvo[1].observations[0][0]);
            indexRate += 1;
        }
        console.log(ratesMap);
    } */

/*     const findRate = (currency) => {
        let index = '';
        for (let [key, value] of currLegendMap.entries()) {
            if (value === currency) {
              index = key;
            }
        }
        console.log("Valuutan " +currency +" Indeksi on "+index);
        let rate = '';
        for (let [key, value] of ratesMap.entries()) {
            if (key === index) {
              rate = value;
            }
        }
        return rate;
    } */ 

    /* console.log("nyt haetaan indeksiä");
    let rateToUse = findRate('ILS');
    //console.log(rateToUse); */
    

    function msToTime(duration) {
        let milliseconds = Math.floor((duration % 1000) / 100);
        let seconds = Math.floor((duration / 1000) % 60);
        let minutes = Math.floor((duration / (1000 * 60)) % 60);
        let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
      
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
      
        if (milliseconds < 0 ) {
            return "00:00:00";
        } else { 
            return hours + ":" + minutes + ":" + seconds;
        }  
    }

    const calculateHours = (end) => {
        let endTime = new Date(end);
        let timeLeftMS = endTime - Date.now();
        let timeLeft = msToTime(timeLeftMS);
        //console.log("aikaa jäljellä "+timeLeft);
        if (timeLeft < 0) {
            return 0;
        } else {
            return timeLeft;
        }
    }

    // set the item's on database status to passed
    const setStatus = async (item) => {
        if (item.highestBidder === null) {
            await axios.put(`${baseUrl}/status/${item.id}`, { status: "expired" })
            return
        }
        await axios.put(`${baseUrl}/status/${item.id}`, { status: "fulfilled" })
    }

    const findStatus = (item) => {
        //console.log(item);
        let status = '';
        let endTime = new Date(item.endDate);
        let timeLeftMS = endTime - Date.now();
        //console.log(item.startDate);
        //console.log(item.endDate);
        //console.log(endTime);
        //console.log(Date.now());
        //console.log("aikaa jäljellä "+timeLeftMS);
        if (timeLeftMS > 0) {
            status = t('active')
        } else if (timeLeftMS < 0) {
            status = t('passed')
            setStatus(item)
        } else {
            status = t('prepairing')
        }
        return status
    }
    console.log(itemList);

    

    const cards = itemList.map((item, pos) => {
        let price = item.initialPrice;
        let bid = item.highestBid;
        //let rate = findRate(currency);
        let rate = props.rate;
        let priceInCurr = (price * rate).toFixed(2);
        let bidInCurr = (bid * rate).toFixed(2);
        return(
        <CardChakra 
            key={pos}
            src={img3}
            name={item.name}
            model={item.model}
            description={item.description}
            initialPrice={priceInCurr} // tähän valitulla currencyllä lask hinta
            highestBid={bidInCurr} // tähän valitulla currencyllä lask hinta
            currency={props.curr} // tähän valittu currency
            time={calculateHours(item.endDate)}
            status={findStatus(item)}
            id={item.id}
            rate={props.rate}
            label="Details"
            path="/details"
        />
        )
    })

    return (
        <>
        {/* <HStack alignItems={'right'} textAlign={'right'} justifyContent={'right'} mr={10}>
            <form w={'100px'} display={'inline-flex'}> 
                <FormControl>
                    <FormLabel fontSize={'xs'} textAlign={'right'}>Currency</FormLabel>
                    <Select size="xs" onChange={currencyUpdate}>
                        {currLegend.map((item, pos) => (
                        <option key={pos} value={item.key}>{item.key}</option>
                        ))}
                    </Select>
                </FormControl>
            </form>
        </HStack> */}
        <VStack>
            {cards}
            {/* {itemList.map((item, pos) => (
                <CardChakra 
                key={pos}
                src={img3}
                name={item.name}
                model={item.model}
                description={item.description}
                initialPrice={item.initialPrice}{rate} // tähän valitulla currencyllä lask hinta
                highestBid={item.highestBid} // tähän valitulla currencyllä lask hinta
                currency={currency} // tähän valittu currency
                time={calculateHours(item.endDate)}
                status={findStatus(item)}
                id={item.id}
                label="Details"
                path="/details"
            />
                ))} */}
        </VStack>
        </>
    );
}

export default CardsChakra;
