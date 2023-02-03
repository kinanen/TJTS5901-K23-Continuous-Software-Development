import { VStack } from '@chakra-ui/react';
import React from 'react';
import CardChakra from './CardChakra';
import img3 from '../images/hammer.jpg'
import img4 from '../images/hammer.jpg'

// these should be read from the database, as json?
// then map all instances with below details, which will bse sent as props to collection page

function CardsChakra() {
    return (
        <VStack>
            <CardChakra 
                src={img3}
                header="Nice item for sale"
                text="Look at this nice item that is for sale"
                price="9.99"
                time="02:11"
                status="Active"
                label="Details"
                path="/details"
            />
            <CardChakra
                src={img4}
                header="Really nice item"
                text="Look at this really really nice item"
                price="29.99"
                time="13:13"
                status="Active"
                label="Details"
                path="/details"
            />
            <CardChakra 
                src={img4}
                header="Must have"
                text="You have to have this"
                price="99.99"
                time="12:11"
                status="Active"
                label="Details"
                path="/details"
            />
            <CardChakra 
                src={img4}
                header="Can't live without"
                text="You most certainly need this one"
                price="100.00"
                time="22:11"
                status="Active"
                label="Details"
                path="/details"
            />
        </VStack>
    );
}

export default CardsChakra;
