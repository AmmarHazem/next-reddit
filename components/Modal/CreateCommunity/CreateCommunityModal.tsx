import { CommunityType } from "@/atoms/communitiesAtom";
import { auth, firestore } from "@/firebase/clientApp";
import useDirectory from "@/hooks/useDirectory";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  Input,
  Stack,
  Checkbox,
  Flex,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { ChangeEvent, FC, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";

const CreateCommunityModal: FC<CreateCommunityModalProps> = ({ open, onClose }) => {
  const [communityName, setCommunityName] = useState<string>("");
  const [numberOfCharactersRemaining, setNumberOfCharactersRemaining] = useState<number>(21);
  const [communityType, setCommunityType] = useState<CommunityType>("public");
  const [error, setError] = useState<string>("");
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState<boolean>(false);
  const { toggleMenuOpen } = useDirectory();
  const toast = useToast();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 21) return;
    setCommunityName(e.target.value);
    setNumberOfCharactersRemaining(21 - e.target.value.length);
  };

  const handleCommunityTypeChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setCommunityType(e.target.name as CommunityType);
  };

  const handleCreateCommunity = async () => {
    setError("");
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(communityName) || communityName.length < 3) {
      return setError("Community names must be between 3-21 characters, and only contain letters, numbers or underscores");
    }
    setLoading(true);
    try {
      const communityDocRef = doc(firestore, "communities", communityName);
      await runTransaction(firestore, async (transaction) => {
        const communityDoc = await transaction.get(communityDocRef);
        if (communityDoc.exists()) {
          return setError(`Sorry, r/${communityName} is taken. Try again.`);
        }
        transaction.set(communityDocRef, {
          creatorID: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });
        transaction.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityName), {
          communityID: communityName,
          isModerator: true,
        });
      });
      router.push(`/r/${communityName}`);
      onClose();
      toggleMenuOpen();
    } catch (e) {
      console.log("--- handleCreateCommunity error", e);
      toast({ status: "error", title: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader display="flex" flexDir="column" fontSize={15} padding={3}>
          Create a community
        </ModalHeader>
        <Box pl={3} pr={3}>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" padding="10px 0px">
            <Text>Name</Text>
            <Text fontSize={11} color="gray.500">
              Community names including capitalization connot be changed
            </Text>
            <Text position="relative" top="28px" left="10px" width="20px" color="gray.400">
              r/
            </Text>
            <Input position="relative" value={communityName} size="sm" pl="22px" onChange={handleChange} />
            <Text fontSize="11px" color={numberOfCharactersRemaining > 0 ? "gray.500" : "red"}>
              {numberOfCharactersRemaining} characters remaining
            </Text>
            <Text fontSize="9pt" color="red" pt="1">
              {error}
            </Text>
            <Box mb={4} mt={4}>
              <Text fontWeight={600} fontSize={15}>
                Community type
              </Text>
              <Stack spacing={2}>
                <Checkbox name="public" isChecked={communityType === "public"} onChange={handleCommunityTypeChanged}>
                  <Flex align="center">
                    <Icon as={BsFillPersonFill} color="gray.500" mr="2" />
                    <Text fontSize="10pt" mr={1}>
                      Public
                    </Text>
                    <Text fontSize="8pt" color="gray.500">
                      Anyone can view, post and comment to this community
                    </Text>
                  </Flex>
                </Checkbox>
                <Checkbox name="restricted" isChecked={communityType === "restricted"} onChange={handleCommunityTypeChanged}>
                  <Flex align="center">
                    <Icon as={BsFillEyeFill} color="gray.500" mr="2" />
                    <Text fontSize="10pt" mr={1}>
                      Restricted
                    </Text>
                    <Text fontSize="8pt" color="gray.500">
                      Anyone can view this community , but only approved users can post.
                    </Text>
                  </Flex>
                </Checkbox>
                <Checkbox name="private" isChecked={communityType === "private"} onChange={handleCommunityTypeChanged}>
                  <Flex align="center">
                    <Icon as={HiLockClosed} color="gray.500" mr="2" />
                    <Text fontSize="10pt" mr={1}>
                      Private
                    </Text>
                    <Text fontSize="8pt" color="gray.500">
                      Only approved userss can view and submit to this community.
                    </Text>
                  </Flex>
                </Checkbox>
              </Stack>
            </Box>
          </ModalBody>
        </Box>
        <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
          <Button variant="outline" height="30px" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button isLoading={loading} onClick={handleCreateCommunity} height="30px">
            Create Community
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface CreateCommunityModalProps {
  open: boolean;
  onClose: () => void;
}

export default CreateCommunityModal;
