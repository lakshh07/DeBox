import React, { useState } from "react";
import {
  Flex,
  Stack,
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  Badge,
  chakra,
  VisuallyHidden,
  useColorModeValue,
  InputGroup,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import { AiFillFileAdd } from "react-icons/ai";

function UploadFile({
  fileDescription,
  setFileDescription,
  setUploadNewFile,
  checker,
  uploadingFile,
}) {
  const [uploadFileName, setUploadFileName] = useState(
    <Icon as={AiFillFileAdd} />
  );

  const Form = () => {
    return (
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>File Description (Optional)</FormLabel>
          <InputGroup>
            <Input
              fontFamily="Inter"
              type="text"
              placeholder="Short Description"
              border="none"
              focusBorderColor="none"
              rounded="md"
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
            />
          </InputGroup>
        </FormControl>
        <Flex alignItems="center" mt={1}>
          <Badge m={0}>{uploadFileName}</Badge>
          <chakra.label
            cursor="pointer"
            rounded="md"
            fontSize="md"
            ml={5}
            size="sm"
            fontWeight="medium"
            color={useColorModeValue("brand.600", "brand.200")}
            pos="relative"
            _hover={{
              color: useColorModeValue("brand.400", "brand.300"),
            }}
          >
            <span>Upload a file</span>
            <VisuallyHidden>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept="*"
                multiple
                onChange={(e) => {
                  setUploadNewFile(e.target.files);
                  setUploadFileName(e.target.files[0].name);
                }}
              />
            </VisuallyHidden>
          </chakra.label>
        </Flex>
      </Stack>
    );
  };

  return (
    <>
      <Box>
        <Form />

        <Flex mt="1rem" mb="-1.5rem" mr="-1.5rem" justifyContent="flex-end">
          <Button
            fontFamily="Lato"
            onClick={uploadingFile}
            colorScheme="purple"
            className="btn"
          >
            {checker && <Spinner mr={4} />}
            {checker ? "Uploading to IPFS" : "Upload"}
          </Button>
        </Flex>
      </Box>
    </>
  );
}

export default UploadFile;
