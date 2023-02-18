import AuthModal from "@/components/Modal/Auth/AuthModal";
import { Flex } from "@chakra-ui/react";
import { FC } from "react";
import AuthButtons from "./AuthButtons";

const RightSideContent: FC<RightSideContentProps> = () => {
  return (
    <>
      <Flex justifyContent="center" alignItems="center">
        <AuthButtons />
      </Flex>
      <AuthModal />
    </>
  );
};

interface RightSideContentProps {}

export default RightSideContent;
