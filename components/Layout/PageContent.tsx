import { pageContentMaxWidth } from "@/constants";
import { Flex } from "@chakra-ui/react";
import { FC } from "react";

const PageContent: FC<PageContentProps> = ({ children }) => {
  return (
    <Flex padding="16px 0px">
      <Flex maxW={pageContentMaxWidth} mr="auto" ml="auto" width="100%" gap="16px">
        <Flex width={{ base: "100%", md: "65%" }} direction="column" padding="0px 16px">
          {children[0]}
        </Flex>
        <Flex direction="column" display={{ base: "none", md: "flex" }} flex="auto" padding="0px 16px">
          {children[1]}
        </Flex>
      </Flex>
    </Flex>
  );
};

interface PageContentProps {
  children: JSX.Element[];
}

export default PageContent;
