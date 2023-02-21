
import {
    HStack,
    FormControl,
    FormLabel,
    Select,
    Flex,
    Center,
} from '@chakra-ui/react';
import {React, useState, useEffect} from 'react';

import axios from 'axios';

 

export default function Locals(props) {

    
    const updateLocals = (lang) => {
        
        console.log("language is now "+lang);
    }
    //props.saveRate('');
    //props.saveCurrency('');

return (

    // <Flex alignItems={'center'} textAlign={'right'} justifyContent={'right'} position={'sticky'}top={'60px'}left={0} zIndex={55} bg={'#F0884F'}>
        <form w={'100px'} /*onSubmit={handleSubmit}*/ display={'inline-flex'} mr={10}> 
            <FormControl>
                <Center>
                <FormLabel fontSize={'xs'} m={0} mr={1} p={0}>Language</FormLabel>
                <Select size="xs" onChange={updateLocals} mr={2}>
                    <option value='EN'>EN</option>
                    <option value='FI'>FI</option>
                    <option value='FR'>FR</option>
                </Select>
                </Center>
            </FormControl>
        </form>
    // </Flex>
    )
};
