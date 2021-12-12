import React, { useState, useRef } from "react";
import {
  Flex,
  Text,
  chakra,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  useColorModeValue,
  Textarea,
  Spinner,
  Progress,
} from "@chakra-ui/react";
import { Router, useRouter } from "next/router";
import client from "../utils/utils";

function AccountSetting({
  isOpen,
  onClose,
  profileName,
  profileBio,
  userData,
}) {
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [checker, setChecker] = useState(false);
  const [localDid, setDid] = useState(null);
  const [idxInstance, setIdxInstance] = useState(null);
  const idxRef = useRef(null);
  const didRef = useRef(null);
  idxRef.current = idxInstance;
  didRef.current = localDid;

  async function connect() {
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
      console.log(data);
      let userName = data.name;
      let userBio = data.bio;
      console.log(userName);
      console.log(userBio);
    } else if (!data) {
      await idx.set("basicProfile", { name: "Anonymous", bio: "😈" });
      const dataa = await idxRef.current.get("basicProfile", didRef.current.id);
    } else {
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
    const user = { name: name, bio: bio };
    // if (bio) user.bio = bio;
    // if (name) user.name = name;
    await idxRef.current.set("basicProfile", user);
    setLocalProfileData();
    console.log("profile updated...");
    alert("Profile Updated !👍");
    setChecker(false);
  }

  async function setLocalProfileData() {
    try {
      const data = await idxRef.current.get("basicProfile", didRef.current.id);
      if (!data) return;
      console.log(data, "ff");
      Router.push({ path: "./dashboard", query: data });
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <>
      <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="Raleway">Setting</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs variant="soft-rounded" colorScheme="purple">
              <TabList>
                <Tab>Profile</Tab>
                <Tab cursor="not-allowed" isDisabled>
                  Subscription
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box>
                    <chakra.form
                      // method="POST"
                      shadow="base"
                      rounded={[null, "md"]}
                      overflow={{ sm: "hidden" }}
                    >
                      <Stack
                        px={3}
                        py={5}
                        bg={useColorModeValue("white", "gray.700")}
                        spacing={6}
                        p={{ sm: 6 }}
                      >
                        <FormControl>
                          <Flex justifyContent="space-between">
                            <FormLabel
                              fontSize="md"
                              fontFamily="Inter"
                              fontWeight="md"
                              color={useColorModeValue("gray.700", "gray.50")}
                            >
                              Your Tier :
                            </FormLabel>
                            <FormLabel
                              fontSize="md"
                              fontFamily="Inter"
                              fontWeight="md"
                              color={useColorModeValue("gray.500", "gray.50")}
                            >
                              Free
                            </FormLabel>
                          </Flex>
                        </FormControl>
                        <FormControl>
                          <Flex justifyContent="space-between">
                            <FormLabel
                              fontSize="md"
                              fontFamily="Inter"
                              fontWeight="md"
                              color={useColorModeValue("gray.700", "gray.50")}
                            >
                              Your Score
                            </FormLabel>
                            <FormLabel
                              fontSize="sm"
                              fontFamily="Inter"
                              fontWeight="md"
                              color={useColorModeValue("gray.500", "gray.50")}
                            >
                              ({userData.length * 0.25} Point)
                            </FormLabel>
                          </Flex>
                          <Progress
                            className="progressbar"
                            value={5}
                            rounded="10px"
                            size="xs"
                            max="50"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel
                            fontSize="md"
                            fontFamily="Inter"
                            fontWeight="md"
                            color={useColorModeValue("gray.700", "gray.50")}
                          >
                            Name
                          </FormLabel>
                          <InputGroup size="sm">
                            <Input
                              fontFamily="Inter"
                              type="text"
                              placeholder={profileName}
                              focusBorderColor="gray.700"
                              rounded="md"
                              onChange={(e) => setName(e.target.value)}
                              value={name}
                            />
                          </InputGroup>
                        </FormControl>
                        <FormControl>
                          <FormLabel
                            fontSize="md"
                            fontFamily="Inter"
                            fontWeight="md"
                            color={useColorModeValue("gray.700", "gray.50")}
                          >
                            Bio
                          </FormLabel>
                          <InputGroup size="sm">
                            <Textarea
                              fontFamily="Inter"
                              type="text"
                              placeholder={profileBio}
                              focusBorderColor="gray.700"
                              rounded="md"
                              onChange={(e) => setBio(e.target.value)}
                              value={bio}
                            />
                          </InputGroup>
                        </FormControl>
                      </Stack>
                    </chakra.form>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <p>two!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn"
              onClick={() => {
                !bio && setBio(profileBio);
                !name && setName(profileName);
                updateProfile(bio, name, setChecker);
              }}
            >
              {checker && <Spinner mr={4} />}
              {checker ? "Saving.." : "Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AccountSetting;
