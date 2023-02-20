import { VStack, Select, FormControl, FormLabel, Stack, Button, HStack } from '@chakra-ui/react';
import {React, useState, useEffect, useRef} from 'react';
import CardChakra from './CardChakra';
import img3 from '../images/hammer.jpg'
//import emailjs from '@emailjs/browser';
import { useTranslation } from 'react-i18next';


import axios from 'axios';
const baseUrl = '/api/items';



// these should be read from the database, as json?
// then map all instances with below details, which will bse sent as props to collection page

function CardsChakra() {
    const {t} = useTranslation();
    const [itemList, setItemList] = useState([]);
    const [currencyList, setCurrencyList] = useState([]);

    const [currency, setCurrency] = useState('eur');
    const currencyUpdate = (event) => setCurrency(event.target.value);

    useEffect(() => {
        const listItems = async () => {
            await axios.get(baseUrl)
            .then(response => setItemList(response.data));
        }
        listItems();
    }, []);

    /* const findExchangeRates = async () => {
        console.log("nyt kokeillaan kursseja");
        const response = await axios.get("https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?startPeriod=2009-05-01&endPeriod=2009-05-31");
        console.log(response.data);
        return response.data;
    }  */

    useEffect(() => {
        const findExchangeRates = async () => {
            await axios.get("https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D..EUR.SP00.A?startPeriod=2023-01-01&lastNObservations=1&format=jsondata")
            .then(response => setCurrencyList(response.data));
        }
        findExchangeRates();
    },[]);

    let currLegend = [{index:0, key:"AUD", name:"Australian dollar"},
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
    {index:29, key:"ZAR", name:"South African rand"}];


    console.log("tässä currency list");
    console.log(currencyList);
    if (currencyList.dataSets == null){
        console.log("nulli oli");
    } else {
        console.log(currencyList.dataSets[0].series);
        let series = currencyList.dataSets[0].series;
        console.log(series);
        const keys = Object.keys(series);
        console.log(keys);
        const entries = Object.entries(series);
        console.log(entries);
        let kurssit = [];
        for (let arvo of entries) {
            let uusiKurssi = {};
            uusiKurssi.key = arvo[0];
            uusiKurssi.rate = arvo[1].observations[0][0];
            kurssit.push(uusiKurssi);
            console.log(arvo[1].observations[0][0]);
        }
        console.log(kurssit);
    }
    

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
        if (timeLeft < 0) {
            return 0;
        } else {
            return timeLeft;
        }
    }

    const findStatus = (end) => {
        let status = '';
        let endTime = new Date(end);
        let timeLeftMS = endTime - Date.now();
        if (timeLeftMS > 0) {
            status = t('active')
        } else if (timeLeftMS < 0) {
            status = t('passed')
        } else {
            status = t('prepairing')
        }
        return status
    }
    console.log(itemList);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("currency is now "+currency);
    }

    /* const form = useRef();
    const sendEmail = (e) => {
        e.preventDefault();
    
        emailjs.sendForm('service_mbzsi4j', 'contact_form', form.current, 'vpv8xFI6aDigQvtdr')
          .then((result) => {
              console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
      }; */

    return (
        <>
        <HStack alignItems={'right'} textAlign={'right'} justifyContent={'right'} mr={10}>
            <form w={'100px'} onSubmit={handleSubmit} display={'inline-flex'}> 
                <FormControl>
                    <FormLabel fontSize={'xs'} textAlign={'right'}>Currency</FormLabel>
                    <Select size="xs" onChange={currencyUpdate}>
                        <option value="eur">EUR</option>
                        <option value="usd">USD</option>
                        <option value="gbp">GBP</option>
                    </Select>
                </FormControl>
                <Stack spacing={10} pt={2}>
                    <Button
                        type='submit'
                        loadingText="Submitting"
                        size="xs"
                        bg={'#774BCD'}
                        color={'white'}
                        _hover={{
                        bg: '#C7A1FE',
                        }}>
                        Save
                    </Button>
                </Stack>
            </form>
        </HStack>
        <VStack>
            {itemList.map((item, pos) => (
                <CardChakra 
                key={pos}
                src={img3}
                name={item.name}
                model={item.model}
                description={item.description}
                initialPrice={item.initialPrice} // tähän valitulla currencyllä lask hinta
                highestBid={item.highestBid} // tähän valitulla currencyllä lask hinta
                currency={item.currency} // tähän valittu currency
                time={calculateHours(item.endDate)}
                status={findStatus(item.endDate)}
                id={item.id}
                label="Details"
                path="/details"
            />
                ))}
        </VStack>
        </>
    );
}

export default CardsChakra;
