import { MdTrendingUp, MdTrendingDown, MdSsidChart } from "react-icons/md";
import {
  Flex,
  Table,
  Checkbox,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Button,
  useColorModeValue,
  Progress,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";




export default function CheckTable(props) {
  const { columnsData, tableData } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    state,
    nextPage,
    previousPage,
    canNextPage,
    pageOptions,
    canPreviousPage,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 11;

  const {pageIndex} = state;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const rowBorderColor = useColorModeValue("gray.200", "whiteAlpha.500");
  return (
    <Card
      direction='column'
      w='100%'
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px='25px' justify='space-between' mb='20px' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'>
          Symbols Performance
        </Text>

        <Flex justify="flex-end" align="center">
            
            {/* <Text marginRight={4} fontWeight={500} fontSize="sm">{pageIndex + 1} of {pageOptions.length}</Text> */}
            <Button size="xs" marginRight={2} variant="outline" colorScheme="brandScheme" leftIcon={<ArrowBackIcon />} onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</Button>
            <Button size="xs" marginRight={2} variant="outline" colorScheme="brandScheme" rightIcon={<ArrowForwardIcon />} onClick={() => nextPage()} disabled={!canNextPage} >Next</Button>
        
          </Flex>



      </Flex>
      <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe='10px'
                  key={index}
                  borderColor={borderColor}>
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color='gray.400'>
                    {column.render("Header")}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data = "";
                  if (cell.column.Header === "SYMBOL") {
                    
                    data = (     
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                      </Text>
                    );

                  } else if (cell.column.Header === "MEAN RETURN" || cell.column.Header === "STANDARD DEV" || cell.column.Header === "ANNUALIZED ROR") {
                      data = (
                        <Flex align='center'>
                          <Text color={textColor} fontSize='sm' fontWeight='700'>
                            {Math.round(100 * 100 * cell.value)/100}%
                          </Text>
                        </Flex>
                      );
                  }
                  else if (cell.column.Header === "SUCCESS RATE") {
                    data = (
                      <Flex align='center'>
                        <Progress value={cell.value * 100} colorScheme="brandScheme" size="sm"></Progress>
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {Math.round(100 * 100 * cell.value)/100}%
                        </Text>
                      </Flex>
                    );
                  }
                  else if (cell.column.Header === "SHARPE RATIO") {
                    data = (
                      <Flex align='center'>
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {Math.round(100 * cell.value)/100}
                        </Text>
                      </Flex>
                    );
                  }
                  else if (cell.column.Header === "TRADES") { 
                    data = (
                      <Flex align='center'>
                      <Text color={'grey.500'} fontSize='sm' fontWeight='500'>
                        +{cell.row.original.pos}/-{cell.row.original.neg}/= {` `}
                      </Text>

                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.row.original.trades}
                      </Text>
                      
                      </Flex>
                    );

                  }
                  else {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.row}
                      </Text>
                    );
                  }


                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: "14px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      borderColor={rowBorderColor}>
                      {data}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Card>
  );
}
