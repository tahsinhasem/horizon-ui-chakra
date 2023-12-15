import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React from "react";
import { MdSearch } from "react-icons/md";

export default function ColumnFiler({filter, setFilter}) {


    return(
        <Flex marginX={4} >
            <InputGroup size="sm" colorScheme="brandScheme" >
            
            <InputLeftElement pointerEvents="none" children={<MdSearch color="gray.300" />} />
            <Input colorScheme="brandScheme" borderRadius="16px" size="sm" placeholder="Search Symbol" value={filter || ''} onChange={e => setFilter(e.target.value)} />

            </InputGroup>
            
        </Flex>
    )


}