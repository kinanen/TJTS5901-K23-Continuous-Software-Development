import {
  Stack,
  Heading,
  Flex,
  Button,
  Text,
  VStack,
  useBreakpointValue,
  Link,
} from '@chakra-ui/react';
import { Link as ReachLink } from "react-router-dom";
import Crowd from "../images/confetti.jpg";
import { useTranslation} from 'react-i18next';
import i18n from '../i18n/config';

let token = null
  const STORAGE_KEY = 'loggedAuctionAppUser'
  
  const getUser = () => {
    const loggedUserJSON = window.localStorage.getItem(STORAGE_KEY)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      if (user !== null) {
        token = user.token
        return user;
      }
    }
    return null;
  }
  

  let user = getUser();

  console.log("Welcome to homepage, user is :"+user);

  if (user ===! null) {
    console.log("user is "+user.id);
    console.log("user role is "+user.userType);
  }

  // this is missing signInDisplay--> flex when user logs out
  let signInDisplay = 'none'
  let signOutDisplay = 'flex'

  if (user === null) {
    signInDisplay = 'flex'
    signOutDisplay = 'none'
  }



export default function WithBackgroundImage() {
  const { t, i18n } = useTranslation();
  return (
    <Flex
      w={'full'}
      h={'100vh'}
      backgroundImage={Crowd}
      backgroundSize={'cover'}
      backgroundPosition={'center center'}>
      <VStack
        w={'full'}
        justify={'center'}
        px={useBreakpointValue({ base: 4, md: 8 })}
        bgGradient={'linear(to-r, blackAlpha.600, transparent)'}>
        <Stack maxW={'2xl'} align={'flex-start'} spacing={6}>
          <Heading 
            color={'white'}
            fontSize={useBreakpointValue({ base: '3xl', md: '4xl' })} 
            // textAlign={'center'}
            >
              {t('welcome-message')}
            Welcome to Fast and Furious Auction system!
          </Heading>
          <Heading
            color={'white'}
            fontWeight={700}
            lineHeight={1.2}
            fontSize={useBreakpointValue({ base: '2xl', md: '3xl' })}>
            This is where you can sell <Text as="span">FAST </Text> 
            and buy without getting <Text as="span">FURIOUS</Text>.
          </Heading>
          <Text
            color={'white'}
            fontWeight={700}
            lineHeight={1.2}
            fontSize={useBreakpointValue({ base: '2xl', md: '3xl' })}> 
            Everything should happen within 24 hours.
          </Text>
          <Stack direction={'row'} display={signInDisplay}>
            <Button
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize={'sm'}
              width={'100px'}
              fontWeight={600}
              color={'white'}
              bg={'#774BCD'}
              //href={'#'}
              _hover={{
                bg: '#C7A1FE',
              }}>
              <Link as={ReachLink} to='/signin'>
                Sign In
              </Link>
            </Button>
            <Button
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize={'sm'}
              width={'100px'}
              fontWeight={600}
              color={'white'}
              bg={'#774BCD'}
              //href={'#'}
              _hover={{
                bg: '#C7A1FE',
              }}>
              <Link as={ReachLink} to='/signup'>
                Sign Up
              </Link>
            </Button>
          </Stack>
          {/* <Stack direction={'row'} display={signOutDisplay}>
            <Button
              onClick={logOut}
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize={'sm'}
              width={'100px'}
              fontWeight={600}
              color={'white'}
              bg={'#774BCD'}
              //href={'#'}
              _hover={{
                bg: '#C7A1FE',
              }}>
              <Link as={ReachLink} to='/'>
                Sign Out
              </Link>
            </Button>
          </Stack> */}
        </Stack>
      </VStack>
    </Flex>
  );
}