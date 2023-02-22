import { VStack,  
    Box,  
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
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

import axios from 'axios';
const baseUrl = '/api/items';
const baseUrlUsers = '/api/users';


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

    const [userList, setUserList] = useState([]);

    useEffect(() => {
    const listUsers = async () => {
        await axios.get(baseUrlUsers, config())
        .then(response => setUserList(response.data));
      }
      listUsers();
    }, []);

    userList.forEach(element => {
    })

    const findInfo = (id) =>{
        let info = '';
        userList.forEach(element => {
          if (id === element.id ) {
            info = element.firstName+" "+element.surname;
          } else {
          }
        })
        return info;
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

    const handleOpen = (event) => {
        onOpen();
        deleteItem(event.target.id)
        listItems();
    }

    const handleDelete = (event) => {
        console.log(event.target.id)
        onClose();
    }

    const tableRow = itemList.map((item, pos) => {
        let price = item.initialPrice;
        let bid = item.highestBid;
        let rate = props.rate;
        let priceInCurr = (price * rate).toFixed(2);
        let bidInCurr = (bid * rate).toFixed(2);
        let sellerName = item.seller.firstName + " "+ item.seller.surname;
        let bidderName = findInfo(item.highestBidder);
        return (
            <Tr key={pos}>
                <Td>{item.status}</Td>
                <Td>{item.name}</Td>
                <Td>{item.model}</Td>
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
                                <Th>Status</Th>
                                <Th>Item name</Th>
                                <Th>Item model</Th>
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
