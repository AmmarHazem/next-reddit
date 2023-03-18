import LogoutConfirmationModal from "@/components/Modal/Auth/LogoutConfirmationModal";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Text, Flex, Icon, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { FC } from "react";
import { TiHome } from "react-icons/ti";
import Communities from "./Communities";

const Directory: FC = () => {
  return (
    <>
      <Menu>
        <MenuButton
          mr={2}
          ml={{ base: 0, md: 2 }}
          padding="0px 6px"
          borderRadius={4}
          _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
        >
          <Flex
            width={{ base: "auto", lg: "100px" }}
            justifyContent="space-between"
            gap={{ base: "4px", md: "8px" }}
            align="center"
          >
            <Icon fontSize={24} as={TiHome} />
            <Flex display={{ base: "none", lg: "flex" }}>
              <Text fontWeight={600} fontSize="10pt">
                Home
              </Text>
            </Flex>
            <ChevronDownIcon />
          </Flex>
        </MenuButton>
        <MenuList>
          <Communities />
        </MenuList>
      </Menu>
      <LogoutConfirmationModal />
    </>
  );
};

export default Directory;
