import { Box, Editable, Text, Grid, Input, Flex, ButtonGroup, IconButton, EditablePreview, EditableTextarea, EditableInput, GridItem,  Heading, Divider } from "@chakra-ui/react";
import Card from "components/card/Card";
import React from "react";
import { useEditableControls } from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon} from "@chakra-ui/icons";

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

export default function Notes(){

    const [notes, setNotes] = React.useState('These are some notes about the strategy. It is a long description that should be able to wrap to the next line.');

    const handleSubmit = (event) => {
        console.log("Implement NOTES submit for: " + event);
    };

    const handleEdit = (event) => {
        setNotes(event.value);
    };

    return (
        <Card p={8} m={1}>
            
            <Heading size="lg" mb={2}>Notes</Heading>
            <Divider mb={2} />

            <Editable
            defaultValue='Strategy Notes'
            size='sm'
            isPreviewFocusable={false}
            onChange={handleEdit}
            onSubmit={handleSubmit}
            value={notes}
            >
                <Grid templateColumns="repeat(10, 1fr)" gap={6}>

                    <GridItem colSpan={9}>
                        <EditablePreview />
                        <Input as={EditableTextarea}/>
                    </GridItem>
                    <GridItem colSpan={1}>
                        <EditableControls />
                    </GridItem>

                </Grid>
            </Editable>

        </Card>
    )
}