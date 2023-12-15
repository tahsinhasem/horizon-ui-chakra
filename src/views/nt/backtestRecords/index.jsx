//generate boilerpalte code
import React, { Component } from 'react';   //import React Component
import { Box, Heading, Text} from "@chakra-ui/react";
import StrategyCard from 'views/nt/backtestRecords/components/StrategyCard';

import strategiesData from "views/nt/backtestRecords/variables/strategylist.json"
import DetailsView from 'views/nt/backtestRecords/DetailsView';
import StrategyView from 'views/nt/backtestRecords/StrategyView';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {useState, useEffect} from 'react';

export default function BacktestRecords(){
    
    const [tabIndex, setTabIndex] = useState(0)
    const [strategyID, setStrategyID] = useState(0)

    useEffect(() => {
        setTabIndex(0)
    }, [])

    useEffect(() => {

        //fetch for data here, then change the tab index to 1.


        setTabIndex(1)
    }, [strategyID])

    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>

            <Tabs index={tabIndex} onChange={setTabIndex}>
                <TabList>
                    <Tab>Strategies</Tab>
                    <Tab>Details</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <StrategyView setStrategyID={setStrategyID}/>
                    </TabPanel>
                    <TabPanel>
                        <DetailsView strategyID={strategyID}/>
                    </TabPanel>
                </TabPanels>
            </Tabs>

        </Box>
    );
}