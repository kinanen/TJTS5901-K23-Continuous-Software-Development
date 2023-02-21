
import {
    HStack,
    FormControl,
    FormLabel,
    Select,
    Flex,
    Center,
} from '@chakra-ui/react';
import {React, useState, useEffect} from 'react';

import axios from 'axios';

 

export default function Currency(props) {

    const [currencyList, setCurrencyList] = useState([]);

    const [currency, setCurrency] = useState('EUR');
    const currencyUpdate = (event) => setCurrency(event.target.value);
    const [rate, setRate] = useState(1);

    useEffect(() => {
        const findExchangeRates = async () => {
            await axios.get("https://sdw-wsrest.ecb.europa.eu/service/data/EXR/D..EUR.SP00.A?startPeriod=2023-01-01&lastNObservations=1&format=jsondata")
            .then(response => setCurrencyList(response.data));
        }
        findExchangeRates();
    },[]);

    let currLegend = [
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
    {index:29, key:"ZAR", name:"South African rand"}];

    let currLegendMap = new Map();
    let index = 0;
    for (let arvo of currLegend) {
        currLegendMap.set(index, arvo.key);
        index += 1;
    }
    //console.log(currLegendMap);

    let ratesMap = new Map();
    if (currencyList.dataSets == null) {
    } else {
        let series = currencyList.dataSets[0].series;
        const entries = Object.entries(series);
        
        ratesMap.set(0, 1); // set EUR as first as it does not come from ECB
        let indexRate = 1;
        for (let arvo of entries) {
            ratesMap.set(indexRate, arvo[1].observations[0][0]);
            indexRate += 1;
        }
        //console.log(ratesMap);
    }

    const findRate = (currency) => {
        let index = '';
        for (let [key, value] of currLegendMap.entries()) {
            if (value === currency) {
              index = key;
            }
        }
        //console.log("Valuutan " +currency +" Indeksi on "+index);
        let rate = '';
        for (let [key, value] of ratesMap.entries()) {
            if (key === index) {
              rate = value;
            }
        }
        return rate;
    }

    //console.log("nyt haetaan indeksiä");
    let rateToUse = findRate(currency);
    //console.log(rateToUse);
    props.saveRate(rateToUse);
    props.saveCurrency(currency);

return (

    // <Flex alignItems={'center'} textAlign={'right'} justifyContent={'right'} position={'sticky'}top={'60px'}left={0} zIndex={55} bg={'#F0884F'}>
        <form w={'100px'} /*onSubmit={handleSubmit}*/ display={'inline-flex'} mr={10}> 
            <FormControl>
                <Center>
                <FormLabel fontSize={'xs'} m={0} mr={1} p={0}>Currency</FormLabel>
                <Select size="xs" onChange={currencyUpdate}>
                    {currLegend.map((item, pos) => (
                    <option key={pos} value={item.key}>{item.key}</option>
                    ))}
                </Select>
                </Center>
            </FormControl>
        </form>
    // </Flex>
    )
};
