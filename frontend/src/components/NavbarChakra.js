import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { Link as ReachLink } from "react-router-dom";
import { useState, useEffect } from 'react';
import {useTranslation} from 'react-i18next';
import { t } from 'i18next';
import Currency from '../components/Currency'




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

  if (user !== null) {
    console.log("user is "+user.id);
    console.log("user role is "+user.userType);
  }
  
  let signInDisplay = 'none'
  let signOutDisplay = 'flex'

  if (user === null) {
    signInDisplay = 'flex'
    signOutDisplay = 'none'
  }


export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();
  const [pageRef, setPageRef] = useState('/signin');
  const {t} = useTranslation();
 

  useEffect(() => {
  if (user !== null) {
    if (user.userType === 'seller') {
      setPageRef('/seller');
    } else if (user.userType === 'buyer') {
      setPageRef('/buyer');
    } else if (user.userType === 'operator') {
      setPageRef('/operator');
    } 
  } else {
    setPageRef('/signin');
  }

  console.log(pageRef);
},[pageRef]);

  //----------for sign out----------
  const logOut = () => {
    console.log("you logged out");
    window.localStorage.removeItem(STORAGE_KEY)
    token = null
    signInDisplay = 'flex'
    signOutDisplay = 'none' 
    user = null;
    setPageRef('/signin');
  }
  //--------------------------------

  return (
    <Box position={'sticky'}top={0}right={0}left={0} zIndex={50}>
      <Flex
        bgGradient='linear(to-b, #EB3757, #F0884F)'
        //bgGradient='linear(to-b, gray.300, yellow.400, pink.200)'
        //bg={useColorModeValue('white', 'gray.800')}
        color='white'
        //color={useColorModeValue('white', 'white')}
        minH={'40px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={'none'}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text as='i' fontWeight={'bold'}
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('white', 'white')}>
            <Link as={ReachLink} to='/'>
              {t('f-f-auction')}
            </Link>
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav pageRef={pageRef} />
          </Flex>
        </Flex>

        <Stack display={signInDisplay}
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          <Button
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            size={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'#774BCD'}
            //href={'#'}
            _hover={{
              bg: '#C7A1FE',
            }}>
            <Link as={ReachLink} to='/signin'>
              {t('sign-in')}
            </Link>
          </Button>
          <Button
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            size={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'#774BCD'}
            //href={'#'}
            _hover={{
              bg: '#C7A1FE',
            }}>
            <Link as={ReachLink} to='/signup'>
              {t('sign-up')}
            </Link>
          </Button>
        </Stack>
        <Stack display={signOutDisplay}
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          <Button
            onClick={logOut}
            size={'sm'}
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'#774BCD'}
            //href={'#'}
            _hover={{
              bg: '#C7A1FE',
            }}>
            <Link as={ReachLink} to='/'>
              {t('sign-out')}
            </Link>
          </Button>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav pageRef={pageRef} signInDisplay={signInDisplay} signOutDisplay={signOutDisplay} />
        <Flex
        ml={4}
        py={2}
        as={Link}
        href={'/'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        <Text
          onClick={logOut}
          display={signOutDisplay}
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}>
          {'Sign Out'}
        </Text>
      </Flex>
      </Collapse>
    </Box>
  );
}

const DesktopNav = (props) => {
  const linkColor = useColorModeValue('white', 'white');
  const linkHoverColor = useColorModeValue('gray.800', 'gray.800');
  //const popoverContentBgColor = useColorModeValue('gray.800', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
        <Box key={'actions'}>
        <Popover trigger={'hover'} placement={'bottom-start'}>
          <PopoverTrigger>
            <Link
              as={ReachLink}
              p={2}
              to={props.pageRef}
              fontSize={'sm'}
              fontWeight={500}
              color={linkColor}
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor,
              }}>
                {t('signed-in-actions')}
            </Link>
          </PopoverTrigger>
        </Popover>
      </Box>
      <Box key={'view'}>
        <Popover trigger={'hover'} placement={'bottom-start'}>
          <PopoverTrigger>
            <Link
              as={ReachLink}
              p={2}
              to={'/view'}
              fontSize={'sm'}
              fontWeight={500}
              color={linkColor}
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor,
              }}>
                {t('view-items')}
            </Link>
          </PopoverTrigger>
        </Popover>
      </Box>
      <Box key={'home'}>
        <Popover trigger={'hover'} placement={'bottom-start'}>
          <PopoverTrigger>
            <Link
              as={ReachLink}
              p={2}
              to={'/'}
              fontSize={'sm'}
              fontWeight={500}
              color={linkColor}
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor,
              }}>
                {t('home')}
            </Link>
          </PopoverTrigger>
        </Popover>
      </Box>
      {/* ))} */}
    </Stack>
  );
};



const MobileNav = (props) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}>
        <MobileNavItem key={'actions'} label={t('signed-in-actions')} href={props.pageRef} itemDisplay={'flex'} />
        <MobileNavItem key={'view'} label={t('view-items')} href={'/view'} itemDisplay={'flex'} />
        <MobileNavItem key={'home'} label={t('home')} href={'/'} itemDisplay={'flex'} />
        <MobileNavItem key={'signin'} label={'Sign in'} href={'/signin'} itemDisplay={props.signInDisplay} />
        <MobileNavItem key={'signup'} label={'Sign up'} href={'/signup'} itemDisplay={props.signInDisplay} />
    </Stack>
  );
};

const MobileNavItem = ({ label, href, itemDisplay }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        <Text
          display={itemDisplay}
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
        </Stack>
      </Collapse>
    </Stack>
  );
};

