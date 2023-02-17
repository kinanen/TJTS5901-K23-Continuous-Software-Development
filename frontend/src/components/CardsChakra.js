import { VStack } from '@chakra-ui/react';
import {React, useState, useEffect} from 'react';
import CardChakra from './CardChakra';
import img3 from '../images/hammer.jpg'
import { useTranslation } from 'react-i18next';
import axios from 'axios';
const baseUrl = '/api/items';


// these should be read from the database, as json?
// then map all instances with below details, which will bse sent as props to collection page

function CardsChakra() {
    const {t} = useTranslation();
    const [itemList, setItemList] = useState([]);

    useEffect(() => {
    const listItems = async () => {
        await axios.get(baseUrl)
        .then(response => setItemList(response.data));
      }
      listItems();
    }, []);

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

    return (
        <VStack>
            {itemList.map((item, pos) => (
                <CardChakra 
                key={pos}
                src={img3}
                name={item.name}
                model={item.model}
                description={item.description}
                initialPrice={item.initialPrice}
                highestBid={item.highestBid}
                currency={item.currency}
                time={calculateHours(item.endDate)}
                status={findStatus(item.endDate)}
                id={item.id}
                label="Details"
                path="/details"
            />
                ))}
        </VStack>
    );
}

export default CardsChakra;
