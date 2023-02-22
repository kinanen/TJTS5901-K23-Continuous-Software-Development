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
const baseUrlUsers = '/api/users';


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

    let token = null
  const STORAGE_KEY = 'loggedAuctionAppUser'
  
  const getUser = () => {
    const loggedUserJSON = window.localStorage.getItem(STORAGE_KEY)
    //console.log(loggedUserJSON);
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      token = user.token
      return user;
    }
    return null;
  }

  const getToken = () => token

  const config = () => {
    return {
      headers: {
        Authorization: `bearer ${getToken()}`
      },
    }
  }

  const [userData, setUserData] = useState([]);

  let user = getUser();

    useEffect(() => {
      const showUserDetails = async () => {
      await axios.get(baseUrlUsers+ '/' + user.id, config())
        .then(response => setUserData(response.data));
      }
      showUserDetails();
    },[user.id]);

  

    // get user list to get other details than id
    const [userList, setUserList] = useState([]);

    useEffect(() => {
    const listUsers = async () => {
        await axios.get(baseUrlUsers, config())
        .then(response => setUserList(response.data));
      }
      listUsers();
    }, []);

    //console.log(userList);
    userList.forEach(element => {
      //console.log(element);
    })

    const findInfo = (id) =>{
        let info = '';
        userList.forEach(element => {
          //console.log(id);
          //console.log(element.id);
          if (id === element.id ) {
            //console.log("bingo");
            info = element.firstName+" "+element.surname;
          } else {
            //console.log("ei ollut" + id + " ja "+element.id);
          }
        })
        return info;
      }

   
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

    // set the item's on database status to passed
    const setStatus = async (item) => {
        if (item.highestBidder === null) {
            await axios.put(`${baseUrl}/status/${item.id}`, { status: "expired" })
            return
        }
        await axios.put(`${baseUrl}/status/${item.id}`, { status: "fulfilled" })
    }

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    const findStatus = (item) => {
        let status = '';
        let endTime = new Date(item.endDate);
        let timeLeftMS = endTime - Date.now();
        if (timeLeftMS > 0) {
            status = 'ACTIVE'
        } else if (timeLeftMS < 0) {
            setStatus(item)
            if(item.highestBidder === null) {
                return status = 'EXPIRED'
            }
            status = 'FULFILLED'
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

    /* const handleChange = (event) => {
        console.log("item to delete is " +event.target.value);
        deleteItem(event.target.value)
        listItems();
    } */

    const handleOpen = (event) => {
        onOpen();
        deleteItem(event.target.id)
        //console.log("item to delete is " +event.target.value);
        console.log(event.target.id);
        listItems();
    }

    const handleDelete = (event) => {
        //console.log(event.target.id)
        //deleteItem(event.target.value)
        onClose();
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
        let sellerName = item.seller.firstName + " "+ item.seller.surname;
        let bidderName = findInfo(item.highestBidder);
        //console.log(item);
        return (
            <Tr key={pos}>
                {/* <Td><Icon as={findIcon(item.endDate)}></Icon></Td> */}
                <Td>{findStatus(item)}</Td>
                <Td>{item.name}</Td>
                <Td>{item.model}</Td>
                {/* <Td>{item.description}</Td> */}
                <Td>{props.curr}</Td>
                <Td isNumeric>{priceInCurr}</Td>
                <Td isNumeric>{bidInCurr}</Td>
                <Td isNumeric>{calculateHours(item.endDate)}</Td>
                <Td>{sellerName}</Td>
                <Td>{bidderName}</Td>
                <Td><Button onClick={handleOpen} size="sm"
                  id={item.id}
                  bg={"#774BCD"}
                  color={"white"}
                  _hover={{
                    bg: "#C7A1FE",
                  }}>
                    Delete
                </Button></Td>
                {/* <Td><Checkbox key={item.id}  value={item.id} onChange={handleChange}></Checkbox></Td> */}
            </Tr>
        )
    });

    return (
        <VStack mt={20}>
            <Box w={'100%'} p={2} alignItems={'left'}> 
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
                                <Th>Seller</Th>
                                <Th>Bidder</Th>
                                <Th>Delete</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {tableRow}
                        </Tbody>
                    </Table>
                </TableContainer>
                {/* <Flex alignItems={'right'} justify={'flex-end'} mt={5} mb={5}>
                <Button onClick={handleOpen} size="sm"
                  bg={"#774BCD"}
                  color={"white"}
                  _hover={{
                    bg: "#C7A1FE",
                  }}>
                    Delete Auction
                </Button>
                </Flex> */}
                <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Delete Auction
                    </AlertDialogHeader>

                    <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme='red' onClick={handleDelete} ml={3}>
                        Delete
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
                </AlertDialog>
                </Box>
        </VStack>
    );
}

export default AuctionsList;
