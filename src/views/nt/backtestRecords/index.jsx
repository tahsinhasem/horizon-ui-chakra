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
import useAxios from 'utils/useAxios';

export default function BacktestRecords(){
    
    const [tabIndex, setTabIndex] = useState(0)
    const [strategyID, setStrategyID] = useState(-1)
    const [strategiesData, setStrategiesData] = useState([])


    const api = useAxios();


    // utilites
    let stratsIntervalID = null;
    function getStrategiesData(){
        //fetch 
        api
        .get("/api/records/backtests")
        .then((response) => {
            setStrategiesData(response.data);
        })
        .catch((error) => {
            if (error.response.status === 401) {
                //this is habdled by the interceptor
                //alert('Unauthorized. Please log in again.');
                console.log(error);
            } else {
                alert(`Error Fetching Data. ${error.message}`);
                console.log(error);
            }
            
        })
    }


    useEffect(() => {
        if (tabIndex === 0){
            getStrategiesData()
        }
    }, [tabIndex])


    //Run on first run
    useEffect(() => {
        getStrategiesData()
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