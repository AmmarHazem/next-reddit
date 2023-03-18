import { FC } from "react";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Flex, Icon } from "@chakra-ui/react";
import { BsArrowUpRightCircle, BsChatDots } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import { IoFilterCircleOutline, IoNotificationsOutline, IoVideocamOutline } from "react-icons/io5";

const IconButtons: FC<IconButtonsProps> = () => {
  return (
    <Flex gap="8px">
      <Flex display={{ base: "none", md: "flex" }} gap="8px" align="center">
        <Flex padding={1} cursor="pointer" borderRadius={4} _hover={{ bg: "gray.200" }}>
          <Icon as={BsArrowUpRightCircle} fontSize={20} />
        </Flex>
        <Flex padding={1} cursor="pointer" borderRadius={4} _hover={{ bg: "gray.200" }}>
          <Icon as={IoFilterCircleOutline} fontSize={22} />
        </Flex>
        <Flex padding={1} cursor="pointer" fontSize={22} borderRadius={4} _hover={{ bg: "gray.200" }}>
          <Icon as={IoVideocamOutline} />
        </Flex>
      </Flex>
      <Flex style={{ height: "100%", width: "1px" }} backgroundColor="gray.200" />
      <Flex gap="8px">
        <Flex padding={1} cursor="pointer" fontSize={20} borderRadius={4} _hover={{ bg: "gray.200" }}>
          <Icon as={BsChatDots} />
        </Flex>
        <Flex padding={1} cursor="pointer" fontSize={20} borderRadius={4} _hover={{ bg: "gray.200" }}>
          <Icon as={IoNotificationsOutline} />
        </Flex>
        <Flex
          display={{ base: "none", md: "flex" }}
          padding={1}
          cursor="pointer"
          fontSize={20}
          borderRadius={4}
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={GrAdd} />
        </Flex>
      </Flex>
    </Flex>
  );
};

interface IconButtonsProps {}

export default IconButtons;
