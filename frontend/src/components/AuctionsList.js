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
    Checkbox,
    Input,
    Flex,
    Button,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogHeader,
    AlertDialogFooter,
    useDisclosure,
 } from '@chakra-ui/react';
import {React, useState, useEffect, useRef} from 'react';
//import CardChakra from './CardChakra';
//import img3 from '../images/hammer.jpg'
//import emailjs from '@emailjs/browser';
//import { CheckCircleIcon, InfoIcon, WarningIcon} from '@chakra-ui/icons'

import axios from 'axios';
const baseUrl = '/api/items';


// these should be read from the database, as json?
// then map all instances with below details, which will bse sent as props to collection page

function AuctionsList(props) {

    const [itemList, setItemList] = useState([]);


    const listItems = async () => {
        await axios.get(baseUrl)
        .then(response => setItemList(response.data));
    }

    useEffect(() => {
        listItems();
    }, []);

   
    //console.log("From Auctions list " + props.curr +" and "+ props.rate);

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

    //console.log(itemList);


    const deleteItem = async (id) => {
        try {
        const response = await axios.delete(baseUrl+ '/' + id)
        console.log(response.data)
        return response.data;  
        } catch (error) {
            console.log(error.response.data.error)
        }
        listItems();
    }

    const handleChange = (event) => {
        console.log("item to delete is " +event.target.value);
        deleteItem(event.target.value)
        listItems();
    }

    /* const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef(); */

    const tableRow = itemList.map((item, pos) => {
        let price = item.initialPrice;
        let bid = item.highestBid;
        //let rate = findRate(currency);
        let rate = props.rate;
        let priceInCurr = (price * rate).toFixed(2);
        let bidInCurr = (bid * rate).toFixed(2);
        return (
            <Tr key={pos}>
                {/* <Td><Icon as={findIcon(item.endDate)}></Icon></Td> */}
                <Td>{findStatus(item.endDate)}</Td>
                <Td>{item.name}</Td>
                <Td>{item.model}</Td>
                {/* <Td>{item.description}</Td> */}
                <Td>{props.curr}</Td>
                <Td isNumeric>{priceInCurr}</Td>
                <Td isNumeric>{bidInCurr}</Td>
                <Td isNumeric>{calculateHours(item.endDate)}</Td>
                <Td><Checkbox key={item.id}  value={item.id} onChange={handleChange}></Checkbox></Td>
                </Tr>
            )
    });

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
                                <Th>Delete</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {tableRow}
                        {/* {itemList.map((item, pos) => (
                            <Tr key={pos}>
                                <Td>{findStatus(item.endDate)}</Td>
                                <Td>{item.name}</Td>
                                <Td>{item.model}</Td>
                                <Td>{item.currency}</Td>
                                <Td isNumeric>{item.initialPrice}</Td>
                                <Td isNumeric>{item.highestBid}</Td>
                                <Td isNumeric>{calculateHours(item.endDate)}</Td>
                            </Tr>
                            ))} */}
                        </Tbody>
                    </Table>
                </TableContainer>
                {/* <Flex alignItems={'right'} justify={'flex-end'} mt={5} mb={5}>
                <Button onClick={onOpen} size="sm"
                  bg={"#774BCD"}
                  color={"white"}
                  _hover={{
                    bg: "#C7A1FE",
                  }}>
                    Delete Item
                </Button>
                </Flex>
                <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Delete Customer
                    </AlertDialogHeader>

                    <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme='red' onClick={onClose} ml={3}>
                        Delete
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
                </AlertDialog> */}
                </Box>
        </VStack>
    );
}

export default AuctionsList;
