import { Box, Grid, GridItem, Flex, Input, ButtonGroup, Heading, Text, EditablePreview, EditableInput, Editable, CircularProgress, CircularProgressLabel, Tooltip, IconButton} from "@chakra-ui/react";
import Card from "components/card/Card";
import React from "react";
import'uuid';
import { v4 } from "uuid";
import { EditIcon, CheckIcon, CloseIcon} from "@chakra-ui/icons";
import { useEditableControls } from "@chakra-ui/react";


/* Here's a custom control */
function EditableControls() {
    const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
    } = useEditableControls()

    return isEditing ? (
    <ButtonGroup justifyContent='center' size='sm'>
        <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
        <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
    </ButtonGroup>
    ) : (
    <Flex justifyContent='center'>
        <IconButton size='sm' icon={<EditIcon />} {...getEditButtonProps()} />
    </Flex>
    )
}


export default function CardComp(props) {
    // Chakra Color Mode

    const {id, setId, successRate, setSuccessRate, dateCreated, dateModified, strategyName, referenceID, setStrategyName} = props;

    const beginDate = props.backtestBeginDate;
    const endDate = props.backtestEndDate;

  /*
  const [id, setId] = React.useState(v4.call());
  const successRate = 78;
  const [strategyName, setStrategyName] = React.useState('Super Trend x Golden Gross');
    */

    const handleSubmit = (event) => {
        if (event === undefined){
            setStrategyName('');
        }else{
            setStrategyName(event);
        }
    };

    const handleEdit = (event) => {
        if (event === undefined){
            setStrategyName('');
        }else{
            setStrategyName(event.value);
        }
    };

  return (
    <Card p={8}>

        <Grid container templateColumns="repeat(3, 1fr)" gap={6}>    
            
            <GridItem colSpan={2}>

                <Editable
                defaultValue={strategyName}
                as={Heading}
                size='2xl'
                isPreviewFocusable={false}
                onChange={handleEdit}
                onSubmit={handleSubmit}
                value={strategyName}
                marginY={3}
                >
                    <Grid templateColumns="repeat(3, 1fr)" gap={6}>

                        <GridItem colSpan={2}>
                            <EditablePreview />
                            <Input as={EditableInput} />
                        </GridItem>
                        <GridItem colSpan={1}>
                            <EditableControls />
                        </GridItem>

                    </Grid>
                
                </Editable>


                <Text fontSize="xs" color="gray.400">
                    ID: {id.toString()}
                </Text>

                <Text fontSize="xs" color="gray.400">
                    Date Created: {dateCreated}
                </Text>
                
                <Text fontSize="xs" color="gray.400">
                    Date Modified: {dateModified}
                </Text>

                <Text fontSize="xs" color="gray.400">
                    From: {beginDate} to {endDate}
                </Text>

                
                <Text fontSize="xs" color="gray.400">
                    Reference: {referenceID}
                </Text>
                
            </GridItem>

            <GridItem colSpan={1} >
                <Grid justifyItems={"flex-end"}>
                    <Tooltip label="Success Rate">
                        <Box>
                            <CircularProgress value={successRate * 100} color="green.500" size="120px" thickness="10px">
                                <CircularProgressLabel fontSize="sm" color="gray.500">
                                    {Math.round(100 * 100 * successRate)/100}%
                                </CircularProgressLabel>
                            </CircularProgress>
                        </Box>
                    </Tooltip>
                </Grid> 
            </GridItem>

        </Grid>
    </Card>

  );
}