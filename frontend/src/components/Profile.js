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
    Stack
  } from '@chakra-ui/react';
  import { Link as ReachLink } from "react-router-dom";
  import { useLocation } from "react-router-dom";
  import Avatar from "../images/emoticon.png"
  import { useEffect, useState } from 'react';
  import { useTranslation } from 'react-i18next';
  
  import axios from 'axios';
  const baseUrl = '/api/users';
  const baseUrlItems = '/api/items';

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

  
  export default function ProfileCard(props) {
    const {t} = useTranslation();

    const [display, setDisplay] = useState('none');

    let user = getUser(); 
    console.log(user);

    const showAuctions = (e) => {
      setDisplay('flex');
      //console.log(e.target.id);
    }

    const location = useLocation();
    console.log(location);

    const [userData, setUserData] = useState([]);

    useEffect(() => {
      const showItemDetails = async () => {
      await axios.get(baseUrl+ '/' + user.id, config())
        .then(response => setUserData(response.data));
      }
      showItemDetails();
    });

    console.log(userData);

    const [itemList, setItemList] = useState([]);

    useEffect(() => {
    const listItems = async () => {
        await axios.get(baseUrlItems)
        .then(response => setItemList(response.data));
      }
      listItems();
    }, []);

    console.log(itemList);
    let published = [];
    

    itemList.forEach(element => {
      if(element.seller.id === user.id) {
        let publishedItem = {};
        publishedItem.name = element.name;
        publishedItem.model = element.model;
        publishedItem.id = element.id;
        published.push(publishedItem);
      }     
    });
    console.log(published);

    let highestbids = [];
    

    itemList.forEach(element => {
      if (element.highestBidder === user.id) {
        let highestBid = {};
        highestBid.name = element.name;
        highestBid.model = element.model;
        highestBid.id = element.id;
        highestbids.push(highestBid);
      }
            
    });
    console.log(highestbids);

    return (
        <Flex w={'full'} h={'100vh'} p={8} flex={1} align={'center'} justify={'center'} alignItems='center'>
          <Box
          // alignItems='center'
            minW={{ base: '60%', md: '70%'}}
            maxW={{ base: '60%', md: '70%'}}
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={10}>
            <Grid templateAreas={`
                  "image header"
                  "image firstname"
                  "image lastname"
                  "image email"
                  "image usertype"
                  "image button"
                  "list1 list2"
                  `}
                gridTemplateRows={'50px 50px 50px 50px 50px 1fr'}
                gridTemplateColumns={'1fr 1fr'}
                h='full'
                p={2}
                gap='1'
                color='blackAlpha.700'
                // fontWeight='bold'
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
                <Heading fontSize={'4xl'} textAlign={'center'}>
                    {t('your-profile')}
                </Heading>
              </GridItem>
              <GridItem  area={'firstname'} textAlign={'center'} justify={'center'}>
                <Text fontSize={'lg'} color={'gray.600'} textAlign={'center'} pb={8}>
                    {t('fname')}: {userData.firstName}
                </Text>
              </GridItem>
              <GridItem  area={'lastname'} textAlign={'center'} justify={'center'}>
                <Text fontSize={'lg'} color={'gray.600'} textAlign={'center'} pb={8}>
                    {t('lname')}: {userData.surname}
                </Text>
              </GridItem>
              <GridItem  area={'email'} textAlign={'center'} justify={'center'}>
                <Text fontSize={'lg'} color={'gray.600'} textAlign={'center'} pb={8}>
                    {t('email')}: {user.email}
                </Text>
              </GridItem>
              <GridItem  area={'usertype'} textAlign={'center'} justify={'center'}>
                <Text fontSize={'lg'} color={'gray.600'} textAlign={'center'} pb={8}>
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
                    {/* <Link as={ReachLink} to={'/details'}  
                  state={props.id} id={props.id}>
                    Details</Link> */}
                    {t('auctions')}
                </Button>
              </GridItem>
              <GridItem area={'list1'} align={'center'} textAlign={'center'} justify={'center'} display={display}>
                <Stack align={'center'} textAlign={'center'} justify={'center'}>
                <Text fontSize={'lg'} color={'gray.600'} textAlign={'center'} pb={8}>
                  {t('published-items')}
                     
                </Text>
                <UnorderedList>
                {published.map((item) => (
                  <ListItem key={'sold'+item.id}><Link as={ReachLink} to={'/details'}  
                  state={item.id} id={item.id}>{item.name} / {item.model}</Link></ListItem>
                  ))}
                </UnorderedList>
                </Stack>
              </GridItem>
              <GridItem area={'list2'} align={'center'} textAlign={'center'} justify={'center'}display={display}>
              <Stack align={'center'} textAlign={'center'} justify={'center'}>
                <Text fontSize={'lg'} color={'gray.600'} textAlign={'center'} pb={8}>
                      {t('bought-items')}
                </Text>
                <UnorderedList>
                {highestbids.map((item) => (
                  <ListItem key={'bought'+item.id}><Link as={ReachLink} to={'/details'}  
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