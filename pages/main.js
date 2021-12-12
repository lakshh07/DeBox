import React, { useState, useRef } from "react";
// import { Link } from "react-router-dom";
import router from "next/router";
import {
  Box,
  Stack,
  Heading,
  Flex,
  Text,
  Button,
  useToast,
} from "@chakra-ui/react";
import { Player } from "@lottiefiles/react-lottie-player";
import herobg from "./assets/hero-bg.json";
import { ethers } from "ethers";
import client from "../utils/utils";

function Hero() {
  const toast = useToast();
  const [account, setAccount] = useState("0x00000");
  const [profile, setProfile] = useState({});
  const [localDid, setDid] = useState(null);
  const [idxInstance, setIdxInstance] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const idxRef = useRef(null);
  const didRef = useRef(null);
  idxRef.current = idxInstance;
  didRef.current = localDid;

  let eth, localProfile;

  async function logIn() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: process.env.WALLET_CONNECT_ID, // required
        },
      },
    };
    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });

    const provider = await web3Modal.connect();

    provider.on("accountsChanged", (accounts) => {
      console.log(accounts);
    });
    provider.on("connect", (info) => {
      console.log(info);
    });

    eth = new ethers.providers.Web3Provider(provider);
    const signer = eth.getSigner();
    const signerAddress = await signer.getAddress();
    setAccount(signerAddress);
  }

  async function connect() {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(account);

    toast({
      title: "Please Wait!",
      description: "Fetching your profile",
      status: "info",
      position: "top",
      duration: 9000,
      isClosable: true,
    });
    const cdata = await client();
    const { did, idx, error } = cdata;
    if (error) {
      console.log("error: ", error);
      return;
    }

    setDid(did);
    setIdxInstance(idx);
    console.log(idx);
    const data = await idx.get("basicProfile", did.id);
    if (data) {
      setProfile(data);
      setLoaded(true);
      console.log(data);
      let userName = data.name;
      let userBio = data.bio;
      console.log(userName);
      console.log(userBio);
      localProfile = data;
      router.push({
        pathname: "./dashboard",
        query: {
          profileName: userName,
          profileBio: userBio,
          account: account,
        },
      });
    } else if (!data) {
      await idx.set("basicProfile", { name: "Anonymous", bio: "😈" });
      const dataa = await idxRef.current.get("basicProfile", didRef.current.id);
      setProfile(dataa);
      setLoaded(true);
    } else {
      toast({
        title: "Error",
        description: "Not able to fetch your data, Try Again!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.log("Not able to fetch your data, Try Again!");
    }
  }

  async function updateProfile(bio, name, setChecker) {
    if (!bio && !name) {
      alert("error... no profile information submitted");
      return;
    }
    setChecker(true);
    if (!idxInstance) {
      await connect();
    }
    const user = { ...profile };
    if (bio) user.bio = bio;
    if (name) user.name = name;
    await idxRef.current.set("basicProfile", user);
    setLocalProfileData();
    console.log("profile updated...");
    setChecker(false);
  }

  async function setLocalProfileData() {
    try {
      const data = await idxRef.current.get("basicProfile", didRef.current.id);
      if (!data) return;
      setProfile(data);
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <Box>
      <Flex h="100vh" justifyContent="space-around" alignItems="center">
        <Stack spacing="8rem">
          <Heading className="heading" fontFamily="Pacifico" mt="-30%">
            DeBox
          </Heading>

          <Box>
            <Heading
              color="black"
              fontFamily="Philosopher"
              className="hero-heading"
            >
              Take your files <br /> everywhere, <span>safe</span>
            </Heading>
            <Text
              mt="1.5rem"
              fontFamily="Philosopher"
              fontSize="2rem"
              lineHeight="40px"
            >
              An user-friendly, decentralized <br />
              Secured cloud storage
            </Text>
            <Button mt="2rem" onClick={connect} className="btn">
              Get Started
            </Button>
          </Box>
        </Stack>
        <Box className="hero-blur" h="90vh" w="450px" rounded="lg">
          <Player
            src={herobg}
            className="player"
            background="transparent"
            loading="lazy"
            speed="1"
            loop
            muted
            autoplay
          />
        </Box>
      </Flex>
    </Box>
  );
}

export default Hero;
