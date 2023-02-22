import {
    Flex,
    Box,
    Image,
    Heading,
    Text,
    Button,
    Link,
    Grid,
    GridItem,
  } from '@chakra-ui/react';
  import { Link as ReachLink } from "react-router-dom";
  import { useTranslation } from 'react-i18next';
  import axios from 'axios';
  import { bytesToBase64 } from "byte-base64"
  
  export default function CardItem(props) {
    const {t} = useTranslation();
    let photo = ""
    const baseUrl = '/api/items';

    const getId = (e) => {
    }

    let detailState = [];
    let newState = {};
    newState.id = props.id;
    newState.currency = props.currency;
    newState.price = props.initialPrice;
    newState.bid = props.highestBid;
    newState.rate = props.rate;
    detailState.push(newState);

    const setImage = async (id) => {
      if(!id) {
        photo = props.src
        return
      }
      const imageData = await axios.get(`${baseUrl}/photo/${id}`)
      const base64encoded = bytesToBase64(imageData.data.photo.data.data)
      photo = `data:${imageData.data.contentType};base64,${base64encoded}`
    }

    setImage(props.photo)
    
    return (
        <Flex w={'full'} p={8} flex={1} align={'center'} justify={'center'} alignItems='center'>
          <Box
            minW='90%'
            maxW='90%' 
            rounded={'lg'}
            bg={'white'}
            boxShadow={'lg'}
            p={4}
            mr={0}>
            <Grid templateAreas={{
              base: `"status"
              "header"
              "model"
              "text"
              "price"
              "button"
              "time"`  
              , sm: `"status"
                "header"
                "model"
                "text"
                "price"
                "button"
                "time"`  
                  , md:`"header status"
                    "model x"
                    "text x"
                    "price x"
                    "button time"` 
                    , lg: `"image header status"
                      "image model x"
                      "image text x"
                      "image price x"
                      "image button time"
                `}}
                gridTemplateColumns={{sm: '1fr', md: '2fr 1fr' , lg: '200px 3fr 1fr'}}
                h='full'
                p={2}
                gap='1'
                color='blackAlpha.700'
                >
              <GridItem  area={'image'}>
                <Image
                display={{base: 'none', sm: 'none', md:'none', lg: 'inline-flex'}}
                rounded={'lg'}
                height={'90%'}
                width={200}
                objectFit={'cover'}
                src={props.src}
                />
              </GridItem>
              <GridItem h={[4,6,8,10]} area={'header'}>
                <Heading fontSize={{base: 'lg', sm:'xl', md:'2xl', lg:'3xl'}} textAlign={'center'}>
                    {props.name}
                </Heading>
              </GridItem>
              <GridItem h={[4,6,6,6]}  area={'model'} textAlign={'center'} justify={'center'}>
                <Text fontSize={{base: 'xs', sm:'sm', md:'md', lg:'lg'}} color={'gray.600'} textAlign={'center'} pb={[2,4,6,8]}>
                    {props.model}
                </Text>
              </GridItem>
              <GridItem h={[10,10,12,12]}   area={'text'} textAlign={'center'} justify={'center'}>
                <Text fontSize={{base: 'xs', sm:'sm', md:'md', lg:'lg'}} color={'gray.600'} textAlign={'center'} pb={[2,4,6,8]}>
                    {props.description}
                </Text>
              </GridItem>
              <GridItem h={[10,10,8,6]}  area={'price'} textAlign={'center'} justify={'center'}>
                <Text fontSize={{base: 'xs', sm:'sm', md:'md', lg:'lg'}} color={'gray.600'} textAlign={'center'} pb={[2,4,6,8]}>
                {t('initial-price')} {props.initialPrice} {props.currency} / {t('highest-bid')} {props.highestBid} {props.currency}</Text>
              </GridItem>
              <GridItem  h={[4,4,4,4]} mb={[2,4,6,8]} area={'button'} textAlign={'center'} justify={'center'}>
                <Button size={{base: 'xs', sm: 'sm', md: 'sm', lg: 'md'}}
                zIndex={'auto'} bg={'#774BCD'}
                  color={'white'}
                  _hover={{
                    bg: '#C7A1FE',
                  }} onClick={getId}><Link as={ReachLink} to={'/details'}  
                  state={detailState} id={props.id}>{t('details')}</Link></Button>
              </GridItem>
              <GridItem h={[4,6,8,10]} area={'status'} textAlign={{base: 'center', sm: 'center', md: 'right', lg: 'right'}}>
                <Text as='b' fontSize={{base: 'xs', sm:'sm', md:'md', lg:'lg'}} color={'green.600'} textAlign={'right'} pb={[2,4,6,8]}>
                     {props.status}</Text>
              </GridItem>
              <GridItem h={[4,6,8,10]} area={'time'} textAlign={{base: 'center', sm: 'center', md: 'right', lg: 'right'}}>
                <Text as='b' fontSize={{base: 'xs', sm:'sm', md:'md', lg:'lg'}} color={'gray.600'} textAlign={'right'} pb={[2,4,6,8]}>
                {t('time-left')} {props.time}</Text>
              </GridItem>
            </Grid>
          </Box>
        </Flex>
    );
  }