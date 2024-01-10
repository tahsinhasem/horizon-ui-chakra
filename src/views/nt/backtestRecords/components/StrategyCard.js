import React, { Component } from 'react';   //import React Component
import { Box, Stat, StatLabel, StatNumber, StatHelpText, CircularProgressLabel, CircularProgress, Divider, Grid, Heading, Text, Link, IconButton, Icon, Tooltip, ButtonGroup, GridItem, Flex} from "@chakra-ui/react";
import Card from "components/card/Card";
import { MdArrowForward, MdDownload, MdContentCopy, MdDelete } from 'react-icons/md';
import Papa from 'papaparse';
import useAxios from 'utils/useAxios';



export default function StrategyCard(props){
    
    const api = useAxios();

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


    function handleDelete(id){
        api
        .delete("/api/records/backtests/" + id)
        .then(res=> {
            console.log("successfully deleted")
            window.location.reload();
        })
        .catch(err => console.log(err))
    }


    function handleDuplicate(id){
        api
        .get("/api/records/backtests/" + id)
        .then(res=>{
            return res.data
        })
        .then( res=> {
            return api.post("/api/records/orders/batch",
            {
                backtest: {
                  backtest_start_date: res.backtest.backtest_start_date,
                  backtest_end_date: res.backtest.backtest_end_date,
                  name: res.backtest.name,
                  description: res.backtest.description,
                  notes: res.backtest.notes,
                  reference_id: res.backtest.reference_id
                },
                orders: res.orders
              })
        })
        .then(res=>{
            window.location.reload();
        })
        .catch(err=>console.log(err))
    }
    

    function handleDownload(id){
        api
        .get("/api/records/backtests/" + id)
        .then(res=>{
            console.log(res)
            return res.data
        })
        .then(res=>{
            const orders = res.orders
            const csv = Papa.unparse(orders);
            console.log(csv);

            // Create a Blob from the CSV string
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

            // Create a URL from the Blob
            const url = URL.createObjectURL(blob);

            // Create a link element that points to the URL
            const link = document.createElement('a');
            link.href = url;
            link.download = `${res.backtest.name}_${res.backtest.id}_orders.csv`;

            // Append the link to the body (required for Firefox)
            document.body.appendChild(link);

            // Simulate a click on the link
            link.click();

            // Remove the link from the body
            document.body.removeChild(link);
        })
    }


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

            <Tooltip label="Delete" aria-label="Delete strategy">
                <IconButton
                    variant='solid'
                    colorScheme='brandScheme'
                    aria-label='Delete strategy'
                    onClick={() => {
                       handleDelete(id)
                    }}
                    icon={<MdDelete/>}
                />
            </Tooltip>

            <Tooltip label="Duplicate" aria-label="Delete strategy">
                <IconButton
                    variant='solid'
                    colorScheme='brandScheme'
                    aria-label='Duplicate strategy'
                    onClick={() => {
                        handleDuplicate(id)
                    }}
                    icon={<MdContentCopy/>}
                />
            </Tooltip>
            
            <Tooltip label="Download" aria-label="Delete strategy">
                <IconButton
                    variant='solid'
                    colorScheme='brandScheme'
                    aria-label='Download strategy'
                    onClick={() => {
                        handleDownload(id)
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

    function getFormattedDate(dateStr){
        let date = new Date(dateStr);
        let year = date.getFullYear();
        let month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0 based. Add leading 0 and slice last 2 characters
        let day = ('0' + date.getDate()).slice(-2); // Add leading 0 and slice last 2 characters

        return `${year}-${month}-${day}`;
    }

    return (
        <Card marginY={5} boxShadow='lg'>

                <Box>

                    <Heading marginY={2}>{name}</Heading>

                    <Flex justifyContent={'space-between'}>
                        <div>
                            <Text fontSize="xs" color="gray.300">ID: {id}</Text>
                            <Text fontSize="xs" color="gray.300">Created: {date_created}</Text>
                        </div>
                        <Text fontSize="xs" color="gray.300">From {getFormattedDate(backtest_start_date)} to {getFormattedDate(backtest_end_date)}</Text>
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