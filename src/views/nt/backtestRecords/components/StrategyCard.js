import React, { Component } from 'react';   //import React Component
import { Box, Stat, StatLabel, StatNumber, StatHelpText, CircularProgressLabel, CircularProgress, Divider, Grid, Heading, Text, Link, IconButton, Icon, Tooltip, ButtonGroup, GridItem, Flex} from "@chakra-ui/react";
import Card from "components/card/Card";
import { Link as ReachLink } from "@reach/router"
import { MdArrowForward, MdDownload, MdContentCopy, MdDelete } from 'react-icons/md';





export default function StrategyCard(props){
    
    const {setStrategyID, currentStrategyId, changeTab, strategy} = props;
    
    const {id, name, date_created, description, backtest_start_date, backtest_end_date} = strategy;


    const successRate = strategy.stats.success_rate
    const trades = strategy.stats.trades
    const symbols_list = Object.keys(strategy.symbols)

    let avg_cagr = 0
    for (const symbol in strategy.symbols){
        avg_cagr += strategy.symbols[symbol].cagr
    }
    avg_cagr /= symbols_list.length
    console.log(avg_cagr)
    

    const stats = (
        <Grid justifyItems={"center"}  templateColumns="repeat(2,1fr)">
        
        <GridItem>                      
            <Stat>
                <StatLabel>Annual Avg CAGR</StatLabel>
                <StatNumber>{Math.round(100 * 100 * avg_cagr)/100}%</StatNumber>
                <StatHelpText>Over {symbols_list.length} Stocks, {trades} trades</StatHelpText>
            </Stat>
        </GridItem>
        
        <GridItem>
            <Tooltip label="Success Rate">
                <Box>
                    <CircularProgress value={successRate * 100} color="green.500" size="100px" thickness="10px">
                        <CircularProgressLabel fontSize="sm" color="gray.500">
                            {Math.round(100 * 100 * successRate)/100}%
                        </CircularProgressLabel>
                    </CircularProgress>
                </Box>
            </Tooltip>
        </GridItem>
    
    </Grid> 
    )

    const buttons = (

        <Flex justifyContent={'space-between'} marginTop={5}>
            
        <ButtonGroup flexDirection={'row'} justifyContent={'left'}>

            <Tooltip label="Delete (unimplemented)" aria-label="Delete strategy">
                <IconButton
                    variant='solid'
                    colorScheme='brandScheme'
                    aria-label='Delete strategy'
                    onClick={() => {
                        console.log("Implement Delete for ", id)
                    }}
                    icon={<MdDelete/>}
                />
            </Tooltip>

            <Tooltip label="Duplicate (unimplemented)" aria-label="Delete strategy">
                <IconButton
                    variant='solid'
                    colorScheme='brandScheme'
                    aria-label='Duplicate strategy'
                    onClick={() => {
                        console.log("Implement Duplicate for ", id)
                    }}
                    icon={<MdContentCopy/>}
                />
            </Tooltip>
            
            <Tooltip label="Download (unimplemented)" aria-label="Delete strategy">
                <IconButton
                    variant='solid'
                    colorScheme='brandScheme'
                    aria-label='Download strategy'
                    onClick={() => {
                        console.log("Implement Download for ", id)
                    }}
                    icon={<MdDownload/>}
                />
            </Tooltip>
            
        </ButtonGroup>

        <Tooltip label="Details">
        <IconButton 
            variant='solid'
            colorScheme='brandScheme'
            aria-label='Go to strategy details page'
            onClick={() => {
                        setStrategyID(id)
                        changeTab()
            }}
            icon={<MdArrowForward/>}
        />
        </Tooltip>



        </Flex>
    )

    return (
        <Card margin={5}>

                <Box>

                    <Heading >{name}</Heading>

                    <Flex justifyContent={'space-between'}>
                        <Text fontSize="xs" color="gray.300">{date_created}, ID: {id}</Text>
                        <Text fontSize="xs" color="gray.300">From {backtest_start_date} to {backtest_end_date}</Text>
                    </Flex>

                    <Divider/>


                    <Grid marginTop={2} templateColumns="repeat(6,1fr)">

                        <GridItem colSpan={4}>
                            <Text noOfLines={2}>{description}</Text>
                        </GridItem>

                        <GridItem colSpan={2}>
                            
                            {stats}

                        </GridItem>

                    </Grid>

                    {buttons}

                </Box>

        </Card>
    );
}