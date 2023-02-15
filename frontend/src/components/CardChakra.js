import {
    Flex,
    Box,
    Image as ChakraImage,
    Heading,
    Text,
    Button,
    Link,
    useColorModeValue,
    Grid,
    GridItem,
  } from '@chakra-ui/react';
  import { Link as ReachLink } from "react-router-dom";
  import { useLocation } from "react-router-dom";
  import axios from 'axios';
  import { bytesToBase64 } from "byte-base64"
  
  export default function CardItem(props) {

    let photos = new Image()
    let photo = ""
    const baseUrl = '/api/items';

    const getId = (e) => {
      console.log(e.target.id);
    }

    const location = useLocation();
    console.log(location);

    const setImage = async (id) => {
      if(!id) {
        photo = props.src
        photos.src = props.src
        return
      }
      const imageData = await axios.get(`${baseUrl}/photo/${id}`)
      const base64encoded = bytesToBase64(imageData.data.photo.data.data)
      photo = `data:${imageData.data.contentType};base64,${base64encoded}`
      photos.src = `data:${imageData.data.contentType};base64,${base64encoded}`
    }

    setImage(props.photo)

    return (
        <Flex w={'full'} p={8} flex={1} align={'center'} justify={'center'} alignItems='center'>
          <Box
          // alignItems='center'
            minW='90%'
            maxW='90%'
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={4}
            mr={0}>
            <Grid templateAreas={`"image header status"
                  "image model x"
                  "image text x"
                  "image price x"
                  "image button time"
                  `}
                gridTemplateRows={'1fr 1fr 1fr 1fr 1fr'}
                gridTemplateColumns={'300px 2fr 1fr'}
                h='full'
                p={2}
                gap='1'
                color='blackAlpha.700'
                // fontWeight='bold'
                >
              <GridItem  area={'image'}>
                <ChakraImage
                rounded={'lg'}
                height={'full'}
                width={280}
                objectFit={'cover'}
                src={photo}/>
              </GridItem>
              <GridItem  area={'header'}>
                <Heading fontSize={'4xl'} textAlign={'center'}>
                    {props.name}
                </Heading>
              </GridItem>
              <GridItem  area={'model'} textAlign={'center'} justify={'center'}>
                <Text fontSize={'lg'} color={'gray.600'} textAlign={'center'} pb={8}>
                    {props.model}
                </Text>
              </GridItem>
              <GridItem  area={'text'} textAlign={'center'} justify={'center'}>
                <Text fontSize={'lg'} color={'gray.600'} textAlign={'center'} pb={8}>
                    {props.description}
                </Text>
              </GridItem>
              <GridItem  area={'price'} textAlign={'center'} justify={'center'}>
                <h2>Initial price: {props.initialPrice} {props.currency} / Highest bid: {props.highestBid} {props.currency}</h2>
              </GridItem>
              <GridItem area={'button'} textAlign={'center'} justify={'center'}>
                <Button bg={'#774BCD'}
                  color={'white'}
                  _hover={{
                    bg: '#C7A1FE',
                  }} onClick={getId}><Link as={ReachLink} to={`/details/${props.id}`}  
                  state={props.id} id={props.id}>Details</Link></Button>
              </GridItem>
              <GridItem  area={'status'} textAlign={'right'}>
                <Text as='b' fontSize={'lg'} color={'green.600'} textAlign={'right'} pb={8}>
                     {props.status}</Text>
              </GridItem>
              <GridItem  area={'time'} textAlign={'right'}>
                <Text as='b' fontSize={'lg'} color={'gray.600'} textAlign={'right'} pb={8}>
                  Time remaining: {props.time}</Text>
              </GridItem>
            </Grid>
          </Box>
        </Flex>
    );
  }