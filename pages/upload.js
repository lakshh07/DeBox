import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Box,
  Icon,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { BsCloudUploadFill } from "react-icons/bs";
import * as IPFS from "ipfs-core";
import { useRouter } from "next/router";
import makeStorageClient from "../utils/storageClient";
import CreateFile from "./components/createFile";
import UploadFile from "./components/uploadFile";

function Upload({ deContract, contractAddress }) {
  const toast = useToast();
  const router = useRouter();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const [checker, setChecker] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successIpfs, setSuccessIPfs] = useState(false);
  const [hash, setHash] = useState("");

  const [createNewFile, setCreateNewFile] = useState({
    title: "",
    content: "",
    description: "",
  });
  const [fileDescription, setFileDescription] = useState("");
  const [uploadNewFile, setUploadNewFile] = useState([]);

  useEffect(() => {
    success &&
      toast({
        title: "Transaction Hash.",
        description: hash,
        status: "success",
        position: "top",
        duration: 9000,
        isClosable: true,
      });
    checker &&
      toast({
        title: "Please Wait!",
        description: "Submitting file to IPFS...",
        status: "info",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    successIpfs &&
      toast({
        title: "Please Wait!",
        description: "uploading file to Polygon Network...",
        status: "info",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
  }, [success, checker, successIpfs]);

  async function makingContract({
    CID,
    fileSize,
    fileName,
    fileType,
    fileDes,
  }) {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        deContract.abi,
        signer
      );

      let overrides = {
        from: account,
      };

      const result = await contract.uploadFile(
        CID,
        fileSize,
        fileType,
        fileName,
        fileDes,
        overrides
      );
      console.log(result.hash);
      setHash(result.hash);
      setSuccess(true);
    }
  }

  async function uploadCreateFile() {
    setChecker(true);
    const client = makeStorageClient();

    let fileBlobArray = [];
    let fileBlob = new File(
      [`${createNewFile.content}`],
      `${createNewFile.title}.txt`,
      { type: "text/plain" }
    );
    fileBlobArray.push(fileBlob);
    let fileSize = fileBlob.size / 1000;

    const onStoredChunk = (chunkSize) =>
      console.log(`stored chunk of ${chunkSize} bytes`);

    const cid = await client.put(fileBlobArray, { onStoredChunk });
    console.log("web3 storage", cid);

    const fileDes =
      createNewFile.description == ""
        ? "Uploaded to IPFS by DeCloud"
        : createNewFile.description;

    // makingContract(cid, fileSize, "txt", createNewFile.title, fileDes);
    setSuccessIPfs(true);
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        deContract.abi,
        signer
      );

      let overrides = {
        from: account,
      };

      const result = await contract.uploadFile(
        cid.toString(),
        fileBlob.size,
        "txt",
        createNewFile.title,
        fileDes,
        overrides
      );
      console.log(result.hash);
      setHash(result.hash);
      setSuccess(true);
    }
  }

  async function uploadingFile() {
    setChecker(true);
    const client = makeStorageClient();

    const onStoredChunk = (chunkSize) =>
      console.log(`stored chunk of ${chunkSize} bytes`);

    console.log(uploadNewFile);
    console.log(uploadNewFile[0].size);
    console.log(uploadNewFile[0].name);
    const cid = await client.put(uploadNewFile, { onStoredChunk });
    console.log("web3 storage", cid);

    const fileName = uploadNewFile[0].name.split(".");
    const fileSize = uploadNewFile[0].size / 1000;
    const fileDes =
      fileDescription == "" ? "Uploaded to IPFS by DeBox" : fileDescription;

    // makingContract(cid.toString(), fileSize, fileName[1], fileName[0], fileDes);
    setSuccessIPfs(true);
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        deContract.abi,
        signer
      );

      let overrides = {
        from: account,
      };

      const result = await contract.uploadFile(
        cid.toString(),
        uploadNewFile[0].size,
        fileName[1],
        fileName[0],
        fileDes,
        overrides
      );
      console.log(result.hash);
      setHash(result.hash);
      setSuccess(true);
    }

    // const ipfs = await IPFS.create();
    // const { cid, size } = await ipfs.add(file);
  }

  success &&
    setInterval(() => {
      router.reload();
    }, 10000);

  return (
    <>
      <Box cursor="pointer" className="upload-icon">
        <Icon
          onClick={onOpen}
          as={BsCloudUploadFill}
          boxSize={8}
          color="white"
        />

        <Modal
          size={"2xl"}
          isCentered
          motionPreset="slideInBottom"
          blockScrollOnMount={true}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <Box p="2rem">
                <Tabs isFitted variant="soft-rounded" colorScheme="purple">
                  <TabList>
                    <Tab _focus={{ border: "none" }}>Create File</Tab>
                    <Tab _focus={{ border: "none" }}>Upload File</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <CreateFile
                        createNewFile={createNewFile}
                        setCreateNewFile={setCreateNewFile}
                        checker={checker}
                        uploadCreateFile={uploadCreateFile}
                      />
                    </TabPanel>
                    <TabPanel>
                      <UploadFile
                        setUploadNewFile={setUploadNewFile}
                        fileDescription={fileDescription}
                        setFileDescription={setFileDescription}
                        checker={checker}
                        uploadingFile={uploadingFile}
                        uploadNewFile={uploadNewFile}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}

export default Upload;
