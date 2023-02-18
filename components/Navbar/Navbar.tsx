import { Flex, Image } from "@chakra-ui/react";
import { FC } from "react";
import RightSideContent from "./RightSideContent/RightSideContent";
import SearchInput from "./SearchInput";

const Navbar: FC = () => {
  return (
    <Flex bg="white" height="44px" padding="6px 12px" gap="16px">
      <Flex align="center">
        <Image src="/images/redditFace.svg" alt="Reddit" height="30px" />
        <Image src="/images/redditText.svg" alt="Reddit" height="46px" display={{ base: "none", md: "unset" }} />
      </Flex>
      {/* <Directory /> */}
      <SearchInput />
      <RightSideContent />
    </Flex>
  );
};

export default Navbar;
