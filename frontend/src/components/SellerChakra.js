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

export default function WithBackgroundImage() {
  return (
    <Flex
      w={'full'}
      h={'100vh'}
      >
      <VStack
        w={'full'}
        justify={'center'}
        px={{ base: 4, sm: 6, md: 8, lg: 10 }}
        bgGradient={'linear(to-r, blackAlpha.600, transparent)'}>
        <Stack maxW={'2xl'} align={'flex-start'} spacing={[2,4,6]}>
          <Heading 
            color={'white'}
            fontSize={{ base: '2xl', sm: '3xl', md: '4xl', xl: '4xl' }} 
            // textAlign={'center'}
            >
            Hi seller!
          </Heading>
          <Heading
            color={'white'}
            fontWeight={700}
            lineHeight={1.2}
            fontSize={{ base: '2xl', sm: '3xl', md: '4xl', xl: '4xl' }}>
            Choose what you want to do
          </Heading>
          <Stack direction={{base: 'column', md: 'row'}} spacing={[2,4,6,8]}>
            <Button
              fontSize={{base:'sm', sm: 'sm', md: 'md', lg: 'lg'}}
              width={'auto'}
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
              fontSize={{base:'sm', sm: 'sm', md: 'md', lg: 'lg'}}
              width={'auto'}
              fontWeight={600}
              color={'white'}
              bg={'#774BCD'}
              _hover={{
                bg: '#C7A1FE',
              }}>
              <Link as={ReachLink} to='/publish'>
                Publish item
              </Link>
            </Button>
            <Button
              fontSize={{base:'sm', sm: 'sm', md: 'md', lg: 'lg'}}
              width={'auto'}
              fontWeight={600}
              color={'white'}
              bg={'#774BCD'}
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