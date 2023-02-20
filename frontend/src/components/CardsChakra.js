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

    const [itemList, setItemList] = useState([]);

    const [currency, setCurrency] = useState('eur');
    const currencyUpdate = (event) => setCurrency(event.target.value);

    useEffect(() => {
    const listItems = async () => {
        await axios.get(baseUrl)
        .then(response => setItemList(response.data));
      }
      listItems();
    }, []);

    /* const findExchangeRates = () => {
        return axios.get("https://sdw-wsrest.ecb.europa.eu/help/")
              .then((response) => console.log(response.data));
    } 

    findExchangeRates();*/

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
            status = 'ACTIVE'
        } else if (timeLeftMS < 0) {
            status = 'PASSED'
        } else {
            status = 'PREPAIRING'
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
