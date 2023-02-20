import { VStack, 
    List, 
    ListIcon, 
    ListItem, 
    Box, 
    GridItem, 
    Grid,Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Icon,
 } from '@chakra-ui/react';
import {React, useState, useEffect, useRef} from 'react';
import CardChakra from './CardChakra';
import img3 from '../images/hammer.jpg'
import emailjs from '@emailjs/browser';
import { CheckCircleIcon, InfoIcon, WarningIcon} from '@chakra-ui/icons'

import axios from 'axios';
const baseUrl = '/api/items';

const calculateTimeLeft = () => {
    let year = new Date().getFullYear();
    
    //let difference = +new Date(`10/01/${year}`) - +new Date();
    let difference = +new Date(`10/01/${year}`) - +new Date();
  
    let timeLeft = {};
  
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
  
    console.log(timeLeft);
    return timeLeft;
  }

// these should be read from the database, as json?
// then map all instances with below details, which will bse sent as props to collection page

function AuctionsList() {

    const [itemList, setItemList] = useState([]);
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());


    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
            return;
    }

    timerComponents.push(
    <span>
        {timeLeft[interval]} {interval}{" "}
    </span>
    );
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
  
        return () => clearTimeout(timer);
    });


  

    useEffect(() => {
        const listItems = async () => {
            await axios.get(baseUrl)
            .then(response => setItemList(response.data));
        }
        listItems();
        console.log("luettiin tuotteet")
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
            status = 'ACTIVE'
        } else if (timeLeftMS < 0) {
            status = 'PASSED'
        } else {
            status = 'PREPAIRING'
        }
        return status
    }

    const findIcon = (end) => {
        let icon = '';
        let endTime = new Date(end);
        let timeLeftMS = endTime - Date.now();
        if (timeLeftMS > 0) {
            icon = {CheckCircleIcon}
        } else if (timeLeftMS < 0) {
            icon = {WarningIcon}
        } else {
            icon = {InfoIcon}
        }
        return icon
    }

    console.log(itemList);

    const form = useRef();
    const sendEmail = (e) => {
        e.preventDefault();
    
        emailjs.sendForm('service_mbzsi4j', 'contact_form', form.current, 'vpv8xFI6aDigQvtdr')
          .then((result) => {
              console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
      };



    return (
        <VStack mt={20}>
            <Box w={'80%'} alignItems={'left'}> 
                <TableContainer>
                    <Table variant='simple' size={'sm'}>
                        <Thead>
                            <Tr>
                                {/* <Th>s</Th> */}
                                <Th>Status</Th>
                                <Th>Item name</Th>
                                <Th>Item model</Th>
                                {/* <Th>Description</Th> */}
                                <Th>Currency</Th>
                                <Th isNumeric>Initial Price</Th>
                                <Th isNumeric>Highest Bid</Th>
                                <Th isNumeric>Time remaining</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                        {itemList.map((item, pos) => (
                            <Tr key={pos}>
                                {/* <Td><Icon as={findIcon(item.endDate)}></Icon></Td> */}
                                <Td>{findStatus(item.endDate)}</Td>
                                <Td>{item.name}</Td>
                                <Td>{item.model}</Td>
                                {/* <Td>{item.description}</Td> */}
                                <Td>{item.currency}</Td>
                                <Td isNumeric>{item.initialPrice}</Td>
                                <Td isNumeric>{item.highestBid}</Td>
                                <Td isNumeric>{calculateHours(item.endDate)}</Td>
                            </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                </Box>
                <div>
                    <h1>Hacktoberfest Countdown</h1>
                    <h2>With React Hooks!</h2>
                    {timerComponents.length ? timerComponents : <span>Time's up!</span>}
                </div>
        </VStack>
    );
}

export default AuctionsList;
