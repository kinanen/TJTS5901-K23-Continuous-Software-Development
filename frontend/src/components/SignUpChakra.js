import {
    Button,
    Flex,
    Box,
    FormControl,
    FormLabel,
    Image,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Heading,
    Text,
    useColorModeValue,
    Link,
    Select,
    Checkbox, 
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
  import { Link as ReachLink } from "react-router-dom";
  import SignUpImg from "../images/signup.jpg";
  import { useTranslation } from 'react-i18next';

  import axios from 'axios';
  const baseUrl = '/api/users';

  
  const login = async credentials => {
    console.log(credentials);
    const response = await axios.post(baseUrl, credentials)
    console.log(response.data);
    return response.data
  }
  
  export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [fname, setFname] = useState('');
    const fnameUpdate = (event) => setFname(event.target.value);
    const [lname, setLname] = useState('');
    const lnameUpdate = (event) => setLname(event.target.value);
    const [email, setEmail] = useState('');
    const emailUpdate = (event) => setEmail(event.target.value);
    const [password, setPassword] = useState('');
    const passwordUpdate = (event) => setPassword(event.target.value);
    const [userType, setUserType] = useState('buyer');
    const userTypeUpdate = (event) => setUserType(event.target.value);

    //--------------------------- ************** ----------------------------------
  const handleSubmit = (event) => { // Once the form has been submitted, this function will post to the backend
    event.preventDefault();

    const newuser = {
      email: email,
      firstName: fname,
      surname: lname,
      userType: userType,
      password: password
    };

    login(newuser);
  }
    const { t } = useTranslation();
    return (
      <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
        <Flex p={8} flex={1} align={'center'} justify={'center'}>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              {t('sign-up')}
            </Heading>
            <Text fontSize={'lg'} color={'gray.600'} textAlign={'center'} pb={8}>
              {t('sign-up-text')}
              </Text>
            <form onSubmit={handleSubmit}>  
              <Stack spacing={4}>
                <HStack>
                  <Box>
                    <FormControl id="firstName" isRequired>
                      <FormLabel>{t('fname')}</FormLabel>
                      <Input type="text" onChange={fnameUpdate}/>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="lastName" isRequired>
                      <FormLabel>{t('lname')}</FormLabel>
                      <Input type="text" onChange={lnameUpdate} />
                    </FormControl>
                  </Box>
                </HStack>
                <FormControl id="email" isRequired>
                  <FormLabel>{t('email')}</FormLabel>
                  <Input type="email" onChange={emailUpdate} />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>{t('password')} </FormLabel>
                  <InputGroup>
                    <Input type={showPassword ? 'text' : 'password'} onChange={passwordUpdate} />
                    <InputRightElement h={'full'}>
                      <Button
                        variant={'ghost'}
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }>
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel>{t('user-type')}</FormLabel>
                    <Select onChange={userTypeUpdate}>
                      <option value="buyer">{t('buyer')}</option>
                      <option value="seller">{t('seller')}</option>
                      <option value="operator">{t('operator')}</option>
                    </Select>
                </FormControl>
                <FormControl>
                  <Checkbox defaultChecked>
                    {t('agree')}<Link color={'blue.400'} as={ReachLink} to='/tandc'> {t('terms-and-conditions')} </Link>
                    </Checkbox>
                </FormControl>
                <Stack spacing={10} pt={2}>
                  <Button
                    type='submit'
                    loadingText="Submitting"
                    size="lg"
                    bg={'#774BCD'}
                    color={'white'}
                    _hover={{
                      bg: '#C7A1FE',
                    }}>
                    {t('sign-up')}
                  </Button>
                </Stack>
                <Stack pt={6}>
                  <Text align={'center'}>
                    {t('already-registred')} <Link color={'blue.400'} as={ReachLink} to='/signin'>{t('sign-in')}</Link>
                  </Text>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Flex>
        <Flex flex={1}>
          <Image
            alt={'Login Image'}
            objectFit={'cover'}
            // src={
            //   'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
            // }
            src={SignUpImg}
          />
        </Flex>
      </Stack>
    );
  }