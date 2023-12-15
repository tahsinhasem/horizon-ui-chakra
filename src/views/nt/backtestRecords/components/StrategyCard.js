import React, { Component } from 'react';   //import React Component
import { Box, Heading, Text, Link} from "@chakra-ui/react";
import Card from "components/card/Card";
import { Link as ReachLink } from "@reach/router"

export default function StrategyCard(props){
    
    const {strategyName, setStrategyID, id, successRate, dateCreated, strategyDescription, annualizedROR} = props;
    
    return (
        <Card margin={5}>

            <Link onClick={() => (setStrategyID(id))}>
                <Box>
                    <Heading >{strategyName}</Heading>
                    <Text>{id}</Text>
                    <Text>{strategyDescription}</Text>
                    <Text>Date Created: {dateCreated}</Text>
                    <Text>Success Rate: {Math.round(100 * 100 * successRate)/100}%</Text>
                    <Text>Annualized ROR: {Math.round(100 * 100 * annualizedROR)/100}%</Text>
                </Box>
            </Link>

        </Card>
    );
}