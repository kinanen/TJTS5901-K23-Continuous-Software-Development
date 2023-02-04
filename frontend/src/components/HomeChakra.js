import {
  Stack,
  Flex,
  Button,
  Text,
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
      backgroundImage={Crowd}
      backgroundSize={'cover'}
      backgroundPosition={'center center'}>
      <VStack
        w={'full'}
        justify={'center'}
        px={useBreakpointValue({ base: 4, md: 8 })}
        bgGradient={'linear(to-r, blackAlpha.600, transparent)'}>
        <Stack maxW={'2xl'} align={'flex-start'} spacing={6}>
          <Text
            color={'white'}
            fontWeight={700}
            lineHeight={1.2}
            fontSize={useBreakpointValue({ base: '3xl', md: '4xl' })}>
            Lorem ipsum dolor sit amet consectetur adipiscing elit sed do
            eiusmod tempor
          </Text>
          <Stack direction={'row'}>
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
        </Stack>
      </VStack>
    </Flex>
  );
}