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
import { useState } from 'react';
import {useTranslation} from 'react-i18next';



  let token = null
  const STORAGE_KEY = 'loggedAuctionAppUser'
  
  const getUser = () => {
    const loggedUserJSON = window.localStorage.getItem(STORAGE_KEY)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      token = user.token
      return user;
    }
    return null;
  }
  

  let user = getUser();

  if (user ===! null) {
    console.log("user is "+user.id);
    console.log("user role is "+user.userType);
  }
  
  let signInDisplay = 'none'
  let signOutDisplay = 'flex'

  if (user === null) {
    signInDisplay = 'flex'
    signOutDisplay = 'none'
  }

  let pageRef = '/';
  if (user ===! null) {
    if (user.userType === 'seller') {
      console.log("Selleri oli: "+user.userType);
      pageRef = '/seller';
    } else if (user.userType === 'buyer') {
      console.log("Baijeri oli: "+user.userType);
      pageRef = '/buyer';
    } else if (user.userType === 'operator') {
      console.log("Operaattori oli: "+user.userType);
      pageRef = '/operator';
    }
    console.log(pageRef);
  }

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();
  const {t} = useTranslation();

  return (
    <Box>
      <Flex
        bgGradient='linear(to-b, #EB3757, #F0884F)'
        //bgGradient='linear(to-b, gray.300, yellow.400, pink.200)'
        //bg={useColorModeValue('white', 'gray.800')}
        color='white'
        //color={useColorModeValue('white', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
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
            <DesktopNav />
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
        <Stack display={signOutDisplay}
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          <Button
            // onClick={setUser(null)}
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
              Sign Out
            </Link>
          </Button>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('white', 'white');
  const linkHoverColor = useColorModeValue('gray.800', 'gray.800');
  //const popoverContentBgColor = useColorModeValue('gray.800', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
      {/* {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                as={ReachLink}
                p={2}
                to={navItem.href}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}>
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}>
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box> */}
        <Box key={'actions'}>
        <Popover trigger={'hover'} placement={'bottom-start'}>
          <PopoverTrigger>
            <Link
              as={ReachLink}
              p={2}
              to={pageRef}
              fontSize={'sm'}
              fontWeight={500}
              color={linkColor}
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor,
              }}>
              Signed in Actions
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
              View items
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
              Home
            </Link>
          </PopoverTrigger>
        </Popover>
      </Box>
      {/* ))} */}
    </Stack>
  );
};

/* const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      as={ReachLink}
      to={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.40', 'gray.900') }}>
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}>
            {label}
          </Text>
          <Text
            fontSize={'sm'}
            color={'white'}
            _hover={{ color: 'pink.400' }}
          >{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}>
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
}; */

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}>
      {/* {NAV_ITEMS.map((navItem) => ( */}
        <MobileNavItem key={'actions'} label={'Signed in Actions'} href={pageRef} />
        <MobileNavItem key={'view'} label={'View items'} href={'/view'} />
        <MobileNavItem key={'home'} label={'Home'} href={'/'} />
      {/* // ))} */}
    </Stack>
  );
};

const MobileNavItem = ({ label, href }) => {
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
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {/* {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )} */}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {/* {children &&
            children.map((child) => (
              <Link as={ReachLink} key={child.label} py={2} to={child.href}>
                {child.label}
              </Link>
            ))} */}
        </Stack>
      </Collapse>
    </Stack>
  );
};

/* console.log(pageRef);

const NAV_ITEMS = [
  {
    label: 'View Items',
    href: '/view'
/*     children: [
      {
        label: 'Item List',
        subLabel: 'Find your dream item',
        href: '/view',
      },
/*       {
        label: 'Blaa blaa',
        subLabel: 'An exclusive list of items',
        href: '#',
      }, */
    // ],
/*   },
  {
    label: 'Actions',
    href: {pageRef}
  },
]; */