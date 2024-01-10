//generate boilerpalte code
import React, { Component } from 'react';   //import React Component
import { Box, Heading, Text} from "@chakra-ui/react";
import StrategyCard from 'views/nt/backtestRecords/components/StrategyCard';
import Skel from "views/nt/backtestRecords/components/Skel";


export default function BacktestRecords(props){
    const {setStrategyID, changeTab, strategy} = props;
    const strategiesData = props.strategiesData;
    return (
        <Box >


            {strategiesData.length == 0 ?
                (
                    <div>
                        <Skel/>
                        <Skel/>
                        <Skel/>
                    </div>
                )
                :
                (
                    strategiesData.map((strategy) => (
                        <StrategyCard changeTab={changeTab} setStrategyID={setStrategyID} strategy={strategy}/>
                    ))                       
                )
            
            }

        </Box>
    );
}