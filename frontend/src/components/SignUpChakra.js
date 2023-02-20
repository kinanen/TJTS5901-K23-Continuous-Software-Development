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
    Alert,
    AlertIcon,
    AlertDescription,
    CloseButton,
    AlertDialog, 
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogBody,
    AlertDialogFooter,
    useDisclosure,
    Divider,
    Icon,
  } from '@chakra-ui/react';
  import { useState, useRef } from 'react';
  import { ViewIcon, ViewOffIcon, CheckIcon } from '@chakra-ui/icons';
  import { Link as ReachLink } from "react-router-dom";
  import SignUpImg from "../images/signup.jpg";

  import axios from 'axios';
  const baseUrl = '/api/users';

  
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

    const [alertStatus, setAlertStatus] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');
    const [display, setDisplay] = useState('none');

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    const login = async credentials => {
      console.log(credentials);
      try{
        const response = await axios.post(baseUrl, credentials);
        console.log(response.data);
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

    const redirect = () => {
      window.location.href = '/'
    }

    const closeAlert = () => {
      if (alertStatus === "success") {
      //setDisplay('none');
        redirect();
      } else {
      setDisplay('none');
      }
    }

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

    return (
      <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
        <Flex p={8} flex={1} align={'center'} justify={'center'}>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Alert display={display} status={alertStatus}>
              <AlertIcon />
              {/* <AlertTitle mr={2}>{alertTitle}</AlertTitle> */}
              <AlertDescription mr={2}>{alertMessage}</AlertDescription>
              <CloseButton onClick={closeAlert} />
            </Alert>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Sign up
            </Heading>
            <Text fontSize={'lg'} color={'gray.600'} textAlign={'center'} pb={8}>
              to enjoy all of our cool features
              </Text>
            <form onSubmit={handleSubmit}>  
              <Stack spacing={4}>
                <HStack>
                  <Box>
                    <FormControl id="firstName" isRequired>
                      <FormLabel>First Name</FormLabel>
                      <Input type="text" onChange={fnameUpdate}/>
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl id="lastName" isRequired>
                      <FormLabel>Last Name</FormLabel>
                      <Input type="text" onChange={lnameUpdate} />
                    </FormControl>
                  </Box>
                </HStack>
                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input type="email" onChange={emailUpdate} />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
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
                  <FormLabel>User type</FormLabel>
                    <Select onChange={userTypeUpdate}>
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                    </Select>
                </FormControl>
                <FormControl>
                  <Checkbox required>I agree to <Link color={'blue.400'} onClick={onOpen}>terms and conditions</Link></Checkbox>
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
                    Sign up
                  </Button>
                </Stack>
                <Stack pt={6}>
                  <Text align={'center'}>
                    Already a user? <Link color={'blue.400'} as={ReachLink} to='/signin'>Login</Link>
                  </Text>
                </Stack>
              </Stack>
            </form>
          </Box>
          <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize={{base: 'sm', sm: 'sm', md: 'md', xl: 'lg'}} fontWeight='bold'>
              Terms and Conditions
            </AlertDialogHeader>
            <AlertDialogBody fontSize={{base: 'sm', sm: 'sm', md: 'md', xl: 'lg'}}>
              <Text fontWeight='bold'>Scope and Introduction</Text>
              <HStack>
              <Icon color={'green'} as={CheckIcon} />
              <Text >'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.'</Text>
              </HStack>
              
              <Divider size={'lg'} borderColor={'#774BCD'}></Divider>
              <Text fontWeight='bold'>Eligibility</Text>
              <HStack>
              <Icon color={'green'} as={CheckIcon} />
              <Text>'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.'</Text>
              </HStack>
              <Divider size={'lg'} borderColor={'#774BCD'}></Divider>
              <Text fontWeight='bold'>Registration and Sale</Text>
              <HStack>
              <Icon color={'green'} as={CheckIcon} />
              <Text>'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.'</Text>
              </HStack>
              <Divider size={'lg'} borderColor={'#774BCD'}></Divider>
              <Text fontWeight='bold'>Listing Conditions</Text>
              <HStack>
              <Icon color={'green'} as={CheckIcon} />
              <Text>'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.'</Text>
              </HStack>
              <Divider size={'lg'} borderColor={'#774BCD'}></Divider>
              <Text fontWeight='bold'>Fees</Text>
              <HStack>
              <Icon color={'green'} as={CheckIcon} />
              <Text>'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.'</Text>
              </HStack>
              <Divider size={'lg'} borderColor={'#774BCD'}></Divider>
              <Text fontWeight='bold'>Privacy</Text>
              <HStack>
              <Icon color={'green'} as={CheckIcon} />
              <Text >'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.'</Text>
              </HStack>
              <Divider size={'lg'} borderColor={'#774BCD'}></Divider>
              <Text fontWeight='bold'>....</Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='green' onClick={onClose} ml={3}>
                I agree
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
        </Flex>
        <Flex flex={1}>
          <Image
            alt={'Login Image'}
            objectFit={'cover'}
            src={SignUpImg}
          />
        </Flex>
      </Stack>
    );
  }