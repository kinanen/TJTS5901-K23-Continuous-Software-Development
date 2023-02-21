import {
    Box,
    Container,
    Stack,
    Text,
    Image,
    Input,
    Flex,
    VStack,
    Button,
    Heading,
    SimpleGrid,
    StackDivider,
    Divider,
    List,
    ListItem,
  } from '@chakra-ui/react';
  import Hammer from '../images/hammer.jpg';
  import axios from 'axios';
  import { useLocation } from "react-router-dom";
  import { useState, useEffect} from 'react';
  import { useTranslation } from 'react-i18next';

  const baseUrl = '/api/items';
  
  
  
  export default function ProductDetails(props) {
    const {t} = useTranslation();

    const location = useLocation();
    //console.log(location.state);

    let state = location.state;
    console.log(state[0]);
    let id = location.state[0].id;
    //let currency = location.state[0].currency;
    let currency = props.curr;
    //let iPrice = location.state[0].price;
    //let hBid = location.state[0].bid;
    //let rate = location.state[0].rate;
    let rate = props.rate;

    
    console.log("From Details: Currency is "+props.curr+" and rate is "+props.rate);

    const [item, setItem] = useState([]);

    let iPrice = Math.round(item.initialPrice * rate);

    useEffect(() => {
    const showItemDetails = async () => {
      await axios.get(baseUrl+ '/' + id)
        .then(response => setItem(response.data));
      }
      showItemDetails();
    });

    let token = null
    const STORAGE_KEY = 'loggedAuctionAppUser'

    const getUser = () => {
      const loggedUserJSON = window.localStorage.getItem(STORAGE_KEY)
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        token = user.token
        return user
      }
      return null
      }

    const getToken = () => token

    const config = () => {
      return {
        headers: {
          Authorization: `bearer ${getToken()}`
        },
      }
    }


    let itemBid = Math.round(item.highestBid * rate);

    const [edit, setEdit] = useState(false);
    const [bid, setBid] = useState(0);
    const bidUpdate = (event) =>  {
      let eurBid = event.target.value / rate
      setBid(eurBid);
    }
    let itemId = item.id;

    //----------this needs the update ref to backend----------
    const recordBit = async (id, newBid) => {
      console.log("is not ready yet to update item "+id);
      console.log(bid);
      const response = axios.put((baseUrl+ '/' + itemId), newBid, config())
      console.log(response.data);
      return response.data
    }
    //--------------------------------------------------------
    
    const handleSubmit = (event) => {
      event.preventDefault();

      let id = itemId;
      console.log("bid made for item "+id)
      setEdit(false);

      let user = getUser(); 
      console.log(user);
      console.log(token);

      const newBid = {
        highestBid : bid
      }

      recordBit(id, newBid);

    }

    const makeBid = function(event) {
      setEdit(true);
      console.log("Item "+ itemId+ " now clicked for bid");
      console.log("New bid is "+ bid);
    };

    if(edit){
    return (
      <Container w={'80%'} maxW={'6xl'}>
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 18, md: 24 }}>
          <Flex>
            <Image
              rounded={'md'}
              alt={'product image'}
              src={Hammer}
              fit={'cover'}
              align={'center'}
              w={'100%'}
              h={{ base: '100%', sm: '400px', lg: '500px' }}
            />
          </Flex>
          <Stack spacing={{ base: 6, md: 10 }}>
            <Box as={'header'}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
                {item.name}
              </Heading>
              <Text
                color={'gray.900'}
                fontWeight={300}
                fontSize={'2xl'}
                mb={4}>
                {item.model}
              </Text>
              <Text
                color={'gray.900'}
                fontWeight={300}
                fontSize={'1xl'}>
                {t('initial-price')} {iPrice} {currency} 
                {/* {item.initialPrice} {item.currency} */}
              </Text>
              <Text
                color={'gray.900'}
                fontWeight={500}
                fontSize={'2xl'}
                mb={4}>
                {t('highest-bid')} {itemBid} {currency} 
                {/* {item.highestBid} {item.currency} */}
              </Text>
              <Text
                color={'gray.900'}
                fontWeight={500}
                fontSize={'2xl'}
                mb={4}>
                {t('new-bid')}
                <Input type='text' onChange={bidUpdate}></Input> 
                {currency}
              </Text>
              <Button
                  loadingText="Submitting"
                  size="md"
                  bg={'#774BCD'}
                  color={'white'}
                  _hover={{
                    bg: '#C7A1FE',
                  }} onClick={handleSubmit}>   
              {t('submit-bid')}
            </Button>
            </Box>
  
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={'column'}
              /* divider={
                <StackDivider
                color={'gray.900'}
                />
              } */
              >
              {/* <VStack spacing={{ base: 4, sm: 6 }}>
                <Text
                  color={'gray.900'}
                  fontSize={'2xl'}
                  fontWeight={'300'}>
                  {item.description}
                </Text>
{                 <Text fontSize={'lg'}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad
                  aliquid amet at delectus doloribus dolorum expedita hic, ipsum
                  maxime modi nam officiis porro, quae, quisquam quos
                  reprehenderit velit? Natus, totam.
                </Text> }
              </VStack> */}
              <Divider size={'lg'} borderColor={'#774BCD'}></Divider>
              <Box>
                <Text
                  fontSize={{ base: '16px', lg: '18px' }}
                  color={'yellow.500'}
                  fontWeight={'500'}
                  textTransform={'uppercase'}
                  mb={'4'}>
                  {t('product-details')}
                </Text>
                <Text
                  color={'gray.900'}
                  fontSize={{ base: '16px', lg: '18px' }}
                  fontWeight={'300'}>
                  {item.description}
                </Text>

                {/* <List spacing={2}>
                  <ListItem>
                    <Text as={'span'} fontWeight={'bold'}>
                      {t('other-details')}
                    </Text>{' '}
                        Blaa blaa
                  </ListItem>
                </List> */}
              </Box>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    );
  } else {
    return (
      <Container w={'80%'} maxW={'6xl'}>
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 18, md: 24 }}>
          <Flex>
            <Image
              rounded={'md'}
              alt={'product image'}
              src={Hammer}
              fit={'cover'}
              align={'center'}
              w={'100%'}
              h={{ base: '100%', sm: '400px', lg: '500px' }}
            />
          </Flex>
          <Stack spacing={{ base: 6, md: 10 }}>
            <Box as={'header'}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
                {item.name}
              </Heading>
              <Text
                color={'gray.900'}
                fontWeight={300}
                fontSize={'2xl'}
                mb={4}>
                {item.model}
                
              </Text>
              <Text
                color={'gray.900'}
                fontWeight={300}
                fontSize={'1xl'}>
                {t('initial-price')} {iPrice} {currency}
                {/* {item.initialPrice} {item.currency} */}
              </Text>
              <Text
                color={'gray.900'}
                fontWeight={500}
                fontSize={'2xl'}
                mb={4}>
                {t('highest-bid')} {itemBid} {currency}
                {/* {item.highestBid} {item.currency} */}
              </Text>
              <Button
                  loadingText="Submitting"
                  size="md"
                  bg={'#774BCD'}
                  color={'white'}
                  _hover={{
                    bg: '#C7A1FE',
                  }}onClick={makeBid}>   
              {t('make-bid')}
            </Button>
            </Box>
  
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={'column'}
              // divider={
              //   <StackDivider
              //   color={'gray.900'}
              //   />
              // }
              >
              {/* <VStack spacing={{ base: 4, sm: 6 }}>
                <Text
                  color={'gray.900'}
                  fontSize={'2xl'}
                  fontWeight={'300'}>
                  {item.description}
                </Text>
{                <Text fontSize={'lg'}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad
                  aliquid amet at delectus doloribus dolorum expedita hic, ipsum
                  maxime modi nam officiis porro, quae, quisquam quos
                  reprehenderit velit? Natus, totam.
                </Text> }
              </VStack>*/}
              <Divider size={'lg'} borderColor={'#774BCD'}></Divider>
              <Box>
                <Text
                  fontSize={{ base: '16px', lg: '18px' }}
                  color={'yellow.500'}
                  fontWeight={'500'}
                  textTransform={'uppercase'}
                  mb={'4'}>
                  {t('product-details')}
                </Text>
                <Text
                  color={'gray.900'}
                  fontSize={{ base: '16px', lg: '18px' }}
                  fontWeight={'300'}>
                  {item.description}
                </Text>
                {/* <List spacing={2}>
                  <ListItem>
                    <Text as={'span'} fontWeight={'bold'}>
                      {t('other-details')}
                    </Text>{' '}
                        Blaa blaa
                  </ListItem>
                </List> */}
              </Box>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    );
  }}