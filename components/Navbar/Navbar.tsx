import { auth } from "@/firebase/clientApp";
import { Flex, Image } from "@chakra-ui/react";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Directory from "./Directory/Directory";
import RightSideContent from "./RightSideContent/RightSideContent";
import SearchInput from "./SearchInput";

const Navbar: FC = () => {
  const [user] = useAuthState(auth);

  return (
    <Flex bg="white" height="44px" padding="6px 12px" gap="16px" justifyContent={{ md: "space-between" }}>
      <Flex width={{ base: "40px", md: "auto" }} mr={{ base: 0, md: 2 }} align="center">
        <Image src="/images/redditFace.svg" alt="Reddit" height="30px" />
        <Image src="/images/redditText.svg" alt="Reddit" height="46px" display={{ base: "none", md: "unset" }} />
      </Flex>
      {user && <Directory />}
      <SearchInput />
      <RightSideContent />
    </Flex>
  );
};

export default Navbar;
