//generate boilerpalte code
import React, { Component } from 'react';   //import React Component
import { Box, Heading, Text} from "@chakra-ui/react";
import StrategyCard from 'views/nt/backtestRecords/components/StrategyCard';

import strategiesData from "views/nt/backtestRecords/variables/strategylist.json"

export default function BacktestRecords(props){
    const {setStrategyID} = props;
    return (
        <Box >

            {strategiesData.map((strategy) => (
                <StrategyCard setStrategyID={setStrategyID} strategyName={strategy.name} id={strategy.id} annualizedROR={strategy.annualizedROR} successRate={strategy.successRate}/>
            ))}

        </Box>
    );
}