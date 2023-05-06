import React from "react";
import useDirectory from "@/hooks/useDirectory";
import { Flex, Icon, Input, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BsLink45Deg } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { useSetRecoilState } from "recoil";
import { authModalStateAtom } from "@/atoms/authModalAtom";
// import useDirectory from "../../hooks/useDirectory";

type CreatePostProps = {};

const CreatePostLink: React.FC<CreatePostProps> = () => {
  const router = useRouter();
  const [user, loadingAuthState] = useAuthState(auth);
  const { toggleMenuOpen } = useDirectory();
  const authModalState = useSetRecoilState(authModalStateAtom);

  const onClick = () => {
    if (loadingAuthState) return;
    if (!user?.uid) {
      return authModalState((value) => ({ ...value, open: true }));
    }
    const { communityName } = router.query;
    if (communityName) {
      router.push(`/r/${communityName}/submit`);
    } else {
      toggleMenuOpen();
    }
    // Open directory menu to select community to post to
    // toggleMenuOpen();
  };

  return (
    <Flex
      justify="space-evenly"
      align="center"
      bg="white"
      height="56px"
      borderRadius={4}
      border="1px solid"
      borderColor="gray.300"
      p={2}
      mb={4}
    >
      {loadingAuthState && (
        <div style={{ width: "50px", height: "50px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spinner />
        </div>
      )}
      <Icon as={FaReddit} fontSize={36} color="gray.300" mr={4} />
      <Input
        placeholder="Create Post"
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
        borderColor="gray.200"
        height="36px"
        borderRadius={4}
        mr={4}
        onClick={onClick}
      />
      <Icon as={IoImageOutline} fontSize={24} mr={4} color="gray.400" cursor="pointer" />
      <Icon as={BsLink45Deg} fontSize={24} color="gray.400" cursor="pointer" />
    </Flex>
  );
};

export default CreatePostLink;
