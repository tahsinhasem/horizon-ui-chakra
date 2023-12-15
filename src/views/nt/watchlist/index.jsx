// Chakra imports
import { Box, Heading, Text} from "@chakra-ui/react";
import React from "react";

export default function Settings() {
  // Chakra Color Mode
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