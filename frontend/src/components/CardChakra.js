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
  } from '@chakra-ui/react';
  import { Link as ReachLink } from "react-router-dom";
  
  export default function CardItem(props) {
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
                  "image text x"
                  "image price x"
                  "image button time"
                  `}
                gridTemplateRows={'1fr 1fr 1fr 1fr'}
                gridTemplateColumns={'300px 2fr 1fr'}
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
                width={280}
                objectFit={'cover'}
                src={props.src}
                />
              </GridItem>
              <GridItem  area={'header'}>
                <Heading fontSize={'4xl'} textAlign={'center'}>
                    {props.header}
                </Heading>
              </GridItem>
              <GridItem  area={'text'} textAlign={'center'} justify={'center'}>
                <Text fontSize={'lg'} color={'gray.600'} textAlign={'center'} pb={8}>
                    {props.text}
                </Text>
              </GridItem>
              <GridItem  area={'price'} textAlign={'center'} justify={'center'}>
                <h2>{props.price} €</h2>
              </GridItem>
              <GridItem area={'button'} textAlign={'center'} justify={'center'}>
                <Button bg={'#774BCD'}
                  color={'white'}
                  _hover={{
                    bg: '#C7A1FE',
                  }}><Link as={ReachLink} to='/details'>Details</Link></Button>
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