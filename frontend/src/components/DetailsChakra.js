import {
    Box,
    Container,
    Stack,
    Text,
    Image,
    Input,
    Flex,
    Button,
    Heading,
    SimpleGrid,
    Divider,
    Alert, 
    AlertDescription, 
    AlertIcon, 
    CloseButton,
  } from '@chakra-ui/react';
  import ImagePlaceholder from '../images/blanc-img.png'
  import axios from 'axios';
  import { useLocation } from "react-router-dom";
  import { useState, useEffect} from 'react';
  import { useTranslation } from 'react-i18next';
  import { bytesToBase64 } from "byte-base64"

  const baseUrl = '/api/items';
  
  export default function ProductDetails(props) {
    const {t} = useTranslation();
    let image = ""

    const location = useLocation();
    //console.log(location.state);

    let id = location.state;
    //console.log(state[0]);
    //let id = location.state[0].id;
    //console.log("id on "+id);
    //let currency = location.state[0].currency;
    let currency = props.curr;
    //let iPrice = location.state[0].price;
    //let hBid = location.state[0].bid;
    //let rate = location.state[0].rate;
    let rate = props.rate;

    
    //console.log("From Details: Currency is "+props.curr+" and rate is "+props.rate);

    const [alertStatus, setAlertStatus] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");
    const [display, setDisplay] = useState("none");

    const [item, setItem] = useState([]);

    let iPrice = (item.initialPrice * rate).toFixed(2);

    
    
    const showItemDetails = async () => {
      try {
      await axios.get(baseUrl+ '/' + id)
        .then(response => setItem(response.data));
      } catch (error) {
        console.log(error.response.data.error);
        setDisplay('flex');
        setAlertStatus('error');
        setAlertMessage(error.response.data.error);
      }
    };
    
    
    useEffect(() => {
      showItemDetails();
    },[]);


    const setImage = async () => {
      if(!item.photo) {
        image = ImagePlaceholder
        return
      }
      const imageData = await axios.get(`${baseUrl}/photo/${item.photo}`)
      const base64encoded = bytesToBase64(imageData.data.photo.data.data)
      image = `data:${imageData.data.contentType};base64,${base64encoded}`
    }

    setImage()

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


    let itemBid = (item.highestBid * rate).toFixed(2);

    const [edit, setEdit] = useState(false);
    const [bid, setBid] = useState(0);
    const bidUpdate = (event) =>  {
      let eurBid = (event.target.value / rate).toFixed(2);
      setBid(eurBid);
    }
    let itemId = item.id;

    //----------this needs the update ref to backend----------

    const recordBit = async (id, newBid) => {
      try{
      const response = await axios.put((baseUrl+ '/' + itemId), newBid, config())
      showItemDetails();
      } catch (error) {
        console.log(error.response.data.error);
        setDisplay("flex");
        console.log(display);
        setAlertStatus("error");
        console.log(alertStatus);
        // setAlertTitle('Error!');
        setAlertMessage(error.response.data.error);
        console.log(alertMessage);
      }  
    }
    
    //--------------------------------------------------------

    const handleSubmit = (event) => {
      event.preventDefault();

      let id = itemId;
      setEdit(false);

      let user = getUser(); 

      const newBid = {
        highestBid : bid
      }

      recordBit(id, newBid);

    }
      
      const makeBid = function(event) {
        let user = getUser(); 
        if (user !== null) {
          setEdit(true);
        } else {
          setDisplay('flex');
          setAlertStatus('error');
          setAlertMessage("You need to sign in to make a bid");
        }
      }
      

    const closeAlert = () => {
      if (alertStatus === "success") {
      } else {
        setDisplay("none");
      }
    };

    let sellerName = "";
    let sellerEmail = "";

    if (item.seller == null){
      console.log(item);
    } else {
      sellerName = item.seller.firstName + " "+ item.seller.surname;
      sellerEmail = item.seller.email;
    }

    if(edit){
    return (
      <Container w={'80%'} maxW={'6xl'}>
        <Alert display={display} status={alertStatus}>
              <AlertIcon />
              <AlertDescription mr={2}>{alertMessage}</AlertDescription>
              <CloseButton onClick={closeAlert} />
        </Alert>
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 18, md: 24 }}>
          <Flex>
            <Image
              rounded={'md'}
              alt={'product image'}
              src={ImagePlaceholder}
              fit={'cover'}
              align={'center'}
              w={{ base: '100%', sm: '60%', md: '75%', lg: '100%' }}
              h={{ base: '100%', sm: '60%', md: '75%', lg: '100%' }}
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
              </Text>
              <Text
                color={'gray.900'}
                fontWeight={500}
                fontSize={'2xl'}
                mb={4}>
                {t('highest-bid')} {itemBid} {currency} 
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
              >
              
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
                <Text
                  color={'gray.900'}
                  fontSize={{ base: '16px', lg: '18px' }}
                  fontWeight={'300'}>
                  Category: {item.category}
                </Text>
                <Text
                  color={'gray.900'}
                  fontSize={{ base: '16px', lg: '18px' }}
                  fontWeight={'300'}>
                  Condition: {item.condition}
                </Text>
              </Box>
                <Divider size={'lg'} borderColor={'#774BCD'}></Divider>
              <Box>
                <Text
                  fontSize={{ base: '16px', lg: '18px' }}
                  color={'yellow.500'}
                  fontWeight={'500'}
                  textTransform={'uppercase'}
                  mb={'4'}>
                  {t('seller-details')}
                </Text>
                <Text
                  color={'gray.900'}
                  fontSize={{ base: '16px', lg: '18px' }}
                  fontWeight={'300'}>
                  Name: {sellerName}
                </Text>
                <Text
                  color={'gray.900'}
                  fontSize={{ base: '16px', lg: '18px' }}
                  fontWeight={'300'}>
                  Email: {sellerEmail}
                </Text>
                <Text
                  color={'gray.900'}
                  fontSize={{ base: '16px', lg: '18px' }}
                  fontWeight={'300'}>
                  Location zipcode: {item.zipcode}
                </Text>
              </Box>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    );
  } else {
    return (
      <Container w={'80%'} maxW={'6xl'}>
        <Alert display={display} status={alertStatus}>
              <AlertIcon />
              <AlertDescription mr={2}>{alertMessage}</AlertDescription>
              <CloseButton onClick={closeAlert} />
        </Alert>
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 18, md: 24 }}>
          <Flex>
            <Image
              rounded={'md'}
              alt={'product image'}
              src={ImagePlaceholder}
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
              </Text>
              <Text
                color={'gray.900'}
                fontWeight={500}
                fontSize={'2xl'}
                mb={4}>
                {t('highest-bid')} {itemBid} {currency}
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
              >
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
                  fontWeight={'300'}
                  mb={4}>
                  {item.description}
                </Text>
                <Text
                  color={'gray.900'}
                  fontSize={{ base: '16px', lg: '18px' }}
                  fontWeight={'300'}>
                  Category: {item.category}
                </Text>
                <Text
                  color={'gray.900'}
                  fontSize={{ base: '16px', lg: '18px' }}
                  fontWeight={'300'}>
                  Condition: {item.condition}
                </Text>
              </Box>
                <Divider size={'lg'} borderColor={'#774BCD'}></Divider>
              <Box>
                <Text
                  fontSize={{ base: '16px', lg: '18px' }}
                  color={'yellow.500'}
                  fontWeight={'500'}
                  textTransform={'uppercase'}
                  mb={'4'}>
                  {t('seller-details')}
                </Text>
                <Text
                  color={'gray.900'}
                  fontSize={{ base: '16px', lg: '18px' }}
                  fontWeight={'300'}>
                  Name: {sellerName}
                </Text>
                <Text
                  color={'gray.900'}
                  fontSize={{ base: '16px', lg: '18px' }}
                  fontWeight={'300'}>
                  Email: {sellerEmail}
                </Text>
                <Text
                  color={'gray.900'}
                  fontSize={{ base: '16px', lg: '18px' }}
                  fontWeight={'300'}>
                  Location zipcode: {item.zipcode}
                </Text>
              </Box>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    );
  }}