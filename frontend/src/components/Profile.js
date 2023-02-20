import {
    Flex,
    Box,
    Image,
    Heading,
    Text,
    Button,
    Link,
    useColorModeValue,
    Grid,
    GridItem,
    UnorderedList,
    ListItem,
    HStack,
    VStack,
    Icon,
    Stack,
    AlertDialog, 
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogBody,
    AlertDialogFooter,
    useDisclosure,
    Divider,
  } from '@chakra-ui/react';
  import { Link as ReachLink } from "react-router-dom";
  import Avatar from "../images/emoticon.png"
  import { useEffect, useState, useRef } from 'react';
  import { useTranslation } from 'react-i18next';
  
  import axios from 'axios';
  import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';
  const baseUrl = '/api/users';
  const baseUrlItems = '/api/items';

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

  
  export default function ProfileCard(props) {
    const {t} = useTranslation();
    const [display, setDisplay] = useState('none');

    let user = getUser(); 
    //console.log(user);

    const showAuctions = (e) => {
      setDisplay('flex');
      //console.log(e.target.id);
    }

    //const location = useLocation();
    //console.log(location);

    const [userData, setUserData] = useState([]);

    useEffect(() => {
      const showUserDetails = async () => {
      await axios.get(baseUrl+ '/' + user.id, config())
        .then(response => setUserData(response.data));
      }
      showUserDetails();
    },[user.id]);

    // get user list to get other details than id
    const [userList, setUserList] = useState([]);

    useEffect(() => {
    const listUsers = async () => {
        await axios.get(baseUrl, config())
        .then(response => setUserList(response.data));
      }
      listUsers();
    }, []);

    console.log(userList);
    userList.forEach(element => {
      console.log(element);
    })

    const findInfo = (id) =>{
      let info = '';
      userList.forEach(element => {
        //console.log(id);
        //console.log(element.id);
        if (id === element.id ) {
          //console.log("bingo");
          info = element.firstName+" "+element.surname+", "+ element.email;
        } else {
          //console.log("ei ollut" + id + " ja "+element.id);
        }
      })
      return info;
    }
    //console.log(userData);

    // this retrieves all items for now, going forward would be benefitial
    // to select already at this point
    const [itemList, setItemList] = useState([]);

    useEffect(() => {
    const listItems = async () => {
        await axios.get(baseUrlItems)
        .then(response => setItemList(response.data));
      }
      listItems();
    }, []);

    


    //console.log(itemList);
    let published = [];
    
    // items, that user id equals seller id
    itemList.forEach(element => {
      //console.log(element);
      if(element.seller.id === user.id) {
        let publishedItem = {};
        publishedItem.name = element.name;
        publishedItem.model = element.model;
        publishedItem.id = element.id;
        published.push(publishedItem);
      }     
    });
    //console.log(published);

    let highestbids = [];
    
    // items, that user id equals highestBidder id
    itemList.forEach(element => {
      if (element.highestBidder === user.id) {
        let highestBid = {};
        highestBid.name = element.name;
        highestBid.model = element.model;
        highestBid.id = element.id;
        highestbids.push(highestBid);
      }
            
    });
    //console.log(highestbids);

    const calculateHours = (end) => {
      let endTime = new Date(end);
      let timeLeftMS = endTime - Date.now();
      if (timeLeftMS < 0) {
          return 0;
      } else {
          return timeLeftMS;
      }
    }

    let sellerMessage = "You have managed to sell following items:"
    let buyerMessage = "You have managed to buy following items:"
    let itemInfoSeller = [];
    let itemInfoBuyer = [];

    itemList.forEach(element => {
      let timeLeft = calculateHours(element.endDate);
      if (timeLeft === 0) {
        console.log(element.name +": auction has passed")
        if ((element.seller.id === user.id) && (element.highestBidder !== null)) {
          let newInfo = {};
          newInfo.status = "auction has passed"
          newInfo.name = element.name;
          //newInfo.toid = element.highestBidder;
          newInfo.to = findInfo(element.highestBidder); 
          itemInfoSeller.push(newInfo);
        }
        if (element.highestBidder === user.id) {
          let newInfo = {};
          newInfo.status = "auction has passed"
          newInfo.name = element.name;
          //newInfo.fromid = element.seller.id;
          console.log(element.seller.id);
          newInfo.from = findInfo(element.seller.id); 
          itemInfoBuyer.push(newInfo);
        }
      } else {
        console.log(element.name+": auction is still active")
      }     
    });

    let successDisplay = 'auto';

    if ((itemInfoBuyer.length === 0) && (itemInfoSeller.length === 0)) {
      successDisplay = ('none');
      //console.log("tapahtuiko tämä");
    } 
    /* else {
      props.saveState('success');
    } */
    //console.log(itemInfoBuyer.length);
    //console.log(itemInfoSeller.length);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    

    return (
      <Flex w={'full'} h={'100vh'} p={[2,4,6,8]} flex={1} align={'center'} justify={'center'} alignItems='center'>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize={{base: 'sm', sm: 'sm', md: 'md', xl: 'lg'}} fontWeight='bold'>
              Successful Auctions!
            </AlertDialogHeader>
            <AlertDialogBody fontSize={{base: 'sm', sm: 'sm', md: 'md', xl: 'lg'}}>
              <Text>{sellerMessage}</Text>
              {itemInfoSeller.map((item, pos) => (
                <HStack key={pos}>
              <Icon as={ArrowForwardIcon}></Icon>
              <Text >{item.name}, sold to {item.to}</Text>
              </HStack>
              ))}
              <Divider size={'lg'} borderColor={'#774BCD'}></Divider>
              <Text>{buyerMessage}</Text>
              {itemInfoBuyer.map((item, pos) => (
                <HStack key={pos}>
              <Icon as={ArrowBackIcon}></Icon>
              <Text >{item.name}, from {item.from}</Text>
              </HStack>
              ))}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='green' onClick={onClose} ml={3}>
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Box
        w={{ base: '90%', sm: '60%', md: '70%', lg:'70%'}}
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'lg'}
        p={10}>
        <Grid templateAreas={{base: `
                  "header"
                  "firstname"
                  "lastname"
                  "email"
                  "usertype"
                  "image"
                  "button"
                  "list1"
                  "list2"`
                  , sm: `
                  "header"
                  "firstname"
                  "lastname"
                  "email"
                  "usertype"
                  "image"
                  "button"
                  "list1"
                  "list2"`
                  , md: `
                  "header"
                  "firstname"
                  "lastname"
                  "email"
                  "usertype"
                  "image"
                  "button"
                  "list1"
                  "list2"`
                  ,lg: `
                  "image header"
                  "image firstname"
                  "image lastname"
                  "image email"
                  "image usertype"
                  "image button"
                  "list1 list2"
                  `}}
                gridTemplateColumns={{base:'1fr', sm: '1fr', md: '1fr' , lg: '1fr 1fr'}}
                h='full'
                p={2}
                gap='1'
                color='blackAlpha.700'
                >
              <GridItem  area={'image'}>
                <Image
                rounded={'lg'}
                height={'full'}
                width={'full'}
                objectFit={'cover'}
                src={Avatar}
                />
              </GridItem>
              <GridItem  area={'header'}>
                <Heading fontSize={{base:'2xl', sm:'3xl', md: '4xl', lg:'4xl'}} mb={[2,4,6,8]} textAlign={'center'}>
                {t('your-profile')}
                </Heading>
              </GridItem>
              <GridItem  area={'firstname'} textAlign={'center'} justify={'center'}>
                <Text fontSize={{base:'md', sm:'lg', md: 'lg', lg:'lg'}} color={'gray.600'} textAlign={'center'} pb={[2,4,6,8]}>
                {t('fname')}: {userData.firstName}
                </Text>
              </GridItem>
              <GridItem  area={'lastname'} textAlign={'center'} justify={'center'}>
                <Text fontSize={{base:'md', sm:'lg', md: 'lg', lg:'lg'}} color={'gray.600'} textAlign={'center'} pb={[2,4,6,8]}>
                {t('lname')}: {userData.surname}
                </Text>
              </GridItem>
              <GridItem  area={'email'} textAlign={'center'} justify={'center'}>
                <Text fontSize={{base:'md', sm:'lg', md: 'lg', lg:'lg'}} color={'gray.600'} textAlign={'center'} pb={[2,4,6,8]}>
                {t('email')}: {user.email}
                </Text>
              </GridItem>
              <GridItem  area={'usertype'} textAlign={'center'} justify={'center'}>
                <Text fontSize={{base:'md', sm:'lg', md: 'lg', lg:'lg'}} color={'gray.600'} textAlign={'center'} pb={[2,4,6,8]}>
                {t('user-type')}: {user.userType}
                </Text>
              </GridItem>
              <GridItem area={'button'} textAlign={'center'} justify={'center'}>
                <Button 
                  bg={'#774BCD'}
                  color={'white'}
                  mb={5}
                  _hover={{
                    bg: '#C7A1FE',
                  }} 
                  onClick={showAuctions}>
                    {t('auctions')}
                </Button>
                <Button
                  display={successDisplay} 
                  bg={'#774BCD'}
                  color={'white'}
                  mb={5}
                  ml={2}
                  _hover={{
                    bg: '#C7A1FE',
                  }} 
                  onClick={onOpen}>
                    Success!
                </Button>
              </GridItem>
              <GridItem area={'list1'} align={'center'} textAlign={'center'} justify={'center'} display={display}>
                <Stack align={'center'} textAlign={'center'} justify={'center'}>
                <Text fontSize={{base:'md', sm:'lg', md: 'lg', lg:'lg'}} color={'gray.600'} textAlign={'center'} pb={8}>
                {t('published-items')}:
                </Text>
                <UnorderedList>
                {published.map((item) => (
                  <ListItem fontSize={{base:'md', sm:'lg', md: 'lg', lg:'lg'}} key={'sold'+item.id}><Link as={ReachLink} to={'/details'}  
                  state={item.id} id={item.id}>{item.name} / {item.model}</Link></ListItem>
                  ))}
                </UnorderedList>
                </Stack>
              </GridItem>
              <GridItem area={'list2'} align={'center'} textAlign={'center'} justify={'center'}display={display}>
              <Stack align={'center'} textAlign={'center'} justify={'center'}>
                <Text fontSize={{base:'md', sm:'lg', md: 'lg', lg:'lg'}} color={'gray.600'} textAlign={'center'} pb={8}>
                {t('bought-items')}:
                </Text>
                <UnorderedList>
                {highestbids.map((item) => (
                  <ListItem fontSize={{base:'md', sm:'lg', md: 'lg', lg:'lg'}} key={'bought'+item.id}><Link as={ReachLink} to={'/details'}  
                  state={item.id} id={item.id}>{item.name} / {item.model}</Link></ListItem>
                  ))};
                </UnorderedList>
                </Stack>
              </GridItem>
              </Grid>
          </Box>
        </Flex>
    );
  }