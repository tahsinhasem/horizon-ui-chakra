// Chakra imports
import { Box, SkeletonCircle, Skeleton, SkeletonText, Heading, Text, Button, GridItem, Grid, background} from "@chakra-ui/react";
import CardComp from "./components/NameCard";
import Description from "./components/Description";
import Card from "components/card/Card";
import Notes from "./components/Notes";
import OrdersTable from "./components/OrdersTable";
import React, { useEffect } from "react";
import SymbolsTable from "./components/SymbolsTable";
import { v4 } from "uuid";
import {ordersColumnsData} from "views/nt/backtestRecords/variables/ordersColumnsData.js";
import ordersData from "views/nt/backtestRecords/variables/ordersData.json";

import { columnsDataSymbols } from "views/nt/backtestRecords/variables/columnsData.js";
import tempData from "views/nt/backtestRecords/variables/tempData.json";

import CheckTable from "views/nt/backtestRecords/components/CheckTable";
import StatsCard from "./components/StatsCard";
import testing_data from "views/nt/backtestRecords/variables/testing_data.json";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import useAxios from "utils/useAxios";

export default function BackTestRecord(props) {

  const {strategyID} = props;

  const [id, setId] = React.useState("ac16ef8d-4ad8-42f8-adbd-a77f06c720ce");
  const [strategyName, setStrategyName] = React.useState("Strategy Name");
  const [successRate, setSuccessRate] = React.useState(0.75);
  const [description, setDescription] = React.useState("Description");
  const [notes, setNotes] = React.useState("Notes");
  const [dateCreated, setDateCreated]  = React.useState( new Date().toLocaleDateString());
  const [dateModified, setDateModified] = React.useState( new Date().toLocaleDateString());
  const [backtestBeginDate, setBacktestBeginDate] = React.useState( new Date().toLocaleDateString());
  const [backtestEndDate, setBacktestEndDate] = React.useState( new Date().toLocaleDateString());
  
  const [avgReturns, setAvgReturns] = React.useState(0);
  const [avgAnnualizedRateofReturn, setAvgAnnualizedRateofReturn] = React.useState(0);
  const [standardDeviation, setStandardDeviation] = React.useState(0);
  const [sharpeRatio, setSharpeRatio] = React.useState(0);
  const [avgDuration, setAvgDuration] = React.useState(5);
  const [referenceID, setReferenceID] = React.useState('');

  const [isLoading, setIsLoading] = React.useState(true);

  const api = useAxios();

  //backtest strategy duration in days
  const [strategyDuration, setStrategyDuration] = React.useState(150);

  const [orders, setOrders] = React.useState(testing_data);
  


  const[symbolsSummary, setSymbolsSummary] = React.useState([]);


  function getStrategyDetails(id){
    console.log("fetching details for id: ", id)
    
    api
    .get("/api/records/backtests/" + id)
    .then(res => {
      const data = res.data;

      console.log(data.backtest)
      setId(data.backtest.id)
      setStrategyName(data.backtest.name)
      setNotes(data.backtest.notes)
      setDescription(data.backtest.description)

      setDateCreated(data.backtest.date_created)
      setDateModified(data.backtest.date_modified)

      setBacktestBeginDate(data.backtest.backtest_start_date)
      setBacktestEndDate(data.backtest.backtest_end_date)
      
      setStrategyDuration(data.backtest.backtest_duration)
      setReferenceID(data.backtest.reference_id)
      
      const newOrders = data.orders.map(x => {
        x.active = true
        return x
      })
      setOrders(newOrders)

      setIsLoading(false)
    })
    .catch( err => {
      console.log(err);
    })
  }

  // Run this when a strat id is changed
  useEffect(() => {

    if (strategyID != -1 ){
      console.log(strategyID)
      setId(strategyID)
      setIsLoading(true)
      getStrategyDetails(strategyID)  
    }

  }, [strategyID])


  // Run this when name, description or notes are changed
  React.useEffect(() => {
    if (strategyName === undefined || description === undefined || notes === undefined || strategyName === "Strategy Name") {
      //Do not change Name
      //console.log("Strategy Name is undefined")
    }else{
      console.log("Making Edit to startegy id: ", id);
      
      
      api
        .put("/api/records/backtests/" + id, {
          name: strategyName,
          description: description,
          notes: notes,
          backtest_start_date: backtestBeginDate, //<- required
          backtest_end_date: backtestEndDate, // <- required
        })
        .then(res => {
          console.log(res);
        })
        .catch( err => {
          console.log(err);
        })
    }
  }, [strategyName, description, notes]);


  function resetOrders(){
    const clone = orders.map( x => {return {...x}});

    clone.forEach((order) => {
      order.active = true;
    });

    setOrders(clone);
  }

  function uncheckAllOrders(){
    const clone = orders.map( x => {return {...x}});
    clone.forEach((order) => {
      order.active = false;
    });

    setOrders(clone);
  }

  async function getCheckedOrders(orders) {
    //variable to store checked orders
    const checkedOrders = orders.filter((order) => order.active);
    return checkedOrders;
  }

  async function calculateSuccessRate(orders) {

    let successRate = 0;
    let totalOrders = orders.length;
    let totalProfitableOrders = 0;

    orders.forEach((order) => {
      if (order.returns > 0) {
        totalProfitableOrders++;
      }
    });

    successRate = totalProfitableOrders / totalOrders;

    return successRate;
  }

  async function calculateAvgReturns(orders) {
    let avgReturns = 0;
    let totalOrders = orders.length;
    let totalReturns = 0;

    orders.forEach((order) => {
      totalReturns += order.returns;
    });

    avgReturns = totalReturns / totalOrders;
    return avgReturns;
  }

  async function calculateAnnualRateOfReturn(orders) {
    //returns yearly accumulated returns
    let accumulation = 1;

    orders.forEach((order) => {
      accumulation *= ( 1 + order.returns);
    });

    const numbYears = strategyDuration / 365;
    const annualizedReturns = Math.pow(accumulation, 1 / numbYears) - 1;

    return annualizedReturns;
  }

  async function calculateTotalReturns(orders) {
    let totalReturns = 0;

    orders.forEach((order) => {
      totalReturns += order.returns;
    });

    return totalReturns;
  }

  async function calculateTotalTrades(orders) {
    return orders.length;
  }

  async function calculateAverateDuration(orders) {
    let averageDuration = 0;
    let totalOrders = orders.length;
    let totalDuration = 0;

    orders.forEach((order) => {
      totalDuration += order.duration;
    });

    averageDuration = totalDuration / totalOrders;
    return averageDuration;
  }


  async function calculateStdDeviation(orders, mean) {
    let stdDeviation = 0;
    let totalOrders = orders.length;
    let totalReturns = 0;
    let avgReturns = mean;

    orders.forEach((order) => {
      totalReturns += Math.pow(order.returns - avgReturns, 2);
    });

    stdDeviation = Math.sqrt(totalReturns / totalOrders);
    return stdDeviation;
  }


  async function calculateSharpeRatioFromOrders(orders) {
    calculateStrategyAnnualizedRateOfReturns(orders).then((annualizedROR) => {
      calculateStdDeviation(orders).then((stdDeviation) => {
        return annualizedROR / stdDeviation;        
      });
    });
  }

  function calculateSharpeRatio(AVGannualizedROR, stdDeviation) {
    return AVGannualizedROR / stdDeviation;
  }

  async function calculateStrategyAnnualizedRateOfReturns(orders) {
    let symbols = getSymbols(orders);
    if (symbols.length > 0) {
        let totalAnnualizedReturns = 0;
        for (const symbol of symbols) {
            //get orders for symbol
            const symbolOrders = orders.filter((order) => order.symbol === symbol);
            const symbolAnnualizedReturns = await calculateAnnualRateOfReturn(symbolOrders);

            totalAnnualizedReturns += symbolAnnualizedReturns;
        }
        return totalAnnualizedReturns / symbols.length;
    }
  }

  function getSymbols(orders) {
    let symbols = [];

    orders.forEach((order) => {
      symbols.push(order.symbol);
    });

    //remove duplicates
    symbols = [...new Set(symbols)];

    return symbols;
  }


  async function calculateSymbolsSummary(orders){
    const symbols = getSymbols(orders);
    
    let summary = [];

    for (const symbol of symbols) {

      let obj = {};
      obj.symbol = symbol;

      const symbolOrders = orders.filter((order) => order.symbol === symbol);



      await calculateAvgReturns(symbolOrders).then((avgReturns) => {
        obj.meanReturn = avgReturns;

        obj.trades = symbolOrders.length;
      
        calculateTotalReturns(symbolOrders).then((totalReturns) => {
          obj.totalReturns = totalReturns;
        });

        calculateAverateDuration(symbolOrders).then((avgDuration) => { 
          obj.avgDuration = avgDuration;
        });

        calculateSuccessRate(symbolOrders).then((successRate) => {
          obj.successRate = successRate;
          obj.pos = Math.round(successRate * symbolOrders.length);
          obj.neg = symbolOrders.length - obj.pos;
        });

        calculateStdDeviation(symbolOrders, avgReturns).then((stdDeviation) => {
          obj.stdDev = stdDeviation;

          calculateAnnualRateOfReturn(symbolOrders).then((annualizedReturns) => {
            obj.annualROR = annualizedReturns;
            
            obj.sharpeRatio = calculateSharpeRatio(annualizedReturns, stdDeviation);

            summary.push(obj);
          });

        }); 
        
      });

    }

    return summary;
  }

  React.useEffect(() => {
    getCheckedOrders(orders).then((checkedOrders) => {
      calculateSymbolsSummary(orders).then((summary) => {
        setSymbolsSummary(summary);
      }); 
    });
  }, []);

  React.useEffect(() => {
    //variable to store checked orders
    //const checkedOrders = orders.filter((order) => order.active);
    
    getCheckedOrders(orders).then((checkedOrders) => {

      calculateSymbolsSummary(checkedOrders).then((summary) => {
        setSymbolsSummary(summary);
      });

      calculateSuccessRate(checkedOrders).then((result) => {
        setSuccessRate(result);
      });


      //doing chaining and overloading to save computation time
      calculateAvgReturns(checkedOrders).then((avgRet) => {
        setAvgReturns(avgRet);

        calculateStdDeviation(checkedOrders, avgRet).then((std) => {
          setStandardDeviation(std);
          
          calculateStrategyAnnualizedRateOfReturns(checkedOrders).then((annualizedROR) => {
            setAvgAnnualizedRateofReturn(annualizedROR);
            setSharpeRatio(calculateSharpeRatio(annualizedROR, std));
          });

        });

      });

      calculateAverateDuration(checkedOrders).then((avgDur) => {
        setAvgDuration(avgDur);
      });

    })



    // setAvgReturns(calculateAvgReturns(checkedOrders));
    // //setAvgAnnualizedRateofReturn(calculateStrategyAnnualizedRateOfReturns(checkedOrders));
    // setStandardDeviation(calculateStdDeviation(checkedOrders));
    // //setSharpeRatio(calculateSharpeRatio(checkedOrders));
  //setAvgDuration(calculateAverateDuration(checkedOrders));

  }, [orders]);


  const loadingScreen = (
  <div>
      <Card padding='6' marginY='5'>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
      </Card> 

      <Card padding='6' marginY='5'>
        <SkeletonText mt='4' noOfLines={10} spacing='4' skeletonHeight='2' />
      </Card> 

      <Card padding='6' marginY='5'>
        <SkeletonText mt='4' noOfLines={2} spacing='4' skeletonHeight='2' />
      </Card> 

  </div>
  )

  // Chakra Color Mode
  return (

    <Box pt={{ base: "40px", md: "20px", xl: "10px" }}>

        {isLoading ? loadingScreen : 

        <div>
          
          <Grid templateColumns="repeat(6, 1fr)" gap={6}>

            <GridItem colSpan={6}>
              <CardComp id={id} 
                        setId={setId} 
                        successRate={successRate} 
                        setSuccessRate={setSuccessRate} 
                        dateCreated={dateCreated} 
                        dateModified={dateModified}
                        backtestBeginDate={backtestBeginDate}
                        backtestEndDate={backtestEndDate} 
                        strategyName={strategyName} 
                        setStrategyName={setStrategyName}
                        referenceID={referenceID}/>
            </GridItem>

            <GridItem colSpan={4}>
              <Description  description={description} 
                            setDescription={setDescription}/>
              <Box marginTop="20px">
                <StatsCard  successRate={successRate} 
                            orders={orders} 
                            strategyDuration={strategyDuration} 
                            avgDuration={avgDuration} 
                            avgReturns={avgReturns} 
                            standardDeviation={standardDeviation} 
                            avgAnnualizedROR={avgAnnualizedRateofReturn} 
                            sharpeRatio={sharpeRatio}/>
              </Box>
            </GridItem>

            <GridItem colSpan={2}>  
              <Notes notes={notes} setNotes={setNotes}/>
            </GridItem>


            <GridItem colSpan={6}>
              <SymbolsTable columnsData={columnsDataSymbols} tableData={symbolsSummary}/>
            </GridItem>

            <GridItem colSpan={6}>
              <OrdersTable resetOrders={resetOrders} uncheckAllOrders={uncheckAllOrders} columnsData={ordersColumnsData} tableData={orders} setTable={setOrders}/>
            </GridItem>

          </Grid>
                
        </div>}

    </Box>


  );
}