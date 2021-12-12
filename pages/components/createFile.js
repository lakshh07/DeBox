import React from "react";
import {
  Flex,
  Button,
  Box,
  Textarea,
  Spinner,
  FormLabel,
  Input,
} from "@chakra-ui/react";

function createFile({
  createNewFile,
  setCreateNewFile,
  checker,
  uploadCreateFile,
}) {
  const updateField = (e) => {
    setCreateNewFile({
      ...createNewFile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Box>
        <Flex justifyContent="space-between">
          <Box>
            <FormLabel>Name</FormLabel>
            <Input
              mb="0.5rem"
              fontFamily="Inter"
              type="text"
              placeholder="File Name"
              border="none"
              focusBorderColor="none"
              rounded="md"
              name="title"
              value={createNewFile.title}
              onChange={updateField}
            />
          </Box>
          <Box>
            <FormLabel>Description</FormLabel>
            <Input
              mb="0.5rem"
              fontFamily="Inter"
              type="text"
              placeholder="Short Description"
              border="none"
              focusBorderColor="none"
              rounded="md"
              name="description"
              value={createNewFile.description}
              onChange={updateField}
            />
          </Box>
        </Flex>
        <FormLabel my="1rem">Content</FormLabel>
        <Textarea
          fontFamily="Lato"
          fontSize="1.125rem"
          lineHeight="1.55rem"
          h="340px"
          border="none"
          _focus={{ border: "none" }}
          name="content"
          value={createNewFile.content}
          onChange={updateField}
          placeholder={`# Heading 1
## Heading 2
*Italic* & **Bold**

'''js
console.log("Hello World!")
'''

[DeCloud](https://decloud.xyz)

- Item 1
- Item 2
            `}
        />

        <Flex mt="1rem" mb="-1.5rem" mr="-1.5rem" justifyContent="flex-end">
          <Button
            fontFamily="Lato"
            onClick={uploadCreateFile}
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

export default createFile;
