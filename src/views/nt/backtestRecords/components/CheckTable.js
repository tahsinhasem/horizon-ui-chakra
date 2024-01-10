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
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

import { MdTrendingUp, MdTrendingDown, MdSsidChart } from "react-icons/md";

// Custom components
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";




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
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 11;

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
          Orders List
        </Text>
        <Menu />
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
            console.log(row.values.symbol[0]);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data = "";
                  if (cell.column.Header === "NAME") {
                    data = (
                      <Flex align='center'>
                        <Checkbox
                          defaultChecked={cell.value[1]}
                          colorScheme='brandScheme'
                          me='10px'
                        />
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value[0]}
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "PROGRESS") {
                    data = (
                      <Flex align='center'>
                        <Text
                          me='10px'
                          color={textColor}
                          fontSize='sm'
                          fontWeight='700'>
                          {cell.value}%
                        </Text>
                      </Flex>
                    );
                  } else if (cell.column.Header === "QUANTITY") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                      </Text>
                    );
                  } else if (cell.column.Header === "DATE") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                      </Text>
                    );
                  } else if (cell.column.Header === "SYMBOL") {
                    data = (
                      <Flex align='center'>
                        <Checkbox
                          defaultChecked={cell.value[1]}
                          onChange={(e) => console.log("Chanegd", e, e.target.checked, cell.row.id)}
                          colorScheme='brandScheme'
                          me='10px'
                        />
                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                          {cell.value[0]}
                        </Text>
                      </Flex>
                    );
                  } else if(cell.column.Header === "TYPE") {
                    
                    data = (
                    <Flex align='center'>
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
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
                            color='green.500'
                            fontSize='sm'
                            fontWeight='700'>
                            {100*cell.value}%
                          </Text>
                          <MdTrendingUp />
                        </Flex>
                      );
                    } else {
                      data = (
                        <Flex align='center'>
                          <Text color='red.500' fontSize='sm' fontWeight='700'>
                            {100*cell.value}%
                          </Text>
                          <MdTrendingDown />
                        </Flex>
                      );
                    }
                  }
                  else {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
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
    </Card>
  );
}
