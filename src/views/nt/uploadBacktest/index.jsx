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
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import _ from 'lodash';

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

  const base_url = "http://localhost:8000";


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
    axios
      .post(base_url + '/api/records/orders/batch', {
        
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

  useEffect(()=>{
    if (orders.length != 0 && ordersValid){
      setIsSubmitEnabled(true)
      console.log(orders)
    }
  }, [orders])

  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px"}}>
        
        <Card id={'upload_backtest_form'}>

          <Stack spacing={5}>
          
          <FormControl id="name" isRequired={false}>
            <FormLabel>Strategy Name</FormLabel>
            <Input type="text" value={name} onChange={e => setName(e.target.value)} />
          </FormControl>

          <FormControl id="description" isRequired={false}>
            <FormLabel>Description</FormLabel>
            <Input as={Textarea} type="text" value={description} onChange={e => setDescription(e.target.value)} />
          </FormControl>

          <FormControl id="notes" isRequired={false}>
            <FormLabel>Notes</FormLabel>
            <Input as={Textarea} type="text" value={notes} onChange={e => setNotes(e.target.value)} />
          </FormControl>



          <Stack spacing={5} direction="row">

            <FormControl id="startDate" isRequired={true} isInvalid={!endDate}>
              <FormLabel>Backtest Start Date</FormLabel>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </FormControl>

            <FormControl id="endDate" isRequired={true} isInvalid={!endDate}>
              <FormLabel>Backtest End Date</FormLabel>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </FormControl>

          </Stack>


          <FormControl id="uploadOrders" isRequired={true} isInvalid={!!errorMessage}>
            <FormLabel>Upload Orders</FormLabel>
            
            <InputGroup size="md">
              <Input 
                accept=".csv" 
                type="file" 
                onChange={handleFileSelect} 
                borderRadius="0"
                pr='8rem' />       
              
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