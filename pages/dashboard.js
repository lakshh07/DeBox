import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Head from "next/head";
import moment from "moment";
import {
  Box,
  Stack,
  Heading,
  Tag,
  Flex,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure,
  Avatar,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Upload from "./upload";
import AccountSetting from "./accountsetting";
import PdfBg from "./assets/pdf.png";
import IMG from "./assets/image-file.png";
import Docs from "./assets/docs.png";
import Image from "next/image";
import svgAvatarGenerator from "./avatar";

import DeCloudContract from "../artifacts/contracts/DeCloud.sol/DeCloud.json";

export default function Home({}) {
  const deContract = DeCloudContract;
  const router = useRouter();
  const {
    query: { profileName, profileBio, account, updateProfile },
  } = router;
  console.log(profileName, profileBio, account);
  const [avatar, setAvatar] = useState(undefined);
  const [userData, setUserData] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(
    "0x4be1f454e6a72230bce064d99878e33qh78j9vdw180"
  );
  const { onOpen, onClose, isOpen } = useDisclosure();
  // const contractAddress = "0x8C0ae1387c4cD0f6007317eeC4F7CA70949549A8"; //ropsten
  const contractAddress = "0xEA2D4C60E3Bf97621fdCf809b44d14a91C032ece"; //mumbai
  let userdm;
  async function fetchUserData() {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        deContract.abi,
        provider
      );

      let overrides = {
        from: account,
      };

      const filesData = await contract.fetchUserFiles(overrides);
      setUserData(filesData);
      console.log("Data: ", filesData);

      console.log(filesData[0].uploadTime.toString());
      // setBalance(balance.toString());
      // setShowBalance(true);
      return filesData;
    }
  }

  useEffect(async () => {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(account);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      deContract.abi,
      provider
    );

    let overrides = {
      from: account,
    };

    const filesData = await contract.fetchUserFiles(overrides);
    setUserData(filesData);

    let svg = svgAvatarGenerator(currentAccount, { dataUri: true });
    setAvatar(svg);

    console.log(userData, ": userdata");
    let data = await fetchUserData();
    console.log(data, ": data");
  }, []);

  function handleSrc(file) {
    switch (file.fileType) {
      case "txt":
        return Docs;
        break;
      case "png":
        return IMG;
        break;
      case "jpg":
        return IMG;
        break;
      case "jpeg":
        return IMG;
        break;
      case "pdf":
        return PdfBg;
        break;

      default:
        Docs;
        break;
    }
  }
  return (
    <>
      <Head>
        <title>DeBox</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box h="100vh">
        <Box className="dashboard-blur">
          <Flex
            alignItems="center"
            justifyContent="space-between"
            py="1rem"
            mx="3rem"
          >
            <Link href="/">
              <Text
                className="heading"
                cursor="pointer"
                fontSize="1.5rem"
                fontFamily="Pacifico"
              >
                DeBox
              </Text>
            </Link>
            <Tag>
              {" "}
              {`${currentAccount.substr(0, 6)}...${currentAccount.substr(-4)}`}
            </Tag>
          </Flex>
          <Flex
            justifyContent="center"
            py="1.5rem"
            pb="1.5rem"
            pt="0.5rem"
            alignItems="center"
          >
            <Avatar
              borderStyle="solid"
              borderColor="#8444e6"
              borderWidth="4px"
              pt="2px"
              p="1px"
              size="xl"
              bg="transparent"
              src={avatar}
            />
            <Box p="1rem">
              {" "}
              <Heading color="black" fontFamily="Philosopher">
                Good Evening, {profileName}.
              </Heading>
              <Text fontSize="1rem">({profileBio})</Text>
              <Tag
                cursor="pointer"
                onClick={onOpen}
                color="white"
                className="btn"
                mt="5px"
                fontSize="0.8rem"
              >
                Account setting
              </Tag>
            </Box>
          </Flex>
        </Box>

        <AccountSetting
          updateProfile={updateProfile}
          isOpen={isOpen}
          profileName={profileName}
          profileBio={profileBio}
          onClose={onClose}
          userData={userData}
        />

        <Flex
          alignItems="center"
          justifyContent="space-between"
          mx="4rem"
          p="1rem"
        >
          <Text
            mb="0"
            align="center"
            fontFamily="Raleway"
            color="#111"
            fontSize="2rem"
          >
            Your Files
          </Text>
        </Flex>

        <Upload deContract={deContract} contractAddress={contractAddress} />

        <Box>
          <Flex px="1rem">
            {userData.map((file, index) => {
              return (
                <Box key={index}>
                  <Popover isLazy placement="top">
                    <PopoverTrigger>
                      <Box
                        cursor="pointer"
                        m="1rem"
                        p="1rem"
                        className="file-blur"
                        align="right"
                      >
                        <Stack align="center">
                          <Image
                            src={handleSrc(file)}
                            // src={
                            //   file.fileType === "txt"
                            //     ? Docs
                            //     : file.fileType === "png" || "jpeg" || "jpg"
                            //     ? IMG
                            //     : file.fileType === "pdf"
                            //     ? PdfBg
                            //     : PdfBg
                            // }
                          ></Image>
                          {/* <img src={PdfBg} /> */}
                          <Text
                            fontFamily="Raleway"
                            color="white"
                            mb="0px"
                            fontSize="1.2rem"
                          >
                            {file && file.fileName}
                          </Text>
                          <Text
                            mt="-10px"
                            mb="0"
                            lineHeight="5px"
                            color="whiteAlpha.700"
                            fontFamily="Raleway"
                          >
                            {moment
                              .unix(file.uploadTime.toString())
                              .format("D/M/Y")}
                          </Text>
                        </Stack>
                      </Box>
                    </PopoverTrigger>
                    <PopoverContent className="blur">
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader fontFamily="Raleway">
                        Details
                      </PopoverHeader>
                      <PopoverBody fontFamily="Lato">
                        <Text>
                          Size:{" "}
                          <Text
                            align="justify"
                            color="black.800"
                            fontFamily="Raleway"
                          >
                            {file && file.fileSize.toString() / 1000} KB
                          </Text>
                        </Text>
                        <br />
                        <Text>
                          Description:{" "}
                          <Text
                            align="justify"
                            color="black.800"
                            fontFamily="Raleway"
                          >
                            {file && file.fileDescription}
                          </Text>
                        </Text>
                        <br />
                        <Text>
                          Web3.Storage Encrypted Hash:{" "}
                          <Text
                            align="justify"
                            color="black.800"
                            fontFamily="Raleway"
                          >
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`https://${file.fileHash}.ipfs.dweb.link`}
                            >
                              {file && file.fileHash}
                            </a>
                          </Text>
                        </Text>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Box>
              );
            })}
          </Flex>
        </Box>
      </Box>
    </>
  );
}
