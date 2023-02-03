import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Icon,
    Text,
    Stack,
    HStack,
    VStack,
    Button,
    Link,
  } from '@chakra-ui/react';
  import { CheckIcon } from '@chakra-ui/icons';
  import { Link as ReachLink } from "react-router-dom";
  
  // Replace test data with your own
  const features = Array.apply(null, Array(8)).map(function (x, i) {
    return {
      id: i,
      title: 'Lorem ipsum dolor sit amet',
      text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.',
    };
  });
  
  export default function GridListWithHeading() {
    return (
      <Box p={4} h={'full'}>
        <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
          <Heading fontSize={'3xl'}>Terms and Conditions</Heading>
          <Text color={'gray.600'} fontSize={'xl'}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
            sed diam voluptua.
          </Text>
        </Stack>
  
        <Container maxW={'6xl'} mt={10} align={'center'}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            {features.map((feature) => (
              <HStack key={feature.id} align={'top'}>
                <Box color={'green.400'} px={2}>
                  <Icon as={CheckIcon} />
                </Box>
                <VStack align={'start'}>
                  <Text fontWeight={600}>{feature.title}</Text>
                  <Text color={'gray.600'}>{feature.text}</Text>
                </VStack>
              </HStack>
            ))}
          </SimpleGrid>
          <Button
            mt={8}
            loadingText="Submitting"
            size="lg"
            bg={'#774BCD'}
            color={'white'}
            _hover={{
                bg: '#C7A1FE',
            }}>
            <Link as={ReachLink} to='/signup'>I agree</Link>
            </Button>
        </Container>
      </Box>
    );
  }