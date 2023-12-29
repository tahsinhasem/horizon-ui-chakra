//generate boilerpalte code
import React, { Component } from 'react';   //import React Component
import { Box, Heading, Text} from "@chakra-ui/react";
import StrategyCard from 'views/nt/backtestRecords/components/StrategyCard';

import strategiesData from "views/nt/backtestRecords/variables/strategylist.json"
import DetailsView from 'views/nt/backtestRecords/DetailsView';
import StrategyView from 'views/nt/backtestRecords/StrategyView';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {useState, useEffect} from 'react';
import data from "views/nt/backtestRecords/variables/strategylist.json"
import axios from 'axios';

export default function BacktestRecords(){
    
    const [tabIndex, setTabIndex] = useState(0)
    const [strategyID, setStrategyID] = useState(-1)
    const [strategiesData, setStrategiesData] = useState(data)

    const base_url = "http://127.0.0.1:8000"

    // utilites
    function getStrategiesData(){
        //fetch 
        axios
        .get(base_url + "/api/records/backtests")
        .then((response) => {
            console.log(response.data)
            setStrategiesData(response.data)
        })
        .catch((error) => {
            console.log(error)
        })

    }


    //Run on first run
    useEffect(() => {
        getStrategiesData()
        console.log("updates strategies")
    }, [])


    useEffect(() => {

        console.log("strategyID: " + strategyID)

        //fetch for data here, then change the tab index to 1.
        if (strategyID != -1){
            setTabIndex(1)
        }

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
                        <StrategyView changeTab={() => setTabIndex(1)} setStrategyID={setStrategyID} strategiesData={strategiesData}/>
                    </TabPanel>
                    <TabPanel>
                        <DetailsView strategyID={strategyID}/>
                    </TabPanel>
                </TabPanels>
            </Tabs>

        </Box>
    );
}