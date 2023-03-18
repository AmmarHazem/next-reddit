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
} from "@chakra-ui/react";
import { ChangeEvent, FC, useState } from "react";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";

type CommunityType = "public" | "restricted" | "private";

const CreateCommunityModal: FC<CreateCommunityModalProps> = ({ open, onClose }) => {
  const [communityName, setCommunityName] = useState<string>("");
  const [numberOfCharactersRemaining, setNumberOfCharactersRemaining] = useState<number>(21);
  const [communityType, setCommunityType] = useState<CommunityType>("public");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 21) return;
    setCommunityName(e.target.value);
    setNumberOfCharactersRemaining(21 - e.target.value.length);
  };

  const handleCommunityTypeChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setCommunityType(e.target.name as CommunityType);
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
          <Button height="30px">Create Community</Button>
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
