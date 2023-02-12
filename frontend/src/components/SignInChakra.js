import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Box,
  Image,
  Text,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import SignInImg from "../images/signin.jpg";
import { useState } from 'react';

import axios from 'axios';
const baseUrl = '/api/login';


let token = null
const STORAGE_KEY = 'loggedAuctionAppUser'

const setUser = (user) => {
  console.log(user)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  token = user.token
  
}

  const login = async credentials => {
    console.log(credentials);
    const response = await axios.post(baseUrl, credentials)
    console.log(response.data);
    setUser({email: response.data.email, userType: response.data.userType, id: response.data.id, token: response.data.token});
    return response.data
  }

export default function SignIn() {
  const [email, setEmail] = useState('');
  const emailUpdate = (event) => setEmail(event.target.value);
  const [password, setPassword] = useState('');
  const passwordUpdate = (event) => setPassword(event.target.value);
  const [userType, setUserType] = useState('buyer');
  const userTypeUpdate = (event) => setUserType(event.target.value);

  //--------------------------- ************** ----------------------------------
  const handleSubmit = (event) => { // Once the form has been submitted, this function will post to the backend
    event.preventDefault();
    
    const credentials = {
      email: email,
      password: password,
      userType: userType
    };

    login(credentials);

    /* 
    const postURL = "http://localhost:4000/api/staff/" //This should be replaced by our own
    fetch(postURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        usertype: userType
      })
    })
      .then(() => {
        // Once added, the user will be notified 
        alert('You have added an item to the system!');
      }) 
      */
    //alert(`Email: ${email}, Password: ${password}, User Type: ${userType}`);
  }

  //--------------------------- ************** ----------------------------------

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        {/* <Stack spacing={4} w={'full'} maxW={'md'}> */}
        {/* <Heading fontSize={'2xl'}>Sign in to your account</Heading> */}
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign in
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'} textAlign={'center'} pb={8}>
            to your account
          </Text>
          <Stack spacing={4}>
            <form onSubmit={handleSubmit}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" onChange={emailUpdate} />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" onChange={passwordUpdate} />
              </FormControl>
              <FormControl>
                <FormLabel>User type</FormLabel>
                <Select onChange={userTypeUpdate}>
                  <option value="buyer" >Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="operator">Operator</option>
                </Select>
              </FormControl>
              <Stack spacing={6} mt={4}>
{/*                 <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}>
                  <Checkbox>Remember me</Checkbox>
                  <Link color={'blue.500'} pl={10}>Forgot password?</Link>
                </Stack> */}
                <Button
                  type='submit'
                  loadingText="Submitting"
                  size="lg"
                  bg={'#774BCD'}
                  color={'white'}
                  _hover={{
                    bg: '#C7A1FE',
                  }}>
                  Sign In
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'SignIn Image'}
          objectFit={'cover'}
          // src={
          //   'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
          // }
          src={SignInImg}
        />
      </Flex>
    </Stack>
  );
}