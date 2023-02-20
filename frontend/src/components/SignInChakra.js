import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Box,
  Image,
  Text,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';

import SignInImg from "../images/signin.jpg";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
const baseUrl = '/api/login';


let token = null;
const STORAGE_KEY = 'loggedAuctionAppUser'

const setUser = (user) => {
  console.log(user)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  token = user.token  
}

  

export default function SignIn() {
  const {t} = useTranslation();
  const [email, setEmail] = useState('');
  const emailUpdate = (event) => setEmail(event.target.value);
  const [password, setPassword] = useState('');
  const passwordUpdate = (event) => setPassword(event.target.value);
  const [userType, setUserType] = useState('buyer');
  const userTypeUpdate = (event) => setUserType(event.target.value);

  //const [alertTitle, setAlertTitle] = useState('');
  const [alertStatus, setAlertStatus] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [display, setDisplay] = useState('none');

  const login = async credentials => {
    console.log(credentials);
    try{
      const response = await axios.post(baseUrl, credentials)
      console.log(response.data);
      setUser({email: response.data.email, userType: response.data.userType, id: response.data.id, token: response.data.token});
      //setDisplay('flex');
      //setAlertStatus('success');
      //setAlertTitle('Success!');
      //setAlertMessage("Your login was successful");
      redirect();
      return response.data;
    } catch(error) {
      console.log(error.response.data.error);
      setDisplay('flex');
      setAlertStatus('error');
      // setAlertTitle('Error!');
      setAlertMessage(error.response.data.error);
    }
  }

  const closeAlert = () => {
    if (alertStatus === "success") {
      //setDisplay('none');
      redirect();
    } else {
      setDisplay('none');
    }
  }

  const redirect = () => {
    if (userType === 'seller') {
      window.location.href = '/seller'
    } else if (userType === 'operator') {
    window.location.href = '/operator'
  } else if (userType === 'buyer') {
    window.location.href = '/buyer'
  } else {
    window.location.href = '/'
  }
 }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const credentials = {
      email: email,
      password: password,
      userType: userType
    };

    login(credentials);
    

  }

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Box
          rounded={'lg'}
          bg={'white'}
          boxShadow={'lg'}
          p={8}>
          <Alert display={display} status={alertStatus}>
            <AlertIcon />
            {/* <AlertTitle mr={2}>{alertTitle}</AlertTitle> */}
            <AlertDescription mr={2}>{alertMessage}</AlertDescription>
            <CloseButton onClick={closeAlert} />
          </Alert>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            {t('sign-in')}
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'} textAlign={'center'} pb={8}>
            {t('to-your-account')}
          </Text>
          <Stack spacing={4}>
            <form onSubmit={handleSubmit}>
              <FormControl id="email" isRequired>
                <FormLabel>{t('email')}</FormLabel>
                <Input type="email" onChange={emailUpdate} />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>{t('password')}</FormLabel>
                <Input type="password" onChange={passwordUpdate} />
              </FormControl>
              <FormControl>
                <FormLabel>{t('user-type')}</FormLabel>
                <Select onChange={userTypeUpdate}>
                  <option value="buyer" >{t('buyer')}</option>
                  <option value="seller">{t('seller')}</option>
                  <option value="operator">{t('operator')}</option>
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
                  {t('sign-in')}
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
          src={SignInImg}
        />
      </Flex>
    </Stack>
  );
}