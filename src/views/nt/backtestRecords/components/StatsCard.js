import React from "react";
import { Box, Grid, GridItem, Icon} from "@chakra-ui/react";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import {
    MdAddTask,
    MdAttachMoney,
    MdBarChart,
    MdTimelapse,
    MdExpand,
    MdTrendingUp,
    MdCheck,
    MdQueryStats,
  } from "react-icons/md";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Card from "components/card/Card";




export default function StatsCard(props) {
    
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

    const {avgReturns, avgAnnualizedROR, successRate, standardDeviation, sharpeRatio, avgDuration} = props;

    function handlleTabsChange(index){
        console.log("handlleTabsChange for StatsCard")
        console.log(index);
    }

    return(

        <Box as={Card}>

        <Tabs marginX={"20px"} defaultIndex={0} onChange={handlleTabsChange}>
          <TabList>
            <Tab fontSize="lg" fontWeight='400'>All Trades</Tab>
            <Tab fontSize="lg" fontWeight='400'>Boom</Tab>
            <Tab fontSize="lg" fontWeight='400'>Consolidation</Tab>
            <Tab fontSize="lg" fontWeight='400'>Recession</Tab>
          </TabList>

          <TabPanels>

          </TabPanels>
        </Tabs>


            <Grid marginY={4} templateColumns="repeat(3, 1fr)" gap={2}>
                <GridItem>
                    <MiniStatistics
                        startContent={
                            <IconBox
                            w='56px'
                            h='56px'
                            bg={boxBg}
                            icon={
                                <Icon w='32px' h='32px' as={MdTrendingUp} color={brandColor} />
                            }
                            />
                        }
                        name='Average Return'
                        value={Math.round(100 * 100 * avgReturns)/100 + "%"}/>
                </GridItem>

                <GridItem>
                    <MiniStatistics
                        startContent={
                            <IconBox
                            w='56px'
                            h='56px'
                            bg={boxBg}
                            icon={
                                <Icon w='32px' h='32px' as={MdQueryStats} color={brandColor} />
                            }
                            />
                        }
                        name='Average Annualized Rate of Return'
                        value={Math.round(100 * 100 * avgAnnualizedROR)/100 + "%"}/>
                </GridItem>

                <GridItem>
                    <MiniStatistics
                        startContent={
                            <IconBox
                            w='56px'
                            h='56px'
                            bg={boxBg}
                            icon={
                                <Icon w='32px' h='32px' as={MdCheck} color={brandColor} />
                            }
                            />
                        }
                        name='Success Rate'
                        value={Math.round(100 * 100 * successRate)/100 + "%"}/>
                </GridItem>

                <GridItem>
                    <MiniStatistics
                        startContent={
                            <IconBox
                            w='56px'
                            h='56px'
                            bg={boxBg}
                            icon={
                                <Icon w='32px' h='32px' as={MdExpand} color={brandColor} />
                            }
                            />
                        }
                        name='Standard Deviation'
                        value={Math.round(100 * 100 * standardDeviation)/100 + "%"}/>
                </GridItem>

                <GridItem>
                    <MiniStatistics
                        startContent={
                            <IconBox
                            w='56px'
                            h='56px'
                            bg={boxBg}
                            icon={
                                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
                            }
                            />
                        }
                        name='Sharpe Ratio'
                        value={Math.round( 100 * sharpeRatio) / 100}/>
                </GridItem>

                <GridItem>
                    <MiniStatistics
                        startContent={
                            <IconBox
                            w='56px'
                            h='56px'
                            bg={boxBg}
                            icon={
                                <Icon w='32px' h='32px' as={MdTimelapse} color={brandColor} />
                            }
                            />
                        }
                        name='Average Duration'
                        value={Math.round(avgDuration * 100)/100 + " hours"}/>
                </GridItem>
            </Grid>
        </Box>
    );
}
