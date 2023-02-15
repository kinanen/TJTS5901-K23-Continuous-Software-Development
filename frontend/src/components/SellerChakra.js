import {
  Stack,
  Heading,
  Flex,
  Button,
  VStack,
  useBreakpointValue,
  Link,
} from '@chakra-ui/react';
import { Link as ReachLink } from "react-router-dom";
import Crowd from "../images/confetti.jpg";

export default function WithBackgroundImage() {
  return (
    <Flex
      w={'full'}
      h={'100vh'}
      // backgroundImage={Crowd}
      // backgroundSize={'cover'}
      // backgroundPosition={'center center'}
      // opacity={0.7}
      >
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
            Hi seller!
          </Heading>
          <Heading
            color={'white'}
            fontWeight={700}
            lineHeight={1.2}
            fontSize={useBreakpointValue({ base: '2xl', md: '3xl' })}>
            Choose what you want to do
          </Heading>
          <Stack direction={'row'} spacing={8}>
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
              <Link as={ReachLink} to='/view'>
                View Items
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
              <Link as={ReachLink} to='/publish'>
                Publish item
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
              <Link as={ReachLink} to='/profile'>
                View profile
              </Link>
            </Button>
          </Stack>
        </Stack>
      </VStack>
    </Flex>
  );
}