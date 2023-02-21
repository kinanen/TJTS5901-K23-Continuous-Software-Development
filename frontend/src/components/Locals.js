
import {
    HStack,
    FormControl,
    FormLabel,
    Select,
    Flex,
    Center,
} from '@chakra-ui/react';
import {React, useState, useEffect} from 'react';
import i18next from 'i18next';

import axios from 'axios';

 

export default function Locals(props) {

    //props.saveRate('');
    //props.saveCurrency('');

    const changeLanguage = (selected) => {
        i18next.changeLanguage(selected.target.value); 
    }   

return (

    // <Flex alignItems={'center'} textAlign={'right'} justifyContent={'right'} position={'sticky'}top={'60px'}left={0} zIndex={55} bg={'#F0884F'}>
        <form w={'100px'} /*onSubmit={handleSubmit}*/ display={'inline-flex'} mr={10}> 
            <FormControl>
                <Center>
                <FormLabel fontSize={'xs'} m={0} mr={1} p={0}>Language</FormLabel>
                <Select size="xs" onChange={changeLanguage} mr={2}>
                    <option value='en'>EN</option>
                    <option value='fi'>FI</option>
                    <option value='fr'>FR</option>
                </Select>
                </Center>
            </FormControl>
        </form>
    // </Flex>
    )
};
