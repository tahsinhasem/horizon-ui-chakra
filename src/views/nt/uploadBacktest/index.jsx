// Chakra imports
import { 
  Box, 
  Heading, 
  Text,   
  Input,
  Textarea,
  FormControl,
  Stack,
  FormLabel,
  Flex,
  Button,
  FormErrorMessage,
  FormHelperText,
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Fade,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import React from "react";
import Card from "components/card/Card";
import { useState, useEffect } from 'react';
import { useDisclosure } from "@chakra-ui/react"
import Papa from 'papaparse';
import { toast, ToastContainer } from 'react-toastify';
import _ from 'lodash';
import useAxios from "utils/useAxios";

export default function Settings() {


  // State vars
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('No File Selected');
  const [ordersValid, setOrdersValid] = useState(false)
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false)
  const [alertMsg, setAlertMsg] = useState("")
  const [alertStatus, setAlertStatus] = useState("success")
  const [isAlertVisible, setIsAlertVisible] = useState(false)
  const [orders, setOrders] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const api = useAxios();


  function makeAlert(message, status){
    setAlertMsg(message)
    setAlertStatus(status)
    setIsAlertVisible(true)

    setTimeout(() => {
      setIsAlertVisible(false);
    }, 3500);
  }
  
  
  const handleSubmit = (event) => {
    console.log('submitting form')
    console.log("Name:", name, "Desc:", description, "Notes:", notes, "Start:", startDate, "end:", endDate)


    if (startDate === "") {
      makeAlert("Invalid Start Date", 'error')
      return;
    }

    if(endDate === ""){
      makeAlert("Invalid End Date", 'error')
      return;
    }

    if(ordersValid === false){
      makeAlert("Invalid orders data", 'error')
      return;
    }

    makeAlert('Processing Upload', 'info')
    setIsUploading(true)
    setSelectedFile(null)
    setStartDate('')
    setEndDate('')
    setOrders([])
    setIsSubmitEnabled(false)

    // All validation must pass before this.
    api
      .post('/api/records/orders/batch', {
        
        backtest: {
          backtest_start_date: startDate,
          backtest_end_date: endDate,
          name: name,
          description: description,
          notes: notes
        },
        orders: orders
       
      },
      {
        timeout: 60000 // Here's the timeout in milliseconds
      }
      )
      .then(res=>{        
        makeAlert("Successfully uploaded", "success")
        setIsUploading(false)
      })
      .catch(err => {
        console.log(err)
        setIsUploading(false)
        makeAlert("Error uploading")
      })

  }

  useEffect(() => {

    if (selectedFile === undefined){
      setIsSubmitEnabled(false)
    }

  },[startDate, endDate, ordersValid, selectedFile])


  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    console.log(file)
    setSelectedFile(file);
    setErrorMessage(''); // clear the error message
    setIsSubmitEnabled(false)
  };

  //handle upload only after file select
  useEffect(() => {
    if (selectedFile) {
      handleUpload();
    }
  }, [selectedFile]);

  const handleUpload = () => {
    setIsSubmitEnabled(false)

    if (selectedFile) {
      const reader = new FileReader();
      
      reader.onload = function(event) {
        
        setOrdersValid(false)
        makeAlert("Validating File", 'info')

        const requiredHeaders = ['symbol', 'begin_date', 'end_date', 'type', 'buy_price', 'sell_price']
        const csvData = Papa.parse(event.target.result, { header: true }).data;
      
        // Check if required headers are present
        const headers = Object.keys(csvData[0])

        let headersPresent = true
        requiredHeaders.forEach(header => {
          if (!headers.includes(header)) {
            headersPresent = false
          }
        })

        if (!headersPresent) {
          setErrorMessage('Missing required headers')
          setOrdersValid(false)
          makeAlert("Validation Error: Mssing Headers", 'error')
          console.log('Missing required headers')
          console.log('Present: ', headers)
          return;
        }

        // validate dates
        for (let i = 0; i < csvData.length; i++) {
          const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
          if ((!regex.test(csvData[i].begin_date)) || (!regex.test(csvData[i].end_date))){
            console.log('Invalid date format in order:', csvData[i]);
            setErrorMessage('Invalid date format in order:' + i)
            makeAlert("Validation Error: Invalid Date format", 'error')
            console.log(csvData[i])
            setOrdersValid(false)
            return;
          }
        }


        // set orders to be valid after checking for headers and values
        setOrdersValid(true);
        setOrders(csvData)

        makeAlert("Validation Complete", 'success')
      };

      reader.readAsText(selectedFile); // This fires the onload event when the reader is ready
    }
  }

  function findEarliestDate(ords) {
    if (ords.length == 0) return '';

    console.log(ords)

    const earliestDate = ords.reduce((earliest, order) => {
      const [date, time] = order.begin_date.split(' ');
      const [year, month, day] = date.split('-').map(Number);
      const [hour, minute, second] = time.split(':').map(Number);
      const orderDate = new Date(year, month - 1, day, hour, minute, second);
      return orderDate < earliest ? orderDate : earliest;
    }, new Date());
  

    const earliestDateString = earliestDate.toISOString().slice(0, 10);
    console.log('Earliest date', earliestDateString);

    return earliestDateString;
  }

  function findLatestEndDate(ords) {
    if (ords.length === 0) return '';
  
    const latestEndDate = ords.reduce((latest, order) => {
      const [date, time] = order.end_date.split(' ');
      const [year, month, day] = date.split('-').map(Number);
      const [hour, minute, second] = time.split(':').map(Number);
      const orderDate = new Date(year, month - 1, day, hour, minute, second);
      return orderDate > latest ? orderDate : latest;
    }, new Date(0)); // Initialize with a date far in the past
  
    const latestEndDateString = latestEndDate.toISOString().slice(0, 10);
    console.log('Latest end date', latestEndDateString);
  
    return latestEndDateString;
  }

  useEffect(()=>{
    
    
    if (orders.length != 0 && ordersValid){

      
      setStartDate(findEarliestDate(orders))
      setEndDate(findLatestEndDate(orders))
      setIsSubmitEnabled(true)
      console.log(orders)
    }


  }, [orders])


  useEffect(() =>{

    console.log("Start Date", startDate)

  }, [startDate])

  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px"}}>
        
        <Card id={'upload_backtest_form'}>

          <Stack spacing={5}>
          
          <FormControl id="name" isRequired={false}>
            <FormLabel>Strategy Name</FormLabel>
            <Input 
              variant="main"
              borderRadius="5px" 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} />
          </FormControl>

          <FormControl id="description" isRequired={false}>
            <FormLabel>Description</FormLabel>
            <Input 
              as={Textarea} 
              type="text" 
              borderRadius="5px"
              value={description} 
              onChange={e => setDescription(e.target.value)} />
          </FormControl>

          <FormControl id="notes" isRequired={false}>
            <FormLabel>Notes</FormLabel>
            <Input 
            borderRadius="5px"
            as={Textarea} 
            type="text" 
            value={notes} 
            onChange={e => setNotes(e.target.value)} />
          </FormControl>



          <Stack spacing={5} direction="row">

            <FormControl id="startDate" isRequired={true} isInvalid={!endDate}>
              <FormLabel>Backtest Start Date</FormLabel>
              <Input 
                variant="main"
                borderRadius="5px"
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} />
            </FormControl>

            <FormControl id="endDate" isRequired={true} isInvalid={!endDate}>
              <FormLabel>Backtest End Date</FormLabel>
              <Input 
                type="date" 
                variant="main" 
                borderRadius="5px"
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} />
            </FormControl>

          </Stack>


          <FormControl id="uploadOrders" isRequired={true} isInvalid={!!errorMessage}>
            <FormLabel>Upload Orders</FormLabel>
            
            <InputGroup size="md">
              <Input 
                variant="main"
                accept=".csv" 
                type="file" 
                onChange={handleFileSelect} 
                borderRadius="0"
                p='4px'/>       
              
            </InputGroup>
            
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
            <FormHelperText>
              Upload a CSV file with the following headers: symbol, begin_date, end_date, type, buy_price, sell_price 
              <br />
              Dates in YYYY-MM-DD HH:MM:SS format
            </FormHelperText>
            
          </FormControl>

          <Button colorScheme="brandScheme" type='submit' onClick={handleSubmit} disabled={!isSubmitEnabled}>Submit</Button>

          </Stack>

        </Card>


      
      
     <Fade in={isAlertVisible}   style={{ 
              position: 'fixed', 
              bottom: '50px', 
              right: '50px' 
               }}>
                <Alert status={alertStatus}>
                  <AlertIcon></AlertIcon>
                  <AlertTitle>{alertMsg}</AlertTitle>
                  <CloseButton onClick={()=>setIsAlertVisible(false)}></CloseButton>
                </Alert>
      </Fade>


    </Box>

  );
}