import { FormControl, FormLabel, Input, VStack, Link, Heading, SimpleGrid, GridItem, Select, Button } from '@chakra-ui/react';
import { Link as ReachLink } from "react-router-dom";
import { useState } from 'react';


import axios from 'axios';
import PhotoUpload from './Photo';
const baseUrl = '/api/items';

let token = null
const STORAGE_KEY = 'loggedAuctionAppUser'

// const setUser = (user) => {
//     window.localStorage.setItem(
//       STORAGE_KEY, JSON.stringify(user)
//     )
//     token = user.token
//   }

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
    //console.log("nyt ollaan configissa");
    //console.log(token);
    //console.log(getUser());
    return {
      headers: {
        Authorization: `bearer ${getToken()}`
      },
    }
  }

  const publish = async details => {
    console.log(details);
    const response = await axios.post(baseUrl, details, config())
    console.log(response.data);
    return response.data
  }

function Form() {
    const [itemName, setItemName] = useState('');
    const itemNameUpdate = (event) => setItemName(event.target.value);
    const [itemModel, setItemModel] = useState('');
    const itemModelUpdate = (event) => setItemModel(event.target.value);
    const [itemDesc, setItemDesc] = useState('');
    const itemDescUpdate = (event) => setItemDesc(event.target.value);
    const [category, setCategory] = useState('other');
    const categoryUpdate = (event) => setCategory(event.target.value);
    const [condition, setCondition] = useState('poor');
    const conditionUpdate = (event) => setCondition(event.target.value);
    const [zipcode, setZipcode] = useState('');
    const zipcodeUpdate = (event) => setZipcode(event.target.value);
    const [price, setPrice] = useState('');
    const priceUpdate = (event) => setPrice(event.target.value);
    const [currency, setCurrency] = useState('eur');
    const currencyUpdate = (event) => setCurrency(event.target.value);
    const [photo, setPhoto] = useState('');
    const photoUpdate = (url) => setPhoto(url);

    //--------------------------- ************** ----------------------------------
    const handleSubmit = (event) => { // Once the form has been submitted, this function will post to the backend
        event.preventDefault();

        let user = getUser(); 
        console.log(user);
        console.log(token);

        const details = {
            name: itemName,
            model: itemModel,
            description: itemDesc,
            category: category,
            condition: condition,
            initialPrice: price,
            //seller: user,
            //highestBid: null,
            //highestBidder: null,
            //startDate: new Date(),
            //endDate: new Date(),//endDate.setHours(endDate.getHours() + 24),
            zipcode: zipcode,
            currency: currency
            // uploaded image can be added from variable photo
          };
          
          console.log("Image as "+photo);
      
          publish(details);
        
    }

    

    return (
        <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
            <VStack spacing={3} alignItems="flex-start">
                <Heading size="2xl">Publish your item</Heading>
            </VStack>
            <form onSubmit={handleSubmit}>
                <SimpleGrid columns={2} columnGap={3} rowGap={6} w="full">
                    <GridItem colSpan={1}>
                        <FormControl>
                            <FormLabel>Item name</FormLabel>
                            <Input onChange={itemNameUpdate} placeholder="" />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={1}>
                        <FormControl>
                            <FormLabel>Model etc.</FormLabel>
                            <Input onChange={itemModelUpdate} placeholder="" />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <FormControl>
                            <FormLabel>Item description</FormLabel>
                            <Input onChange={itemDescUpdate} placeholder="Please include additional information of your item" />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={1}>
                        <FormControl>
                            <FormLabel>Category</FormLabel>
                            <Select onChange={categoryUpdate}>
                                <option value="other">Other</option>
                                <option value="device">Device</option>
                                <option value="furniture">Furniture</option>
                                <option value="clothes">Clothes</option>
                            </Select>
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={1}>
                        <FormControl>
                            <FormLabel>Condition</FormLabel>
                            <Select onChange={conditionUpdate}>
                                <option value="poor">Poor</option>
                                <option value="acceptable">Acceptable</option>
                                <option value="good">Good</option>
                                <option value="excellent">Excellent</option>
                                <option value="new">New</option>
                            </Select>
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={1}>
                        <FormControl>
                            <FormLabel>Zipcode</FormLabel>
                            <Input onChange={zipcodeUpdate} placeholder="" />
                        </FormControl>
                    </GridItem>
                    <PhotoUpload photoUpdate={photoUpdate} />
{/*                     <GridItem colSpan={1}>
                        <Button
                            type="submit"
                            mt={8}
                            loadingText="Submitting"
                            size="lg"
                            bg={'white'}
                            color={'#774BCD'}
                            _hover={{
                                bg: '#C7A1FE',
                            }}>
                            <Link as={ReachLink} to='/uploadphoto'>UPLOAD PHOTO</Link>
                        </Button>
                    </GridItem> */}
                    <GridItem colSpan={1}>
                        <FormControl>
                            <FormLabel>Price</FormLabel>
                            <Input onChange={priceUpdate} placeholder="" />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={1}>
                        <FormControl>
                            <FormLabel>Currency</FormLabel>
                            <Select onChange={currencyUpdate}>
                                <option value="eur">EUR</option>
                                <option value="usd">USD</option>
                                <option value="gbp">GBP</option>
                            </Select>
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <Button
                            type='submit'
                            loadingText="Submitting"
                            size="lg"
                            w="full"
                            bg={'#774BCD'}
                            color={'white'}
                            _hover={{
                                bg: '#C7A1FE',
                            }}>
                            SUBMIT
                        </Button>
                    </GridItem>
                </SimpleGrid>
            </form>
        </VStack>
    );
}

export default Form;