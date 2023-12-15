//generate boilerpalte code
import React, { Component } from 'react';   //import React Component
import { Box, Heading, Text} from "@chakra-ui/react";

export default class BacktestRecordsHome extends Component {
    render() {
        return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <Heading size="xl">
                Hello World!!
            </Heading>
            <Text>
                Kind of empty in here...
            </Text>
        </Box>
        );
    }
}