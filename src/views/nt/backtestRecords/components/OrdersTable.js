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
    useColorModeValue,
    Heading,
    IconButton,
    Button,
  } from "@chakra-ui/react";
  import React, { useMemo } from "react";
  import {
    useGlobalFilter,
    useFilters,
    usePagination,
    useSortBy,
    useTable,
  } from "react-table";

  import { MdTrendingUp, MdTrendingDown, MdChangeCircle } from "react-icons/md";
  
  // Custom components
  import Card from "components/card/Card";
  import Menu from "views/nt/backtestRecords/components/MainMenu";
  import ColumnFilter from "views/nt/backtestRecords/components/ColumnFiler";
  import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
  import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

  
  
  
  export default function OrdersTable(props) {
    const { columnsData, tableData, setTable, resetOrders, uncheckAllOrders } = props;

    
    function changeOrderStatus(index, status){
        const clone = tableData.map( x => {return {...x}});

        clone[index]['active'] = status;
        setTable(clone);
    }

    function handlleTabsChange(index){
      console.log(index);
    }


  
    const columns = useMemo(() => columnsData, [columnsData]);
    const data = useMemo(() => tableData, [tableData]);
  
    const tableInstance = useTable(
      {
        columns,
        data,
      },
      useGlobalFilter,
      useFilters,
      useSortBy,
      usePagination
    );
  
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      nextPage,
      previousPage,
      canNextPage,
      canPreviousPage,
      prepareRow,
      initialState,
      pageOptions,
      state,
      setGlobalFilter,
    } = tableInstance;

    const {pageIndex, globalFilter} = state;

    initialState.pageSize = 25;
  
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    const rowBorderColor = useColorModeValue("gray.200", "whiteAlpha.500");
    return (
      <Card
        direction='column'
        w='100%'
        px='0px'
        overflowX={{ sm: "scroll", lg: "hidden" }}>
        
        
        
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
        
        
        <Flex px='25px' justify='space-between' mb='20px' mt="20px" align='center'>
          <Heading
            color={textColor}
            size='lg'
            fontWeight='700'
            lineHeight='100%'>
            Orders List
          </Heading>

          <Flex justify="flex-end" align="center">
            
            <ColumnFilter marginRight={4} filter={globalFilter} setFilter={setGlobalFilter}/>

            <Text marginRight={4} fontWeight={500} fontSize="sm">{pageIndex + 1} of {pageOptions.length}</Text>
            <Button size="sm" marginRight={4} variant="outline" colorScheme="brandScheme" leftIcon={<ArrowBackIcon />} onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</Button>
            <Button size="sm" marginRight={4} variant="outline" colorScheme="brandScheme" rightIcon={<ArrowForwardIcon />} onClick={() => nextPage()} disabled={!canNextPage} >Next</Button>
          
            <Menu 
              resetOrders={resetOrders}
              uncheckAllOrders={uncheckAllOrders} />

          </Flex>
        </Flex>
        <Table {...getTableProps()} variant='simple' color='gray.500' mb='8px'>
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

                    if (cell.column.Header === "CHECK") {

                      data = (
                      <Flex align='center'>

                        <IconButton
                          colorScheme='brandScheme'
                          aria-label='Call Segun'
                          size='xs'
                          marginX={2}
                          onClick={(e) => {
                            console.log(e)
                            changeOrderStatus(cell.row.id, !cell.value);
                          }}
                          icon={<MdChangeCircle />}
                        />

                        {cell.value ? 
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {"TRUE"}
                        </Text>
                        :
                        <Text color="gray.300" fontSize='sm' fontWeight='700'>
                          {"FALSE"}
                        </Text>
                        }
                      </Flex>
                      );
                    }
                    else if (cell.column.Header === "SYMBOL") {
                      data = (
          
                        <Text color={cell.row.values.active ? textColor : "gray.300"} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                      
                      );
                    
                    } else if(cell.column.Header === "TYPE") {
                      
                      data = (
                      <Flex align='center'>
                        <Text color={cell.row.values.active ? textColor : "gray.300"} fontSize='sm' fontWeight='700'>
                          {cell.value}
                        </Text>
                        
                        {cell.value === "LONG" ?
                        <MdTrendingUp />
                        : <MdTrendingDown />}
  
                        </Flex>
                      );
                    } else if (cell.column.Header === "RETURNS") {
                      if (cell.value > 0) {
                        data = (
                          <Flex align='center'>
                            <Text
                              color={cell.row.values.active ? "green.500" : "green.200"}
                              fontSize='sm'
                              fontWeight='700'>
                              {Math.round(100 *100*cell.value )/100}%
                            </Text>
                            <MdTrendingUp />
                          </Flex>
                        );
                      } else {
                        data = (
                          <Flex align='center'>
                            <Text 
                              color={cell.row.values.active ? "red.500" : "red.200"} 
                              fontSize='sm' 
                              fontWeight='700'>
                              {Math.round(100 *100*cell.value )/100}%
                            </Text>
                            <MdTrendingDown />
                          </Flex>
                        );
                      }
                    } else if (cell.column.Header === "BUY PRICE" || cell.column.Header === "SELL PRICE" || cell.column.Header === "DURATION") {
                      data = (
                        <Text color={cell.row.values.active ? textColor : "gray.300"} fontSize='sm' fontWeight='700'>
                          {Math.round(100*cell.value )/100}
                        </Text>
                      );
                    }
                    else {
                      data = (
                        <Text color={cell.row.values.active ? textColor : "gray.300"} fontSize='sm' fontWeight='700'>
                          {cell.value}
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
        
        <Flex justify='space-between' px={5} align='center' mt='10px'>
            <Button size="md" variant="outline" colorScheme="brandScheme" leftIcon={<ArrowBackIcon />} onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</Button>
            <Text fontWeight={700} fontSize="md">{pageIndex + 1} of {pageOptions.length}</Text>
            <Button size="md" variant="outline" colorScheme="brandScheme" rightIcon={<ArrowForwardIcon />} onClick={() => nextPage()} disabled={!canNextPage} >Next</Button>
        </Flex>


      </Card>
    );
  }
  